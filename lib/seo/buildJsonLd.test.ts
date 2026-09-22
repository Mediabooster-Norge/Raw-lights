import assert from 'node:assert/strict'
import test from 'node:test'
import { buildPageJsonLd, buildPostJsonLd, buildProductJsonLd } from './buildJsonLd'

function graph(data: { '@graph': Record<string, unknown>[] }) {
  return data['@graph']
}

test('page markup infers catalog and FAQ markup from visible blocks', () => {
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
        items: [{ question: 'Is it waterproof?', answer: [{ _type: 'block', children: [{ text: 'Yes.' }] }] }],
      },
    ],
  }) as { '@graph': Record<string, unknown>[] }

  const nodes = graph(data)
  assert.equal(nodes[0]['@type'], 'CollectionPage')
  assert.equal((nodes[0].mainEntity as { '@type': string })['@type'], 'ItemList')
  assert.equal(nodes.some((node) => node['@type'] === 'FAQPage'), true)
})

test('home page keeps WebPage and FAQPage but omits an invalid one-item breadcrumb', () => {
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
  assert.equal(page?.['@id'], 'https://example.com/#webpage')
  assert.equal(page?.description, 'Premium lights for Nordic conditions.')
  assert.equal(nodes.some((node) => node['@type'] === 'FAQPage'), true)
  assert.equal(nodes.some((node) => node['@type'] === 'BreadcrumbList'), false)
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

  assert.deepEqual(page?.breadcrumb, { '@id': `${url}/#breadcrumb` })
  assert.equal(breadcrumbs?.['@id'], `${url}/#breadcrumb`)
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
  assert.equal(nodes.some((node) => node['@type'] === 'FAQPage'), true)
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

test('product offers require structured offer data and never invent availability', () => {
  const withoutOffer = buildProductJsonLd({
    title: 'RAW Carbon 9',
    url: 'https://example.com/products/raw-carbon-9',
    siteUrl: 'https://example.com',
    locale: 'en',
  }) as { '@graph': Record<string, unknown>[] }
  const productWithoutOffer = graph(withoutOffer).find((node) => node['@type'] === 'Product')
  assert.equal(productWithoutOffer?.offers, undefined)

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
  })
})
