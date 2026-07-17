"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { CheckCircle2, MessageCircle, CreditCard, ShoppingCart } from "lucide-react";
import { useCart, useCartTotal } from "@/lib/store/cart";
import { useMounted } from "@/components/ui/Reveal";
import { formatCOP, whatsappLink } from "@/lib/utils/format";
import { company } from "@/lib/data/company";
import { createOrder } from "@/lib/order-actions";
import {
  paymentMethods,
  BANK_PAYMENT_URL,
  type PaymentMethodValue,
} from "@/lib/data/payments";
import { PaymentLogos } from "@/components/store/PaymentLogos";

export function CheckoutContent({
  paymentsEnabled = true,
}: {
  /** false = pasarela suspendida desde /admin/pagos: solo pedido por WhatsApp. */
  paymentsEnabled?: boolean;
}) {
  const mounted = useMounted();
  const items = useCart((s) => s.items);
  const clear = useCart((s) => s.clear);
  const total = useCartTotal();

  // Con la pasarela suspendida solo queda "contraentrega" (coordinar por WhatsApp).
  const methods = paymentsEnabled
    ? paymentMethods
    : paymentMethods.filter((m) => m.value === "contraentrega");

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [notes, setNotes] = useState("");
  const [payMethod, setPayMethod] = useState<PaymentMethodValue>("contraentrega");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState<{ wa: string; bank: string; code?: string } | null>(null);

  const inputCls =
    "w-full rounded-xl border border-line px-3.5 py-2.5 text-sm text-ink placeholder:text-muted/70 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/25";
  const labelCls = "mb-1.5 block text-xs font-medium text-muted";

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (sending) return;
    setError("");
    if (!name.trim() || !phone.trim()) {
      setError("Por favor escribe tu nombre y tu teléfono.");
      return;
    }
    const methodLabel =
      paymentMethods.find((m) => m.value === payMethod)?.label ?? "";

    // Registra el pedido en el sistema (aparece en el panel /admin/pedidos).
    // Si algo falla, el pedido sigue por WhatsApp como siempre.
    setSending(true);
    let code: string | undefined;
    try {
      const res = await createOrder({
        name,
        phone,
        email,
        address,
        city,
        notes,
        paymentLabel: methodLabel,
        items: items.map((it) => ({ id: it.id, name: it.name, price: it.price, qty: it.qty })),
      });
      if (res.ok) code = res.code;
      else console.warn("[checkout]", res.error);
    } catch (err) {
      console.warn("[checkout] No se pudo registrar el pedido:", err);
    }
    setSending(false);

    let msg = `Hola ${company.brand} 👋, confirmo mi pedido${code ? ` #${code}` : ""}:\n\n`;
    items.forEach((it) => {
      msg += `• ${it.qty} x ${it.name} — ${formatCOP(it.price * it.qty)}\n`;
    });
    msg += `\nTotal aprox.: ${formatCOP(total)}\nMétodo de pago: ${methodLabel}\n\nNombre: ${name}\nTeléfono: ${phone}`;
    if (address) msg += `\nDirección: ${address}${city ? ", " + city : ""}`;
    if (notes) msg += `\nNota: ${notes}`;
    const wa = whatsappLink(msg);
    const bank =
      paymentsEnabled && payMethod === "online" && BANK_PAYMENT_URL !== ""
        ? BANK_PAYMENT_URL
        : "";
    // Con cualquier método mostramos la confirmación; el cliente confirma por WhatsApp
    // (y si es pago en línea, además puede pagar en el portal de Davivienda).
    setDone({ wa, bank, code });
    clear();
  }

  if (!mounted) {
    return <div className="container-x py-24 text-center text-muted">Cargando…</div>;
  }

  if (done) {
    return (
      <div className="container-x max-w-lg py-16 text-center">
        <CheckCircle2 size={64} strokeWidth={1.5} className="mx-auto mb-4 text-emerald-500" />
        <h1 className="font-display text-3xl font-bold text-ink">
          ¡Pedido realizado con éxito! 🎉
        </h1>
        {done.code && (
          <p className="mt-2 font-mono text-sm text-muted">
            Pedido <span className="font-semibold text-ink">#{done.code}</span>
          </p>
        )}
        <p className="mx-auto mt-3 max-w-sm text-muted">
          Tu pedido quedó registrado.{" "}
          {done.bank
            ? "Completa tu pago en el portal de Davivienda y confírmalo"
            : "Confírmalo"}{" "}
          por WhatsApp para coordinar el despacho.
        </p>
        <div className="mt-6 flex flex-col items-center gap-3">
          {done.bank && (
            <a
              href={done.bank}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
            >
              <CreditCard size={18} /> Pagar en línea (Davivienda)
            </a>
          )}
          <a
            href={done.wa}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            <MessageCircle size={18} /> Confirmar por WhatsApp
          </a>
        </div>
        <Link href="/catalogo" className="mt-6 inline-block text-sm font-medium text-brand hover:underline">
          ← Seguir comprando
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container-x max-w-lg py-20 text-center">
        <ShoppingCart size={56} strokeWidth={1.3} className="mx-auto mb-4 text-muted" />
        <h1 className="font-display text-2xl font-bold text-ink">Tu carrito está vacío</h1>
        <p className="mt-2 text-muted">Agrega productos del catálogo para finalizar tu compra.</p>
        <Link
          href="/catalogo"
          className="mt-5 inline-block rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand"
        >
          Ir al catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="container-x max-w-5xl py-12 lg:py-16">
      <nav className="font-mono text-xs text-muted">
        <Link href="/" className="hover:text-brand">
          Inicio
        </Link>{" "}
        / <span className="text-ink">Finalizar pedido</span>
      </nav>
      <header className="mb-8 mt-3">
        <h1 className="font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
          Finalizar pedido
        </h1>
        <div className="mt-3 h-1 w-16 rounded-full bg-gradient-to-r from-brand-soft to-brand" />
      </header>

      {paymentsEnabled && (
        <div className="mb-8">
          <PaymentLogos />
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-5">
        {/* Datos + método de pago */}
        <form onSubmit={submit} className="space-y-4 lg:col-span-3">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelCls}>Nombre completo *</label>
              <input className={inputCls} value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" required />
            </div>
            <div>
              <label className={labelCls}>Teléfono / WhatsApp *</label>
              <input className={inputCls} value={phone} onChange={(e) => setPhone(e.target.value)} inputMode="tel" autoComplete="tel" required />
            </div>
          </div>
          <div>
            <label className={labelCls}>Correo electrónico (opcional)</label>
            <input
              className={inputCls}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              placeholder="Para enviarte la confirmación de tu pedido"
            />
          </div>
          <div>
            <label className={labelCls}>Dirección de entrega</label>
            <input className={inputCls} value={address} onChange={(e) => setAddress(e.target.value)} autoComplete="street-address" />
          </div>
          <div>
            <label className={labelCls}>Ciudad</label>
            <input className={inputCls} value={city} onChange={(e) => setCity(e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>Nota (opcional)</label>
            <textarea
              className={inputCls}
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ej. punto de referencia, medidas, calibre…"
            />
          </div>

          <div>
            <label className={labelCls}>Método de pago *</label>
            <div className="space-y-2">
              {methods.map((m) => (
                <label
                  key={m.value}
                  className={`flex cursor-pointer items-start gap-3 rounded-xl border px-3.5 py-3 transition ${
                    payMethod === m.value
                      ? "border-brand bg-brand-tint ring-1 ring-brand/30"
                      : "border-line hover:border-brand/40"
                  }`}
                >
                  <input
                    type="radio"
                    name="payMethod"
                    value={m.value}
                    checked={payMethod === m.value}
                    onChange={() => setPayMethod(m.value)}
                    className="mt-0.5 accent-brand"
                  />
                  <span className="text-sm leading-tight">
                    <span className="block font-medium text-ink">{m.label}</span>
                    <span className="text-xs text-muted">{m.hint}</span>
                  </span>
                </label>
              ))}
            </div>
            {payMethod === "online" && (
              <p className="mt-2 rounded-lg bg-brand-tint px-3 py-2 text-xs text-brand-dark">
                Pago seguro con Davivienda (PSE / tarjeta). Al confirmar te damos el
                enlace de pago y confirmas tu pedido por WhatsApp.
              </p>
            )}
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
          )}

          <button
            type="submit"
            disabled={sending}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-brand px-5 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark disabled:cursor-wait disabled:opacity-70"
          >
            {sending ? "Enviando pedido…" : `Confirmar pedido · ${formatCOP(total)}`}
          </button>
          <p className="text-center text-[11px] text-muted">
            Al confirmar te contactamos para coordinar el pago y el despacho.
          </p>
        </form>

        {/* Resumen del pedido */}
        <aside className="lg:col-span-2">
          <div className="rounded-[var(--radius-card)] border border-line bg-paper p-5">
            <h2 className="mb-4 font-display text-lg font-bold text-ink">Tu pedido</h2>
            <ul className="space-y-3">
              {items.map((it) => (
                <li key={it.id} className="flex gap-3">
                  <div className="relative h-16 w-14 shrink-0 overflow-hidden rounded-lg bg-white">
                    <Image src={it.image} alt="" fill sizes="56px" className="object-cover" />
                  </div>
                  <div className="min-w-0 flex-1 text-sm">
                    <p className="line-clamp-2 font-medium text-ink">{it.name}</p>
                    <p className="text-xs text-muted">
                      {it.qty} × {formatCOP(it.price)} / {it.unit}
                    </p>
                  </div>
                  <span className="whitespace-nowrap text-sm font-semibold text-brand">
                    {formatCOP(it.price * it.qty)}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex items-baseline justify-between border-t border-line pt-3">
              <span className="text-sm text-muted">Total</span>
              <span className="font-display text-2xl font-bold text-ink">
                {formatCOP(total)}
              </span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
