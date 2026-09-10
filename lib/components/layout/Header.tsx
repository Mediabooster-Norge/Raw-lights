'use client'

/* Navigation is Sanity-configured document data. */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { Logo } from '@/lib/components/ui/Logo'
import { SanityLink } from '@/lib/components/ui/SanityLink'
import { LocaleLink, t, useLocale } from '@/lib/i18n'

type NavItem = { label: string; link?: any; children?: NavItem[] }
type HeaderProps = { logo?: any; mainNav?: NavItem[]; headerCta?: { link: any }; homeHref?: string }

export function Header({ logo, mainNav, headerCta, homeHref = '/' }: HeaderProps) {
  const [open, setOpen] = useState(false)
  const locale = useLocale()
  const pathname = usePathname()
  useEffect(() => {
    const onScroll = () => document.documentElement.classList.toggle('raw-scrolled', scrollY > 24)
    onScroll(); addEventListener('scroll', onScroll, { passive: true }); return () => removeEventListener('scroll', onScroll)
  }, [])
  useEffect(() => { setOpen(false) }, [pathname])
  useEffect(() => { document.body.classList.toggle('raw-nav-open', open); return () => document.body.classList.remove('raw-nav-open') }, [open])
  return <header className="raw-header">
    <LocaleLink href={homeHref} className="raw-header__logo" aria-label="RAW Lights home">{logo ? <Logo logo={logo} className="h-10 w-auto" /> : <span>RAW</span>}</LocaleLink>
    <nav className={`raw-header__nav ${open ? 'is-open' : ''}`} aria-label="Main navigation">{mainNav?.map((item) => <div key={item.label}><SanityLink link={item.link}>{item.label}</SanityLink>{item.children?.map((child) => <SanityLink key={child.label} link={child.link}>{child.label}</SanityLink>)}</div>)}</nav>
    <div className="raw-header__end">{headerCta?.link && <SanityLink link={headerCta.link} className="raw-button raw-button--small" />}<button type="button" className="raw-menu-button" onClick={() => setOpen(!open)} aria-label={open ? t(locale, 'closeMenu') : t(locale, 'menu')} aria-expanded={open}><span /></button></div>
  </header>
}
