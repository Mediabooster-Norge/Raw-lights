'use client'

import { createContext, useContext, type ReactNode } from 'react'
import { defaultLocale, type Locale } from './config'

type LocaleContextValue = {
  locale: Locale
  homeSlug?: string | null
}

const LocaleContext = createContext<LocaleContextValue>({ locale: defaultLocale })

export function LocaleProvider({
  locale,
  homeSlug,
  children,
}: {
  locale: Locale
  homeSlug?: string | null
  children: ReactNode
}) {
  return (
    <LocaleContext.Provider value={{ locale, homeSlug }}>
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
