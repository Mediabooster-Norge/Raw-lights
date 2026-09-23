import assert from 'node:assert/strict'
import test from 'node:test'
import type { SlugIsUniqueValidator, SlugValidationContext } from 'sanity'
import productSchema from '../site/product'

type SlugField = {
  name?: string
  options?: {
    isUnique?: SlugIsUniqueValidator
  }
}

function productSlugValidator() {
  const slugField = productSchema.fields.find((field) => field.name === 'slug') as SlugField | undefined
  const isUnique = slugField?.options?.isUnique
  assert.equal(typeof isUnique, 'function')
  if (!isUnique) throw new Error('Product slug is missing localized uniqueness validation')
  return isUnique
}

function validationContext(
  language: 'nb' | 'en',
  count: number,
  capture: { query?: string; params?: Record<string, string> }
) {
  return {
    document: {
      _id: `drafts.raw.product.${language}`,
      _type: 'product',
      language,
    },
    path: ['slug'],
    getClient: () => ({
      withConfig: () => ({
        fetch: async (query: string, params: Record<string, string>) => {
          capture.query = query
          capture.params = params
          return count
        },
      }),
    }),
    defaultIsUnique: async () => false,
  } as unknown as SlugValidationContext
}

test('product slug overrides Sanity global uniqueness with localized uniqueness', () => {
  productSlugValidator()
})

test('the same product slug is allowed in a different language', async () => {
  const capture: { query?: string; params?: Record<string, string> } = {}
  const isUnique = await productSlugValidator()(
    'raw-carbon-9',
    validationContext('en', 0, capture)
  )

  assert.equal(isUnique, true)
  assert.equal(capture.params?.language, 'en')
  assert.match(capture.query ?? '', /language == \$language/)
  assert.doesNotMatch(capture.query ?? '', /!defined\(language\)/)
})

test('a duplicate product slug in the same language is rejected', async () => {
  const capture: { query?: string; params?: Record<string, string> } = {}
  const isUnique = await productSlugValidator()(
    'raw-carbon-9',
    validationContext('nb', 1, capture)
  )

  assert.equal(isUnique, false)
  assert.match(capture.query ?? '', /!defined\(language\) \|\| language == \$language/)
})
