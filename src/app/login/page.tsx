'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { LogoMark } from '@/components/ui/LogoMark'
import { TextField } from '@/components/ui/TextField'
import { PasswordField } from '@/components/ui/PasswordField'
import { Button } from '@/components/ui/Button'
import { Alert } from '@/components/ui/Alert'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
    })

    setLoading(false)

    if (result?.error) {
      setError('Invalid email or password. Please try again.')
    } else {
      router.push('/dashboard')
      router.refresh()
    }
  }

  return (
    <main className="auth-page">
      <div className="auth-card">
        <LogoMark />
        <h1 className="auth-card__heading">Welcome back</h1>
        <p className="auth-card__subheading">Sign in to your account to continue.</p>

        {error && <Alert variant="error">{error}</Alert>}

        <form className="form" onSubmit={handleSubmit} noValidate>
          <TextField
            id="login-email"
            label="Email address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            placeholder="you@example.com"
            disabled={loading}
            required
          />

          {/* Password field row with inline forgot-password link */}
          <div className="field">
            <div className="field__label-row">
              <label htmlFor="login-password" className="field__label">Password</label>
              <Link
                href="/forgot-password"
                className="form-footer__link"
                style={{ fontSize: 'var(--typo-body-small-font-size)' }}
              >
                Forgot password?
              </Link>
            </div>
            <div className="field__input-wrap">
              <input
                id="login-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                autoComplete="current-password"
                placeholder="••••••••"
                required
                className="field__input field__input--password"
              />
            </div>
          </div>

          <Button type="submit" loading={loading}>
            Sign in
          </Button>
        </form>

        <p className="form-footer">
          Don't have an account?{' '}
          <Link href="/signup" className="form-footer__link">Create one</Link>
        </p>
      </div>
    </main>
  )
}
