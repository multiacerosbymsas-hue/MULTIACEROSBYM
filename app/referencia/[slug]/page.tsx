import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Layers, ShieldCheck, Truck, Package } from "lucide-react";
import {
  references,
  getReference,
  getFamily,
  referencesByFamily,
} from "@/lib/data/catalog";
import { formatCOP } from "@/lib/utils/format";
import { VariantSelector } from "@/components/products/VariantSelector";
import { ReferenceCard } from "@/components/products/ReferenceCard";

export const dynamicParams = true;

export function generateStaticParams() {
  return references.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const r = getReference(slug);
  return {
    title: r ? r.name : "Referencia",
    description: r
      ? `${r.name}: ${r.count} medidas y calibres disponibles en MultiAceros B&M, Bucaramanga. Precios y cotización en línea.`
      : undefined,
  };
}

export default async function ReferenciaPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const r = getReference(slug);
  if (!r) notFound();

  const fam = getFamily(r.family);
  const related = referencesByFamily(r.family)
    .filter((x) => x.slug !== r.slug)
    .slice(0, 4);

  return (
    <>
      <section className="container-x py-6 lg:py-10">
        <nav className="mb-6 text-sm text-muted">
          <Link href="/" className="hover:text-brand">
            Inicio
          </Link>{" "}
          /{" "}
          <Link href="/catalogo" className="hover:text-brand">
            Catálogo
          </Link>{" "}
          /{" "}
          <Link href={`/categoria/${r.family}`} className="hover:text-brand">
            {fam?.name}
          </Link>
        </nav>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Imagen */}
          <div className="relative aspect-square overflow-hidden rounded-[var(--radius-card)] border border-line bg-paper">
            <Image
              src={r.image}
              alt={r.name}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
              priority
            />
            <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-ink shadow-sm">
              {fam?.name}
            </span>
          </div>

          {/* Información + selector */}
          <div className="flex flex-col">
            <p className="text-xs font-semibold uppercase tracking-wide text-brand">
              {fam?.name}
            </p>
            <h1 className="mt-1 font-display text-xl font-bold leading-tight text-ink sm:text-2xl">
              {r.name}
            </h1>
            <p className="mt-2 inline-flex items-center gap-1.5 text-sm text-muted">
              <Layers size={15} className="text-brand" />
              {r.count} {r.count === 1 ? "medida disponible" : "medidas / calibres disponibles"}
              {r.priceMin != null && (
                <>
                  {" · "}desde{" "}
                  <span className="font-semibold text-ink">
                    {formatCOP(r.priceMin)}
                  </span>
                </>
              )}
            </p>

            <div className="my-5 h-px bg-line" />

            <VariantSelector reference={r} />

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

      {/* Otras referencias de la familia */}
      {related.length > 0 && (
        <section className="bg-paper py-14">
          <div className="container-x">
            <h2 className="mb-6 font-display text-lg font-bold text-ink">
              Más en {fam?.name}
            </h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {related.map((x) => (
                <ReferenceCard key={x.slug} r={x} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
