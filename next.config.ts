import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: "/panel", // 📌 مسیر پایه برای پنل
  eslint: {
    ignoreDuringBuilds: true, // 💥 جلوگیری از خطای ESLint هنگام build
  },
};

export default nextConfig;
