import { groq } from 'next-sanity'

export const LANGUAGE_FILTER = `(language == $locale || (!defined(language) && $locale == "nb"))`

export const pageFields = groq`
  _id,
  _type,
  language,
  title,
  jsonLdType,
  jsonLdOverride,
  "slug": slug.current,
  blocks[] {
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
    _type == "postGridBlock" => {
      ...,
      "postType": postType-> {
        title,
        "slug": slug.current,
        hasSingleView
      },
      "posts": *[_type == "post" && postType._ref == ^.postType._ref && visibility == "public" && (language == $locale || (!defined(language) && $locale == "nb"))] | order(order asc, publishDate desc) [0..12] {
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
    _type == "formBlock" => {
      ...,
      "form": form-> {
        _id,
        title,
        submitLabel,
        successMessage,
        fields[]
      }
    },
    _type == "rawStoryHero" => {
      ...,
      image { ..., asset-> { _id, url, metadata { dimensions { width, height, aspectRatio } } } }
    },
    _type == "rawPinnedStories" => {
      ...,
      slides[] { ..., image { ..., asset-> { _id, url, metadata { dimensions { width, height, aspectRatio } } } } }
    },
    _type == "rawProductSpotlight" => {
      ...,
      "product": product-> { _id, title, "slug": slug.current, sku, excerpt, features, heroImage { ..., asset-> { _id, url, metadata { dimensions { width, height, aspectRatio } } } } }
    },
    _type == "rawProductFamilies" => {
      ...,
      items[] {
        ...,
        image { ..., asset-> { _id, url, metadata { dimensions { width, height, aspectRatio } } } },
        link {
          ...,
          internalLink-> { _type, "slug": slug.current, "postTypeSlug": postType->slug.current }
        }
      }
    },
    _type == "rawTimeline" => {
      ...,
      items[] { ..., image { ..., asset-> { _id, url, metadata { dimensions { width, height, aspectRatio } } } } }
    },
    _type == "rawBeamSection" => {
      ...,
      image { ..., asset-> { _id, url, metadata { dimensions { width, height, aspectRatio } } } }
    },
    _type == "rawFinale" => {
      ...,
      primaryCta { ..., internalLink-> { _type, "slug": slug.current, "postTypeSlug": postType->slug.current } },
      secondaryCta { ..., internalLink-> { _type, "slug": slug.current, "postTypeSlug": postType->slug.current } }
    },
    _type == "rawContactForm" => {
      ...,
      "form": form-> { _id, submitLabel, successMessage, fields[] }
    },
    _type == "productCatalogBlock" => {
      ...,
      "products": *[_type == "product" && (visibility == "public" || !defined(visibility)) && (!defined(publishDate) || publishDate <= now()) && (language == $locale || (!defined(language) && $locale == "nb"))] | order(order asc, title asc) {
        _id, title, "slug": slug.current, category, sku, excerpt,
        heroImage { ..., asset-> { _id, url, metadata { dimensions { width, height, aspectRatio } } } }
      },
      "fallbackProducts": *[_type == "product" && (visibility == "public" || !defined(visibility)) && (!defined(publishDate) || publishDate <= now()) && language == "en"] | order(order asc, title asc) {
        _id, title, "slug": slug.current, category, sku, excerpt,
        heroImage { ..., asset-> { _id, url, metadata { dimensions { width, height, aspectRatio } } } }
      }
    },
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
      _type == "postGridBlock" => {
        ...,
        "postType": postType-> {
          title,
          "slug": slug.current,
          hasSingleView
        },
        "posts": *[_type == "post" && postType._ref == ^.postType._ref && visibility == "public" && (language == $locale || (!defined(language) && $locale == "nb"))] | order(order asc, publishDate desc) [0..12] {
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
      _type == "formBlock" => {
        ...,
        "form": form-> {
          _id,
          title,
          submitLabel,
          successMessage,
          fields[]
        }
      }
      ,_type == "rawFillStatement" => { ... }
      ,_type == "rawProductFamilies" => {
        ...,
        items[] {
          ...,
          image { ..., asset-> { _id, url, metadata { dimensions { width, height, aspectRatio } } } },
          link { ..., internalLink-> { _type, "slug": slug.current, "postTypeSlug": postType->slug.current } }
        }
      }
      ,_type == "rawRules" => { ... }
      ,_type == "rawBeamSection" => { ..., image { ..., asset-> { _id, url, metadata { dimensions { width, height, aspectRatio } } } } }
    }
  },
  seo {
    metaTitle,
    metaDescription,
    metaImage { asset-> },
    canonicalUrl,
    robots,
    jsonLd
  }
`

export const PUBLISH_FILTER = `(visibility == "public" || !defined(visibility)) && (!defined(publishDate) || publishDate <= now())`

export const pageQuery = groq`
  *[_type == "page" && slug.current == $slug && ${PUBLISH_FILTER} && ${LANGUAGE_FILTER}][0] {
    ${pageFields}
  }
`

export const pageByIdQuery = groq`
  *[_type == "page" && _id == $id][0] {
    ${pageFields}
  }
`

export const pagePreviewQuery = groq`
  *[_type == "page" && slug.current == $slug && ${LANGUAGE_FILTER}][0] {
    ${pageFields}
  }
`

export const allPagesQuery = groq`
  *[_type == "page" && defined(slug.current) && ${PUBLISH_FILTER} && ${LANGUAGE_FILTER}] {
    ${pageFields}
  }
`

export const pageSlugsQuery = groq`
  *[_type == "page" && defined(slug.current) && ${LANGUAGE_FILTER}].slug.current
`
