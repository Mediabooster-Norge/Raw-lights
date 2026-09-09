import { headers } from 'next/headers'
import { htmlLang, parseLocale } from '@/lib/i18n/config'

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
  const headerList = await headers()
  const locale = parseLocale(headerList.get('x-locale'))

  return (
    <html lang={htmlLang(locale)} suppressHydrationWarning>
      <body>{children}</body>
    </html>
  )
}
