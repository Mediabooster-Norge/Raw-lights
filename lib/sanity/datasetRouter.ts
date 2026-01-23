/**
 * Site Router - Fleksibel single-site og multisite støtte
 * 
 * Single-site modus (NEXT_PUBLIC_MULTISITE_ENABLED=false):
 * - Bruker ett datasett uten site-filtrering
 * - siteId er null (ingen filtrering)
 * 
 * Multisite modus (NEXT_PUBLIC_MULTISITE_ENABLED=true):
 * - Bruker ett datasett med site-filtrering
 * - siteId brukes for å filtrere innhold i GROQ queries
 */

import { isMultisiteEnabled, getDefaultSiteId } from '../config/multisite'

export type SiteConfig = {
  dataset: string
  projectId: string
  siteId: string | null  // null for single-site mode
}

const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!
const DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'

// Site mapping for multisite modus
// Legg til flere sites her når du aktiverer multisite
const siteConfigs: Record<string, SiteConfig> = {
  landstreff: { 
    dataset: DATASET, 
    projectId: PROJECT_ID, 
    siteId: 'landstreff' 
  },
  ypsilon: { 
    dataset: DATASET, 
    projectId: PROJECT_ID, 
    siteId: 'ypsilon' 
  },
  julivinterland: { 
    dataset: DATASET, 
    projectId: PROJECT_ID, 
    siteId: 'julivinterland' 
  }
}

// Single-site konfigurasjon (ingen site-filtrering)
const singleSiteConfig: SiteConfig = {
  dataset: DATASET,
  projectId: PROJECT_ID,
  siteId: null
}

const DEFAULT_SITE = 'landstreff'

/**
 * Hent konfigurasjon for en gitt site
 * @param site - Site identifier (f.eks. 'landstreff')
 * @returns SiteConfig med dataset, projectId og siteId
 */
export function datasetRouter(site: string): SiteConfig {
  // Single-site modus: returner konfig uten siteId
  if (!isMultisiteEnabled()) {
    return singleSiteConfig
  }
  
  // Multisite modus: returner site-spesifikk konfig
  return siteConfigs[site] ?? siteConfigs[DEFAULT_SITE]
}

/**
 * Hent alle registrerte sites (kun for multisite modus)
 * @returns Array med site identifikatorer
 */
export function getAllSiteIds(): string[] {
  if (!isMultisiteEnabled()) {
    return []
  }
  return Object.keys(siteConfigs)
}

/**
 * Sjekk om en site er gyldig
 * @param site - Site identifier
 * @returns true hvis site finnes (eller alltid true i single-site modus)
 */
export function isValidSite(site: string): boolean {
  if (!isMultisiteEnabled()) {
    return true
  }
  return site in siteConfigs
}

/**
 * Hent standard site
 * @returns Standard site identifier
 */
export function getDefaultSite(): string {
  if (!isMultisiteEnabled()) {
    return getDefaultSiteId()
  }
  return DEFAULT_SITE
}
