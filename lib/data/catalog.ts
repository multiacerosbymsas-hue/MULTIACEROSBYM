import catalogData from "./catalog.json";

export type CatalogProduct = {
  code: string;
  name: string;
  slug: string;
  price: number | null;
  weightKg: number | null;
  section: string;
  family: string;
};

export type CatalogFamily = {
  slug: string;
  name: string;
  image: string;
  count: number;
};

export type CatalogSection = { name: string; family: string; count: number };
export type CatalogPhrase = { text: string; section: string | null };

/** Una variante = una fila del Excel (un calibre / medida con su precio). */
export type Variant = {
  code: string;
  name: string;
  slug: string;
  price: number | null;
  weightKg: number | null;
};

/** Una referencia = una sección agrupada (1 ítem con muchas variantes). */
export type Reference = {
  slug: string;
  name: string;
  section: string;
  family: string;
  image: string;
  count: number;
  priceMin: number | null;
  priceMax: number | null;
  variants: Variant[];
};

type Data = {
  generatedAt: string;
  source: string;
  totals: { products: number; withPrice: number; sections: number };
  families: CatalogFamily[];
  sections: CatalogSection[];
  products: CatalogProduct[];
  phrases?: CatalogPhrase[];
};

const data = catalogData as Data;

export const catalogTotals = data.totals;
export const catalogFamilies = data.families;
export const allProducts = data.products;
/** Frases del Excel conservadas en los datos (no se muestran en el sitio). */
export const catalogPhrases = data.phrases ?? [];

export const getFamily = (slug: string) =>
  data.families.find((f) => f.slug === slug);

export const familyImage = (slug: string) =>
  getFamily(slug)?.image ?? "/images/logo-full.jpg";

export const familyName = (slug: string) => getFamily(slug)?.name ?? slug;

export const productsByFamily = (slug: string) =>
  data.products.filter((p) => p.family === slug);

export const sectionsByFamily = (slug: string) =>
  data.sections
    .filter((s) => s.family === slug)
    .sort((a, b) => b.count - a.count);

export const getProduct = (slug: string) =>
  data.products.find((p) => p.slug === slug);

export const relatedProducts = (p: CatalogProduct, n = 4) =>
  data.products
    .filter((x) => x.section === p.section && x.slug !== p.slug)
    .slice(0, n);

/* ===================================================================
   Referencias: agrupan cada sección en UN ítem con variantes.
   Ej.: "Varilla Corrugada" -> 11 calibres seleccionables con su precio.
   =================================================================== */

const CONNECTORS = new Set([
  "DE", "Y", "LA", "EL", "DEL", "PARA", "CON", "POR", "EN", "A",
]);

function slugifySection(s: string): string {
  const out = s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
  return out || "ref";
}

/** Limpia y capitaliza el nombre de una sección para mostrarlo. */
export function tidyName(s: string): string {
  const cleaned = s
    .replace(/\s*\(\d+\)\s*$/, "")
    .replace(/\s*\d+\s*%\s*$/, "")
    .trim();
  return cleaned
    .split(/\s+/)
    .map((w, i) => {
      const u = w.toUpperCase();
      if (i > 0 && CONNECTORS.has(u)) return w.toLowerCase();
      // Conserva acrónimos cortos (PVC, IPE, CR…) y tokens con dígitos (C18, 1/2).
      if ((w.length <= 4 && w === u && /[A-Z]/.test(w)) || /\d/.test(w)) return w;
      return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
    })
    .join(" ");
}

function buildReferences(): Reference[] {
  const order: string[] = [];
  const groups = new Map<string, CatalogProduct[]>();
  for (const p of data.products) {
    const g = groups.get(p.section);
    if (g) {
      g.push(p);
    } else {
      groups.set(p.section, [p]);
      order.push(p.section);
    }
  }

  const used = new Set<string>();
  return order.map((section) => {
    const items = groups.get(section)!;
    let slug = slugifySection(section);
    while (used.has(slug)) slug += "-x";
    used.add(slug);

    const prices = items
      .map((i) => i.price)
      .filter((x): x is number => x != null);

    return {
      slug,
      name: tidyName(section),
      section,
      family: items[0].family,
      image: familyImage(items[0].family),
      count: items.length,
      priceMin: prices.length ? Math.min(...prices) : null,
      priceMax: prices.length ? Math.max(...prices) : null,
      variants: items.map((i) => ({
        code: i.code,
        name: i.name,
        slug: i.slug,
        price: i.price,
        weightKg: i.weightKg,
      })),
    };
  });
}

export const references: Reference[] = buildReferences();

export const referencesByFamily = (family: string) =>
  references.filter((r) => r.family === family);

export const getReference = (slug: string) =>
  references.find((r) => r.slug === slug);
