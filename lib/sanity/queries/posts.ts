import { groq } from 'next-sanity'
import { LANGUAGE_FILTER } from './page'

export const allPostTypesQuery = groq`
  *[_type == "postType" && ${LANGUAGE_FILTER}] | order(title asc) {
    _id,
    title,
    singularTitle,
    language,
    "slug": slug.current,
    description,
    hasArchive,
    hasSingleView,
    archiveLayout,
    archiveColumns,
    archiveTitle,
    archiveDescription,
    showExcerpt,
    showImage,
    showDate,
    jsonLdType,
    seo {
      metaTitle,
      metaDescription,
      metaImage { asset-> },
      canonicalUrl,
      robots,
      jsonLd
    }
  }
`

export const postTypeBySlugQuery = groq`
  *[_type == "postType" && slug.current == $slug && ${LANGUAGE_FILTER}][0] {
    _id,
    title,
    singularTitle,
    language,
    "slug": slug.current,
    description,
    hasArchive,
    hasSingleView,
    archiveLayout,
    archiveColumns,
    archiveTitle,
    archiveDescription,
    showExcerpt,
    showImage,
    showDate,
    jsonLdType,
    seo {
      metaTitle,
      metaDescription,
      metaImage { asset-> },
      canonicalUrl,
      robots,
      jsonLd
    }
  }
`

export const postsByTypeQuery = groq`
  *[_type == "post" && postType->slug.current == $postTypeSlug && visibility == "public" && ${LANGUAGE_FILTER}] | order(order asc, publishDate desc) {
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

const singlePostFields = groq`
    _id,
    title,
    language,
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
      robots,
      jsonLd
    },
    "postType": postType-> {
      title,
      singularTitle,
      "slug": slug.current,
      hasSingleView,
      jsonLdType
    }
`

export const singlePostQuery = groq`
  *[_type == "post" && postType->slug.current == $postTypeSlug && slug.current == $postSlug && visibility == "public" && ${LANGUAGE_FILTER}][0] {
    ${singlePostFields}
  }
`

export const singlePostPreviewQuery = groq`
  *[_type == "post" && postType->slug.current == $postTypeSlug && slug.current == $postSlug && ${LANGUAGE_FILTER}][0] {
    ${singlePostFields}
  }
`

export const postSlugsByTypeQuery = groq`
  *[_type == "post" && postType->slug.current == $postTypeSlug && visibility == "public" && ${LANGUAGE_FILTER}] {
    "slug": slug.current
  }
`

export const allPostTypeSlugsQuery = groq`
  *[_type == "postType" && hasArchive == true && ${LANGUAGE_FILTER}].slug.current
`
