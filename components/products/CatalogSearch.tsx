"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Search } from "lucide-react";
import { ProductGridCard } from "./ProductGridCard";
import type { CatalogProduct } from "@/lib/data/catalog";

export function CatalogSearch({ products }: { products: CatalogProduct[] }) {
  const [q, setQ] = useState("");
  const [limit, setLimit] = useState(24);

  const term = q.trim().toLowerCase();
  const results = useMemo(() => {
    if (!term) return [];
    return products.filter(
      (p) => p.name.toLowerCase().includes(term) || p.code.includes(term)
    );
  }, [products, term]);

  return (
    <div>
      <div className="mb-6 flex max-w-2xl items-center gap-3">
        <Image
          src="/images/logo-mark.png"
          alt="MultiAceros B&M"
          width={48}
          height={48}
          className="shrink-0 rounded-lg shadow-sm"
        />
        <div className="relative flex-1">
          <Search
            size={18}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted"
          />
          <input
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setLimit(24);
            }}
            aria-label="Buscar en el catálogo"
            placeholder={`Buscar entre ${products.length.toLocaleString("es-CO")} productos por nombre o código…`}
            className="w-full rounded-full border border-line bg-white py-3.5 pl-11 pr-4 text-sm shadow-sm outline-none transition-colors focus:border-brand"
          />
        </div>
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
          <div className="grid grid-cols-2 gap-4 xl:grid-cols-3">
            {results.slice(0, limit).map((p) => (
              <ProductGridCard key={p.slug} p={p} />
            ))}
          </div>
          {limit < results.length && (
            <div className="mt-8 text-center">
              <button
                onClick={() => setLimit((l) => l + 24)}
                className="rounded-full border border-ink bg-white px-6 py-3 text-sm font-semibold text-ink transition-colors hover:bg-ink hover:text-white"
              >
                Ver más resultados ({(results.length - limit).toLocaleString("es-CO")} restantes)
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
