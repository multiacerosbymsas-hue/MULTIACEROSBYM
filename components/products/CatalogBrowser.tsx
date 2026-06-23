"use client";

import { useMemo, useState, type ReactNode } from "react";
import { Search, SlidersHorizontal, X, RotateCcw } from "lucide-react";
import { ProductGridCard } from "./ProductGridCard";
import { catalogFamilies, type CatalogProduct } from "@/lib/data/catalog";

type SortKey = "relevancia" | "precio-asc" | "precio-desc" | "nombre";

const tidy = (s: string) =>
  s.replace(/\s*\(\d+\)\s*$/, "").replace(/\s*\d+%\s*$/, "").trim();

export function CatalogBrowser({
  products,
  lockedFamily,
}: {
  products: CatalogProduct[];
  lockedFamily?: string;
}) {
  const [q, setQ] = useState("");
  const [family, setFamily] = useState(lockedFamily ?? "todas");
  const [section, setSection] = useState("todas");
  const [price, setPrice] = useState<"todos" | "con" | "cotizar">("todos");
  const [sort, setSort] = useState<SortKey>("relevancia");
  const [limit, setLimit] = useState(24);
  const [drawer, setDrawer] = useState(false);

  const families = useMemo(() => {
    const m = new Map<string, number>();
    products.forEach((p) => m.set(p.family, (m.get(p.family) || 0) + 1));
    return catalogFamilies
      .filter((f) => m.has(f.slug))
      .map((f) => ({ slug: f.slug, name: f.name, count: m.get(f.slug)! }));
  }, [products]);

  const sections = useMemo(() => {
    const pool =
      family === "todas" ? products : products.filter((p) => p.family === family);
    const m = new Map<string, number>();
    pool.forEach((p) => m.set(p.section, (m.get(p.section) || 0) + 1));
    return Array.from(m.entries()).sort((a, b) => b[1] - a[1]);
  }, [products, family]);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    let r = products.filter((p) => {
      if (term && !(p.name.toLowerCase().includes(term) || p.code.includes(term)))
        return false;
      if (family !== "todas" && p.family !== family) return false;
      if (section !== "todas" && p.section !== section) return false;
      if (price === "con" && !p.price) return false;
      if (price === "cotizar" && p.price) return false;
      return true;
    });
    if (sort === "precio-asc")
      r = [...r].sort((a, b) => (a.price ?? Infinity) - (b.price ?? Infinity));
    else if (sort === "precio-desc")
      r = [...r].sort((a, b) => (b.price ?? -1) - (a.price ?? -1));
    else if (sort === "nombre")
      r = [...r].sort((a, b) => a.name.localeCompare(b.name));
    return r;
  }, [products, q, family, section, price, sort]);

  const visible = filtered.slice(0, limit);

  const setFam = (f: string) => {
    setFamily(f);
    setSection("todas");
    setLimit(24);
  };
  const clearAll = () => {
    setQ("");
    setSection("todas");
    setPrice("todos");
    setSort("relevancia");
    setLimit(24);
    if (!lockedFamily) setFamily("todas");
  };
  const activeCount =
    (q ? 1 : 0) +
    (!lockedFamily && family !== "todas" ? 1 : 0) +
    (section !== "todas" ? 1 : 0) +
    (price !== "todos" ? 1 : 0);

  const filters: ReactNode = (
    <div className="space-y-7">
      <div>
        <p className="mb-2 font-mono text-[11px] font-semibold uppercase tracking-wider text-muted">
          Buscar
        </p>
        <div className="relative">
          <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setLimit(24);
            }}
            placeholder="Nombre o código…"
            className="w-full rounded-lg border border-line bg-white py-2.5 pl-9 pr-3 text-sm outline-none transition-colors focus:border-brand"
          />
        </div>
      </div>

      {!lockedFamily && families.length > 1 && (
        <FilterGroup title="Familia">
          <FilterOption active={family === "todas"} onClick={() => setFam("todas")} label="Todas" count={products.length} />
          {families.map((f) => (
            <FilterOption key={f.slug} active={family === f.slug} onClick={() => setFam(f.slug)} label={f.name} count={f.count} />
          ))}
        </FilterGroup>
      )}

      {sections.length > 1 && (
        <FilterGroup title="Sección">
          <FilterOption active={section === "todas"} onClick={() => { setSection("todas"); setLimit(24); }} label="Todas" />
          {sections.map(([name, count]) => (
            <FilterOption key={name} active={section === name} onClick={() => { setSection(name); setLimit(24); }} label={tidy(name)} count={count} />
          ))}
        </FilterGroup>
      )}

      <FilterGroup title="Disponibilidad">
        <FilterOption active={price === "todos"} onClick={() => { setPrice("todos"); setLimit(24); }} label="Todos" />
        <FilterOption active={price === "con"} onClick={() => { setPrice("con"); setLimit(24); }} label="Con precio" />
        <FilterOption active={price === "cotizar"} onClick={() => { setPrice("cotizar"); setLimit(24); }} label="Bajo cotización" />
      </FilterGroup>

      {activeCount > 0 && (
        <button onClick={clearAll} className="inline-flex items-center gap-1.5 text-sm font-medium text-brand hover:underline">
          <RotateCcw size={14} /> Limpiar filtros
        </button>
      )}
    </div>
  );

  return (
    <div className="lg:grid lg:grid-cols-[250px_1fr] lg:gap-8">
      <aside className="hidden lg:block">
        <div className="sticky top-24 rounded-xl border border-line bg-white p-5">
          {filters}
        </div>
      </aside>

      <div>
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setDrawer(true)}
              className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold text-ink lg:hidden"
            >
              <SlidersHorizontal size={16} /> Filtros
              {activeCount > 0 && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand text-[11px] text-white">
                  {activeCount}
                </span>
              )}
            </button>
            <p className="font-mono text-[11px] uppercase tracking-wider text-muted">
              {filtered.length.toLocaleString("es-CO")} productos
            </p>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <span className="hidden text-muted sm:inline">Ordenar:</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="rounded-lg border border-line bg-white px-3 py-2 text-sm outline-none focus:border-brand"
            >
              <option value="relevancia">Relevancia</option>
              <option value="precio-asc">Precio: menor a mayor</option>
              <option value="precio-desc">Precio: mayor a menor</option>
              <option value="nombre">Nombre (A–Z)</option>
            </select>
          </label>
        </div>

        {visible.length === 0 ? (
          <div className="rounded-xl border border-dashed border-line bg-paper py-20 text-center text-muted">
            No hay productos con esos filtros.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 xl:grid-cols-3">
            {visible.map((p) => (
              <ProductGridCard key={p.slug} p={p} />
            ))}
          </div>
        )}

        {limit < filtered.length && (
          <div className="mt-8 text-center">
            <button
              onClick={() => setLimit((l) => l + 24)}
              className="rounded-full border border-ink bg-white px-6 py-3 text-sm font-semibold text-ink transition-colors hover:bg-ink hover:text-white"
            >
              Cargar más ({(filtered.length - limit).toLocaleString("es-CO")} restantes)
            </button>
          </div>
        )}
      </div>

      {/* Drawer móvil */}
      {drawer && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div className="absolute inset-0 bg-ink/50" onClick={() => setDrawer(false)} />
          <div className="absolute left-0 top-0 flex h-full w-[85%] max-w-xs flex-col bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <span className="font-display font-bold">Filtros</span>
              <button onClick={() => setDrawer(false)} className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-paper" aria-label="Cerrar">
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-5">{filters}</div>
            <div className="border-t border-line p-4">
              <button onClick={() => setDrawer(false)} className="w-full rounded-full bg-brand px-5 py-3 text-sm font-semibold text-white">
                Ver {filtered.length.toLocaleString("es-CO")} productos
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function FilterGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <p className="mb-2.5 font-mono text-[11px] font-semibold uppercase tracking-wider text-muted">
        {title}
      </p>
      <div className="max-h-64 space-y-0.5 overflow-y-auto pr-1">{children}</div>
    </div>
  );
}

function FilterOption({
  active,
  onClick,
  label,
  count,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  count?: number;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center justify-between gap-2 rounded-lg px-2.5 py-1.5 text-left text-sm transition-colors ${
        active ? "bg-ink text-white" : "text-ink/75 hover:bg-paper"
      }`}
    >
      <span className="truncate">{label}</span>
      {count !== undefined && (
        <span className={`shrink-0 font-mono text-[10px] ${active ? "text-white/60" : "text-muted"}`}>
          {count}
        </span>
      )}
    </button>
  );
}
