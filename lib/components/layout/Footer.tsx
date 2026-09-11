import { Logo } from '@/lib/components/ui/Logo'
import { SanityLink } from '@/lib/components/ui/SanityLink'

/* Footer columns are Sanity-configured document data. */
/* eslint-disable @typescript-eslint/no-explicit-any */

type FooterColumn = { links: { label: string; [key: string]: any }[] }
type FooterProps = { logo?: any; footerNav?: FooterColumn[]; socialLinks?: { platform: string; url: string }[]; homeHref?: string }

export function Footer({ logo, footerNav, socialLinks, homeHref = '/' }: FooterProps) {
  return <footer className="raw-footer">
    <div className="raw-footer__brand">
      <a href={homeHref} aria-label="RAW Lights home">{logo ? <Logo logo={logo} className="h-10 w-auto" /> : <span>RAW</span>}</a>
      <p>Born in Norway,<br />built for anywhere.</p>
    </div>
    <div className="raw-footer__contact">
      <p className="raw-kicker">Contact</p>
      <p><a href="tel:+4722306800">+47 22 30 68 00</a></p>
      <p><a href="mailto:contact@rawlightsgroup.com">contact@rawlightsgroup.com</a></p>
      {footerNav?.flatMap((column) => column.links || []).map((link) => <p key={link.label}><SanityLink link={link}>{link.label}</SanityLink></p>)}
    </div>
    <div className="raw-footer__follow">
      <p className="raw-kicker">Follow</p>
      {socialLinks?.map((social) => <p key={social.platform}><a href={social.url} target="_blank" rel="noopener noreferrer">{social.platform}</a></p>)}
      <p><a href="https://verne.no" target="_blank" rel="noopener noreferrer">Norwegian reseller ↗</a></p>
      <small>© {new Date().getFullYear()} RAW Lights</small>
    </div>
  </footer>
}
