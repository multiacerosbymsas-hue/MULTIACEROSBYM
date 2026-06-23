"use client";

import { useState } from "react";
import { ShoppingCart, Minus, Plus, MessageCircle } from "lucide-react";
import { useCart } from "@/lib/store/cart";
import { whatsappLink, quoteProductMessage } from "@/lib/utils/format";

export function BuyBox({
  id,
  name,
  price,
  image,
  unit,
}: {
  id: string;
  name: string;
  price: number | null;
  image: string;
  unit: string;
}) {
  const add = useCart((s) => s.add);
  const open = useCart((s) => s.open);
  const [qty, setQty] = useState(1);

  if (price === null) {
    return (
      <a
        href={whatsappLink(quoteProductMessage(name))}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-3.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
      >
        <MessageCircle size={18} /> Cotizar por WhatsApp
      </a>
    );
  }

  const onAdd = () => {
    for (let i = 0; i < qty; i++) add({ id, name, price, image, unit });
    open();
  };

  return (
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
  );
}
