'use client'

export const CONSENT_COOKIE = 'cookie-consent'
export type Consent = 'all' | 'necessary'
export const CONSENT_EVENT = 'raw-consent-change'

declare global {
  interface Window {
    RAWCookieConsent?: { accept: () => void; reject: () => void; value: () => Consent | null }
  }
}

export function readConsent(): Consent | null {
  if (typeof document === 'undefined') return null
  const value = document.cookie.split('; ').find((row) => row.startsWith(`${CONSENT_COOKIE}=`))?.split('=')[1]
  return value === 'all' || value === 'necessary' ? value : null
}

export function setConsent(value: Consent) {
  document.cookie = `${CONSENT_COOKIE}=${value}; path=/; max-age=31536000; SameSite=Lax`
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: value }))
}

/** Bridge for a custom consent UI inserted through Studio. */
export function installConsentBridge() {
  if (typeof window === 'undefined') return
  window.RAWCookieConsent = {
    accept: () => setConsent('all'),
    reject: () => setConsent('necessary'),
    value: readConsent,
  }
}
