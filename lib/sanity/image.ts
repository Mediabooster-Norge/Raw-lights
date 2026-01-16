import imageUrlBuilder from '@sanity/image-url'
import { createClient } from 'next-sanity'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID

const client = projectId
  ? createClient({
      projectId,
      dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
      apiVersion: '2024-01-01',
      useCdn: true
    })
  : null

const builder = client ? imageUrlBuilder(client) : null

export function urlFor(source: any) {
  if (!builder) {
    return {
      width: () => ({ auto: () => ({ url: () => '' }) }),
      auto: () => ({ url: () => '' }),
      url: () => ''
    }
  }
  return builder.image(source)
}
