const items = [
  "Galvanizados",
  "Inoxidable",
  "Cold Rolled",
  "Hot Rolled",
  "Perfilería",
  "Ornamentación",
  "Estructural",
  "Cubiertas",
];

export function Marquee() {
  return (
    <div className="overflow-hidden bg-ink py-4" aria-hidden>
      <div className="animate-marquee flex w-max items-center gap-8 whitespace-nowrap">
        {[...items, ...items, ...items].map((item, i) => (
          <div key={i} className="flex items-center gap-8">
            <span className="font-display text-sm font-semibold uppercase tracking-widest text-white/80">
              {item}
            </span>
            <span className="text-brand">◆</span>
          </div>
        ))}
      </div>
    </div>
  );
}
