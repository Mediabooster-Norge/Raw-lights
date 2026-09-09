import { createClient, type SanityClient } from 'next-sanity'

function firstEnv(...keys: string[]) {
  for (const key of keys) {
    const value = process.env[key]?.trim()
    if (value) return value
  }
  return ''
}

export function getSanityConfig() {
  return {
    projectId: firstEnv(
      'NEXT_PUBLIC_SANITY_PROJECT_ID',
      'SANITY_STUDIO_PROJECT_ID',
      'SANITY_API_PROJECT_ID'
    ),
    dataset:
      firstEnv(
        'NEXT_PUBLIC_SANITY_DATASET',
        'SANITY_STUDIO_DATASET',
        'SANITY_API_DATASET'
      ) || 'production',
    apiVersion: '2024-01-01' as const,
  }
}

export function getClient(): SanityClient | null {
  const { dataset, projectId, apiVersion } = getSanityConfig()

  if (!projectId) {
    console.warn('[Sanity] Missing Sanity project ID (set NEXT_PUBLIC_SANITY_PROJECT_ID)')
    return null
  }

  return createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: true,
  })
}
