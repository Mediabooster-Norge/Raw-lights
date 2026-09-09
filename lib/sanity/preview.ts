import { createClient, type SanityClient } from 'next-sanity'
import { getSanityConfig } from './client'

export function getPreviewClient(): SanityClient | null {
  const { dataset, projectId, apiVersion } = getSanityConfig()

  if (!projectId) {
    console.warn('[Sanity] Missing NEXT_PUBLIC_SANITY_PROJECT_ID')
    return null
  }

  const token = process.env.SANITY_API_TOKEN

  if (!token) {
    console.warn('[Sanity] No SANITY_API_TOKEN - preview will show published content only')
    return createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: false,
    })
  }

  return createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: false,
    perspective: 'previewDrafts',
    token,
    stega: {
      enabled: true,
      studioUrl: '/studio',
    },
  })
}
