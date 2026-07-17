import "server-only";
import { cache } from "react";
import { supabasePublic } from "@/lib/supabase/public";
import {
  DEFAULT_HERO_SLIDES,
  DEFAULT_PROMO,
  type FamilyImages,
  type HeroSlide,
  type PromoContent,
} from "./content";

/** Lee una clave de site_content (null si no existe). */
async function readContent<T>(key: string): Promise<T | null> {
  const { data } = await supabasePublic
    .from("site_content")
    .select("value")
    .eq("key", key)
    .maybeSingle();
  return (data?.value as T | undefined) ?? null;
}

/** Lee las diapositivas del carrusel desde site_content; usa las de defecto si no hay. */
export const getHeroSlides = cache(async (): Promise<HeroSlide[]> => {
  const slides = await readContent<HeroSlide[]>("hero_slides");
  return Array.isArray(slides) && slides.length ? slides : DEFAULT_HERO_SLIDES;
});

/** Promoción del mes (popup de entrada). */
export const getPromo = cache(async (): Promise<PromoContent> => {
  const v = await readContent<Partial<PromoContent>>("promo_month");
  return { ...DEFAULT_PROMO, ...(v ?? {}) };
});

/** Fotos personalizadas por familia del catálogo ({ slug: url }). */
export const getFamilyImages = cache(async (): Promise<FamilyImages> => {
  const v = await readContent<FamilyImages>("family_images");
  return v && typeof v === "object" ? v : {};
});

/** ¿La pasarela de pago está activa? (si no, el checkout queda solo WhatsApp). */
export const getPaymentsEnabled = cache(async (): Promise<boolean> => {
  const v = await readContent<{ enabled?: boolean }>("payments_gateway");
  return v?.enabled !== false; // por defecto activa
});
