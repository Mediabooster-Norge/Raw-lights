'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Logo } from '@/lib/components/ui/Logo'
import { SanityLink } from '@/lib/components/ui/SanityLink'

type NavItem = {
  label: string
  link?: any
  children?: NavItem[]
}

type HeaderProps = {
  logo?: any
  mainNav?: NavItem[]
  headerCta?: {
    link: any
    variant: string
  }
}

export function Header({ logo, mainNav, headerCta }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const ctaVariant = headerCta?.variant ?? 'primary'
  const ctaClasses = ctaVariant === 'secondary'
    ? 'bg-cta-secondary-bg text-cta-secondary-text border border-cta-secondary-border'
    : 'bg-cta-primary-bg text-cta-primary-text border border-cta-primary-border'

  return (
    <header className="sticky top-0 z-40 bg-background border-b border-text-secondary/10">
      <div className="site-container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex-shrink-0">
            <Logo logo={logo} className="h-10 w-auto" />
          </Link>

          <nav className="hidden md:flex items-center gap-8" aria-label="Main navigation">
            {mainNav?.map((item) => (
              <div key={item.label} className="relative group">
                {item.link ? (
                  <SanityLink
                    link={item.link}
                    className="text-text-primary hover:text-primary transition-colors"
                  >
                    {item.label}
                  </SanityLink>
                ) : (
                  <span className="text-text-primary cursor-pointer">{item.label}</span>
                )}
                {item.children && item.children.length > 0 && (
                  <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                    <div className="bg-surface shadow-lg rounded-lg py-2 min-w-[200px] border border-text-secondary/10">
                      {item.children.map((child) => (
                        <SanityLink
                          key={child.label}
                          link={child.link}
                          className="block px-4 py-2 text-text-primary hover:bg-background hover:text-primary transition-colors"
                        >
                          {child.label}
                        </SanityLink>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            {headerCta?.link && (
              <SanityLink
                link={headerCta.link}
                className={`hidden md:inline-block px-6 py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity ${ctaClasses}`}
              />
            )}

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-text-primary hover:text-primary transition-colors"
              aria-label="Toggle menu"
              aria-expanded={isMobileMenuOpen}
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <nav className="md:hidden py-4 border-t border-text-secondary/10" aria-label="Mobile navigation">
            {mainNav?.map((item) => (
              <div key={item.label} className="py-2">
                <SanityLink
                  link={item.link}
                  className="block py-2 text-text-primary hover:text-primary"
                >
                  {item.label}
                </SanityLink>
                {item.children?.map((child) => (
                  <SanityLink
                    key={child.label}
                    link={child.link}
                    className="block py-2 pl-4 text-text-secondary hover:text-primary"
                  >
                    {child.label}
                  </SanityLink>
                ))}
              </div>
            ))}
            {headerCta?.link && (
              <SanityLink
                link={headerCta.link}
                className={`block mt-4 text-center px-6 py-3 rounded-lg font-semibold ${ctaClasses}`}
              />
            )}
          </nav>
        )}
      </div>
    </header>
  )
}
