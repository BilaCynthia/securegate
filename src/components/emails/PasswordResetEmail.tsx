import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
} from '@react-email/components'
import * as React from 'react'

interface PasswordResetEmailProps {
  resetLink: string
}

export function PasswordResetEmail({ resetLink }: PasswordResetEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Reset your password for SecureGate</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Reset your password</Heading>
          <Text style={text}>
            Someone recently requested a password change for your account. 
            If this was you, you can set a new password here:
          </Text>
          <Button href={resetLink} style={button}>
            Reset Password
          </Button>
          <Text style={text}>
            This link will expire in 1 hour for your security.
          </Text>
          <Text style={text}>
            If the button doesn't work, copy and paste this URL into your browser:
          </Text>
          <Text style={text}>{resetLink}</Text>
          <Text style={text}>
            If you did not request a password reset, you can safely ignore this email 
            and your password will remain unchanged.
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
}

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '40px 20px',
}

const h1 = {
  color: '#333',
  fontSize: '24px',
  fontWeight: '600',
  lineHeight: '40px',
  margin: '0 0 20px',
}

const text = {
  color: '#333',
  fontSize: '14px',
  lineHeight: '24px',
}

const button = {
  backgroundColor: '#000000',
  borderRadius: '4px',
  color: '#fff',
  fontSize: '14px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  width: '210px',
  padding: '14px 7px',
  marginTop: '24px',
  marginBottom: '24px',
}
