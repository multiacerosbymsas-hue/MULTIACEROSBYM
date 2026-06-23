"use client";

import Image from "next/image";
import { X, Plus, Minus, Trash2, ShoppingCart } from "lucide-react";
import { useCart, useCartTotal } from "@/lib/store/cart";
import { useMounted } from "@/components/ui/Reveal";
import { formatCOP, whatsappLink } from "@/lib/utils/format";
import { company } from "@/lib/data/company";

export function CartDrawer() {
  const { items, isOpen, close, remove, setQty } = useCart();
  const total = useCartTotal();
  const mounted = useMounted();

  const checkoutHref = whatsappLink(
    `Hola ${company.brand} 👋, quiero hacer el siguiente pedido:\n\n` +
      items
        .map((i) => `• ${i.qty} x ${i.name} — ${formatCOP(i.price * i.qty)}`)
        .join("\n") +
      `\n\nTotal aprox.: ${formatCOP(total)}`
  );

  return (
    <div
      className={`fixed inset-0 z-[60] ${isOpen ? "" : "pointer-events-none"}`}
      aria-hidden={!isOpen}
    >
      <div
        className={`absolute inset-0 bg-ink/50 transition-opacity ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={close}
      />
      <aside
        className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-white shadow-2xl transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <header className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 className="flex items-center gap-2 font-display text-lg font-bold text-ink">
            <ShoppingCart size={20} className="text-brand" /> Tu cotización
          </h2>
          <button
            onClick={close}
            className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-paper"
            aria-label="Cerrar carrito"
          >
            <X size={20} />
          </button>
        </header>

        {!mounted || items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-paper">
              <ShoppingCart size={28} className="text-muted" />
            </div>
            <p className="font-display font-semibold text-ink">Tu carrito está vacío</p>
            <p className="text-sm text-muted">
              Agrega productos del catálogo para armar tu cotización.
            </p>
            <button
              onClick={close}
              className="mt-2 rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand"
            >
              Ver catálogo
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 space-y-3 overflow-y-auto px-5 py-4">
              {items.map((i) => (
                <div
                  key={i.id}
                  className="flex gap-3 rounded-xl border border-line p-3"
                >
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-paper">
                    <Image src={i.image} alt={i.name} fill sizes="80px" className="object-cover" />
                  </div>
                  <div className="flex flex-1 flex-col">
                    <p className="text-sm font-semibold leading-snug text-ink">{i.name}</p>
                    <p className="text-xs text-muted">{formatCOP(i.price)} / {i.unit}</p>
                    <div className="mt-auto flex items-center justify-between">
                      <div className="flex items-center gap-1 rounded-full border border-line">
                        <button
                          onClick={() => setQty(i.id, i.qty - 1)}
                          className="flex h-7 w-7 items-center justify-center rounded-full hover:bg-paper"
                          aria-label="Disminuir"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-6 text-center text-sm font-semibold">{i.qty}</span>
                        <button
                          onClick={() => setQty(i.id, i.qty + 1)}
                          className="flex h-7 w-7 items-center justify-center rounded-full hover:bg-paper"
                          aria-label="Aumentar"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <button
                        onClick={() => remove(i.id)}
                        className="flex h-7 w-7 items-center justify-center rounded-full text-muted hover:bg-red-50 hover:text-red-600"
                        aria-label="Eliminar"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <footer className="border-t border-line px-5 py-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm text-muted">Total aproximado</span>
                <span className="font-display text-xl font-bold text-ink">
                  {formatCOP(total)}
                </span>
              </div>
              <a
                href={checkoutHref}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-full bg-brand px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
              >
                Finalizar pedido por WhatsApp
              </a>
              <p className="mt-2 text-center text-[11px] text-muted">
                El pago en línea (PSE, tarjeta, Nequi) se habilitará próximamente.
              </p>
            </footer>
          </>
        )}
      </aside>
    </div>
  );
}
