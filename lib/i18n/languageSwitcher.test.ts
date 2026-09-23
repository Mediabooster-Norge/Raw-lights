import assert from 'node:assert/strict'
import test from 'node:test'
import { fallbackLanguageUrls, languageUrlsMatchPath } from './languageSwitcher'

test('keeps the current product while translating the localized route segment', () => {
  assert.deepEqual(fallbackLanguageUrls('/produkter/raw-carbon-9'), {
    nb: '/produkter/raw-carbon-9',
    en: '/en/products/raw-carbon-9',
  })
  assert.deepEqual(fallbackLanguageUrls('/en/products/raw-carbon-9'), {
    nb: '/produkter/raw-carbon-9',
    en: '/en/products/raw-carbon-9',
  })
})

test('keeps the current path instead of falling back to either homepage', () => {
  assert.deepEqual(fallbackLanguageUrls('/om-oss'), {
    nb: '/om-oss',
    en: '/en/om-oss',
  })
})

test('rejects alternate URLs left behind by a preserved layout', () => {
  assert.equal(languageUrlsMatchPath({ nb: '/', en: '/en' }, '/om-oss', 'nb'), false)
  assert.equal(languageUrlsMatchPath({ nb: '/om-oss', en: '/en/about' }, '/om-oss', 'nb'), true)
  assert.equal(languageUrlsMatchPath({ nb: '/om-oss', en: '/en/about' }, '/en/about', 'en'), true)
})
