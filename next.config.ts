import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: process.env.NODE_ENV === 'production'
          ? '/api/:path*'  // In production, Vercel will handle the API routes
          : 'http://localhost:8000/api/:path*', // In development, proxy to local FastAPI
      },
    ];
  },
};

export default nextConfig;
