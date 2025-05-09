import { getCloudflareContext } from "@opennextjs/cloudflare";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  basePath: getCloudflareContext().env.NEXT_PUBLIC_BASE_PATH || "",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  experimental: {
    serverActions: {
      allowedOrigins: [
        "searchlysis.com",
        "*.searchlysis.com",
        getCloudflareContext().env.NEXT_PUBLIC_ROOT_DOMAIN || "localhost",
        `*.${getCloudflareContext().env.NEXT_PUBLIC_ROOT_DOMAIN || "localhost"}`,
      ],
    },
  },
};

export default nextConfig;
