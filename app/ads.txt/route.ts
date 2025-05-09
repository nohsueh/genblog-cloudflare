import { getCloudflareContext } from "@opennextjs/cloudflare";

export async function GET() {
  return new Response(
    `google.com, ${getCloudflareContext().env.NEXT_PUBLIC_GOOGLE_ADSENSE_ACCOUNT}, DIRECT, f08c47fec0942fa0`,
    {
      headers: {
        "Content-Type": "text/plain",
      },
    },
  );
}
