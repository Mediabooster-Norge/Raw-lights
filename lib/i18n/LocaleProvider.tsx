'use client'

import { createContext, useContext, type ReactNode } from 'react'
import { defaultLocale, type Locale } from './config'
import { type SiteCopy } from './siteCopy'

type LocaleContextValue = {
  locale: Locale
  homeSlug?: string | null
  siteCopy?: SiteCopy
}

const LocaleContext = createContext<LocaleContextValue>({ locale: defaultLocale })

export function LocaleProvider({
  locale,
  homeSlug,
  siteCopy,
  children,
}: {
  locale: Locale
  homeSlug?: string | null
  siteCopy?: SiteCopy
  children: ReactNode
}) {
  return (
    <LocaleContext.Provider value={{ locale, homeSlug, siteCopy }}>
      {children}
    </LocaleContext.Provider>
  )
}

export function useLocale(): Locale {
  return useContext(LocaleContext).locale
}

export function useHomeSlug(): string | null | undefined {
  return useContext(LocaleContext).homeSlug
}

export function useSiteCopy(): SiteCopy { return useContext(LocaleContext).siteCopy ?? {} }
