export const jsonLdPostTypes = [
  { title: 'Ingen', value: 'None' },
  { title: 'Article', value: 'Article' },
  { title: 'NewsArticle', value: 'NewsArticle' },
  { title: 'BlogPosting', value: 'BlogPosting' },
  { title: 'Person', value: 'Person' },
  { title: 'ProfilePage', value: 'ProfilePage' },
  { title: 'Organization', value: 'Organization' },
  { title: 'LocalBusiness', value: 'LocalBusiness' },
  { title: 'Event', value: 'Event' },
  { title: 'Place', value: 'Place' },
  { title: 'Product', value: 'Product' },
  { title: 'Service', value: 'Service' },
  { title: 'Offer', value: 'Offer' },
  { title: 'MusicGroup', value: 'MusicGroup' },
  { title: 'PerformingGroup', value: 'PerformingGroup' },
  { title: 'MusicAlbum', value: 'MusicAlbum' },
  { title: 'MusicRecording', value: 'MusicRecording' },
  { title: 'CreativeWork', value: 'CreativeWork' },
  { title: 'Review', value: 'Review' },
  { title: 'VideoObject', value: 'VideoObject' },
  { title: 'ImageObject', value: 'ImageObject' },
  { title: 'Book', value: 'Book' },
  { title: 'Movie', value: 'Movie' },
  { title: 'Course', value: 'Course' },
  { title: 'HowTo', value: 'HowTo' },
  { title: 'Recipe', value: 'Recipe' },
  { title: 'SoftwareApplication', value: 'SoftwareApplication' },
  { title: 'JobPosting', value: 'JobPosting' },
  { title: 'Dataset', value: 'Dataset' },
] as const

export const jsonLdPostTypeOverrides = [
  { title: 'Arv fra posttype', value: 'inherit' },
  ...jsonLdPostTypes,
] as const

export const jsonLdPageTypes = [
  { title: 'WebPage', value: 'WebPage' },
  { title: 'AboutPage', value: 'AboutPage' },
  { title: 'ContactPage', value: 'ContactPage' },
  { title: 'FAQPage', value: 'FAQPage' },
  { title: 'CollectionPage', value: 'CollectionPage' },
  { title: 'ItemPage', value: 'ItemPage' },
  { title: 'ProfilePage', value: 'ProfilePage' },
  { title: 'SearchResultsPage', value: 'SearchResultsPage' },
  { title: 'QAPage', value: 'QAPage' },
  { title: 'CheckoutPage', value: 'CheckoutPage' },
  { title: 'Event', value: 'Event' },
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
