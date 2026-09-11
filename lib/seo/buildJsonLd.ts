import { collectFaqItems } from './plainText'
import { recommendPageSchema, supportedPageSchemaType } from './schemaRecommendation'
import type { JsonLdPageType, JsonLdPostType } from './types'

type GraphNode = Record<string, unknown>

type ImageLike = {
  asset?: { url?: string }
  alt?: string
}

type OrganizationContact = {
  legalName?: string
  email?: string
  telephone?: string
  address?: {
    streetAddress?: string
    postalCode?: string
    addressLocality?: string
    addressCountry?: string
  }
}

type ProductOffer = {
  price?: number
  currency?: string
  availability?: string
  validThrough?: string
  itemCondition?: string
}

const ARTICLE_TYPES = new Set(['Article', 'NewsArticle', 'BlogPosting'])

function imageUrl(image?: ImageLike | null): string | undefined {
  return image?.asset?.url
}

function imageObject(url?: string): GraphNode | undefined {
  if (!url) return undefined
  return { '@type': 'ImageObject', url }
}

function localLabel(locale: string, english: string, norwegian: string) {
  return locale === 'nb' ? norwegian : english
}

function breadcrumbList(baseUrl: string, locale: string, segments: { name: string; path: string }[]): GraphNode {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: localLabel(locale, 'Home', 'Hjem'),
        item: baseUrl,
      },
      ...segments.map((segment, index) => ({
        '@type': 'ListItem',
        position: index + 2,
        name: segment.name,
        item: `${baseUrl}${segment.path === '/' ? '' : segment.path}`,
      })),
    ],
  }
}

function organizationRef(siteUrl: string) {
  return { '@id': `${siteUrl}/#organization` }
}

function pageNode(input: {
  type: string
  title: string
  description?: string
  url: string
  siteUrl: string
  locale: string
}): GraphNode {
  const node: GraphNode = {
    '@type': input.type,
    '@id': `${input.url}#webpage`,
    url: input.url,
    name: input.title,
    inLanguage: input.locale,
    isPartOf: { '@id': `${input.siteUrl}/#website` },
  }
  if (input.description) node.description = input.description
  return node
}

function catalogItems(blocks: unknown, siteUrl: string, locale: string) {
  const items = new Map<string, { name: string; url: string }>()

  function visit(value: unknown) {
    if (!Array.isArray(value)) return
    for (const block of value) {
      if (!block || typeof block !== 'object') continue
      const node = block as {
        _type?: string
        products?: { title?: string; slug?: string }[]
        fallbackProducts?: { title?: string; slug?: string }[]
        children?: unknown
      }
      if (node._type === 'productCatalogBlock') {
        const products = node.products?.length ? node.products : node.fallbackProducts
        for (const product of products ?? []) {
          if (!product.title || !product.slug) continue
          const path = `${locale === 'en' ? '/en' : ''}/products/${product.slug}`
          items.set(product.slug, { name: product.title, url: new URL(path, siteUrl).toString() })
        }
      }
      visit(node.children)
    }
  }

  visit(blocks)
  return [...items.values()]
}

function itemList(items: { name: string; url: string }[]): GraphNode {
  return {
    '@type': 'ItemList',
    numberOfItems: items.length,
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: item.url,
      name: item.name,
    })),
  }
}

export function buildOrganizationGraph(input: {
  siteName?: string
  siteUrl: string
  logoUrl?: string
  locale?: string
  sameAs?: string[]
  contact?: OrganizationContact
}): GraphNode[] {
  const organization: GraphNode = {
    '@type': 'Organization',
    '@id': `${input.siteUrl}/#organization`,
    name: input.contact?.legalName || input.siteName || 'Website',
    url: input.siteUrl,
  }
  if (input.logoUrl) organization.logo = imageObject(input.logoUrl)
  if (input.sameAs?.length) organization.sameAs = input.sameAs
  if (input.contact?.email) organization.email = input.contact.email
  if (input.contact?.telephone) organization.telephone = input.contact.telephone

  const address = input.contact?.address
  if (address && Object.values(address).some(Boolean)) {
    organization.address = { '@type': 'PostalAddress', ...address }
  }

  if (input.contact?.email || input.contact?.telephone) {
    organization.contactPoint = {
      '@type': 'ContactPoint',
      ...(input.contact.email ? { email: input.contact.email } : {}),
      ...(input.contact.telephone ? { telephone: input.contact.telephone } : {}),
      contactType: 'customer support',
      availableLanguage: ['nb', 'en'],
    }
  }

  const website: GraphNode = {
    '@type': 'WebSite',
    '@id': `${input.siteUrl}/#website`,
    url: input.siteUrl,
    name: input.siteName || 'Website',
    publisher: organizationRef(input.siteUrl),
    inLanguage: input.locale || 'nb',
  }

  return [organization, website]
}

export function buildPageJsonLd(input: {
  type?: JsonLdPageType | string | null
  override?: unknown
  title: string
  description?: string
  url: string
  siteUrl: string
  locale: string
  slug?: string
  blocks?: unknown
  breadcrumbs?: { name: string; path: string }[]
}): GraphNode {
  if (input.override && typeof input.override === 'object') return input.override as GraphNode

  const recommendation = recommendPageSchema({ title: input.title, slug: input.slug, blocks: input.blocks })
  const items = catalogItems(input.blocks, input.siteUrl, input.locale)
  const requestedType = supportedPageSchemaType(input.type)
  const type = requestedType === 'CollectionPage' && !items.length
    ? recommendation.type
    : requestedType ?? recommendation.type
  const page = pageNode({ ...input, type })
  const faqItems = collectFaqItems(input.blocks)

  if (items.length) page.mainEntity = itemList(items)

  const graph: GraphNode[] = [page]
  if (faqItems.length) {
    graph.push({
      '@type': 'FAQPage',
      '@id': `${input.url}#faq`,
      url: input.url,
      inLanguage: input.locale,
      mainEntityOfPage: { '@id': `${input.url}#webpage` },
      mainEntity: faqItems.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: { '@type': 'Answer', text: item.answer },
      })),
    })
  }
  graph.push(breadcrumbList(input.siteUrl, input.locale, input.breadcrumbs ?? []))

  return { '@context': 'https://schema.org', '@graph': graph }
}

export function buildPostJsonLd(input: {
  type?: JsonLdPostType | string | null
  override?: unknown
  title: string
  description?: string
  url: string
  siteUrl: string
  locale: string
  imageUrl?: string
  datePublished?: string
  dateModified?: string
  breadcrumbs?: { name: string; path: string }[]
}): GraphNode {
  if (input.override && typeof input.override === 'object') return input.override as GraphNode

  const page = pageNode({ ...input, type: 'WebPage' })
  const graph: GraphNode[] = [page]

  if (input.type && ARTICLE_TYPES.has(input.type)) {
    const article: GraphNode = {
      '@type': input.type,
      '@id': `${input.url}#article`,
      headline: input.title,
      mainEntityOfPage: { '@id': `${input.url}#webpage` },
      publisher: organizationRef(input.siteUrl),
      author: organizationRef(input.siteUrl),
      inLanguage: input.locale,
    }
    if (input.description) article.description = input.description
    if (input.imageUrl) article.image = imageObject(input.imageUrl)
    if (input.datePublished) article.datePublished = input.datePublished
    if (input.dateModified) article.dateModified = input.dateModified
    graph.push(article)
  }

  graph.push(breadcrumbList(input.siteUrl, input.locale, input.breadcrumbs ?? []))
  return { '@context': 'https://schema.org', '@graph': graph }
}

export function buildProductJsonLd(input: {
  title: string
  description?: string
  url: string
  siteUrl: string
  locale: string
  imageUrl?: string
  sku?: string
  mpn?: string
  gtin?: string
  offer?: ProductOffer
}) {
  const page = pageNode({ ...input, type: 'WebPage' })
  const product: GraphNode = {
    '@type': 'Product',
    '@id': `${input.url}#product`,
    name: input.title,
    url: input.url,
    inLanguage: input.locale,
    mainEntityOfPage: { '@id': `${input.url}#webpage` },
    brand: organizationRef(input.siteUrl),
  }
  if (input.description) product.description = input.description
  if (input.sku) product.sku = input.sku
  if (input.mpn) product.mpn = input.mpn
  if (input.gtin) product.gtin = input.gtin
  if (input.imageUrl) product.image = [input.imageUrl]

  if (typeof input.offer?.price === 'number' && Number.isFinite(input.offer.price) && input.offer.currency && input.offer.availability) {
    product.offers = {
      '@type': 'Offer',
      url: input.url,
      price: input.offer.price,
      priceCurrency: input.offer.currency,
      availability: `https://schema.org/${input.offer.availability}`,
      ...(input.offer.validThrough ? { priceValidUntil: input.offer.validThrough } : {}),
      ...(input.offer.itemCondition ? { itemCondition: `https://schema.org/${input.offer.itemCondition}` } : {}),
    }
  }

  return {
    '@context': 'https://schema.org',
    '@graph': [
      page,
      product,
      breadcrumbList(input.siteUrl, input.locale, [
        { name: localLabel(input.locale, 'Products', 'Produkter'), path: `${input.locale === 'en' ? '/en' : ''}/products` },
        { name: input.title, path: new URL(input.url).pathname },
      ]),
    ],
  }
}

export function buildCollectionJsonLd(input: {
  title: string
  description?: string
  url: string
  siteUrl: string
  locale: string
  items: { name: string; url: string }[]
}): GraphNode {
  const collection = pageNode({ ...input, type: 'CollectionPage' })
  collection['@id'] = `${input.url}#collection`
  collection.mainEntity = itemList(input.items)

  return {
    '@context': 'https://schema.org',
    '@graph': [
      collection,
      breadcrumbList(input.siteUrl, input.locale, [{ name: input.title, path: new URL(input.url).pathname }]),
    ],
  }
}

export function parseJsonLdOverride(value?: string | null): unknown {
  if (!value || !value.trim()) return null
  try {
    const parsed = JSON.parse(value)
    return parsed !== null && typeof parsed === 'object' ? parsed : null
  } catch {
    return null
  }
}

export function imageAssetUrl(image?: ImageLike | null): string | undefined {
  return imageUrl(image)
}
