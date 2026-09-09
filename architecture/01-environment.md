# Environment

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your-token
SANITY_PREVIEW_SECRET=your-preview-secret
SANITY_WEBHOOK_SECRET=your-webhook-secret
NEXT_PUBLIC_SITE_URL=https://your-site.com
RESEND_API_KEY=your-resend-api-key
FORM_FROM_EMAIL=Studio <studio@example.com>
FORM_TO_EMAIL=you@example.com
```

`lib/env.ts` parses these as optional strings so Studio and `next build` can start without every secret. Routes that need a secret (draft, webhook, forms) check at runtime.

`NEXT_PUBLIC_SITE_URL` is the public origin. If it is missing, `getSiteUrl()` falls back to the Vercel deployment URL, then `http://localhost:3000`.

There is no `REVALIDATE_SECRET`. Revalidate uses `SANITY_WEBHOOK_SECRET` on `POST /api/revalidate`.

There is no `NEXT_PUBLIC_MULTISITE_ENABLED`.
