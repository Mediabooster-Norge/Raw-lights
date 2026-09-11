# SEO, hreflang and JSON-LD

Metadata comes from the `seo` object on pages, posts and post types, with site defaults from `globalSettings`.

Canonical URLs and `alternates.languages` (`nb`, `en`, `x-default`) are built in `metadataAlternates()` so page metadata does not drop `hreflang`. Pages also set Twitter cards and `og:locale`.

## JSON-LD

Graphs are built in `lib/seo/buildJsonLd.ts`, not pasted per document.

- **Global**: `Organization` + `WebSite` from site name, logo, site URL, footer social `sameAs`, and optional verified contact data in Global settings.
- **Posts**: Every post gets `WebPage` + breadcrumbs. `jsonLdType` on `postType` optionally adds the supported article subtype (`Article`, `NewsArticle` or `BlogPosting`). An innlegg can override the type. The expert-only document-level JSON override remains a last resort.
- **Archives**: `CollectionPage` + `ItemList`
- **Pages**: `jsonLdType` defaults to automatic. Studio suggests `WebPage`, `AboutPage`, `ContactPage` or `CollectionPage` from URL and visible blocks. FAQ modules add `FAQPage` only when complete questions and answers exist; product catalog modules add a live `ItemList`. Breadcrumbs are always included.
- **Products**: Every product gets `WebPage`, `Product`, and breadcrumbs. An `Offer` is only emitted from the structured price, currency and availability fields; display-price text is never parsed or used as inventory data.

Sitemap is `app/sitemap.ts` and lists both locales.
