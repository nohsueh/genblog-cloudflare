import { getCloudflareContext } from "@opennextjs/cloudflare";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {getCloudflareContext().env.NEXT_PUBLIC_GOOGLE_ADSENSE_ACCOUNT && (
          <script
            id="google-adsense-script"
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-${getCloudflareContext().env.NEXT_PUBLIC_GOOGLE_ADSENSE_ACCOUNT}`}
            crossOrigin="anonymous"
          ></script>
        )}
        {getCloudflareContext().env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION && (
          <meta
            name="google-site-verification"
            content={
              getCloudflareContext().env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
            }
          />
        )}
      </head>
      <body>{children}</body>
    </html>
  );
}
