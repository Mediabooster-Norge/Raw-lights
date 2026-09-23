import assert from 'node:assert/strict'
import test from 'node:test'
import { productCtas, verneProductUrl } from './verne'

test('resolves the Carbon 9 Verne PDP from SKU', () => {
  assert.deepEqual(verneProductUrl('66101'), {
    sku: '66101',
    url: 'https://verne.no/rawlights/66101/raw-carbon-fjernlys-9-m-gult-hvitt-parklys-13260-lumen-170w',
  })
})

test('fills missing SKUs from known slugs', () => {
  assert.equal(verneProductUrl(null, 'raw-led-work-light-80w').sku, '11802')
  assert.equal(verneProductUrl(null, 'raw-novo-pro-no-glare').sku, '66444')
})

test('builds Carbon-style CTAs per language', () => {
  const url = 'https://verne.no/rawlights/11803/raw-duo-arbeidslys-m-varsellys-103mm-5220-lm-45w'
  assert.deepEqual(productCtas('nb', url), {
    primaryCta: {
      _type: 'link',
      type: 'external',
      label: 'Kjøp',
      externalUrl: url,
      openInNewTab: true,
    },
    secondaryCta: {
      _type: 'link',
      type: 'internal',
      label: 'Kontakt oss',
      internalLink: { _type: 'reference', _ref: 'raw.page.contact', _weak: true },
      openInNewTab: false,
    },
  })
  assert.equal(productCtas('en', url).primaryCta.label, 'Buy')
  assert.equal(productCtas('en', url).secondaryCta.internalLink._ref, 'i18n.en.raw.page.contact')
})
