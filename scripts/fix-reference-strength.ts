/**
 * Aligns stored content references with `weak: true` in the Studio schema.
 * Image/file assets are left strong. Run:
 *   npx tsx --env-file=.env.local scripts/fix-reference-strength.ts
 *   npx tsx --env-file=.env.local scripts/fix-reference-strength.ts --apply
 */
import { createClient } from 'next-sanity'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const token = process.env.SANITY_API_TOKEN

if (!projectId || !token) {
  throw new Error('NEXT_PUBLIC_SANITY_PROJECT_ID and SANITY_API_TOKEN must be set.')
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: '2024-01-01',
  useCdn: false,
  perspective: 'raw',
})

const ASSET_REF = /^(image-|file-)/
const DOCUMENT_TYPES = [
  'page',
  'product',
  'post',
  'postType',
  'navigation',
  'form',
  'globalSettings',
  'translationJob',
  'translation.metadata',
]

type SanityRecord = Record<string, unknown>

export function weakenContentReferences(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(weakenContentReferences)
  if (!value || typeof value !== 'object') return value

  const record = value as SanityRecord
  if (record._type === 'reference' && typeof record._ref === 'string' && !ASSET_REF.test(record._ref)) {
    return { ...record, _weak: true }
  }

  const next: SanityRecord = {}
  for (const [key, child] of Object.entries(record)) {
    next[key] = weakenContentReferences(child)
  }
  return next
}

function collectRefs(value: unknown, path = ''): Array<{ path: string; ref: string; weak: boolean }> {
  if (!value || typeof value !== 'object') return []
  if (Array.isArray(value)) {
    return value.flatMap((item, index) => collectRefs(item, `${path}[${index}]`))
  }
  const record = value as SanityRecord
  if (record._type === 'reference' && typeof record._ref === 'string' && !ASSET_REF.test(record._ref)) {
    return [{ path, ref: record._ref, weak: record._weak === true }]
  }
  return Object.entries(record).flatMap(([key, child]) => {
    if (key.startsWith('_')) return []
    return collectRefs(child, path ? `${path}.${key}` : key)
  })
}

async function main() {
  const apply = process.argv.includes('--apply')
  const documents = await client.fetch<Array<SanityRecord & { _id: string; _type: string; _rev?: string }>>(
    `*[_type in $types]`,
    { types: DOCUMENT_TYPES },
  )

  const changed = documents.flatMap((document) => {
    const next = weakenContentReferences(document) as SanityRecord & { _id: string; _type: string }
    delete next._rev
    const before = collectRefs(document).filter((item) => !item.weak)
    if (before.length === 0) return []
    return [{ id: document._id, type: document._type, refs: before, next }]
  })

  const refCount = changed.reduce((sum, document) => sum + document.refs.length, 0)
  console.log(JSON.stringify({
    mode: apply ? 'apply' : 'dry-run',
    documents: changed.length,
    references: refCount,
    byType: changed.reduce<Record<string, number>>((counts, document) => {
      counts[document.type] = (counts[document.type] || 0) + 1
      return counts
    }, {}),
    sample: changed.slice(0, 8).map((document) => ({
      id: document.id,
      refs: document.refs,
    })),
  }, null, 2))

  if (!apply || changed.length === 0) return

  const transaction = client.transaction()
  for (const document of changed) {
    transaction.createOrReplace(document.next)
  }
  await transaction.commit({ visibility: 'sync' })
  console.log(`Updated ${changed.length} documents (${refCount} references).`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
