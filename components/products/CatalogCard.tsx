"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, MessageCircle } from "lucide-react";
import { useCart } from "@/lib/store/cart";
import { formatCOP, whatsappLink, quoteProductMessage } from "@/lib/utils/format";
import { familyImage, type CatalogProduct } from "@/lib/data/catalog";

function tidySection(s: string) {
  const t = s.replace(/\s*\(\d+\)\s*$/, "").replace(/\s*\d+%\s*$/, "").trim();
  return t.length > 24 ? t.slice(0, 24) + "…" : t;
}

export function CatalogCard({ p }: { p: CatalogProduct }) {
  const add = useCart((s) => s.add);
  const img = familyImage(p.family);
  const unit = p.weightKg ? `${p.weightKg} kg` : "unidad";

  return (
    <article className="group flex flex-col overflow-hidden rounded-[var(--radius-card)] border border-line bg-white shadow-[var(--shadow-soft)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-card)]">
      <Link
        href={`/producto/${p.slug}`}
        className="relative block aspect-[4/3] overflow-hidden bg-paper"
      >
        <Image
          src={img}
          alt={p.name}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-ink shadow-sm">
          {tidySection(p.section)}
        </span>
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <Link
          href={`/producto/${p.slug}`}
          className="line-clamp-2 font-display text-sm font-semibold leading-snug text-ink transition-colors hover:text-brand"
        >
          {p.name}
        </Link>
        <p className="mt-1 text-xs text-muted">
          Cód. {p.code}
          {p.weightKg ? ` · ${p.weightKg} kg` : ""}
        </p>

        <div className="mt-auto flex items-end justify-between gap-2 pt-3">
          {p.price ? (
            <div className="font-display text-base font-bold text-ink">
              {formatCOP(p.price)}
            </div>
          ) : (
            <div className="text-sm font-semibold text-brand">Cotizar</div>
          )}

          {p.price ? (
            <button
              onClick={() =>
                add({ id: p.slug, name: p.name, price: p.price!, image: img, unit })
              }
              className="inline-flex items-center gap-1.5 rounded-full bg-ink px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-brand"
              aria-label={`Agregar ${p.name}`}
            >
              <ShoppingCart size={14} /> Agregar
            </button>
          ) : (
            <a
              href={whatsappLink(quoteProductMessage(p.name))}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full bg-[#25D366] px-3 py-2 text-xs font-semibold text-white"
            >
              <MessageCircle size={14} /> WhatsApp
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
