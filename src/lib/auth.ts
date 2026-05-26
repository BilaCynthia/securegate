import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from '@/lib/prisma'
import { verifyPassword } from '@/lib/password'

export const authOptions: NextAuthOptions = {
  // Use JWT for sessions because:
  // 1. Scalability: Stateless JWTs don't require database lookups on every request, 
  //    which is crucial for serverless environments (like Vercel) where connection pooling is a bottleneck.
  // 2. Operational simplicity: No need to prune expired database sessions.
  // Tradeoffs: Immediate session revocation requires a blacklist or waiting for expiry. 
  // For most auth systems, a short-lived JWT is the standard compromise.
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/signup',
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email.toLowerCase() }
        })

        // We return null on failure, which NextAuth translates to a generic error.
        // We do not leak if the email exists or if the password was wrong.
        if (!user) {
          return null
        }

        const isValidPassword = await verifyPassword(credentials.password, user.password)

        if (!isValidPassword) {
          return null
        }

        // Return user object without the password hash
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          emailVerified: user.emailVerified,
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.emailVerified = (user as any).emailVerified ?? null
      }
      
      // Refresh emailVerified on subsequent requests for newly-verified users
      // This allows a user to verify their email in another tab and have their 
      // active session automatically pick up the verified state without re-logging in.
      if (token.id && !token.emailVerified) {
        const dbUser = await prisma.user.findUnique({ where: { id: token.id as string } })
        token.emailVerified = dbUser?.emailVerified ?? null
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).id = token.id;
        (session.user as any).emailVerified = token.emailVerified as Date | null;
      }
      return session
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
}
