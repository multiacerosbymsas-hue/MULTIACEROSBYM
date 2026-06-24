import Link from "next/link";
import type { Metadata } from "next";
import { Search, Pencil } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { formatCOP } from "@/lib/utils/format";

export const metadata: Metadata = { title: "Panel · Productos" };

export default async function AdminProductos({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; ok?: string }>;
}) {
  const { q, ok } = await searchParams;
  const term = (q ?? "").replace(/[%,()*]/g, "").trim();

  const supabase = await createClient();
  let query = supabase
    .from("products")
    .select("code, name, slug, price, section, active")
    .order("sort", { ascending: true })
    .limit(60);
  if (term) query = query.or(`name.ilike.%${term}%,code.ilike.%${term}%`);
  const { data: products } = await query;

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
        {(products?.length ?? 0)} mostrados{term ? ` para "${term}"` : " (primeros 60 — busca para filtrar)"}
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
    </div>
  );
}
