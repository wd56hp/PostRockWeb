import Link from "next/link";
import type { LocationEntry } from "@/lib/data/locations";
import { cn } from "@/lib/utils";

export function LocationCard({ location, className }: { location: LocationEntry; className?: string }) {
  return (
    <article className={cn("rounded-lg border border-border bg-background p-6 shadow-sm", className)}>
      <h3 className="font-heading text-xl font-semibold text-primary">
        <Link href={`/locations/${location.slug}`} className="hover:underline">
          {location.name}
        </Link>
      </h3>
      <p className="mt-2 text-sm text-foreground/80">
        {location.addressLine1}
        <br />
        {location.city}, {location.state} {location.zip}
      </p>
      <p className="mt-3 text-sm font-medium">{location.phone}</p>
      <p className="mt-1 text-xs text-foreground/70">Hours: {location.hours}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {location.services.map((s) => (
          <span key={s} className="rounded-full bg-muted px-3 py-1 text-xs font-semibold uppercase text-secondary">
            {s}
          </span>
        ))}
      </div>
    </article>
  );
}
