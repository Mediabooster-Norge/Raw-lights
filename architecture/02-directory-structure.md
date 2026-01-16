# Directory Structure

```
project-root/
├── app/
│   ├── (sites)/
│   │   ├── [site]/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   ├── components/
│   │   │   └── theme.config.ts
│   ├── globals/
│   │   ├── layout.tsx
│   │   ├── not-found.tsx
│   │   └── loading.tsx
├── lib/
│   ├── sanity/
│   │   ├── client.ts
│   │   ├── fetcher.ts
│   │   ├── datasetRouter.ts
│   │   └── queries/
│   ├── theme/
│   │   ├── baseTheme.ts
│   │   ├── mergeTheme.ts
│   │   ├── useTheme.ts
│   ├── components/
│   │   ├── ui/
│   │   ├── blocks/
│   │   ├── layout/
│   │   └── forms/
│   └── utils/
├── schemas/
│   ├── shared/
│   ├── site/
│   ├── objects/
│   └── index.ts
├── middleware.ts
├── sanity.config.ts
├── tailwind.config.ts
├── next.config.js
└── package.json
```

---

## Folder Responsibilities

| Folder | Purpose |
|--------|---------|
| `app/(sites)/[site]/` | Site-specific layouts og pages |
| `lib/sanity/` | Sanity client, fetchers, queries |
| `lib/theme/` | Theme system, CSS variable injection |
| `lib/components/ui/` | Reusable UI components |
| `lib/components/blocks/` | Page builder blocks |
| `lib/components/layout/` | Header, Footer, Layout components |
| `lib/components/forms/` | Form components |
| `schemas/shared/` | Shared blocks + global objects |
| `schemas/site/` | Page + navigation per site |
| `schemas/objects/` | Reusable field-level structures |
