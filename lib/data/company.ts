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

  // Contacto (el primero es el que se muestra arriba a la derecha del sitio)
  phones: ["321 971 9719", "304 668 8112", "317 808 0270", "313 731 6512"],
  whatsapp: "573219719719", // línea principal de cotización (Santiago Bayona Motta) — formato internacional sin +
  email: "multiacerosbymsas@gmail.com",

  addresses: [
    { label: "Sede principal", line: "Calle 28 # 13-25", city: "Bucaramanga, Santander", phone: "317 808 0270" },
    { label: "Sucursal", line: "Calle 28 # 10-43", city: "Bucaramanga, Santander", phone: "304 668 8112" },
  ],

  hours: [
    { days: "Lunes a viernes", time: "7:30 a.m. – 5:00 p.m. (jornada continua)" },
    { days: "Sábados", time: "7:30 a.m. – 12:00 p.m." },
  ],

  delivery: "Domicilios en el área metropolitana de Bucaramanga · Recogida en punto físico",

  socials: {
    instagram: "https://www.instagram.com/bymmultiaceros?igsh=YjNqZmJ2enZua2ln",
    facebook: "https://www.facebook.com/share/1B5XEDbccH/",
    tiktok: "https://www.tiktok.com/@multiaceros.bm.sa?_r=1&_t=ZS-97XwtuFGKhh",
    youtube: "https://www.youtube.com/@MULTIACEROSBYMSAS",
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

/**
 * Asesores comerciales por WhatsApp.
 * El principal (cotizaciones) es Santiago Bayona Motta.
 * Para sumar los otros 2 asesores: agrega { name, role, whatsapp } a este arreglo
 * y el botón flotante se convierte automáticamente en un selector con su nombre.
 */
export type Advisor = {
  name: string;
  role: string;
  /** WhatsApp en formato internacional sin "+" (ej. 573219719719). */
  whatsapp: string;
  /** Ruta pública de la foto del asesor; si falta se muestran sus iniciales. */
  photo?: string;
};

export const advisors: Advisor[] = [
  { name: "Santiago Bayona Motta", role: "Cotizaciones · Línea principal", whatsapp: company.whatsapp, photo: "/images/asesores/santiago-bayona.jpg" },
  { name: "Alfonso Manuel Cabarcas Salas", role: "Asesor comercial", whatsapp: "573172795241", photo: "/images/asesores/alfonso-cabarcas.jpg" },
  { name: "Javier José Hernández Borja", role: "Asesor comercial", whatsapp: "573137316512", photo: "/images/asesores/javier-hernandez.jpg" },
  { name: "Luis Antonio Niño Contreras", role: "Asesor comercial", whatsapp: "573142114304", photo: "/images/asesores/antonio-nino.jpg" },
  { name: "Andertsonn Smollt Hinestroza Ascanio", role: "Asesor comercial", whatsapp: "573028153935", photo: "/images/asesores/anderson-hinestroza.jpg" },
  { name: "Ana María Peñaloza Silva", role: "Asesora comercial", whatsapp: "573046688112", photo: "/images/asesores/ana-maria-penaloza.jpg" },
];
