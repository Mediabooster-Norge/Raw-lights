import { NextRequest, NextResponse } from 'next/server'
import { unstable_cache } from 'next/cache'
import { getRedirects } from '@/lib/sanity/redirects'
import { getHomePageSlugs } from '@/lib/sanity/home'
import { defaultLocale, localizedPath, parseLocale, stripLocalePrefix } from '@/lib/i18n/config'
import { internalPathForLocale } from '@/lib/i18n/routes'

const PUBLIC_FILE = /\.[^/]+$/

const getRoutingConfig = unstable_cache(
  async () => {
    const [redirects, homeSlugs] = await Promise.all([getRedirects(), getHomePageSlugs()])
    return { redirects, homeSlugs: Array.from(homeSlugs) }
  },
  ['proxy-routing-config'],
  {
    revalidate: 60,
    tags: ['redirects', 'global-settings', 'translations'],
  }
)

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

  const legacyDestination = (() => {
    if (pathname === '/about') return '/om-oss'
    if (pathname === '/contact') return '/kontakt'
    if (pathname === '/privacy') return '/personvern'
    if (pathname === '/products') return '/produkter'
    if (pathname.startsWith('/products/')) return `/produkter/${pathname.slice('/products/'.length)}`
    if (pathname === '/en/home') return '/en'
    return null
  })()
  if (legacyDestination) return NextResponse.redirect(new URL(legacyDestination, request.url), 308)

  const { locale: pathLocale, path } = stripLocalePrefix(pathname)

  try {
    const { redirects, homeSlugs } = await getRoutingConfig()
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
    if (slug && !slug.includes('/') && homeSlugs.includes(slug)) {
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
  const internalPath = internalPathForLocale(defaultLocale, pathname)
  url.pathname = internalPath === '/' ? `/${defaultLocale}` : `/${defaultLocale}${internalPath}`
  return NextResponse.rewrite(url, { request: { headers: requestHeaders } })
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
