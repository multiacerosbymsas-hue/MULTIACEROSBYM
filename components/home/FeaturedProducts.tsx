"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { featuredProducts } from "@/lib/data/products";
import { categories } from "@/lib/data/categories";
import { ProductCard } from "@/components/products/ProductCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

const filters = [
  { slug: "todos", label: "Todos" },
  ...categories
    .filter((c) => featuredProducts.some((p) => p.category === c.slug))
    .map((c) => ({ slug: c.slug, label: c.name.split(",")[0].split(" y ")[0] })),
];

export function FeaturedProducts() {
  const [active, setActive] = useState("todos");
  const shown =
    active === "todos"
      ? featuredProducts
      : featuredProducts.filter((p) => p.category === active);

  return (
    <section id="destacados" className="bg-paper py-20 lg:py-24">
      <div className="container-x">
        <SectionHeading
          eyebrow="Más vendidos"
          title={
            <>
              Productos <span className="text-gradient">destacados</span>
            </>
          }
          sub="Una muestra de nuestro catálogo. Agrégalos a tu cotización y finaliza por WhatsApp."
        />

        <Reveal className="mt-8 flex flex-wrap justify-center gap-2">
          {filters.map((f) => (
            <button
              key={f.slug}
              onClick={() => setActive(f.slug)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                active === f.slug
                  ? "bg-ink text-white"
                  : "border border-line bg-white text-ink/70 hover:border-ink"
              }`}
            >
              {f.label}
            </button>
          ))}
        </Reveal>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {shown.map((p) => (
            <ProductCard key={p.id} p={p} />
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/catalogo"
            className="group inline-flex items-center gap-2 rounded-full border border-ink bg-white px-6 py-3.5 text-sm font-semibold text-ink transition-all hover:bg-ink hover:text-white"
          >
            Ver todo el catálogo
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
