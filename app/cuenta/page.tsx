import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LogOut, ShieldCheck, ShoppingBag } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/lib/auth-actions";

export const metadata: Metadata = { title: "Mi cuenta" };

const ROLE_LABEL: Record<string, string> = {
  customer: "Cliente",
  wholesale: "Mayorista",
  admin: "Administrador",
};

export default async function CuentaPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, phone, role, discount_pct")
    .eq("id", user.id)
    .maybeSingle();

  const name = profile?.full_name || user.email;
  const role = profile?.role ?? "customer";

  return (
    <section className="container-x py-12 lg:py-16">
      <div className="mx-auto max-w-2xl">
        <div className="flex items-center gap-4">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-ink font-display text-xl font-bold text-white">
            {(name ?? "U").charAt(0).toUpperCase()}
          </span>
          <div>
            <h1 className="font-display text-2xl font-bold text-ink">
              Hola, {name}
            </h1>
            <span className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-brand-tint px-2.5 py-0.5 text-xs font-semibold text-brand">
              {ROLE_LABEL[role] ?? "Cliente"}
              {profile?.discount_pct ? ` · ${profile.discount_pct}% dto.` : ""}
            </span>
          </div>
        </div>

        <div className="mt-8 grid gap-4 rounded-[var(--radius-card)] border border-line bg-white p-6">
          <Row label="Correo" value={user.email ?? "—"} />
          <Row label="Teléfono" value={profile?.phone || "—"} />
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/catalogo"
            className="inline-flex items-center gap-2 rounded-full bg-brand px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
          >
            <ShoppingBag size={17} /> Seguir comprando
          </Link>

          {role === "admin" && (
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 rounded-full border border-ink bg-white px-5 py-3 text-sm font-semibold text-ink transition-colors hover:bg-ink hover:text-white"
            >
              <ShieldCheck size={17} /> Panel admin
            </Link>
          )}

          <form action={signOut}>
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-5 py-3 text-sm font-semibold text-ink transition-colors hover:border-ink"
            >
              <LogOut size={17} /> Cerrar sesión
            </button>
          </form>
        </div>

        <p className="mt-8 text-sm text-muted">
          Pronto verás aquí el historial de tus cotizaciones y pedidos.
        </p>
      </div>
    </section>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 text-sm">
      <span className="text-muted">{label}</span>
      <span className="font-medium text-ink">{value}</span>
    </div>
  );
}
