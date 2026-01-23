import { defineField } from 'sanity'

/**
 * Multisite site-felt helper
 * 
 * Returnerer site-referansefelt kun hvis multisite er aktivert.
 * Brukes i alle dokumenttyper som skal støtte multisite.
 * 
 * Bruk:
 * fields: [
 *   ...getSiteField(),
 *   // andre felter...
 * ]
 */

// Sjekk om multisite er aktivert (på byggetidspunkt for schemas)
const isMultisiteEnabled = process.env.NEXT_PUBLIC_MULTISITE_ENABLED === 'true'

/**
 * Hent site-felt for dokumenter
 * Returnerer tomt array hvis multisite er deaktivert
 */
export function getSiteField(options?: { group?: string }) {
  if (!isMultisiteEnabled) {
    return []
  }
  
  return [
    defineField({
      name: 'site',
      title: 'Nettsted',
      type: 'reference',
      to: [{ type: 'site' }],
      validation: Rule => Rule.required(),
      description: 'Velg hvilket nettsted dette innholdet tilhører',
      ...(options?.group && { group: options.group })
    })
  ]
}

/**
 * Hent site-felt for preview select
 * Returnerer tomt objekt hvis multisite er deaktivert
 */
export function getSitePreviewSelect() {
  if (!isMultisiteEnabled) {
    return {}
  }
  return { siteTitle: 'site.title' }
}

/**
 * Formater subtitle med site-info hvis multisite er aktivert
 */
export function formatSubtitleWithSite(subtitle: string, siteTitle?: string): string {
  if (!isMultisiteEnabled || !siteTitle) {
    return subtitle
  }
  return `[${siteTitle}] ${subtitle}`
}

export { isMultisiteEnabled }
