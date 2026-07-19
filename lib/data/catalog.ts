/**
 * Helpers PUROS del catálogo (sin acceso a datos): tipos, metadatos de
 * familia y agrupación de referencias. Importable desde cliente y servidor.
 * La carga de datos (Supabase) está en `catalog.server.ts`.
 */
import { categories } from "./categories";
import { sectionImage } from "./section-images";

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

/** Una variante = una fila (un calibre / medida con su precio). */
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

// ---------------- Familias (metadatos estáticos) ----------------
const FAMILY_BY_SLUG = new Map(categories.map((c) => [c.slug, c]));
export const familySlugs = categories.map((c) => c.slug);

export const familyImage = (slug: string) =>
  FAMILY_BY_SLUG.get(slug)?.image ?? "/images/logo-full.jpg";

export const familyName = (slug: string) =>
  FAMILY_BY_SLUG.get(slug)?.name ?? slug;

export const getFamily = (slug: string) => {
  const c = FAMILY_BY_SLUG.get(slug);
  return c ? { slug: c.slug, name: c.name, image: c.image } : undefined;
};

// ---------------- Agrupación en referencias ----------------
const CONNECTORS = new Set([
  "DE", "Y", "LA", "EL", "DEL", "PARA", "CON", "POR", "EN", "A",
]);

export function slugify(s: string): string {
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
      if ((w.length <= 4 && w === u && /[A-Z]/.test(w)) || /\d/.test(w)) return w;
      return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
    })
    .join(" ");
}

/** Agrupa productos por sección en referencias (1 ítem con variantes). */
export function buildReferences(products: CatalogProduct[]): Reference[] {
  const order: string[] = [];
  const groups = new Map<string, CatalogProduct[]>();
  for (const p of products) {
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
    let slug = slugify(section);
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
      image: sectionImage(section) ?? familyImage(items[0].family),
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
