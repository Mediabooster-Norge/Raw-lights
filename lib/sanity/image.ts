import { createImageUrlBuilder } from '@sanity/image-url'
import { createClient } from 'next-sanity'
import { getSanityConfig } from './client'

const { projectId, dataset, apiVersion } = getSanityConfig()

const client = projectId
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: true
    })
  : null

const builder = client ? createImageUrlBuilder(client) : null

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
