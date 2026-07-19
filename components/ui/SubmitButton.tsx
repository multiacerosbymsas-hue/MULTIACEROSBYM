"use client";

import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";

/**
 * Botón de envío para formularios del panel admin.
 * Al hacer clic muestra un efecto "water glass": el botón se hunde un poco y
 * una barra de luz llena su interior mientras la acción del servidor corre,
 * dejando claro que el clic se registró y que está cargando.
 */
export function SubmitButton({
  children,
  className = "",
  pendingText,
}: {
  children: React.ReactNode;
  className?: string;
  pendingText?: string;
}) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      data-pending={pending ? "" : undefined}
      aria-busy={pending}
      className={`btn-glass ${className}`}
    >
      <span className="btn-glass-fill" aria-hidden="true" />
      <span className="relative z-10 inline-flex items-center justify-center gap-2">
        {pending && <Loader2 size={16} className="animate-spin" />}
        {pending ? pendingText ?? "Guardando…" : children}
      </span>
    </button>
  );
}
