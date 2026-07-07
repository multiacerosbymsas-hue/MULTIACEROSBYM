"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendNewOrderEmails } from "@/lib/email";

/**
 * Registro de pedidos del checkout.
 *
 * El cliente (navegador) solo envía slugs y cantidades; los precios se
 * recalculan aquí contra la tabla `products`. La inserción usa la llave
 * secreta (el rol anon no tiene permisos de escritura sobre `orders`).
 */

const MAX_LINES = 60;
const MAX_QTY = 999;

export type CheckoutLine = {
  /** Slug (o código) del producto tal como quedó en el carrito. */
  id: string;
  /** Datos de respaldo por si el producto no está en la BD. */
  name: string;
  price: number;
  qty: number;
};

export type CheckoutInput = {
  name: string;
  phone: string;
  email?: string;
  address?: string;
  city?: string;
  notes?: string;
  paymentLabel: string;
  items: CheckoutLine[];
};

export type CreateOrderResult =
  | { ok: true; code: string; total: number }
  | { ok: false; error: string };

const clean = (v: unknown, max: number) => String(v ?? "").trim().slice(0, max);

export async function createOrder(input: CheckoutInput): Promise<CreateOrderResult> {
  try {
    const name = clean(input.name, 120);
    const phone = clean(input.phone, 30);
    const email = clean(input.email, 160) || null;
    const address = clean(input.address, 200);
    const city = clean(input.city, 80);
    const notes = clean(input.notes, 400);
    const paymentLabel = clean(input.paymentLabel, 60) || "Sin especificar";

    if (!name || !phone) {
      return { ok: false, error: "Nombre y teléfono son obligatorios." };
    }

    const rawLines = Array.isArray(input.items) ? input.items.slice(0, MAX_LINES) : [];
    const lines = rawLines
      .map((l) => ({
        id: clean(l.id, 120),
        name: clean(l.name, 200),
        qty: Math.min(MAX_QTY, Math.max(1, Math.round(Number(l.qty) || 0))),
        clientPrice: Math.max(0, Math.round(Number(l.price) || 0)),
      }))
      .filter((l) => l.id !== "");
    if (lines.length === 0) {
      return { ok: false, error: "El carrito está vacío." };
    }

    const admin = createAdminClient();

    // Precio real desde la BD: el carrito guarda el slug (o el código en los destacados).
    const ids = [...new Set(lines.map((l) => l.id))];
    const [bySlug, byCode] = await Promise.all([
      admin.from("products").select("slug,code,name,price").in("slug", ids),
      admin.from("products").select("slug,code,name,price").in("code", ids),
    ]);
    if (bySlug.error) throw new Error(bySlug.error.message);
    if (byCode.error) throw new Error(byCode.error.message);

    const catalog = new Map<string, { slug: string; name: string; price: number | null }>();
    for (const p of byCode.data ?? []) catalog.set(p.code, p);
    for (const p of bySlug.data ?? []) catalog.set(p.slug, p); // el slug tiene prioridad

    let unverified = 0;
    const orderLines = lines.map((l) => {
      const p = catalog.get(l.id);
      if (p && p.price != null) {
        return { product_slug: p.slug, name: p.name, price: p.price, qty: l.qty };
      }
      // Fuera de catálogo: se conserva el precio mostrado, marcado para verificación.
      unverified += 1;
      return { product_slug: l.id, name: l.name || l.id, price: l.clientPrice, qty: l.qty };
    });

    const total = orderLines.reduce((n, l) => n + l.price * l.qty, 0);

    // Si hay sesión, se asocia el pedido al usuario.
    let userId: string | null = null;
    let userEmail: string | null = null;
    try {
      const supabase = await createClient();
      const { data } = await supabase.auth.getUser();
      userId = data.user?.id ?? null;
      userEmail = data.user?.email ?? null;
    } catch {
      // sin sesión (visitante)
    }

    const note =
      [
        `Pago: ${paymentLabel}`,
        address && `Entrega: ${address}${city ? ", " + city : ""}`,
        !address && city && `Ciudad: ${city}`,
        notes && `Nota: ${notes}`,
        unverified > 0 && `⚠ ${unverified} línea(s) fuera de catálogo: verificar precios`,
      ]
        .filter(Boolean)
        .join(" · ")
        .slice(0, 1000) || null;

    const { data: order, error: orderErr } = await admin
      .from("orders")
      .insert({
        customer_name: name,
        customer_phone: phone,
        customer_email: email ?? userEmail,
        note,
        status: "nuevo",
        total,
        user_id: userId,
      })
      .select("id")
      .single();
    if (orderErr) throw new Error(orderErr.message);

    const { error: itemsErr } = await admin.from("order_items").insert(
      orderLines.map((l) => ({ order_id: order.id, ...l }))
    );
    if (itemsErr) {
      // rollback de mejor esfuerzo para no dejar pedidos sin líneas
      await admin.from("orders").delete().eq("id", order.id);
      throw new Error(itemsErr.message);
    }

    const code = order.id.slice(0, 8).toUpperCase();

    // El correo nunca bloquea el pedido (y se omite si Resend no está configurado).
    await sendNewOrderEmails({
      code,
      customerName: name,
      customerPhone: phone,
      customerEmail: email ?? userEmail,
      paymentLabel,
      note,
      total,
      items: orderLines.map((l) => ({ name: l.name, qty: l.qty, price: l.price })),
    });

    revalidatePath("/admin");
    revalidatePath("/admin/pedidos");

    return { ok: true, code, total };
  } catch (e) {
    console.error("[createOrder]", e);
    return {
      ok: false,
      error: "No pudimos registrar el pedido en el sistema. Confírmalo por WhatsApp.",
    };
  }
}
