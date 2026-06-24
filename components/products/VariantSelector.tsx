"use client";

import { useState } from "react";
import { ShoppingCart, Minus, Plus, MessageCircle, Check } from "lucide-react";
import { useCart } from "@/lib/store/cart";
import { formatCOP, whatsappLink, quoteProductMessage } from "@/lib/utils/format";
import type { Reference } from "@/lib/data/catalog";

export function VariantSelector({ reference }: { reference: Reference }) {
  const add = useCart((s) => s.add);
  const open = useCart((s) => s.open);

  // Selecciona por defecto la primera variante con precio.
  const firstWithPrice = Math.max(
    0,
    reference.variants.findIndex((v) => v.price != null)
  );
  const [sel, setSel] = useState(firstWithPrice);
  const [qty, setQty] = useState(1);

  const v = reference.variants[sel];
  const unit = v.weightKg ? `${v.weightKg} kg` : "unidad";

  const onAdd = () => {
    if (v.price == null) return;
    for (let i = 0; i < qty; i++)
      add({
        id: v.slug,
        name: v.name,
        price: v.price,
        image: reference.image,
        unit,
      });
    open();
  };

  return (
    <div>
      {/* Precio que se actualiza con la selección */}
      <div className="rounded-2xl border border-line bg-paper p-4">
        {v.price != null ? (
          <div className="flex items-end gap-2">
            <span className="font-display text-3xl font-bold text-ink">
              {formatCOP(v.price)}
            </span>
            <span className="pb-1 text-sm text-muted">/ {unit}</span>
          </div>
        ) : (
          <span className="font-display text-xl font-bold text-brand">
            Precio bajo cotización
          </span>
        )}
        <p className="mt-1 font-mono text-[11px] uppercase tracking-wider text-muted">
          Cód. {v.code}
          {v.weightKg ? ` · ${v.weightKg} kg` : ""}
        </p>
      </div>

      {/* Selector de medida / calibre */}
      <div className="mt-5">
        <p className="mb-2 text-sm font-semibold text-ink">
          Elige la medida o calibre{" "}
          <span className="font-normal text-muted">
            ({reference.count} {reference.count === 1 ? "opción" : "opciones"})
          </span>
        </p>
        <div className="max-h-72 space-y-1.5 overflow-y-auto rounded-xl border border-line bg-white p-2">
          {reference.variants.map((opt, i) => {
            const active = i === sel;
            return (
              <button
                key={`${opt.slug}-${i}`}
                onClick={() => setSel(i)}
                aria-pressed={active}
                className={`flex w-full items-center justify-between gap-3 rounded-lg border px-3 py-2.5 text-left transition-colors ${
                  active
                    ? "border-brand bg-brand-tint"
                    : "border-transparent hover:bg-paper"
                }`}
              >
                <span className="flex min-w-0 items-center gap-2">
                  <span
                    className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                      active ? "border-brand bg-brand text-white" : "border-line"
                    }`}
                  >
                    {active && <Check size={11} strokeWidth={3} />}
                  </span>
                  <span className="truncate text-sm text-ink">{opt.name}</span>
                </span>
                <span
                  className={`shrink-0 font-display text-sm font-bold ${
                    opt.price != null ? "text-ink" : "text-brand"
                  }`}
                >
                  {opt.price != null ? formatCOP(opt.price) : "Cotizar"}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Acción */}
      <div className="mt-5">
        {v.price != null ? (
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1 rounded-full border border-line p-1">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-paper"
                aria-label="Disminuir cantidad"
              >
                <Minus size={16} />
              </button>
              <span className="w-8 text-center font-semibold">{qty}</span>
              <button
                onClick={() => setQty((q) => q + 1)}
                className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-paper"
                aria-label="Aumentar cantidad"
              >
                <Plus size={16} />
              </button>
            </div>
            <button
              onClick={onAdd}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-brand px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
            >
              <ShoppingCart size={18} /> Agregar a la cotización
            </button>
          </div>
        ) : (
          <a
            href={whatsappLink(quoteProductMessage(v.name))}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-3.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            <MessageCircle size={18} /> Cotizar por WhatsApp
          </a>
        )}
      </div>
    </div>
  );
}
