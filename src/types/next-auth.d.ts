import NextAuth from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      name: string
      // Surface emailVerified on the session object
      emailVerified: Date | null
    }
  }
  interface User {
    // Make sure the User type expects this from our authorize() return
    emailVerified: Date | null
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    // Store emailVerified inside the JWT so middleware can access it without DB lookups
    emailVerified: Date | null
  }
}
