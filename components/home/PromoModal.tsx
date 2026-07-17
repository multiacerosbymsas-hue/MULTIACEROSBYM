"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { X, ArrowRight, Sparkles } from "lucide-react";
import type { PromoContent } from "@/lib/data/content";

/**
 * Popup "Promoción del mes": aparece una vez por sesión al entrar al sitio.
 * Solo se muestra si está activo y tiene imagen (se administra en /admin/promocion).
 */
export function PromoModal({ promo }: { promo: PromoContent }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!promo.enabled || !promo.image) return;
    try {
      if (sessionStorage.getItem("mab-promo") === "seen") return;
    } catch {}
    const t = setTimeout(() => setOpen(true), 900);
    return () => clearTimeout(t);
  }, [promo.enabled, promo.image]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const close = () => {
    setOpen(false);
    try {
      sessionStorage.setItem("mab-promo", "seen");
    } catch {}
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={promo.eyebrow}
    >
      {/* Fondo */}
      <div
        className="absolute inset-0 bg-ink/70 backdrop-blur-sm"
        onClick={close}
      />

      {/* Tarjeta */}
      <div className="animate-tip-in relative w-full max-w-sm overflow-hidden rounded-3xl bg-white shadow-2xl sm:max-w-md">
        <button
          onClick={close}
          aria-label="Cerrar promoción"
          className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-ink/60 text-white backdrop-blur-sm transition-colors hover:bg-ink"
        >
          <X size={18} />
        </button>

        <div className="relative aspect-square w-full bg-paper">
          <Image
            src={promo.image}
            alt={promo.title}
            fill
            sizes="(max-width: 640px) 90vw, 448px"
            className="object-cover"
            priority
          />
          <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-brand px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-brand/30">
            <Sparkles size={13} /> {promo.eyebrow}
          </span>
        </div>

        <div className="p-5 sm:p-6">
          <h2 className="font-display text-xl font-bold leading-tight text-ink sm:text-2xl">
            {promo.title}
          </h2>
          {promo.text && (
            <p className="mt-2 text-sm leading-relaxed text-muted">{promo.text}</p>
          )}
          <div className="mt-4 flex items-center gap-3">
            <a
              href={promo.ctaHref || "/#contacto"}
              onClick={close}
              className="group inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-brand px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
            >
              {promo.ctaLabel || "Cotizar ahora"}
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </a>
            <button
              onClick={close}
              className="rounded-full px-4 py-3 text-sm font-medium text-muted transition-colors hover:text-ink"
            >
              Ahora no
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
