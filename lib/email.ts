import "server-only";
import { company } from "@/lib/data/company";
import { formatCOP } from "@/lib/utils/format";

/**
 * Correos transaccionales con Resend (https://resend.com) vía API REST.
 *
 * Variables de entorno:
 * - RESEND_API_KEY      → llave secreta de Resend. Si falta, los envíos se omiten
 *                         en silencio (el pedido nunca se bloquea por el correo).
 * - RESEND_FROM         → remitente verificado. Mientras no haya dominio propio
 *                         verificado usa "onboarding@resend.dev" (solo entrega al
 *                         correo de la cuenta Resend).
 * - ORDER_NOTIFY_EMAIL  → correo interno que recibe cada pedido nuevo
 *                         (por defecto, el correo de la empresa).
 */

export type OrderEmailData = {
  /** Código corto del pedido (primeros 8 caracteres del id). */
  code: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string | null;
  paymentLabel: string;
  note: string | null;
  total: number;
  items: { name: string; qty: number; price: number }[];
};

const RESEND_API = "https://api.resend.com/emails";

async function sendEmail(
  to: string,
  subject: string,
  html: string
): Promise<{ ok: boolean; detail?: string }> {
  const key = process.env.RESEND_API_KEY?.trim();
  if (!key) return { ok: false, detail: "RESEND_API_KEY no configurada" };
  const from =
    process.env.RESEND_FROM?.trim() || "MultiAceros B&M <onboarding@resend.dev>";
  try {
    const res = await fetch(RESEND_API, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from, to: [to], subject, html }),
    });
    if (!res.ok) return { ok: false, detail: `HTTP ${res.status}: ${await res.text()}` };
    return { ok: true };
  } catch (e) {
    return { ok: false, detail: e instanceof Error ? e.message : String(e) };
  }
}

function esc(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function orderHtml(d: OrderEmailData, headline: string, intro: string) {
  const rows = d.items
    .map(
      (it) => `
        <tr>
          <td style="padding:6px 10px;border-bottom:1px solid #eee;">${esc(it.name)}</td>
          <td style="padding:6px 10px;border-bottom:1px solid #eee;text-align:center;">${it.qty}</td>
          <td style="padding:6px 10px;border-bottom:1px solid #eee;text-align:right;">${formatCOP(it.price)}</td>
          <td style="padding:6px 10px;border-bottom:1px solid #eee;text-align:right;">${formatCOP(it.price * it.qty)}</td>
        </tr>`
    )
    .join("");

  return `
  <div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:0 auto;color:#1a1a1a;">
    <div style="background:#e85d04;color:#fff;padding:16px 20px;border-radius:10px 10px 0 0;">
      <h1 style="margin:0;font-size:18px;">${esc(headline)}</h1>
      <p style="margin:4px 0 0;font-size:13px;opacity:.9;">${company.legalName} · NIT ${company.nit}</p>
    </div>
    <div style="border:1px solid #eee;border-top:0;padding:20px;border-radius:0 0 10px 10px;">
      <p style="margin:0 0 14px;font-size:14px;">${intro}</p>
      <table style="font-size:13px;margin:0 0 14px;">
        <tr><td style="padding:2px 8px 2px 0;color:#777;">Pedido</td><td><strong>#${esc(d.code)}</strong></td></tr>
        <tr><td style="padding:2px 8px 2px 0;color:#777;">Cliente</td><td>${esc(d.customerName)}</td></tr>
        <tr><td style="padding:2px 8px 2px 0;color:#777;">Teléfono</td><td>${esc(d.customerPhone)}</td></tr>
        ${d.customerEmail ? `<tr><td style="padding:2px 8px 2px 0;color:#777;">Correo</td><td>${esc(d.customerEmail)}</td></tr>` : ""}
        <tr><td style="padding:2px 8px 2px 0;color:#777;">Pago</td><td>${esc(d.paymentLabel)}</td></tr>
        ${d.note ? `<tr><td style="padding:2px 8px 2px 0;color:#777;">Detalle</td><td>${esc(d.note)}</td></tr>` : ""}
      </table>
      <table style="width:100%;border-collapse:collapse;font-size:13px;">
        <thead>
          <tr style="background:#faf7f2;">
            <th style="padding:6px 10px;text-align:left;">Producto</th>
            <th style="padding:6px 10px;text-align:center;">Cant.</th>
            <th style="padding:6px 10px;text-align:right;">Precio</th>
            <th style="padding:6px 10px;text-align:right;">Subtotal</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
        <tfoot>
          <tr>
            <td colspan="3" style="padding:10px;text-align:right;font-weight:bold;">Total aprox.</td>
            <td style="padding:10px;text-align:right;font-weight:bold;color:#e85d04;">${formatCOP(d.total)}</td>
          </tr>
        </tfoot>
      </table>
      <p style="margin:14px 0 0;font-size:12px;color:#777;">
        Los precios son aproximados y se confirman junto con el despacho por WhatsApp
        (${company.phones[0]}).
      </p>
    </div>
  </div>`;
}

/**
 * Notifica un pedido nuevo: siempre al correo interno de la empresa y,
 * si el cliente dejó correo, también a él. Nunca lanza errores.
 */
export async function sendNewOrderEmails(d: OrderEmailData): Promise<void> {
  const notifyTo = process.env.ORDER_NOTIFY_EMAIL?.trim() || company.email;

  const sends: Promise<{ ok: boolean; detail?: string }>[] = [
    sendEmail(
      notifyTo,
      `🛒 Pedido nuevo #${d.code} · ${d.customerName} · ${formatCOP(d.total)}`,
      orderHtml(
        d,
        "Pedido nuevo en la tienda",
        "Se registró un pedido nuevo desde el sitio web. Revísalo en el panel: /admin/pedidos."
      )
    ),
  ];

  if (d.customerEmail) {
    sends.push(
      sendEmail(
        d.customerEmail,
        `Tu pedido #${d.code} en ${company.brand} quedó registrado`,
        orderHtml(
          d,
          "¡Recibimos tu pedido! 🎉",
          `Hola ${esc(d.customerName)}, tu pedido quedó registrado. Confírmalo por WhatsApp para coordinar el pago y el despacho.`
        )
      )
    );
  }

  const results = await Promise.allSettled(sends);
  results.forEach((r, i) => {
    const label = i === 0 ? "empresa" : "cliente";
    if (r.status === "rejected") {
      console.warn(`[email] Envío a ${label} falló:`, r.reason);
    } else if (!r.value.ok) {
      console.warn(`[email] Envío a ${label} omitido/falló: ${r.value.detail}`);
    }
  });
}
