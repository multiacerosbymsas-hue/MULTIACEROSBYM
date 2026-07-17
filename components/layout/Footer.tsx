import Image from "next/image";
import Link from "next/link";
import { MapPin, Phone, Mail } from "lucide-react";
import { company } from "@/lib/data/company";

const navLinks = [
  { href: "/#inicio", label: "Inicio" },
  { href: "/catalogo", label: "Catálogo" },
  { href: "/#nosotros", label: "Nosotros" },
  { href: "/#servicios", label: "Servicios" },
  { href: "/#contacto", label: "Contacto" },
];

const footerLink =
  "block text-sm text-white/60 transition-colors hover:text-white";

const catLinks = [
  "Tubería y perfilería",
  "Láminas y aceros",
  "Cubiertas y tejas",
  "Varilla y ángulos",
  "Herramientas",
];

export function Footer() {
  return (
    <footer className="bg-ink text-white">
      <div className="container-x grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="lg:pr-6">
          <div className="flex items-center gap-3">
            <Image
              src="/images/logo-mark.png"
              alt={company.legalName}
              width={48}
              height={48}
              className="rounded-lg"
            />
            <span className="font-display text-lg font-bold leading-none">
              MULTI<span className="text-brand">ACEROS</span>
              <span className="block text-[11px] font-medium tracking-widest text-white/50">
                B&M S.A.S
              </span>
            </span>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-white/60">
            {company.slogan}. Materiales para construcción y ornamentación con
            calidad certificada en Bucaramanga.
          </p>
          <div className="mt-5 flex gap-3">
            <SocialIcon href={company.socials.instagram} label="Instagram">
              <IgIcon />
            </SocialIcon>
            <SocialIcon href={company.socials.facebook} label="Facebook">
              <FbIcon />
            </SocialIcon>
            <SocialIcon href={company.socials.tiktok} label="TikTok">
              <TkIcon />
            </SocialIcon>
            <SocialIcon href={company.socials.youtube} label="YouTube">
              <YtIcon />
            </SocialIcon>
          </div>
        </div>

        <FooterCol title="Navegación">
          {navLinks.map((l) => (
            <Link key={l.href} href={l.href} className={footerLink}>
              {l.label}
            </Link>
          ))}
        </FooterCol>

        <FooterCol title="Líneas de producto">
          {catLinks.map((c) => (
            <Link key={c} href="/catalogo" className={footerLink}>
              {c}
            </Link>
          ))}
        </FooterCol>

        <FooterCol title="Contacto">
          {company.addresses.map((a) => (
            <div key={a.label} className="text-sm text-white/60">
              <div className="flex items-start gap-2">
                <MapPin size={16} className="mt-0.5 shrink-0 text-brand" />
                <span>
                  <span className="font-semibold text-white/85">{a.label}</span>
                  <br />
                  {a.line}, {a.city}
                </span>
              </div>
              <a
                href={`tel:+57${a.phone.replace(/\s/g, "")}`}
                className="ml-6 mt-1 inline-flex items-center gap-2 transition-colors hover:text-white"
              >
                <Phone size={14} className="shrink-0 text-brand" />
                {a.phone}
              </a>
            </div>
          ))}
          <a
            href={`mailto:${company.email}`}
            className="flex items-center gap-2 break-all text-sm text-white/60 transition-colors hover:text-white"
          >
            <Mail size={16} className="shrink-0 text-brand" />
            {company.email}
          </a>
        </FooterCol>
      </div>

      <div className="border-t border-white/10">
        <div className="container-x flex flex-col items-center justify-between gap-2 py-5 text-xs text-white/50 sm:flex-row">
          <p>
            © {new Date().getFullYear()} {company.legalName} — Todos los derechos
            reservados.
          </p>
          <p>NIT {company.nit}</p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="mb-4 font-display text-sm font-semibold uppercase tracking-wide text-white">
        {title}
      </h4>
      <div className="flex flex-col gap-2.5">{children}</div>
    </div>
  );
}

function IgIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function FbIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
      <path d="M14 9h3l.5-3H14V4.5c0-.83.5-1.5 1.5-1.5H17V.2A20 20 0 0 0 14.7 0C12.2 0 10.5 1.5 10.5 4.2V6H8v3h2.5v9H14z" />
    </svg>
  );
}

function YtIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
      <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31.3 31.3 0 0 0 0 12a31.3 31.3 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31.3 31.3 0 0 0 24 12a31.3 31.3 0 0 0-.5-5.8zM9.6 15.6V8.4L15.8 12l-6.2 3.6z" />
    </svg>
  );
}

function TkIcon() {
  return (
    <svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor">
      <path d="M16.5 5.6a4.7 4.7 0 0 1-1.9-2.6h-2.9v11.6a2.1 2.1 0 1 1-2.1-2.1c.2 0 .4 0 .6.1V9.6a5 5 0 1 0 4.4 5V8.7a6.5 6.5 0 0 0 3.8 1.2V7a4.7 4.7 0 0 1-1.9-1.4z" />
    </svg>
  );
}

function SocialIcon({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="flex h-9 w-9 items-center justify-center rounded-full bg-white/8 text-white/80 transition-colors hover:bg-brand hover:text-white"
    >
      {children}
    </a>
  );
}
