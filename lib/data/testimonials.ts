/** Testimonios de clientes (reseñas reales del negocio). */
export type Testimonial = {
  name: string;
  role: string;
  text: string;
  initial: string;
};

export const testimonials: Testimonial[] = [
  {
    name: "Valentina Mejía",
    role: "Cliente verificada",
    initial: "V",
    text: "Gran servicio y entrega por parte de los empleados en ventas, compras y despacho. Excelentes productos. Lo recomiendo totalmente.",
  },
  {
    name: "Carito Carvajal",
    role: "Cliente verificada",
    initial: "C",
    text: "Un lugar muy confiable, donde me han brindado mucha atención en la compra y el despacho. Empresas como esta deberían multiplicarse.",
  },
  {
    name: "Manuel Salas",
    role: "Cliente verificado",
    initial: "M",
    text: "Excelente atención con personal muy capacitado. Encontré todo lo relacionado con la construcción y la industria metalmecánica.",
  },
  {
    name: "Yaneth Sandoval",
    role: "Cliente verificada",
    initial: "Y",
    text: "Nuestro proveedor de confianza. Excelente atención, precios justos y sus propietarios son grandes personas. Muy satisfecha.",
  },
  {
    name: "Antonio Niño",
    role: "Cliente verificado",
    initial: "A",
    text: "Tengo a MultiAceros como mi proveedor de materiales para la construcción por la garantía y puntualidad en todo lo que he negociado.",
  },
  {
    name: "Javier Hernández",
    role: "Cliente verificado",
    initial: "J",
    text: "Empresa con excelente servicio, excelentes precios y excelente atención. Gracias por sus servicios.",
  },
];
