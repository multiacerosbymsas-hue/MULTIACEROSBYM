import type { ReactNode } from "react";
import { Reveal } from "./Reveal";

export function SectionHeading({
  eyebrow,
  title,
  sub,
  align = "center",
  tone = "dark",
}: {
  eyebrow: string;
  title: ReactNode;
  sub?: ReactNode;
  align?: "center" | "left";
  tone?: "dark" | "light";
}) {
  const isCenter = align === "center";
  return (
    <Reveal
      className={`max-w-2xl ${isCenter ? "mx-auto text-center" : "text-left"}`}
    >
      <p className="mb-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-brand">
        <span className="h-px w-6 bg-brand" />
        {eyebrow}
      </p>
      <h2
        className={`font-display text-3xl font-bold leading-tight tracking-tight sm:text-4xl ${
          tone === "light" ? "text-white" : "text-ink"
        }`}
      >
        {title}
      </h2>
      {sub && (
        <p
          className={`mt-4 text-base leading-relaxed ${
            tone === "light" ? "text-white/70" : "text-muted"
          }`}
        >
          {sub}
        </p>
      )}
    </Reveal>
  );
}
