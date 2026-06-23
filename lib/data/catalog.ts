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

type Data = {
  generatedAt: string;
  source: string;
  totals: { products: number; withPrice: number; sections: number };
  families: CatalogFamily[];
  sections: CatalogSection[];
  products: CatalogProduct[];
};

const data = catalogData as Data;

export const catalogTotals = data.totals;
export const catalogFamilies = data.families;
export const allProducts = data.products;

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
