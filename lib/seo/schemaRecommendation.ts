import { collectFaqItems } from './plainText'

export type PageSchemaType =
  | 'WebPage'
  | 'AboutPage'
  | 'ContactPage'
  | 'CollectionPage'
  | 'FAQPage'

type PageLike = {
  slug?: string | null
  title?: string | null
  blocks?: unknown
}

export type SchemaRecommendation = {
  type: PageSchemaType
  label: string
  reasons: string[]
  hasFaq: boolean
}

function normalized(value?: string | null) {
  return value?.trim().toLocaleLowerCase('nb-NO') ?? ''
}

function hasBlock(blocks: unknown, type: string): boolean {
  if (!Array.isArray(blocks)) return false

  return blocks.some((block) => {
    if (!block || typeof block !== 'object') return false
    const node = block as { _type?: string; children?: unknown }
    return node._type === type || hasBlock(node.children, type)
  })
}

export function recommendPageSchema(page: PageLike): SchemaRecommendation {
  const slug = normalized(page.slug)
  const title = normalized(page.title)
  const faqItems = collectFaqItems(page.blocks)
  const hasFaq = faqItems.length > 0

  if (hasBlock(page.blocks, 'productCatalogBlock')) {
    return {
      type: 'CollectionPage',
      label: 'CollectionPage',
      reasons: ['Siden inneholder en produktkatalog og får også en dynamisk ItemList.'],
      hasFaq,
    }
  }

  if (['about', 'om-oss', 'about-us'].includes(slug) || title.includes('about') || title.includes('om oss')) {
    return {
      type: 'AboutPage',
      label: 'AboutPage',
      reasons: ['URL eller tittel identifiserer dette som en om oss-side.'],
      hasFaq,
    }
  }

  if (['contact', 'kontakt'].includes(slug) || title.includes('contact') || title.includes('kontakt')) {
    return {
      type: 'ContactPage',
      label: 'ContactPage',
      reasons: ['URL eller tittel identifiserer dette som en kontaktside.'],
      hasFaq,
    }
  }

  const isDedicatedFaq =
    ['faq', 'faqs', 'ofte-stilte-sporsmal', 'ofte-stilte-spørsmål', 'questions-and-answers'].includes(slug) ||
    title === 'faq' ||
    title.includes('ofte stilte spørsmål') ||
    title.includes('frequently asked questions')

  if (isDedicatedFaq && hasFaq) {
    return {
      type: 'FAQPage',
      label: 'FAQPage',
      reasons: ['Siden er en dedikert FAQ-side med synlige spørsmål og svar.'],
      hasFaq,
    }
  }

  return {
    type: 'WebPage',
    label: 'WebPage',
    reasons: ['Dette er en vanlig innholdsside.'],
    hasFaq,
  }
}

export function supportedPageSchemaType(value?: string | null): PageSchemaType | null {
  if (value === 'WebPage' || value === 'AboutPage' || value === 'ContactPage' || value === 'CollectionPage' || value === 'FAQPage') {
    return value
  }
  return null
}
