import { ShieldCheck } from "lucide-react";

/**
 * Franja de medios de pago aceptados (Nequi, Bancolombia, Davivienda, PSE,
 * tarjetas y crédito con Sistecrédito). Marcas recreadas como SVG/estilos
 * inline para que se vean nítidas a cualquier tamaño y no pesen.
 *
 * `variant="band"` = franja completa con título (para la página de checkout).
 * `variant="inline"` = solo la fila de logos (para usar en el carrito u otros).
 */
export function PaymentLogos({
  variant = "band",
}: {
  variant?: "band" | "inline";
}) {
  const row = (
    <ul className="flex flex-wrap items-center gap-2.5">
      {logos.map((l) => (
        <li
          key={l.name}
          title={l.name}
          className="flex h-11 items-center gap-2 rounded-xl border border-line bg-white px-3 shadow-sm"
        >
          {l.mark}
          {l.word}
        </li>
      ))}
    </ul>
  );

  if (variant === "inline") {
    return (
      <div aria-label="Medios de pago aceptados" className="space-y-2">
        <p className="text-xs font-medium text-muted">Medios de pago</p>
        {row}
      </div>
    );
  }

  return (
    <section
      aria-label="Medios de pago aceptados"
      className="rounded-[var(--radius-card)] border border-line bg-paper p-5 sm:p-6"
    >
      <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck size={18} className="text-brand" />
            <h2 className="font-display text-base font-bold text-ink">
              Medios de pago aceptados
            </h2>
          </div>
          <p className="mt-1 text-sm text-muted">
            Paga con tu banco, billetera digital, tarjeta o{" "}
            <span className="font-semibold text-ink">a crédito con Sistecrédito</span>.
          </p>
        </div>
        {row}
      </div>
    </section>
  );
}

/* ------------------------------- Marcas ------------------------------- */

const logos: { name: string; mark: React.ReactNode; word: React.ReactNode }[] = [
  {
    name: "Nequi",
    mark: (
      <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden>
        <rect width="24" height="24" rx="7" fill="#200020" />
        <circle cx="12" cy="12" r="5" fill="#DA0081" />
        <circle cx="12" cy="12" r="2" fill="#fff" />
      </svg>
    ),
    word: <span className="text-sm font-bold text-[#DA0081]">Nequi</span>,
  },
  {
    name: "Bancolombia",
    mark: (
      <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden>
        <rect width="24" height="24" rx="5" fill="#FDDA24" />
        <path d="M7 16 12 7l5 9z" fill="#2B2B2B" />
      </svg>
    ),
    word: <span className="text-sm font-semibold text-[#2B2B2B]">Bancolombia</span>,
  },
  {
    name: "Davivienda",
    mark: (
      <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden>
        <path d="M12 3 3 11v10h6v-6h6v6h6V11z" fill="#ED1C24" />
      </svg>
    ),
    word: <span className="text-sm font-bold text-[#ED1C24]">Davivienda</span>,
  },
  {
    name: "PSE",
    mark: null,
    word: (
      <span className="rounded-md bg-[#0A3D91] px-1.5 py-1 text-[11px] font-extrabold tracking-wide text-white">
        PSE
      </span>
    ),
  },
  {
    name: "Visa",
    mark: null,
    word: (
      <span className="text-lg font-extrabold italic leading-none tracking-tight text-[#1A1F71]">
        VISA
      </span>
    ),
  },
  {
    name: "Mastercard",
    mark: (
      <svg width="34" height="22" viewBox="0 0 34 22" aria-hidden>
        <circle cx="13" cy="11" r="9" fill="#EB001B" />
        <circle cx="21" cy="11" r="9" fill="#F79E1B" fillOpacity="0.9" />
        <path
          d="M17 4.2a9 9 0 0 1 0 13.6 9 9 0 0 1 0-13.6z"
          fill="#FF5F00"
        />
      </svg>
    ),
    word: <span className="text-xs font-medium text-[#3A3A3A]">Mastercard</span>,
  },
  {
    name: "Sistecrédito",
    mark: (
      <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden>
        <rect width="24" height="24" rx="6" fill="#43A047" />
        <path
          d="m7 12.5 3 3 7-7"
          fill="none"
          stroke="#fff"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    word: (
      <span className="text-sm font-bold">
        <span className="text-[#2B2B2B]">Siste</span>
        <span className="text-[#43A047]">crédito</span>
      </span>
    ),
  },
];
