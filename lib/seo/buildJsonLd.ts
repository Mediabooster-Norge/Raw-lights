import { collectFaqItems } from './plainText'
import type { JsonLdPageType, JsonLdPostType } from './types'

type GraphNode = Record<string, unknown>

type ImageLike = {
  asset?: { url?: string }
  alt?: string
}

function imageUrl(image?: ImageLike | null): string | undefined {
  return image?.asset?.url
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
    organization.logo = input.logoUrl
  }

  const website: GraphNode = {
    '@type': 'WebSite',
    '@id': `${input.siteUrl}/#website`,
    url: input.siteUrl,
    name: input.siteName || 'Website',
    publisher: { '@id': `${input.siteUrl}/#organization` },
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
}): GraphNode | null {
  if (input.override && typeof input.override === 'object') {
    return input.override as GraphNode
  }

  const type = input.type && input.type !== 'None' ? input.type : null
  if (!type) return null

  const node: GraphNode = {
    '@type': type,
    '@id': `${input.url}#${type.toLowerCase()}`,
    name: input.title,
    url: input.url,
    inLanguage: input.locale,
  }

  if (type === 'Article' || type === 'NewsArticle') {
    node.headline = input.title
    node.mainEntityOfPage = input.url
    if (input.datePublished) node.datePublished = input.datePublished
    node.publisher = { '@id': `${input.siteUrl}/#organization` }
  }

  if (input.description) node.description = input.description
  if (input.imageUrl) node.image = input.imageUrl

  return {
    '@context': 'https://schema.org',
    '@graph': [node],
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
