import { draftMode, cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const site = searchParams.get('site') || 'landstreff'
  const redirect = searchParams.get('redirect') || '/'

  // Enable draft mode
  const draft = await draftMode()
  draft.enable()

  // Set site cookie for preview routing
  const cookieStore = await cookies()
  cookieStore.set('preview-site', site, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'none', // Required for iframe in Sanity Studio
    maxAge: 60 * 60 // 1 hour
  })

  // Redirect to the requested page
  return NextResponse.redirect(new URL(redirect, origin))
}
