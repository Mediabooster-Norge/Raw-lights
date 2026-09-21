/**
 * Read-only migration audit for the Norwegian-main-language launch.
 *
 * This intentionally does not write to Sanity. It exposes the exact mapping,
 * missing language values, references, and built-in redirects that must be
 * checked before the separate, confirmed migration write is enabled.
 *
 * Run: npx tsx scripts/migrate-raw-to-norwegian.ts
 */
import { createClient } from 'next-sanity'
import { collectTranslatableFields, applyTranslations, englishDraftId } from '../lib/translation/document'
import { translateItems } from '../lib/translation/openai'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const token = process.env.SANITY_API_TOKEN

if (!projectId || !token) {
  throw new Error('NEXT_PUBLIC_SANITY_PROJECT_ID og SANITY_API_TOKEN må være satt for migreringsrapporten.')
}

const client = createClient({ projectId, dataset, token, apiVersion: '2024-01-01', useCdn: false, perspective: 'raw' })
const translatedTypes = ['page', 'product', 'post', 'postType', 'navigation', 'form']
const norwegianPageSlugs: Record<string, string> = {
  home: 'forside',
  about: 'om-oss',
  products: 'produkter',
  contact: 'kontakt',
  privacy: 'personvern',
}

type Document = { _id: string; _type: string; language?: string; title?: string; slug?: string; references?: string[] }
type RawDocument = Record<string, any> & { _id: string; _type: string }

async function main() {
const apply = process.argv.includes('--apply')
if (apply && process.env.CONFIRM_RAW_MIGRATION !== 'rawlights-no') {
  throw new Error('Skriving er sperret. Sett CONFIRM_RAW_MIGRATION=rawlights-no etter at rapporten er godkjent.')
}
const documents = await client.fetch<Document[]>(
  `*[_type in $types] | order(_type, _id) {
    _id, _type, language, title, "slug": slug.current
  }`,
  { types: translatedTypes },
)

const report = documents.map((document) => {
  const englishId = `i18n.en.${document._id.replace(/[^a-zA-Z0-9_.-]/g, '-')}`
  const norwegianSlug = document._type === 'page'
    ? norwegianPageSlugs[document.slug || ''] || document.slug
    : document.slug
  return {
    sourceId: document._id,
    sourceType: document._type,
    currentLanguage: document.language || '(missing)',
    norwegianMain: {
      id: document._id,
      language: 'nb',
      slug: norwegianSlug,
      action: 'translate visible content from current source',
    },
    englishDraft: {
      id: `drafts.${englishId}`,
      language: 'en',
      slug: document.slug,
      action: 'copy current English content as an unpublished linked draft',
    },
    referencesToRewireForEnglish: document.references || [],
  }
})

const issues = report.flatMap((entry) => {
  const found: string[] = []
  if (entry.currentLanguage !== 'en') found.push(`${entry.sourceId}: expected current source language en, found ${entry.currentLanguage}`)
  if (entry.sourceType === 'page' && !entry.norwegianMain.slug) found.push(`${entry.sourceId}: page has no slug`)
  return found
})

const reportOutput = {
  generatedAt: new Date().toISOString(),
  mode: apply ? 'preflight-for-apply' : 'read-only',
  documentCount: report.length,
  byType: Object.fromEntries(translatedTypes.map((type) => [type, report.filter((entry) => entry.sourceType === type).length])),
  builtInRedirects: [
    ['/about', '/om-oss'], ['/contact', '/kontakt'], ['/privacy', '/personvern'],
    ['/products', '/produkter'], ['/products/:slug', '/produkter/:slug'], ['/en/home', '/en'],
  ],
  issues,
  documents: report,
}
console.log(JSON.stringify(apply ? {
  generatedAt: reportOutput.generatedAt,
  mode: reportOutput.mode,
  documentCount: reportOutput.documentCount,
  byType: reportOutput.byType,
  issues: reportOutput.issues,
} : reportOutput, null, 2))

if (!apply) return

const sourceDocuments = await client.fetch<RawDocument[]>('*[_type in $types]', { types: translatedTypes })
const idMap = new Map(sourceDocuments.map((document) => [document._id, englishDraftId(document._id)]))

const rewireEnglishReferences = (value: unknown): unknown => {
  if (Array.isArray(value)) return value.map(rewireEnglishReferences)
  if (!value || typeof value !== 'object') return value
  const record = value as Record<string, unknown>
  const next: Record<string, unknown> = {}
  for (const [key, child] of Object.entries(record)) next[key] = rewireEnglishReferences(child)
  if (typeof next._ref === 'string' && idMap.has(next._ref)) {
    next._ref = idMap.get(next._ref)!
    // English targets are intentionally drafts at this stage, so the reference
    // must not require a published target before editorial review is complete.
    next._weak = true
  }
  return next
}

const englishDrafts: RawDocument[] = []
const norwegianDocuments: RawDocument[] = []
const translatedPairs = await Promise.all(sourceDocuments.map(async (source) => {
  const translations = await translateItems(
    collectTranslatableFields(source),
    'English',
    'Norwegian Bokmål',
  )
  const norwegian = applyTranslations(source, translations) as RawDocument
  delete norwegian._rev
  delete norwegian._createdAt
  delete norwegian._updatedAt
  norwegian.language = 'nb'
  if (norwegian._type === 'page' && norwegian.slug?.current) {
    norwegian.slug = { ...norwegian.slug, current: norwegianPageSlugs[norwegian.slug.current] || norwegian.slug.current }
  }
  // Product model names and URLs are shared across both languages by decision.
  if (norwegian._type === 'product') {
    norwegian.title = source.title
    norwegian.slug = source.slug
  }
  const english = structuredClone(source) as RawDocument
  english._id = `drafts.${idMap.get(source._id)}`
  english.language = 'en'
  delete english._rev
  delete english._createdAt
  delete english._updatedAt
  return { norwegian, english: rewireEnglishReferences(english) as RawDocument }
}))
for (const pair of translatedPairs) {
  norwegianDocuments.push(pair.norwegian)
  englishDrafts.push(pair.english)
}

const existingMetadata = await client.fetch<{ _id: string }[]>('*[_type == "translation.metadata" && references($ids)]{_id}', { ids: sourceDocuments.map((document) => document._id) })
if (existingMetadata.length) throw new Error('Eksisterende oversettelsesmetadata ble funnet. Avbryter for å unngå duplikater; gjennomgå metadata før ny migrering.')
const existingEnglish = await client.fetch<{ _id: string }[]>('*[_id in $ids]{_id}', { ids: englishDrafts.flatMap((document) => [document._id, document._id.replace(/^drafts\./, '')]) })
if (existingEnglish.length) throw new Error('Eksisterende engelske kladder ble funnet. Avbryter for å unngå overskriving eller duplikater.')

let transaction = client.transaction()
for (const norwegian of norwegianDocuments) transaction = transaction.createOrReplace(norwegian)
for (const english of englishDrafts) transaction = transaction.create(english)
for (const source of sourceDocuments) {
  const englishId = idMap.get(source._id)!
  transaction = transaction.create({
    _id: `translation.metadata.${source._id.replace(/[^a-zA-Z0-9_.-]/g, '-')}`,
    _type: 'translation.metadata',
    translations: [
      { _key: 'nb', language: 'nb', value: { _type: 'reference', _ref: source._id, _weak: true } },
      { _key: 'en', language: 'en', value: { _type: 'reference', _ref: englishId, _weak: true } },
    ],
  } as any)
}

const settings = await client.fetch<RawDocument | null>('*[_id == "globalSettings"][0]')
if (settings) {
  const globalTranslations = await translateItems(collectTranslatableFields(settings), 'English', 'Norwegian Bokmål')
  const norwegianSeo = (applyTranslations(settings, globalTranslations) as RawDocument).seo
  transaction = transaction.patch('globalSettings', {
    set: {
      localizedSeo: [
        { _key: 'nb', language: 'nb', seo: norwegianSeo },
        { _key: 'en', language: 'en', seo: settings.seo },
      ],
    },
  })
}
await transaction.commit()
console.log(JSON.stringify({ mode: 'applied', migrated: norwegianDocuments.length, englishDrafts: englishDrafts.length }, null, 2))
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exitCode = 1
})
