import Image from "next/image";
import Link from "next/link";
import type { DivisionMerged } from "@/lib/sanity/loaders";
import { brandImages } from "@/lib/brand-assets";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ServicesDivisionTemplate({ merged }: { merged: DivisionMerged }) {
  const d = merged;

  return (
    <div>
      <section className="relative border-b border-border bg-muted">
        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-14 lg:grid-cols-2 lg:items-center lg:px-8 lg:py-20">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary">Service division</p>
            <h1 className="font-heading mt-3 text-4xl font-bold text-primary lg:text-5xl">{d.title}</h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-foreground/85">{d.summary}</p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button asChild>
                <Link href={`/contact?topic=${d.topicQuery}`}>Get a quote</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/services">All services</Link>
              </Button>
            </div>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-border bg-background shadow-inner">
            <Image
              src={brandImages.postRockLogoSquare}
              alt="Post Rock Ag"
              fill
              className="object-contain p-6 opacity-95"
              sizes="(max-width:1024px) 100vw, 50vw"
              priority
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/25 p-6 text-center text-sm font-medium text-white">
              {d.heroCaption}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 lg:px-8 lg:py-20">
        <h2 className="font-heading text-3xl font-semibold text-primary">What we offer</h2>
        <p className="mt-4 max-w-3xl text-foreground/85">{d.offeringsIntro}</p>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {d.bullets.map((b) => (
            <li key={b} className="rounded-lg border border-border bg-background p-5 text-sm leading-relaxed shadow-sm">
              {b}
            </li>
          ))}
        </ul>
      </section>

      <section className="border-t border-border bg-muted py-14 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <h2 className="font-heading text-3xl font-semibold text-primary">Key contacts</h2>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-foreground/80">{d.contactsIntro}</p>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {d.contacts.some((c) => c.name.trim()) ? (
              d.contacts
                .filter((c) => c.name.trim())
                .map((c) => (
                  <Card key={`${c.name}-${c.email}`}>
                    <CardHeader className="items-center space-y-3 text-center">
                      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full border border-border bg-muted">
                        {c.photoUrl ? (
                          <Image src={c.photoUrl} alt={c.name} fill className="object-cover" sizes="96px" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-[10px] font-medium text-foreground/45">
                            No photo
                          </div>
                        )}
                      </div>
                      <CardTitle className="text-lg">{c.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-center text-sm text-foreground/80">
                      {c.role.trim() ? <p>{c.role}</p> : null}
                      {c.email.trim() ? (
                        <p>
                          <a href={`mailto:${c.email}`} className="font-medium text-primary underline underline-offset-4">
                            {c.email}
                          </a>
                        </p>
                      ) : null}
                      {c.phone.trim() ? <p>{c.phone}</p> : null}
                    </CardContent>
                  </Card>
                ))
            ) : (
              <p className="text-sm text-foreground/70 sm:col-span-2 lg:col-span-3 xl:col-span-4">
                Add Team members in Sanity (with service divisions) or optional extra contacts on division copy — they
                appear here automatically.
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 lg:px-8 lg:py-20">
        <div className="rounded-xl border border-border bg-primary px-8 py-10 text-primary-foreground lg:flex lg:items-center lg:justify-between">
          <div>
            <h2 className="font-heading text-2xl font-semibold">Talk with our team</h2>
            <p className="mt-2 max-w-xl text-primary-foreground/90">
              Tell us what you need — routing is fastest when you choose the correct topic on the contact form.
            </p>
          </div>
          <Button asChild variant="secondary" className="mt-6 lg:mt-0">
            <Link href={`/contact?topic=${d.topicQuery}`}>Get a quote</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
