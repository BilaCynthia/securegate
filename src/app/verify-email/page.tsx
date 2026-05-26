'use client'

import { Suspense, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { LogoMark } from '@/components/ui/LogoMark'
import { Alert } from '@/components/ui/Alert'

function VerifyEmailPrompt() {
  const searchParams = useSearchParams()
  const email = searchParams.get('email') ?? ''

  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleResend() {
    setError(null)
    setLoading(true)

    try {
      const res = await fetch('/api/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()
      if (res.ok) {
        setSent(true)
      } else {
        setError(data.message ?? 'Something went wrong.')
      }
    } catch {
      setError('Unable to connect. Please try again.')
    } finally {
      setLoading(false)
    }
  }

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
            We sent a verification link — check your inbox and spam folder.
          </p>

          {error && <Alert variant="error">{error}</Alert>}

          {sent ? (
            <p className="status-card__body" style={{ marginTop: '8px', color: 'var(--color-success)' }}>
              Verification email resent!
            </p>
          ) : (
            <p className="status-card__body" style={{ marginTop: '8px' }}>
              Did not receive it?{' '}
              <button
                onClick={handleResend}
                disabled={loading || !email}
                className="form-footer__link"
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: 'inherit' }}
              >
                {loading ? 'Sending...' : 'Resend email'}
              </button>
            </p>
          )}

          <Link href="/login" className="form-footer__link" style={{ display: 'inline-block', marginTop: '16px' }}>
            Back to Sign in
          </Link>
          </div>
        </div>
      </main>
    )
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={null}>
      <VerifyEmailPrompt />
    </Suspense>
  )
}