"use client";

import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/lib/store/cart";
import { formatCOP } from "@/lib/utils/format";
import type { Product } from "@/lib/data/products";

const tagStyles: Record<NonNullable<Product["tag"]>, string> = {
  Destacado: "bg-brand text-white",
  Nuevo: "bg-ink text-white",
  Oferta: "bg-red-600 text-white",
};

export function ProductCard({ p }: { p: Product }) {
  const add = useCart((s) => s.add);

  return (
    <article className="group flex flex-col overflow-hidden rounded-[var(--radius-card)] border border-line bg-white shadow-[var(--shadow-soft)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-card)]">
      <div className="relative aspect-[4/3] overflow-hidden bg-paper">
        <Image
          src={p.image}
          alt={p.name}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {p.tag && (
          <span
            className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${tagStyles[p.tag]}`}
          >
            {p.tag}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <span className="text-xs font-semibold uppercase tracking-wide text-brand">
          {p.categoryLabel}
        </span>
        <h3 className="mt-1 font-display text-base font-semibold leading-snug text-ink">
          {p.name}
        </h3>
        <p className="mt-1.5 line-clamp-2 text-sm text-muted">{p.desc}</p>

        <div className="mt-4 flex items-end justify-between gap-3 pt-3">
          <div>
            <div className="font-display text-lg font-bold text-ink">
              {formatCOP(p.price)}
            </div>
            <div className="text-xs text-muted">/ {p.unit}</div>
          </div>
          <button
            onClick={() =>
              add({
                id: p.id,
                name: p.name,
                price: p.price,
                image: p.image,
                unit: p.unit,
              })
            }
            className="inline-flex items-center gap-1.5 rounded-full bg-ink px-3.5 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand"
            aria-label={`Agregar ${p.name} al carrito`}
          >
            <ShoppingCart size={16} />
            Agregar
          </button>
        </div>
      </div>
    </article>
  );
}
