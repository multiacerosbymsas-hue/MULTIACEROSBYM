"use client";

import Image from "next/image";
import { suppliers } from "@/lib/data/suppliers";

/**
 * Logos de proveedores anclados al carrusel (hero), en una fila sobre el borde
 * inferior izquierdo. Se ven en gris/transparente y se iluminan (color) al pasar
 * el cursor. Van DENTRO del hero (posición absolute), así que se quedan arriba y
 * se desplazan con el carrusel al hacer scroll (no son fijos).
 * Visible en pantallas grandes (el efecto hover es de escritorio).
 */
export function FloatingSuppliers() {
  return (
    <div className="absolute inset-x-0 bottom-6 z-20 hidden lg:block">
      <div className="container-x flex items-center gap-2.5">
        {suppliers.map((s) => (
          <div
            key={s.name}
            title={s.name}
            className="group relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-white/95 shadow-md ring-1 ring-black/5 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:ring-brand/40"
          >
            <Image
              src={s.logo}
              alt={s.name}
              fill
              sizes="40px"
              className="object-cover opacity-50 grayscale transition-all duration-300 group-hover:opacity-100 group-hover:grayscale-0"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
