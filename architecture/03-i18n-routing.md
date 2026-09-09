# Locales and routing

Default locale is `nb` (no prefix). English uses `/en`.

| Public URL | Internal route |
|------------|----------------|
| `/` | `/nb` |
| `/om-oss` | `/nb/om-oss` |
| `/en` | `/en` |
| `/en/about` | `/en/about` |

`proxy.ts` sets `x-locale` and `x-pathname`, rewrites default-locale requests, and redirects `/nb/...` to the unprefixed path.

Do not use `en` as a Norwegian page slug. It is reserved as the English locale segment.

## Documents

Translated types: `page`, `post`, `postType`, `navigation`, `form`. Each has a hidden `language` field. Translations are linked by `translation.metadata`.

Existing documents without `language` are treated as `nb`.

Logo and colors stay on the shared `globalSettings` singleton. Navigation and SEO are per language.

## Language switcher

The header reads translation metadata for the current path. If a translation is missing, it links to that locale’s homepage.

`html lang` follows the locale (`nb` / `en`). `hreflang` is emitted from layout metadata.
