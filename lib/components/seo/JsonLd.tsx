function parseJsonLd(value?: string | object | null): object | null {
  if (!value) return null
  if (typeof value === 'object') return value
  if (!value.trim()) return null

  try {
    const parsed = JSON.parse(value)
    if (parsed === null || typeof parsed !== 'object') return null
    return parsed
  } catch {
    return null
  }
}

type JsonLdProps = {
  data?: object | string | null
  jsonLd?: string | null
  fallback?: string | object | null
}

export function JsonLd({ data, jsonLd, fallback }: JsonLdProps) {
  const parsed = parseJsonLd(data) ?? parseJsonLd(jsonLd) ?? parseJsonLd(fallback)
  if (!parsed) return null

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(parsed).replace(/</g, '\\u003c') }}
    />
  )
}
