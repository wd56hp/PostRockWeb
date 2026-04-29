import { defineField, defineType } from "sanity";

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
    title: "Contacts (up to 3)",
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
    defineField({ name: "servicesCardFeed", title: "Services card — Feed", type: "text", rows: 3 }),
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

export const divisionCopy = defineType({
  name: "divisionCopy",
  title: "Service divisions copy",
  type: "document",
  fields: [
    defineField({ name: "agronomy", title: "Agronomy", type: "object", fields: divisionBlockFields }),
    defineField({ name: "energy", title: "Energy", type: "object", fields: divisionBlockFields }),
    defineField({ name: "grain", title: "Grain", type: "object", fields: divisionBlockFields }),
    defineField({ name: "feed", title: "Feed", type: "object", fields: divisionBlockFields }),
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
    defineField({ name: "feed", title: "Feed card blurb", type: "text", rows: 3 }),
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
  divisionCopy,
  servicesOverviewCopy,
  careersLandingCopy,
  marketsPageCopy,
  newsSidebarCopy,
  legalSiteCopy,
  location,
];
