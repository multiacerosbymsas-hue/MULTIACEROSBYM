import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { getCatalog } from "@/lib/data/catalog.server";
import { categories } from "@/lib/data/categories";
import { createProduct } from "@/lib/admin-actions";

export const metadata: Metadata = { title: "Panel · Nuevo producto" };

export default async function NuevoProducto({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const { references } = await getCatalog();
  const sections = Array.from(new Set(references.map((r) => r.section))).sort();

  return (
    <div className="max-w-xl">
      <Link
        href="/admin/productos"
        className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-ink"
      >
        <ArrowLeft size={15} /> Volver a productos
      </Link>

      <h1 className="mt-3 font-display text-2xl font-bold text-ink">Nuevo producto</h1>
      <p className="mt-1 text-sm text-muted">
        El producto se agrupará bajo su <strong>sección</strong> (referencia) y
        aparecerá en el sitio al guardar.
      </p>

      {error && (
        <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
      )}

      <form action={createProduct} className="mt-6 space-y-4 rounded-[var(--radius-card)] border border-line bg-white p-6">
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-ink">Nombre *</span>
          <input
            name="name"
            required
            placeholder="Ej: V. Corrug. 7/8 x 6mts"
            className="w-full rounded-xl border border-line bg-white px-4 py-2.5 text-sm outline-none focus:border-brand"
          />
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-ink">Código</span>
            <input
              name="code"
              placeholder="Opcional"
              className="w-full rounded-xl border border-line bg-white px-4 py-2.5 text-sm outline-none focus:border-brand"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-ink">Familia *</span>
            <select
              name="family"
              required
              defaultValue=""
              className="w-full rounded-xl border border-line bg-white px-4 py-2.5 text-sm text-ink outline-none focus:border-brand"
            >
              <option value="" disabled>
                Elige una familia…
              </option>
              {categories.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="block">
          <span className="mb-1 block text-sm font-medium text-ink">
            Sección / referencia *
          </span>
          <input
            name="section"
            required
            list="secciones"
            placeholder="Escribe una nueva o elige existente…"
            className="w-full rounded-xl border border-line bg-white px-4 py-2.5 text-sm outline-none focus:border-brand"
          />
          <datalist id="secciones">
            {sections.map((s) => (
              <option key={s} value={s} />
            ))}
          </datalist>
          <span className="mt-1 block text-xs text-muted">
            Productos con la misma sección se agrupan en una sola referencia (ej.
            “VARILLA CORRUGADA”).
          </span>
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-ink">Precio (COP)</span>
            <input
              name="price"
              inputMode="numeric"
              placeholder="Vacío = cotizar"
              className="w-full rounded-xl border border-line bg-white px-4 py-2.5 text-sm outline-none focus:border-brand"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-ink">Peso (kg)</span>
            <input
              name="weight_kg"
              inputMode="decimal"
              placeholder="Opcional"
              className="w-full rounded-xl border border-line bg-white px-4 py-2.5 text-sm outline-none focus:border-brand"
            />
          </label>
        </div>

        <label className="flex items-center gap-2.5">
          <input type="checkbox" name="active" defaultChecked className="h-4 w-4 accent-brand" />
          <span className="text-sm text-ink">Visible en el sitio</span>
        </label>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            className="rounded-full bg-brand px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
          >
            Crear producto
          </button>
          <Link
            href="/admin/productos"
            className="rounded-full border border-line px-6 py-2.5 text-sm font-semibold text-ink hover:border-ink"
          >
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  );
}
