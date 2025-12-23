/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Increase body size limit for large file uploads
  experimental: {
    serverActions: {
      bodySizeLimit: '10gb',
    },
  },
}

module.exports = nextConfig

