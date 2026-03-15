import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  compiler: {
    styledComponents: true,
  },
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
