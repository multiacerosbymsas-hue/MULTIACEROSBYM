import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import {
  allProducts,
  catalogFamilies,
  catalogTotals,
} from "@/lib/data/catalog";
import { categories } from "@/lib/data/categories";
import { CatalogSearch } from "@/components/products/CatalogSearch";

export const metadata: Metadata = {
  title: "Catálogo",
  description: `Explora nuestro catálogo de ${catalogTotals.products}+ referencias en acero, cubiertas, obra gris y ferretería. Precios y cotización en línea.`,
};

const blurbOf = (slug: string) =>
  categories.find((c) => c.slug === slug)?.blurb ?? "";

export default function CatalogoPage() {
  return (
    <>
      {/* Encabezado */}
      <section className="relative overflow-hidden border-b border-line bg-paper">
        <div className="bg-grid absolute inset-0 opacity-60" aria-hidden />
        <div className="container-x relative py-12 lg:py-16">
          <nav className="text-sm text-muted">
            <Link href="/" className="hover:text-brand">
              Inicio
            </Link>{" "}
            / <span className="text-ink">Catálogo</span>
          </nav>
          <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Catálogo de productos
          </h1>
          <p className="mt-2 max-w-xl text-muted">
            {catalogTotals.products.toLocaleString("es-CO")} referencias en{" "}
            {catalogTotals.sections} líneas de acero, cubiertas, obra gris y
            ferretería.
          </p>
        </div>
      </section>

      {/* Familias */}
      <section className="container-x py-12">
        <h2 className="mb-6 font-display text-xl font-bold text-ink">
          Explora por familia
        </h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {catalogFamilies.map((f) => (
            <Link
              key={f.slug}
              href={`/categoria/${f.slug}`}
              className="group relative flex flex-col overflow-hidden rounded-[var(--radius-card)] border border-line bg-white shadow-[var(--shadow-soft)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-card)]"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={f.image}
                  alt={f.name}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/70 to-transparent" />
                <span className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-ink opacity-0 transition-opacity group-hover:opacity-100">
                  <ArrowUpRight size={16} />
                </span>
                <div className="absolute bottom-3 left-4 right-4">
                  <h3 className="font-display text-base font-bold text-white">
                    {f.name}
                  </h3>
                  <p className="text-xs text-white/80">{f.count} referencias</p>
                </div>
              </div>
              <p className="p-3 text-xs text-muted">{blurbOf(f.slug)}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Buscador global */}
      <section className="container-x pb-20">
        <h2 className="mb-6 font-display text-xl font-bold text-ink">
          Buscar en todo el catálogo
        </h2>
        <CatalogSearch products={allProducts} />
      </section>
    </>
  );
}
