/**
 * Apartado de pagos — MultiAceros B&M.
 *
 * Métodos: Pedir contraentrega · Transferencia bancaria · Pago en línea (PSE / tarjeta).
 * El pago en línea usa el portal de pagos de Davivienda.
 * Al confirmar (cualquier método) el cliente confirma su pedido por WhatsApp.
 *
 * Pendiente a futuro: notificaciones por correo con Resend al confirmar el pedido.
 */

export type PaymentMethodValue = "contraentrega" | "transferencia" | "online";

export const paymentMethods: {
  value: PaymentMethodValue;
  label: string;
  hint: string;
}[] = [
  {
    value: "contraentrega",
    label: "Pedir contraentrega",
    hint: "Pagas al recibir tu pedido",
  },
  {
    value: "transferencia",
    label: "Transferencia bancaria",
    hint: "Nequi, Bancolombia u otra cuenta",
  },
  {
    value: "online",
    label: "Pago en línea · PSE / tarjeta",
    hint: "Pago seguro con Davivienda",
  },
];

/** Portal de pagos en línea (Davivienda). Vacío = la opción online se coordina por WhatsApp. */
export const BANK_PAYMENT_URL: string =
  "https://portalpagos.davivienda.com/#/comercio/6761/MULTIACEROS%20B&M%20SAS";
