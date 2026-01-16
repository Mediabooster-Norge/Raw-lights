export type SiteConfig = {
  dataset: string
  projectId: string
}

const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!

// Dataset mapping - oppdater når du får flere datasett
// For nå: landstreff = landstreff, resten bruker production
const siteConfigs: Record<string, SiteConfig> = {
  landstreff: { dataset: 'landstreff', projectId: PROJECT_ID },
  ypsilon: { dataset: 'production', projectId: PROJECT_ID },      // TODO: Endre til 'ypsilon' når datasett er opprettet
  julivinterland: { dataset: 'production', projectId: PROJECT_ID } // TODO: Endre til 'julivinterland' når datasett er opprettet
}

const DEFAULT_SITE = 'landstreff'

export function datasetRouter(site: string): SiteConfig {
  return siteConfigs[site] ?? siteConfigs[DEFAULT_SITE]
}
