import type { Metadata } from "next";
import Image from "next/image";
import { getPromo } from "@/lib/data/content.server";
import { updatePromo } from "@/lib/admin-actions";
import { SubmitButton } from "@/components/ui/SubmitButton";

export const metadata: Metadata = { title: "Panel · Promoción del mes" };

const input =
  "mt-1 block w-full rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink outline-none focus:border-brand";

export default async function AdminPromocion({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string }>;
}) {
  const { ok } = await searchParams;
  const promo = await getPromo();

  return (
    <div className="max-w-2xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-bold text-ink">
          Promoción del mes
        </h1>
        {ok && (
          <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
            Guardado ✓
          </span>
        )}
      </div>
      <p className="mt-1 text-sm text-muted">
        Es el aviso que aparece al entrar a la página (una vez por visita). Sube
        la foto del producto, escribe el texto y márcalo como activo. Para
        quitarlo del sitio, desmarca “Mostrar” y guarda.
      </p>

      <form action={updatePromo} className="mt-6 space-y-5">
        <input type="hidden" name="current_image" value={promo.image} />

        <fieldset className="rounded-[var(--radius-card)] border border-line bg-white p-5">
          <legend className="px-2 font-display text-sm font-bold text-ink">
            Foto del producto
          </legend>
          <div className="flex flex-wrap items-start gap-4">
            <div className="relative h-36 w-36 shrink-0 overflow-hidden rounded-xl border border-line bg-paper">
              {promo.image ? (
                <Image src={promo.image} alt="Foto actual" fill sizes="144px" className="object-cover" />
              ) : (
                <span className="flex h-full items-center justify-center p-3 text-center text-xs text-muted">
                  Aún no hay foto
                </span>
              )}
            </div>
            <label className="block flex-1 text-xs text-muted">
              {promo.image ? "Cambiar la foto (opcional)" : "Sube la foto (JPG o PNG, máx. 8 MB)"}
              <input
                type="file"
                name="image"
                accept="image/*"
                className="mt-2 block w-full text-sm text-ink file:mr-3 file:rounded-full file:border-0 file:bg-brand file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-brand-dark"
              />
              <span className="mt-2 block">
                Se ve mejor una foto cuadrada del producto (la chapa inteligente).
              </span>
            </label>
          </div>
        </fieldset>

        <fieldset className="grid gap-3 rounded-[var(--radius-card)] border border-line bg-white p-5">
          <legend className="px-2 font-display text-sm font-bold text-ink">Textos</legend>
          <label className="block text-xs text-muted">
            Etiqueta (cinta naranja)
            <input name="eyebrow" defaultValue={promo.eyebrow} className={input} />
          </label>
          <label className="block text-xs text-muted">
            Título
            <input name="title" defaultValue={promo.title} required className={input} />
          </label>
          <label className="block text-xs text-muted">
            Descripción
            <textarea name="text" defaultValue={promo.text} rows={3} className={input} />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="block text-xs text-muted">
              Texto del botón
              <input name="ctaLabel" defaultValue={promo.ctaLabel} className={input} />
            </label>
            <label className="block text-xs text-muted">
              Enlace del botón
              <input name="ctaHref" defaultValue={promo.ctaHref} placeholder="/#contacto" className={input} />
            </label>
          </div>
        </fieldset>

        <label className="flex items-center gap-3 rounded-[var(--radius-card)] border border-line bg-white p-5 text-sm font-medium text-ink">
          <input
            type="checkbox"
            name="enabled"
            defaultChecked={promo.enabled}
            className="h-5 w-5 accent-brand"
          />
          Mostrar la promoción en la página
          {!promo.image && (
            <span className="text-xs font-normal text-muted">
              (necesita una foto para poder mostrarse)
            </span>
          )}
        </label>

        <SubmitButton
          className="rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
          pendingText="Guardando…"
        >
          Guardar promoción
        </SubmitButton>
      </form>
    </div>
  );
}
