# Technical Debt

## React Email components defined but unused

`src/components/emails/` contains two React Email templates (`VerificationEmail.tsx`, `PasswordResetEmail.tsx`) that are never imported. The actual email sending in `src/lib/email.ts` uses inline HTML strings instead. This is dead code.

**Why it happened:** The React Email components were created first as the ideal approach, but during implementation the inline HTML approach was chosen for simplicity (no JSX rendering pipeline needed in the email utility). The React Email files were never removed.

**Fix:** Either wire them into `email.ts` via `render()`, or delete them and their dependency on `@react-email/components`.

---

## Tailwind CSS configured but unused

`tailwind.config.ts` exists with content paths and theme extensions, but all styling is done via CSS custom properties in `globals.css`. Tailwind is a build dependency that contributes nothing to the output.

**Why it happened:** Tailwind was part of the initial Next.js scaffold and was never stripped out when the decision was made to use plain CSS custom properties for the design system.

**Fix:** Remove `tailwind.config.ts`, `postcss.config.mjs`, and the Tailwind directives from `globals.css`, then uninstall Tailwind dependencies.

---

## Manual session cookie in verify-email

`src/app/api/verify-email/route.ts` manually creates a `next-auth.session-token` cookie using `encode()` from `next-auth/jwt`, bypassing NextAuth's standard sign-in flow. This duplicates session creation logic and could diverge from NextAuth's internal behavior.

**Why it happened:** After email verification, the user should be logged in immediately rather than being redirected to the login page. NextAuth doesn't expose a server-side `signIn()` for the credentials provider, so the session token is constructed directly.

**Fix:** If NextAuth adds a server-side `signIn()` API in the future, migrate to it. Alternatively, redirect to `/login` after verification (trade-off: worse UX).
