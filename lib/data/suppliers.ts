/** Marcas aliadas / proveedores (fuente: material del cliente). */
export type Supplier = {
  name: string;
  mono: string;
  tagline: string;
  /** Color de acento de la marca, para el monograma. */
  color: string;
  /** Logo recortado de la captura del cliente (carpeta PROVEEDORES). */
  logo: string;
};

export const suppliers: Supplier[] = [
  { name: "Gerdau Diaco", mono: "GD", tagline: "Aceros largos", color: "#F5B000", logo: "/images/proveedores/gerdau.png" },
  { name: "Paz del Río", mono: "PR", tagline: "Acero colombiano", color: "#C8102E", logo: "/images/proveedores/pazdelrio.png" },
  { name: "Fanalca", mono: "FA", tagline: "Industria metalmecánica", color: "#0E2A55", logo: "/images/proveedores/fanalca.png" },
  { name: "Colmena", mono: "CO", tagline: "Acero en evolución", color: "#1B2A4A", logo: "/images/proveedores/colmena.png" },
  { name: "Aceros Cortados", mono: "AC", tagline: "Corte y figurado", color: "#2B3340", logo: "/images/proveedores/aceros-cortados.png" },
  { name: "Yale", mono: "YA", tagline: "Seguridad y cerrajería", color: "#1A1A1A", logo: "/images/proveedores/yale.png" },
  { name: "Corpacero", mono: "CP", tagline: "Aliados de acero", color: "#0072CE", logo: "/images/proveedores/corpacero.png" },
  { name: "Acesco", mono: "AS", tagline: "Aceros planos", color: "#00857C", logo: "/images/proveedores/acesco.png" },
  { name: "Ternium", mono: "TE", tagline: "Acero plano y largo", color: "#E8710A", logo: "/images/proveedores/ternium.webp" },
  { name: "Plexim", mono: "PX", tagline: "Marca aliada", color: "#29ABE2", logo: "/images/proveedores/plexim.webp" },
];
