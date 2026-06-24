import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { categories } from "@/lib/data/categories";
import { getCatalog } from "@/lib/data/catalog.server";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

export async function Categories() {
  const { families } = await getCatalog();
  const countOf = (slug: string) =>
    families.find((f) => f.slug === slug)?.count ?? 0;

  return (
    <section id="categorias" className="py-20 lg:py-24">
      <div className="container-x">
        <SectionHeading
          eyebrow="Nuestro catálogo"
          title={
            <>
              Líneas que <span className="text-gradient">construyen</span> proyectos
            </>
          }
          sub="Explora nuestras familias de producto. Más de 1.600 referencias en acero, cubiertas, obra gris y ferretería."
        />

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((cat, i) => (
            <Reveal key={cat.slug} delay={(i % 4) * 70}>
              <Link
                href={`/categoria/${cat.slug}`}
                className="group relative flex h-full flex-col overflow-hidden rounded-[var(--radius-card)] border border-line bg-white shadow-[var(--shadow-soft)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-card)]"
              >
                <div className="relative aspect-[16/11] overflow-hidden">
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />
                  <div className="absolute bottom-3 left-4 right-4">
                    <h3 className="font-display text-lg font-bold text-white">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-white/80">
                      {countOf(cat.slug)} referencias
                    </p>
                  </div>
                  <span className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-ink opacity-0 transition-all duration-300 group-hover:opacity-100">
                    <ArrowUpRight size={18} />
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-4">
                  <p className="text-sm text-muted">{cat.blurb}</p>
                  <ul className="mt-3 space-y-1 border-t border-line pt-3">
                    {cat.includes.slice(0, 3).map((inc) => (
                      <li
                        key={inc}
                        className="flex items-start gap-2 text-xs text-ink/70"
                      >
                        <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-brand" />
                        {inc}
                      </li>
                    ))}
                  </ul>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/catalogo"
            className="group inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-brand/25 transition-all hover:bg-brand-dark"
          >
            Ver todo el catálogo
            <ArrowUpRight
              size={18}
              className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
