import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  catalogFamilies,
  getFamily,
  productsByFamily,
} from "@/lib/data/catalog";
import { categories } from "@/lib/data/categories";
import { CatalogBrowser } from "@/components/products/CatalogBrowser";

export function generateStaticParams() {
  return catalogFamilies.map((f) => ({ slug: f.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const fam = getFamily(slug);
  return {
    title: fam ? fam.name : "Categoría",
    description: fam
      ? `${fam.count} referencias de ${fam.name.toLowerCase()} en MultiAceros B&M.`
      : undefined,
  };
}

export default async function CategoriaPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const fam = getFamily(slug);
  if (!fam) notFound();

  const products = productsByFamily(slug);
  const info = categories.find((c) => c.slug === slug);

  return (
    <>
      <section className="relative overflow-hidden border-b border-line bg-blueprint">
        <div className="container-x relative py-12 lg:py-16">
          <nav className="font-mono text-xs text-muted">
            <Link href="/" className="hover:text-brand">
              Inicio
            </Link>{" "}
            /{" "}
            <Link href="/catalogo" className="hover:text-brand">
              Catálogo
            </Link>{" "}
            / <span className="text-ink">{fam.name}</span>
          </nav>
          <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
                {fam.name}
              </h1>
              {info && <p className="mt-2 max-w-xl text-muted">{info.blurb}</p>}
            </div>
            <span className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-3.5 py-1.5 font-mono text-xs font-semibold text-ink">
              <span className="text-brand">◆</span> {fam.count} referencias
            </span>
          </div>
        </div>
      </section>

      <section className="container-x py-12">
        <CatalogBrowser products={products} lockedFamily={slug} />
      </section>
    </>
  );
}
