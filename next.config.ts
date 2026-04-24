import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    // In development, proxy API calls to local FastAPI server
    // In production, Vercel handles /api routes automatically
    if (process.env.NODE_ENV === 'development') {
      return [
        {
          source: '/api/:path*',
          destination: 'http://localhost:8000/api/:path*',
        },
      ];
    }
    return [];
  },
};

export default nextConfig;
