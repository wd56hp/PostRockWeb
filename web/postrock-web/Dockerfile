# Build stage
FROM node:22-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

COPY . .

# NEXT_PUBLIC_* must exist during `next build` so they are inlined into the client bundle and sitemap.
ARG NEXT_PUBLIC_SITE_URL=https://postrockag.com
ARG NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL=
ARG NEXT_PUBLIC_CONTACT_TO_EMAIL=
ARG NEXT_PUBLIC_SANITY_PROJECT_ID=
ARG NEXT_PUBLIC_SANITY_DATASET=production

ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL=$NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL
ENV NEXT_PUBLIC_CONTACT_TO_EMAIL=$NEXT_PUBLIC_CONTACT_TO_EMAIL
ENV NEXT_PUBLIC_SANITY_PROJECT_ID=$NEXT_PUBLIC_SANITY_PROJECT_ID
ENV NEXT_PUBLIC_SANITY_DATASET=$NEXT_PUBLIC_SANITY_DATASET

RUN npm run build

# Production stage
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy standalone output
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
