'use client'

import { LocaleLink, t, useLocale } from '@/lib/i18n'

type Breadcrumb = {
  title: string
  slug: string
}

type BreadcrumbsProps = {
  items: Breadcrumb[]
  className?: string
}

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  const locale = useLocale()

  return (
    <nav aria-label="Breadcrumb" className={`text-sm text-text-secondary ${className}`}>
      <ol className="flex items-center gap-2">
        <li>
          <LocaleLink href="/" className="hover:text-primary">
            {t(locale, 'home')}
          </LocaleLink>
        </li>
        {items.map((item, i) => (
          <li key={item.slug} className="flex items-center gap-2">
            <span>/</span>
            {i === items.length - 1 ? (
              <span aria-current="page" className="text-text-primary">
                {item.title}
              </span>
            ) : (
              <LocaleLink href={`/${item.slug}`} className="hover:text-primary">
                {item.title}
              </LocaleLink>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
