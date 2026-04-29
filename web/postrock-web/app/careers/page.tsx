import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata } from "@/lib/metadata";
import { siteConfig } from "@/lib/site-config";
import { getAllCareers } from "@/lib/content/careers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCareersLandingCopy } from "@/lib/sanity/loaders";

export const metadata: Metadata = buildMetadata({
  title: "Careers",
  description: "Why Post Rock Ag — benefits overview and current openings.",
  path: "/careers",
});

export default async function CareersPage() {
  const openings = getAllCareers();
  const landing = await getCareersLandingCopy();

  return (
    <div className="mx-auto max-w-5xl px-4 py-14 lg:px-8 lg:py-20">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-secondary">Careers</p>
      <h1 className="font-heading mt-3 text-4xl font-bold text-primary lg:text-5xl">
        Work where execution meets accountability
      </h1>
      <p className="mt-6 max-w-3xl text-lg leading-relaxed text-foreground/85">
        Priority audiences include teammates and prospective hires — tone stays grounded and plainspoken (not folksy, not overly corporate).
      </p>

      <section className="mt-12 grid gap-8 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-muted p-8">
          <h2 className="font-heading text-2xl font-semibold text-primary">Why work here</h2>
          <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-foreground/85">{landing.whyWorkHere}</p>
        </div>
        <div className="rounded-xl border border-border bg-muted p-8">
          <h2 className="font-heading text-2xl font-semibold text-primary">Benefits overview</h2>
          <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-foreground/85">{landing.benefits}</p>
        </div>
      </section>

      <section className="mt-16">
        <h2 className="font-heading text-3xl font-semibold text-primary">Current openings</h2>
        <p className="mt-3 text-sm text-foreground/75">
          Roles are authored as MDX files under <code className="rounded bg-muted px-1">content/careers</code>.
        </p>

        <div className="mt-8 grid gap-6">
          {openings.length === 0 ? (
            <p className="text-sm text-foreground/70">No postings published yet.</p>
          ) : (
            openings.map((job) => (
              <Card key={job.slug}>
                <CardHeader>
                  <CardTitle className="text-xl">{job.title}</CardTitle>
                  <p className="text-sm text-foreground/75">
                    {job.department} · {job.location} · {job.type}
                  </p>
                </CardHeader>
                <CardContent>
                  <Link href={`/careers/${job.slug}`} className="font-semibold text-secondary hover:underline">
                    View posting →
                  </Link>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        <div className="mt-10 rounded-xl border border-border bg-background p-8 shadow-sm">
          <h3 className="font-heading text-xl font-semibold text-primary">Apply</h3>
          <p className="mt-3 text-sm leading-relaxed text-foreground/85">
            Email{" "}
            <a href={`mailto:${siteConfig.emails.careers}`} className="font-semibold text-secondary underline">
              {siteConfig.emails.careers}
            </a>{" "}
            — attach a résumé and reference the posting title.
          </p>
        </div>
      </section>
    </div>
  );
}
