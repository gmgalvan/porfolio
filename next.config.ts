/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizeCss: true,
  },
  typescript: {
    // Warning: This allows production builds to succeed even if there are type errors.
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
