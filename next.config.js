/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost', 'your-image-hosting.com'],
  },
  typescript: {
    // No config needed for basic setup
  },
};

module.exports = nextConfig;