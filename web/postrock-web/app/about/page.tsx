import type { Metadata } from "next";
import Image from "next/image";
import { buildMetadata } from "@/lib/metadata";
import { brandImages } from "@/lib/brand-assets";
import { siteConfig } from "@/lib/site-config";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TeamMemberCard } from "@/components/TeamMemberCard";
import { VisionMissionSection } from "@/components/VisionMissionSection";
import { getAboutCopy, getTeamMembers, getVisionMission } from "@/lib/sanity/loaders";

export const metadata: Metadata = buildMetadata({
  title: "About",
  description: "Company story, team, leadership, mission, and values — Post Rock Ag.",
  path: "/about",
});

export default async function AboutPage() {
  const [visionMissionValues, about, team] = await Promise.all([getVisionMission(), getAboutCopy(), getTeamMembers()]);
  const leaders = about.leaders.filter((l) => (l.name ?? "").trim());

  return (
    <div className="mx-auto max-w-5xl px-4 py-14 lg:px-8 lg:py-20">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-secondary">About</p>
      <h1 className="font-heading mt-3 text-4xl font-bold text-primary lg:text-5xl">
        Grounded execution across agricultural services
      </h1>
      <p className="mt-6 max-w-3xl text-lg leading-relaxed text-foreground/85">{about.companyHistory}</p>

      <div className="mt-12 overflow-hidden rounded-xl border border-border bg-muted">
        <div className="relative aspect-[21/9] w-full">
          <Image
            src={brandImages.postRockLogoHorizontal}
            alt={siteConfig.name}
            fill
            className="object-contain p-8 lg:p-14"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-black/25" />
          <div className="absolute inset-0 flex items-center justify-center p-8 text-center">
            <p className="font-heading text-2xl font-semibold text-white lg:text-3xl">{about.aboutHeroCaption}</p>
          </div>
        </div>
      </div>

      <section className="mt-16">
        <VisionMissionSection content={visionMissionValues} />
      </section>

      <section id="team" className="mt-16 scroll-mt-24">
        <h2 className="font-heading text-3xl font-semibold text-primary">Team</h2>
        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-foreground/85">
          Each profile can include a photo, bio, and contact info. Pick one or more service divisions so the same person
          appears under Key contacts on those service pages.
        </p>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {team.length === 0 ? (
            <p className="text-sm text-foreground/70 sm:col-span-2 lg:col-span-3">
              Create Team member documents with a photo, contact fields, and one or more service divisions.
            </p>
          ) : (
            team.map((m) => <TeamMemberCard key={m.id} member={m} />)
          )}
        </div>
      </section>

      <section className="mt-16">
        <h2 className="font-heading text-3xl font-semibold text-primary">Leadership</h2>
        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-foreground/85">{about.leadershipIntro}</p>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {leaders.length === 0 ? (
            <p className="text-sm text-foreground/70 md:col-span-3">
              Publish leadership cards (name, role, bio) in Sanity — they replace these placeholders automatically.
            </p>
          ) : (
            leaders.map((l, i) => (
              <Card key={`${l.name ?? i}-${l.role ?? ""}`}>
                <CardHeader>
                  <CardTitle>{l.name ?? ""}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-foreground/85">
                  <p>{l.role ?? ""}</p>
                  <p>{l.bio ?? ""}</p>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
