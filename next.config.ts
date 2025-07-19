
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

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
  // REMOVE these two lines in production for safety
  // They are dangerous if left on in deployed environments
  // Only use them temporarily during local development if needed
  // typescript: {
  //   ignoreBuildErrors: true,
  // },
  // eslint: {
  //   ignoreDuringBuilds: true,
  // },
});

module.exports = nextConfig;
