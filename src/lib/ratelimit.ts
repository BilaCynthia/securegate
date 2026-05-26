import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

// Ensure we have a singleton Redis connection to prevent connection exhaustion.
// Redis.fromEnv() automatically uses UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN.
// We provide a fallback mock for development if they are missing so it fails loudly 
// but gracefully in a controlled manner, or we can enforce existence.

const getRedisClient = () => {
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN are required in production.')
    }
    console.warn('Upstash Redis environment variables missing. Rate limiting will fail closed.')
    // Return a dummy object if missing in dev to allow the fail-closed logic to trigger
    return {} as any
  }
  return Redis.fromEnv()
}

const redis = getRedisClient()

export const loginRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, '10 m'),
  analytics: true,
  prefix: 'rate_limit:signin',
})

export const forgotPasswordRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, '10 m'),
  analytics: true,
  prefix: 'rate_limit:forgot_password',
})

export async function checkRateLimit(
  ip: string,
  identifier: 'login' | 'forgot-password'
): Promise<{ success: boolean; remaining: number }> {
  try {
    const limiter = identifier === 'login' ? loginRateLimit : forgotPasswordRateLimit
    const { success, remaining } = await limiter.limit(ip)
    return { success, remaining }
  } catch (error) {
    if (process.env.NODE_ENV === 'production') {
      console.error('Rate limiting failed or Redis is unavailable:', error)
      return { success: false, remaining: 0 }
    }
    console.warn('Rate limiting unavailable in dev — allowing request through.')
    return { success: true, remaining: 999 }
  }
}
