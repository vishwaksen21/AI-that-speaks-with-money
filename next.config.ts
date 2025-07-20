
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const isDev = process.env.NODE_ENV === 'development';

/** @type {import('next').NextConfig} */
const nextConfig = withBundleAnalyzer({
  // Add your custom config here
  reactStrictMode: true,
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'firebasestudio-hosting.web.app',
        port: '',
        pathname: '/**',
      }
    ],
  },
  // IMPORTANT: This is the critical change.
  // We only ignore errors in development for faster iteration.
  // Production builds will now fail if there are any errors, ensuring stability.
  ...(isDev && {
    typescript: { ignoreBuildErrors: true },
    eslint: { ignoreDuringBuilds: true },
  }),
});

module.exports = nextConfig;
