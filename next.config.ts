import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/how-i-built-this",
        destination: "/build-notes",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
