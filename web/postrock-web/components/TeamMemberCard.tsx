import Image from "next/image";
import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { TeamMember } from "@/lib/sanity/loaders";
import { divisionRouting } from "@/lib/services-meta";

type Props = {
  member: TeamMember;
  /** `compact` trims bio for home strip. */
  variant?: "full" | "compact";
};

export function TeamMemberCard({ member, variant = "full" }: Props) {
  const { name, role, email, phone, bio, photoUrl, divisions } = member;
  const showBio = variant === "full" && bio.trim().length > 0;
  const photoClass = variant === "compact" ? "h-20 w-20" : "h-28 w-28";
  const photoSizes = variant === "compact" ? "80px" : "112px";

  return (
    <Card className="flex flex-col overflow-hidden">
      <CardHeader className="items-center pb-2 text-center">
        <div
          className={`relative mb-3 shrink-0 overflow-hidden rounded-full border border-border bg-muted ${photoClass}`}
        >
          {photoUrl ? (
            <Image src={photoUrl} alt={name} fill className="object-cover" sizes={photoSizes} />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs font-semibold text-foreground/50">
              Photo
            </div>
          )}
        </div>
        <CardTitle className="text-lg leading-snug">{name}</CardTitle>
        {role.trim() ? <p className="text-sm text-foreground/75">{role}</p> : null}
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-3 text-sm text-foreground/80">
        {divisions.length > 0 ? (
          <div className="flex flex-wrap justify-center gap-1.5">
            {divisions.map((d) => (
              <Link
                key={d}
                href={`/services/${d}`}
                className="rounded-full border border-border bg-muted px-2.5 py-0.5 text-xs font-medium text-secondary hover:bg-background"
              >
                {divisionRouting[d].title}
              </Link>
            ))}
          </div>
        ) : null}
        {email.trim() ? (
          <p className="text-center">
            <a href={`mailto:${email}`} className="font-medium text-primary underline underline-offset-4">
              {email}
            </a>
          </p>
        ) : null}
        {phone.trim() ? <p className="text-center">{phone}</p> : null}
        {showBio ? <p className="text-left text-foreground/75">{bio}</p> : null}
      </CardContent>
    </Card>
  );
}
