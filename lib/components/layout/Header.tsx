'use client'

/* Navigation is Sanity-configured document data. */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Logo } from '@/lib/components/ui/Logo'
import { ThemeToggle } from '@/lib/components/ui/ThemeToggle'
import { SanityLink } from '@/lib/components/ui/SanityLink'
import { LocaleLink, t, useLocale } from '@/lib/i18n'

type NavItem = { label: string; link?: any; children?: NavItem[] }
type HeaderProps = { logo?: any; logoLight?: any; enableLightMode?: boolean; mainNav?: NavItem[]; headerCta?: { link: any }; homeHref?: string; languageUrls?: { nb: string; en: string } }

export function Header({ logo, logoLight, enableLightMode = false, mainNav, headerCta, homeHref = '/', languageUrls }: HeaderProps) {
  const [open, setOpen] = useState(false)
  const locale = useLocale()
  useEffect(() => {
    const onScroll = () => document.documentElement.classList.toggle('raw-scrolled', scrollY > 24)
    onScroll(); addEventListener('scroll', onScroll, { passive: true }); return () => removeEventListener('scroll', onScroll)
  }, [])
  useEffect(() => { document.body.classList.toggle('raw-nav-open', open); return () => document.body.classList.remove('raw-nav-open') }, [open])
  useEffect(() => {
    if (!open) return
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === 'Escape') setOpen(false) }
    addEventListener('keydown', closeOnEscape)
    return () => removeEventListener('keydown', closeOnEscape)
  }, [open])

  const navigation = (onClick?: () => void) => mainNav?.map((item) => (
    <div key={item.label}>
      <SanityLink link={item.link} onClick={onClick}>{item.label}</SanityLink>
      {item.children?.map((child) => <SanityLink key={child.label} link={child.link} onClick={onClick}>{child.label}</SanityLink>)}
    </div>
  ))

  return <>
    <header className={`raw-header ${open ? 'is-menu-open' : ''}`}>
      <LocaleLink href={homeHref} className="raw-header__logo" aria-label="RAW Lights home">{logo ? <Logo logo={logo} logoLight={logoLight} className="h-10 w-auto" /> : <span>RAW</span>}</LocaleLink>
      <nav className="raw-header__nav" aria-label="Main navigation">{navigation()}</nav>
      <div className="raw-header__end"><div className="raw-language-switcher" aria-label="Language"><Link className={locale === 'nb' ? 'is-active' : ''} href={languageUrls?.nb ?? '/'}>NO</Link><Link className={locale === 'en' ? 'is-active' : ''} href={languageUrls?.en ?? '/en'}>EN</Link></div>{enableLightMode && <ThemeToggle />}{headerCta?.link && <SanityLink link={headerCta.link} className="raw-button raw-button--small" />}<button type="button" className="raw-menu-button" onClick={() => setOpen(!open)} aria-label={open ? t(locale, 'closeMenu') : t(locale, 'menu')} aria-expanded={open}><span /></button></div>
    </header>
    <nav className={`raw-mobile-menu ${open ? 'is-open' : ''}`} aria-label="Mobile navigation" aria-hidden={!open}>
      <div className="raw-mobile-menu__links">{navigation(() => setOpen(false))}</div>
      {headerCta?.link && <SanityLink link={headerCta.link} onClick={() => setOpen(false)} className="raw-button raw-button--primary raw-mobile-menu__cta" />}
    </nav>
  </>
}
