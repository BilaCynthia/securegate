'use client'

import { useState } from 'react'
import Link from 'next/link'
import { LogoMark } from '@/components/ui/LogoMark'
import { TextField } from '@/components/ui/TextField'
import { Button } from '@/components/ui/Button'
import { Alert } from '@/components/ui/Alert'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'sent' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')

    try {
      await fetch('/api/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      // Security: Always show success regardless of server response to prevent enumeration
      setStatus('sent')
    } catch {
      setStatus('error')
    }
  }

  return (
    <main className="auth-page">
      <div className="auth-card">
        <LogoMark />
        <h1 className="auth-card__heading">Reset password</h1>
        <p className="auth-card__subheading">
          Enter your email and we'll send you a reset link valid for 1 hour.
        </p>

        {status === 'sent' ? (
          <div className="status-card">
            <div className="status-card__icon status-card__icon--success" aria-hidden="true">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6L9 17l-5-5"/>
              </svg>
            </div>
            <p className="status-card__heading">Check your inbox</p>
            <p className="status-card__body">
              If an account exists for <strong>{email}</strong>, a password reset link has been sent.
            </p>
            <Link href="/login" className="btn btn--primary" style={{ display: 'inline-flex', width: 'auto', padding: '0 24px' }}>
              Back to Sign in
            </Link>
          </div>
        ) : (
          <>
            {status === 'error' && (
              <Alert variant="error">Something went wrong. Please try again.</Alert>
            )}
            <form className="form" onSubmit={handleSubmit} noValidate>
              <TextField
                id="forgot-email"
                label="Email address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                placeholder="you@example.com"
                disabled={status === 'loading'}
                required
              />
              <Button type="submit" loading={status === 'loading'}>
                Send reset link
              </Button>
            </form>

            <p className="form-footer">
              Remembered it?{' '}
              <Link href="/login" className="form-footer__link">Back to Sign in</Link>
            </p>
          </>
        )}
      </div>
    </main>
  )
}
