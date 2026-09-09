# Deployment

Vercel, Next.js 16, Node 22.

`NEXT_PUBLIC_*` variables must be Config, not Sensitive.

Studio is `/studio`. Public origin is `NEXT_PUBLIC_SITE_URL`.

`proxy.ts` runs on the Node.js proxy runtime (not Edge middleware).
