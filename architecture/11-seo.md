# SEO, hreflang and JSON-LD

Metadata comes from the `seo` object on pages, posts and post types, with site defaults from `globalSettings`.

Canonical URLs and `alternates.languages` (`nb`, `en`, `x-default`) are built in `metadataAlternates()` so page metadata does not drop `hreflang`.

## JSON-LD

Graphs are built in `lib/seo/buildJsonLd.ts`, not pasted per document.

- **Global**: `Organization` + `WebSite` from site name, logo and site URL
- **Posts**: `jsonLdType` on `postType` (`Person`, `NewsArticle`, `Organization`, `Article`, or `None`). Every single inherits it. Hidden `seo.jsonLd` remains as an override.
- **Archives**: `CollectionPage` + `ItemList`
- **Pages**: `jsonLdType` (`WebPage`, `AboutPage`, `ContactPage`, `FAQPage`) or a JSON override. Accordion blocks can produce `FAQPage` automatically. Breadcrumbs are always included.

Sitemap is `app/sitemap.ts` and lists both locales.
