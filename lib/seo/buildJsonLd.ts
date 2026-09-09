import { collectFaqItems } from './plainText'
import type { JsonLdPageType, JsonLdPostType } from './types'

type GraphNode = Record<string, unknown>

type ImageLike = {
  asset?: { url?: string }
  alt?: string
}

const ARTICLE_TYPES = new Set(['Article', 'NewsArticle', 'BlogPosting'])
const PERSON_LIKE = new Set(['Person', 'MusicGroup', 'PerformingGroup'])
const ORG_LIKE = new Set(['Organization', 'LocalBusiness'])

function imageUrl(image?: ImageLike | null): string | undefined {
  return image?.asset?.url
}

function imageObject(url?: string): GraphNode | undefined {
  if (!url) return undefined
  return { '@type': 'ImageObject', url }
}

function breadcrumbList(baseUrl: string, segments: { name: string; path: string }[]): GraphNode {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
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

function applySharedEntityFields(
  node: GraphNode,
  input: {
    title: string
    url: string
    locale: string
    description?: string
    imageUrl?: string
    sameAs?: string
  }
) {
  node.name = input.title
  node.url = input.url
  node.inLanguage = input.locale
  if (input.description) node.description = input.description
  const image = imageObject(input.imageUrl)
  if (image) node.image = image
  if (input.sameAs) node.sameAs = [input.sameAs]
}

function applyTypeFields(
  type: string,
  node: GraphNode,
  input: {
    title: string
    url: string
    siteUrl: string
    description?: string
    imageUrl?: string
    datePublished?: string
    dateModified?: string
    sameAs?: string
  }
) {
  if (ARTICLE_TYPES.has(type)) {
    node.headline = input.title
    node.mainEntityOfPage = { '@type': 'WebPage', '@id': input.url }
    node.publisher = organizationRef(input.siteUrl)
    node.author = organizationRef(input.siteUrl)
    if (input.datePublished) node.datePublished = input.datePublished
    if (input.dateModified) node.dateModified = input.dateModified
  }

  if (PERSON_LIKE.has(type) && input.sameAs) {
    node.sameAs = [input.sameAs]
  }

  if (ORG_LIKE.has(type)) {
    const logo = imageObject(input.imageUrl)
    if (logo) node.logo = logo
  }

  if (type === 'Event') {
    if (input.datePublished) node.startDate = input.datePublished
    node.organizer = organizationRef(input.siteUrl)
  }

  if (type === 'VideoObject') {
    if (input.imageUrl) node.thumbnailUrl = input.imageUrl
    if (input.datePublished) node.uploadDate = input.datePublished
  }

  if (type === 'ImageObject' && input.imageUrl) {
    node.contentUrl = input.imageUrl
  }

  if (type === 'Offer' && input.sameAs) {
    node.url = input.sameAs
  }

  if (type === 'Review' && input.description) {
    node.reviewBody = input.description
    node.itemReviewed = { '@type': 'CreativeWork', name: input.title }
  }
}

export function buildOrganizationGraph(input: {
  siteName?: string
  siteUrl: string
  logoUrl?: string
  locale?: string
}): GraphNode[] {
  const organization: GraphNode = {
    '@type': 'Organization',
    '@id': `${input.siteUrl}/#organization`,
    name: input.siteName || 'Website',
    url: input.siteUrl,
  }
  if (input.logoUrl) {
    organization.logo = imageObject(input.logoUrl)
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
  blocks?: unknown
  breadcrumbs?: { name: string; path: string }[]
}): GraphNode {
  if (input.override && typeof input.override === 'object') {
    return input.override as GraphNode
  }

  const faqItems = collectFaqItems(input.blocks)
  const type =
    input.type === 'FAQPage' || (!input.type && faqItems.length > 0)
      ? 'FAQPage'
      : input.type || 'WebPage'

  const node: GraphNode = {
    '@type': type,
    '@id': `${input.url}#webpage`,
    url: input.url,
    name: input.title,
    inLanguage: input.locale,
    isPartOf: { '@id': `${input.siteUrl}/#website` },
  }

  if (input.description) node.description = input.description

  if (type === 'FAQPage' && faqItems.length > 0) {
    node.mainEntity = faqItems.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    }))
  }

  if (type === 'Event') {
    applyTypeFields(type, node, {
      title: input.title,
      url: input.url,
      siteUrl: input.siteUrl,
    })
  }

  return {
    '@context': 'https://schema.org',
    '@graph': [
      node,
      breadcrumbList(input.siteUrl, input.breadcrumbs ?? []),
    ],
  }
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
  sameAs?: string
  breadcrumbs?: { name: string; path: string }[]
}): GraphNode | null {
  if (input.override && typeof input.override === 'object') {
    return input.override as GraphNode
  }

  const type = input.type && input.type !== 'None' ? input.type : null
  if (!type) return null

  if (type === 'ProfilePage') {
    const person: GraphNode = {
      '@type': 'Person',
      '@id': `${input.url}#person`,
    }
    applySharedEntityFields(person, input)
    applyTypeFields('Person', person, input)

    return {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'ProfilePage',
          '@id': `${input.url}#webpage`,
          url: input.url,
          name: input.title,
          inLanguage: input.locale,
          isPartOf: { '@id': `${input.siteUrl}/#website` },
          mainEntity: { '@id': `${input.url}#person` },
        },
        person,
        breadcrumbList(input.siteUrl, input.breadcrumbs ?? []),
      ],
    }
  }

  const node: GraphNode = {
    '@type': type,
    '@id': `${input.url}#entity`,
  }
  applySharedEntityFields(node, input)
  applyTypeFields(type, node, input)

  return {
    '@context': 'https://schema.org',
    '@graph': [
      node,
      breadcrumbList(input.siteUrl, input.breadcrumbs ?? []),
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
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': `${input.url}#collection`,
        url: input.url,
        name: input.title,
        description: input.description,
        inLanguage: input.locale,
        isPartOf: { '@id': `${input.siteUrl}/#website` },
        mainEntity: {
          '@type': 'ItemList',
          numberOfItems: input.items.length,
          itemListElement: input.items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            url: item.url,
            name: item.name,
          })),
        },
      },
      breadcrumbList(input.siteUrl, [{ name: input.title, path: new URL(input.url).pathname }]),
    ],
  }
}

export function parseJsonLdOverride(value?: string | null): unknown {
  if (!value || !value.trim()) return null
  try {
    const parsed = JSON.parse(value)
    if (parsed === null || typeof parsed !== 'object') return null
    return parsed
  } catch {
    return null
  }
}

export function imageAssetUrl(image?: ImageLike | null): string | undefined {
  return imageUrl(image)
}
