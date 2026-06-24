import Link from "next/link";
import type { Metadata } from "next";
import { Package, Users, ClipboardList, Layers } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Panel · Resumen" };

export default async function AdminHome() {
  const supabase = await createClient();
  const [products, withPrice, users, orders] = await Promise.all([
    supabase.from("products").select("*", { count: "exact", head: true }),
    supabase
      .from("products")
      .select("*", { count: "exact", head: true })
      .not("price", "is", null),
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("orders").select("*", { count: "exact", head: true }),
  ]);

  const cards = [
    {
      label: "Productos",
      value: products.count ?? 0,
      hint: `${withPrice.count ?? 0} con precio`,
      icon: Package,
      href: "/admin/productos",
    },
    {
      label: "Usuarios",
      value: users.count ?? 0,
      hint: "registrados",
      icon: Users,
      href: "/admin/usuarios",
    },
    {
      label: "Pedidos",
      value: orders.count ?? 0,
      hint: "recibidos",
      icon: ClipboardList,
      href: "/admin/pedidos",
    },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-ink">Resumen</h1>
      <p className="mt-1 text-sm text-muted">
        Gestiona el catálogo, los usuarios y los pedidos de MultiAceros B&amp;M.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {cards.map((c) => (
          <Link
            key={c.label}
            href={c.href}
            className="group rounded-[var(--radius-card)] border border-line bg-white p-5 transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-soft)]"
          >
            <div className="flex items-center justify-between">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-tint text-brand">
                <c.icon size={20} />
              </span>
              <Layers size={16} className="text-line" />
            </div>
            <p className="mt-3 font-display text-3xl font-bold text-ink">
              {c.value.toLocaleString("es-CO")}
            </p>
            <p className="text-sm font-medium text-ink">{c.label}</p>
            <p className="text-xs text-muted">{c.hint}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8 rounded-[var(--radius-card)] border border-line bg-paper p-5 text-sm text-muted">
        Tip: al editar un precio o producto, el sitio público se actualiza
        automáticamente (revalidación inmediata).
      </div>
    </div>
  );
}
