import {
  getCloudflareContext,
  initOpenNextCloudflareForDev,
} from "@opennextjs/cloudflare";
import type { NextConfig } from "next";

export default async function ({
  defaultConfig,
}: {
  defaultConfig: NextConfig;
}): Promise<NextConfig> {
  await initOpenNextCloudflareForDev();

  const ROOT =
    getCloudflareContext().env.NEXT_PUBLIC_ROOT_DOMAIN || "searchlysis.com";
  const allowedOrigins = [ROOT, `*.${ROOT}`];

  const nextConfig: NextConfig = {
    ...defaultConfig,
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
        allowedOrigins,
      },
    },
  };

  return nextConfig;
}
