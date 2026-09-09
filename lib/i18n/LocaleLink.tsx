'use client'

import Link from 'next/link'
import type { ComponentProps } from 'react'
import { localizedPath } from './config'
import { useLocale } from './LocaleProvider'

type Props = ComponentProps<typeof Link>

export function LocaleLink({ href, ...props }: Props) {
  const locale = useLocale()
  let resolved = href
  if (typeof href === 'string' && href.startsWith('/') && !href.startsWith('/en')) {
    const [pathname, query] = href.split('?')
    const localized = localizedPath(locale, pathname)
    resolved = query ? `${localized}?${query}` : localized
  }

  return <Link href={resolved} {...props} />
}
