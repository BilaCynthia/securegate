import * as React from 'react'

interface AlertProps {
  variant: 'error' | 'success'
  children: React.ReactNode
}

export function Alert({ variant, children }: AlertProps) {
  return (
    <div role="alert" className={`alert alert--${variant}`}>
      {children}
    </div>
  )
}
