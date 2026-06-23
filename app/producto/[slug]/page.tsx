import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Package, Weight, Tag, ShieldCheck, Truck } from "lucide-react";
import {
  allProducts,
  getProduct,
  getFamily,
  familyImage,
  relatedProducts,
} from "@/lib/data/catalog";
import { formatCOP } from "@/lib/utils/format";
import { BuyBox } from "@/components/products/BuyBox";
import { CatalogCard } from "@/components/products/CatalogCard";

export const dynamicParams = true;

// Pre-renderizamos una muestra; el resto se genera bajo demanda (y se cachea).
export function generateStaticParams() {
  return allProducts.slice(0, 24).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = getProduct(slug);
  return {
    title: p ? p.name : "Producto",
    description: p
      ? `${p.name} (cód. ${p.code}) — ${p.section}. Disponible en MultiAceros B&M, Bucaramanga.`
      : undefined,
  };
}

export default async function ProductoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = getProduct(slug);
  if (!p) notFound();

  const fam = getFamily(p.family);
  const img = familyImage(p.family);
  const unit = p.weightKg ? `${p.weightKg} kg` : "unidad";
  const related = relatedProducts(p);

  return (
    <>
      <section className="container-x py-8 lg:py-12">
        <nav className="mb-6 text-sm text-muted">
          <Link href="/" className="hover:text-brand">
            Inicio
          </Link>{" "}
          /{" "}
          <Link href="/catalogo" className="hover:text-brand">
            Catálogo
          </Link>{" "}
          /{" "}
          <Link href={`/categoria/${p.family}`} className="hover:text-brand">
            {fam?.name}
          </Link>
        </nav>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Imagen */}
          <div className="relative aspect-square overflow-hidden rounded-[var(--radius-card)] border border-line bg-paper">
            <Image
              src={img}
              alt={p.name}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
              priority
            />
            <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-ink shadow-sm">
              {fam?.name}
            </span>
          </div>

          {/* Información */}
          <div className="flex flex-col">
            <p className="text-sm font-semibold uppercase tracking-wide text-brand">
              {p.section}
            </p>
            <h1 className="mt-1 font-display text-2xl font-bold leading-tight text-ink sm:text-3xl">
              {p.name}
            </h1>

            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm text-muted">
              <span className="flex items-center gap-1.5">
                <Tag size={15} className="text-brand" /> Código {p.code}
              </span>
              {p.weightKg && (
                <span className="flex items-center gap-1.5">
                  <Weight size={15} className="text-brand" /> {p.weightKg} kg
                </span>
              )}
            </div>

            <div className="my-6 h-px bg-line" />

            {p.price ? (
              <div>
                <span className="font-display text-4xl font-bold text-ink">
                  {formatCOP(p.price)}
                </span>
                <span className="ml-2 text-sm text-muted">/ {unit}</span>
              </div>
            ) : (
              <p className="font-display text-2xl font-bold text-brand">
                Precio bajo cotización
              </p>
            )}

            <div className="mt-6">
              <BuyBox
                id={p.slug}
                name={p.name}
                price={p.price}
                image={img}
                unit={unit}
              />
            </div>

            <ul className="mt-7 grid gap-2.5 border-t border-line pt-6 text-sm text-ink/80">
              <li className="flex items-center gap-2.5">
                <ShieldCheck size={18} className="text-brand" /> Material
                certificado y garantizado
              </li>
              <li className="flex items-center gap-2.5">
                <Truck size={18} className="text-brand" /> Despacho en el área
                metropolitana de Bucaramanga
              </li>
              <li className="flex items-center gap-2.5">
                <Package size={18} className="text-brand" /> Venta por unidad,
                caja o mayor
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Relacionados */}
      {related.length > 0 && (
        <section className="bg-paper py-14">
          <div className="container-x">
            <h2 className="mb-6 font-display text-xl font-bold text-ink">
              También en {p.section.toLowerCase()}
            </h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {related.map((r) => (
                <CatalogCard key={r.slug} p={r} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
