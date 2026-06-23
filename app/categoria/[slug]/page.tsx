import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  catalogFamilies,
  getFamily,
  productsByFamily,
} from "@/lib/data/catalog";
import { categories } from "@/lib/data/categories";
import { ProductBrowser } from "@/components/products/ProductBrowser";

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
      <section className="relative overflow-hidden border-b border-line bg-ink text-white">
        <Image
          src={fam.image}
          alt={fam.name}
          fill
          sizes="100vw"
          className="object-cover opacity-25"
          priority
        />
        <div className="container-x relative py-14 lg:py-20">
          <nav className="text-sm text-white/60">
            <Link href="/" className="hover:text-brand">
              Inicio
            </Link>{" "}
            /{" "}
            <Link href="/catalogo" className="hover:text-brand">
              Catálogo
            </Link>{" "}
            / <span className="text-white">{fam.name}</span>
          </nav>
          <h1 className="mt-3 max-w-2xl font-display text-3xl font-bold tracking-tight sm:text-4xl">
            {fam.name}
          </h1>
          {info && <p className="mt-2 max-w-xl text-white/70">{info.blurb}</p>}
          <p className="mt-4 inline-flex rounded-full bg-brand px-3 py-1 text-sm font-semibold">
            {fam.count} referencias
          </p>
        </div>
      </section>

      <section className="container-x py-12">
        <ProductBrowser products={products} />
      </section>
    </>
  );
}
