import type { Metadata } from "next";
import { CheckoutContent } from "@/components/store/CheckoutContent";
import { getPaymentsEnabled } from "@/lib/data/content.server";

export const metadata: Metadata = {
  title: "Finalizar pedido",
  description: "Completa tus datos y elige el método de pago para finalizar tu pedido.",
};

// Se revalida al instante desde /admin/pagos; este valor es solo de respaldo.
export const revalidate = 300;

export default async function CheckoutPage() {
  const paymentsEnabled = await getPaymentsEnabled();
  return <CheckoutContent paymentsEnabled={paymentsEnabled} />;
}
