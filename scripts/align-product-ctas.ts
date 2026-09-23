/**
 * Sets every product CTA to the RAW CARBON 9 pattern:
 * primary = Buy/Kjøp on the matching verne.no product page
 * secondary = Contact us/Kontakt oss on the locale contact page
 *
 *   npx tsx --env-file=.env.local scripts/align-product-ctas.ts
 *   npx tsx --env-file=.env.local scripts/align-product-ctas.ts --apply
 */
import { createClient } from 'next-sanity'
import { productCtas, verneProductUrl } from '../lib/products/verne'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const token = process.env.SANITY_API_TOKEN

if (!projectId || !token) throw new Error('NEXT_PUBLIC_SANITY_PROJECT_ID and SANITY_API_TOKEN must be set.')

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: '2024-01-01',
  useCdn: false,
  perspective: 'raw',
})

type ProductDoc = {
  _id: string
  language?: string
  sku?: string | null
  slug?: string | null
  title?: string
}

async function main() {
  const apply = process.argv.includes('--apply')
  const documents = await client.fetch<ProductDoc[]>(
    `*[_type == "product"]{ _id, language, sku, "slug": slug.current, title }`,
  )

  const updates = documents.map((document) => {
    const resolved = verneProductUrl(document.sku, document.slug)
    if (!resolved.url || !document.language) {
      return { id: document._id, title: document.title, skipped: true as const }
    }
    const patch: Record<string, unknown> = { ...productCtas(document.language, resolved.url) }
    if (!document.sku && resolved.sku) patch.sku = resolved.sku
    return {
      id: document._id,
      language: document.language,
      sku: resolved.sku,
      url: resolved.url,
      skipped: false as const,
      patch,
    }
  })

  const ready = updates.filter((item) => !item.skipped)
  console.log(JSON.stringify({
    mode: apply ? 'apply' : 'dry-run',
    updateCount: ready.length,
    skipped: updates.filter((item) => item.skipped).map((item) => item.id),
    sample: ready.map(({ id, language, sku, url }) => ({ id, language, sku, url })),
  }, null, 2))

  if (!apply || ready.length === 0) return

  const transaction = client.transaction()
  for (const item of ready) {
    if (item.skipped) continue
    transaction.patch(item.id, { set: item.patch })
  }
  await transaction.commit({ visibility: 'sync' })
  console.log(`Updated ${ready.length} product documents.`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
