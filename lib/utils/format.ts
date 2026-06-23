import { company } from "@/lib/data/company";

/** Formatea un valor numérico como pesos colombianos: 21700 -> "$ 21.700" */
export function formatCOP(value: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  })
    .format(value)
    .replace("COP", "$")
    .trim();
}

/** Construye un enlace de WhatsApp con mensaje prellenado. */
export function whatsappLink(message: string, phone: string = company.whatsapp): string {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

/** Mensaje de cotización para un producto concreto. */
export function quoteProductMessage(productName: string): string {
  return `Hola ${company.brand} 👋, quiero cotizar el producto: "${productName}". ¿Me pueden dar precio y disponibilidad?`;
}
