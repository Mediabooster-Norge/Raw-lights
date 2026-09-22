'use client'

import { useEffect, useState } from 'react'
import { t, type Locale } from '@/lib/i18n'
import { installConsentBridge, readConsent, setConsent } from '@/lib/utils/consent'

export function CookieConsent({
  locale,
  enabled,
  privacyHref,
  externalProvider = false,
}: {
  locale: Locale
  enabled?: boolean
  privacyHref?: string | null
  externalProvider?: boolean
}) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    installConsentBridge()
    if (!enabled) return
    setVisible(!readConsent())
  }, [enabled])

  if (!enabled || externalProvider || !visible) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm rounded-xl bg-surface p-4 shadow-lg border border-text-secondary/10">
      <p className="text-sm text-text-secondary mb-4">
        {t(locale, 'cookieMessage')}
        {privacyHref ? (
          <>
            {' '}
            <a href={privacyHref} className="underline hover:text-text-primary">
              {t(locale, 'cookiePrivacy')}
            </a>
          </>
        ) : null}
      </p>
      <div className="flex gap-2">
        <button
          type="button"
          className="px-4 py-2 rounded-lg bg-primary text-on-primary text-sm font-semibold"
          onClick={() => {
            setConsent('all')
            setVisible(false)
          }}
        >
          {t(locale, 'cookieAccept')}
        </button>
        <button
          type="button"
          className="px-4 py-2 rounded-lg border border-text-secondary/20 text-sm"
          onClick={() => {
            setConsent('necessary')
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
