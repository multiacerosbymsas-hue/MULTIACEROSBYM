import type { Metadata } from "next";
import Image from "next/image";
import { categories } from "@/lib/data/categories";
import { getFamilyImages } from "@/lib/data/content.server";
import { updateFamilyImage, resetFamilyImage } from "@/lib/admin-actions";
import { SubmitButton } from "@/components/ui/SubmitButton";

export const metadata: Metadata = { title: "Panel · Fotos por familia" };

export default async function AdminFamilias({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string; error?: string }>;
}) {
  const { ok, error } = await searchParams;
  const overrides = await getFamilyImages();

  return (
    <div className="max-w-3xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-bold text-ink">
          Fotos por familia
        </h1>
        {ok && (
          <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
            Guardado ✓
          </span>
        )}
      </div>
      <p className="mt-1 text-sm text-muted">
        Cada familia del catálogo (varilla, tejas, tubería…) tiene una foto de
        portada. Sube aquí la tuya para reemplazarla; con “Restaurar” vuelve a
        la foto original.
      </p>
      {error && (
        <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
      )}

      <div className="mt-6 space-y-4">
        {categories.map((c) => {
          const custom = overrides[c.slug];
          return (
            <div
              key={c.slug}
              className="flex flex-wrap items-center gap-4 rounded-[var(--radius-card)] border border-line bg-white p-4"
            >
              <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-lg border border-line">
                <Image
                  src={custom || c.image}
                  alt={c.name}
                  fill
                  sizes="112px"
                  className="object-cover"
                />
              </div>

              <div className="min-w-0 flex-1">
                <p className="font-display text-sm font-bold text-ink">{c.name}</p>
                <p className="text-xs text-muted">
                  {custom ? "Foto personalizada ✓" : "Foto original del sitio"}
                </p>
              </div>

              <form
                action={updateFamilyImage}
                className="flex flex-wrap items-center gap-2"
              >
                <input type="hidden" name="slug" value={c.slug} />
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  required
                  aria-label={`Foto para ${c.name}`}
                  className="max-w-[180px] text-xs text-ink file:mr-2 file:rounded-full file:border-0 file:bg-paper file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-ink hover:file:bg-line"
                />
                <SubmitButton
                  className="rounded-full bg-brand px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-brand-dark"
                  pendingText="Subiendo…"
                >
                  Subir foto
                </SubmitButton>
              </form>

              {custom && (
                <form action={resetFamilyImage}>
                  <input type="hidden" name="slug" value={c.slug} />
                  <SubmitButton
                    className="rounded-full border border-line px-4 py-2 text-xs font-semibold text-muted transition-colors hover:text-ink"
                    pendingText="…"
                  >
                    Restaurar
                  </SubmitButton>
                </form>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
