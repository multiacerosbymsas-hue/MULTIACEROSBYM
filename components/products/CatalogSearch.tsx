"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { ProductTable } from "./ProductTable";
import type { CatalogProduct } from "@/lib/data/catalog";

export function CatalogSearch({ products }: { products: CatalogProduct[] }) {
  const [q, setQ] = useState("");
  const [limit, setLimit] = useState(40);

  const term = q.trim().toLowerCase();
  const results = useMemo(() => {
    if (!term) return [];
    return products.filter(
      (p) => p.name.toLowerCase().includes(term) || p.code.includes(term)
    );
  }, [products, term]);

  return (
    <div>
      <div className="relative mb-6 max-w-2xl">
        <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
        <input
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setLimit(40);
          }}
          placeholder={`Buscar entre ${products.length.toLocaleString("es-CO")} productos por nombre o código…`}
          className="w-full rounded-full border border-line bg-white py-3.5 pl-11 pr-4 text-sm shadow-sm outline-none transition-colors focus:border-brand"
        />
      </div>

      {term === "" ? (
        <div className="rounded-xl border border-dashed border-line bg-paper py-14 text-center">
          <p className="text-muted">
            Escribe para buscar en todo el catálogo, o elige una familia arriba.
          </p>
        </div>
      ) : results.length === 0 ? (
        <div className="rounded-xl border border-dashed border-line bg-paper py-14 text-center text-muted">
          Sin resultados para “{q}”.
        </div>
      ) : (
        <>
          <p className="mb-4 font-mono text-[11px] uppercase tracking-wider text-muted">
            {results.length.toLocaleString("es-CO")} resultados
          </p>
          <ProductTable products={results.slice(0, limit)} />
          {limit < results.length && (
            <div className="mt-6 text-center">
              <button
                onClick={() => setLimit((l) => l + 60)}
                className="rounded-full border border-ink bg-white px-6 py-3 text-sm font-semibold text-ink transition-colors hover:bg-ink hover:text-white"
              >
                Ver más resultados
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
