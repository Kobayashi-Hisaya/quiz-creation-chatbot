import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 型チェックとLintをビルド時に実行
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },

  // 画像最適化
  images: {
    formats: ['image/webp', 'image/avif'],
  },
};

export default nextConfig;
