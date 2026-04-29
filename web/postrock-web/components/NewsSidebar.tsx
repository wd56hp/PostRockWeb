import Link from "next/link";
import { MailingListSignup } from "@/components/MailingListSignup";
import { getNewsSidebarCopy } from "@/lib/sanity/loaders";

export async function NewsSidebar() {
  const copy = await getNewsSidebarCopy();
  const sds = copy.sdsLibraryLink.trim();
  const sdsIsUrl = /^https?:\/\//i.test(sds);

  return (
    <aside className="space-y-8 lg:sticky lg:top-28">
      <div className="rounded-xl border border-border bg-muted p-6">
        <h2 className="font-heading text-lg font-semibold text-primary">Subscribe</h2>
        <p className="mt-2 text-sm text-foreground/80">Company updates via Mailchimp — keys stay server-side.</p>
        <div className="mt-4">
          <MailingListSignup variant="compact" />
        </div>
      </div>

      <div className="rounded-xl border border-border bg-background p-6 shadow-sm">
        <h2 className="font-heading text-lg font-semibold text-primary">Weather snapshot</h2>
        <p className="mt-2 text-sm text-foreground/75">{copy.weatherWidget}</p>
      </div>

      <div className="rounded-xl border border-border bg-background p-6 shadow-sm">
        <h2 className="font-heading text-lg font-semibold text-primary">Resources</h2>
        <ul className="mt-3 space-y-2 text-sm">
          <li>
            <a href="https://www.usda.gov/" className="font-medium text-secondary underline underline-offset-4">
              USDA resources →
            </a>
          </li>
          <li>
            {sdsIsUrl ? (
              <a href={sds} className="font-medium text-secondary underline underline-offset-4">
                SDS library →
              </a>
            ) : (
              <span className="text-foreground/80">{sds}</span>
            )}
          </li>
          <li>
            <Link href="/markets" className="font-medium text-secondary underline underline-offset-4">
              Markets workspace →
            </Link>
          </li>
        </ul>
      </div>
    </aside>
  );
}
