import type { Metadata } from "next";
import { CreditCard, MessageCircle, ShieldAlert, ShieldCheck } from "lucide-react";
import { getPaymentsEnabled } from "@/lib/data/content.server";
import { setPaymentsEnabled } from "@/lib/admin-actions";

export const metadata: Metadata = { title: "Panel · Pasarela de pago" };

export default async function AdminPagos({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string }>;
}) {
  const { ok } = await searchParams;
  const enabled = await getPaymentsEnabled();

  return (
    <div className="max-w-2xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-bold text-ink">
          Pasarela de pago
        </h1>
        {ok && (
          <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
            Guardado ✓
          </span>
        )}
      </div>
      <p className="mt-1 text-sm text-muted">
        Controla los métodos de pago del checkout. Al suspender, los clientes
        solo verán la opción de coordinar el pedido por WhatsApp (contraentrega);
        al activar, vuelve la pasarela completa (transferencia y pago en línea
        con Davivienda).
      </p>

      <div
        className={`mt-6 rounded-[var(--radius-card)] border p-6 ${
          enabled
            ? "border-green-200 bg-green-50"
            : "border-amber-200 bg-amber-50"
        }`}
      >
        <div className="flex items-center gap-3">
          {enabled ? (
            <ShieldCheck size={28} className="text-green-600" />
          ) : (
            <ShieldAlert size={28} className="text-amber-600" />
          )}
          <div>
            <p className="font-display text-lg font-bold text-ink">
              {enabled ? "Pasarela ACTIVA" : "Pasarela SUSPENDIDA"}
            </p>
            <p className="text-sm text-muted">
              {enabled
                ? "El checkout ofrece contraentrega, transferencia y pago en línea."
                : "El checkout solo ofrece pedido por WhatsApp (contraentrega)."}
            </p>
          </div>
        </div>

        <div className="mt-5 grid gap-2 text-sm text-ink/80">
          <span className="flex items-center gap-2">
            <MessageCircle size={16} className="text-green-600" />
            Pedido y confirmación por WhatsApp — siempre disponible
          </span>
          <span className={`flex items-center gap-2 ${enabled ? "" : "opacity-40 line-through"}`}>
            <CreditCard size={16} className="text-brand" />
            Transferencia bancaria y pago en línea (PSE / tarjeta · Davivienda)
          </span>
        </div>
      </div>

      <form action={setPaymentsEnabled} className="mt-6">
        <input type="hidden" name="enabled" value={enabled ? "0" : "1"} />
        <button
          type="submit"
          className={`rounded-full px-6 py-3 text-sm font-semibold text-white transition-colors ${
            enabled
              ? "bg-amber-600 hover:bg-amber-700"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {enabled ? "Suspender pasarela de pago" : "Activar pasarela de pago"}
        </button>
      </form>
      <p className="mt-3 text-xs text-muted">
        El cambio aplica de inmediato en la página de “Finalizar pedido”.
      </p>
    </div>
  );
}
