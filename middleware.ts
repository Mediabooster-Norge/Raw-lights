import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Domain to site mapping
const domainToSite: Record<string, string> = {
  'landstreffstavanger.no': 'landstreff',
  'www.landstreffstavanger.no': 'landstreff',
  'ypsilonfestivalen.no': 'ypsilon',
  'www.ypsilonfestivalen.no': 'ypsilon',
  'julivinterland.no': 'julivinterland',
  'www.julivinterland.no': 'julivinterland',
  // Local development
  'localhost': 'landstreff'
}

export function middleware(request: NextRequest) {
  const { pathname, hostname } = request.nextUrl

  // Skip static files, API routes, and studio
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/studio') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  // Determine site from domain
  const site = domainToSite[hostname] ?? 'landstreff'

  // Rewrite to site-specific route
  const url = request.nextUrl.clone()
  url.pathname = `/${site}${pathname}`

  return NextResponse.rewrite(url)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*|studio).*)'
  ]
}
