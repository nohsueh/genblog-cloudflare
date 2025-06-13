import { AdminLogin } from "@/components/admin-login";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { checkAdminCookie } from "@/lib/actions";
import { getDictionary } from "@/lib/dictionaries";
import type { Locale } from "@/lib/i18n-config";
import { Metadata } from "next";
import { permanentRedirect } from "next/navigation";

export default async function AdminPage({
  params,
}: {
  params: Promise<{ language: Locale }>;
}) {
  const { language } = await params;
  const dictionary = await getDictionary(language);
  const isLoggedIn = await checkAdminCookie();

  if (isLoggedIn) {
    permanentRedirect(`/${language}/console/1`);
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader language={language} dictionary={dictionary} />
      <main className="container mx-auto flex-1 px-4 py-6">
        <AdminLogin language={language} dictionary={dictionary} />
      </main>
      <SiteFooter />
    </div>
  );
}

export const metadata: Metadata = {
  title: "Login",
  robots: {
    index: false,
    follow: false,
  },
};
