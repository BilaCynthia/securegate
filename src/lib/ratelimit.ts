export async function checkRateLimit(
  ip: string,
  identifier: 'login' | 'forgot-password'
): Promise<{ success: boolean; remaining: number }> {
  const redisConfigured = !!(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN)
  
  if (!redisConfigured) {
    if (process.env.NODE_ENV === 'production') {
      console.error('Rate limiting not configured. Blocking request.')
      return { success: false, remaining: 0 }
    }
    console.warn('Rate limiting not configured in dev — allowing request.')
    return { success: true, remaining: 999 }
  }

  try {
    const { Ratelimit } = await import('@upstash/ratelimit')
    const { Redis } = await import('@upstash/redis')
    
    const redis = Redis.fromEnv()
    
    const prefix = identifier === 'login' ? 'rate_limit:signin' : 'rate_limit:forgot_password'
    
    const ratelimit = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(5, '10 m'),
      analytics: true,
      prefix,
    })

    const { success, remaining } = await ratelimit.limit(ip)
    return { success, remaining }
  } catch (error) {
    if (process.env.NODE_ENV === 'production') {
      console.error('Rate limiting failed:', error)
      return { success: false, remaining: 0 }
    }
    console.warn('Rate limiting failed in dev — allowing request.', error)
    return { success: true, remaining: 999 }
  }
}
