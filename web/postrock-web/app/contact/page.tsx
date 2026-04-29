import type { Metadata } from "next";
import { Suspense } from "react";
import { buildMetadata } from "@/lib/metadata";
import { ContactForm } from "@/components/ContactForm";
import { LocationsMap } from "@/components/LocationsMap";
import { siteConfig } from "@/lib/site-config";
import { getContactCopy } from "@/lib/sanity/loaders";

export const metadata: Metadata = buildMetadata({
  title: "Contact",
  description: "Reach Post Rock Ag by filling out the form below.",
  path: "/contact",
});

export default async function ContactPage() {
  const contactVariables = await getContactCopy();

  return (
    <div className="mx-auto max-w-6xl px-4 py-14 lg:px-8 lg:py-20">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-secondary">Contact</p>
      <h1 className="font-heading mt-3 text-4xl font-bold text-primary lg:text-5xl">Get in touch</h1>
      <p className="mt-6 max-w-3xl text-lg leading-relaxed text-foreground/85">
        Forms validate with React Hook Form + Zod on the client and again on Route Handlers — API keys stay server-side.
      </p>

      <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <div>
          <h2 className="font-heading text-2xl font-semibold text-primary">Send a message</h2>
          <div className="mt-6">
            <Suspense
              fallback={
                <div className="animate-pulse space-y-6 rounded-lg border border-border bg-muted/60 p-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="h-10 rounded-md bg-muted" />
                    <div className="h-10 rounded-md bg-muted" />
                  </div>
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="h-10 rounded-md bg-muted" />
                    <div className="h-10 rounded-md bg-muted" />
                  </div>
                  <div className="h-32 rounded-md bg-muted" />
                  <div className="h-10 w-40 rounded-md bg-muted" />
                </div>
              }
            >
              <ContactForm />
            </Suspense>
          </div>
        </div>

        <aside className="space-y-8">
          <div className="rounded-xl border border-border bg-muted p-6">
            <h2 className="font-heading text-xl font-semibold text-primary">Department directory</h2>
            <dl className="mt-4 space-y-4 text-sm">
              <div>
                <dt className="font-semibold text-primary">General</dt>
                <dd className="text-foreground/80">
                  <a href={`mailto:${siteConfig.emails.info}`} className="underline">
                    {siteConfig.emails.info}
                  </a>
                  {contactVariables.generalPhone.trim() ? (
                    <>
                      <br />
                      {contactVariables.generalPhone}
                    </>
                  ) : null}
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-primary">Careers</dt>
                <dd className="text-foreground/80">
                  <a href={`mailto:${siteConfig.emails.careers}`} className="underline">
                    {siteConfig.emails.careers}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-primary">Investors</dt>
                <dd className="text-foreground/80">
                  <a href={`mailto:${siteConfig.emails.investors}`} className="underline">
                    {siteConfig.emails.investors}
                  </a>
                </dd>
              </div>
            </dl>
          </div>

          <div>
            <h2 className="font-heading text-xl font-semibold text-primary">Headquarters map</h2>
            <div className="mt-4">
              <LocationsMap title="HQ location" />
            </div>
            {contactVariables.hqAddressBlock.trim() ? (
              <p className="mt-3 whitespace-pre-line text-xs text-foreground/70">{contactVariables.hqAddressBlock}</p>
            ) : null}
          </div>
        </aside>
      </div>
    </div>
  );
}
