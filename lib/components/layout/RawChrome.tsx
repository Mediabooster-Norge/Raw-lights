'use client'

import { useEffect, useLayoutEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { SanityImage } from '@/lib/components/ui/SanityImage'

type RawChromeProps = {
  logo?: { asset?: unknown; alt?: string }
}

const LOADER_DELAY_MS = 420
const LOADER_EXIT_MS = 1150
const HERO_REVEAL_DELAY_MS = 120

export function RawChrome({ logo }: RawChromeProps) {
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
        {logo ? <SanityImage image={logo} alt="" width={220} height={156} priority className="raw-loader__logo" /> : <strong>RAW</strong>}
        <p>Born in Norway</p>
        <i />
      </div>
    </div>
  </>
}
