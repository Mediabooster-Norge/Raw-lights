import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { revalidateSpec, slugValue } from './revalidateTargets'

describe('slugValue', () => {
  it('reads string and current', () => {
    assert.equal(slugValue('om-oss'), 'om-oss')
    assert.equal(slugValue({ current: 'om-oss' }), 'om-oss')
    assert.equal(slugValue(null), undefined)
  })
})

describe('revalidateSpec', () => {
  it('always refreshes both locale layouts and the sitemap', () => {
    const spec = revalidateSpec({ _type: 'navigation' })
    assert.deepEqual(
      spec.paths.filter((item) => item.type === 'layout').map((item) => item.path).sort(),
      ['/', '/en']
    )
    assert.ok(spec.paths.some((item) => item.path === '/sitemap.xml'))
    assert.ok(spec.tags.includes('navigation'))
  })

  it('revalidates both locales for a page slug', () => {
    const spec = revalidateSpec({ _type: 'page', slug: { current: 'om-oss' } })
    assert.ok(spec.tags.includes('pages'))
    assert.ok(spec.tags.includes('page-om-oss'))
    assert.ok(spec.paths.some((item) => item.path === '/om-oss'))
    assert.ok(spec.paths.some((item) => item.path === '/en/om-oss'))
  })

  it('revalidates archive and single for a post', () => {
    const spec = revalidateSpec({
      _type: 'post',
      slug: 'ballinciaga',
      postTypeSlug: 'artister',
    })
    assert.ok(spec.paths.some((item) => item.path === '/artister/ballinciaga'))
    assert.ok(spec.paths.some((item) => item.path === '/en/artister/ballinciaga'))
    assert.ok(spec.paths.some((item) => item.path === '/artister'))
  })

  it('revalidates the product catalog and localized product route', () => {
    const spec = revalidateSpec({ _type: 'product', slug: 'raw-carbon-9' })
    assert.ok(spec.tags.includes('products'))
    assert.ok(spec.tags.includes('product-raw-carbon-9'))
    assert.ok(spec.paths.some((item) => item.path === '/products'))
    assert.ok(spec.paths.some((item) => item.path === '/en/products/raw-carbon-9'))
  })
})
