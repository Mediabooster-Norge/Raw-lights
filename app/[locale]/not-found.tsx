import { getNotFoundPage } from '@/lib/sanity/fetcher'
import { PageRenderer } from '@/lib/components/blocks/PageRenderer'
import { LocaleLink, isLocale, t, type Locale } from '@/lib/i18n'
import { headers } from 'next/headers'
import { parseLocale } from '@/lib/i18n/config'

export default async function NotFound() {
  const headerList = await headers()
  const locale: Locale = parseLocale(headerList.get('x-locale'))
  const page = isLocale(locale) ? await getNotFoundPage(locale) : null

  if (page) {
    return <PageRenderer blocks={page.blocks ?? []} />
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-4">{t(locale, 'notFoundTitle')}</h2>
        <p className="text-text-secondary mb-8">{t(locale, 'notFoundBody')}</p>
        <LocaleLink
          href="/"
          className="inline-block px-6 py-3 bg-primary text-on-primary rounded-lg font-semibold hover:opacity-90 transition-opacity"
        >
          {t(locale, 'backHome')}
        </LocaleLink>
      </div>
    </div>
  )
}
