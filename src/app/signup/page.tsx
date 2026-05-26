'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { LogoMark } from '@/components/ui/LogoMark'
import { TextField } from '@/components/ui/TextField'
import { PasswordField } from '@/components/ui/PasswordField'
import { PasswordStrengthIndicator } from '@/components/ui/PasswordStrengthIndicator'
import { Button } from '@/components/ui/Button'
import { Alert } from '@/components/ui/Alert'

interface FieldErrors {
  name?: string
  email?: string
  password?: string
}

export default function SignUpPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [globalError, setGlobalError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setFieldErrors({})
    setGlobalError(null)
    setLoading(true)

    try {
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      })

      const data = await res.json()

      if (res.status === 400 && data.errors) {
        // Map Zod field errors directly to the fields
        setFieldErrors({
          name: data.errors.name?.[0],
          email: data.errors.email?.[0],
          password: data.errors.password?.[0],
        })
      } else if (!res.ok) {
        setGlobalError(data.message ?? 'Something went wrong. Please try again.')
      } else {
        const linkParam = data.verificationLink ? `&link=${encodeURIComponent(data.verificationLink)}` : ''
        router.push(`/verify-email?email=${encodeURIComponent(email)}${linkParam}`)
      }
    } catch {
      setGlobalError('Unable to connect. Please check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="auth-page">
      <div className="auth-card">
        <LogoMark />
        <h1 className="auth-card__heading">Create account</h1>
        <p className="auth-card__subheading">Get started with SecureGate today.</p>

        {globalError && <Alert variant="error">{globalError}</Alert>}

        <form className="form" onSubmit={handleSubmit} noValidate>
          <TextField
            id="signup-name"
            label="Full name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
            placeholder="Jane Smith"
            disabled={loading}
            required
            error={fieldErrors.name}
          />

          <TextField
            id="signup-email"
            label="Email address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            placeholder="you@example.com"
            disabled={loading}
            required
            error={fieldErrors.email}
          />

          <div className="field">
            <PasswordField
              id="signup-password"
              label="Password"
              value={password}
              onChange={setPassword}
              disabled={loading}
              autoComplete="new-password"
              placeholder="Min. 8 characters"
              error={fieldErrors.password}
            />
            <PasswordStrengthIndicator password={password} />
          </div>

          <Button type="submit" loading={loading}>
            Create account
          </Button>
        </form>

        <p className="form-footer">
          Already have an account?{' '}
          <Link href="/login" className="form-footer__link">Sign in</Link>
        </p>
      </div>
    </main>
  )
}
