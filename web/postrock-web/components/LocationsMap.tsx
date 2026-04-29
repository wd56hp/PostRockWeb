export function LocationsMap({ title = "Locations map" }: { title?: string }) {
  const embed = process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL;

  if (!embed) {
    return (
      <div className="flex aspect-video w-full flex-col items-center justify-center rounded-lg border border-dashed border-border bg-muted p-8 text-center">
        <p className="font-medium text-primary">{title}</p>
        <p className="mt-2 max-w-xl text-sm text-foreground/75">
          Configure{" "}
          <code className="rounded bg-background px-1 py-0.5 text-xs">NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL</code> for an
          embedded HQ / territory map.
        </p>
      </div>
    );
  }

  return (
    <iframe
      title={title}
      className="aspect-video w-full rounded-lg border border-border"
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      src={embed}
    />
  );
}
