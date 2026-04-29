import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { ProducerPortalNotifyForm } from "@/components/ProducerPortalNotifyForm";

export const metadata: Metadata = buildMetadata({
  title: "Producer Portal",
  description: "Producer workspace launching June 2026 — ticket summaries, bids, contracts, and cash bids.",
  path: "/producer-portal",
});

export default function ProducerPortalPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 lg:px-8 lg:py-24">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-secondary">Producer workspace</p>
      <h1 className="font-heading mt-4 text-4xl font-bold text-primary lg:text-5xl">Producer Portal — Launching June 2026</h1>
      <p className="mt-6 text-lg leading-relaxed text-foreground/85">
        The Producer Portal will consolidate account summaries, scale tickets, contracts, and cash bids — powered by AgTrax /
        Bushel-class integrations once vendors are finalized.
      </p>

      <div className="mt-10 rounded-xl border border-border bg-muted p-8">
        <h2 className="font-heading text-xl font-semibold text-primary">Notify me when it launches</h2>
        <p className="mt-3 text-sm text-foreground/75">
          Adds your email to Mailchimp with tag <code className="rounded bg-background px-1">producer-portal-launch</code>.
        </p>
        <div className="mt-6">
          <ProducerPortalNotifyForm />
        </div>
      </div>
    </div>
  );
}
