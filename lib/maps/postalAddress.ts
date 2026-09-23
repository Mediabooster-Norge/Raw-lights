export type PostalAddress = {
  streetAddress?: string
  postalCode?: string
  addressLocality?: string
  addressCountry?: string
}

function part(value?: string) {
  return value?.replace(/[\u200B-\u200F\uFEFF]/g, '').replace(/\s+/g, ' ').trim() || ''
}

export function formatPostalAddress(address?: PostalAddress | null) {
  if (!address) return ''
  const street = part(address.streetAddress)
  const city = [part(address.postalCode), part(address.addressLocality)].filter(Boolean).join(' ')
  const country = part(address.addressCountry)
  if (!street && !city) return ''
  return [street, city, country].filter(Boolean).join(', ')
}

export function mapsEmbedUrl(address?: PostalAddress | null) {
  const query = formatPostalAddress(address)
  if (!query) return null
  return `https://maps.google.com/maps?q=${encodeURIComponent(query)}&z=15&output=embed`
}
