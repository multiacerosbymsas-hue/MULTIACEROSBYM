import { ShieldCheck, Users, Truck, BadgePercent } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

const services = [
  {
    icon: ShieldCheck,
    title: "Calidad certificada",
    desc: "Material con certificación y respaldo de las marcas más reconocidas del país.",
  },
  {
    icon: Users,
    title: "Asesoría especializada",
    desc: "Te orientamos según la necesidad real de tu proyecto: ni más, ni menos.",
  },
  {
    icon: Truck,
    title: "Despacho ágil",
    desc: "Domicilios en el área metropolitana y recogida en punto físico.",
  },
  {
    icon: BadgePercent,
    title: "Precios mayoristas",
    desc: "Atención preferencial y los mejores precios para constructores y mayoristas.",
  },
];

export function WhyUs() {
  return (
    <section id="servicios" className="bg-paper py-20 lg:py-24">
      <div className="container-x">
        <SectionHeading
          eyebrow="¿Por qué elegirnos?"
          title={
            <>
              Más que una ferretería, un{" "}
              <span className="text-gradient">aliado</span> para tu obra
            </>
          }
        />

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((s, i) => (
            <Reveal key={s.title} delay={(i % 4) * 80}>
              <article className="group h-full rounded-[var(--radius-card)] border border-line bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-card)]">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-tint text-brand transition-colors group-hover:bg-brand group-hover:text-white">
                  <s.icon size={24} />
                </div>
                <h3 className="mt-4 font-display text-lg font-bold text-ink">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{s.desc}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
