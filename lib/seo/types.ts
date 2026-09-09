export const jsonLdPostTypes = [
  { title: 'Ingen', value: 'None' },
  { title: 'Article', value: 'Article' },
  { title: 'NewsArticle', value: 'NewsArticle' },
  { title: 'Person', value: 'Person' },
  { title: 'Organization', value: 'Organization' },
] as const

export const jsonLdPageTypes = [
  { title: 'WebPage', value: 'WebPage' },
  { title: 'AboutPage', value: 'AboutPage' },
  { title: 'ContactPage', value: 'ContactPage' },
  { title: 'FAQPage', value: 'FAQPage' },
] as const

export type JsonLdPostType = (typeof jsonLdPostTypes)[number]['value']
export type JsonLdPageType = (typeof jsonLdPageTypes)[number]['value']
