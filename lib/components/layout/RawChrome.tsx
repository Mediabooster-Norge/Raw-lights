'use client'

import { useEffect, useState } from 'react'

export function RawChrome() {
  const [loaded, setLoaded] = useState(false)
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
  useEffect(() => { const id = window.setTimeout(() => setLoaded(true), 420); return () => clearTimeout(id) }, [])
  return <><div className="raw-progress" aria-hidden="true" /><div className="raw-cursor" aria-hidden="true" /><div className={`raw-loader ${loaded ? 'is-done' : ''}`} aria-hidden="true"><div><strong>RAW</strong><p>Born in Norway</p><i /></div></div></>
}
