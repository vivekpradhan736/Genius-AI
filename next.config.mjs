/** @type {import('next').NextConfig} */
import path from 'path';

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'fal.media',
      },
    ],
  },
  webpack: (config) => {
    config.resolve.alias['@'] = path.resolve('./');
    return config;
  },
  async rewrites() {
    return [
      {
        source: '/uploads/:path*',
        destination: '/uploads/:path*', // Allows serving files from the uploads directory
      },
    ];
  },
};

export default nextConfig;
