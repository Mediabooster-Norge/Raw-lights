import { NextRequest, NextResponse } from 'next/server'
import { timingSafeEqual } from 'node:crypto'
import { getTokenClient } from '@/lib/sanity/client'
import { collectTranslatableFields, createEnglishDraft, englishDraftId } from '@/lib/translation/document'
import { translateNorwegianToEnglish } from '@/lib/translation/openai'

export const runtime = 'nodejs'

type TranslationJob = {
  _id: string
  sourceDocument?: { _ref?: string }
  status?: string
}

function secretMatches(received: string | null, expected: string | undefined) {
  if (!received || !expected) return false
  const left = Buffer.from(received)
  const right = Buffer.from(expected)
  return left.length === right.length && timingSafeEqual(left, right)
}

/**
 * Sanity webhook endpoint. Configure the webhook to POST a projection containing
 * `{ "_id": _id }` and send SANITY_TRANSLATION_WEBHOOK_SECRET as x-translation-secret.
 */
export async function POST(request: NextRequest) {
  if (!secretMatches(request.headers.get('x-translation-secret'), process.env.SANITY_TRANSLATION_WEBHOOK_SECRET)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const payload = await request.json().catch(() => null) as { _id?: string } | null
  const jobId = payload?._id
  if (!jobId || !jobId.startsWith('translation.job.')) return NextResponse.json({ error: 'Invalid job' }, { status: 400 })

  const client = getTokenClient()
  if (!client) return NextResponse.json({ error: 'SANITY_API_TOKEN mangler på serveren.' }, { status: 503 })

  const job = await client.fetch<TranslationJob | null>('*[_id == $id][0]{_id, sourceDocument, status}', { id: jobId })
  if (!job?.sourceDocument?._ref) return NextResponse.json({ error: 'Oversettelsesjobb ble ikke funnet.' }, { status: 404 })
  if (job.status === 'completed' || job.status === 'existing_translation' || job.status === 'processing') return NextResponse.json({ status: job.status })

  const sourceId = job.sourceDocument._ref.replace(/^drafts\./, '')
  const targetId = englishDraftId(sourceId)
  const targetDraftId = `drafts.${targetId}`
  try {
    await client.patch(jobId).set({ status: 'processing', error: undefined }).commit()
    const [source, existingTarget, metadata] = await Promise.all([
      client.fetch<Record<string, unknown> | null>('*[_id == $id][0]', { id: sourceId }),
      client.fetch<Record<string, unknown> | null>('*[_id in [$draft, $published]][0]', { draft: `drafts.${targetId}`, published: targetId }),
      client.fetch<{ _id: string; translations?: { _key?: string; language?: string; value?: { _ref?: string } }[] } | null>('*[_type == "translation.metadata" && references($id)][0]', { id: sourceId }),
    ])
    if (!source) throw new Error('Kildedokumentet ble ikke funnet.')
    if (existingTarget) {
      await client.patch(jobId).set({ status: 'existing_translation', targetDocument: { _type: 'reference', _ref: String(existingTarget._id) }, completedAt: new Date().toISOString() }).commit()
      return NextResponse.json({ status: 'existing_translation', targetId })
    }
    if (source.language !== 'nb') throw new Error('Bare norske hoveddokumenter kan oversettes til engelsk.')

    const items = collectTranslatableFields(source as Parameters<typeof collectTranslatableFields>[0])
    const translations = await translateNorwegianToEnglish(items)
    const target = createEnglishDraft(source as Parameters<typeof createEnglishDraft>[0], translations)
    const metadataId = metadata?._id ?? `translation.metadata.${sourceId.replace(/[^a-zA-Z0-9_.-]/g, '-')}`
    const retained = (metadata?.translations ?? []).filter((entry) => entry.language !== 'nb' && entry.language !== 'en')
    const translationMetadata = {
      _id: metadataId,
      _type: 'translation.metadata',
      translations: [
        ...retained,
        { _key: 'nb', language: 'nb', value: { _type: 'reference', _ref: sourceId, _weak: true } },
        { _key: 'en', language: 'en', value: { _type: 'reference', _ref: targetId, _weak: true } },
      ],
    }

    // A draft has a different document id from its eventual published version.
    // Create it first so the job's strong reference always resolves.
    await client.create(target as never)
    await client.transaction()
      .createOrReplace(translationMetadata as never)
      .patch(jobId, { set: { status: 'completed', targetDocument: { _type: 'reference', _ref: targetDraftId }, completedAt: new Date().toISOString() } })
      .commit()
    return NextResponse.json({ status: 'completed', targetId })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Ukjent oversettelsesfeil.'
    await client.patch(jobId).unset(['targetDocument']).set({ status: 'failed', error: message }).commit().catch(() => undefined)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
