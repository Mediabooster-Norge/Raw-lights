import assert from 'node:assert/strict'
import test from 'node:test'
import {
  buildCollectionJsonLd,
  buildOrganizationGraph,
  buildPageJsonLd,
  buildPostJsonLd,
  buildProductJsonLd,
} from './buildJsonLd'
import { recommendPageSchema } from './schemaRecommendation'

function graph(data: { '@graph': Record<string, unknown>[] }) {
  return data['@graph']
}

test('page markup links a catalog and an FAQ section without turning the page into FAQPage', () => {
  const data = buildPageJsonLd({
    title: 'Products',
    url: 'https://example.com/products',
    siteUrl: 'https://example.com',
    locale: 'en',
    slug: 'products',
    blocks: [
      {
        _type: 'productCatalogBlock',
        products: [{ title: 'RAW Carbon 9', slug: 'raw-carbon-9' }],
      },
      {
        _type: 'rawFaq',
        heading: 'Questions about our products',
        items: [{ question: 'Is it waterproof?', answer: [{ _type: 'block', children: [{ text: 'Yes.' }] }] }],
      },
    ],
  }) as { '@graph': Record<string, unknown>[] }

  const nodes = graph(data)
  const page = nodes[0]
  const list = nodes.find((node) => node['@type'] === 'ItemList')
  const faq = nodes.find((node) => node['@type'] === 'WebPageElement')

  assert.equal(page['@type'], 'CollectionPage')
  assert.deepEqual(page.mainEntity, { '@id': 'https://example.com/products#itemlist' })
  assert.equal(list?.['@id'], 'https://example.com/products#itemlist')
  assert.deepEqual(page.hasPart, [{ '@id': 'https://example.com/products#faq' }])
  assert.equal(faq?.name, 'Questions about our products')
  assert.deepEqual(faq?.isPartOf, { '@id': 'https://example.com/products#webpage' })
  assert.equal(nodes.some((node) => node['@type'] === 'FAQPage'), false)
})

test('home page remains WebPage and models FAQ as a page section', () => {
  const data = buildPageJsonLd({
    title: 'Raw Lights',
    description: 'Premium lights for Nordic conditions.',
    url: 'https://example.com',
    siteUrl: 'https://example.com',
    locale: 'nb',
    slug: 'forside',
    blocks: [
      {
        _type: 'rawFaq',
        items: [{ question: 'Er lyset vanntett?', answer: 'Ja.' }],
      },
    ],
  }) as { '@graph': Record<string, unknown>[] }

  const nodes = graph(data)
  const page = nodes.find((node) => node['@type'] === 'WebPage')
  const faq = nodes.find((node) => node['@type'] === 'WebPageElement')
  const question = (faq?.hasPart as Record<string, unknown>[])[0]
  const answer = question.acceptedAnswer as Record<string, unknown>

  assert.equal(page?.['@id'], 'https://example.com/#webpage')
  assert.equal(page?.description, 'Premium lights for Nordic conditions.')
  assert.deepEqual(page?.hasPart, [{ '@id': 'https://example.com/#faq' }])
  assert.equal(faq?.['@type'], 'WebPageElement')
  assert.equal(faq?.['@id'], 'https://example.com/#faq')
  assert.equal(question['@type'], 'Question')
  assert.equal(question['@id'], 'https://example.com/#faq-question-1')
  assert.equal(answer['@id'], 'https://example.com/#faq-answer-1')
  assert.equal(faq?.mainEntityOfPage, undefined)
  assert.equal(nodes.some((node) => node['@type'] === 'FAQPage'), false)
  assert.equal(nodes.some((node) => node['@type'] === 'BreadcrumbList'), false)
})

test('a dedicated FAQ page is FAQPage and owns its questions directly', () => {
  const data = buildPageJsonLd({
    title: 'Ofte stilte spørsmål',
    url: 'https://example.com/ofte-stilte-sporsmal',
    siteUrl: 'https://example.com',
    locale: 'nb',
    slug: 'ofte-stilte-sporsmal',
    blocks: [{ _type: 'rawFaq', items: [{ question: 'Når?', answer: 'I dag.' }] }],
  }) as { '@graph': Record<string, unknown>[] }

  const page = graph(data)[0]
  assert.equal(page['@type'], 'FAQPage')
  assert.equal(Array.isArray(page.mainEntity), true)
  assert.equal((page.mainEntity as Record<string, unknown>[])[0]['@type'], 'Question')
  assert.equal(graph(data).some((node) => node['@type'] === 'WebPageElement'), false)
})

test('generic accordions are not declared as FAQ structured data', () => {
  const blocks = [{ _type: 'accordionBlock', items: [{ question: 'Section', answer: 'Content' }] }]
  const data = buildPageJsonLd({
    title: 'Service',
    url: 'https://example.com/service',
    siteUrl: 'https://example.com',
    locale: 'en',
    blocks,
  }) as { '@graph': Record<string, unknown>[] }

  assert.equal(graph(data).some((node) => node['@type'] === 'FAQPage'), false)
  assert.equal(graph(data).some((node) => node['@type'] === 'WebPageElement'), false)
  assert.equal(recommendPageSchema({ title: 'Service', blocks }).hasFaq, false)
})

test('an incompatible manual FAQPage choice cannot replace a product collection', () => {
  const data = buildPageJsonLd({
    type: 'FAQPage',
    title: 'Products',
    url: 'https://example.com/products',
    siteUrl: 'https://example.com',
    locale: 'en',
    blocks: [
      { _type: 'productCatalogBlock', products: [{ title: 'RAW Carbon 9', slug: 'raw-carbon-9' }] },
      { _type: 'rawFaq', items: [{ question: 'Which light?', answer: 'RAW Carbon 9.' }] },
    ],
  }) as { '@graph': Record<string, unknown>[] }

  assert.equal(graph(data)[0]['@type'], 'CollectionPage')
  assert.deepEqual(graph(data)[0].mainEntity, { '@id': 'https://example.com/products#itemlist' })
})

test('English breadcrumbs start at the localized home page and connect to WebPage', () => {
  const url = 'https://example.com/en/about'
  const data = buildPageJsonLd({
    title: 'About',
    url,
    siteUrl: 'https://example.com',
    locale: 'en',
    slug: 'about',
    breadcrumbs: [{ name: 'About', path: '/en/about' }],
  }) as { '@graph': Record<string, unknown>[] }

  const nodes = graph(data)
  const page = nodes.find((node) => node['@type'] === 'AboutPage')
  const breadcrumbs = nodes.find((node) => node['@type'] === 'BreadcrumbList')
  const items = breadcrumbs?.itemListElement as { position: number; name: string; item: string }[]

  assert.deepEqual(page?.breadcrumb, { '@id': `${url}#breadcrumb` })
  assert.equal(breadcrumbs?.['@id'], `${url}#breadcrumb`)
  assert.deepEqual(items, [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://example.com/en' },
    { '@type': 'ListItem', position: 2, name: 'About', item: url },
  ])
})

test('advanced overrides extend automatic schema instead of removing required nodes', () => {
  const data = buildPageJsonLd({
    title: 'Contact',
    url: 'https://example.com/contact',
    siteUrl: 'https://example.com',
    locale: 'en',
    slug: 'contact',
    breadcrumbs: [{ name: 'Contact', path: '/contact' }],
    blocks: [{ _type: 'rawFaq', items: [{ question: 'When?', answer: 'Today.' }] }],
    override: {
      '@context': 'https://schema.org',
      '@graph': [
        { '@type': 'ContactPage', description: 'Expert description' },
        { '@type': 'LocalBusiness', '@id': 'https://example.com/#local-business', name: 'RAW Lights' },
      ],
    },
  }) as { '@graph': Record<string, unknown>[] }

  const nodes = graph(data)
  assert.equal(nodes.find((node) => node['@type'] === 'ContactPage')?.description, 'Expert description')
  assert.equal(nodes.some((node) => node['@type'] === 'WebPageElement'), true)
  assert.equal(nodes.some((node) => node['@type'] === 'BreadcrumbList'), true)
  assert.equal(nodes.some((node) => node['@type'] === 'LocalBusiness'), true)
})

test('posts always retain WebPage and BreadcrumbList when no article type is selected', () => {
  const data = buildPostJsonLd({
    type: 'None',
    title: 'A regular update',
    url: 'https://example.com/updates/example',
    siteUrl: 'https://example.com',
    locale: 'en',
    breadcrumbs: [
      { name: 'Updates', path: '/updates' },
      { name: 'A regular update', path: '/updates/example' },
    ],
  }) as { '@graph': Record<string, unknown>[] }

  assert.equal(graph(data)[0]['@type'], 'WebPage')
  assert.equal(graph(data).some((node) => node['@type'] === 'BreadcrumbList'), true)
})

test('article pages link WebPage and Article in both directions', () => {
  const url = 'https://example.com/news/new-light'
  const data = buildPostJsonLd({
    type: 'NewsArticle',
    title: 'New light',
    url,
    siteUrl: 'https://example.com',
    locale: 'en',
  }) as { '@graph': Record<string, unknown>[] }
  const page = graph(data).find((node) => node['@type'] === 'WebPage')
  const article = graph(data).find((node) => node['@type'] === 'NewsArticle')

  assert.deepEqual(page?.mainEntity, { '@id': `${url}#article` })
  assert.deepEqual(article?.mainEntityOfPage, { '@id': `${url}#webpage` })
  assert.equal(article?.url, url)
})

test('product offers require structured offer data and never invent availability', () => {
  const withoutOffer = buildProductJsonLd({
    title: 'RAW Carbon 9',
    url: 'https://example.com/products/raw-carbon-9',
    siteUrl: 'https://example.com',
    locale: 'en',
  }) as { '@graph': Record<string, unknown>[] }
  const productWithoutOffer = graph(withoutOffer).find((node) => node['@type'] === 'Product')
  const productPage = graph(withoutOffer).find((node) => node['@type'] === 'ItemPage')
  assert.equal(productWithoutOffer?.offers, undefined)
  assert.deepEqual(productPage?.mainEntity, { '@id': 'https://example.com/products/raw-carbon-9#product' })
  assert.deepEqual(productWithoutOffer?.mainEntityOfPage, { '@id': 'https://example.com/products/raw-carbon-9#webpage' })

  const withOffer = buildProductJsonLd({
    title: 'RAW Carbon 9',
    url: 'https://example.com/products/raw-carbon-9',
    siteUrl: 'https://example.com',
    locale: 'en',
    offer: { price: 3744, currency: 'NOK', availability: 'InStock' },
  }) as { '@graph': Record<string, unknown>[] }
  const productWithOffer = graph(withOffer).find((node) => node['@type'] === 'Product')
  assert.deepEqual(productWithOffer?.offers, {
    '@type': 'Offer',
    url: 'https://example.com/products/raw-carbon-9',
    price: 3744,
    priceCurrency: 'NOK',
    availability: 'https://schema.org/InStock',
    seller: { '@id': 'https://example.com/#organization' },
  })
})

test('collection pages keep the standard webpage id and reference a separate ItemList', () => {
  const url = 'https://example.com/products'
  const data = buildCollectionJsonLd({
    title: 'Products',
    url,
    siteUrl: 'https://example.com',
    locale: 'en',
    items: [{ name: 'RAW Carbon 9', url: `${url}/raw-carbon-9` }],
  }) as { '@graph': Record<string, unknown>[] }
  const page = graph(data).find((node) => node['@type'] === 'CollectionPage')
  const list = graph(data).find((node) => node['@type'] === 'ItemList')

  assert.equal(page?.['@id'], `${url}#webpage`)
  assert.deepEqual(page?.mainEntity, { '@id': `${url}#itemlist` })
  assert.equal(list?.['@id'], `${url}#itemlist`)
})

test('organization markup separates the public brand name from the legal name', () => {
  const nodes = buildOrganizationGraph({
    siteName: 'RAW Lights',
    siteUrl: 'https://example.com',
    logoUrl: 'https://cdn.example.com/logo.png',
    contact: { legalName: 'Egil Verne AS', email: ' contact@example.com ' },
  })
  const organization = nodes.find((node) => node['@type'] === 'Organization')
  const logo = organization?.logo as Record<string, unknown>

  assert.equal(organization?.name, 'RAW Lights')
  assert.equal(organization?.legalName, 'Egil Verne AS')
  assert.equal(organization?.email, 'contact@example.com')
  assert.equal(logo['@id'], 'https://example.com/#logo')
  assert.equal(logo.contentUrl, 'https://cdn.example.com/logo.png')
})
