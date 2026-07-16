"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties, MutableRefObject, PointerEvent as ReactPointerEvent } from "react";
import Image from "next/image";
import { MessageCircle, X } from "lucide-react";
import { company, advisors } from "@/lib/data/company";
import { whatsappLink } from "@/lib/utils/format";

const greeting = `Hola ${company.brand} 👋, estoy en su página web y quiero más información.`;

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

/**
 * Permite arrastrar el botón flotante (pensado sobre todo para móvil, con el
 * dedo). Distingue un toque —abrir el menú— de un arrastre —mover el botón—
 * con un umbral de 6px, y mantiene el botón siempre dentro de la pantalla.
 * `dragged` queda en true justo tras un arrastre para que el clic que sigue
 * no dispare la apertura del menú.
 */
function useDragMove(elRef: MutableRefObject<HTMLElement | null>) {
  const [pos, setPos] = useState<{ left: number; top: number } | null>(null);
  const st = useRef({ x: 0, y: 0, l: 0, t: 0, w: 0, h: 0, id: -1, moved: false, active: false });
  const dragged = useRef(false);

  const onPointerDown = (e: ReactPointerEvent<HTMLElement>) => {
    const el = elRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    st.current = {
      x: e.clientX,
      y: e.clientY,
      l: r.left,
      t: r.top,
      w: r.width,
      h: r.height,
      id: e.pointerId,
      moved: false,
      active: true,
    };
    dragged.current = false;
  };

  const onPointerMove = (e: ReactPointerEvent<HTMLElement>) => {
    const c = st.current;
    if (!c.active || e.pointerId !== c.id) return;
    const dx = e.clientX - c.x;
    const dy = e.clientY - c.y;
    if (!c.moved && Math.hypot(dx, dy) < 6) return; // umbral: aún es un toque
    if (!c.moved) {
      c.moved = true;
      dragged.current = true;
      try {
        (e.currentTarget as HTMLElement).setPointerCapture(c.id);
      } catch {}
    }
    const m = 8; // margen mínimo con el borde de la pantalla
    const left = Math.min(Math.max(m, c.l + dx), window.innerWidth - c.w - m);
    const top = Math.min(Math.max(m, c.t + dy), window.innerHeight - c.h - m);
    setPos({ left, top });
  };

  const onPointerUp = () => {
    st.current.active = false;
  };

  const handlers = {
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onPointerCancel: onPointerUp,
  };
  const style: CSSProperties | undefined = pos
    ? { left: pos.left, top: pos.top, right: "auto", bottom: "auto" }
    : undefined;
  return { handlers, style, pos, dragged };
}

export function WhatsAppFloat() {
  const [open, setOpen] = useState(false);
  const [showTip, setShowTip] = useState(false);
  const posRef = useRef<HTMLElement | null>(null);
  const setPosRef = (el: HTMLElement | null) => {
    posRef.current = el;
  };
  const { handlers: dragHandlers, style: dragStyle, pos: dragPos, dragged } = useDragMove(posRef);
  const multiple = advisors.length > 1;

  // Burbuja que invita a hablar con un asesor (una vez por sesión).
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      if (sessionStorage.getItem("mab-tip") === "off") return;
    } catch {}
    const t = setTimeout(() => setShowTip(true), 2600);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (open) setShowTip(false);
  }, [open]);

  const dismissTip = () => {
    setShowTip(false);
    try {
      sessionStorage.setItem("mab-tip", "off");
    } catch {}
  };

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (posRef.current && !posRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // Un solo asesor: enlace directo a WhatsApp, sin menú.
  if (!multiple) {
    return (
      <a
        ref={setPosRef}
        href={whatsappLink(greeting, advisors[0].whatsapp)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Escríbele a ${advisors[0].name} por WhatsApp`}
        onClick={(e) => {
          if (dragged.current) {
            dragged.current = false;
            e.preventDefault(); // se acaba de arrastrar: no abrir WhatsApp
          }
        }}
        {...dragHandlers}
        style={dragStyle}
        className="group fixed bottom-5 right-5 z-40 flex touch-none select-none items-center gap-0 rounded-full bg-[#25D366] p-3.5 text-white shadow-lg shadow-black/20 transition-all hover:gap-2 hover:pr-5"
      >
        <MessageCircle size={26} className="shrink-0" fill="currentColor" />
        <span className="max-w-0 overflow-hidden whitespace-nowrap text-sm font-semibold transition-all duration-300 group-hover:max-w-[170px]">
          Habla con un asesor
        </span>
        <span className="absolute right-3.5 top-3.5 -z-10 h-7 w-7 animate-ping rounded-full bg-[#25D366] opacity-60 motion-reduce:hidden" />
      </a>
    );
  }

  // Al arrastrar el botón, el menú se abre hacia el lado con espacio.
  const vw = typeof window !== "undefined" ? window.innerWidth : 0;
  const vh = typeof window !== "undefined" ? window.innerHeight : 0;
  const openUp = dragPos ? dragPos.top > vh / 2 : true;
  const alignLeft = dragPos ? dragPos.left < vw / 2 : false;

  // Varios asesores: botón que abre un selector con el nombre de cada uno.
  return (
    <div ref={setPosRef} style={dragStyle} className="fixed bottom-5 right-5 z-40">
      {/* Burbuja creativa que invita a escribir (se oculta si ya moviste el botón) */}
      {showTip && !open && !dragPos && (
        <div className="animate-tip-in absolute bottom-1 right-16 w-56 rounded-2xl rounded-br-md border border-line bg-white px-4 py-3 text-left shadow-[var(--shadow-card)]">
          <button
            onClick={dismissTip}
            aria-label="Cerrar"
            className="absolute right-1.5 top-1.5 flex h-5 w-5 items-center justify-center rounded-full text-muted transition-colors hover:bg-paper"
          >
            <X size={13} />
          </button>
          <p className="pr-3 font-display text-sm font-bold leading-tight text-ink">
            ¿Hablamos? 👋
          </p>
          <p className="mt-0.5 text-xs leading-snug text-muted">
            Clic aquí y un asesor te cotiza al instante.
          </p>
        </div>
      )}

      {open && (
        <div
          className={`absolute ${openUp ? "bottom-16" : "top-16"} ${
            alignLeft ? "left-0" : "right-0"
          } w-72 overflow-hidden rounded-2xl border border-line bg-white shadow-[var(--shadow-card)]`}
        >
          <div className="flex items-center justify-between bg-[#25D366] px-4 py-3 text-white">
            <div>
              <p className="font-display text-sm font-bold leading-tight">
                Habla con un asesor
              </p>
              <p className="text-[11px] text-white/85">Te respondemos por WhatsApp</p>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Cerrar"
              className="rounded-full p-1 transition-colors hover:bg-white/20"
            >
              <X size={18} />
            </button>
          </div>
          <ul className="max-h-[60vh] divide-y divide-line overflow-y-auto">
            {advisors.map((a) => (
              <li key={a.name + a.whatsapp}>
                <a
                  href={whatsappLink(greeting, a.whatsapp)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-paper"
                >
                  {a.photo ? (
                    <Image
                      src={a.photo}
                      alt={`Foto de ${a.name}`}
                      width={40}
                      height={40}
                      className="h-10 w-10 shrink-0 rounded-full border border-line object-cover"
                    />
                  ) : (
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#25D366]/15 font-display text-sm font-bold text-[#128C4A]">
                      {initials(a.name)}
                    </span>
                  )}
                  <span className="min-w-0">
                    <span className="block truncate font-semibold text-ink">{a.name}</span>
                    <span className="block truncate text-xs text-muted">{a.role}</span>
                  </span>
                  <MessageCircle
                    size={18}
                    className="ml-auto shrink-0 text-[#25D366]"
                    fill="currentColor"
                  />
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <button
        onClick={() => {
          if (dragged.current) {
            dragged.current = false; // se acaba de arrastrar: no abrir el menú
            return;
          }
          setOpen((v) => !v);
        }}
        {...dragHandlers}
        aria-expanded={open}
        aria-label="Hablar con un asesor por WhatsApp"
        className="group relative flex touch-none select-none items-center gap-0 rounded-full bg-[#25D366] p-3.5 text-white shadow-lg shadow-black/20 transition-all hover:gap-2 hover:pr-5"
      >
        <MessageCircle size={26} className="shrink-0" fill="currentColor" />
        <span className="max-w-0 overflow-hidden whitespace-nowrap text-sm font-semibold transition-all duration-300 group-hover:max-w-[170px]">
          Habla con un asesor
        </span>
        {!open && !showTip && (
          <span className="absolute right-3.5 top-3.5 -z-10 h-7 w-7 animate-ping rounded-full bg-[#25D366] opacity-60 motion-reduce:hidden" />
        )}
      </button>
    </div>
  );
}
