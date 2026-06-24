import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Layers } from "lucide-react";
import { formatCOP } from "@/lib/utils/format";
import type { Reference } from "@/lib/data/catalog";

export function ReferenceCard({ r }: { r: Reference }) {
  return (
    <Link
      href={`/referencia/${r.slug}`}
      className="group flex flex-col overflow-hidden rounded-[var(--radius-card)] border border-line bg-white shadow-[var(--shadow-soft)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-card)]"
    >
      <div className="relative aspect-[16/11] overflow-hidden">
        <Image
          src={r.image}
          alt={r.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/15 to-transparent" />
        <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-ink">
          <Layers size={12} className="text-brand" />
          {r.count} {r.count === 1 ? "opción" : "opciones"}
        </span>
        <span className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-ink opacity-0 transition-opacity group-hover:opacity-100">
          <ArrowUpRight size={16} />
        </span>
        <h3 className="absolute bottom-3 left-4 right-4 font-display text-base font-bold leading-tight text-white">
          {r.name}
        </h3>
      </div>
      <div className="flex items-center justify-between gap-2 p-3.5">
        <span className="text-sm">
          {r.priceMin != null ? (
            <>
              <span className="text-muted">Desde </span>
              <span className="font-display font-bold text-ink">
                {formatCOP(r.priceMin)}
              </span>
            </>
          ) : (
            <span className="font-semibold text-brand">Bajo cotización</span>
          )}
        </span>
        <span className="text-xs font-semibold text-brand transition-colors group-hover:underline">
          Ver opciones
        </span>
      </div>
    </Link>
  );
}
