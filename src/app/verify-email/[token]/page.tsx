import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { LogoMark } from '@/components/ui/LogoMark'

export default async function VerifyEmailPage({
  params,
}: {
  params: { token: string }
}) {
  const { token } = params

  const verificationToken = await prisma.verificationToken.findUnique({
    where: { token },
  })

  if (!verificationToken) {
    return (
      <main className="auth-page">
        <div className="auth-card">
          <LogoMark />
          <div className="status-card">
            <div className="status-card__icon status-card__icon--error" aria-hidden="true">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
              </svg>
            </div>
            <p className="status-card__heading">Invalid link</p>
            <p className="status-card__body">
              This verification link is invalid or has already been used. You can sign in or request a new link.
            </p>
            <Link href="/login" className="btn btn--primary" style={{ display: 'inline-flex', width: 'auto', padding: '0 24px' }}>
              Go to Sign in
            </Link>
          </div>
        </div>
      </main>
    )
  }

  if (verificationToken.expires < new Date()) {
    await prisma.verificationToken.delete({ where: { token } })
    return (
      <main className="auth-page">
        <div className="auth-card">
          <LogoMark />
          <div className="status-card">
            <div className="status-card__icon status-card__icon--error" aria-hidden="true">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
              </svg>
            </div>
            <p className="status-card__heading">Link expired</p>
            <p className="status-card__body">
              Verification links expire after 15 minutes for your security. Sign in to request a new one.
            </p>
            <Link href="/login" className="btn btn--primary" style={{ display: 'inline-flex', width: 'auto', padding: '0 24px' }}>
              Back to Sign in
            </Link>
          </div>
        </div>
      </main>
    )
  }

  await prisma.$transaction([
    prisma.user.update({
      where: { email: verificationToken.identifier },
      data: { emailVerified: new Date() },
    }),
    prisma.verificationToken.delete({ where: { token } }),
  ])

  return (
    <main className="auth-page">
      <div className="auth-card">
        <LogoMark />
        <div className="status-card">
          <div className="status-card__icon status-card__icon--success" aria-hidden="true">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6L9 17l-5-5"/>
            </svg>
          </div>
          <p className="status-card__heading">Email verified</p>
          <p className="status-card__body">
            Your email address has been verified successfully. You can now sign in.
          </p>
          <Link href="/login" className="btn btn--primary" style={{ display: 'inline-flex', width: 'auto', padding: '0 24px' }}>
            Sign in
          </Link>
        </div>
      </div>
    </main>
  )
}
