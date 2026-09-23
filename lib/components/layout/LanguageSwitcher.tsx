'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useLocale } from '@/lib/i18n/LocaleProvider'
import {
  fallbackLanguageUrls,
  languageUrlsMatchPath,
  type LanguageUrls,
} from '@/lib/i18n/languageSwitcher'

function documentAlternates(pathname: string, locale: 'nb' | 'en'): LanguageUrls | null {
  const urls: Partial<LanguageUrls> = {}

  for (const link of document.querySelectorAll<HTMLLinkElement>('head link[rel="alternate"][hreflang]')) {
    const language = link.hreflang
    if (language !== 'nb' && language !== 'en') continue

    const url = new URL(link.href, window.location.origin)
    urls[language] = `${url.pathname}${url.search}${url.hash}`
  }

  const complete = urls.nb && urls.en ? (urls as LanguageUrls) : null
  return languageUrlsMatchPath(complete, pathname, locale) ? complete : null
}

export function LanguageSwitcher({ initialUrls }: { initialUrls?: LanguageUrls }) {
  const locale = useLocale()
  const pathname = usePathname()
  const [resolved, setResolved] = useState<{ pathname: string; urls: LanguageUrls } | null>(null)
  const fallback = fallbackLanguageUrls(pathname)
  const serverUrls = languageUrlsMatchPath(initialUrls, pathname, locale) ? initialUrls : fallback
  const urls = resolved?.pathname === pathname ? resolved.urls : serverUrls

  useEffect(() => {
    const syncFromMetadata = () => {
      const current = documentAlternates(pathname, locale)
      if (!current) return
      setResolved((previous) => (
        previous?.pathname === pathname &&
        previous.urls.nb === current.nb &&
        previous.urls.en === current.en
          ? previous
          : { pathname, urls: current }
      ))
    }

    const animationFrame = window.requestAnimationFrame(syncFromMetadata)
    const observer = new MutationObserver(syncFromMetadata)
    observer.observe(document.head, { attributes: true, childList: true, subtree: true })

    return () => {
      window.cancelAnimationFrame(animationFrame)
      observer.disconnect()
    }
  }, [initialUrls, locale, pathname])

  return (
    <div className="raw-language-switcher" aria-label="Language">
      <Link className={locale === 'nb' ? 'is-active' : ''} href={urls.nb} prefetch>NO</Link>
      <Link className={locale === 'en' ? 'is-active' : ''} href={urls.en} prefetch>EN</Link>
    </div>
  )
}
