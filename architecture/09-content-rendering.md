# Content rendering

Portable Text is `lib/components/ui/PortableText.tsx`. Internal marks use `LocaleLink`.

Images go through `SanityImage` and `createImageUrlBuilder`. `fill` images pass a `sizes` hint (hero `100vw`, cards `33vw`, and so on).

`SanityLink` builds `/postType/slug` for posts and `/` for the CMS homepage (plus fallback slugs `forside` / `home`).
