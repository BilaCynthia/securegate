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

interface VerificationEmailProps {
  verificationLink: string
}

export function VerificationEmail({ verificationLink }: VerificationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Verify your email address for SecureGate</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Verify your email address</Heading>
          <Text style={text}>
            Please confirm your email address by clicking the button below. 
            This link will expire in 15 minutes for your security.
          </Text>
          <Button href={verificationLink} style={button}>
            Verify Email
          </Button>
          <Text style={text}>
            If the button doesn't work, copy and paste this URL into your browser:
          </Text>
          <Text style={text}>{verificationLink}</Text>
          <Text style={text}>
            If you did not request this email, you can safely ignore it.
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
