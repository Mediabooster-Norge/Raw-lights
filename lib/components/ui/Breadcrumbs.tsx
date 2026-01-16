import Link from 'next/link'

type Breadcrumb = { 
  title: string
  slug: string 
}

type BreadcrumbsProps = {
  items: Breadcrumb[]
  className?: string
}

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className={`text-sm text-text-secondary ${className}`}>
      <ol className="flex items-center gap-2">
        <li>
          <Link href="/" className="hover:text-primary">
            Hjem
          </Link>
        </li>
        {items.map((item, i) => (
          <li key={item.slug} className="flex items-center gap-2">
            <span>/</span>
            {i === items.length - 1 ? (
              <span aria-current="page" className="text-text-primary">
                {item.title}
              </span>
            ) : (
              <Link href={`/${item.slug}`} className="hover:text-primary">
                {item.title}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
