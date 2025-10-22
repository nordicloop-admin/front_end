/** @type {import('next').NextConfig} */

const nextConfig = {
  images: {
    // domains: ['369d0b822225eb6c7d933f34f4085730.r2.cloudflarestorage.com'],
    remotePatterns: [
      
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      // Cloudflare R2 bucket direct URL
      {
        protocol: 'https',
        hostname: 'nordicloop.foundela.com',
        pathname: '/material_images/**',
      },
      // Backend API domains for material images
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '8000',
        pathname: '/media/**',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '8000',
        pathname: '/images/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/media/**',
      },
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
        pathname: '/nordic-loop.firebasestorage.app/**',
      },
    ],
    unoptimized: false,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
};

module.exports = nextConfig;
