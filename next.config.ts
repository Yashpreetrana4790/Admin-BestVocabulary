import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Use separate writable cache dirs to avoid locked ".next*" folders on Windows.
  distDir: process.env.NODE_ENV === "development" ? "next-dev-cache" : "next-build-cache",
  transpilePackages: ['emoji-picker-react'],
};

export default nextConfig;
