import { groq } from 'next-sanity'
import { LANGUAGE_FILTER, PUBLISH_FILTER } from './page'

export const productFields = groq`
  _id, _type, language, title, "slug": slug.current, category, sku, price, excerpt,
  descriptionHeading, features, keyStats, specifications, primaryCta, secondaryCta,
  heroImage { ..., asset-> { _id, url, metadata { dimensions { width, height, aspectRatio } } } },
  relatedProducts[]-> { _id, title, "slug": slug.current, sku, excerpt, category, heroImage { ..., asset-> { _id, url, metadata { dimensions { width, height, aspectRatio } } } } },
  seo, visibility, publishDate, order, _updatedAt
`

export const productsQuery = groq`*[_type == "product" && ${PUBLISH_FILTER} && ${LANGUAGE_FILTER}] | order(order asc, title asc) { ${productFields} }`
export const productBySlugQuery = groq`*[_type == "product" && slug.current == $slug && ${PUBLISH_FILTER} && ${LANGUAGE_FILTER}][0] { ${productFields} }`
export const productSlugsQuery = groq`*[_type == "product" && defined(slug.current) && ${LANGUAGE_FILTER}].slug.current`
