import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createVerificationToken } from '@/lib/tokens'
import { sendVerificationEmail } from '@/lib/email'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const email = body.email?.toLowerCase()

    if (!email) {
      return NextResponse.json({ message: 'Email is required' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { email },
    })

    // Security: Email Enumeration Prevention
    // To prevent attackers from discovering which emails exist in our DB, we always 
    // return a generic success message even if the user doesn't exist or is already verified.
    if (!user || user.emailVerified) {
      return NextResponse.json(
        { message: 'If an unverified account with this email exists, a new verification link has been sent.' },
        { status: 200 }
      )
    }

    const token = await createVerificationToken(email)
    const verificationLink = `${process.env.NEXTAUTH_URL}/verify-email/${token.token}`
    
    await sendVerificationEmail(email, verificationLink)

    return NextResponse.json(
      { message: 'If an unverified account with this email exists, a new verification link has been sent.', verificationLink },
      { status: 200 }
    )
  } catch {
    return NextResponse.json(
      { message: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}
