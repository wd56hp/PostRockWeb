import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  ...(!process.env.VERCEL ? { output: "standalone" as const } : {}),
  transpilePackages: ["sanity", "next-sanity"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        pathname: "/images/**",
      },
    ],
  },
};

export default nextConfig;
