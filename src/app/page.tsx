import { redirect } from 'next/navigation'

export default function HomePage() {
  // SecureGate is primarily an authentication infrastructure layer.
  // We automatically route users hitting the root domain to the login flow.
  redirect('/signup')
}
