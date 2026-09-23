import assert from 'node:assert/strict'
import test from 'node:test'
import { formatPostalAddress, mapsEmbedUrl } from './postalAddress'

test('joins street, postal code, city and country for the map query', () => {
  assert.equal(
    formatPostalAddress({
      streetAddress: 'Industriveien 12',
      postalCode: '1540',
      addressLocality: 'Vestby',
      addressCountry: 'NO',
    }),
    'Industriveien 12, 1540 Vestby, NO',
  )
})

test('returns an empty string when the address has no usable parts', () => {
  assert.equal(formatPostalAddress({ addressCountry: 'NO' }), '')
  assert.equal(formatPostalAddress({}), '')
  assert.equal(formatPostalAddress(undefined), '')
})

test('strips hidden encoding characters before building the map query', () => {
  assert.equal(
    formatPostalAddress({
      streetAddress: 'Industriveien 12\u200B',
      postalCode: '1540\u200C',
      addressLocality: 'Vestby',
      addressCountry: 'NO',
    }),
    'Industriveien 12, 1540 Vestby, NO',
  )
})

test('builds a Google Maps embed URL from the address', () => {
  assert.equal(
    mapsEmbedUrl({
      streetAddress: 'Industriveien 12',
      postalCode: '1540',
      addressLocality: 'Vestby',
      addressCountry: 'NO',
    }),
    'https://maps.google.com/maps?q=Industriveien%2012%2C%201540%20Vestby%2C%20NO&z=15&output=embed',
  )
  assert.equal(mapsEmbedUrl({ addressCountry: 'NO' }), null)
})
