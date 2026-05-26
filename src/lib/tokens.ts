import crypto from 'crypto'
import { prisma } from '@/lib/prisma'

export function generateToken(): string {
  // Use crypto.randomBytes(32) for 256 bits of entropy
  // This is cryptographically secure and computationally infeasible to brute-force
  return crypto.randomBytes(32).toString('hex')
}

export async function createVerificationToken(email: string) {
  const token = generateToken()
  const expires = new Date(new Date().getTime() + 15 * 60 * 1000) // 15 minutes strict expiry

  // Upsert or delete previous tokens to prevent infinite token accumulation
  // and invalidate any previously requested but unused tokens.
  await prisma.verificationToken.deleteMany({
    where: { identifier: email },
  })

  const verificationToken = await prisma.verificationToken.create({
    data: {
      identifier: email,
      token,
      expires,
    },
  })

  return verificationToken
}

export async function createPasswordResetToken(email: string) {
  const token = generateToken()
  const expires = new Date(new Date().getTime() + 60 * 60 * 1000) // 1 hour strict expiry

  // Upsert or delete previous tokens to prevent infinite token accumulation
  await prisma.passwordResetToken.deleteMany({
    where: { email },
  })

  const passwordResetToken = await prisma.passwordResetToken.create({
    data: {
      email,
      token,
      expires,
    },
  })

  return passwordResetToken
}
