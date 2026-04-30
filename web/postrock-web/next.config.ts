import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  ...(!process.env.VERCEL ? { output: "standalone" as const } : {}),
  transpilePackages: ["sanity", "next-sanity"],
  images: {
    // Allow next/image for public files under /images/** (including cache-bust ?rev= on brand assets).
    localPatterns: [{ pathname: "/images/**" }],
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
