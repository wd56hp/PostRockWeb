"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = {
  id: string;
  active: boolean;
  message: string;
  severity: "info" | "warning" | "critical";
};

export function AlertBanner({ id, active, message, severity }: Props) {
  const [hydrated, setHydrated] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    setHydrated(true);
    try {
      setDismissed(localStorage.getItem(`alert-dismiss-${id}`) === "1");
    } catch {
      /* ignore */
    }
  }, [id]);

  if (!hydrated || !active || !message.trim() || dismissed) return null;

  const palette =
    severity === "critical"
      ? "border-red-700 bg-red-950 text-red-50"
      : severity === "warning"
        ? "border-accent bg-accent/15 text-foreground"
        : "border-primary/30 bg-primary/10 text-foreground";

  return (
    <div className={cn("border-b px-4 py-3", palette)} role="region" aria-label="Site alert">
      <div className="mx-auto flex max-w-7xl items-start gap-3 lg:px-8">
        <p className="flex-1 text-sm leading-relaxed">{message}</p>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="shrink-0 text-current hover:bg-black/10"
          aria-label="Dismiss alert"
          onClick={() => {
            try {
              localStorage.setItem(`alert-dismiss-${id}`, "1");
            } catch {
              /* ignore */
            }
            setDismissed(true);
          }}
        >
          <X className="size-4" />
        </Button>
      </div>
    </div>
  );
}
