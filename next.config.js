/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Add this if you're using static export
  output: process.env.NEXT_OUTPUT_MODE || "standalone",
  experimental: {
    serverComponentsExternalPackages: ["pdfjs-dist"],
  },
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },
  serverExternalPackages: ["@supabase/supabase-js"],
};

module.exports = nextConfig;
