'use client'

import { useEffect, useState } from 'react'
import { t, type Locale } from '@/lib/i18n'

const COOKIE_NAME = 'cookie-consent'

type Consent = 'all' | 'necessary'

function readConsent(): Consent | null {
  if (typeof document === 'undefined') return null
  const match = document.cookie.split('; ').find((row) => row.startsWith(`${COOKIE_NAME}=`))
  const value = match?.split('=')[1]
  return value === 'all' || value === 'necessary' ? value : null
}

function writeConsent(value: Consent) {
  document.cookie = `${COOKIE_NAME}=${value}; path=/; max-age=31536000; SameSite=Lax`
}

export function CookieConsent({
  locale,
  enabled,
}: {
  locale: Locale
  enabled?: boolean
}) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!enabled) return
    setVisible(!readConsent())
  }, [enabled])

  if (!enabled || !visible) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm rounded-xl bg-surface p-4 shadow-lg border border-text-secondary/10">
      <p className="text-sm text-text-secondary mb-4">{t(locale, 'cookieMessage')}</p>
      <div className="flex gap-2">
        <button
          type="button"
          className="px-4 py-2 rounded-lg bg-primary text-on-primary text-sm font-semibold"
          onClick={() => {
            writeConsent('all')
            setVisible(false)
            window.location.reload()
          }}
        >
          {t(locale, 'cookieAccept')}
        </button>
        <button
          type="button"
          className="px-4 py-2 rounded-lg border border-text-secondary/20 text-sm"
          onClick={() => {
            writeConsent('necessary')
            setVisible(false)
          }}
        >
          {t(locale, 'cookieReject')}
        </button>
      </div>
    </div>
  )
}

export function hasAnalyticsConsent() {
  return readConsent() === 'all'
}
