# Theme

`globalSettings.siteTheme` has logo, favicon, three colors (primary, background, text) and heading/body fonts.

`mergeTheme` derives secondary, surface, contrast text and CTA colors.

Fonts exposed in Studio are downloaded as local WOFF2 assets in `public/fonts/`.
Run `node scripts/download-google-fonts.mjs` after changing `lib/theme/fontOptions.ts`.

CSS variables are set on the locale layout wrapper.
