/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Add this if you're using static export
  output: process.env.NEXT_OUTPUT_MODE || "standalone",
};

module.exports = nextConfig;
