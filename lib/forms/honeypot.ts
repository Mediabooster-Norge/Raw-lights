export const HONEYPOT_FIELD = 'company_website'

export function isHoneypotSubmission(data: Record<string, unknown>): boolean {
  const value = data[HONEYPOT_FIELD]
  return typeof value === 'string' && value.trim().length > 0
}

export function stripHoneypot(data: Record<string, unknown>): Record<string, unknown> {
  const next = { ...data }
  delete next[HONEYPOT_FIELD]
  return next
}
