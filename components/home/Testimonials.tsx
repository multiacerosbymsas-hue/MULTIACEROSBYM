import { Star, Quote } from "lucide-react";
import { testimonials } from "@/lib/data/testimonials";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

export function Testimonials() {
  return (
    <section id="testimonios" className="bg-paper py-20 lg:py-24">
      <div className="container-x">
        <SectionHeading
          eyebrow="Testimonios"
          title={
            <>
              Lo que dicen <span className="text-gradient">nuestros clientes</span>
            </>
          }
          sub="Opiniones reales de quienes confían en MultiAceros B&M."
        />

        <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <Reveal key={t.name} delay={(i % 3) * 80}>
              <figure className="flex h-full flex-col rounded-[var(--radius-card)] border border-line bg-white p-6 shadow-[var(--shadow-soft)]">
                <div className="flex items-center justify-between">
                  <div className="flex gap-0.5 text-brand">
                    {Array.from({ length: 5 }).map((_, s) => (
                      <Star key={s} size={16} fill="currentColor" />
                    ))}
                  </div>
                  <Quote size={28} className="text-line" />
                </div>
                <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-ink/80">
                  “{t.text}”
                </blockquote>
                <figcaption className="mt-5 flex items-center gap-3 border-t border-line pt-4">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-ink font-display font-bold text-white">
                    {t.initial}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-ink">{t.name}</p>
                    <p className="text-xs text-muted">{t.role}</p>
                  </div>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
