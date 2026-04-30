import fs from "fs";
import path from "path";
import type { SanityImageSource } from "@sanity/image-url";
import { cache } from "react";

import type { DivisionKey } from "@/lib/services-meta";
import { DIVISION_KEYS_ORDERED, divisionRouting } from "@/lib/services-meta";
import type { LocationEntry } from "@/lib/data/locations";
import { fallbackLocations } from "@/lib/data/locations";
import { fallbackVisionMission } from "@/lib/sanity/fallbacks";
import { sanityFetch } from "@/lib/sanity/client";
import { sanityImageUrl } from "@/lib/sanity/image";

export type VisionMissionContent = typeof fallbackVisionMission;

export type LeaderCard = { name?: string; role?: string; bio?: string };

export type DivisionContact = {
  name: string;
  role: string;
  email: string;
  phone: string;
  /** Populated from Team member photos when assigned to this division. */
  photoUrl?: string | null;
};

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  bio: string;
  photoUrl: string | null;
  divisions: DivisionKey[];
  featuredOnHome: boolean;
};

export type DivisionMerged = {
  title: string;
  topicQuery: string;
  summary: string;
  offeringsIntro: string;
  bullets: string[];
  heroCaption: string;
  contactsIntro: string;
  contacts: DivisionContact[];
};

function pick(...vals: (string | null | undefined)[]): string {
  for (const v of vals) {
    const t = typeof v === "string" ? v.trim() : "";
    if (t) return t;
  }
  return "";
}

function normalizeContacts(rows: Partial<DivisionContact>[] | null | undefined): DivisionContact[] {
  if (!rows?.length) return [];
  return rows.slice(0, 6).map((r) => ({
    name: pick(r?.name),
    role: pick(r?.role),
    email: pick(r?.email),
    phone: pick(r?.phone),
    photoUrl: null,
  }));
}

function isDivisionKey(s: string): s is DivisionKey {
  return (DIVISION_KEYS_ORDERED as readonly string[]).includes(s);
}

function parseDivisions(val: unknown): DivisionKey[] {
  if (!Array.isArray(val)) return [];
  const out: DivisionKey[] = [];
  for (const x of val) {
    if (typeof x === "string" && isDivisionKey(x)) out.push(x);
  }
  return out;
}

function dedupeContacts(list: DivisionContact[]): DivisionContact[] {
  const seen = new Set<string>();
  const out: DivisionContact[] = [];
  for (const c of list) {
    const emailKey = pick(c.email).toLowerCase();
    const key = emailKey || `${pick(c.name)}|${pick(c.role)}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(c);
  }
  return out;
}

function padBullets(bullets: string[] | null | undefined, fb: string[]): string[] {
  const b = bullets?.filter((x) => pick(x)).map((x) => pick(x)) ?? [];
  if (b.length >= 3) return b.slice(0, 3);
  const out = [...b];
  for (let i = out.length; i < 3; i++) out.push(fb[i] ?? "");
  return out;
}

/** Static fallback body copy per division — used when Sanity is empty. */
const FB_DIV: Record<
  DivisionKey,
  Omit<DivisionMerged, "title" | "topicQuery">
> = {
  agronomy: {
    summary:
      "Crop nutrition, crop protection, seed recommendations, and field-level execution aligned with your rotation and risk profile.",
    offeringsIntro:
      "Scouting, fertility planning, hybrid placement, and harvest coordination coordinated with grain marketing where applicable.",
    bullets: [
      "Season-long scouting cadence aligned with genetics and weather windows.",
      "Nutrition economics tied to soil tests and realistic yield targets.",
      "Harvest logistics coordinated across elevators and merchandising.",
    ],
    heroCaption: "Agronomy services",
    contactsIntro: "Regional agronomy contacts — publish names and phones in Sanity.",
    contacts: [],
  },
  energy: {
    summary:
      "Fuel products and delivery scheduling developed for agricultural operations and rural supply chains.",
    offeringsIntro:
      "Bulk fuels and lubricants coordinated around planting and harvest pulls — disciplined scheduling first.",
    bullets: [
      "Tankwagon and transport scheduling aligned with operations calendars.",
      "Product stewardship support on handling and containment basics.",
      "Backup coordination during peak seasonal demand.",
    ],
    heroCaption: "Energy products",
    contactsIntro: "Energy desk contacts — publish in Sanity.",
    contacts: [],
  },
  grain: {
    summary:
      "Origination, logistics, and marketing focused on disciplined execution and dependable movement.",
    offeringsIntro:
      "Cash bids, contracts, freight coordination, and settlement support oriented toward predictable outcomes.",
    bullets: [
      "Transparent bids plus disciplined contracting language.",
      "Freight coordination across elevators and end-user lanes.",
      "Settlement reconciliation aligned with scale ticket workflows.",
    ],
    heroCaption: "Grain marketing",
    contactsIntro: "Grain merchandising contacts — publish in Sanity.",
    contacts: [],
  },
  feed: {
    summary:
      "Ingredient sourcing and coordination designed for livestock producers and regional buyers.",
    offeringsIntro:
      "Rational formulations with dependable inbound logistics — priced against executable freight.",
    bullets: [
      "Ingredient procurement coordinated around ration targets.",
      "Inbound freight coordination sized for seasonal usage curves.",
      "Documentation discipline across weights and settlements.",
    ],
    heroCaption: "Feed and supply",
    contactsIntro: "Feed and supply contacts — publish in Sanity.",
    contacts: [],
  },
  marketing: {
    summary:
      "Grain and ingredient marketing aligned with transparent bids, contract discipline, and execution you can plan around.",
    offeringsIntro:
      "Cash marketing, hedging conversations, and logistics coordination tied to your operational calendar — not generic brokerage pitch decks.",
    bullets: [
      "Bid and basis transparency with contracting language reviewed for clarity.",
      "Freight and elevation coordination across your preferred lanes.",
      "Settlement support aligned with scale tickets and commercial expectations.",
    ],
    heroCaption: "Marketing desk",
    contactsIntro: "Marketing contacts — publish in Sanity.",
    contacts: [],
  },
};

function mapTeamMemberRow(row: {
  _id?: string;
  name?: string;
  role?: string;
  email?: string;
  phone?: string;
  bio?: string;
  photo?: SanityImageSource | null;
  divisions?: unknown;
  featuredOnHome?: boolean;
}): TeamMember | null {
  const name = pick(row.name);
  if (!name) return null;
  return {
    id: pick(row._id),
    name,
    role: pick(row.role),
    email: pick(row.email),
    phone: pick(row.phone),
    bio: pick(row.bio),
    photoUrl: sanityImageUrl(row.photo ?? undefined, { width: 640, height: 800 }),
    divisions: parseDivisions(row.divisions),
    featuredOnHome: Boolean(row.featuredOnHome),
  };
}

/** All team members (Sanity `teamMember` documents), sorted by name. */
export const getTeamMembers = cache(async (): Promise<TeamMember[]> => {
  const rows = await sanityFetch<
    {
      _id?: string;
      name?: string;
      role?: string;
      email?: string;
      phone?: string;
      bio?: string;
      photo?: SanityImageSource | null;
      divisions?: unknown;
      featuredOnHome?: boolean;
    }[]
  >(
    `*[_type == "teamMember"] | order(name asc) {
      _id,
      name,
      role,
      email,
      phone,
      bio,
      photo,
      divisions,
      featuredOnHome
    }`,
  );
  const mapped = rows?.map(mapTeamMemberRow).filter(Boolean) as TeamMember[] | undefined;
  return mapped ?? [];
});

/** Subset flagged for the home page team strip (max six). */
export const getFeaturedTeamMembers = cache(async (): Promise<TeamMember[]> => {
  const all = await getTeamMembers();
  return all.filter((m) => m.featuredOnHome).slice(0, 6);
});

export async function getDivisionMerged(division: DivisionKey): Promise<DivisionMerged> {
  const route = divisionRouting[division];
  const fb = FB_DIV[division];
  const doc = await sanityFetch<{
    agronomy?: RawDiv;
    energy?: RawDiv;
    grain?: RawDiv;
    feed?: RawDiv;
    marketing?: RawDiv;
  }>(`*[_type == "divisionCopy"][0]{ agronomy, energy, grain, feed, marketing }`);

  type RawDiv = {
    summary?: string;
    offeringsIntro?: string;
    bullets?: string[];
    heroCaption?: string;
    contactsIntro?: string;
    contacts?: Partial<DivisionContact>[];
  };

  const raw = doc?.[division];
  const bulletsMerged = padBullets(raw?.bullets, fb.bullets);
  const team = await getTeamMembers();
  const fromTeam = team
    .filter((m) => m.divisions.includes(division))
    .sort((a, b) => a.name.localeCompare(b.name))
    .map(
      (m): DivisionContact => ({
        name: m.name,
        role: m.role,
        email: m.email,
        phone: m.phone,
        photoUrl: m.photoUrl,
      }),
    );
  const inline = normalizeContacts(raw?.contacts);
  const mergedContacts = dedupeContacts([...fromTeam, ...inline]);

  return {
    title: route.title,
    topicQuery: route.topicQuery,
    summary: pick(raw?.summary, fb.summary),
    offeringsIntro: pick(raw?.offeringsIntro, fb.offeringsIntro),
    bullets: bulletsMerged,
    heroCaption: pick(raw?.heroCaption, fb.heroCaption),
    contactsIntro: pick(raw?.contactsIntro, fb.contactsIntro),
    contacts: mergedContacts.length ? mergedContacts : fb.contacts,
  };
}

export async function getHomeCopy() {
  const fb = {
    heroTagline:
      "Grain, feed and supply, marketing, agronomy, and energy — executed with disciplined coordination, transparent bids, dependable logistics, and field conversations aligned with your acres.",
    heroImageCaption: "Operations grounded in producer outcomes.",
    servicesCardAgronomy:
      "Crop nutrition, crop protection, seed recommendations, and agronomic discipline aligned with your acres.",
    servicesCardEnergy: "Fuel products and dependable delivery scheduling sized for agricultural operations.",
    servicesCardGrain: "Origination, logistics, and grain marketing grounded in execution — not hype.",
    servicesCardFeed: "Ingredient sourcing and coordination purpose-built for livestock producers.",
    servicesCardMarketing:
      "Cash marketing, basis, and logistics coordinated with merchandising — clear bids and dependable execution.",
  };
  const doc = await sanityFetch<{
    heroTagline?: string;
    heroImageCaption?: string;
    servicesCardAgronomy?: string;
    servicesCardEnergy?: string;
    servicesCardGrain?: string;
    servicesCardFeed?: string;
    servicesCardMarketing?: string;
  }>(
    `*[_type == "homePage"][0]{ heroTagline, heroImageCaption, servicesCardAgronomy, servicesCardEnergy, servicesCardGrain, servicesCardFeed, servicesCardMarketing }`,
  );
  return {
    heroTagline: pick(doc?.heroTagline, fb.heroTagline),
    heroImageCaption: pick(doc?.heroImageCaption, fb.heroImageCaption),
    servicesCardAgronomy: pick(doc?.servicesCardAgronomy, fb.servicesCardAgronomy),
    servicesCardEnergy: pick(doc?.servicesCardEnergy, fb.servicesCardEnergy),
    servicesCardGrain: pick(doc?.servicesCardGrain, fb.servicesCardGrain),
    servicesCardFeed: pick(doc?.servicesCardFeed, fb.servicesCardFeed),
    servicesCardMarketing: pick(doc?.servicesCardMarketing, fb.servicesCardMarketing),
  };
}

function loadContactJson(): { GENERAL_PHONE: string; HQ_ADDRESS_BLOCK: string } {
  try {
    const p = path.join(process.cwd(), "content/contact.json");
    const raw = fs.readFileSync(p, "utf8");
    const j = JSON.parse(raw) as { GENERAL_PHONE?: string; HQ_ADDRESS_BLOCK?: string };
    return {
      GENERAL_PHONE: j.GENERAL_PHONE ?? "",
      HQ_ADDRESS_BLOCK: j.HQ_ADDRESS_BLOCK ?? "",
    };
  } catch {
    return { GENERAL_PHONE: "", HQ_ADDRESS_BLOCK: "" };
  }
}

export async function getContactCopy() {
  const json = loadContactJson();
  const doc = await sanityFetch<{ generalPhone?: string; hqAddressBlock?: string }>(
    `*[_type == "contactPage"][0]{ generalPhone, hqAddressBlock }`,
  );
  return {
    generalPhone: pick(doc?.generalPhone, json.GENERAL_PHONE),
    hqAddressBlock: pick(doc?.hqAddressBlock, json.HQ_ADDRESS_BLOCK),
  };
}

export async function getVisionMission(): Promise<VisionMissionContent> {
  const doc = await sanityFetch<{ vision?: string; mission?: string; values?: { title?: string; text?: string }[] }>(
    `*[_type == "siteVisionMission"][0]{ vision, mission, values[]{ title, text } }`,
  );
  const values =
    doc?.values
      ?.filter((v) => pick(v?.title, v?.text))
      .map((v) => ({ title: pick(v?.title), text: pick(v?.text) })) ?? fallbackVisionMission.values;
  return {
    vision: pick(doc?.vision, fallbackVisionMission.vision),
    mission: pick(doc?.mission, fallbackVisionMission.mission),
    values: values.length ? values : fallbackVisionMission.values,
  };
}

const FB_ABOUT_HISTORY =
  "Post Rock Ag organizes grain, feed and supply, marketing, agronomy, and energy around disciplined execution — predictable bids, dependable freight, and field conversations grounded in economics rather than hype.";

const FB_ABOUT_HERO_CAPTION = "Grounded execution across agricultural services";

const FB_ABOUT_LEADERSHIP_INTRO =
  "Leadership bios publish from Sanity — replace these placeholders once titles and territories are finalized.";

export async function getAboutCopy() {
  const doc = await sanityFetch<{
    companyHistory?: string;
    aboutHeroCaption?: string;
    leadershipIntro?: string;
    leaders?: LeaderCard[];
  }>(
    `*[_type == "aboutPage"][0]{ companyHistory, aboutHeroCaption, leadershipIntro, leaders[]{ name, role, bio } }`,
  );
  return {
    companyHistory: pick(doc?.companyHistory, FB_ABOUT_HISTORY),
    aboutHeroCaption: pick(doc?.aboutHeroCaption, FB_ABOUT_HERO_CAPTION),
    leadershipIntro: pick(doc?.leadershipIntro, FB_ABOUT_LEADERSHIP_INTRO),
    leaders: doc?.leaders?.slice(0, 3) ?? [],
  };
}

export async function getServicesOverviewCopy() {
  const fb = {
    agronomy:
      "Crop nutrition, crop protection, seed placement, and disciplined scouting aligned with rotation economics.",
    energy: "Fuel products and dependable logistics scheduling sized for farms and rural fuel partners.",
    grain: "Origination, logistics, and merchandising grounded in transparent bids and freight coordination.",
    feed: "Ingredient sourcing and formulation support coordinated across livestock demand curves.",
    marketing:
      "Cash marketing, basis, and logistics coordinated with your operation — contracting and freight without the noise.",
  };
  const doc = await sanityFetch<Partial<typeof fb>>(
    `*[_type == "servicesOverviewCopy"][0]{ agronomy, energy, grain, feed, marketing }`,
  );
  return {
    agronomy: pick(doc?.agronomy, fb.agronomy),
    energy: pick(doc?.energy, fb.energy),
    grain: pick(doc?.grain, fb.grain),
    feed: pick(doc?.feed, fb.feed),
    marketing: pick(doc?.marketing, fb.marketing),
  };
}

const FB_CAREERS_WHY =
  "Post Rock Ag prizes disciplined execution across grain, feed and supply, marketing, agronomy, and energy — predictable bids, dependable freight, and field conversations grounded in economics rather than hype. Teammates earn autonomy through accountability.";

const FB_CAREERS_BENEFITS =
  "Benefits packages vary by role and location — publish finalized summaries here once HR confirms eligibility, enrollment windows, and carrier partners.";

export async function getCareersLandingCopy() {
  const doc = await sanityFetch<{ whyWorkHere?: string; benefits?: string }>(
    `*[_type == "careersLandingCopy"][0]{ whyWorkHere, benefits }`,
  );
  return {
    whyWorkHere: pick(doc?.whyWorkHere, FB_CAREERS_WHY),
    benefits: pick(doc?.benefits, FB_CAREERS_BENEFITS),
  };
}

const FB_MARKETS_EMBED =
  "<!-- Paste DTN / Barchart / Bushel vendor embed snippet from Sanity marketsPageCopy → -->";

const FB_FUEL_EMBED =
  "<!-- Paste fuel price widget snippet from Sanity marketsPageCopy → -->";

export async function getMarketsPageCopy() {
  const doc = await sanityFetch<{ dtnEmbedCode?: string; fuelPriceEmbedCode?: string }>(
    `*[_type == "marketsPageCopy"][0]{ dtnEmbedCode, fuelPriceEmbedCode }`,
  );
  return {
    dtnEmbedCode: pick(doc?.dtnEmbedCode, FB_MARKETS_EMBED),
    fuelPriceEmbedCode: pick(doc?.fuelPriceEmbedCode, FB_FUEL_EMBED),
  };
}

const FB_WEATHER_WIDGET =
  "Embed a vendor-approved regional snapshot via Sanity — publish widget HTML or placement notes here.";

const FB_SDS_LIBRARY =
  "Link SDS binders / regulatory PDFs hosted on SharePoint or your document vault.";

export async function getNewsSidebarCopy() {
  const doc = await sanityFetch<{ weatherWidget?: string; sdsLibraryLink?: string }>(
    `*[_type == "newsSidebarCopy"][0]{ weatherWidget, sdsLibraryLink }`,
  );
  return {
    weatherWidget: pick(doc?.weatherWidget, FB_WEATHER_WIDGET),
    sdsLibraryLink: pick(doc?.sdsLibraryLink, FB_SDS_LIBRARY),
  };
}

const LEGAL_FALLBACK_PRIVACY =
  "Pending counsel review — describe what personal data we collect via contact forms, investor inquiries, Mailchimp subscriptions, Resend transactional email, analytics (if enabled), and cookies.\n\nDocument retention aligned with operational realities when hosted on Vercel, Railway, or comparable platforms.";

const LEGAL_FALLBACK_TERMS =
  "Pending counsel review — finalize limitations of liability, acceptable use, intellectual property notices, links to integrated portals, dispute resolution, and governing law.";

const LEGAL_FALLBACK_A11Y =
  "Pending counsel review — describe conformance targets (WCAG 2.1 AA), testing methodology, feedback channels, and remediation timelines when third-party widgets are embedded (markets maps, grain integrations).";

export async function getLegalCopy() {
  const doc = await sanityFetch<{ privacyBody?: string; termsBody?: string; accessibilityBody?: string }>(
    `*[_type == "legalSiteCopy"][0]{ privacyBody, termsBody, accessibilityBody }`,
  );
  return {
    privacyBody: pick(doc?.privacyBody, LEGAL_FALLBACK_PRIVACY),
    termsBody: pick(doc?.termsBody, LEGAL_FALLBACK_TERMS),
    accessibilityBody: pick(doc?.accessibilityBody, LEGAL_FALLBACK_A11Y),
  };
}

/** Fallback body when Sanity `detailBody` is empty for `/locations/[slug]`. */
export const LOCATION_DETAIL_FALLBACK =
  "Operational notes publish from Sanity — receiving windows, truck routing, safety expectations, and scale integrations.";

function svc(val: unknown): LocationEntry["services"][number] | null {
  const s = typeof val === "string" ? val.trim() : "";
  if (s === "Feed") return "Feed and Supply";
  if (
    s === "Agronomy" ||
    s === "Energy" ||
    s === "Grain" ||
    s === "Feed and Supply" ||
    s === "Marketing"
  )
    return s;
  return null;
}

function mapSanityLocation(row: {
  slug?: string | { current?: string };
  name?: string;
  addressLine1?: string;
  city?: string;
  state?: string;
  zip?: string;
  phone?: string;
  hours?: string;
  services?: unknown[];
  lat?: number;
  lng?: number;
  detailBody?: string;
}): LocationEntry | null {
  const slug = typeof row.slug === "string" ? row.slug : row.slug?.current;
  if (!slug || !pick(row.name)) return null;
  const services = (row.services ?? []).map(svc).filter(Boolean) as LocationEntry["services"];
  return {
    slug,
    name: pick(row.name),
    addressLine1: pick(row.addressLine1),
    city: pick(row.city),
    state: pick(row.state, "KS"),
    zip: pick(row.zip),
    phone: pick(row.phone),
    hours: pick(row.hours),
    services: services.length ? services : ["Grain"],
    lat: typeof row.lat === "number" ? row.lat : 0,
    lng: typeof row.lng === "number" ? row.lng : 0,
    detailBody: pick(row.detailBody),
  };
}

export async function getLocations(): Promise<LocationEntry[]> {
  const rows = await sanityFetch<
    {
      slug?: string | { current?: string };
      name?: string;
      addressLine1?: string;
      city?: string;
      state?: string;
      zip?: string;
      phone?: string;
      hours?: string;
      services?: unknown[];
      lat?: number;
      lng?: number;
      detailBody?: string;
    }[]
  >(
    `*[_type == "location"] | order(name asc) {
      "slug": slug.current,
      name,
      addressLine1,
      city,
      state,
      zip,
      phone,
      hours,
      services,
      lat,
      lng,
      detailBody
    }`,
  );

  const mapped = rows?.map(mapSanityLocation).filter(Boolean) as LocationEntry[] | undefined;
  if (mapped?.length) return mapped;
  return fallbackLocations;
}

export async function getLocationBySlug(slug: string): Promise<LocationEntry | undefined> {
  const rows = await getLocations();
  return rows.find((l) => l.slug === slug);
}
