import NextAuth from 'next-auth'
import { authOptions } from '@/lib/auth'
import { NextRequest, NextResponse } from 'next/server'
import { checkRateLimit } from '@/lib/ratelimit'

type RouteContext = { params: Record<string, string | string[]> }

const handler = NextAuth(authOptions)

export async function GET(req: NextRequest, ctx: RouteContext) {
  return handler(req, ctx)
}

export async function POST(req: NextRequest, ctx: RouteContext) {
  // Security Hardening: Rate limit the credentials callback BEFORE NextAuth processing.
  // This intercepts the brute-force attempt before NextAuth parses the body, 
  // hits the database, or runs expensive bcrypt comparisons.
  if (req.nextUrl.pathname.includes('/api/auth/callback/credentials')) {
    // Extract IP from Vercel's x-forwarded-for header or fallback to localhost
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '127.0.0.1'
    
    const { success } = await checkRateLimit(ip, 'login')
    
    if (!success) {
      return NextResponse.json(
        { message: 'Too many login attempts. Please try again later.' },
        { status: 429 }
      )
    }
  }

  return handler(req, ctx)
}
