import Link from "next/link";
import type { Metadata } from "next";
import { Search, Pencil, ChevronLeft, ChevronRight } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { formatCOP } from "@/lib/utils/format";

export const metadata: Metadata = { title: "Panel · Productos" };

const PAGE_SIZE = 50;

export default async function AdminProductos({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string; ok?: string }>;
}) {
  const { q, page: pageRaw, ok } = await searchParams;
  const term = (q ?? "").replace(/[%,()*]/g, "").trim();
  const page = Math.max(1, Number(pageRaw) || 1);
  const from = (page - 1) * PAGE_SIZE;

  const supabase = await createClient();
  let query = supabase
    .from("products")
    .select("code, name, slug, price, section, active", { count: "exact" })
    .order("sort", { ascending: true })
    .range(from, from + PAGE_SIZE - 1);
  if (term) query = query.or(`name.ilike.%${term}%,code.ilike.%${term}%`);
  const { data: products, count } = await query;

  const total = count ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const shownFrom = total === 0 ? 0 : from + 1;
  const shownTo = Math.min(from + PAGE_SIZE, total);

  const pageHref = (pg: number) => {
    const sp = new URLSearchParams();
    if (term) sp.set("q", term);
    sp.set("page", String(pg));
    return `/admin/productos?${sp.toString()}`;
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-bold text-ink">Productos</h1>
        {ok && (
          <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
            Cambios guardados ✓
          </span>
        )}
      </div>

      <form className="mt-4 max-w-md">
        <div className="relative">
          <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            name="q"
            defaultValue={q ?? ""}
            placeholder="Buscar por nombre o código…"
            className="w-full rounded-lg border border-line bg-white py-2.5 pl-9 pr-3 text-sm outline-none focus:border-brand"
          />
        </div>
      </form>

      <p className="mt-4 font-mono text-[11px] uppercase tracking-wider text-muted">
        {total.toLocaleString("es-CO")} {term ? `resultados para "${term}"` : "productos"}
        {total > 0 && ` · mostrando ${shownFrom}–${shownTo}`}
      </p>

      <div className="mt-3 overflow-hidden rounded-xl border border-line bg-white">
        <ul className="divide-y divide-line">
          {(products ?? []).map((p) => (
            <li key={p.slug} className="flex items-center gap-3 px-4 py-3 hover:bg-paper">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-ink">{p.name}</p>
                <p className="font-mono text-[11px] text-muted">
                  {p.code} · {p.section}
                  {!p.active && " · OCULTO"}
                </p>
              </div>
              <span className="shrink-0 font-display text-sm font-bold text-ink">
                {p.price != null ? formatCOP(p.price) : "—"}
              </span>
              <Link
                href={`/admin/productos/${p.slug}`}
                className="inline-flex shrink-0 items-center gap-1 rounded-full border border-line px-3 py-1.5 text-xs font-semibold text-ink hover:border-ink"
              >
                <Pencil size={13} /> Editar
              </Link>
            </li>
          ))}
          {(products?.length ?? 0) === 0 && (
            <li className="px-4 py-10 text-center text-sm text-muted">Sin resultados.</li>
          )}
        </ul>
      </div>

      {totalPages > 1 && (
        <div className="mt-5 flex items-center justify-between gap-3">
          {page > 1 ? (
            <Link
              href={pageHref(page - 1)}
              className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold text-ink hover:border-ink"
            >
              <ChevronLeft size={15} /> Anterior
            </Link>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-paper px-4 py-2 text-sm font-semibold text-muted">
              <ChevronLeft size={15} /> Anterior
            </span>
          )}

          <span className="font-mono text-xs text-muted">
            Página {page} de {totalPages}
          </span>

          {page < totalPages ? (
            <Link
              href={pageHref(page + 1)}
              className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold text-ink hover:border-ink"
            >
              Siguiente <ChevronRight size={15} />
            </Link>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-paper px-4 py-2 text-sm font-semibold text-muted">
              Siguiente <ChevronRight size={15} />
            </span>
          )}
        </div>
      )}
    </div>
  );
}
