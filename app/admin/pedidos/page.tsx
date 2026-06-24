import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { formatCOP } from "@/lib/utils/format";
import { setOrderStatus } from "@/lib/admin-actions";

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
  searchParams: Promise<{ ok?: string }>;
}) {
  const { ok } = await searchParams;
  const supabase = await createClient();
  const { data: orders } = await supabase
    .from("orders")
    .select("id, customer_name, customer_phone, status, total, created_at")
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
      </div>
      <p className="mt-1 text-sm text-muted">
        Cotizaciones y pedidos recibidos. Hoy el checkout es por WhatsApp; cuando
        habilitemos el pedido en línea, aparecerán aquí.
      </p>

      <div className="mt-5 space-y-3">
        {(orders ?? []).map((o) => (
          <form
            key={o.id}
            action={setOrderStatus}
            className="flex flex-wrap items-center gap-3 rounded-xl border border-line bg-white p-4"
          >
            <input type="hidden" name="id" value={o.id} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-ink">
                {o.customer_name}
              </p>
              <p className="font-mono text-[11px] text-muted">
                {o.customer_phone || "—"} ·{" "}
                {new Date(o.created_at).toLocaleDateString("es-CO")}
              </p>
            </div>
            <span className="font-display text-sm font-bold text-ink">
              {formatCOP(o.total)}
            </span>
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
