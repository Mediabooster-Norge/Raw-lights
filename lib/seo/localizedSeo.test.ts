import assert from 'node:assert/strict'
import test from 'node:test'
import { localizedSeo } from './localizedSeo'

const legacySeo = { metaTitle: 'Legacy title' }
const norwegianSeo = { metaTitle: 'Norsk tittel' }
const englishSeo = { metaTitle: 'English title' }

test('uses explicit Norwegian global SEO before legacy settings', () => {
  assert.equal(localizedSeo({ seoNb: norwegianSeo, seo: legacySeo }, 'nb'), norwegianSeo)
})

test('uses explicit English global SEO before legacy settings', () => {
  assert.equal(localizedSeo({ seoEn: englishSeo, seo: legacySeo }, 'en'), englishSeo)
})

test('uses historical localized SEO and then the legacy fallback', () => {
  assert.equal(
    localizedSeo({ localizedSeo: [{ language: 'en', seo: englishSeo }], seo: legacySeo }, 'en'),
    englishSeo,
  )
  assert.equal(localizedSeo({ seo: legacySeo }, 'nb'), legacySeo)
})
