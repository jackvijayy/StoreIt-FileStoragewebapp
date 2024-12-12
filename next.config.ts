import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.pixabay.com",
        port: '',
      },
      {
        protocol: "https",
        hostname: "img.freepik.com",
        port: '',
      },
      {
        protocol: "https",
        hostname: "cloud.appwrite.io",
        port: '',
      },
    ],
  },
};

export default nextConfig;