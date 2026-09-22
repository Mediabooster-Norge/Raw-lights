'use client'

import { Logo } from '@/lib/components/ui/Logo'
import { SanityLink } from '@/lib/components/ui/SanityLink'
import { useSiteCopy } from '@/lib/i18n'

/* Footer columns are Sanity-configured document data. */
/* eslint-disable @typescript-eslint/no-explicit-any */

type FooterColumn = { links: { label: string; [key: string]: any }[] }
type FooterProps = { logo?: any; logoLight?: any; footerNav?: FooterColumn[]; socialLinks?: { platform: string; url: string }[]; homeHref?: string }

export function Footer({ logo, logoLight, footerNav, socialLinks, homeHref = '/' }: FooterProps) {
  const copy = useSiteCopy()
  const tagline = (copy.footerTagline ?? '').split('\n')
  return <footer className="raw-footer">
    <div className="raw-footer__brand">
      <a href={homeHref} aria-label="RAW Lights home">{logo ? <Logo logo={logo} logoLight={logoLight} className="h-10 w-auto" /> : <span>RAW</span>}</a>
      <p>{tagline.map((line, index) => <span key={line}>{line}{index < tagline.length - 1 && <br />}</span>)}</p>
    </div>
    <div className="raw-footer__contact">
      <p className="raw-kicker">{copy.footerContactLabel}</p>
      <p><a href="tel:+4722306800">+47 22 30 68 00</a></p>
      <p><a href="mailto:contact@rawlightsgroup.com">contact@rawlightsgroup.com</a></p>
      {footerNav?.flatMap((column) => column.links || []).map((link) => <p key={link.label}><SanityLink link={link}>{link.label}</SanityLink></p>)}
    </div>
    <div className="raw-footer__follow">
      <p className="raw-kicker">{copy.footerFollowLabel}</p>
      {socialLinks?.map((social) => <p key={social.platform}><a href={social.url} target="_blank" rel="noopener noreferrer">{social.platform}</a></p>)}
      <p><a href="https://verne.no" target="_blank" rel="noopener noreferrer">{copy.footerResellerLabel}</a></p>
      <small>{(copy.footerCopyright ?? '').replace('{year}', String(new Date().getFullYear()))}</small>
    </div>
  </footer>
}
