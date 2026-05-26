/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client'],
  },
  async headers() {
    return [
      {
        // Apply these headers to all routes in the application
        source: '/(.*)',
        headers: [
          {
            // Security: Prevent clickjacking attacks by ensuring this site cannot be embedded in an iframe
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            // Security: Prevent MIME sniffing attacks so the browser respects our declared content types
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            // Security: Control referrer leakage to prevent sensitive URLs from leaking to third parties
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            // Security: Restrict powerful browser features
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ]
  },
}

export default nextConfig
