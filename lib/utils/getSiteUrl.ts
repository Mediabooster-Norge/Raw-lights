const DEFAULT_URL = 'http://localhost:3000'

const siteUrls: Record<string, string> = {
  landstreff: process.env.SITE_URL_LANDSTREFF ?? process.env.NEXT_PUBLIC_SITE_URL ?? DEFAULT_URL,
  ypsilon: process.env.SITE_URL_YPSILON ?? process.env.NEXT_PUBLIC_SITE_URL ?? DEFAULT_URL,
  julivinterland: process.env.SITE_URL_JULIVINTERLAND ?? process.env.NEXT_PUBLIC_SITE_URL ?? DEFAULT_URL
}

export function getSiteUrl(site: string): string {
  return siteUrls[site] ?? DEFAULT_URL
}
