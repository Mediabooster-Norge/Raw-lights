import { groq } from 'next-sanity'

export const pageFields = groq`
  _id,
  _type,
  title,
  "slug": slug.current,
  blocks[] {
    _key,
    _type,
    ...,
    // Hero video support
    backgroundVideo {
      asset-> {
        url
      }
    },
    // MediaTextBlock video support (root level)
    video {
      asset-> {
        url
      }
    },
    videoPoster {
      asset-> {
        url
      }
    },
    // Gallery images with metadata for masonry
    images[] {
      ...,
      asset-> {
        _id,
        url,
        metadata {
          dimensions {
            width,
            height,
            aspectRatio
          }
        }
      }
    },
    // PostGridBlock - resolve postType and fetch posts
    _type == "postGridBlock" => {
      ...,
      "postType": postType-> {
        title,
        "slug": slug.current,
        hasSingleView
      },
      "posts": *[_type == "post" && postType._ref == ^.postType._ref && visibility == "public"] | order(order asc, publishDate desc) [0..12] {
        _id,
        title,
        "slug": slug.current,
        excerpt,
        featuredImage {
          asset->,
          alt
        },
        publishDate
      }
    },
    // Nested children blocks (for sectionBlock)
    children[] {
      _key,
      _type,
      ...,
      backgroundVideo {
        asset-> {
          url
        }
      },
      video {
        asset-> {
          url
        }
      },
      videoPoster {
        asset-> {
          url
        }
      },
      // Gallery images in nested blocks
      images[] {
        ...,
        asset-> {
          _id,
          url,
          metadata {
            dimensions {
              width,
              height,
              aspectRatio
            }
          }
        }
      },
      // PostGridBlock in nested blocks
      _type == "postGridBlock" => {
        ...,
        "postType": postType-> {
          title,
          "slug": slug.current,
          hasSingleView
        },
        "posts": *[_type == "post" && postType._ref == ^.postType._ref && visibility == "public"] | order(order asc, publishDate desc) [0..12] {
          _id,
          title,
          "slug": slug.current,
          excerpt,
          featuredImage {
            asset->,
            alt
          },
          publishDate
        }
      }
    }
  },
  seo {
    metaTitle,
    metaDescription,
    metaImage { asset-> },
    canonicalUrl,
    robots
  }
`

export const PUBLISH_FILTER = `(visibility == "public" || !defined(visibility)) && (!defined(publishDate) || publishDate <= now())`

export const pageQuery = groq`
  *[_type == "page" && slug.current == $slug && ${PUBLISH_FILTER}][0] {
    ${pageFields}
  }
`

export const pagePreviewQuery = groq`
  *[_type == "page" && slug.current == $slug][0] {
    ${pageFields}
  }
`

export const allPagesQuery = groq`
  *[_type == "page" && defined(slug.current) && ${PUBLISH_FILTER}] {
    ${pageFields}
  }
`

export const pageSlugsQuery = groq`
  *[_type == "page" && defined(slug.current)].slug.current
`
