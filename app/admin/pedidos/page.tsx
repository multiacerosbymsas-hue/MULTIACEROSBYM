import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { formatCOP } from "@/lib/utils/format";
import { setOrderStatus } from "@/lib/admin-actions";
import { DeleteOrderButton } from "@/components/admin/DeleteOrderButton";

export const metadata: Metadata = { title: "Panel · Pedidos" };

const STATUS = ["nuevo", "en_proceso", "completado", "cancelado"] as const;
const STATUS_LABEL: Record<string, string> = {
  nuevo: "Nuevo",
  en_proceso: "En proceso",
  completado: "Completado",
  cancelado: "Cancelado",
};

export default async function AdminPedidos({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string; borrado?: string }>;
}) {
  const { ok, borrado } = await searchParams;
  const supabase = await createClient();
  const { data: orders } = await supabase
    .from("orders")
    .select(
      "id, customer_name, customer_phone, customer_email, note, status, total, created_at, order_items(name, qty, price)"
    )
    .order("created_at", { ascending: false })
    .limit(100);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-bold text-ink">Pedidos</h1>
        {ok && (
          <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
            Actualizado ✓
          </span>
        )}
        {borrado && (
          <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700">
            Pedido eliminado ✓
          </span>
        )}
      </div>
      <p className="mt-1 text-sm text-muted">
        Pedidos recibidos desde la tienda en línea. El cliente confirma por
        WhatsApp; aquí puedes hacer seguimiento y cambiar el estado.
      </p>

      <div className="mt-5 space-y-3">
        {(orders ?? []).map((o) => (
          <div
            key={o.id}
            className="flex flex-wrap items-center gap-3 rounded-xl border border-line bg-white p-4"
          >
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-ink">
                <span className="mr-2 font-mono text-[11px] font-normal text-muted">
                  #{o.id.slice(0, 8).toUpperCase()}
                </span>
                {o.customer_name}
              </p>
              <p className="font-mono text-[11px] text-muted">
                {o.customer_phone || "—"}
                {o.customer_email ? ` · ${o.customer_email}` : ""} ·{" "}
                {new Date(o.created_at).toLocaleString("es-CO", {
                  dateStyle: "short",
                  timeStyle: "short",
                })}
              </p>
              {(o.order_items?.length ?? 0) > 0 && (
                <p className="mt-1 line-clamp-2 text-xs text-muted">
                  {o.order_items
                    .map((it) => `${it.qty} × ${it.name}`)
                    .join(" · ")}
                </p>
              )}
              {o.note && <p className="mt-1 text-xs text-muted/90">{o.note}</p>}
            </div>
            <span className="font-display text-sm font-bold text-ink">
              {formatCOP(o.total)}
            </span>
            <form action={setOrderStatus} className="flex items-center gap-2">
              <input type="hidden" name="id" value={o.id} />
              <select
                name="status"
                defaultValue={o.status}
                className="rounded-lg border border-line bg-white px-3 py-2 text-sm outline-none focus:border-brand"
              >
                {STATUS.map((s) => (
                  <option key={s} value={s}>
                    {STATUS_LABEL[s]}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand"
              >
                Guardar
              </button>
            </form>
            <DeleteOrderButton id={o.id} />
          </div>
        ))}
        {(orders?.length ?? 0) === 0 && (
          <div className="rounded-xl border border-dashed border-line bg-paper py-12 text-center text-sm text-muted">
            Aún no hay pedidos.
          </div>
        )}
      </div>
    </div>
  );
}
