import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Empaqueta únicamente el servidor y las dependencias necesarias para
  // ejecutar Next.js en la imagen final de Docker.
  output: 'standalone',
  distDir: process.env.NODE_ENV === 'development' ? '.next-dev' : '.next',
  async redirects() {
    return [
      {
        source: '/demo-:slug',
        destination: '/demo/:slug',
        permanent: false,
      },
    ];
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
    ],
  },
};

export default nextConfig;
