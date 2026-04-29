"use client";

export function MarketsTicker() {
  const line =
    "Cash bids • Basis • Freight spreads • Fuel • Inputs • Weather • USDA reports • Local announcements • ";
  return (
    <div className="border-y border-border bg-primary text-primary-foreground">
      <div className="relative overflow-hidden py-3">
        <div className="flex w-max animate-marquee whitespace-nowrap font-mono text-xs uppercase tracking-wide opacity-95">
          <span className="px-8">{line.repeat(4)}</span>
          <span className="px-8" aria-hidden>
            {line.repeat(4)}
          </span>
        </div>
      </div>
      <p className="border-t border-white/10 px-4 py-2 text-center text-[11px] text-primary-foreground/80">
        Placeholder ticker — embed DTN / Barchart / Bushel widgets here when integrations are approved.
      </p>
    </div>
  );
}
