'use client'

import { useEffect, useLayoutEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { SanityImage } from '@/lib/components/ui/SanityImage'
import { useSiteCopy } from '@/lib/i18n'

type RawChromeProps = {
  logo?: { asset?: unknown; alt?: string }
  logoLight?: { asset?: unknown; alt?: string }
}

const LOADER_DELAY_MS = 420
const LOADER_EXIT_MS = 1150
// Keep a subtle beat after the loader clears, but start the hero immediately.
const HERO_REVEAL_DELAY_MS = 24

export function RawChrome({ logo, logoLight }: RawChromeProps) {
  const copy = useSiteCopy()
  const pathname = usePathname()
  const isHome = pathname === '/' || pathname === '/en' || pathname === '/nb'
  const [loaded, setLoaded] = useState(!isHome)

  useEffect(() => {
    const touch = matchMedia('(hover: none), (pointer: coarse)').matches
    document.documentElement.classList.toggle('raw-touch', touch)
    const cursor = document.querySelector<HTMLElement>('.raw-cursor')
    if (!touch && !matchMedia('(prefers-reduced-motion: reduce)').matches && cursor) {
      const move = (event: PointerEvent) => {
        cursor.style.left = `${event.clientX}px`
        cursor.style.top = `${event.clientY}px`
        const target = event.target instanceof Element ? event.target.closest('a, button, label, .raw-lamp') : null
        cursor.classList.toggle('is-light', Boolean(target?.classList.contains('raw-lamp')))
        cursor.classList.toggle('is-hover', Boolean(target && !target.classList.contains('raw-lamp')))
      }
      addEventListener('pointermove', move, { passive: true })
      return () => removeEventListener('pointermove', move)
    }
  }, [])

  useLayoutEffect(() => {
    const root = document.documentElement
    const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches

    root.classList.remove('raw-home-intro-pending', 'raw-home-intro-ready')

    if (!isHome || reducedMotion) {
      setLoaded(true)
      return
    }

    setLoaded(false)
    root.classList.add('raw-home-intro-pending')

    const loaderTimer = window.setTimeout(() => setLoaded(true), LOADER_DELAY_MS)
    const heroTimer = window.setTimeout(() => {
      root.classList.remove('raw-home-intro-pending')
      root.classList.add('raw-home-intro-ready')
    }, LOADER_DELAY_MS + LOADER_EXIT_MS + HERO_REVEAL_DELAY_MS)

    return () => {
      window.clearTimeout(loaderTimer)
      window.clearTimeout(heroTimer)
      root.classList.remove('raw-home-intro-pending', 'raw-home-intro-ready')
    }
  }, [isHome])

  return <>
    <div className="raw-progress" aria-hidden="true" />
    <div className="raw-cursor" aria-hidden="true" />
    <div className={`raw-loader ${loaded ? 'is-done' : ''}`} aria-hidden="true">
      <div>
        {logo ? <>{/* Both logos render so client-side theme changes are immediate. */}
          <SanityImage image={logo} alt="" width={220} height={150} priority className="raw-loader__logo raw-logo raw-logo--dark" style={{ width: 'min(42vw, 220px)', height: 'auto' }} />
          {logoLight && <SanityImage image={logoLight} alt="" width={220} height={150} priority className="raw-loader__logo raw-logo raw-logo--light" style={{ width: 'min(42vw, 220px)', height: 'auto' }} />}
        </> : <strong>RAW</strong>}
        <p>{copy.loaderLabel}</p>
        <i />
      </div>
    </div>
  </>
}
