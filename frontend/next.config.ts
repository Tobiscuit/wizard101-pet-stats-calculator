import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  async rewrites() {
    return [
      {
        source: '/@:username',
        destination: '/u/:username',
      },
      {
        source: '/@:username/:slug*',
        destination: '/u/:username/:slug*',
      },
    ];
  },
};

export default nextConfig;
