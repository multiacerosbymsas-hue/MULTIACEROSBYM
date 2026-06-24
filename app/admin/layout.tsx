import Link from "next/link";
import {
  LayoutDashboard,
  Package,
  Users,
  ClipboardList,
  Images,
  ExternalLink,
} from "lucide-react";
import { requireAdmin } from "@/lib/admin-guard";

export const dynamic = "force-dynamic";

const links = [
  { href: "/admin", label: "Resumen", icon: LayoutDashboard },
  { href: "/admin/productos", label: "Productos", icon: Package },
  { href: "/admin/contenido", label: "Contenido", icon: Images },
  { href: "/admin/usuarios", label: "Usuarios", icon: Users },
  { href: "/admin/pedidos", label: "Pedidos", icon: ClipboardList },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { profile } = await requireAdmin();

  return (
    <div className="container-x grid gap-8 py-8 lg:grid-cols-[220px_1fr] lg:py-10">
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <div className="rounded-[var(--radius-card)] border border-line bg-white p-4">
          <p className="px-2 pb-3 font-display text-sm font-bold text-ink">
            Panel · {profile?.full_name?.split(" ")[0] ?? "Admin"}
          </p>
          <nav className="space-y-1">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-ink/80 transition-colors hover:bg-paper hover:text-brand"
              >
                <l.icon size={17} /> {l.label}
              </Link>
            ))}
            <Link
              href="/"
              className="mt-2 flex items-center gap-2.5 rounded-lg border-t border-line px-3 pt-3 text-sm font-medium text-muted hover:text-ink"
            >
              <ExternalLink size={17} /> Ver sitio
            </Link>
          </nav>
        </div>
      </aside>

      <div className="min-w-0">{children}</div>
    </div>
  );
}
