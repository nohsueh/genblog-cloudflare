import "@/app/globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { i18n } from "@/lib/i18n-config";
import { Inter } from "next/font/google";
import type React from "react";
import { Suspense } from "react";

const inter = Inter({ subsets: ["latin"] });

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

// Define the type for the props explicitly
type RootLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
};

export default async function RootLayout(props: RootLayoutProps) {
  // Safely access properties with fallbacks
  const children = props?.children || null;
  const lang = (await props?.params)?.lang || i18n.defaultLocale;

  return (
    <html lang={lang} suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Suspense fallback={<></>}>{children}</Suspense>
          <Toaster richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
