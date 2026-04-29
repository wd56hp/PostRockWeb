# Post Rock Ag — public marketing site

Production-oriented [Next.js](https://nextjs.org/) App Router project for **postrockag.com**: Tailwind CSS, Radix primitives with CVA-style UI wrappers, MDX-backed news and careers, React Hook Form + Zod on forms, **Resend** for email APIs, **Mailchimp** for subscriptions/tags via Route Handlers, rate limiting helpers, **next-sitemap** on `postbuild`, and **lucide-react** icons.

## Prerequisites

- Node.js 20+ (aligned with `engines` expectations from Next.js tooling)

## Setup

```bash
cd web/postrock-web
cp .env.example .env.local
```

Fill in secrets as needed for local testing. Routes degrade gracefully when Resend or Mailchimp keys are missing (Mailchimp handlers log and return `{ ok: true, mode: "noop" }`; contact/investor routes should fail clearly when Resend is required — verify behavior before sharing staging URLs broadly).

## Environment variables

See `.env.example` for the full list. Highlights:

| Variable | Role |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical URL for metadata, Organization JSON-LD, Locations structured data, and **next-sitemap** `siteUrl`. Set this in CI/container builds so `/sitemap.xml` matches production. |
| `RESEND_API_KEY` / `CONTACT_FROM_EMAIL` | Transactional mail via `/api/contact` and `/api/investor-inquiry`. |
| `CONTACT_TO_EMAIL`, `INVESTOR_TO_EMAIL`, optional `NEXT_PUBLIC_CONTACT_TO_EMAIL` | Recipient routing for contact forms. |
| `MAILCHIMP_*` | Marketing API — newsletter signup (`general-newsletter` tag) and producer portal notify (`producer-portal-launch` tag). |

## Content

- News: `content/news/*.mdx` — frontmatter must match `NewsFrontmatter` in `lib/content/news.ts`.
- Careers: `content/careers/*.mdx` — frontmatter must match `CareerFrontmatter` in `lib/content/careers.ts`.
- Sitewide alert banner JSON: `content/alert.json` (wired through `lib/alert.ts`).

## Scripts

```bash
npm run dev       # local development
npm run build     # production build (runs next-sitemap via postbuild)
npm run start     # serve production build
npm run lint      # ESLint (Next flat config)
```

`postbuild` runs **next-sitemap** using `NEXT_PUBLIC_SITE_URL` from the environment at build time — mirror production URLs in Docker/CI so `/sitemap.xml` and `/robots.txt` stay accurate.

## Deploy notes (Vercel / Railway / Docker)

- Set **`NEXT_PUBLIC_SITE_URL`** to the live hostname **before** `npm run build` so generated `public/sitemap.xml` lists correct URLs.
- Ensure API secrets (`RESEND_API_KEY`, Mailchimp keys) exist only on the server runtime — never prefix secret keys with `NEXT_PUBLIC_`.
- When containerizing, copy built `.next` **and** regenerated `public/sitemap.xml` / `public/robots.txt`, or run `npm run build` inside the image with env injected.

## Proxy (legacy hostname rewrites)

`proxy.ts` rewrites alternate hostnames onto `/smoky-hills-agronomy` for domains that previously pointed at agronomy-specific experiences — adjust carefully when DNS cutovers finish.
