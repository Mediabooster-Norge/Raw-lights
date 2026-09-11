import { createClient, type SanityClient } from 'next-sanity'

// Next.js only inlines env vars with a static `process.env.NEXT_PUBLIC_*` access.
// Dynamic `process.env[key]` is empty in the Studio browser bundle.
export function getSanityConfig() {
  const projectId = (
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ||
    process.env.SANITY_STUDIO_PROJECT_ID ||
    process.env.SANITY_API_PROJECT_ID ||
    ''
  ).trim()

  const dataset = (
    process.env.NEXT_PUBLIC_SANITY_DATASET ||
    process.env.SANITY_STUDIO_DATASET ||
    process.env.SANITY_API_DATASET ||
    'production'
  ).trim()

  return {
    projectId,
    dataset,
    apiVersion: '2024-01-01' as const,
  }
}

export function getClient(): SanityClient | null {
  const { dataset, projectId, apiVersion } = getSanityConfig()
  // Keep this server-only token private. It is needed when the Sanity dataset is
  // private, while NEXT_PUBLIC_* values alone remain sufficient for the Studio.
  const token = process.env.SANITY_API_TOKEN

  if (!projectId) {
    console.warn('[Sanity] Missing Sanity project ID (set NEXT_PUBLIC_SANITY_PROJECT_ID)')
    return null
  }

  return createClient({
    projectId,
    dataset,
    apiVersion,
    token,
    // Next.js owns caching for server-rendered content through the tags supplied
    // by the fetchers. Going through Sanity's CDN as well can keep a stale query
    // result alive after an editor publishes or the import script runs.
    useCdn: false,
  })
}

export function getTokenClient(): SanityClient | null {
  const client = getClient()
  if (!client || !process.env.SANITY_API_TOKEN) return null
  return client.withConfig({
    useCdn: false,
  })
}
