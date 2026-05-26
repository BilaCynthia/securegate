'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { LogoMark } from '@/components/ui/LogoMark'
import { PasswordField } from '@/components/ui/PasswordField'
import { PasswordStrengthIndicator } from '@/components/ui/PasswordStrengthIndicator'
import { Button } from '@/components/ui/Button'
import { Alert } from '@/components/ui/Alert'

export function ResetPasswordForm({ token }: { token: string }) {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    setErrorMessage(null)

    try {
      const res = await fetch('/api/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setStatus('error')
        setErrorMessage(data.message ?? 'Unable to reset password. Please try again.')
        return
      }

      setStatus('success')
      setTimeout(() => router.push('/login'), 2500)
    } catch {
      setStatus('error')
      setErrorMessage('Something went wrong. Please check your connection and try again.')
    }
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
            <p className="status-card__heading">Password updated</p>
            <p className="status-card__body">
              Your password has been changed successfully. Redirecting you to sign in…
            </p>
            <Link href="/login" className="btn btn--primary" style={{ display: 'inline-flex', width: 'auto', padding: '0 24px' }}>
              Sign in now
            </Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="auth-page">
      <div className="auth-card">
        <LogoMark />
        <h1 className="auth-card__heading">Set new password</h1>
        <p className="auth-card__subheading">
          Choose a strong password you haven't used before.
        </p>

        {errorMessage && <Alert variant="error">{errorMessage}</Alert>}

        <form className="form" onSubmit={handleSubmit} noValidate>
          <div className="field">
            <PasswordField
              id="reset-password"
              label="New password"
              value={password}
              onChange={setPassword}
              disabled={status === 'loading'}
              autoComplete="new-password"
              placeholder="Min. 8 characters"
            />
            <PasswordStrengthIndicator password={password} />
          </div>

          <Button type="submit" loading={status === 'loading'}>
            Update password
          </Button>
        </form>
      </div>
    </main>
  )
}
