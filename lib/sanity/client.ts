import { createClient, type SanityClient } from 'next-sanity'

export function getSanityConfig() {
  return {
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? '',
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    apiVersion: '2024-01-01' as const,
  }
}

export function getClient(): SanityClient | null {
  const { dataset, projectId, apiVersion } = getSanityConfig()

  if (!projectId) {
    console.warn('[Sanity] Missing NEXT_PUBLIC_SANITY_PROJECT_ID')
    return null
  }

  return createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: true,
  })
}
