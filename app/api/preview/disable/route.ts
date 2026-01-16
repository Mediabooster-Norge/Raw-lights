import { NextRequest, NextResponse } from 'next/server'
import { draftMode, cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  const draft = await draftMode()
  draft.disable()

  const cookieStore = await cookies()
  cookieStore.delete('preview-site')

  return NextResponse.redirect(new URL('/', request.url))
}
