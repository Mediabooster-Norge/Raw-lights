const DEFAULT_URL = 'http://localhost:3000'

function stripTrailingSlash(url: string) {
  return url.replace(/\/+$/, '')
}

function isHttpUrl(value: string) {
  try {
    const url = new URL(value)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

function vercelDeploymentUrl() {
  const host = [
    process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL,
    process.env.VERCEL_PROJECT_PRODUCTION_URL,
    process.env.NEXT_PUBLIC_VERCEL_URL,
    process.env.VERCEL_URL
  ]
    .map((value) => value?.trim())
    .find(Boolean)

  if (!host) return null
  if (isHttpUrl(host)) return stripTrailingSlash(host)
  return `https://${host.replace(/^https?:\/\//, '')}`
}

export function getSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim()
  if (explicit && isHttpUrl(explicit)) return stripTrailingSlash(explicit)

  return vercelDeploymentUrl() ?? DEFAULT_URL
}
