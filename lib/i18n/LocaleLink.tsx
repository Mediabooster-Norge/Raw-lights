'use client'

import Link from 'next/link'
import type { ComponentProps } from 'react'
import { localizedPath } from './config'
import { useLocale } from './LocaleProvider'

type Props = ComponentProps<typeof Link>

export function LocaleLink({ href, ...props }: Props) {
  const locale = useLocale()
  const resolved =
    typeof href === 'string' && href.startsWith('/') && !href.startsWith('/en')
      ? localizedPath(locale, href)
      : href

  return <Link href={resolved} {...props} />
}
