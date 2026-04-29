import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  ...(!process.env.VERCEL ? { output: "standalone" as const } : {}),
  transpilePackages: ["sanity", "next-sanity"],
};

export default nextConfig;
