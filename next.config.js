const { withContentlayer } = require('next-contentlayer');

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.scdn.co',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      }
    ],
  },
  env: {
    ENABLED_GLOBE_3D: process.env.ENABLED_GLOBE_3D || 'true',
    ENABLED_CPH_DEMO: process.env.ENABLED_CPH_DEMO || 'true',
  }
};

module.exports = withContentlayer(nextConfig);