import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  })

  // 1. Session Existence Check (Authentication)
  // If the user has no JWT token, they are not logged in.
  if (!token) {
    return NextResponse.redirect(new URL('/signup', request.url))
  }

  // 3. Authenticated
  return NextResponse.next()
}

export const config = {
  // Only match protected routes. Never match auth routes like /login or /signup,
  // otherwise unauthenticated users hit infinite redirect loops.
  matcher: ['/dashboard/:path*'],
}
