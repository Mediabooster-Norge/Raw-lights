/** Promote the verified English translation drafts created by the migration.
 * Run without --apply to inspect. The explicit confirmation prevents an
 * accidental bulk publish.
 */
import { createClient } from 'next-sanity'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const token = process.env.SANITY_API_TOKEN
if (!projectId || !token) throw new Error('Missing Sanity project configuration or SANITY_API_TOKEN.')

const client = createClient({ projectId, dataset, token, apiVersion: '2024-01-01', useCdn: false, perspective: 'raw' })
const apply = process.argv.includes('--apply')
if (apply && process.env.CONFIRM_ENGLISH_PUBLISH !== 'rawlights-en') {
  throw new Error('Publishing is locked. Set CONFIRM_ENGLISH_PUBLISH=rawlights-en to continue.')
}

async function main() {
  const drafts = await client.fetch<Record<string, unknown>[]>(
    '*[_id match "drafts.i18n.en.*" && language == "en"] | order(_type, _id)'
  )
  console.log(JSON.stringify({ mode: apply ? 'publishing' : 'report', count: drafts.length, documents: drafts.map(({ _id, _type, title, slug }) => ({ _id, _type, title, slug })) }, null, 2))

  if (apply && drafts.length) {
    let transaction = client.transaction()
    for (const draft of drafts) {
      const published = structuredClone(draft)
      published._id = String(draft._id).replace(/^drafts\./, '')
      delete published._rev
      delete published._createdAt
      delete published._updatedAt
      transaction = transaction.createOrReplace(published as { _id: string; _type: string })
    }
    await transaction.commit()
    console.log(JSON.stringify({ published: drafts.length }))
  }
}

main().catch((error) => { console.error(error); process.exitCode = 1 })
