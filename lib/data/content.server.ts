import "server-only";
import { cache } from "react";
import { supabasePublic } from "@/lib/supabase/public";
import { DEFAULT_HERO_SLIDES, type HeroSlide } from "./content";

/** Lee las diapositivas del carrusel desde site_content; usa las de defecto si no hay. */
export const getHeroSlides = cache(async (): Promise<HeroSlide[]> => {
  const { data } = await supabasePublic
    .from("site_content")
    .select("value")
    .eq("key", "hero_slides")
    .maybeSingle();

  const slides = data?.value as HeroSlide[] | null | undefined;
  return Array.isArray(slides) && slides.length ? slides : DEFAULT_HERO_SLIDES;
});
