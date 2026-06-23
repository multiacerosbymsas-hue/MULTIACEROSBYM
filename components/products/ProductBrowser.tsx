"use client";

import { useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { CatalogCard } from "./CatalogCard";
import { catalogFamilies, type CatalogProduct } from "@/lib/data/catalog";

const PAGE = 24;

function shorten(s: string) {
  const t = s.replace(/\s*\(\d+\)\s*$/, "").replace(/\s*\d+%\s*$/, "").trim();
  return t.length > 26 ? t.slice(0, 26) + "…" : t;
}

export function ProductBrowser({ products }: { products: CatalogProduct[] }) {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("todos");
  const [limit, setLimit] = useState(PAGE);

  const familiesPresent = useMemo(
    () => Array.from(new Set(products.map((p) => p.family))),
    [products]
  );
  const singleFamily = familiesPresent.length <= 1;

  const sections = useMemo(() => {
    const m = new Map<string, number>();
    products.forEach((p) => m.set(p.section, (m.get(p.section) || 0) + 1));
    return Array.from(m.entries()).sort((a, b) => b[1] - a[1]);
  }, [products]);

  const chips = singleFamily
    ? sections.map(([name]) => ({ key: name, label: shorten(name) }))
    : catalogFamilies
        .filter((f) => familiesPresent.includes(f.slug))
        .map((f) => ({ key: f.slug, label: f.name }));

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return products.filter((p) => {
      const okText =
        !term ||
        p.name.toLowerCase().includes(term) ||
        p.code.includes(term);
      const okFilter =
        filter === "todos" ||
        (singleFamily ? p.section === filter : p.family === filter);
      return okText && okFilter;
    });
  }, [products, q, filter, singleFamily]);

  const visible = filtered.slice(0, limit);

  const reset = () => setLimit(PAGE);

  return (
    <div>
      {/* Buscador */}
      <div className="relative mb-4">
        <Search
          size={18}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted"
        />
        <input
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            reset();
          }}
          placeholder="Buscar por nombre o código…"
          className="w-full rounded-full border border-line bg-white py-3 pl-11 pr-4 text-sm text-ink shadow-sm outline-none transition-colors focus:border-brand"
        />
      </div>

      {/* Filtros */}
      <div className="mb-5 flex items-center gap-2 overflow-x-auto pb-1">
        <span className="flex shrink-0 items-center gap-1.5 text-xs font-semibold text-muted">
          <SlidersHorizontal size={14} />
        </span>
        <button
          onClick={() => {
            setFilter("todos");
            reset();
          }}
          className={`shrink-0 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
            filter === "todos"
              ? "bg-ink text-white"
              : "border border-line bg-white text-ink/70 hover:border-ink"
          }`}
        >
          Todos
        </button>
        {chips.map((c) => (
          <button
            key={c.key}
            onClick={() => {
              setFilter(c.key);
              reset();
            }}
            className={`shrink-0 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
              filter === c.key
                ? "bg-ink text-white"
                : "border border-line bg-white text-ink/70 hover:border-ink"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      <p className="mb-4 text-sm text-muted">
        {filtered.length.toLocaleString("es-CO")} productos
      </p>

      {visible.length === 0 ? (
        <div className="rounded-[var(--radius-card)] border border-dashed border-line bg-paper py-16 text-center text-muted">
          No encontramos productos con ese criterio.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {visible.map((p) => (
            <CatalogCard key={p.slug} p={p} />
          ))}
        </div>
      )}

      {limit < filtered.length && (
        <div className="mt-8 text-center">
          <button
            onClick={() => setLimit((l) => l + PAGE * 2)}
            className="rounded-full border border-ink bg-white px-6 py-3 text-sm font-semibold text-ink transition-colors hover:bg-ink hover:text-white"
          >
            Cargar más productos
          </button>
        </div>
      )}
    </div>
  );
}
