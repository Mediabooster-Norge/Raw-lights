import { headers } from 'next/headers'
import Script from 'next/script'
import { htmlLang, parseLocale } from '@/lib/i18n/config'
import { getGlobalSettings } from '@/lib/sanity/fetcher'

export const metadata = {
  title: {
    template: '%s',
    default: 'Nettsted'
  }
}

export default async function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  const [headerList, settings] = await Promise.all([
    headers(),
    getGlobalSettings(),
  ])
  const locale = parseLocale(headerList.get('x-locale'))
  const isStudio = (headerList.get('x-pathname') ?? '').startsWith('/studio')
  const lightModeEnabled = settings?.enableLightMode === true && !isStudio

  return (
    <html
      lang={htmlLang(locale)}
      data-theme="dark"
      data-light-mode={lightModeEnabled ? 'enabled' : 'disabled'}
      suppressHydrationWarning
    >
      <body>
        {lightModeEnabled && (
          <Script src="/theme-bootstrap.js" strategy="beforeInteractive" />
        )}
        {children}
      </body>
    </html>
  )
}
