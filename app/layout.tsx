import { LoaderCircle } from "lucide-react";
import { Suspense } from "react";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ACCOUNT && (
          <script
            id="google-adsense-script"
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-${process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ACCOUNT}`}
            crossOrigin="anonymous"
          ></script>
        )}
        {process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION && (
          <meta
            name="google-site-verification"
            content={process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION}
          />
        )}
      </head>
      <body>
        <Suspense
          fallback={
            <div className="flex h-[50vh] w-screen flex-col items-center justify-center">
              <LoaderCircle className="size-10 animate-[spin_0.4s_linear_infinite]" />
            </div>
          }
        >
          {children}
        </Suspense>
      </body>
    </html>
  );
}
