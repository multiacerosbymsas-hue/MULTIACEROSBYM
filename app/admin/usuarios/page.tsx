import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { setUserRole } from "@/lib/admin-actions";
import { SubmitButton } from "@/components/ui/SubmitButton";

export const metadata: Metadata = { title: "Panel · Usuarios" };

export default async function AdminUsuarios({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string }>;
}) {
  const { ok } = await searchParams;
  const supabase = await createClient();
  const { data: users } = await supabase
    .from("profiles")
    .select("id, full_name, phone, role, discount_pct, created_at")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-bold text-ink">Usuarios</h1>
        {ok && (
          <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
            Guardado ✓
          </span>
        )}
      </div>
      <p className="mt-1 text-sm text-muted">
        Asigna rol (cliente / mayorista / admin) y descuento por usuario.
      </p>

      <div className="mt-5 space-y-3">
        {(users ?? []).map((u) => (
          <form
            key={u.id}
            action={setUserRole}
            className="flex flex-wrap items-end gap-3 rounded-xl border border-line bg-white p-4"
          >
            <input type="hidden" name="id" value={u.id} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-ink">
                {u.full_name || "(sin nombre)"}
              </p>
              <p className="font-mono text-[11px] text-muted">{u.phone || "—"}</p>
            </div>

            <label className="text-xs text-muted">
              Rol
              <select
                name="role"
                defaultValue={u.role}
                className="mt-1 block rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink outline-none focus:border-brand"
              >
                <option value="customer">Cliente</option>
                <option value="wholesale">Mayorista</option>
                <option value="admin">Admin</option>
              </select>
            </label>

            <label className="text-xs text-muted">
              Descuento %
              <input
                name="discount_pct"
                inputMode="decimal"
                defaultValue={Number(u.discount_pct)}
                className="mt-1 block w-24 rounded-lg border border-line bg-white px-3 py-2 text-sm outline-none focus:border-brand"
              />
            </label>

            <SubmitButton className="rounded-full bg-ink px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand">
              Guardar
            </SubmitButton>
          </form>
        ))}
        {(users?.length ?? 0) === 0 && (
          <div className="rounded-xl border border-dashed border-line bg-paper py-10 text-center text-sm text-muted">
            Aún no hay usuarios registrados.
          </div>
        )}
      </div>
    </div>
  );
}
