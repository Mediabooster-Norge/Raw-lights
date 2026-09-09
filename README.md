# Sanity starter

A reusable Next.js + Sanity starter for a single website. Clone it per customer, point it at a `production` dataset, and start editing pages, posts, navigation, SEO and theme in Studio.

## Tech stack

- **Framework**: Next.js 14 (App Router)
- **CMS**: Sanity v3
- **Styling**: Tailwind CSS
- **Language**: TypeScript

## Getting started

### Prerequisites

- Node.js 18+
- npm
- A Sanity project with a dataset named `production`

### Installation

```bash
npm install

cp .env.example .env.local
# Edit .env.local with your values

npm run dev
```

Studio is available at `/studio`. The site uses one URL (`NEXT_PUBLIC_SITE_URL`) and one dataset.

### Environment variables

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your-token
SANITY_PREVIEW_SECRET=your-secret
SANITY_WEBHOOK_SECRET=your-webhook-secret
NEXT_PUBLIC_SITE_URL=http://localhost:3000
REVALIDATE_SECRET=your-revalidate-secret
```

The app only uses the dataset *name*. Create or migrate a dataset called `production` in [Sanity Manage](https://www.sanity.io/manage). Existing content in another dataset (for example `landstreff`) must be copied there separately.

## Project structure

```
├── app/
│   ├── (web)/               # Public site (forside, sider, innlegg)
│   ├── api/                 # Preview, draft, revalidate
│   ├── sitemap.ts
│   └── studio/             # Sanity Studio
├── lib/
│   ├── components/         # React components
│   ├── sanity/             # Client, queries, fetcher
│   ├── theme/               # Theme merge from 3 Studio colors
│   ├── types/
│   └── utils/
└── schemas/                 # Sanity schemas
```

## Features

- Page builder (hero, text, CTA, gallery, marquee, and more)
- Posts with archive and single views
- Global settings: logo, three colors, fonts, default SEO
- Optional JSON-LD per page, post, archive and globally
- Preview / Presentation and Vision
- ISR with on-demand revalidation

## Homepage

Create a page with slug `forside` — that is the homepage at `/`.

## Commands

```bash
npm run dev       # Start development server
npm run build     # Build for production
npm run start     # Start production server
npm run lint      # Run ESLint
npm run typegen   # Generate Sanity types
```

## Deployment

Deploy to Vercel, set the environment variables above, and point `NEXT_PUBLIC_SITE_URL` at the production domain.
