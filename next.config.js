/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'velog.velcdn.com',
      },
    ],
  },
}

// eslint-disable-next-line import/no-commonjs
module.exports = nextConfig
