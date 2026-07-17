"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight, MapPin, MessageCircle } from "lucide-react";
import { company } from "@/lib/data/company";
import { whatsappLink } from "@/lib/utils/format";
import { safeHref, type HeroSlide } from "@/lib/data/content";
import { FloatingSuppliers } from "@/components/home/FloatingSuppliers";

const stats = [
  { num: `${company.yearsInMarket}`, suffix: "", label: "años" },
  { num: "1.600", suffix: "+", label: "referencias" },
  { num: "8", suffix: "", label: "marcas aliadas" },
  { num: "100", suffix: "%", label: "certificado" },
];

const AUTOPLAY_MS = 5500;

/** Resalta en naranja las palabras envueltas en *asteriscos*. */
function renderTitle(title: string) {
  return title.split(/(\*[^*]+\*)/g).map((part, i) =>
    part.startsWith("*") && part.endsWith("*") ? (
      <span key={i} className="text-brand">
        {part.slice(1, -1)}
      </span>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

export function HeroCarousel({ slides }: { slides: HeroSlide[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = slides.length;

  const go = useCallback((n: number) => setIndex((n + count) % count), [count]);
  const next = useCallback(() => setIndex((i) => (i + 1) % count), [count]);
  const prev = useCallback(() => setIndex((i) => (i - 1 + count) % count), [count]);

  useEffect(() => {
    if (paused || count <= 1) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % count), AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [paused, count]);

  const touchX = useRef<number | null>(null);
  const onTouchStart = (e: React.TouchEvent) => {
    touchX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    if (dx > 50) prev();
    else if (dx < -50) next();
    touchX.current = null;
  };

  return (
    <section aria-roledescription="carrusel" aria-label="Destacados">
      <div
        className="relative h-[80vh] min-h-[520px] w-full overflow-hidden bg-ink lg:max-h-[720px]"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocusCapture={() => setPaused(true)}
        onBlurCapture={() => setPaused(false)}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div
          className="flex h-full transition-transform duration-700 ease-out"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {slides.map((s, i) => {
            const active = i === index;
            return (
              <div
                key={i}
                className="relative h-full w-full shrink-0"
                aria-roledescription="diapositiva"
                aria-label={`${i + 1} de ${count}`}
                aria-hidden={!active}
                inert={!active}
              >
                <Image
                  src={s.image}
                  alt={s.eyebrow}
                  fill
                  priority={i === 0}
                  sizes="100vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-ink/90 via-ink/60 to-ink/25" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />

                <div className="container-x relative flex h-full flex-col justify-center">
                  <div className="max-w-xl text-white">
                    <p className="inline-flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-white/75">
                      <span className="text-brand">◆</span> {s.eyebrow}
                    </p>
                    <h1 className="mt-4 font-display text-3xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
                      {renderTitle(s.title)}
                    </h1>
                    <p className="mt-5 max-w-lg leading-relaxed text-white/80 sm:text-lg">
                      {s.subtitle}
                    </p>
                    <div className="mt-7 flex flex-wrap gap-3">
                      <Link
                        href={safeHref(s.ctaHref)}
                        className="group inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-brand/25 transition-all hover:bg-brand-dark"
                      >
                        {s.ctaLabel}
                        <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                      </Link>
                      <a
                        href={whatsappLink(`Hola ${company.brand} 👋, quiero asesoría para mi proyecto.`)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20"
                      >
                        <MessageCircle size={18} className="text-brand" /> Cotizar
                      </a>
                      <Link
                        href="/#contacto"
                        className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20"
                      >
                        <MapPin size={18} className="text-brand" /> Cómo llegar
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Proveedores anclados al hero (costado izquierdo, se van con el scroll) */}
        <FloatingSuppliers />

        {count > 1 && (
          <>
            <button
              onClick={prev}
              aria-label="Diapositiva anterior"
              className="absolute left-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm transition-colors hover:bg-white/30 sm:left-5"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={next}
              aria-label="Diapositiva siguiente"
              className="absolute right-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm transition-colors hover:bg-white/30 sm:right-5"
            >
              <ChevronRight size={24} />
            </button>

            <div className="absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2.5">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => go(i)}
                  aria-label={`Ir a la diapositiva ${i + 1}`}
                  aria-current={i === index}
                  className={`h-2.5 rounded-full transition-all ${
                    i === index ? "w-7 bg-brand" : "w-2.5 bg-white/50 hover:bg-white/80"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Franja de estadísticas */}
      <div className="border-y border-line bg-white">
        <div className="container-x grid grid-cols-2 divide-x divide-line lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="px-3 py-6 text-center">
              <p className="font-display text-3xl font-bold text-ink lg:text-4xl">
                {s.num}
                <span className="text-brand">{s.suffix}</span>
              </p>
              <p className="mt-1 font-mono text-[11px] uppercase tracking-wider text-muted">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
