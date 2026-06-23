import Link from "next/link";
import type { Metadata } from "next";
import { allProducts, catalogTotals } from "@/lib/data/catalog";
import { CatalogBrowser } from "@/components/products/CatalogBrowser";

export const metadata: Metadata = {
  title: "Catálogo",
  description: `Explora ${catalogTotals.products}+ referencias en acero, cubiertas, obra gris y ferretería. Filtra por familia, sección y precio.`,
};

export default function CatalogoPage() {
  return (
    <>
      <section className="border-b border-line bg-blueprint">
        <div className="container-x py-12 lg:py-14">
          <nav className="font-mono text-xs text-muted">
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
            {catalogTotals.sections} líneas. Filtra por familia, sección o busca
            por nombre o código.
          </p>
        </div>
      </section>

      <section className="container-x py-10">
        <CatalogBrowser products={allProducts} />
      </section>
    </>
  );
}
