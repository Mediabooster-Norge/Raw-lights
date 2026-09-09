import { NextRequest, NextResponse } from 'next/server'
import { getRedirects } from '@/lib/sanity/redirects'
import { getHomePageSlugs } from '@/lib/sanity/home'
import { defaultLocale, localizedPath, parseLocale, stripLocalePrefix } from '@/lib/i18n/config'

const PUBLIC_FILE = /\.[^/]+$/

function shouldSkip(pathname: string) {
  return (
    pathname.startsWith('/studio') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname === '/sitemap.xml' ||
    pathname === '/robots.txt' ||
    PUBLIC_FILE.test(pathname)
  )
}

function normalizePath(value: string) {
  const withSlash = value.startsWith('/') ? value : `/${value}`
  return withSlash.replace(/\/+$/, '') || '/'
}

function localizeDestination(destination: string, locale: ReturnType<typeof parseLocale>) {
  if (destination.startsWith('http://') || destination.startsWith('https://')) {
    return destination
  }
  const path = normalizePath(destination)
  if (path === '/en' || path.startsWith('/en/')) return path
  return localizedPath(locale, path)
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  if (shouldSkip(pathname)) {
    return NextResponse.next()
  }

  const { locale: pathLocale, path } = stripLocalePrefix(pathname)

  try {
    const [redirects, homeSlugs] = await Promise.all([getRedirects(), getHomePageSlugs()])
    const match = redirects.find((redirect) => {
      const source = normalizePath(redirect.source)
      return source === pathname || source === path
    })
    if (match) {
      const destination = localizeDestination(match.destination, pathLocale)
      const status = match.permanent === false ? 307 : 308
      const url = destination.startsWith('http')
        ? destination
        : new URL(destination, request.url)
      return NextResponse.redirect(url, status)
    }

    const slug = path === '/' ? '' : path.replace(/^\//, '')
    if (slug && !slug.includes('/') && homeSlugs.has(slug)) {
      return NextResponse.redirect(new URL(localizedPath(pathLocale, '/'), request.url), 308)
    }
  } catch {
    // Redirect lookup should never block the request.
  }

  if (pathname === '/nb' || pathname.startsWith('/nb/')) {
    const url = request.nextUrl.clone()
    url.pathname = pathname.replace(/^\/nb/, '') || '/'
    return NextResponse.redirect(url)
  }

  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-pathname', pathname)

  if (pathname === '/en' || pathname.startsWith('/en/')) {
    requestHeaders.set('x-locale', 'en')
    return NextResponse.next({ request: { headers: requestHeaders } })
  }

  requestHeaders.set('x-locale', defaultLocale)
  const url = request.nextUrl.clone()
  url.pathname = pathname === '/' ? `/${defaultLocale}` : `/${defaultLocale}${pathname}`
  return NextResponse.rewrite(url, { request: { headers: requestHeaders } })
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
