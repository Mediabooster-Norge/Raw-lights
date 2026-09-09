# Sanity starter

A reusable Next.js + Sanity starter for one website. Clone it per customer, point it at a `production` dataset, and start editing pages, posts, navigation, SEO and theme in Studio.

## Tech stack

- **Framework**: Next.js 16 (App Router)
- **CMS**: Sanity v6 with `next-sanity`
- **UI**: React 19, Tailwind CSS
- **Languages**: Norwegian (`nb`, no prefix) and English (`/en`)

## Getting started

### Prerequisites

- Node.js 22.12+
- npm
- A Sanity project with a dataset named `production`

### Installation

```bash
npm install

cp .env.example .env.local
# Edit .env.local with your values

npm run dev
```

Studio is at `/studio`. The public site uses one URL (`NEXT_PUBLIC_SITE_URL`) and one dataset.

Open **Oppstart** in Studio for a first-run checklist (homepage, 404, privacy page, navigation per language, JSON-LD types).

### Environment variables

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your-token
SANITY_PREVIEW_SECRET=your-secret
SANITY_WEBHOOK_SECRET=your-webhook-secret
NEXT_PUBLIC_SITE_URL=http://localhost:3000
RESEND_API_KEY=your-resend-api-key
FORM_FROM_EMAIL=Studio <studio@example.com>
FORM_TO_EMAIL=you@example.com
```

`NEXT_PUBLIC_*` must be **Config**, not Sensitive, in Vercel. Next.js inlines them at build time.

### Languages

- `nb` is the default locale and has no URL prefix (`/om-oss`)
- `en` is prefixed (`/en/about`)
- Documents are translated with `@sanity/document-internationalization`
- The header language switcher jumps to the translated document, or the locale homepage if none exists

### Vercel

Add the same keys in Production, Preview and Development:

- `NEXT_PUBLIC_SANITY_PROJECT_ID` (required, not Sensitive)
- `NEXT_PUBLIC_SANITY_DATASET` (`production`, not Sensitive)
- `NEXT_PUBLIC_SITE_URL` (full `https://…` production URL, not Sensitive)
- `SANITY_API_TOKEN`, `SANITY_PREVIEW_SECRET`, `SANITY_WEBHOOK_SECRET` (can be Sensitive)
- `RESEND_API_KEY`, `FORM_FROM_EMAIL`, `FORM_TO_EMAIL` for form delivery

Without `NEXT_PUBLIC_SANITY_PROJECT_ID` the site builds empty.

### Sanity webhook

Create a webhook on the dataset with header `x-webhook-secret` matching `SANITY_WEBHOOK_SECRET`, URL `https://<domain>/api/revalidate`, and this projection so English routes are purged too:

```groq
{
  _id,
  _type,
  slug,
  language,
  "postTypeSlug": postType->slug.current
}
```

The route revalidates `/` and `/en` layouts, plus slug paths in both locales.

## Project structure

```
├── app/
│   ├── [locale]/            # Public site (nb rewritten from /, /en prefixed)
│   ├── api/                 # Draft, preview, revalidate, forms
│   ├── sitemap.ts
│   └── studio/             # Sanity Studio
├── lib/
│   ├── components/         # Blocks, layout, forms, posts
│   ├── i18n/                # Locales, paths, UI strings
│   ├── sanity/             # Client, queries, fetcher
│   ├── seo/                # JSON-LD builders
│   └── theme/
├── proxy.ts                 # Locale rewrite + CMS redirects
└── schemas/
```

## Features

- Page builder (hero, text, CTA, gallery, marquee, accordion, form, …)
- Posts with archive and single views
- Global settings: logo, three colors, fonts, homepage, 404 and privacy page
- JSON-LD generated in code (Organization/WebSite, post type inheritance, FAQ from accordion)
- Draft mode via `/api/draft` and Presentation
- CMS redirects in `proxy.ts`
- Forms sent with Resend
- Optional cookie banner that gates `customCode` scripts, with a link to the CMS privacy page
- Archive pagination (12 posts per page)
- GitHub Actions CI: typecheck, tests and build

See `architecture/` for the internal model.
