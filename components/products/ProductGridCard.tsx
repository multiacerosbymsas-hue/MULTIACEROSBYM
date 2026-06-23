"use client";

import Link from "next/link";
import { Plus, MessageCircle } from "lucide-react";
import { useCart } from "@/lib/store/cart";
import { formatCOP, whatsappLink, quoteProductMessage } from "@/lib/utils/format";
import { familyImage, familyName, type CatalogProduct } from "@/lib/data/catalog";

export function ProductGridCard({ p }: { p: CatalogProduct }) {
  const add = useCart((s) => s.add);
  const img = familyImage(p.family);
  const unit = p.weightKg ? `${p.weightKg} kg` : "unidad";
  const tag = familyName(p.family).split(/[ ,]/)[0];

  return (
    <article className="group flex flex-col rounded-xl border border-line bg-white p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-ink/25 hover:shadow-[var(--shadow-soft)]">
      <div className="flex items-center justify-between gap-2">
        <span className="rounded bg-brand-tint px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-brand">
          {tag}
        </span>
        <span className="font-mono text-[10px] text-muted">{p.code}</span>
      </div>

      <Link
        href={`/producto/${p.slug}`}
        className="mt-2.5 line-clamp-2 min-h-[2.6rem] font-medium leading-snug text-ink transition-colors hover:text-brand"
      >
        {p.name}
      </Link>

      <p className="mt-1 font-mono text-[11px] text-muted">
        {p.weightKg ? `${p.weightKg} kg / unidad` : " "}
      </p>

      <div className="mt-3 flex items-end justify-between gap-2 border-t border-line pt-3">
        {p.price ? (
          <span className="font-display text-base font-bold text-ink">
            {formatCOP(p.price)}
          </span>
        ) : (
          <span className="text-sm font-semibold text-brand">Cotizar</span>
        )}

        {p.price ? (
          <button
            onClick={() =>
              add({ id: p.slug, name: p.name, price: p.price!, image: img, unit })
            }
            className="inline-flex items-center gap-1 rounded-full bg-ink px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-brand"
            aria-label={`Agregar ${p.name}`}
          >
            <Plus size={14} /> Agregar
          </button>
        ) : (
          <a
            href={whatsappLink(quoteProductMessage(p.name))}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 rounded-full bg-[#25D366] px-3 py-1.5 text-xs font-semibold text-white"
          >
            <MessageCircle size={14} /> WhatsApp
          </a>
        )}
      </div>
    </article>
  );
}
