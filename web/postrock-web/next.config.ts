import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  transpilePackages: ["sanity", "next-sanity"],
};

export default nextConfig;
