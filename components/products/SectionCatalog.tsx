"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { ProductTable } from "./ProductTable";
import type { CatalogProduct } from "@/lib/data/catalog";

function tidy(s: string) {
  return s
    .replace(/\s*\(\d+\)\s*$/, "")
    .replace(/\s*\d+%\s*$/, "")
    .trim();
}
const anchor = (s: string) =>
  "sec-" + s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export function SectionCatalog({ products }: { products: CatalogProduct[] }) {
  const [q, setQ] = useState("");

  const sectionsIndex = useMemo(() => {
    const m = new Map<string, number>();
    products.forEach((p) => m.set(p.section, (m.get(p.section) || 0) + 1));
    return Array.from(m.entries());
  }, [products]);

  const groups = useMemo(() => {
    const term = q.trim().toLowerCase();
    const map = new Map<string, CatalogProduct[]>();
    products
      .filter(
        (p) =>
          !term ||
          p.name.toLowerCase().includes(term) ||
          p.code.includes(term)
      )
      .forEach((p) => {
        const arr = map.get(p.section) ?? [];
        arr.push(p);
        map.set(p.section, arr);
      });
    return Array.from(map.entries());
  }, [products, q]);

  return (
    <div>
      {/* Buscador */}
      <div className="relative mb-5 max-w-xl">
        <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar en esta categoría (nombre o código)…"
          className="w-full rounded-full border border-line bg-white py-3 pl-11 pr-4 text-sm outline-none transition-colors focus:border-brand"
        />
      </div>

      {/* Índice de secciones (saltos) */}
      {!q && sectionsIndex.length > 1 && (
        <div className="mb-9 flex flex-wrap gap-2">
          {sectionsIndex.map(([name, count]) => (
            <a
              key={name}
              href={`#${anchor(name)}`}
              className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-3 py-1.5 text-xs font-medium text-ink/70 transition-colors hover:border-ink hover:text-ink"
            >
              {tidy(name)}
              <span className="font-mono text-[10px] text-muted">{count}</span>
            </a>
          ))}
        </div>
      )}

      {/* Tablas por sección */}
      {groups.length === 0 ? (
        <div className="rounded-xl border border-dashed border-line bg-paper py-16 text-center text-muted">
          Sin resultados para “{q}”.
        </div>
      ) : (
        <div className="space-y-10">
          {groups.map(([section, items]) => (
            <section key={section} id={anchor(section)} className="scroll-mt-28">
              <div className="mb-3 flex items-baseline justify-between gap-3 border-b-2 border-ink/10 pb-2">
                <h2 className="font-display text-lg font-bold text-ink">
                  {tidy(section)}
                </h2>
                <span className="shrink-0 font-mono text-[11px] uppercase tracking-wider text-muted">
                  {items.length} {items.length === 1 ? "ítem" : "ítems"}
                </span>
              </div>
              <ProductTable products={items} />
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
