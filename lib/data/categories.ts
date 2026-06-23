/**
 * Familias principales del catálogo (agrupan las ~70 secciones del Excel).
 * NOTA: las imágenes son provisionales (banco actual). Se reemplazarán por
 * fotos reales de producto con fondo blanco cuando el cliente las entregue.
 */
export type Category = {
  slug: string;
  name: string;
  blurb: string;
  image: string;
  /** Subsecciones reales tomadas de la lista de precios. */
  includes: string[];
};

export const categories: Category[] = [
  {
    slug: "tuberia-perfileria",
    name: "Tubería y Perfilería",
    blurb: "Cerramiento, estructural, mueble y perfiles para toda obra.",
    image: "/images/tuberia-perfiles.jpg",
    includes: [
      "Tubería cerramiento negra y galvanizada",
      "Tubería cuadrada y rectangular",
      "Tubería mueble redonda",
      "Tubería ovalada, elíptica e inoxidable",
      "Vigas IPE · Perlines en C · Perfil en L",
    ],
  },
  {
    slug: "laminas-aceros",
    name: "Láminas y Aceros",
    blurb: "Cold rolled, hot rolled, galvanizada, alfajor e inoxidable.",
    image: "/images/aceros-variedades.jpg",
    includes: [
      "Lámina CR y HR",
      "Lámina galvanizada e inoxidable",
      "Lámina alfajor, perforada y estampada",
      "Canal galvanizado · Hojalata",
    ],
  },
  {
    slug: "angulos-platinas-varilla",
    name: "Ángulos, Platinas y Varilla",
    blurb: "Perfilería estructural y varilla para refuerzo y ornamentación.",
    image: "/images/angulos.jpg",
    includes: [
      "Ángulos y platinas",
      "Varilla corrugada y lisa",
      "Varilla cuadrada y grafil",
      "Varilla inoxidable",
    ],
  },
  {
    slug: "cubiertas-tejas",
    name: "Cubiertas y Tejas",
    blurb: "Zinc, termoacústica, traslúcida, UPVC y arquitectónicas.",
    image: "/images/cubiertas-arquitectonicas.jpg",
    includes: [
      "Teja de zinc y traslúcida",
      "Termoacústica PVC / UPVC",
      "Cubiertas y tejas arquitectónicas",
      "Caballetes y accesorios",
    ],
  },
  {
    slug: "cemento-pvc-obra-gris",
    name: "Cemento, PVC y Obra Gris",
    blurb: "Cemento, tubería y accesorios PVC, ladrillo y más.",
    image: "/images/cemento-oriente.jpg",
    includes: [
      "Cemento gris",
      "Tubería PVC",
      "Accesorios PVC",
      "Ladrillo estructural",
    ],
  },
  {
    slug: "cerramiento-alambre-malla",
    name: "Cerramiento, Alambre y Malla",
    blurb: "Soluciones de seguridad perimetral y delimitación.",
    image: "/images/ladrillos.jpg",
    includes: [
      "Alambre de púa y galvanizado",
      "Concertina",
      "Gaviones",
      "Mallas",
    ],
  },
  {
    slug: "pintura-soldadura-quimicos",
    name: "Pintura, Soldadura y Químicos",
    blurb: "Anticorrosivos, esmaltes, soldadura y acabados.",
    image: "/images/teja-colonial.jpg",
    includes: [
      "Anticorrosivo y esmaltes",
      "Aerosoles y thinner",
      "Soldadura y electrodos",
      "Masillas y lijas",
    ],
  },
  {
    slug: "herramientas-ferreteria",
    name: "Herramientas y Ferretería",
    blurb: "Herramienta eléctrica y manual, cerrajería y seguridad.",
    image: "/images/kit-herramientas.jpg",
    includes: [
      "Discos, brocas y abrasivos",
      "Brochas, rodillos y guantes",
      "Cerraduras, cerrojos y goznes",
      "Seguridad industrial",
    ],
  },
];
