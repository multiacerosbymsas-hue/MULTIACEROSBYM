"use client";

import { Trash2 } from "lucide-react";
import { deleteOrder } from "@/lib/admin-actions";

/**
 * Botón para eliminar un pedido de forma permanente.
 * Pide confirmación antes de disparar la Server Action (evita borrados por error).
 * Va en su propio <form> para no anidarse con el form de cambio de estado.
 */
export function DeleteOrderButton({ id }: { id: string }) {
  return (
    <form
      action={deleteOrder}
      onSubmit={(e) => {
        if (
          !window.confirm(
            "¿Eliminar este pedido de forma permanente? Esta acción no se puede deshacer."
          )
        ) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        title="Eliminar pedido"
        aria-label="Eliminar pedido"
        className="flex items-center gap-1 rounded-full border border-red-200 bg-white px-3.5 py-2 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50"
      >
        <Trash2 size={15} /> Eliminar
      </button>
    </form>
  );
}
