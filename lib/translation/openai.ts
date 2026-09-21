import type { TranslationItem } from './document'

const responseSchema = {
  type: 'object',
  additionalProperties: false,
  required: ['translations'],
  properties: {
    translations: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['path', 'text'],
        properties: { path: { type: 'string' }, text: { type: 'string' } },
      },
    },
  },
} as const

export async function translateItems(items: TranslationItem[], sourceLanguage: string, targetLanguage: string) {
  const key = process.env.OPENAI_API_KEY
  if (!key) throw new Error('OPENAI_API_KEY mangler på serveren.')
  if (!items.length) return []
  const response = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: process.env.OPENAI_TRANSLATION_MODEL || 'gpt-5-mini',
      store: false,
      input: [
        { role: 'system', content: `Translate the provided ${sourceLanguage} website copy into natural ${targetLanguage}. Return every path exactly once. Preserve product names, SKUs, model numbers, URLs, email addresses, measurements, HTML-like tokens, and punctuation where meaningful. Do not add editorial commentary.` },
        { role: 'user', content: JSON.stringify({ translations: items }) },
      ],
      text: { format: { type: 'json_schema', name: 'website_translation', strict: true, schema: responseSchema } },
    }),
  })
  if (!response.ok) throw new Error(`OpenAI translation failed (${response.status}).`)
  let body = await response.json() as {
    id?: string
    status?: string
    output_text?: string
    output?: { content?: { type?: string; text?: string }[] }[]
  }
  // Larger Portable Text documents may be accepted first and completed moments
  // later. Polling their response id keeps the migration deterministic.
  for (let attempt = 0; body.status === 'in_progress' || body.status === 'queued'; attempt += 1) {
    if (!body.id || attempt >= 60) throw new Error('OpenAI translation did not complete in time.')
    await new Promise((resolve) => setTimeout(resolve, 1000))
    const pending = await fetch(`https://api.openai.com/v1/responses/${body.id}`, {
      headers: { Authorization: `Bearer ${key}` },
    })
    if (!pending.ok) throw new Error(`OpenAI translation polling failed (${pending.status}).`)
    body = await pending.json() as typeof body
  }
  if (body.status && body.status !== 'completed') throw new Error(`OpenAI translation ended with status ${body.status}.`)
  const outputText = body.output_text ?? body.output
    ?.flatMap((item) => item.content ?? [])
    .find((item) => item.type === 'output_text' && typeof item.text === 'string')
    ?.text
  if (!outputText) throw new Error('OpenAI returned no structured translation.')
  const parsed = JSON.parse(outputText) as { translations?: TranslationItem[] }
  if (!Array.isArray(parsed.translations)) throw new Error('OpenAI returned an invalid translation payload.')
  const expected = new Set(items.map((item) => item.path))
  if (parsed.translations.length !== items.length || parsed.translations.some((item) => !expected.has(item.path) || typeof item.text !== 'string')) {
    throw new Error('OpenAI returned an incomplete translation payload.')
  }
  return parsed.translations
}

export function translateNorwegianToEnglish(items: TranslationItem[]) {
  return translateItems(items, 'Norwegian', 'English')
}
