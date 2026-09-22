'use client'

import { useSyncExternalStore } from 'react'
import { THEME_STORAGE_KEY, isAppearance, nextAppearance, type Appearance } from '@/lib/theme/appearance'
import { useSiteCopy } from '@/lib/i18n'

function readAppearance(): Appearance {
  if (typeof document === 'undefined') return 'dark'
  const value = document.documentElement.dataset.theme
  return isAppearance(value) ? value : 'dark'
}

function subscribeToAppearance(onChange: () => void) {
  window.addEventListener('raw-theme-change', onChange)
  window.addEventListener('storage', onChange)
  return () => {
    window.removeEventListener('raw-theme-change', onChange)
    window.removeEventListener('storage', onChange)
  }
}

export function ThemeToggle() {
  const copy = useSiteCopy()
  const appearance = useSyncExternalStore<Appearance>(subscribeToAppearance, readAppearance, () => 'dark')

  const isLight = appearance === 'light'
  const label = isLight ? copy.themeToggleToDark : copy.themeToggleToLight

  return (
    <button
      type="button"
      className="raw-theme-toggle"
      role="switch"
      aria-checked={isLight}
      aria-label={label}
      title={label}
      onClick={() => {
        const next = nextAppearance(appearance)
        document.documentElement.dataset.theme = next
        window.localStorage.setItem(THEME_STORAGE_KEY, next)
        window.dispatchEvent(new Event('raw-theme-change'))
      }}
    >
      <svg aria-hidden="true" viewBox="0 0 24 24" focusable="false">
        <path className="raw-theme-toggle__sun" d="M12 3v2m0 14v2m9-9h-2M5 12H3m15.36-6.36-1.42 1.42M7.05 16.95l-1.42 1.42m0-12.72 1.42 1.42m9.9 9.9 1.42 1.42M15.5 12a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" />
        <path className="raw-theme-toggle__moon" d="M20 15.4A8 8 0 0 1 8.6 4 8.05 8.05 0 1 0 20 15.4Z" />
      </svg>
    </button>
  )
}
