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
      {/* Fondo oscuro con desenfoque */}
      <div
        className="animate-overlay-in absolute inset-0 bg-ink/80 backdrop-blur-md"
        onClick={close}
      />

      {/* Tarjeta */}
      <div className="animate-modal-pop relative max-h-[calc(100vh-2rem)] w-full max-w-[360px] overflow-y-auto overflow-x-hidden rounded-[26px] bg-ink text-white shadow-2xl ring-1 ring-white/10 sm:max-w-[400px]">
        {/* Glow de marca */}
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-brand/30 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-20 -left-16 h-56 w-56 rounded-full bg-brand/15 blur-3xl"
        />

        <button
          onClick={close}
          aria-label="Cerrar promoción"
          className="absolute right-3.5 top-3.5 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white ring-1 ring-white/20 backdrop-blur-sm transition-colors hover:bg-white/20"
        >
          <X size={18} />
        </button>

        <div className="relative z-10 p-5 sm:p-6">
          {/* Cintillos */}
          <div className="mb-4 flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-brand px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-white shadow-lg shadow-brand/40">
              <Sparkles size={12} /> {promo.eyebrow}
            </span>
            <span className="rounded-full border border-white/20 bg-white/5 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-white/80">
              Nuevo
            </span>
          </div>

          {/* Foto del producto enmarcada */}
          <div className="relative mx-auto aspect-square w-full overflow-hidden rounded-2xl bg-gradient-to-br from-white/10 to-white/[0.03] ring-1 ring-white/10">
            <Image
              src={promo.image}
              alt={promo.title}
              fill
              sizes="(max-width: 640px) 90vw, 400px"
              className="object-cover"
              priority
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent" />
          </div>

          {/* Texto */}
          <h2 className="mt-5 font-display text-[22px] font-bold leading-tight sm:text-2xl">
            {promo.title}
          </h2>
          {promo.text && (
            <p className="mt-2 text-sm leading-relaxed text-white/70">{promo.text}</p>
          )}

          {/* Acciones */}
          <div className="mt-5 flex flex-col gap-2.5">
            <a
              href={promo.ctaHref || "/#contacto"}
              onClick={close}
              className="btn-sheen group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-brand to-brand-dark px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-brand/30 transition-transform hover:scale-[1.02] active:scale-100"
            >
              <span className="relative z-10 inline-flex items-center gap-2">
                {promo.ctaLabel || "Cotizar ahora"}
                <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" />
              </span>
            </a>
            <button
              onClick={close}
              className="rounded-full py-2 text-sm font-medium text-white/50 transition-colors hover:text-white"
            >
              Ahora no, gracias
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
