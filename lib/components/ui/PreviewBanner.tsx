import { draftMode } from 'next/headers'
import { t, type Locale } from '@/lib/i18n'

export async function PreviewBanner({ locale }: { locale: Locale }) {
  const { isEnabled } = await draftMode()

  if (!isEnabled) return null

  return (
    <div className="fixed bottom-4 left-4 bg-yellow-400 text-black px-4 py-2 rounded-full z-50 text-sm font-medium shadow-lg">
      {t(locale, 'preview')}
      <a href="/api/preview/disable" className="ml-2 underline">
        {t(locale, 'exitPreview')}
      </a>
    </div>
  )
}
