import { draftMode } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const redirect = searchParams.get('redirect') || '/'

  const draft = await draftMode()
  draft.enable()

  return NextResponse.redirect(new URL(redirect, origin))
}
