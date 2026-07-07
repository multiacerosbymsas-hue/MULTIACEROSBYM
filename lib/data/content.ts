/** Contenido editable del sitio (carrusel). Tipos puros + valores por defecto. */

/**
 * Sanea un enlace editable (CTA del carrusel). Solo permite rutas internas
 * (`/...`) o URLs http(s); cualquier otra cosa (p.ej. `javascript:`) cae a "/".
 * Evita que un enlace malicioso ejecute código o redirija a un sitio falso.
 */
export function safeHref(href: string): string {
  const h = (href ?? "").trim();
  if (h.startsWith("/")) return h;
  try {
    const u = new URL(h);
    if (u.protocol === "http:" || u.protocol === "https:") return h;
  } catch {
    // no es una URL válida
  }
  return "/";
}

export type HeroSlide = {
  image: string;
  eyebrow: string;
  /** Usa *asteriscos* para resaltar una palabra en naranja. */
  title: string;
  subtitle: string;
  ctaLabel: string;
  ctaHref: string;
};

/** Imágenes disponibles para elegir en el panel (las que hay en /public/images). */
export const HERO_IMAGE_OPTIONS = [
  "/images/hero-acero.jpg",
  "/images/cubiertas-arquitectonicas.jpg",
  "/images/tuberia-perfiles.jpg",
  "/images/kit-herramientas.jpg",
  "/images/aceros-variedades.jpg",
  "/images/tejas-colores.jpg",
  "/images/teja-zinc.jpg",
  "/images/teja-colonial.jpg",
  "/images/angulos.jpg",
  "/images/ladrillos.jpg",
  "/images/cemento-oriente.jpg",
];

export const DEFAULT_HERO_SLIDES: HeroSlide[] = [
  {
    image: "/images/hero-acero.jpg",
    eyebrow: "Ferretería industrial · Bucaramanga",
    title: "Todas las formas del *acero* en un solo lugar",
    subtitle:
      "Acero y materiales certificados para construcción, ornamentación e industria, con asesoría según la necesidad de tu proyecto.",
    ctaLabel: "Explorar catálogo",
    ctaHref: "/catalogo",
  },
  {
    image: "/images/cubiertas-arquitectonicas.jpg",
    eyebrow: "Cubiertas y tejas",
    title: "Techos que *protegen* y lucen bien",
    subtitle:
      "Teja de zinc, traslúcida, termoacústica y arquitectónica. Perfiles y colores para todo tipo de obra.",
    ctaLabel: "Ver cubiertas",
    ctaHref: "/categoria/cubiertas-tejas",
  },
  {
    image: "/images/tuberia-perfiles.jpg",
    eyebrow: "Tubería y perfilería",
    title: "Estructura *sólida* para tu proyecto",
    subtitle:
      "Tubería de cerramiento, estructural y mueble; negra y galvanizada, en todos los calibres y medidas.",
    ctaLabel: "Ver tubería",
    ctaHref: "/categoria/tuberia-perfileria",
  },
  {
    image: "/images/kit-herramientas.jpg",
    eyebrow: "Herramientas y ferretería",
    title: "Todo para *la obra* y el taller",
    subtitle:
      "Herramienta eléctrica y manual, discos, brocas, abrasivos, cerrajería y seguridad industrial.",
    ctaLabel: "Ver herramientas",
    ctaHref: "/categoria/herramientas-ferreteria",
  },
];
