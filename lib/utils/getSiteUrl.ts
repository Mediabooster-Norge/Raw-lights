const DEFAULT_URL = 'http://localhost:3000'

export function getSiteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL ?? DEFAULT_URL
}
