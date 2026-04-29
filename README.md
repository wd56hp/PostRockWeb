# Post Rock — Site management

Production deploys live on **[Vercel](https://vercel.com)** from GitHub (`web/postrock-web` is the Next.js app). Optionally run the same image locally via **Docker Compose** (see [README-DOCKER.md](README-DOCKER.md)).

---

## Deploy on Vercel (GitHub)

1. Create a repository from this codebase and push the default branch.
2. **Vercel** → Add New Project → Import the repo.
3. **Root Directory** (pick one):
   - **Recommended:** set to **`web/postrock-web`**, leave the rest default (native Next.js detection and serverless/middleware from the right folder). In that case you do not need the repo-root `vercel.json` overrides.
   - **Or** leave Root Directory at **`.`** (repository root). The root **`package.json`** + **`package-lock.json`** install a minimal **`next`** at the repo root so Vercel’s detector finds it; **`vercel.json`** runs **`npm ci`** at root, then **`npm ci`** in **`web/postrock-web`**. If anything misbehaves (e.g. middleware), switch to the recommended Root Directory above and drop the root shim / **`vercel.json`** overrides if you prefer.
4. **Environment variables**: mirror `web/postrock-web/.env.example` in the project settings (Production + Preview). `NEXT_PUBLIC_*` values affect the bundle at **build time**—redeploy after changing them.
5. Secrets (`RESEND_API_KEY`, `MAILCHIMP_*`, `CONTACT_*`, etc.) are server-only; add those in Vercel, not in Git.

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
