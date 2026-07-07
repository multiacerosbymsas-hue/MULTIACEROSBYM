import type { Metadata } from "next";
import { CheckoutContent } from "@/components/store/CheckoutContent";

export const metadata: Metadata = {
  title: "Finalizar pedido",
  description: "Completa tus datos y elige el método de pago para finalizar tu pedido.",
};

export default function CheckoutPage() {
  return <CheckoutContent />;
}
