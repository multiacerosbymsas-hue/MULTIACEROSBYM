import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";
import { company } from "@/lib/data/company";
import { whatsappLink } from "@/lib/utils/format";
import { Reveal } from "@/components/ui/Reveal";

const stats = [
  { num: `${company.yearsInMarket}`, suffix: "", label: "años" },
  { num: "1.600", suffix: "+", label: "referencias" },
  { num: "8", suffix: "", label: "marcas aliadas" },
  { num: "100", suffix: "%", label: "certificado" },
];

export function Hero() {
  return (
    <section id="inicio" className="relative overflow-hidden bg-blueprint">
      <div className="container-x relative grid items-center gap-12 py-14 lg:grid-cols-[1.05fr_0.95fr] lg:py-20">
        {/* ---------- Texto ---------- */}
        <div>
          <Reveal>
            <p className="inline-flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-ink/60">
              <span className="text-brand">◆</span> Ferretería industrial · Bucaramanga
            </p>
          </Reveal>

          <Reveal delay={80}>
            <h1 className="mt-5 font-display text-[2.6rem] font-bold leading-[1.05] tracking-tight text-ink sm:text-6xl">
              Todas las formas
              <br />
              del{" "}
              <span className="relative inline-block">
                <span className="text-gradient">acero</span>
                <span className="absolute -bottom-1 left-0 h-[3px] w-full bg-brand" />
              </span>{" "}
              <span className="text-brand">◆</span>
              <br />
              <span className="text-ink/80">en un solo lugar</span>
            </h1>
          </Reveal>

          <Reveal delay={140}>
            <div className="mt-6 flex items-center gap-3">
              <span className="h-px w-10 bg-brand" />
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink/55">
                Precisión · Calidad · Servicio
              </span>
              <span className="h-px flex-1 bg-line" />
            </div>
          </Reveal>

          <Reveal delay={200}>
            <p className="mt-5 max-w-lg leading-relaxed text-muted">
              Acero y materiales certificados para construcción, ornamentación e
              industria, con asesoría según la necesidad de tu proyecto y los
              mejores precios del mercado.
            </p>
          </Reveal>

          <Reveal delay={260}>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/catalogo"
                className="group inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-brand/25 transition-all hover:bg-brand-dark"
              >
                Explorar catálogo
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <a
                href={whatsappLink(`Hola ${company.brand} 👋, quiero asesoría para mi proyecto.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-6 py-3.5 text-sm font-semibold text-ink transition-all hover:border-ink"
              >
                <MessageCircle size={18} className="text-brand" /> Cotizar
              </a>
            </div>
          </Reveal>
        </div>

        {/* ---------- Plano / imagen técnica ---------- */}
        <Reveal delay={220} className="relative">
          <div className="relative">
            <div className="relative aspect-[4/5] overflow-hidden border border-ink/15 bg-paper sm:aspect-square">
              <Image
                src="/images/hero-acero.jpg"
                alt="Acero estructural en bodega de MultiAceros"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover grayscale contrast-[1.05]"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-brand/15 via-transparent to-transparent" />
              <span className="absolute bottom-3 left-3 rounded-sm bg-ink/90 px-2 py-1 font-mono text-[10px] font-semibold uppercase tracking-wider text-white">
                Acero estructural
              </span>
            </div>

            {/* Esquinas de plano */}
            <span className="absolute -left-1 -top-1 h-5 w-5 border-l-2 border-t-2 border-brand" />
            <span className="absolute -right-1 -top-1 h-5 w-5 border-r-2 border-t-2 border-brand" />
            <span className="absolute -bottom-1 -left-1 h-5 w-5 border-b-2 border-l-2 border-brand" />
            <span className="absolute -bottom-1 -right-1 h-5 w-5 border-b-2 border-r-2 border-brand" />

            {/* Cota vertical: 6 m */}
            <div className="absolute -right-9 top-0 hidden h-full w-9 sm:block">
              <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-brand/60" />
              <span className="absolute left-1/2 top-0 h-px w-3 -translate-x-1/2 bg-brand" />
              <span className="absolute bottom-0 left-1/2 h-px w-3 -translate-x-1/2 bg-brand" />
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-90 whitespace-nowrap bg-white px-1 font-mono text-[10px] font-semibold text-brand">
                6 m
              </span>
            </div>

            {/* Cota superior: Ø */}
            <div className="absolute -top-8 left-8 right-8 hidden sm:block">
              <span className="absolute top-1/2 h-px w-full bg-brand/60" />
              <span className="absolute left-0 top-1/2 h-2.5 w-px -translate-y-1/2 bg-brand" />
              <span className="absolute right-0 top-1/2 h-2.5 w-px -translate-y-1/2 bg-brand" />
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-1.5 font-mono text-[10px] font-semibold text-brand">
                {`Ø 2"`}
              </span>
            </div>
          </div>

          {/* Chip de dato */}
          <div className="absolute -bottom-5 -left-5 hidden rounded-sm border border-line bg-white px-4 py-3 shadow-[var(--shadow-card)] md:block">
            <p className="font-mono text-[10px] uppercase tracking-wider text-muted">Referencias</p>
            <p className="font-display text-2xl font-bold text-ink">+1.600</p>
          </div>
        </Reveal>
      </div>

      {/* ---------- Franja de estadísticas ---------- */}
      <div className="border-y border-line bg-white/70">
        <div className="container-x grid grid-cols-2 divide-x divide-line lg:grid-cols-4">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 70} className="px-3 py-6 text-center">
              <p className="font-display text-3xl font-bold text-ink lg:text-4xl">
                {s.num}
                <span className="text-brand">{s.suffix}</span>
              </p>
              <p className="mt-1 font-mono text-[11px] uppercase tracking-wider text-muted">
                {s.label}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
