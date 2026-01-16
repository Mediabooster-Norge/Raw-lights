# Sanity Schema Definitions

Schemas are divided into:
- Document types
- Object types
- Taxonomy types
- Block types

Cursor must generate schema files as stubs only.
No fields beyond what is explicitly defined here.

---

# Document Types (Core)

## page
Used for all pages across all sites.

Fields:
- title (string)
- slug (slug)
- parent (reference: page) `// For hierarkisk struktur / breadcrumbs`
- seo (seo)
- blocks (array of blocks)
- visibility (enum: public | hidden)
- publishDate (datetime)

---

## globalSettings
One per dataset.

Fields:
- defaultSeo (seo)
- siteTheme (siteTheme) `// Embedded object, not reference`
- headerConfig (object)
- footerConfig (object)
- headScripts (text)
- bodyStartScripts (text)
- bodyEndScripts (text)

---

## navigation
One per dataset.

Fields:
- mainNav (array of navItem)
- headerCta (cta)
- footerNav (array of navGroup)
- socialLinks (array of socialLink)

---

## siteTheme
Defines visual identity per site. Embedded in globalSettings.

Fields:
- logo (imageWithAlt)
- logoDark (imageWithAlt)
- favicon (image)
- ogImage (image)
- palette (object):
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

---

## redirect
Used for 301/302 redirects.

Fields:
- from (string)
- to (string)
- type (enum: 301 | 302)
- enabled (boolean)

---

## form
Used for frontend forms.

Fields:
- name (string)
- slug (slug)
- fields (array of formField)
- successMessage (text)
- notificationEmail (string)
- enabled (boolean)

---

# Document Types (Content)

## eventItem
Generic content type for:
- Underholdning
- Artister
- Aktiviteter
- Programinnslag
- Shows

Fields:
- title (string)
- slug (slug)
- contentType (reference: contentType)
- categories (array of references: category)
- startDate (datetime)
- endDate (datetime)
- location (string)
- venue (reference: venue)
- image (imageWithAlt)
- description (text)
- body (richText)
- cta (cta)
- ticketing (object) - See Ticket Integration Contract
- featured (boolean)
- visibility (enum: public | hidden)
- publishDate (datetime)

---

## contentItem
Generic editorial content.

Fields:
- title (string)
- slug (slug)
- contentType (reference: contentType)
- categories (array of references: category)
- image (imageWithAlt)
- excerpt (text)
- body (richText)
- publishDate (datetime)
- visibility (enum: public | hidden)

---

## partner
Sponsors / collaborators.

Fields:
- name (string)
- logo (image)
- url (url)
- tier (string)
- visibility (enum: public | hidden)

---

## venue
Locations for events.

Fields:
- name (string)
- slug (slug)
- address (string)
- city (string)
- coordinates (geopoint)
- capacity (number)
- image (imageWithAlt)
- description (text)

---

# Taxonomy Types

## contentType
Controls how content is labeled and grouped.

Fields:
- name (string)
- slug (slug)
- description (text)
- icon (string)
- defaultLayout (string)

---

## category
Hierarchical categorization.

Fields:
- title (string)
- slug (slug)
- parent (reference: category)

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

## cta
Call-to-action.

Fields:
- link (link)
- variant (enum: primary | secondary | outline | ghost)

---

## navItem
Navigation item.

Fields:
- label (string)
- link (link)
- children (array of navItem)

---

## navGroup
Footer navigation group.

Fields:
- title (string)
- links (array of link)

---

## link
Reusable link object with internal/external support.

Fields:
- type (enum: internal | external)
- internalRef (reference: page | eventItem | contentItem)
- externalUrl (url)
- label (string)
- openInNewTab (boolean)

---

## socialLink
Social media link.

Fields:
- platform (enum: facebook | instagram | twitter | youtube | tiktok | linkedin | spotify)
- url (url)

---

## imageWithAlt
Accessible image object.

Fields:
- image (image with hotspot)
- alt (string)

---

## richText
Portable Text wrapper.

Fields:
- blocks (array of block, image, youtube, embed)

Marks:
- strong, em, underline
- link, internalLink

Styles:
- normal, h2, h3, h4, blockquote

---

## formField
Used inside form.

Fields:
- label (string)
- name (string)
- type (enum: text | email | tel | textarea | select | checkbox | radio)
- placeholder (string)
- required (boolean)
- options (array of string) `// For select/radio`

---

## youtube
Embedded YouTube video.

Fields:
- videoId (string)
- title (string)

---

## embed
Generic embed/iframe.

Fields:
- url (url)
- aspectRatio (enum: 16:9 | 4:3 | 1:1)

---

# Block Types (Page Builder)

## heroBlock
Fields:
- heading (string)
- subheading (string)
- backgroundImage (imageWithAlt)
- cta (cta)
- alignment (enum: left | center | right)

---

## textBlock
Fields:
- content (richText)
- width (enum: narrow | medium | wide)

---

## listingBlock
Fields:
- sourceType (enum: eventItem | contentItem)
- contentType (reference: contentType)
- categories (array of references: category)
- limit (number)
- layout (enum: grid | list | carousel)
- showFilters (boolean)

---

## featuredItemsBlock
Fields:
- items (array of references: eventItem | contentItem)
- layout (enum: grid | carousel)

---

## scheduleBlock
Fields:
- items (array of references: eventItem)
- showDates (boolean)
- groupByDate (boolean)

---

## galleryBlock
Fields:
- images (array of imageWithAlt)
- layout (enum: grid | masonry | carousel)
- columns (number)

---

## ctaBlock
Fields:
- heading (string)
- text (text)
- cta (cta)
- background (enum: primary | secondary | surface)

---

## partnersBlock
Fields:
- heading (string)
- partners (array of references: partner)
- showTier (boolean)
- layout (enum: grid | carousel)

---

## formBlock
Fields:
- form (reference: form)
- heading (string)
- description (text)

---

## embedBlock
Fields:
- embed (embed)
- caption (string)

---

## accordionBlock
Fields:
- heading (string)
- items (array of object):
  - question (string)
  - answer (richText)

---

## mapBlock
Fields:
- venue (reference: venue)
- zoom (number)
- showDirections (boolean)

---

## spacerBlock
Fields:
- size (enum: sm | md | lg | xl)

---

# Schema Rules

1. All listing is data-driven
2. No hardcoded relationships
3. contentType controls naming and grouping
4. Redaktører kan opprette nye contentType uten kodeendring
5. Få document types, mange referanser
6. All frontend rendering skjer via blocks
7. All blocks må ha loading state
8. All blocks må støtte background color fra theme
