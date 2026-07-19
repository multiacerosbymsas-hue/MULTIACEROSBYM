import type { Metadata } from "next";
import Image from "next/image";
import { getHeroSlides } from "@/lib/data/content.server";
import { HERO_IMAGE_OPTIONS, type HeroSlide } from "@/lib/data/content";
import { updateHeroSlides } from "@/lib/admin-actions";
import { SubmitButton } from "@/components/ui/SubmitButton";

export const metadata: Metadata = { title: "Panel · Contenido" };

const EMPTY: HeroSlide = {
  image: HERO_IMAGE_OPTIONS[0],
  eyebrow: "",
  title: "",
  subtitle: "",
  ctaLabel: "",
  ctaHref: "",
};

export default async function AdminContenido({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string }>;
}) {
  const { ok } = await searchParams;
  const current = await getHeroSlides();
  const slides = [...current, EMPTY]; // una ranura extra para agregar

  return (
    <div className="max-w-3xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-bold text-ink">
          Carrusel de portada
        </h1>
        {ok && (
          <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
            Guardado ✓
          </span>
        )}
      </div>
      <p className="mt-1 text-sm text-muted">
        Edita las diapositivas. Envuelve una palabra del título en{" "}
        <code className="rounded bg-paper px-1">*asteriscos*</code> para
        resaltarla en naranja. Para <strong>borrar</strong> una diapositiva, deja
        su título vacío. La última (en blanco) sirve para <strong>agregar</strong>.
      </p>

      <form action={updateHeroSlides} className="mt-6 space-y-5">
        <input type="hidden" name="count" value={slides.length} />

        {slides.map((s, i) => (
          <fieldset
            key={i}
            className="rounded-[var(--radius-card)] border border-line bg-white p-5"
          >
            <legend className="px-2 font-display text-sm font-bold text-ink">
              {i < current.length ? `Diapositiva ${i + 1}` : "➕ Nueva diapositiva"}
            </legend>

            <div className="flex gap-4">
              <div className="relative hidden h-24 w-32 shrink-0 overflow-hidden rounded-lg border border-line sm:block">
                <Image src={s.image} alt="" fill sizes="128px" className="object-cover" />
              </div>

              <div className="grid flex-1 gap-3">
                <label className="block text-xs text-muted">
                  Imagen
                  <select
                    name={`s${i}_image`}
                    defaultValue={s.image}
                    className="mt-1 block w-full rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink outline-none focus:border-brand"
                  >
                    {HERO_IMAGE_OPTIONS.map((img) => (
                      <option key={img} value={img}>
                        {img.replace("/images/", "")}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block text-xs text-muted">
                  Etiqueta (arriba)
                  <input
                    name={`s${i}_eyebrow`}
                    defaultValue={s.eyebrow}
                    className="mt-1 block w-full rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink outline-none focus:border-brand"
                  />
                </label>

                <label className="block text-xs text-muted">
                  Título (usa *palabra* para resaltar)
                  <input
                    name={`s${i}_title`}
                    defaultValue={s.title}
                    className="mt-1 block w-full rounded-lg border border-line bg-white px-3 py-2 text-sm font-medium text-ink outline-none focus:border-brand"
                  />
                </label>

                <label className="block text-xs text-muted">
                  Subtítulo
                  <textarea
                    name={`s${i}_subtitle`}
                    defaultValue={s.subtitle}
                    rows={2}
                    className="mt-1 block w-full rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink outline-none focus:border-brand"
                  />
                </label>

                <div className="grid grid-cols-2 gap-3">
                  <label className="block text-xs text-muted">
                    Texto del botón
                    <input
                      name={`s${i}_ctaLabel`}
                      defaultValue={s.ctaLabel}
                      className="mt-1 block w-full rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink outline-none focus:border-brand"
                    />
                  </label>
                  <label className="block text-xs text-muted">
                    Enlace del botón
                    <input
                      name={`s${i}_ctaHref`}
                      defaultValue={s.ctaHref}
                      placeholder="/catalogo"
                      className="mt-1 block w-full rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink outline-none focus:border-brand"
                    />
                  </label>
                </div>
              </div>
            </div>
          </fieldset>
        ))}

        <SubmitButton
          className="rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
          pendingText="Guardando…"
        >
          Guardar carrusel
        </SubmitButton>
      </form>
    </div>
  );
}
