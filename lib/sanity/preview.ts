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
  
  return createClient({
    projectId,
    dataset,
    apiVersion: '2024-01-01',
    useCdn: false,
    perspective: 'previewDrafts',
    token: process.env.SANITY_API_TOKEN
  })
}
