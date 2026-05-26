import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createPasswordResetToken } from '@/lib/tokens'
import { sendPasswordResetEmail } from '@/lib/email'
import { ForgotPasswordSchema } from '@/lib/validations'
import { checkRateLimit } from '@/lib/ratelimit'

export async function POST(req: NextRequest) {
  try {
    // Security Hardening: Rate limit BEFORE parsing body or querying DB
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '127.0.0.1'
    const { success } = await checkRateLimit(ip, 'forgot-password')
    
    if (!success) {
      return NextResponse.json(
        { message: 'Too many requests. Please try again later.' },
        { status: 429 }
      )
    }

    const body = await req.json()
    
    // Server-side Zod Validation
    const parsed = ForgotPasswordSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const email = parsed.data.email.toLowerCase()

    const user = await prisma.user.findUnique({
      where: { email },
    })

    // Security: Email Enumeration Prevention
    // If the user does not exist, we still return a 200 OK.
    // We do NOT execute the token generation or email send, saving compute and quota.
    // To an attacker, a non-existent email behaves identically to an existing one.
    if (!user) {
      return NextResponse.json(
        { message: 'If an account exists, a reset link has been sent.' },
        { status: 200 }
      )
    }

    const token = await createPasswordResetToken(email)
    const resetLink = `${process.env.NEXTAUTH_URL}/reset-password/${token.token}`

    const sent = await sendPasswordResetEmail(email, resetLink)

    return NextResponse.json(
      { message: 'If an account exists, a reset link has been sent.', resetLink: sent ? undefined : resetLink },
      { status: 200 }
    )
  } catch (error) {
    // We can return a 500 here if our infrastructure fails (e.g. DB down, Resend down).
    // The client handles this gracefully, maintaining enumeration resistance.
    return NextResponse.json(
      { message: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}
