"use client";

import { useState } from "react";
import Image from "next/image";
import { Check } from "lucide-react";
import { company } from "@/lib/data/company";
import { Reveal } from "@/components/ui/Reveal";

export function About() {
  const [tab, setTab] = useState<"mision" | "vision">("mision");

  return (
    <section id="nosotros" className="py-20 lg:py-24">
      <div className="container-x grid items-center gap-12 lg:grid-cols-2">
        <Reveal className="relative">
          <div className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem] border border-line shadow-[var(--shadow-card)]">
            <Image
              src="/images/aceros-variedades.jpg"
              alt="Inventario de aceros de MultiAceros B&M"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <div className="absolute -bottom-6 right-5 flex items-center gap-3 rounded-2xl border border-line bg-white px-5 py-4 shadow-[var(--shadow-card)]">
            <span className="font-display text-3xl font-bold text-brand">2030</span>
            <span className="max-w-[150px] text-xs font-medium text-muted">
              Visión: líderes del sector ferretero regional y nacional
            </span>
          </div>
        </Reveal>

        <div>
          <Reveal>
            <p className="mb-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-brand">
              <span className="h-px w-6 bg-brand" />
              Sobre nosotros
            </p>
            <h2 className="font-display text-3xl font-bold leading-tight tracking-tight text-ink sm:text-4xl">
              Acero con <span className="text-gradient">respaldo</span>, servicio con
              calidad humana
            </h2>
            <p className="mt-4 leading-relaxed text-muted">
              En <strong className="text-ink">{company.legalName}</strong> llevamos{" "}
              {company.yearsInMarket} años suministrando material certificado para
              ornamentación, construcción e industria, con los mejores precios del
              mercado y asesoría según la necesidad de cada proyecto.
            </p>
          </Reveal>

          <Reveal delay={120}>
            <div className="mt-6 inline-flex rounded-full border border-line bg-paper p-1">
              {(["mision", "vision"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`rounded-full px-5 py-2 text-sm font-semibold capitalize transition-colors ${
                    tab === t ? "bg-ink text-white" : "text-ink/70"
                  }`}
                >
                  {t === "mision" ? "Misión" : "Visión"}
                </button>
              ))}
            </div>
            <p className="mt-4 min-h-[96px] leading-relaxed text-ink/80">
              {tab === "mision" ? company.mission : company.vision}
            </p>
          </Reveal>

          <Reveal delay={200}>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {company.values.map((v) => (
                <div
                  key={v.name}
                  className="rounded-xl border border-line bg-white p-4"
                >
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-tint text-brand">
                      <Check size={14} />
                    </span>
                    <h3 className="font-display text-sm font-bold text-ink">
                      {v.name}
                    </h3>
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-muted">{v.desc}</p>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={280}>
            <div className="mt-6 flex flex-wrap gap-5 border-t border-line pt-5">
              {company.team.map((m) => (
                <div key={m.name} className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-ink font-display font-bold text-white">
                    {m.name
                      .split(" ")
                      .slice(0, 2)
                      .map((n) => n[0])
                      .join("")}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-ink">{m.name}</p>
                    <p className="text-xs text-muted">{m.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
