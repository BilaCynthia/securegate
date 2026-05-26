import Link from 'next/link'
import { LogoMark } from '@/components/ui/LogoMark'

export default function VerifyEmailPrompt() {
  return (
    <main className="auth-page">
      <div className="auth-card">
        <LogoMark />
        <div className="status-card">
          <div className="status-card__icon status-card__icon--success" aria-hidden="true">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
          </div>
          <p className="status-card__heading">Check your email</p>
          <p className="status-card__body">
            You need to verify your email before accessing the dashboard.
            We've sent a verification link — check your inbox and spam folder.
          </p>
          <Link href="/login" className="form-footer__link">
            Back to Sign in
          </Link>
        </div>
      </div>
    </main>
  )
}
