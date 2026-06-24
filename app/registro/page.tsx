import Link from "next/link";
import type { Metadata } from "next";
import { UserPlus } from "lucide-react";
import { signUp } from "@/lib/auth-actions";

export const metadata: Metadata = { title: "Crear cuenta" };

export default async function RegistroPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <section className="container-x flex min-h-[72vh] items-center justify-center py-16">
      <div className="w-full max-w-md rounded-[var(--radius-card)] border border-line bg-white p-8 shadow-[var(--shadow-card)]">
        <div className="mb-6 flex items-center gap-2.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-tint text-brand">
            <UserPlus size={20} />
          </span>
          <div>
            <h1 className="font-display text-xl font-bold text-ink">Crear cuenta</h1>
            <p className="text-sm text-muted">Guarda tus cotizaciones y pedidos.</p>
          </div>
        </div>

        {error && (
          <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
            {error}
          </p>
        )}

        <form action={signUp} className="space-y-4">
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-ink">Nombre completo</span>
            <input
              type="text"
              name="full_name"
              required
              autoComplete="name"
              className="w-full rounded-xl border border-line bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-brand"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-ink">Teléfono / WhatsApp</span>
            <input
              type="tel"
              name="phone"
              autoComplete="tel"
              className="w-full rounded-xl border border-line bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-brand"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-ink">Correo</span>
            <input
              type="email"
              name="email"
              required
              autoComplete="email"
              className="w-full rounded-xl border border-line bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-brand"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-ink">Contraseña</span>
            <input
              type="password"
              name="password"
              required
              minLength={6}
              autoComplete="new-password"
              className="w-full rounded-xl border border-line bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-brand"
            />
            <span className="mt-1 block text-xs text-muted">Mínimo 6 caracteres.</span>
          </label>
          <button
            type="submit"
            className="w-full rounded-full bg-brand py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
          >
            Crear cuenta
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-muted">
          ¿Ya tienes cuenta?{" "}
          <Link href="/login" className="font-semibold text-brand hover:underline">
            Inicia sesión
          </Link>
        </p>
      </div>
    </section>
  );
}
