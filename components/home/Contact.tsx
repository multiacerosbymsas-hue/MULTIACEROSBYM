"use client";

import { useState, type FormEvent } from "react";
import { MapPin, Clock, Phone, Mail, Send, Navigation } from "lucide-react";
import { company } from "@/lib/data/company";
import { whatsappLink } from "@/lib/utils/format";
import { Reveal } from "@/components/ui/Reveal";

export function Contact() {
  const [name, setName] = useState("");
  const [msg, setMsg] = useState("");

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !msg.trim()) return;
    const text = `Hola ${company.brand} 👋, soy ${name}.\n\nQuiero cotizar:\n${msg}`;
    window.open(whatsappLink(text), "_blank");
  };

  return (
    <section id="contacto" className="bg-ink py-20 text-white lg:py-24">
      <div className="container-x">
        <Reveal className="max-w-2xl">
          <p className="mb-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-brand">
            <span className="h-px w-6 bg-brand" />
            Visítanos
          </p>
          <h2 className="font-display text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
            Estamos en el corazón de{" "}
            <span className="text-gradient">Bucaramanga</span>
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          {/* Información + formulario */}
          <Reveal>
            <div className="grid gap-4 sm:grid-cols-2">
              {company.addresses.map((a) => (
                <InfoCard key={a.label} icon={<MapPin size={18} />} title={a.label}>
                  {a.line}
                  <br />
                  {a.city}
                </InfoCard>
              ))}
              <InfoCard icon={<Clock size={18} />} title="Horario">
                {company.hours.map((h) => (
                  <span key={h.days} className="block">
                    {h.days}: {h.time}
                  </span>
                ))}
              </InfoCard>
              <InfoCard icon={<Phone size={18} />} title="Teléfono / WhatsApp">
                {company.phones.map((p) => (
                  <span key={p} className="block">
                    {p}
                  </span>
                ))}
              </InfoCard>
            </div>

            <div className="mt-4 flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-4">
              <Mail size={18} className="shrink-0 text-brand" />
              <a href={`mailto:${company.email}`} className="break-all text-sm hover:underline">
                {company.email}
              </a>
            </div>

            <form
              onSubmit={onSubmit}
              className="mt-4 rounded-[var(--radius-card)] border border-white/10 bg-white/5 p-5"
            >
              <h3 className="font-display text-lg font-bold">Solicita tu cotización</h3>
              <div className="mt-4 space-y-3">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Tu nombre"
                  required
                  className="w-full rounded-xl border border-white/10 bg-ink-soft px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-brand focus:outline-none"
                />
                <textarea
                  value={msg}
                  onChange={(e) => setMsg(e.target.value)}
                  placeholder="¿Qué material necesitas?"
                  rows={3}
                  required
                  className="w-full rounded-xl border border-white/10 bg-ink-soft px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-brand focus:outline-none"
                />
                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-brand px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
                >
                  <Send size={16} /> Enviar por WhatsApp
                </button>
              </div>
            </form>
          </Reveal>

          {/* Mapa */}
          <Reveal delay={150} className="flex flex-col">
            <div className="relative min-h-[320px] flex-1 overflow-hidden rounded-[var(--radius-card)] border border-white/10">
              <iframe
                title="Ubicación de MultiAceros B&M S.A.S"
                src="https://maps.google.com/maps?q=MULTIACEROS%20B%26M%20S.A.S%20Bucaramanga&z=15&output=embed"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 h-full w-full"
              />
            </div>
            <a
              href="https://www.google.com/maps/search/MULTIACEROS+B%26M+S.A.S+Bucaramanga"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-ink transition-colors hover:bg-white/90"
            >
              <Navigation size={16} className="text-brand" /> Cómo llegar
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function InfoCard({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
      <div className="flex items-center gap-2 text-brand">
        {icon}
        <span className="font-display text-sm font-semibold text-white">{title}</span>
      </div>
      <div className="mt-2 text-sm leading-relaxed text-white/70">{children}</div>
    </div>
  );
}
