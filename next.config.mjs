/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // app router is on by default in Next 14
  experimental: {
    serverActions: { allowedOrigins: ['localhost:3000'] },
  },
};

export default nextConfig;
