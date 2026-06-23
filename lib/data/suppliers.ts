/** Marcas aliadas / proveedores (fuente: material del cliente). */
export type Supplier = {
  name: string;
  mono: string;
  tagline: string;
  /** Color de acento de la marca, para el monograma. */
  color: string;
};

export const suppliers: Supplier[] = [
  { name: "Gerdau Diaco", mono: "GD", tagline: "Aceros largos", color: "#F5B000" },
  { name: "Paz del Río", mono: "PR", tagline: "Acero colombiano", color: "#C8102E" },
  { name: "Fanalca", mono: "FA", tagline: "Industria metalmecánica", color: "#0E2A55" },
  { name: "Colmena", mono: "CO", tagline: "Acero en evolución", color: "#1B2A4A" },
  { name: "Aceros Cortados", mono: "AC", tagline: "Corte y figurado", color: "#2B3340" },
  { name: "Yale", mono: "YA", tagline: "Seguridad y cerrajería", color: "#1A1A1A" },
  { name: "Corpacero", mono: "CP", tagline: "Aliados de acero", color: "#0072CE" },
  { name: "Acesco", mono: "AS", tagline: "Aceros planos", color: "#00857C" },
];
