import { NextRequest, NextResponse } from 'next/server'
import { draftMode } from 'next/headers'

export async function GET(request: NextRequest) {
  const draft = await draftMode()
  draft.disable()

  return NextResponse.redirect(new URL('/', request.url))
}
