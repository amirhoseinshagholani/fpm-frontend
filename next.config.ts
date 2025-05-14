import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

module.exports = {
  matcher: ['/admin/:path*'],
};

export default nextConfig;
