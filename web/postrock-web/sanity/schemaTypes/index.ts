import { defineField, defineType, type PreviewValue } from "sanity";

const divisionOptionList = [
  { title: "Grain", value: "grain" },
  { title: "Feed and Supply", value: "feed" },
  { title: "Marketing", value: "marketing" },
  { title: "Agronomy", value: "agronomy" },
  { title: "Energy", value: "energy" },
] as const;

const divisionBlockFields = [
  defineField({ name: "summary", title: "Summary paragraph", type: "text", rows: 6 }),
  defineField({ name: "offeringsIntro", title: "What we offer — intro", type: "text", rows: 4 }),
  defineField({
    name: "bullets",
    title: "Bullets",
    type: "array",
    of: [{ type: "string" }],
  }),
  defineField({ name: "heroCaption", title: "Hero image caption overlay", type: "string" }),
  defineField({ name: "contactsIntro", title: "Key contacts intro", type: "text", rows: 3 }),
  defineField({
    name: "contacts",
    title: "Extra contacts (optional, no photo)",
    description:
      "Ad-hoc contacts for this division. For employees with a headshot, create a Team member instead and assign service divisions there — they appear here automatically.",
    type: "array",
    of: [
      {
        type: "object",
        fields: [
          defineField({ name: "name", type: "string", title: "Name" }),
          defineField({ name: "role", type: "string", title: "Role" }),
          defineField({ name: "email", type: "string", title: "Email" }),
          defineField({ name: "phone", type: "string", title: "Phone" }),
        ],
      },
    ],
  }),
];

export const homePage = defineType({
  name: "homePage",
  title: "Home page",
  type: "document",
  fields: [
    defineField({ name: "heroTagline", title: "Hero tagline", type: "text", rows: 3 }),
    defineField({ name: "heroImageCaption", title: "Hero image caption", type: "string" }),
    defineField({ name: "servicesCardAgronomy", title: "Services card — Agronomy", type: "text", rows: 3 }),
    defineField({ name: "servicesCardEnergy", title: "Services card — Energy", type: "text", rows: 3 }),
    defineField({ name: "servicesCardGrain", title: "Services card — Grain", type: "text", rows: 3 }),
    defineField({ name: "servicesCardFeed", title: "Services card — Feed and Supply", type: "text", rows: 3 }),
    defineField({ name: "servicesCardMarketing", title: "Services card — Marketing", type: "text", rows: 3 }),
  ],
});

export const contactPage = defineType({
  name: "contactPage",
  title: "Contact page",
  type: "document",
  fields: [
    defineField({ name: "generalPhone", title: "General phone", type: "string" }),
    defineField({ name: "hqAddressBlock", title: "HQ address block", type: "text", rows: 6 }),
  ],
});

export const aboutPage = defineType({
  name: "aboutPage",
  title: "About page",
  type: "document",
  fields: [
    defineField({ name: "companyHistory", title: "Company history", type: "text", rows: 8 }),
    defineField({ name: "aboutHeroCaption", title: "About hero banner caption", type: "string" }),
    defineField({ name: "leadershipIntro", title: "Leadership intro", type: "text", rows: 4 }),
    defineField({
      name: "leaders",
      title: "Leaders (up to 3)",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "name", type: "string", title: "Name" }),
            defineField({ name: "role", type: "string", title: "Role" }),
            defineField({ name: "bio", type: "text", title: "Bio", rows: 4 }),
          ],
        },
      ],
    }),
  ],
});

export const siteVisionMission = defineType({
  name: "siteVisionMission",
  title: "Vision, mission & values",
  type: "document",
  fields: [
    defineField({ name: "vision", title: "Vision", type: "text", rows: 3 }),
    defineField({ name: "mission", title: "Mission", type: "text", rows: 4 }),
    defineField({
      name: "values",
      title: "Values (STEAM)",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "title", type: "string", title: "Title" }),
            defineField({ name: "text", type: "text", title: "Text", rows: 3 }),
          ],
        },
      ],
    }),
  ],
});

export const service = defineType({
  name: "service",
  title: "Service division",
  type: "document",
  fields: [
    defineField({
      name: "divisionKey",
      title: "Which service",
      type: "string",
      description: "Create one document per service (five total: Grain, Feed and Supply, Marketing, Agronomy, Energy).",
      options: {
        list: divisionOptionList.map(({ title, value }) => ({ title, value })),
        layout: "radio",
      },
      validation: (Rule) => Rule.required(),
    }),
    ...divisionBlockFields,
  ],
  preview: {
    select: { divisionKey: "divisionKey" },
    prepare(selection: Record<string, unknown>): PreviewValue {
      const dk = selection.divisionKey;
      const label =
        typeof dk === "string"
          ? (divisionOptionList.find((x) => x.value === dk)?.title ?? dk)
          : "Service division";
      return { title: label } as PreviewValue;
    },
  },
});

export const divisionCopy = defineType({
  name: "divisionCopy",
  title: "Division copy (legacy fallback)",
  description:
    "Single document with nested division fields. Prefer Service division documents (one per service). Content here is used only when no matching Service document exists.",
  type: "document",
  fields: [
    defineField({ name: "agronomy", title: "Agronomy", type: "object", fields: divisionBlockFields }),
    defineField({ name: "energy", title: "Energy", type: "object", fields: divisionBlockFields }),
    defineField({ name: "grain", title: "Grain", type: "object", fields: divisionBlockFields }),
    defineField({ name: "feed", title: "Feed and Supply", type: "object", fields: divisionBlockFields }),
    defineField({ name: "marketing", title: "Marketing", type: "object", fields: divisionBlockFields }),
  ],
});

export const servicesOverviewCopy = defineType({
  name: "servicesOverviewCopy",
  title: "Services overview cards",
  type: "document",
  fields: [
    defineField({ name: "agronomy", title: "Agronomy card blurb", type: "text", rows: 3 }),
    defineField({ name: "energy", title: "Energy card blurb", type: "text", rows: 3 }),
    defineField({ name: "grain", title: "Grain card blurb", type: "text", rows: 3 }),
    defineField({ name: "feed", title: "Feed and Supply card blurb", type: "text", rows: 3 }),
    defineField({ name: "marketing", title: "Marketing card blurb", type: "text", rows: 3 }),
  ],
});

export const careersLandingCopy = defineType({
  name: "careersLandingCopy",
  title: "Careers landing",
  type: "document",
  fields: [
    defineField({ name: "whyWorkHere", title: "Why work here", type: "text", rows: 6 }),
    defineField({ name: "benefits", title: "Benefits overview", type: "text", rows: 6 }),
  ],
});

export const marketsPageCopy = defineType({
  name: "marketsPageCopy",
  title: "Markets page embeds",
  type: "document",
  fields: [
    defineField({ name: "dtnEmbedCode", title: "DTN / Barchart embed HTML or snippet", type: "text", rows: 10 }),
    defineField({ name: "fuelPriceEmbedCode", title: "Fuel price widget embed HTML or snippet", type: "text", rows: 10 }),
  ],
});

export const newsSidebarCopy = defineType({
  name: "newsSidebarCopy",
  title: "News sidebar widgets",
  type: "document",
  fields: [
    defineField({ name: "weatherWidget", title: "Weather widget notes / embed", type: "text", rows: 6 }),
    defineField({ name: "sdsLibraryLink", title: "SDS library link label or URL text", type: "string" }),
  ],
});

export const legalSiteCopy = defineType({
  name: "legalSiteCopy",
  title: "Legal pages copy",
  type: "document",
  fields: [
    defineField({ name: "privacyBody", title: "Privacy policy body", type: "text", rows: 16 }),
    defineField({ name: "termsBody", title: "Terms body", type: "text", rows: 16 }),
    defineField({ name: "accessibilityBody", title: "Accessibility statement body", type: "text", rows: 16 }),
  ],
});

export const teamMember = defineType({
  name: "teamMember",
  title: "Team member",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Name", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "role", title: "Role / title", type: "string" }),
    defineField({ name: "email", title: "Email", type: "string" }),
    defineField({ name: "phone", title: "Phone", type: "string" }),
    defineField({ name: "bio", title: "Bio (About page)", type: "text", rows: 4 }),
    defineField({
      name: "photo",
      title: "Photo",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "divisions",
      title: "Service divisions",
      description: "This person appears under Key contacts on each selected service page.",
      type: "array",
      of: [{ type: "string" }],
      options: {
        list: divisionOptionList.map(({ title, value }) => ({ title, value })),
        layout: "grid",
      },
    }),
    defineField({
      name: "featuredOnHome",
      title: "Featured on home page",
      description: "When enabled, may appear in the home “Team” strip (up to six featured members).",
      type: "boolean",
      initialValue: false,
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "role", media: "photo" },
    prepare(selection: Record<string, unknown>): PreviewValue {
      const title = selection.title;
      const subtitle = selection.subtitle;
      const media = selection.media;
      return {
        title: typeof title === "string" && title ? title : "Unnamed",
        subtitle: typeof subtitle === "string" ? subtitle : "",
        media,
      } as PreviewValue;
    },
  },
});

export const location = defineType({
  name: "location",
  title: "Location",
  type: "document",
  fields: [
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: "name", title: "Display name", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "addressLine1", title: "Address line 1", type: "string" }),
    defineField({ name: "city", title: "City", type: "string" }),
    defineField({ name: "state", title: "State", type: "string" }),
    defineField({ name: "zip", title: "ZIP", type: "string" }),
    defineField({ name: "phone", title: "Phone", type: "string" }),
    defineField({ name: "hours", title: "Hours", type: "string" }),
    defineField({
      name: "services",
      title: "Services at location",
      type: "array",
      of: [{ type: "string" }],
      options: {
        list: [
          { title: "Grain", value: "Grain" },
          { title: "Feed and Supply", value: "Feed and Supply" },
          { title: "Marketing", value: "Marketing" },
          { title: "Agronomy", value: "Agronomy" },
          { title: "Energy", value: "Energy" },
        ],
        layout: "grid",
      },
    }),
    defineField({ name: "lat", title: "Latitude", type: "number" }),
    defineField({ name: "lng", title: "Longitude", type: "number" }),
    defineField({ name: "detailBody", title: "Location detail body", type: "text", rows: 8 }),
  ],
});

export const schemaTypes = [
  homePage,
  contactPage,
  aboutPage,
  siteVisionMission,
  teamMember,
  service,
  divisionCopy,
  servicesOverviewCopy,
  careersLandingCopy,
  marketsPageCopy,
  newsSidebarCopy,
  legalSiteCopy,
  location,
];
