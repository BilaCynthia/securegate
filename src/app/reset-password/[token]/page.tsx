import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { LogoMark } from '@/components/ui/LogoMark'
import { ResetPasswordForm } from './ResetPasswordForm'

export default async function ResetPasswordPage({
  params,
}: {
  params: { token: string }
}) {
  const { token } = params

  const resetToken = await prisma.passwordResetToken.findUnique({
    where: { token },
  })

  if (!resetToken) {
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
              This password reset link is invalid or has already been used. Please request a new one.
            </p>
            <Link href="/forgot-password" className="btn btn--primary" style={{ display: 'inline-flex', width: 'auto', padding: '0 24px' }}>
              Request new link
            </Link>
          </div>
        </div>
      </main>
    )
  }

  if (resetToken.expires < new Date()) {
    await prisma.passwordResetToken.delete({ where: { token } })
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
              This link expired after 1 hour for your security. Please request a fresh reset link.
            </p>
            <Link href="/forgot-password" className="btn btn--primary" style={{ display: 'inline-flex', width: 'auto', padding: '0 24px' }}>
              Request new link
            </Link>
          </div>
        </div>
      </main>
    )
  }

  return <ResetPasswordForm token={token} />
}
