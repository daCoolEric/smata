/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Add this if you're using static export
  output: process.env.NEXT_OUTPUT_MODE || "standalone",
  experimental: {
    serverComponentsExternalPackages: ["pdfjs-dist"],
  },
  serverExternalPackages: ["@supabase/supabase-js"],
};

module.exports = nextConfig;
