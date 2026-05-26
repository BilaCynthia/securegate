import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ResetPasswordSchema } from '@/lib/validations'
import { hashPassword } from '@/lib/password'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    
    // Server-side Zod Validation
    const parsed = ResetPasswordSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { errors: parsed.error.flatten().fieldErrors, message: 'Invalid input.' },
        { status: 400 }
      )
    }

    const { token, password } = parsed.data

    // Lookup token
    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token },
    })

    // Security: Token Replay & Tampering Protection
    if (!resetToken) {
      return NextResponse.json({ message: 'Invalid or expired link.' }, { status: 400 })
    }

    // Check expiry
    const isExpired = resetToken.expires < new Date()
    if (isExpired) {
      // Invalidate immediately
      await prisma.passwordResetToken.delete({ where: { token } })
      return NextResponse.json({ message: 'Invalid or expired link.' }, { status: 400 })
    }

    // Hash new password using 12 salt rounds
    const hashedPassword = await hashPassword(password)

    // Security: Atomic Transaction
    // Update the user password AND delete the reset token in a single operation.
    // This absolutely guarantees that the token becomes single-use and prevents 
    // race conditions where a token could theoretically be reused.
    await prisma.$transaction([
      prisma.user.update({
        where: { email: resetToken.email },
        data: { password: hashedPassword },
      }),
      prisma.passwordResetToken.delete({
        where: { token },
      })
    ])

    return NextResponse.json({ message: 'Password updated successfully.' }, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { message: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}
