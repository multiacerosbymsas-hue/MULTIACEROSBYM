/**
 * Productos DESTACADOS de muestra para el diseño.
 * Los precios marcados provienen de la lista de precios; el resto son
 * valores de referencia provisionales. Se reemplazarán con la importación
 * masiva (~1.645 productos) al cierre de la Etapa 1.
 */
export type Product = {
  id: string;
  slug: string;
  name: string;
  category: string; // slug de categoría
  categoryLabel: string;
  image: string;
  price: number;
  unit: string;
  tag?: "Destacado" | "Nuevo" | "Oferta";
  desc: string;
};

export const featuredProducts: Product[] = [
  {
    id: "010124",
    slug: "tuberia-cerramiento-negra-1",
    name: 'Tubería cerramiento negra 1" cal. 18',
    category: "tuberia-perfileria",
    categoryLabel: "Tubería",
    image: "/images/tuberia-perfiles.jpg",
    price: 33500,
    unit: "tubo x 6 m",
    tag: "Destacado",
    desc: "Tubería negra para cerramiento y estructura liviana. Calibre 18.",
  },
  {
    id: "010105",
    slug: "tuberia-cerramiento-negra-media",
    name: 'Tubería cerramiento negra 1/2" cal. 20',
    category: "tuberia-perfileria",
    categoryLabel: "Tubería",
    image: "/images/tuberia-perfiles.jpg",
    price: 21700,
    unit: "tubo x 6 m",
    desc: "Económica y versátil para rejas, marcos y ornamentación.",
  },
  {
    id: "lam-cr",
    slug: "lamina-cold-rolled",
    name: "Lámina Cold Rolled (CR)",
    category: "laminas-aceros",
    categoryLabel: "Láminas",
    image: "/images/aceros-variedades.jpg",
    price: 145000,
    unit: "lámina",
    tag: "Destacado",
    desc: "Superficie lisa y uniforme, ideal para doblez, corte y troquelado.",
  },
  {
    id: "ang-1",
    slug: "angulo-acero-1",
    name: 'Ángulo de acero 1" x 1/8"',
    category: "angulos-platinas-varilla",
    categoryLabel: "Ángulos",
    image: "/images/angulos.jpg",
    price: 28900,
    unit: "x 6 m",
    desc: "Perfil en L para estructuras, soportes y refuerzos.",
  },
  {
    id: "teja-zinc",
    slug: "teja-zinc-prepintada",
    name: "Teja de zinc prepintada",
    category: "cubiertas-tejas",
    categoryLabel: "Cubiertas",
    image: "/images/teja-zinc.jpg",
    price: 32000,
    unit: "x metro",
    tag: "Oferta",
    desc: "Galvanizada y prepintada. La solución económica y durable para techos.",
  },
  {
    id: "teja-color",
    slug: "teja-trapezoidal-color",
    name: "Teja trapezoidal a color",
    category: "cubiertas-tejas",
    categoryLabel: "Cubiertas",
    image: "/images/tejas-colores.jpg",
    price: 41000,
    unit: "x metro",
    tag: "Nuevo",
    desc: "Prepintada en rojo, verde y azul. Larga vida útil y acabado profesional.",
  },
  {
    id: "cem-50",
    slug: "cemento-gris-50kg",
    name: "Cemento gris uso general 50 kg",
    category: "cemento-pvc-obra-gris",
    categoryLabel: "Obra gris",
    image: "/images/cemento-oriente.jpg",
    price: 28500,
    unit: "bulto 50 kg",
    desc: "Cemento de uso general para todo tipo de obra.",
  },
  {
    id: "kit-herr",
    slug: "kit-taladro-pulidora",
    name: "Kit taladro percutor + pulidora",
    category: "herramientas-ferreteria",
    categoryLabel: "Herramientas",
    image: "/images/kit-herramientas.jpg",
    price: 189000,
    unit: "kit",
    tag: "Oferta",
    desc: "Taladro de impacto 550W + pulidora con maletín. Garantía 12 meses.",
  },
];
