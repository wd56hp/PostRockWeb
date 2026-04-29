import Link from "next/link";
import { Linkedin, Facebook } from "lucide-react";
import { footerQuickLinks } from "@/lib/nav";
import { siteConfig } from "@/lib/site-config";
import { MailingListSignup } from "@/components/MailingListSignup";
import { getLocations } from "@/lib/sanity/loaders";

export async function Footer() {
  const locations = await getLocations();
  const featured = locations.slice(0, 4);
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-muted/40">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 lg:grid-cols-4 lg:gap-8 lg:px-8">
        <div>
          <p className="font-heading text-lg font-semibold text-primary">{siteConfig.name}</p>
          <p className="mt-2 text-sm leading-relaxed text-foreground/80">{siteConfig.description}</p>
          <div className="mt-4 flex gap-3">
            {siteConfig.social.linkedin.startsWith("http") ? (
              <a
                href={siteConfig.social.linkedin}
                className="rounded-md border border-border p-2 hover:bg-muted"
                aria-label="LinkedIn"
              >
                <Linkedin className="size-5 text-primary" />
              </a>
            ) : null}
            {siteConfig.social.facebook.startsWith("http") ? (
              <a
                href={siteConfig.social.facebook}
                className="rounded-md border border-border p-2 hover:bg-muted"
                aria-label="Facebook"
              >
                <Facebook className="size-5 text-primary" />
              </a>
            ) : null}
          </div>
        </div>

        <div>
          <p className="font-heading text-sm font-semibold uppercase tracking-wide text-secondary">Quick links</p>
          <ul className="mt-4 space-y-2 text-sm">
            {footerQuickLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-foreground/90 hover:text-primary hover:underline">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="font-heading text-sm font-semibold uppercase tracking-wide text-secondary">Locations</p>
          <ul className="mt-4 space-y-4 text-sm">
            {featured.map((loc) => (
              <li key={loc.slug}>
                <Link href={`/locations/${loc.slug}`} className="font-medium text-primary hover:underline">
                  {loc.name}
                </Link>
                <p className="text-foreground/70">
                  {loc.city}, {loc.state} · {loc.phone}
                </p>
              </li>
            ))}
          </ul>
          <Link href="/locations" className="mt-4 inline-block text-sm font-medium text-secondary hover:underline">
            All locations →
          </Link>
        </div>

        <div>
          <p className="font-heading text-sm font-semibold uppercase tracking-wide text-secondary">Connect</p>
          <div className="mt-4">
            <MailingListSignup variant="compact" />
          </div>
          <div className="mt-6 border-t border-border pt-6">
            <p className="text-sm font-semibold text-primary">Legal</p>
            <ul className="mt-2 space-y-2 text-sm">
              <li>
                <Link href="/privacy" className="hover:underline">
                  Privacy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:underline">
                  Terms
                </Link>
              </li>
              <li>
                <Link href="/accessibility" className="hover:underline">
                  Accessibility
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-border py-4 text-center text-xs text-foreground/70">
        © {year} {siteConfig.name}. All rights reserved.
      </div>
    </footer>
  );
}
