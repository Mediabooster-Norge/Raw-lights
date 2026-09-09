import { groq } from 'next-sanity'

export const allPostTypesQuery = groq`
  *[_type == "postType"] | order(title asc) {
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
    archiveDescription,
    showExcerpt,
    showImage,
    showDate,
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
  *[_type == "postType" && slug.current == $slug][0] {
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
    archiveDescription,
    showExcerpt,
    showImage,
    showDate,
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
  *[_type == "post" && postType->slug.current == $postTypeSlug && visibility == "public"] | order(order asc, publishDate desc) {
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

export const singlePostQuery = groq`
  *[_type == "post" && postType->slug.current == $postTypeSlug && slug.current == $postSlug && visibility == "public"][0] {
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
      robots,
      jsonLd
    },
    "postType": postType-> {
      title,
      singularTitle,
      "slug": slug.current,
      hasSingleView
    }
  }
`

export const singlePostPreviewQuery = groq`
  *[_type == "post" && postType->slug.current == $postTypeSlug && slug.current == $postSlug][0] {
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
      robots,
      jsonLd
    },
    "postType": postType-> {
      title,
      singularTitle,
      "slug": slug.current,
      hasSingleView
    }
  }
`

export const postSlugsByTypeQuery = groq`
  *[_type == "post" && postType->slug.current == $postTypeSlug && visibility == "public"] {
    "slug": slug.current
  }
`

export const allPostTypeSlugsQuery = groq`
  *[_type == "postType" && hasArchive == true].slug.current
`
