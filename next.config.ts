import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.figma.com",
        pathname: "/api/mcp/asset/**",
      },
      {
        protocol: "https",
        hostname: "pub-0c71d52ce6374ce6be63f6898c4b7860.r2.dev",
      },
      {
        protocol: "https",
        hostname: "pub-1c364c49d1b74bb8a7cd52064968dda5.r2.dev",
      },
    ],
  },
};

export default nextConfig;
