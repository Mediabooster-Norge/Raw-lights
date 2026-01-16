import { vercelStegaSplit } from '@vercel/stega'

/**
 * Removes stega encoding from a string value.
 * Use this for values that are used in CSS classes, comparisons, or as object keys.
 */
export function cleanStegaString<T extends string | undefined | null>(value: T): T {
  if (typeof value !== 'string') return value
  const { cleaned } = vercelStegaSplit(value)
  return cleaned as T
}

/**
 * Removes stega encoding from all string values in an object.
 * Useful for cleaning configuration objects used in styling.
 */
export function cleanStegaObject<T extends Record<string, any>>(obj: T): T {
  if (!obj || typeof obj !== 'object') return obj
  
  const cleaned: Record<string, any> = {}
  
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      cleaned[key] = cleanStegaString(value)
    } else if (Array.isArray(value)) {
      cleaned[key] = value.map(item => 
        typeof item === 'string' ? cleanStegaString(item) : 
        typeof item === 'object' ? cleanStegaObject(item) : item
      )
    } else if (typeof value === 'object' && value !== null) {
      cleaned[key] = cleanStegaObject(value)
    } else {
      cleaned[key] = value
    }
  }
  
  return cleaned as T
}
