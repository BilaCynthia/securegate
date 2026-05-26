export async function checkRateLimit(
  ip: string,
  identifier: 'login' | 'forgot-password'
): Promise<{ success: boolean; remaining: number }> {
  const redisConfigured = !!(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN)
  
  if (!redisConfigured) {
    console.warn('Rate limiting not configured — allowing request.')
    return { success: true, remaining: 999 }
  }

  try {
    const { Ratelimit } = await import('@upstash/ratelimit')
    const { Redis } = await import('@upstash/redis')
    
    const redis = Redis.fromEnv()
    
    const prefix = identifier === 'login' ? 'rate_limit:signin' : 'rate_limit:forgot_password'
    
    const limits = {
      'login': { max: 5, window: '10 m' as const },
      'forgot-password': { max: 3, window: '1 h' as const },
    }

    const { max, window } = limits[identifier]

    const ratelimit = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(max, window),
      analytics: true,
      prefix,
    })

    const { success, remaining } = await ratelimit.limit(ip)
    return { success, remaining }
  } catch (error) {
    console.warn('Rate limiting failed — allowing request.', error)
    return { success: true, remaining: 999 }
  }
}
