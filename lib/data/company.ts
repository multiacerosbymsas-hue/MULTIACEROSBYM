/**
 * Datos REALES de la empresa (fuente: formulario diligenciado del cliente).
 * TODO (pendiente del cliente): historia de la empresa, handles reales de redes,
 * costo de envío, logo en PNG/SVG de alta resolución.
 */
export const company = {
  legalName: "MULTIACEROS B&M S.A.S.",
  brand: "MultiAceros B&M",
  nit: "901.444.146-0",
  slogan: "Todas las formas del acero en un solo lugar",
  yearsInMarket: 17,
  type: "Mayorista y minorista",
  sectors: ["Ornamentación", "Construcción", "Industrial", "Metalmecánico"],

  // Contacto
  phones: ["317 808 0270", "304 668 8112", "313 731 6512"],
  whatsapp: "573178080270", // número principal (formato internacional sin +)
  email: "multiacerosbymsas@gmail.com",

  addresses: [
    { label: "Sede principal", line: "Calle 28 # 13-25", city: "Bucaramanga, Santander" },
    { label: "Sucursal", line: "Calle 28 # 10-43", city: "Bucaramanga, Santander" },
  ],

  hours: [
    { days: "Lunes a viernes", time: "7:00 a.m. – 5:00 p.m. (jornada continua)" },
    { days: "Sábados", time: "7:30 a.m. – 12:00 p.m." },
  ],

  delivery: "Domicilios en el área metropolitana de Bucaramanga · Recogida en punto físico",

  socials: {
    instagram: "#", // TODO: handle real
    facebook: "#", // TODO: handle real
    tiktok: "#", // TODO: handle real
  },

  mission:
    "Somos una empresa que trabaja para brindar a nuestros clientes la mayor diversidad en materiales de construcción y ornamentación, bajo premisas de precio, calidad y servicio acorde a las exigencias del mercado, comprometidos a mantener la preferencia y satisfacción de nuestros clientes.",
  vision:
    "Para el año 2030, MULTIACEROS B&M S.A.S. será una empresa líder del sector ferretero a nivel regional y nacional, reconocida como comercializadora de alto prestigio y confiabilidad en materiales de construcción y ornamentación.",
  values: [
    { name: "Honestidad", desc: "Transparencia en cada negociación, asesoría y entrega." },
    { name: "Calidad", desc: "Material certificado y respaldado por las mejores marcas del país." },
    { name: "Compromiso", desc: "Cumplimos con lo prometido: precio, tiempos y servicio." },
  ],
  team: [
    { name: "Ximena Motta Ortega", role: "Gerente" },
    { name: "Iván Bayona Quintero", role: "Subgerente" },
  ],
} as const;

export type Company = typeof company;
