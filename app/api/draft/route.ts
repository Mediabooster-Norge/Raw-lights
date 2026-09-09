import { defineEnableDraftMode } from 'next-sanity/draft-mode'
import { getTokenClient } from '@/lib/sanity/client'

export async function GET(request: Request) {
  const client = getTokenClient()
  if (!client) {
    return new Response('Draft mode is not configured', { status: 500 })
  }

  const handler = defineEnableDraftMode({ client })
  return handler.GET(request)
}
