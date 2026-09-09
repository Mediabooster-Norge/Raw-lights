# Directory structure

```
project-root/
├── app/
│   ├── [locale]/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── not-found.tsx
│   │   ├── [slug]/page.tsx
│   │   └── [slug]/[postSlug]/page.tsx
│   ├── api/
│   ├── studio/
│   ├── layout.tsx
│   ├── sitemap.ts
│   └── robots.ts
├── lib/
│   ├── i18n/
│   ├── sanity/
│   ├── seo/
│   ├── theme/
│   ├── components/
│   └── utils/
├── schemas/
├── proxy.ts
├── sanity.config.ts
└── next.config.ts
```

`proxy.ts` rewrites unprefixed paths to `/nb/...` and applies CMS redirects. `/studio` and `/api` are skipped.
