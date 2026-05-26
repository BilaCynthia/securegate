import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/login')
  }

  return (
    <main style={{
      minHeight: '100dvh',
      display: 'grid',
      placeItems: 'center',
      padding: '24px 16px',
      backgroundColor: 'var(--color-background)',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '520px',
        backgroundColor: 'var(--color-surface-container-lowest)',
        border: '1px solid var(--color-outline-variant)',
        borderRadius: '16px',
        padding: '40px 36px',
        boxShadow: '0 1px 3px hsla(213,49%,12%,0.06), 0 4px 16px hsla(213,49%,12%,0.06)',
      }}>
        <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '44px', height: '44px',
            borderRadius: '50%',
            backgroundColor: 'var(--color-surface-container)',
            display: 'grid', placeItems: 'center',
            flexShrink: 0,
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </div>
          <div>
            <p style={{ fontWeight: 600, color: 'var(--color-on-surface)', fontSize: '16px' }}>
              {session.user?.name}
            </p>
            <p style={{ fontSize: '13px', color: 'var(--color-on-surface-variant)' }}>
              {session.user?.email}
            </p>
          </div>
        </div>

        <h1 style={{
          fontSize: 'var(--typo-headline-small-font-size)',
          fontWeight: 'var(--typo-headline-small-font-weight)',
          letterSpacing: 'var(--typo-headline-small-letter-spacing)',
          color: 'var(--color-on-surface)',
          marginBottom: '8px',
        }}>
          Dashboard
        </h1>
        <p style={{
          fontSize: 'var(--typo-body-medium-font-size)',
          color: 'var(--color-on-surface-variant)',
          marginBottom: '28px',
        }}>
          You are securely authenticated. All authentication phases are complete.
        </p>

        <div style={{
          padding: '16px',
          backgroundColor: 'var(--color-surface-container)',
          borderRadius: '10px',
          marginBottom: '24px',
        }}>
          <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-on-surface)', marginBottom: '8px' }}>
            Session Details
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <p style={{ fontSize: '13px', color: 'var(--color-on-surface-variant)' }}>
              <span style={{ fontWeight: 500, color: 'var(--color-on-surface)' }}>Strategy:</span> Stateless JWT
            </p>
            <p style={{ fontSize: '13px', color: 'var(--color-on-surface-variant)' }}>
              <span style={{ fontWeight: 500, color: 'var(--color-on-surface)' }}>Email Verified:</span>{' '}
              <span style={{ color: 'var(--color-success-text)', fontWeight: 500 }}>✓ Confirmed</span>
            </p>
          </div>
        </div>

        <form action="/api/auth/signout" method="post">
          <button
            type="submit"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '40px',
              padding: '0 20px',
              fontSize: '14px',
              fontWeight: 600,
              borderRadius: '8px',
              border: '1.5px solid var(--color-outline)',
              background: 'none',
              color: 'var(--color-on-surface)',
              cursor: 'pointer',
              transition: 'background-color 0.15s ease',
            }}
          >
            Sign out
          </button>
        </form>
      </div>
    </main>
  )
}
