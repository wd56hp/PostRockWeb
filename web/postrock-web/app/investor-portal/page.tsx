import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { siteConfig } from "@/lib/site-config";
import { InvestorInquiryForm } from "@/components/InvestorInquiryForm";

export const metadata: Metadata = buildMetadata({
  title: "Investor inquiries",
  description:
    "Qualified investor inquiries for Post Rock Ag — manual review before confidential materials are shared.",
  path: "/investor-portal",
});

export default function InvestorPortalPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 lg:px-8 lg:py-24">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-secondary">Investors</p>
      <h1 className="font-heading mt-4 text-4xl font-bold text-primary lg:text-5xl">Investing in Post Rock Ag</h1>
      <p className="mt-6 max-w-3xl text-lg leading-relaxed text-foreground/85">
        Post Rock Ag is a private agricultural services platform. We do not operate a self-serve investor portal —
        inquiries are reviewed individually.
      </p>

      <section className="mt-14 rounded-xl border border-border bg-muted p-8 lg:p-10">
        <h2 className="font-heading text-2xl font-semibold text-primary">How the inquiry process works</h2>
        <ol className="mt-6 list-decimal space-y-4 pl-6 text-sm leading-relaxed text-foreground/85">
          <li>
            <strong className="text-primary">Submit the form.</strong> Tell us who you are and what you&apos;re evaluating.
          </li>
          <li>
            <strong className="text-primary">Qualification.</strong> We review fit, mandate alignment, and confidentiality expectations.
          </li>
          <li>
            <strong className="text-primary">Follow-up.</strong> If there&apos;s a match, we&apos;ll coordinate next steps directly.
          </li>
        </ol>
      </section>

      <section className="mt-14">
        <h2 className="font-heading text-2xl font-semibold text-primary">Submit an inquiry</h2>
        <p className="mt-4 max-w-3xl text-sm text-foreground/75">
          Routed securely via Resend to{" "}
          <span className="font-semibold text-primary">{siteConfig.emails.investors}</span>{" "}
          (override recipient with <code className="rounded bg-muted px-1 text-xs">INVESTOR_TO_EMAIL</code> in production).
          All inquiries are reviewed and qualified before further information is shared.
        </p>
        <div className="mt-8 max-w-2xl">
          <InvestorInquiryForm />
        </div>
      </section>
    </div>
  );
}
