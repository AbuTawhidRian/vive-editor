import type { NextConfig } from "next";
import { hostname } from "os";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  images:{
    remotePatterns:[{
      protocol: 'https',
      hostname: '*',
      port: '',
      pathname:'/**'
    }]
  }
};

export default nextConfig;
