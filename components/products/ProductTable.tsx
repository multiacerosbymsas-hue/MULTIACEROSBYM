"use client";

import Link from "next/link";
import { Plus, MessageCircle } from "lucide-react";
import { useCart } from "@/lib/store/cart";
import { formatCOP, whatsappLink, quoteProductMessage } from "@/lib/utils/format";
import { familyImage, type CatalogProduct } from "@/lib/data/catalog";

export function ProductTable({ products }: { products: CatalogProduct[] }) {
  const add = useCart((s) => s.add);

  return (
    <div className="overflow-hidden rounded-xl border border-line bg-white">
      {/* Encabezado (desktop) */}
      <div className="hidden grid-cols-[96px_1fr_88px_130px_120px] gap-4 border-b border-line bg-paper px-4 py-2.5 font-mono text-[11px] font-semibold uppercase tracking-wider text-muted sm:grid">
        <span>Código</span>
        <span>Descripción</span>
        <span>Peso</span>
        <span>Precio</span>
        <span className="text-right">Acción</span>
      </div>

      <ul className="divide-y divide-line">
        {products.map((p) => {
          const img = familyImage(p.family);
          const unit = p.weightKg ? `${p.weightKg} kg` : "unidad";
          return (
            <li
              key={p.slug}
              className="px-4 py-3.5 transition-colors hover:bg-paper sm:grid sm:grid-cols-[96px_1fr_88px_130px_120px] sm:items-center sm:gap-4"
            >
              <span className="hidden font-mono text-[11px] text-muted sm:block">
                {p.code}
              </span>

              <div className="min-w-0">
                <Link
                  href={`/producto/${p.slug}`}
                  className="line-clamp-2 font-medium text-ink transition-colors hover:text-brand sm:line-clamp-1"
                >
                  {p.name}
                </Link>
                <p className="mt-0.5 font-mono text-[11px] text-muted sm:hidden">
                  {p.code}
                  {p.weightKg ? ` · ${p.weightKg} kg` : ""}
                </p>
              </div>

              <span className="hidden text-sm text-muted sm:block">
                {p.weightKg ? `${p.weightKg} kg` : "—"}
              </span>

              <div className="mt-2 flex items-center justify-between gap-3 sm:mt-0 sm:contents">
                <span className="font-display font-bold text-ink">
                  {p.price ? (
                    formatCOP(p.price)
                  ) : (
                    <span className="text-brand">Cotizar</span>
                  )}
                </span>
                <div className="sm:justify-self-end">
                  {p.price ? (
                    <button
                      onClick={() =>
                        add({ id: p.slug, name: p.name, price: p.price!, image: img, unit })
                      }
                      className="inline-flex items-center gap-1 rounded-full bg-ink px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-brand"
                      aria-label={`Agregar ${p.name}`}
                    >
                      <Plus size={14} /> Agregar
                    </button>
                  ) : (
                    <a
                      href={whatsappLink(quoteProductMessage(p.name))}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 rounded-full bg-[#25D366] px-3.5 py-2 text-xs font-semibold text-white"
                    >
                      <MessageCircle size={14} /> WhatsApp
                    </a>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
