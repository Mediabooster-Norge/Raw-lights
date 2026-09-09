# Studio

Studio is embedded at `/studio` (`app/studio/[[...index]]`).

`sanity.config.ts` uses a static `process.env.NEXT_PUBLIC_SANITY_PROJECT_ID` so the client bundle receives the project id.

Plugins: structure, Presentation, Vision, color input, media, document-internationalization.

Singleton `globalSettings` cannot be duplicated from the template list; delete/duplicate actions are filtered out.

Desk: settings, navigation (per language), pages, posts by post type, forms, redirects.
