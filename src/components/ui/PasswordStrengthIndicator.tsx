'use client'

interface StrengthLevel {
  label: string
  score: 0 | 1 | 2 | 3 | 4
}

function getStrength(password: string): StrengthLevel {
  if (!password) return { label: '', score: 0 }

  let score = 0
  if (password.length >= 8) score++
  if (password.length >= 12) score++
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++

  if (score <= 1) return { label: 'Weak', score: 1 }
  if (score === 2) return { label: 'Fair', score: 2 }
  if (score === 3) return { label: 'Good', score: 3 }
  return { label: 'Strong', score: 4 }
}

const MODIFIER: Record<number, string> = {
  1: 'weak',
  2: 'fair',
  3: 'good',
  4: 'strong',
}

export function PasswordStrengthIndicator({ password }: { password: string }) {
  const { label, score } = getStrength(password)

  if (!password) return null

  const modifier = MODIFIER[score] ?? 'weak'

  return (
    <div className="strength" aria-label={`Password strength: ${label}`}>
      <div className="strength__bars" aria-hidden="true">
        {[1, 2, 3, 4].map((bar) => (
          <div
            key={bar}
            className={`strength__bar${bar <= score ? ` strength__bar--${modifier}` : ''}`}
          />
        ))}
      </div>
      <span className={`strength__label strength__label--${modifier}`}>
        {label}
      </span>
    </div>
  )
}
