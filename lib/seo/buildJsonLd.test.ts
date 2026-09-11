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

test('posts always retain WebPage and BreadcrumbList when no article type is selected', () => {
  const data = buildPostJsonLd({
    type: 'None',
    title: 'A regular update',
    url: 'https://example.com/updates/example',
    siteUrl: 'https://example.com',
    locale: 'en',
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
