/**
 * Multisite Configuration
 * 
 * Denne filen håndterer konfigurasjon for multisite-funksjonalitet.
 * Sett NEXT_PUBLIC_MULTISITE_ENABLED=true i .env for å aktivere multisite.
 * 
 * Single-site modus (default):
 * - Ingen site-felt på dokumenter
 * - Ingen site-filtrering i queries
 * - Enklere Studio-struktur
 * 
 * Multisite modus:
 * - Site-felt på alle dokumenter
 * - Queries filtrerer på siteId
 * - Studio gruppert etter nettsted
 */

/**
 * Sjekk om multisite er aktivert
 */
export function isMultisiteEnabled(): boolean {
  return process.env.NEXT_PUBLIC_MULTISITE_ENABLED === 'true'
}

/**
 * Hent standard site for single-site modus
 */
export function getDefaultSiteId(): string {
  return process.env.NEXT_PUBLIC_DEFAULT_SITE_ID || 'default'
}

/**
 * Konfigurasjonsobjekt for multisite
 */
export const multisiteConfig = {
  /**
   * Er multisite aktivert?
   */
  get enabled(): boolean {
    return isMultisiteEnabled()
  },
  
  /**
   * Standard siteId for single-site modus eller fallback
   */
  get defaultSiteId(): string {
    return getDefaultSiteId()
  }
}
