type JsonValue = null | boolean | number | string | JsonValue[] | { [key: string]: JsonValue }

export type TranslationItem = { path: string; text: string }

const TRANSLATABLE_FIELDS = new Set([
  'title', 'subtitle', 'description', 'excerpt', 'descriptionHeading', 'heading', 'headingLines',
  'text', 'eyebrow', 'chapter', 'chapterTitle', 'aside', 'kicker', 'label', 'placeholder',
  'submitLabel', 'successMessage', 'question', 'answer', 'metaTitle', 'metaDescription', 'alt',
  'archiveTitle', 'archiveDescription', 'name',
])
const TECHNICAL_FIELDS = new Set([
  '_id', '_key', '_type', '_ref', '_weak', 'language', 'slug', 'sku', 'mpn', 'gtin', 'price',
  'currency', 'availability', 'value', 'url', 'externalUrl', 'email', 'phone', 'telephone',
  'notifyEmail', 'asset', 'fieldType', 'category', 'visibility', 'order', 'canonicalUrl',
])

function escapePath(part: string | number) {
  return String(part).replace(/~/g, '~0').replace(/\//g, '~1')
}

function unescapePath(part: string) {
  return part.replace(/~1/g, '/').replace(/~0/g, '~')
}

function isPortableTextSpan(value: unknown): value is { _type?: string; text?: string } {
  return Boolean(value && typeof value === 'object' && (value as { _type?: string })._type === 'span')
}

export function collectTranslatableFields(document: Record<string, JsonValue>): TranslationItem[] {
  const fields: TranslationItem[] = []
  const walk = (value: JsonValue, path: string, parentKey?: string) => {
    if (typeof value === 'string') {
      if ((parentKey && TRANSLATABLE_FIELDS.has(parentKey)) || isPortableTextSpan(value)) {
        if (value.trim()) fields.push({ path, text: value })
      }
      return
    }
    if (!value || typeof value !== 'object') return
    if (Array.isArray(value)) {
      value.forEach((item, index) => walk(item, `${path}/${index}`, parentKey))
      return
    }
    for (const [key, child] of Object.entries(value)) {
      if (TECHNICAL_FIELDS.has(key)) continue
      walk(child, `${path}/${escapePath(key)}`, key)
    }
  }
  walk(document, '')
  return fields
}

export function applyTranslations<T extends Record<string, JsonValue>>(document: T, translations: TranslationItem[]): T {
  const copy = structuredClone(document) as T
  for (const { path, text } of translations) {
    const parts = path.split('/').slice(1).map(unescapePath)
    let target: JsonValue | undefined = copy
    for (const part of parts.slice(0, -1)) {
      if (!target || typeof target !== 'object') { target = undefined; break }
      target = Array.isArray(target) ? target[Number(part)] : target[part]
    }
    const key = parts.at(-1)
    if (!target || typeof target !== 'object' || key === undefined) continue
    if (Array.isArray(target)) {
      const index = Number(key)
      if (typeof target[index] === 'string') target[index] = text
    } else if (typeof target[key] === 'string') {
      target[key] = text
    }
  }
  return copy
}

export function englishDraftId(sourceId: string) {
  return `i18n.en.${sourceId.replace(/^drafts\./, '').replace(/[^a-zA-Z0-9_.-]/g, '-')}`
}

export function createEnglishDraft(source: Record<string, JsonValue>, translated: TranslationItem[]) {
  const translatedDocument = applyTranslations(source, translated)
  const target = structuredClone(translatedDocument) as Record<string, JsonValue>
  delete target._rev
  delete target._createdAt
  delete target._updatedAt
  target._id = `drafts.${englishDraftId(String(source._id))}`
  target.language = 'en'
  // Model names and product URLs are intentionally shared by language.
  if (source._type === 'product') {
    target.title = source.title
    target.slug = source.slug
  }
  return target
}
