import { cookies } from 'next/headers'
import { createClient, type SanityClient } from 'next-sanity'
import { datasetRouter } from './datasetRouter'

export function getPreviewClient(site?: string): SanityClient | null {
  const cookieStore = cookies()
  const previewSite = site ?? cookieStore.get('preview-site')?.value ?? 'landstreff'
  
  const { dataset, projectId } = datasetRouter(previewSite)
  
  if (!projectId) {
    console.warn('[Sanity] Missing NEXT_PUBLIC_SANITY_PROJECT_ID')
    return null
  }

  const token = process.env.SANITY_API_TOKEN
  
  // If no token, fall back to published content only
  if (!token) {
    console.warn('[Sanity] No SANITY_API_TOKEN - preview will show published content only')
    return createClient({
      projectId,
      dataset,
      apiVersion: '2024-01-01',
      useCdn: false
    })
  }
  
  return createClient({
    projectId,
    dataset,
    apiVersion: '2024-01-01',
    useCdn: false,
    perspective: 'previewDrafts',
    token,
    // Enable stega encoding for visual editing
    stega: {
      enabled: true,
      studioUrl: `/studio/${dataset}`
    }
  })
}
