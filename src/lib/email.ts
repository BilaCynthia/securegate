export async function sendVerificationEmail(to: string, verificationLink: string): Promise<boolean> {
  const resendConfigured = !!(process.env.RESEND_API_KEY && process.env.RESEND_API_KEY.length > 0)

  if (!resendConfigured) {
    logDevFallback('Verification', to, verificationLink)
    return false
  }

  try {
    const { Resend } = await import('resend')
    const resend = new Resend(process.env.RESEND_API_KEY)
    
    await resend.emails.send({
      from: 'SecureGate <onboarding@resend.dev>',
      to,
      subject: 'Verify your email address',
      html: createVerificationEmailHtml(verificationLink),
    })
    return true
  } catch (error) {
    console.error('Failed to send verification email via Resend:', error)
    logDevFallback('Verification', to, verificationLink)
    return false
  }
}

export async function sendPasswordResetEmail(to: string, resetLink: string): Promise<boolean> {
  const resendConfigured = !!(process.env.RESEND_API_KEY && process.env.RESEND_API_KEY.length > 0)

  if (!resendConfigured) {
    logDevFallback('Password reset', to, resetLink)
    return false
  }

  try {
    const { Resend } = await import('resend')
    const resend = new Resend(process.env.RESEND_API_KEY)
    
    await resend.emails.send({
      from: 'SecureGate <security@resend.dev>',
      to,
      subject: 'Reset your password',
      html: createPasswordResetEmailHtml(resetLink),
    })
    return true
  } catch (error) {
    console.error('Failed to send password reset email via Resend:', error)
    logDevFallback('Password reset', to, resetLink)
    return false
  }
}

function logDevFallback(type: string, to: string, link: string) {
  console.log(`📧 [DEV] ${type} email not delivered — manually visit the link to continue:`)
  console.log(`   To: ${to}`)
  console.log(`   Link: ${link}`)
}

function createVerificationEmailHtml(verificationLink: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Verify your email address</title>
    </head>
    <body style="background-color: #f6f9fc; font-family: -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Ubuntu,sans-serif; margin: 0; padding: 0;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td align="center" style="padding: 40px 20px;">
            <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 500px; background-color: #ffffff; padding: 40px 20px;">
              <tr>
                <td style="text-align: left;">
                  <h1 style="color: #333; font-size: 24px; font-weight: 600; line-height: 40px; margin: 0 0 20px;">Verify your email address</h1>
                  <p style="color: #333; font-size: 14px; line-height: 24px; margin: 0 0 14px;">
                    Please confirm your email address by clicking the button below. This link will expire in 15 minutes for your security.
                  </p>
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td align="left">
                        <a href="${verificationLink}" style="background-color: #000000; border-radius: 4px; color: #fff; display: block; font-size: 14px; font-weight: 600; padding: 14px 7px; text-align: center; text-decoration: none; width: 210px; margin-top: 24px; margin-bottom: 24px;">
                          Verify Email
                        </a>
                      </td>
                    </tr>
                  </table>
                  <p style="color: #333; font-size: 14px; line-height: 24px; margin: 0 0 14px;">
                    If the button doesn't work, copy and paste this URL into your browser:
                  </p>
                  <p style="color: #333; font-size: 14px; line-height: 24px; margin: 0 0 14px; word-break: break-all;">
                    ${verificationLink}
                  </p>
                  <p style="color: #333; font-size: 14px; line-height: 24px; margin: 0;">
                    If you did not request this email, you can safely ignore it.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `.trim()
}

function createPasswordResetEmailHtml(resetLink: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Reset your password</title>
    </head>
    <body style="background-color: #f6f9fc; font-family: -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Ubuntu,sans-serif; margin: 0; padding: 0;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td align="center" style="padding: 40px 20px;">
            <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 500px; background-color: #ffffff; padding: 40px 20px;">
              <tr>
                <td style="text-align: left;">
                  <h1 style="color: #333; font-size: 24px; font-weight: 600; line-height: 40px; margin: 0 0 20px;">Reset your password</h1>
                  <p style="color: #333; font-size: 14px; line-height: 24px; margin: 0 0 14px;">
                    You requested to reset your password. Click the button below to choose a new password. This link will expire in 1 hour for your security.
                  </p>
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td align="left">
                        <a href="${resetLink}" style="background-color: #000000; border-radius: 4px; color: #fff; display: block; font-size: 14px; font-weight: 600; padding: 14px 7px; text-align: center; text-decoration: none; width: 210px; margin-top: 24px; margin-bottom: 24px;">
                          Reset Password
                        </a>
                      </td>
                    </tr>
                  </table>
                  <p style="color: #333; font-size: 14px; line-height: 24px; margin: 0 0 14px;">
                    If the button doesn't work, copy and paste this URL into your browser:
                  </p>
                  <p style="color: #333; font-size: 14px; line-height: 24px; margin: 0 0 14px; word-break: break-all;">
                    ${resetLink}
                  </p>
                  <p style="color: #333; font-size: 14px; line-height: 24px; margin: 0;">
                    If you did not request this email, you can safely ignore it.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `.trim()
}
