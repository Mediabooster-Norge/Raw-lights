function parseJsonLd(value?: string | null): object | null {
  if (!value || !value.trim()) return null

  try {
    const parsed = JSON.parse(value)
    if (parsed === null || typeof parsed !== 'object') return null
    return parsed
  } catch {
    return null
  }
}

type JsonLdProps = {
  jsonLd?: string | null
  fallback?: string | null
}

export function JsonLd({ jsonLd, fallback }: JsonLdProps) {
  const parsed = parseJsonLd(jsonLd) ?? parseJsonLd(fallback)
  if (!parsed) return null

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(parsed).replace(/</g, '\\u003c') }}
    />
  )
}
