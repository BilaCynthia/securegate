export function LogoMark() {
  return (
    <div className="auth-card__logo">
      <div className="auth-card__logo-mark" aria-hidden="true">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
          <path d="M7 11V7a5 5 0 0110 0v4"/>
        </svg>
      </div>
      <span className="auth-card__logo-text">SecureGate</span>
    </div>
  )
}
