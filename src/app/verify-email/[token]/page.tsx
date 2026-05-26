'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { LogoMark } from '@/components/ui/LogoMark'

export default function VerifyEmailTokenPage({
  params,
}: {
  params: { token: string }
}) {
  const router = useRouter()
  const [status, setStatus] = useState<'loading' | 'success' | 'invalid' | 'expired' | 'error'>('loading')

  useEffect(() => {
    async function verify() {
      try {
        const res = await fetch('/api/verify-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: params.token }),
        })

        const data = await res.json()

        if (res.ok && data.success) {
          setStatus('success')
          setTimeout(() => router.push('/dashboard'), 500)
        } else if (data.message === 'Link expired.') {
          setStatus('expired')
        } else {
          setStatus('invalid')
        }
      } catch {
        setStatus('error')
      }
    }

    verify()
  }, [params.token, router])

  if (status === 'loading') {
    return (
      <main className="auth-page">
        <div className="auth-card">
          <LogoMark />
          <div className="status-card">
            <p className="status-card__heading">Verifying your email...</p>
          </div>
        </div>
      </main>
    )
  }

  if (status === 'success') {
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
            <p className="status-card__heading">Email verified!</p>
            <p className="status-card__body">Redirecting to dashboard...</p>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="auth-page">
      <div className="auth-card">
        <LogoMark />
        {status === 'invalid' && (
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
        )}
        {status === 'expired' && (
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
        )}
        {status === 'error' && (
          <div className="status-card">
            <p className="status-card__heading">Something went wrong</p>
            <p className="status-card__body">Please try again or sign in.</p>
            <Link href="/login" className="btn btn--primary" style={{ display: 'inline-flex', width: 'auto', padding: '0 24px' }}>
              Go to Sign in
            </Link>
          </div>
        )}
      </div>
    </main>
  )
}
