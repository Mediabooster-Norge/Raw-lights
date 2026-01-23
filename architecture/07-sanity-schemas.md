# Sanity Schema Definitions

Schemas are divided into:
- Document types
- Object types
- Block types

---

# Document Types (Core)

## site
**Nettsted-definisjon for multisite.**

Alle innholdsdokumenter refererer til et site-dokument for å filtrere innhold per nettsted.

Fields:
- title (string) - Navn på nettstedet
- siteId (slug) - Unik identifikator for filtrering
- domain (string) - Produksjonsdomene
- isDefault (boolean) - Standard fallback-nettsted
- isActive (boolean) - Aktiver/deaktiver nettsted

---

## page
Alle sider på tvers av alle nettsteder.

Fields:
- **site (reference: site)** - Hvilket nettsted siden tilhører (REQUIRED)
- title (string)
- slug (slug)
- seo (seo)
- blocks (array of blocks)
- visibility (enum: public | hidden)
- publishDate (datetime)

---

## globalSettings
Globale innstillinger **per nettsted**.

Fields:
- **site (reference: site)** - Hvilket nettsted innstillingene gjelder for (REQUIRED)
- siteTheme (siteTheme) - Embedded object for tema
- seo (seo) - Standard SEO-innstillinger
- customCode (customCode) - Scripts/tracking

---

## navigation
Navigasjon **per nettsted**.

Fields:
- **site (reference: site)** - Hvilket nettsted navigasjonen gjelder for (REQUIRED)
- mainNav (array of navItem)
- headerCta (cta)
- footerNav (array of navGroup)
- socialLinks (array of socialLink)

---

## postType
Dynamiske posttyper **per nettsted**.

Fields:
- **site (reference: site)** - Hvilket nettsted posttypen tilhører (REQUIRED)
- title (string) - Navn (flertall)
- singularTitle (string) - Navn (entall)
- slug (slug)
- description (text)
- hasArchive (boolean)
- hasSingleView (boolean)
- archiveLayout (enum: grid | list | masonry)
- archiveColumns (number)
- archiveTitle (string)
- archiveTitleColor (enum: primary | secondary)
- archiveDescription (text)
- archiveDescriptionColor (enum: primary | secondary)
- showExcerpt (boolean)
- showImage (boolean)
- showDate (boolean)
- cardTitleColor (enum: primary | secondary)
- cardExcerptColor (enum: primary | secondary)
- singleTitleColor (enum: primary | secondary)
- singleExcerptColor (enum: primary | secondary)
- singleContentColor (enum: primary | secondary)
- singleDateColor (enum: primary | secondary)

---

## post
Innlegg tilknyttet en posttype **per nettsted**.

Fields:
- **site (reference: site)** - Hvilket nettsted innlegget tilhører (REQUIRED)
- postType (reference: postType)
- title (string)
- slug (slug)
- featuredImage (imageWithAlt)
- excerpt (text)
- content (richText)
- gallery (array of images)
- externalUrl (url)
- externalUrlLabel (string)
- publishDate (datetime)
- visibility (enum: public | hidden)
- order (number)
- seo (seo)

---

## redirect
Redirects **per nettsted**.

Fields:
- **site (reference: site)** - Hvilket nettsted redirecten gjelder for (REQUIRED)
- source (string)
- destination (string)
- permanent (boolean)

---

# Object Types (Reusable)

## seo
Used for SEO metadata.

Fields:
- metaTitle (string)
- metaDescription (text)
- metaImage (image)
- canonicalUrl (url)
- robots (enum: index,follow | noindex,nofollow | noindex,follow | index,nofollow)

---

## link
Reusable link object with internal/external support.

Fields:
- type (enum: internal | external)
- internalLink (reference: page | post | postType)
- externalUrl (url)
- label (string)
- openInNewTab (boolean)

---

## siteTheme
Embedded in globalSettings for visual identity.

Fields:
- logo (imageWithAlt)
- logoDark (imageWithAlt)
- favicon (image)
- ogImage (image)
- colors (object):
  - primary (color)
  - secondary (color)
  - tertiary (color)
  - background (color)
  - surface (color)
  - textPrimary (color)
  - textSecondary (color)
- buttonColors (object):
  - primary (object): background (color), text (color)
  - secondary (object): background (color), text (color)
- typography (object):
  - headingFont (string)
  - bodyFont (string)
  - customHeadingFont (string)
  - customBodyFont (string)
- navigation (object):
  - linkColor (enum)
  - hoverColor (enum)
- headerMarquee (object):
  - enabled (boolean)
  - contentType (enum: text | images)
  - textItems (array)
  - imageItems (array)
  - speed (enum: slow | normal | fast)
  - direction (enum: left | right)
  - backgroundColor (enum)
  - textColor (enum)
  - separator (string)

---

## richText
Portable Text wrapper.

Fields:
- blocks (array of block, image)

Marks:
- strong, em, underline
- link, internalLink

Styles:
- normal, h2, h3, h4, blockquote

---

## customCode
For scripts and tracking codes.

Fields:
- headScripts (text)
- bodyStartScripts (text)
- footerScripts (text)

---

# Block Types (Page Builder)

## heroBlock
Fields:
- heading (string)
- headingColor (enum: primary | secondary)
- subheading (string)
- subheadingColor (enum: primary | secondary)
- backgroundImage (image)
- backgroundVideo (file)
- cta (array of cta)
- alignment (enum: left | center | right)
- containerWidth (enum: full | container)

---

## textBlock
Fields:
- heading (string)
- headingColor (enum: primary | secondary)
- subheading (string)
- subheadingColor (enum: primary | secondary)
- content (richText)
- contentColor (enum: primary | secondary)
- alignment (enum: left | center | right)
- containerWidth (enum: full | container)

---

## mediaTextBlock
Fields:
- mediaType (enum: image | video)
- image (image)
- video (file)
- videoPoster (image)
- layout (enum: text-left | text-right | stacked)
- heading (string)
- headingColor (enum: primary | secondary)
- subheading (string)
- subheadingColor (enum: primary | secondary)
- content (richText)
- contentColor (enum: primary | secondary)
- cta (array of cta)
- containerWidth (enum: full | container)

---

## galleryBlock
Fields:
- images (array of imageWithAlt)
- layout (enum: grid | masonry | carousel)
- columns (number)
- containerWidth (enum: full | container)

---

## ctaBlock
Fields:
- heading (string)
- headingColor (enum: primary | secondary)
- text (text)
- textColor (enum: primary | secondary)
- cta (array of cta)
- background (enum: primary | secondary | surface)
- containerWidth (enum: full | container)

---

## accordionBlock
Fields:
- heading (string)
- headingColor (enum: primary | secondary)
- items (array of object):
  - question (string)
  - answer (richText)
- containerWidth (enum: full | container)

---

## marqueeBlock
Fields:
- contentType (enum: text | images)
- textItems (array of objects with text and link)
- imageItems (array of objects with image and link)
- speed (enum: slow | normal | fast)
- direction (enum: left | right)
- imageSize (enum: small | medium | large)
- backgroundColor (enum)
- textColor (enum)
- separator (string)
- containerWidth (enum: full | container)

---

## postGridBlock
Fields:
- postType (reference: postType)
- displayType (enum: grid | carousel | list | featured)
- columns (number)
- limit (number)
- showExcerpt (boolean)
- showImage (boolean)
- showDate (boolean)
- containerWidth (enum: full | container)

---

## sectionBlock
Container block for grouping other blocks.

Fields:
- children (array of blocks)
- backgroundColor (enum)
- containerWidth (enum: full | container)

---

## spacerBlock
Fields:
- size (enum: sm | md | lg | xl)

---

# Schema Rules

1. **All documents must have site reference** (except site itself)
2. All listing is data-driven
3. No hardcoded relationships
4. postType controls naming and grouping
5. Redaktører kan opprette nye postType uten kodeendring
6. All frontend rendering skjer via blocks
7. All blocks må ha loading state
8. All blocks må støtte background color fra theme
9. **All queries must include site filter**
