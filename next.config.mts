import {
  getCloudflareContext,
  initOpenNextCloudflareForDev,
} from "@opennextjs/cloudflare";
import type { NextConfig } from "next";

initOpenNextCloudflareForDev();

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
        getCloudflareContext().env.NEXT_PUBLIC_ROOT_DOMAIN || "searchlysis.com",
        `*.${getCloudflareContext().env.NEXT_PUBLIC_ROOT_DOMAIN || ".searchlysis.com"}`,
      ],
    },
  },
};

export default nextConfig;
