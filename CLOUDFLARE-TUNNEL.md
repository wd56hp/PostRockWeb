# Cloudflare Tunnel Setup for Post Rock

When the primary marketing site is on **Vercel**, you usually point DNS for `postrock.com` at Vercel instead of routing through tunnel to this machine. Tunnel notes below remain useful when you terminate traffic on **Unraid/self-hosted** backends (Docker, Ghost on another hostname, APIs, etc.).

Use Cloudflare Tunnel (cloudflared) to expose hosts over HTTPS without opening ports 80/443 on your firewall.

## Prerequisites

- Cloudflare account with `postrock.com` (or your domain) added
- Cloudflared installed or running in a container
- Post Rock stack running (nginx on host port 8088)

## Option A: Add to Existing Cloudflared Container (config file)

If you already run Cloudflared (e.g. Unraid Docker), add these ingress rules to your tunnel config.

1. **Locate your config** – typically `/path/to/cloudflared/config.yml` or the config volume used by your Cloudflared container.

2. **Add or merge ingress entries** for Post Rock:

   ```yaml
   ingress:
     # Post Rock main site
     - hostname: postrock.com
       service: http://host.docker.internal:8088
     - hostname: www.postrock.com
       service: http://host.docker.internal:8088

     # Post Rock Ghost news
     - hostname: news.postrock.com
       service: http://host.docker.internal:8088

     # Catch-all (required - must be last)
     - service: http_status:404
   ```

3. **If Cloudflared runs on the host** (not in Docker), use `http://127.0.0.1:8088` instead of `host.docker.internal`.

4. **Restart Cloudflared** so it picks up the new config.

## Option B: Unraid Cloudflared Plugin / Docker

If using Unraid’s Cloudflare Tunnel plugin or a cloudflared container:

1. Open the Cloudflared container settings.
2. Add a **Public Hostname** for each domain:
   - **postrock.com** → `http://<unraid-ip>:8088`
   - **www.postrock.com** → `http://<unraid-ip>:8088`
   - **news.postrock.com** → `http://<unraid-ip>:8088`

   Replace `<unraid-ip>` with your Unraid server IP (e.g. `192.168.1.100`).

3. Save and restart the container.

## Option C: Standalone cloudflared (config file)

1. **Create or edit** `~/.cloudflared/config.yml`:

   ```yaml
   tunnel: <YOUR_TUNNEL_ID>
   credentials-file: /path/to/credentials.json

   ingress:
     - hostname: postrock.com
       service: http://127.0.0.1:8088
     - hostname: www.postrock.com
       service: http://127.0.0.1:8088
     - hostname: news.postrock.com
       service: http://127.0.0.1:8088
     - service: http_status:404
   ```

2. **Run the tunnel**:

   ```bash
   cloudflared tunnel run
   ```

## DNS in Cloudflare

1. In **Cloudflare Dashboard** → **Zero Trust** (or **Tunnels**) → **Tunnels** → your tunnel.
2. Go to **Public Hostnames** and add:
   - `postrock.com` → Type: HTTP, URL: `localhost:8088` (or your internal URL)
   - `www.postrock.com` → same
   - `news.postrock.com` → same

   Cloudflare will create the CNAME records for you when you add hostnames through the tunnel UI.

3. If you manage DNS manually, add CNAME records:
   - `postrock.com` → `<tunnel-id>.cfargotunnel.com`
   - `www.postrock.com` → `<tunnel-id>.cfargotunnel.com`
   - `news.postrock.com` → `<tunnel-id>.cfargotunnel.com`

## Ghost URL

Ensure `.env` has:

```
GHOST_URL=https://news.postrock.com
```

Ghost must see the correct public URL. With Cloudflare in front, users will use `https://news.postrock.com`; Ghost will receive the correct `Host` header from the tunnel.

## Verify

- `https://postrock.com` → main site
- `https://news.postrock.com` → Ghost blog
- `https://news.postrock.com/ghost` → Ghost admin

## Troubleshooting

| Issue | Check |
|------|--------|
| 502 Bad Gateway | nginx or Post Rock stack not running; verify `docker ps` and port 8088 |
| Wrong site on subdomain | nginx routes by `Host`; Cloudflare must send the correct hostname |
| Ghost redirect loop | `GHOST_URL` must be `https://news.postrock.com` (no trailing slash) |
| `host.docker.internal` not found | Use your Unraid/host IP instead, or run cloudflared with `--add-host=host.docker.internal:host-gateway` |
