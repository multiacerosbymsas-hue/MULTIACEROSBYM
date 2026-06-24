import Link from "next/link";
import type { Metadata } from "next";
import { LogIn } from "lucide-react";
import { signIn } from "@/lib/auth-actions";

export const metadata: Metadata = { title: "Iniciar sesión" };

export default async function LoginPage({
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
            <LogIn size={20} />
          </span>
          <div>
            <h1 className="font-display text-xl font-bold text-ink">Iniciar sesión</h1>
            <p className="text-sm text-muted">Accede a tu cuenta de MultiAceros B&amp;M.</p>
          </div>
        </div>

        {error && (
          <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
            {error}
          </p>
        )}

        <form action={signIn} className="space-y-4">
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
              autoComplete="current-password"
              className="w-full rounded-xl border border-line bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-brand"
            />
          </label>
          <button
            type="submit"
            className="w-full rounded-full bg-brand py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
          >
            Entrar
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-muted">
          ¿No tienes cuenta?{" "}
          <Link href="/registro" className="font-semibold text-brand hover:underline">
            Regístrate
          </Link>
        </p>
      </div>
    </section>
  );
}
