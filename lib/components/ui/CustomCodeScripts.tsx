'use client'

import Script from 'next/script'
import { useEffect, useState } from 'react'

type Props = {
  enabled: boolean
  headScripts?: string
  bodyStartScripts?: string
  footerScripts?: string
}

function readConsent() {
  if (typeof document === 'undefined') return null
  const match = document.cookie.split('; ').find((row) => row.startsWith('cookie-consent='))
  return match?.split('=')[1] ?? null
}

export function CustomCodeScripts({
  enabled,
  headScripts,
  bodyStartScripts,
  footerScripts,
}: Props) {
  const [allowed, setAllowed] = useState(!enabled)

  useEffect(() => {
    if (!enabled) {
      setAllowed(true)
      return
    }
    setAllowed(readConsent() === 'all')
  }, [enabled])

  if (!allowed) return null

  return (
    <>
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
    </>
  )
}
