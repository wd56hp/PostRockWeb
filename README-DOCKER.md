# Docker — Next.js marketing site only

Compose runs **`postrock-web`** (Next.js) only. Ghost, MySQL, and nginx were removed from this compose file now that production is intended for **[Vercel](../README.md#deploy-on-vercel-github)**.

## Quick start

1. From the repo root (next to **`docker-compose.yml`**):

   ```bash
   cp .env.example .env
   # Fill in NEXT_PUBLIC_* and server secrets like RESEND_API_KEY
   ```

2. Build and start:

   ```bash
   docker compose up -d --build
   ```

3. Open **http://localhost:3000**

`NEXT_PUBLIC_*` is baked into the image at **`docker compose build`** time. Change it in `.env`, then **`docker compose up -d --build`** again.

Secrets used only at runtime (Resend, Mailchimp server keys) can pick up **`docker compose up -d postrock-web`** without a rebuild.

## Optional: `public/` volume

`./web/postrock-web/public` is mounted read-only into the container so asset edits on disk are visible without a rebuild (depending on caching).

## Legacy stack

If you still run Ghost (news.blog) separately, host it elsewhere (managed Ghost, another VM, etc.) — it is **not** part of this Compose file anymore.
