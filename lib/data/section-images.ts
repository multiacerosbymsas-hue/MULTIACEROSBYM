/**
 * Foto real por SECCIÓN del catálogo (referencia).
 * La clave es el nombre de la sección tal como está en la BD, normalizado a
 * MAYÚSCULAS y sin espacios extra. Si una sección no tiene foto aquí, la
 * referencia usa la portada de su familia como respaldo.
 *
 * Fotos entregadas por el cliente (carpetas TUBERIA Y PERFILERIA y
 * Laminas y Aceros), optimizadas a webp en /public/images/catalogo.
 */
const RAW: Record<string, string> = {
  // Tubería y Perfilería
  "TUBERIA CERRAMIENTO NEGRO": "/images/catalogo/tuberia-perfileria/tuberia-cerramiento-negro.webp",
  "TUBERIA CERRAMIENTO GALVANIZADA": "/images/catalogo/tuberia-perfileria/tuberia-cerramiento-galvanizada.webp",
  "TUBERIA CUADRADA": "/images/catalogo/tuberia-perfileria/tuberia-cuadrada.webp",
  "TUBERIA MUEBLE RECTANGULAR": "/images/catalogo/tuberia-perfileria/tuberia-mueble-rectangular.webp",
  "TUBERIA MUEBLE REDONDA": "/images/catalogo/tuberia-perfileria/tuberia-mueble-redonda.webp",
  "TUBERIA OVALADA": "/images/catalogo/tuberia-perfileria/tuberia-ovalada.webp",
  "TUBERIA ELIPTICA": "/images/catalogo/tuberia-perfileria/tuberia-eliptica.webp",
  "TUBERIA INOXIDABLE": "/images/catalogo/tuberia-perfileria/tuberia-inoxidable.webp",
  "TUBERIA PVC": "/images/catalogo/tuberia-perfileria/tuberia-pvc.webp",
  "VIGAS IPE": "/images/catalogo/tuberia-perfileria/vigas-ipe.webp",
  "PERFIL EN L": "/images/catalogo/tuberia-perfileria/perfil-en-l.webp",
  "FLEJES DE CORTINA": "/images/catalogo/tuberia-perfileria/flejes-de-cortina.webp",

  // Láminas y Aceros
  "CANAL GALVANIZADO": "/images/catalogo/laminas-aceros/canal-galvanizado.webp",
  "HOJALATA": "/images/catalogo/laminas-aceros/hojalata.webp",
  "LAMINA ALFAJOR": "/images/catalogo/laminas-aceros/lamina-alfajor.webp",
  "LAMINA CR": "/images/catalogo/laminas-aceros/lamina-cr.webp",
  "LAMINA HR": "/images/catalogo/laminas-aceros/lamina-hr.webp",
  "LAMINA ESTAMPADAS": "/images/catalogo/laminas-aceros/lamina-estampadas.webp",
  "LAMINA GALVANIZADA": "/images/catalogo/laminas-aceros/lamina-galvanizada.webp",
  "LAMINA INOXIDABLE": "/images/catalogo/laminas-aceros/lamina-inoxidable.webp",
  "LAMINA PERFORADA": "/images/catalogo/laminas-aceros/lamina-perforada.webp",

  // Ángulos, Platinas y Varilla
  "ANGULOS": "/images/catalogo/angulos-platinas-varilla/angulos.webp",
  "PLATINAS": "/images/catalogo/angulos-platinas-varilla/platinas.webp",
  "VARILLA CORRUGADA": "/images/catalogo/angulos-platinas-varilla/varilla-corrugada.webp",
  "VARILLA CUADRADA": "/images/catalogo/angulos-platinas-varilla/varilla-cuadrada.webp",
  "VARILLA GRAFIL": "/images/catalogo/angulos-platinas-varilla/varilla-grafil.webp",
  "VARILLA INOXIDABLE": "/images/catalogo/angulos-platinas-varilla/varilla-inoxidable.webp",
  "VARILLA LISA": "/images/catalogo/angulos-platinas-varilla/varilla-lisa.webp",

  // Cerramiento, Alambre y Malla
  "ALAMBRES": "/images/catalogo/cerramiento-alambre-malla/alambres.webp",
  "ALAMBRE DE PUA": "/images/catalogo/cerramiento-alambre-malla/alambre-de-pua.webp",
  "CONCERTINA": "/images/catalogo/cerramiento-alambre-malla/concertina.webp",
  "GAVIONES": "/images/catalogo/cerramiento-alambre-malla/gaviones.webp",
  "MALLAS": "/images/catalogo/cerramiento-alambre-malla/mallas.webp",
};

/** Normaliza el nombre de sección para la búsqueda (mayúsculas, sin acentos ni espacios extra). */
function norm(section: string): string {
  return section
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .trim()
    .replace(/\s+/g, " ")
    .toUpperCase();
}

const SECTION_IMAGES: Record<string, string> = Object.fromEntries(
  Object.entries(RAW).map(([k, v]) => [norm(k), v])
);

/** Devuelve la foto de una sección, o undefined si no tiene una asignada. */
export function sectionImage(section: string): string | undefined {
  return SECTION_IMAGES[norm(section)];
}
