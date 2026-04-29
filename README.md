# Post Rock — Site management

Production deploys live on **[Vercel](https://vercel.com)** from GitHub (`web/postrock-web` is the Next.js app). Optionally run the same image locally via **Docker Compose** (see [README-DOCKER.md](README-DOCKER.md)).

---

## Deploy on Vercel (GitHub)

The Next.js app **must** be deployed with **Root Directory** set to **`web/postrock-web`**. Putting the project root at the repository root breaks file tracing (`node_modules` paths) and `.next` output handling.

1. Create a repository from this codebase and push the default branch.
2. **Vercel** → Add New Project → Import the repo.
3. Before the first deployment (or anytime after): **Project → Settings → General → Root Directory** → **`web/postrock-web`**. Defaults are enough (**Framework preset: Next.js**, **`npm ci`**, **`npm run build`** — no overrides).
4. If you already deployed with Root Directory **`./`**, delete any custom **Install** / **Build** / **Output** overrides under **Settings → Build & Deployment → Build & Development**, set Root Directory as above, and redeploy.
5. **Environment variables**: mirror `web/postrock-web/.env.example` in the project (Production + Preview). `NEXT_PUBLIC_*` affects the bundle at **build time** — redeploy after changing them.
6. Secrets (`RESEND_API_KEY`, `MAILCHIMP_*`, `CONTACT_*`, etc.) stay server-side only — add them in Vercel.

Locally, copy **`web/postrock-web/.env.example`** to **`web/postrock-web/.env`** for development.

---

## Optional: Docker Compose (Next.js only)

For a production-like Next.js container without Vercel (e.g. LAN testing):

```bash
cp .env.example .env
# Edit .env, then:

docker compose up -d --build
```

Listen on **http://localhost:3000** (see [README-DOCKER.md](README-DOCKER.md)).

---

## Rebuild reminders

| Change | Action |
|--------|--------|
| Code under `web/postrock-web/` | Push → Vercel build, or `docker compose up -d --build` |
| Any **`NEXT_PUBLIC_*`** variable | Must redeploy / rebuild — values are inlined at build time |

---

## Content and integrations

| Area | Notes |
|------|------|
| Static/read-only Next.js assets | `web/postrock-web/public/` |
| Sanity (optional CMS) | Set **`NEXT_PUBLIC_SANITY_*`** — required for **`/studio`** and live content |
| Mail | Resend for contact/transactionsal; **`CONTACT_*` / `INVESTOR_*`** in env |
| Newsletter | **`MAILCHIMP_*`** |

---

## Self-hosted reverse proxy / tunnel

If you still terminate traffic on Unraid or another host (not Vercel), see **[CLOUDFLARE-TUNNEL.md](CLOUDFLARE-TUNNEL.md)** for tunnel notes. Align **`NEXT_PUBLIC_SITE_URL`** with the public `https://` URL visitors use.
