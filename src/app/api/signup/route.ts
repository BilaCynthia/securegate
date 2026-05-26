import { NextRequest, NextResponse } from 'next/server'
import { SignUpSchema } from '@/lib/validations'
import { hashPassword } from '@/lib/password'
import { prisma } from '@/lib/prisma'
import { createVerificationToken } from '@/lib/tokens'
import { sendVerificationEmail } from '@/lib/email'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    
    // Server-side validation using Zod
    const parsed = SignUpSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const { name, email, password } = parsed.data
    const lowercaseEmail = email.toLowerCase()

    // Check if the user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: lowercaseEmail }
    })

    if (existingUser) {
      if (!existingUser.emailVerified) {
        const token = await createVerificationToken(lowercaseEmail)
        const verificationLink = `${process.env.NEXTAUTH_URL}/verify-email/${token.token}`
        
        const sent = await sendVerificationEmail(lowercaseEmail, verificationLink)
        
        return NextResponse.json(
          { message: 'Check your email to verify your account.', verificationLink: sent ? undefined : verificationLink },
          { status: 201 }
        )
      }
      
      return NextResponse.json(
        { message: 'An account with this email already exists.' },
        { status: 409 }
      )
    }

    const hashedPassword = await hashPassword(password)

    await prisma.user.create({
      data: { 
        name, 
        email: lowercaseEmail, 
        password: hashedPassword,
        emailVerified: null,
      },
    })

    const token = await createVerificationToken(lowercaseEmail)
    const verificationLink = `${process.env.NEXTAUTH_URL}/verify-email/${token.token}`
        
    const sent = await sendVerificationEmail(lowercaseEmail, verificationLink)

    return NextResponse.json(
      { message: 'Check your email to verify your account.', verificationLink: sent ? undefined : verificationLink },
      { status: 201 }
    )
  } catch (error: any) {
    if (error?.code === 'P2002') {
      return NextResponse.json(
        { message: 'An account with this email already exists.' },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { message: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}
