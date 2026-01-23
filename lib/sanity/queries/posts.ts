import { groq } from 'next-sanity'

// Site filter - betinget basert på om siteId er gitt
// Hvis siteId er null (single-site modus), ingen filtrering
const SITE_FILTER = `(!defined($siteId) || site->siteId.current == $siteId)`

// Hent alle posttyper
export const allPostTypesQuery = groq`
  *[_type == "postType" && ${SITE_FILTER}] | order(title asc) {
    _id,
    title,
    singularTitle,
    "slug": slug.current,
    description,
    hasArchive,
    hasSingleView,
    archiveLayout,
    archiveColumns,
    archiveTitle,
    archiveTitleColor,
    archiveDescription,
    archiveDescriptionColor,
    showExcerpt,
    showImage,
    showDate,
    cardTitleColor,
    cardExcerptColor,
    singleTitleColor,
    singleExcerptColor,
    singleContentColor,
    singleDateColor
  }
`

// Hent én posttype basert på slug
export const postTypeBySlugQuery = groq`
  *[_type == "postType" && slug.current == $slug && ${SITE_FILTER}][0] {
    _id,
    title,
    singularTitle,
    "slug": slug.current,
    description,
    hasArchive,
    hasSingleView,
    archiveLayout,
    archiveColumns,
    archiveTitle,
    archiveTitleColor,
    archiveDescription,
    archiveDescriptionColor,
    showExcerpt,
    showImage,
    showDate,
    cardTitleColor,
    cardExcerptColor,
    singleTitleColor,
    singleExcerptColor,
    singleContentColor,
    singleDateColor
  }
`

// Hent alle posts for en gitt posttype
export const postsByTypeQuery = groq`
  *[_type == "post" && postType->slug.current == $postTypeSlug && ${SITE_FILTER} && visibility == "public"] | order(order asc, publishDate desc) {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    featuredImage {
      asset->,
      alt
    },
    publishDate,
    order,
    "postType": postType-> {
      title,
      singularTitle,
      "slug": slug.current
    }
  }
`

// Hent én post basert på posttype-slug og post-slug
export const singlePostQuery = groq`
  *[_type == "post" && postType->slug.current == $postTypeSlug && slug.current == $postSlug && ${SITE_FILTER} && visibility == "public"][0] {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    featuredImage {
      asset->,
      alt
    },
    content,
    gallery[] {
      asset->,
      alt,
      caption
    },
    externalUrl,
    externalUrlLabel,
    publishDate,
    seo {
      metaTitle,
      metaDescription,
      metaImage { asset-> },
      canonicalUrl,
      robots
    },
    "postType": postType-> {
      title,
      singularTitle,
      "slug": slug.current,
      hasSingleView,
      singleTitleColor,
      singleExcerptColor,
      singleContentColor,
      singleDateColor
    }
  }
`

// Preview variant av singlePostQuery (ingen visibility-filter)
export const singlePostPreviewQuery = groq`
  *[_type == "post" && postType->slug.current == $postTypeSlug && slug.current == $postSlug && ${SITE_FILTER}][0] {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    featuredImage {
      asset->,
      alt
    },
    content,
    gallery[] {
      asset->,
      alt,
      caption
    },
    externalUrl,
    externalUrlLabel,
    publishDate,
    seo {
      metaTitle,
      metaDescription,
      metaImage { asset-> },
      canonicalUrl,
      robots
    },
    "postType": postType-> {
      title,
      singularTitle,
      "slug": slug.current,
      hasSingleView,
      singleTitleColor,
      singleExcerptColor,
      singleContentColor,
      singleDateColor
    }
  }
`

// Hent alle post-slugs for en posttype (for generateStaticParams)
export const postSlugsByTypeQuery = groq`
  *[_type == "post" && postType->slug.current == $postTypeSlug && ${SITE_FILTER} && visibility == "public"] {
    "slug": slug.current
  }
`

// Hent alle posttype-slugs (for generateStaticParams)
export const allPostTypeSlugsQuery = groq`
  *[_type == "postType" && hasArchive == true && ${SITE_FILTER}].slug.current
`
