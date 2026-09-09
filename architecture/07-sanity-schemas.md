# Schemas

Document types: `page`, `post`, `postType`, `navigation`, `globalSettings`, `redirect`, `form`.

`page`, `post`, `postType`, `navigation` and `form` have a hidden `language` field for document internationalization.

`globalSettings` is a singleton (`documentId: globalSettings`). It holds brand, homepage, 404 page, cookie consent, default SEO and custom scripts.

Visibility on pages and posts is `public` or `hidden`.

Blocks live under `schemas/blocks/` and are registered in the page builder array, including `formBlock`.
