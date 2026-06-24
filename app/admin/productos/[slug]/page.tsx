import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { updateProduct } from "@/lib/admin-actions";

export const metadata: Metadata = { title: "Panel · Editar producto" };

export default async function EditarProducto({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: p } = await supabase
    .from("products")
    .select("code, name, slug, price, weight_kg, section, family, active")
    .eq("slug", slug)
    .maybeSingle();
  if (!p) notFound();

  return (
    <div className="max-w-xl">
      <Link
        href="/admin/productos"
        className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-ink"
      >
        <ArrowLeft size={15} /> Volver a productos
      </Link>

      <h1 className="mt-3 font-display text-2xl font-bold text-ink">Editar producto</h1>
      <p className="mt-1 font-mono text-[11px] uppercase tracking-wider text-muted">
        Cód. {p.code} · {p.section}
      </p>

      <form action={updateProduct} className="mt-6 space-y-4 rounded-[var(--radius-card)] border border-line bg-white p-6">
        <input type="hidden" name="slug" value={p.slug} />

        <label className="block">
          <span className="mb-1 block text-sm font-medium text-ink">Nombre</span>
          <input
            name="name"
            defaultValue={p.name}
            required
            className="w-full rounded-xl border border-line bg-white px-4 py-2.5 text-sm outline-none focus:border-brand"
          />
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-ink">Precio (COP)</span>
            <input
              name="price"
              inputMode="numeric"
              defaultValue={p.price ?? ""}
              placeholder="Vacío = cotizar"
              className="w-full rounded-xl border border-line bg-white px-4 py-2.5 text-sm outline-none focus:border-brand"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-ink">Peso (kg)</span>
            <input
              name="weight_kg"
              inputMode="decimal"
              defaultValue={p.weight_kg ?? ""}
              placeholder="Opcional"
              className="w-full rounded-xl border border-line bg-white px-4 py-2.5 text-sm outline-none focus:border-brand"
            />
          </label>
        </div>

        <label className="flex items-center gap-2.5">
          <input
            type="checkbox"
            name="active"
            defaultChecked={p.active}
            className="h-4 w-4 accent-brand"
          />
          <span className="text-sm text-ink">Visible en el sitio</span>
        </label>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            className="rounded-full bg-brand px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
          >
            Guardar cambios
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
