import "server-only";
import { cache } from "react";
import { supabasePublic } from "@/lib/supabase/public";
import { categories } from "./categories";
import { getFamilyImages } from "./content.server";
import {
  buildReferences,
  type CatalogProduct,
  type CatalogFamily,
} from "./catalog";

const COLS = "code,name,slug,price,weight_kg,section,family";

type Row = {
  code: string;
  name: string;
  slug: string;
  price: number | null;
  weight_kg: number | null;
  section: string;
  family: string;
};

const toProduct = (p: Row): CatalogProduct => ({
  code: p.code,
  name: p.name,
  slug: p.slug,
  price: p.price,
  weightKg: p.weight_kg,
  section: p.section,
  family: p.family,
});

/**
 * Carga TODOS los productos activos (deduplicado por request con cache()).
 * Pagina de a 1000 porque PostgREST limita las filas por consulta.
 */
const loadProducts = cache(async (): Promise<CatalogProduct[]> => {
  const all: CatalogProduct[] = [];
  const PAGE = 1000;
  for (let from = 0; ; from += PAGE) {
    const { data, error } = await supabasePublic
      .from("products")
      .select(COLS)
      .eq("active", true)
      .order("sort", { ascending: true })
      .range(from, from + PAGE - 1);
    if (error) throw new Error("Supabase products: " + error.message);
    const rows = (data ?? []).map((p) => toProduct(p as Row));
    all.push(...rows);
    if (rows.length < PAGE) break;
  }
  return all;
});

/** Catálogo completo derivado (productos, referencias, familias, totales). */
export const getCatalog = cache(async () => {
  const products = await loadProducts();
  const references = buildReferences(products);

  const counts = new Map<string, number>();
  for (const p of products) counts.set(p.family, (counts.get(p.family) ?? 0) + 1);

  // Foto por familia: la subida desde /admin/familias tiene prioridad.
  const familyImages = await getFamilyImages();

  const families: CatalogFamily[] = categories.map((c) => ({
    slug: c.slug,
    name: c.name,
    image: familyImages[c.slug] || c.image,
    count: counts.get(c.slug) ?? 0,
  }));

  const totals = {
    products: products.length,
    withPrice: products.filter((p) => p.price != null).length,
    sections: new Set(products.map((p) => p.section)).size,
  };

  return { products, references, families, totals };
});

export async function getReference(slug: string) {
  const { references } = await getCatalog();
  return references.find((r) => r.slug === slug);
}

export async function referencesByFamily(family: string) {
  const { references } = await getCatalog();
  return references.filter((r) => r.family === family);
}

// ---- Consultas dirigidas (páginas de producto on-demand) ----
export async function getProductBySlug(slug: string): Promise<CatalogProduct | null> {
  const { data } = await supabasePublic
    .from("products")
    .select(COLS)
    .eq("slug", slug)
    .maybeSingle();
  return data ? toProduct(data as Row) : null;
}

export async function relatedBySection(
  section: string,
  excludeSlug: string,
  n = 4
): Promise<CatalogProduct[]> {
  const { data } = await supabasePublic
    .from("products")
    .select(COLS)
    .eq("active", true)
    .eq("section", section)
    .neq("slug", excludeSlug)
    .limit(n);
  return (data ?? []).map((p) => toProduct(p as Row));
}

export async function someProductSlugs(n = 24): Promise<string[]> {
  const { data } = await supabasePublic
    .from("products")
    .select("slug")
    .eq("active", true)
    .order("sort", { ascending: true })
    .limit(n);
  return (data ?? []).map((p) => p.slug as string);
}
