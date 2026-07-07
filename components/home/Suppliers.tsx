import Image from "next/image";
import { suppliers } from "@/lib/data/suppliers";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

export function Suppliers() {
  return (
    <section id="proveedores" className="py-20 lg:py-24">
      <div className="container-x">
        <SectionHeading
          eyebrow="Marcas aliadas"
          title={
            <>
              Respaldo de los <span className="text-gradient">grandes</span> del acero
            </>
          }
          sub="Trabajamos con los principales fabricantes de acero y ferretería del país."
        />

        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {suppliers.map((s, i) => (
            <Reveal key={s.name} delay={(i % 4) * 60}>
              <div className="flex h-full items-center gap-3 rounded-[var(--radius-card)] border border-line bg-white p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-soft)]">
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full ring-1 ring-black/5">
                  <Image
                    src={s.logo}
                    alt={`Logo de ${s.name}`}
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <p className="truncate font-display text-sm font-bold text-ink">
                    {s.name}
                  </p>
                  <p className="truncate text-xs text-muted">{s.tagline}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
