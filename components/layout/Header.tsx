"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X, ShoppingCart, Phone, Clock, User } from "lucide-react";
import { company } from "@/lib/data/company";
import { useCart, useCartCount } from "@/lib/store/cart";
import { useMounted } from "@/components/ui/Reveal";
import { createClient } from "@/lib/supabase/client";

const nav = [
  { href: "/#inicio", label: "Inicio" },
  { href: "/catalogo", label: "Catálogo" },
  { href: "/#nosotros", label: "Nosotros" },
  { href: "/#servicios", label: "Servicios" },
  { href: "/#contacto", label: "Contacto" },
];

export function Header() {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  const openCart = useCart((s) => s.open);
  const count = useCartCount();
  const mounted = useMounted();
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setAuthed(!!data.user));
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) =>
      setAuthed(!!session?.user)
    );
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="sticky top-0 z-50">
      {/* Barra superior */}
      <div className="hidden bg-ink text-white/80 md:block">
        <div className="container-x flex h-9 items-center justify-between text-xs">
          <p className="flex items-center gap-2">
            <span className="font-semibold text-brand">Mayorista y minorista</span>
            <span className="text-white/30">·</span>
            <span>{company.yearsInMarket} años de experiencia en Bucaramanga</span>
          </p>
          <div className="flex items-center gap-5">
            <span className="flex items-center gap-1.5">
              <Clock size={13} className="text-brand" /> Lun–Vie 7:30am–5pm · Sáb 7:30am–12m
            </span>
            <a
              href={`tel:+57${company.phones[0].replace(/\s/g, "")}`}
              className="flex items-center gap-1.5 transition-colors hover:text-white"
            >
              <Phone size={13} className="text-brand" /> {company.phones[0]}
            </a>
          </div>
        </div>
      </div>

      {/* Barra principal */}
      <div
        className={`border-b transition-all duration-300 ${
          solid
            ? "border-line bg-white/90 shadow-sm backdrop-blur-md"
            : "border-transparent bg-white"
        }`}
      >
        <div className="container-x flex h-[68px] items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2.5" aria-label={company.legalName}>
            <Image
              src="/images/logo-full.jpg"
              alt={company.legalName}
              width={44}
              height={44}
              className="rounded-lg"
              priority
            />
            <span className="font-display text-lg font-bold leading-none text-ink">
              MULTI<span className="text-brand">ACEROS</span>
              <span className="block text-[10px] font-medium tracking-[0.2em] text-muted">
                B&M S.A.S
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {nav.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="rounded-full px-3.5 py-2 text-sm font-medium text-ink/80 transition-colors hover:bg-paper hover:text-brand"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={openCart}
              className="relative flex h-10 w-10 items-center justify-center rounded-full text-ink transition-colors hover:bg-paper"
              aria-label="Abrir carrito"
            >
              <ShoppingCart size={20} />
              {mounted && count > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand px-1 text-[11px] font-bold text-white">
                  {count}
                </span>
              )}
            </button>

            <Link
              href={mounted && authed ? "/cuenta" : "/login"}
              className="flex h-10 w-10 items-center justify-center rounded-full text-ink transition-colors hover:bg-paper"
              aria-label={mounted && authed ? "Mi cuenta" : "Iniciar sesión"}
            >
              <User size={20} />
            </Link>

            <Link
              href="/#contacto"
              className="hidden rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-brand-dark sm:inline-flex"
            >
              Cotizar
            </Link>

            <button
              onClick={() => setOpen(true)}
              className="flex h-10 w-10 items-center justify-center rounded-full text-ink transition-colors hover:bg-paper lg:hidden"
              aria-label="Abrir menú"
            >
              <Menu size={22} />
            </button>
          </div>
        </div>
      </div>

      {/* Menú móvil */}
      <div
        className={`fixed inset-0 z-50 lg:hidden ${open ? "" : "pointer-events-none"}`}
        aria-hidden={!open}
        inert={!open}
      >
        <div
          className={`absolute inset-0 bg-ink/50 transition-opacity ${
            open ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setOpen(false)}
        />
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Menú de navegación"
          className={`absolute right-0 top-0 flex h-full w-[80%] max-w-xs flex-col bg-white shadow-xl transition-transform duration-300 ${
            open ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between border-b border-line px-5 py-4">
            <span className="font-display font-bold text-ink">Menú</span>
            <button
              onClick={() => setOpen(false)}
              className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-paper"
              aria-label="Cerrar menú"
            >
              <X size={20} />
            </button>
          </div>
          <nav className="flex flex-col p-3">
            {nav.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-4 py-3 text-base font-medium text-ink transition-colors hover:bg-paper hover:text-brand"
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="mt-auto space-y-2 border-t border-line p-5">
            <Link
              href={mounted && authed ? "/cuenta" : "/login"}
              onClick={() => setOpen(false)}
              className="flex items-center justify-center gap-2 rounded-full border border-line px-5 py-3 text-sm font-semibold text-ink"
            >
              <User size={17} /> {mounted && authed ? "Mi cuenta" : "Iniciar sesión"}
            </Link>
            <Link
              href="/#contacto"
              onClick={() => setOpen(false)}
              className="flex items-center justify-center rounded-full bg-brand px-5 py-3 text-sm font-semibold text-white"
            >
              Cotizar ahora
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
