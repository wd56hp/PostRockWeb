import Image from "next/image";
import Link from "next/link";
import { getAllNewsMeta } from "@/lib/content/news";
import { ServiceCard } from "@/components/ServiceCard";
import { TeamMemberCard } from "@/components/TeamMemberCard";
import { LocationCard } from "@/components/LocationCard";
import { NewsCard } from "@/components/NewsCard";
import { LocationsMap } from "@/components/LocationsMap";
import { MarketsTicker } from "@/components/MarketsTicker";
import { MailingListSignup } from "@/components/MailingListSignup";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/site-config";
import { brandImages } from "@/lib/brand-assets";
import { getFeaturedTeamMembers, getHomeCopy, getLocations, getVisionMission } from "@/lib/sanity/loaders";
import { VisionMissionSection } from "@/components/VisionMissionSection";
import type { DivisionKey } from "@/lib/services-meta";
import { DIVISION_KEYS_ORDERED, divisionRouting } from "@/lib/services-meta";

export default async function HomePage() {
  const [home, allLocations, visionMission, featuredTeam] = await Promise.all([
    getHomeCopy(),
    getLocations(),
    getVisionMission(),
    getFeaturedTeamMembers(),
  ]);
  const previewLocations = allLocations.slice(0, 4);
  const latestNews = getAllNewsMeta().slice(0, 3);
  const homeServiceCards: Record<DivisionKey, string> = {
    grain: home.servicesCardGrain,
    feed: home.servicesCardFeed,
    marketing: home.servicesCardMarketing,
    agronomy: home.servicesCardAgronomy,
    energy: home.servicesCardEnergy,
  };

  return (
    <>
      <section className="border-b border-border bg-muted">
        <div className="mx-auto flex max-w-7xl flex-col gap-10 px-4 py-14 lg:flex-row lg:items-center lg:justify-between lg:px-8 lg:py-20">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-secondary">
              Private agricultural services
            </p>
            <h1 className="font-heading mt-4 text-4xl font-bold leading-tight text-primary lg:text-5xl">
              Built for producers — grain, feed and supply, marketing, agronomy, and energy.
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-foreground/85">{home.heroTagline}</p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button asChild size="lg">
                <Link href="/locations">Find your nearest location</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/contact">Get in touch</Link>
              </Button>
            </div>
          </div>
          <div className="relative aspect-square w-full max-w-md overflow-hidden rounded-xl border border-border bg-muted/50 p-6 shadow lg:max-w-lg">
            <Image
              src={brandImages.postRockLogoHero}
              alt={siteConfig.name}
              fill
              className="object-contain p-4"
              sizes="(max-width:1024px) 100vw, 420px"
              priority
            />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 flex bg-gradient-to-t from-black/45 to-transparent p-6 pt-16">
              <p className="text-sm font-medium text-white">{home.heroImageCaption}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-background py-14 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-secondary">Who we are</p>
          <VisionMissionSection content={visionMission} className="mt-3" />
          <p className="mt-8 text-sm text-foreground/75">
            <Link href="/about" className="font-semibold text-secondary underline underline-offset-4">
              About
            </Link>{" "}
            — company history, team, leadership, and the same vision and mission content in context.
          </p>
        </div>
      </section>

      {featuredTeam.length > 0 ? (
        <section className="border-y border-border bg-background py-14 lg:py-20">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <h2 className="font-heading text-3xl font-semibold text-primary">Team</h2>
                <p className="mt-3 max-w-2xl text-sm text-foreground/85">
                  Featured team members — enable &quot;Featured on home page&quot; on a Team member in Sanity.
                </p>
              </div>
              <Button variant="outline" asChild>
                <Link href="/about#team">Meet the full team</Link>
              </Button>
            </div>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featuredTeam.map((m) => (
                <TeamMemberCard key={m.id} member={m} variant="compact" />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="bg-muted py-14 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className="font-heading text-3xl font-semibold text-primary">Services</h2>
              <p className="mt-3 max-w-2xl text-foreground/85">
                Five divisions — publish positioning and card blurbs in Sanity (`homePage`).
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/services">Services overview</Link>
            </Button>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {DIVISION_KEYS_ORDERED.map((key: DivisionKey) => (
              <ServiceCard
                key={key}
                title={divisionRouting[key].title}
                description={homeServiceCards[key]}
                href={`/services/${key}`}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-background py-14 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className="font-heading text-3xl font-semibold text-primary">Locations</h2>
              <p className="mt-3 max-w-2xl text-foreground/85">
                Regional presence — addresses and detail pages sync from Sanity `location` documents when configured.
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/locations">All locations</Link>
            </Button>
          </div>
          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            <LocationsMap title="Territory overview" />
            <div className="grid gap-4 sm:grid-cols-2">
              {previewLocations.map((loc) => (
                <LocationCard key={loc.slug} location={loc} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-muted py-14 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className="font-heading text-3xl font-semibold text-primary">News & resources</h2>
              <p className="mt-3 text-foreground/85">Announcements and practical updates — newest first.</p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/news">Browse news</Link>
            </Button>
          </div>
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {latestNews.length === 0 ? (
              <p className="text-sm text-foreground/70">
                Add MDX posts under <code className="rounded bg-background px-1">content/news</code>.
              </p>
            ) : (
              latestNews.map((post) => <NewsCard key={post.slug} {...post} />)
            )}
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-background py-14 lg:py-20">
        <div className="mx-auto max-w-3xl px-4 text-center lg:px-8">
          <h2 className="font-heading text-3xl font-semibold text-primary">Stay informed</h2>
          <p className="mt-3 text-foreground/85">
            Email updates from {siteConfig.name}. Mailchimp is integrated via a Route Handler — keys remain server-side.
          </p>
          <div className="mt-8 text-left">
            <MailingListSignup variant="full" />
          </div>
        </div>
      </section>

      <MarketsTicker />
    </>
  );
}
