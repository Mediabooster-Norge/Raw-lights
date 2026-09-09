# Schemas

Document types: `page`, `post`, `postType`, `navigation`, `globalSettings`, `redirect`, `form`.

`page`, `post`, `postType`, `navigation` and `form` have a hidden `language` field for document internationalization.

`globalSettings` is a singleton (`documentId: globalSettings`). It holds brand, homepage, 404 page, privacy page, cookie consent, default SEO and custom scripts.

Visibility on pages and posts is `public` or `hidden`.

Page, post and post type slugs must be unique per language. Posts are unique within the same post type. Page and post type slugs cannot collide.

Image `alt` is a warning, not a hard error, so existing content can still be published.

Blocks live under `schemas/blocks/` and are registered in the page builder array, including `formBlock`.
