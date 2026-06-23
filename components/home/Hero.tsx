import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MessageCircle, ShieldCheck, Truck, Award } from "lucide-react";
import { company } from "@/lib/data/company";
import { whatsappLink } from "@/lib/utils/format";
import { Reveal } from "@/components/ui/Reveal";

const stats = [
  { num: `${company.yearsInMarket}`, suffix: " años", label: "de experiencia" },
  { num: "1.600", suffix: "+", label: "referencias en stock" },
  { num: "8", suffix: "", label: "marcas aliadas" },
  { num: "100", suffix: "%", label: "material certificado" },
];

export function Hero() {
  return (
    <section id="inicio" className="relative overflow-hidden bg-white">
      <div className="bg-grid absolute inset-0 opacity-70" aria-hidden />
      <div
        className="glow-brand absolute -right-40 -top-40 h-[480px] w-[480px]"
        aria-hidden
      />

      <div className="container-x relative grid items-center gap-12 pb-10 pt-14 lg:grid-cols-[1.05fr_0.95fr] lg:pt-20">
        <div>
          <Reveal>
            <p className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-3.5 py-1.5 text-xs font-semibold text-ink shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-brand" />
              Ferretería industrial · Bucaramanga, Santander
            </p>
          </Reveal>

          <Reveal delay={80}>
            <h1 className="mt-5 font-display text-4xl font-bold leading-[1.05] tracking-tight text-ink sm:text-5xl lg:text-6xl">
              Todas las formas
              <br />
              del <span className="text-gradient">acero</span> en un
              <br />
              solo lugar
            </h1>
          </Reveal>

          <Reveal delay={160}>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
              Suministramos acero y materiales certificados para construcción y
              ornamentación, con asesoría profesional según la necesidad de tu
              proyecto y los mejores precios del mercado.
            </p>
          </Reveal>

          <Reveal delay={240}>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link
                href="/catalogo"
                className="group inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-brand/25 transition-all hover:bg-brand-dark"
              >
                Explorar catálogo
                <ArrowRight
                  size={18}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>
              <a
                href={whatsappLink(
                  `Hola ${company.brand} 👋, quiero asesoría para mi proyecto.`
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-6 py-3.5 text-sm font-semibold text-ink transition-all hover:border-ink"
              >
                <MessageCircle size={18} className="text-brand" />
                Hablar con un asesor
              </a>
            </div>
          </Reveal>

          <Reveal delay={320}>
            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink/70">
              <li className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-brand" /> Material certificado
              </li>
              <li className="flex items-center gap-2">
                <Award size={16} className="text-brand" /> Asesoría especializada
              </li>
              <li className="flex items-center gap-2">
                <Truck size={16} className="text-brand" /> Despacho ágil
              </li>
            </ul>
          </Reveal>
        </div>

        <Reveal delay={200} className="relative">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem] border border-line shadow-[var(--shadow-card)] sm:aspect-[5/5]">
            <Image
              src="/images/hero-acero.jpg"
              alt="Tubería y perfiles de acero en bodega de MultiAceros"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/40 to-transparent" />
          </div>

          <div className="absolute -bottom-5 -left-5 hidden rounded-2xl border border-line bg-white px-5 py-4 shadow-[var(--shadow-card)] sm:block">
            <p className="font-display text-3xl font-bold text-ink">
              +1.600
            </p>
            <p className="text-xs font-medium text-muted">
              referencias disponibles
            </p>
          </div>
        </Reveal>
      </div>

      {/* Franja de estadísticas */}
      <div className="border-y border-line bg-paper">
        <div className="container-x grid grid-cols-2 gap-px lg:grid-cols-4">
          {stats.map((s, i) => (
            <Reveal
              key={s.label}
              delay={i * 80}
              className="px-2 py-6 text-center lg:py-8"
            >
              <p className="font-display text-3xl font-bold text-ink lg:text-4xl">
                {s.num}
                <span className="text-brand">{s.suffix}</span>
              </p>
              <p className="mt-1 text-sm text-muted">{s.label}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
