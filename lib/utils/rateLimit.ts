type RateLimitConfig = {
  interval: number
  maxRequests: number
}

const rateLimitMap = new Map<string, { count: number; timestamp: number }>()

export function rateLimit(config: RateLimitConfig) {
  return {
    check: (identifier: string): { success: boolean; remaining: number } => {
      const now = Date.now()
      const record = rateLimitMap.get(identifier)

      if (!record || now - record.timestamp > config.interval) {
        rateLimitMap.set(identifier, { count: 1, timestamp: now })
        return { success: true, remaining: config.maxRequests - 1 }
      }

      if (record.count >= config.maxRequests) {
        return { success: false, remaining: 0 }
      }

      record.count++
      return { success: true, remaining: config.maxRequests - record.count }
    }
  }
}
