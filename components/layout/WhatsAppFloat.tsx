"use client";

import { MessageCircle } from "lucide-react";
import { company } from "@/lib/data/company";
import { whatsappLink } from "@/lib/utils/format";

export function WhatsAppFloat() {
  const href = whatsappLink(
    `Hola ${company.brand} 👋, estoy en su página web y quiero más información.`
  );
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escríbenos por WhatsApp"
      className="group fixed bottom-5 right-5 z-40 flex items-center gap-0 rounded-full bg-[#25D366] p-3.5 text-white shadow-lg shadow-black/20 transition-all hover:gap-2 hover:pr-5"
    >
      <MessageCircle size={26} className="shrink-0" fill="currentColor" />
      <span className="max-w-0 overflow-hidden whitespace-nowrap text-sm font-semibold transition-all duration-300 group-hover:max-w-[140px]">
        Escríbenos
      </span>
      <span className="absolute right-3.5 top-3.5 -z-10 h-7 w-7 animate-ping rounded-full bg-[#25D366] opacity-60" />
    </a>
  );
}
