import { getClient } from './client'
import { redirectsQuery } from './queries/i18n'

export async function getRedirects() {
  const client = getClient()
  if (!client) return []
  return client.fetch<{ source: string; destination: string; permanent?: boolean }[]>(
    redirectsQuery,
    {},
    { next: { revalidate: 60, tags: ['redirects'] } }
  )
}
