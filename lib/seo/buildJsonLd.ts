import { collectFaqSections, type FaqItem } from './plainText'
import { recommendPageSchema, supportedPageSchemaType } from './schemaRecommendation'
import type { JsonLdPageType, JsonLdPostType } from './types'
import { localizedPath, parseLocale } from '@/lib/i18n/config'
import { productPath, productsPath } from '@/lib/i18n/routes'

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

function imageObject(url?: string, id?: string): GraphNode | undefined {
  if (!url) return undefined
  return { '@type': 'ImageObject', ...(id ? { '@id': id } : {}), url, contentUrl: url }
}

function localLabel(locale: string, english: string, norwegian: string) {
  return locale === 'nb' ? norwegian : english
}

function schemaId(url: string, fragment: string) {
  const parsed = new URL(url)
  const pathname = parsed.pathname === '/' ? '/' : parsed.pathname.replace(/\/+$/, '')
  return `${parsed.origin}${pathname}${parsed.search}#${fragment}`
}

function publicUrl(baseUrl: string, path: string) {
  const url = new URL(path, `${baseUrl.replace(/\/+$/, '')}/`).toString()
  return url.replace(/\/$/, '')
}

function breadcrumbList(
  baseUrl: string,
  pageUrl: string,
  locale: string,
  segments: { name: string; path: string }[]
): GraphNode {
  const homePath = localizedPath(parseLocale(locale), '/')

  return {
    '@type': 'BreadcrumbList',
    '@id': schemaId(pageUrl, 'breadcrumb'),
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: localLabel(locale, 'Home', 'Hjem'),
        item: publicUrl(baseUrl, homePath),
      },
      ...segments.map((segment, index) => ({
        '@type': 'ListItem',
        position: index + 2,
        name: segment.name,
        item: publicUrl(baseUrl, segment.path),
      })),
    ],
  }
}

function organizationRef(siteUrl: string) {
  return { '@id': schemaId(siteUrl, 'organization') }
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
    '@id': schemaId(input.url, 'webpage'),
    url: input.url,
    name: input.title,
    inLanguage: input.locale,
    isPartOf: { '@id': schemaId(input.siteUrl, 'website') },
  }
  if (input.description) node.description = input.description
  return node
}

function overrideNodes(override: unknown): GraphNode[] {
  if (Array.isArray(override)) {
    return override.filter((node): node is GraphNode => Boolean(node) && typeof node === 'object' && !Array.isArray(node))
  }
  if (!override || typeof override !== 'object') return []

  const document = override as GraphNode
  if (Array.isArray(document['@graph'])) {
    return overrideNodes(document['@graph'])
  }
  return [document]
}

function mergeJsonLdOverride(graph: GraphNode[], override: unknown): GraphNode[] {
  const merged = [...graph]

  for (const node of overrideNodes(override)) {
    const id = typeof node['@id'] === 'string' ? node['@id'] : null
    const type = typeof node['@type'] === 'string' ? node['@type'] : null
    const index = merged.findIndex((candidate) =>
      (id && candidate['@id'] === id) || (type && candidate['@type'] === type)
    )

    if (index >= 0) {
      const generatedType = merged[index]['@type']
      const generatedId = merged[index]['@id']
      merged[index] = {
        ...merged[index],
        ...node,
        ...(generatedType ? { '@type': generatedType } : {}),
        ...(generatedId ? { '@id': generatedId } : {}),
      }
    } else {
      merged.push(node)
    }
  }

  return merged
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
          const path = productPath(parseLocale(locale), product.slug)
          items.set(product.slug, { name: product.title, url: new URL(path, siteUrl).toString() })
        }
      }
      visit(node.children)
    }
  }

  visit(blocks)
  return [...items.values()]
}

function itemList(items: { name: string; url: string }[], id: string): GraphNode {
  return {
    '@type': 'ItemList',
    '@id': id,
    numberOfItems: items.length,
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Product',
        '@id': schemaId(item.url, 'product'),
        url: item.url,
        name: item.name,
      },
    })),
  }
}

function faqQuestions(items: FaqItem[], pageUrl: string, fragment: string): GraphNode[] {
  return items.map((item, index) => ({
    '@type': 'Question',
    '@id': schemaId(pageUrl, `${fragment}-question-${index + 1}`),
    name: item.question,
    acceptedAnswer: {
      '@type': 'Answer',
      '@id': schemaId(pageUrl, `${fragment}-answer-${index + 1}`),
      text: item.answer,
    },
  }))
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
    '@id': schemaId(input.siteUrl, 'organization'),
    name: input.siteName?.trim() || input.contact?.legalName?.trim() || 'Website',
    url: input.siteUrl,
  }
  if (input.contact?.legalName?.trim()) organization.legalName = input.contact.legalName.trim()
  if (input.logoUrl) organization.logo = imageObject(input.logoUrl, schemaId(input.siteUrl, 'logo'))
  const sameAs = input.sameAs?.map((url) => url.trim()).filter(Boolean)
  if (sameAs?.length) organization.sameAs = sameAs
  if (input.contact?.email?.trim()) organization.email = input.contact.email.trim()
  if (input.contact?.telephone?.trim()) organization.telephone = input.contact.telephone.trim()

  const address = input.contact?.address
  if (address && Object.values(address).some(Boolean)) {
    organization.address = {
      '@type': 'PostalAddress',
      ...Object.fromEntries(
        Object.entries(address)
          .map(([key, value]) => [key, value?.trim()])
          .filter((entry): entry is [string, string] => Boolean(entry[1]))
      ),
    }
  }

  if (input.contact?.email || input.contact?.telephone) {
    organization.contactPoint = {
      '@type': 'ContactPoint',
      ...(input.contact.email?.trim() ? { email: input.contact.email.trim() } : {}),
      ...(input.contact.telephone?.trim() ? { telephone: input.contact.telephone.trim() } : {}),
      contactType: 'customer support',
      availableLanguage: ['nb', 'en'],
    }
  }

  const website: GraphNode = {
    '@type': 'WebSite',
    '@id': schemaId(input.siteUrl, 'website'),
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
  const recommendation = recommendPageSchema({ title: input.title, slug: input.slug, blocks: input.blocks })
  const items = catalogItems(input.blocks, input.siteUrl, input.locale)
  const faqSections = collectFaqSections(input.blocks)
  const faqItems = faqSections.flatMap((section) => section.items)
  const requestedType = supportedPageSchemaType(input.type)
  const type =
    (requestedType === 'CollectionPage' && !items.length) ||
    (requestedType === 'FAQPage' && (!faqItems.length || items.length > 0))
      ? recommendation.type
      : requestedType ?? recommendation.type
  const page = pageNode({ ...input, type })
  const graph: GraphNode[] = [page]

  if (items.length) {
    const listId = schemaId(input.url, 'itemlist')
    page.mainEntity = { '@id': listId }
    graph.push(itemList(items, listId))
  }

  if (type === 'FAQPage' && faqItems.length) {
    page.mainEntity = faqQuestions(faqItems, input.url, 'faq')
  } else if (faqSections.length) {
    const sectionRefs: GraphNode[] = []
    faqSections.forEach((section, index) => {
      const fragment = index === 0 ? 'faq' : `faq-${index + 1}`
      const sectionId = schemaId(input.url, fragment)
      sectionRefs.push({ '@id': sectionId })
      graph.push({
        '@type': 'WebPageElement',
        '@id': sectionId,
        name: section.heading || localLabel(input.locale, 'Frequently asked questions', 'Ofte stilte spørsmål'),
        inLanguage: input.locale,
        isPartOf: { '@id': schemaId(input.url, 'webpage') },
        hasPart: faqQuestions(section.items, input.url, fragment),
      })
    })
    page.hasPart = sectionRefs
  }
  if (input.breadcrumbs?.length) {
    page.breadcrumb = { '@id': schemaId(input.url, 'breadcrumb') }
    graph.push(breadcrumbList(input.siteUrl, input.url, input.locale, input.breadcrumbs))
  }

  return { '@context': 'https://schema.org', '@graph': mergeJsonLdOverride(graph, input.override) }
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
  const page = pageNode({ ...input, type: 'WebPage' })
  const graph: GraphNode[] = [page]

  if (input.type && ARTICLE_TYPES.has(input.type)) {
    const articleId = schemaId(input.url, 'article')
    const article: GraphNode = {
      '@type': input.type,
      '@id': articleId,
      url: input.url,
      headline: input.title,
      mainEntityOfPage: { '@id': schemaId(input.url, 'webpage') },
      publisher: organizationRef(input.siteUrl),
      author: organizationRef(input.siteUrl),
      inLanguage: input.locale,
    }
    if (input.description) article.description = input.description
    if (input.imageUrl) article.image = imageObject(input.imageUrl)
    if (input.datePublished) article.datePublished = input.datePublished
    if (input.dateModified) article.dateModified = input.dateModified
    page.mainEntity = { '@id': articleId }
    graph.push(article)
  }

  if (input.breadcrumbs?.length) {
    page.breadcrumb = { '@id': schemaId(input.url, 'breadcrumb') }
    graph.push(breadcrumbList(input.siteUrl, input.url, input.locale, input.breadcrumbs))
  }
  return { '@context': 'https://schema.org', '@graph': mergeJsonLdOverride(graph, input.override) }
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
  const page = pageNode({ ...input, type: 'ItemPage' })
  const productId = schemaId(input.url, 'product')
  const product: GraphNode = {
    '@type': 'Product',
    '@id': productId,
    name: input.title,
    url: input.url,
    inLanguage: input.locale,
    mainEntityOfPage: { '@id': schemaId(input.url, 'webpage') },
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
      seller: organizationRef(input.siteUrl),
      ...(input.offer.validThrough ? { priceValidUntil: input.offer.validThrough } : {}),
      ...(input.offer.itemCondition ? { itemCondition: `https://schema.org/${input.offer.itemCondition}` } : {}),
    }
  }

  page.mainEntity = { '@id': productId }
  page.breadcrumb = { '@id': schemaId(input.url, 'breadcrumb') }

  return {
    '@context': 'https://schema.org',
    '@graph': [
      page,
      product,
      breadcrumbList(input.siteUrl, input.url, input.locale, [
        { name: localLabel(input.locale, 'Products', 'Produkter'), path: productsPath(parseLocale(input.locale)) },
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
  const listId = schemaId(input.url, 'itemlist')
  collection.mainEntity = { '@id': listId }
  collection.breadcrumb = { '@id': schemaId(input.url, 'breadcrumb') }

  return {
    '@context': 'https://schema.org',
    '@graph': [
      collection,
      itemList(input.items, listId),
      breadcrumbList(input.siteUrl, input.url, input.locale, [{ name: input.title, path: new URL(input.url).pathname }]),
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
