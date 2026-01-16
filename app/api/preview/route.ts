import { NextRequest, NextResponse } from 'next/server'
import { draftMode, cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const secret = searchParams.get('secret')
  const slug = searchParams.get('slug') ?? '/'
  const site = searchParams.get('site')

  // Validate secret
  if (secret !== process.env.SANITY_PREVIEW_SECRET) {
    return NextResponse.json(
      { message: 'Invalid token' },
      { status: 401 }
    )
  }

  // Validate site param
  if (!site) {
    return NextResponse.json(
      { message: 'Missing site parameter' },
      { status: 400 }
    )
  }

  // Enable draft mode
  const draft = await draftMode()
  draft.enable()

  // Store site in cookie for preview client
  const cookieStore = await cookies()
  cookieStore.set('preview-site', site, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 // 1 hour
  })

  // Redirect to the page
  redirect(slug.startsWith('/') ? slug : `/${slug}`)
}
