'use client'

import Script from 'next/script'
import { useEffect, useState } from 'react'
import { CONSENT_EVENT, installConsentBridge, readConsent } from '@/lib/utils/consent'

type Props = {
  enabled: boolean
  headScripts?: string
  bodyStartScripts?: string
  footerScripts?: string
  consentScript?: { enabled?: boolean; scriptUrl?: string; inlineScript?: string }
}

export function CustomCodeScripts({
  enabled,
  headScripts,
  bodyStartScripts,
  footerScripts,
  consentScript,
}: Props) {
  const [allowed, setAllowed] = useState(!enabled)

  useEffect(() => {
    installConsentBridge()
    const refresh = () => setAllowed(!enabled || readConsent() === 'all')
    if (!enabled) {
      refresh()
    } else {
      refresh()
    }
    addEventListener(CONSENT_EVENT, refresh)
    return () => removeEventListener(CONSENT_EVENT, refresh)
  }, [enabled])

  return (
    <>
      {consentScript?.enabled && consentScript.scriptUrl && <Script id="custom-consent-provider" src={consentScript.scriptUrl} strategy="afterInteractive" />}
      {consentScript?.enabled && consentScript.inlineScript && <Script id="custom-consent-provider-inline" strategy="afterInteractive">{consentScript.inlineScript}</Script>}
      {allowed && <>
      {headScripts && (
        <Script id="head-scripts" strategy="afterInteractive">
          {headScripts}
        </Script>
      )}
      {bodyStartScripts && (
        <Script id="body-start-scripts" strategy="afterInteractive">
          {bodyStartScripts}
        </Script>
      )}
      {footerScripts && (
        <Script id="footer-scripts" strategy="afterInteractive">
          {footerScripts}
        </Script>
      )}
      </>}
    </>
  )
}
