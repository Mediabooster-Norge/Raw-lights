import { createClient, type SanityClient } from 'next-sanity'
import { datasetRouter } from './datasetRouter'

export function getClient(site: string): SanityClient | null {
  const { dataset, projectId } = datasetRouter(site)
  
  if (!projectId) {
    console.warn('[Sanity] Missing NEXT_PUBLIC_SANITY_PROJECT_ID')
    return null
  }
  
  return createClient({
    projectId,
    dataset,
    apiVersion: '2024-01-01',
    useCdn: true
  })
}
