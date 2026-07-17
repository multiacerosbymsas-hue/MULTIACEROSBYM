"use client";

import { usePathname } from "next/navigation";
import { company } from "@/lib/data/company";

/** Rutas donde NO se muestran las redes: el catálogo y el panel admin. */
const HIDDEN_PREFIXES = [
  "/catalogo",
  "/categoria",
  "/producto",
  "/referencia",
  "/admin",
];

const socials = [
  {
    label: "TikTok",
    href: company.socials.tiktok,
    bg: "#010101",
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true">
        <path d="M16.5 5.6a4.7 4.7 0 0 1-1.9-2.6h-2.9v11.6a2.1 2.1 0 1 1-2.1-2.1c.2 0 .4 0 .6.1V9.6a5 5 0 1 0 4.4 5V8.7a6.5 6.5 0 0 0 3.8 1.2V7a4.7 4.7 0 0 1-1.9-1.4z" />
      </svg>
    ),
  },
  {
    label: "Facebook",
    href: company.socials.facebook,
    bg: "#1877F2",
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true">
        <path d="M14 9h3l.5-3H14V4.5c0-.83.5-1.5 1.5-1.5H17V.2A20 20 0 0 0 14.7 0C12.2 0 10.5 1.5 10.5 4.2V6H8v3h2.5v9H14z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: company.socials.instagram,
    bg: "linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)",
    icon: (
      <svg viewBox="0 0 24 24" width="21" height="21" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </svg>
    ),
  },
  {
    label: "YouTube",
    href: company.socials.youtube,
    bg: "#FF0000",
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true">
        <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31.3 31.3 0 0 0 0 12a31.3 31.3 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31.3 31.3 0 0 0 24 12a31.3 31.3 0 0 0-.5-5.8zM9.6 15.6V8.4L15.8 12l-6.2 3.6z" />
      </svg>
    ),
  },
];

export function FloatingSocials() {
  const pathname = usePathname() || "";
  const hidden = HIDDEN_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(p + "/")
  );
  if (hidden) return null;

  return (
    <div className="fixed left-3 top-1/2 z-40 flex -translate-y-1/2 flex-col gap-3">
      {socials.map((s) => (
        <a
          key={s.label}
          href={s.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={s.label}
          title={s.label}
          style={{ background: s.bg }}
          className="group relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-full text-white shadow-lg shadow-black/30 ring-1 ring-white/50 transition-all duration-300 hover:scale-110 hover:shadow-xl hover:ring-white/80"
        >
          {/* Brillo superior tipo vidrio/agua */}
          <span className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/55 to-transparent" />
          <span className="pointer-events-none absolute -left-1 top-1 h-5 w-7 -rotate-12 rounded-full bg-white/40 blur-[2px]" />
          <span className="relative drop-shadow-sm">{s.icon}</span>
        </a>
      ))}
    </div>
  );
}
