export const jsonLdPostTypes = [
  { title: 'Ingen', value: 'None' },
  { title: 'Article', value: 'Article' },
  { title: 'NewsArticle', value: 'NewsArticle' },
  { title: 'BlogPosting', value: 'BlogPosting' },
] as const

export const jsonLdPostTypeOverrides = [
  { title: 'Arv fra posttype', value: 'inherit' },
  ...jsonLdPostTypes,
] as const

export const jsonLdPageTypes = [
  { title: 'Automatisk (anbefalt)', value: 'auto' },
  { title: 'WebPage', value: 'WebPage' },
  { title: 'AboutPage', value: 'AboutPage' },
  { title: 'ContactPage', value: 'ContactPage' },
  { title: 'CollectionPage', value: 'CollectionPage' },
  { title: 'FAQPage', value: 'FAQPage' },
] as const

export type JsonLdPostType = (typeof jsonLdPostTypes)[number]['value']
export type JsonLdPageType = (typeof jsonLdPageTypes)[number]['value']

export function resolvePostJsonLdType(
  inherited?: string | null,
  override?: string | null
): string | null {
  const chosen =
    override && override !== 'inherit' ? override : inherited
  if (!chosen || chosen === 'None') return null
  return chosen
}
