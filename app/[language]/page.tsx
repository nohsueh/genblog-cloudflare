import { BlogList } from "@/components/blog-list";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { SiteList } from "@/components/site-list";
import { getDictionary } from "@/lib/dictionaries";
import { i18n } from "@/lib/i18n-config";
import {
  getAppType,
  getBaseUrl,
  getDefaultGroup,
  getDefaultImage,
} from "@/lib/utils";
import { Metadata } from "next";
import { Params } from "next/dist/server/request/params";

export const revalidate = 3600;

export async function generateStaticParams() {
  return [];
}

interface Props extends Params {
  language: string;
}

export default async function HomePage({ params }: { params: Promise<Props> }) {
  const { language } = await params;
  const dictionary = await getDictionary(language);
  const description =
    process.env.NEXT_PUBLIC_APP_DESCRIPTION ||
    `${dictionary.home.title} - ${dictionary.home.description}`;

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader language={language} dictionary={dictionary} />
      <main className="container flex-1 px-4 py-6">
        <header className="flex w-full flex-col items-center justify-center px-2 py-8">
          <h2 className="text-center text-2xl font-bold md:text-4xl">
            {description}
          </h2>
        </header>
        {getAppType() === "blog" && (
          <BlogList
            language={language}
            dictionary={dictionary}
            group={getDefaultGroup()}
          />
        )}
        {getAppType() === "directory" && (
          <SiteList
            language={language}
            dictionary={dictionary}
            group={getDefaultGroup()}
          />
        )}
      </main>
      <SiteFooter />
    </div>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Props>;
}): Promise<Metadata> {
  const { language } = await params;
  const dictionary = await getDictionary(language);
  const applicationName = process.env.NEXT_PUBLIC_APP_NAME;
  const description =
    process.env.NEXT_PUBLIC_APP_DESCRIPTION ||
    `${dictionary.home.title} - ${dictionary.home.description}`;
  const title = `${process.env.NEXT_PUBLIC_APP_NAME} - ${description}`;
  const images = getDefaultImage();

  const canonical = `${getBaseUrl()}${language === i18n.defaultLocale ? "" : `/${language}`}`;

  return {
    alternates: {
      canonical,
    },
    applicationName,
    title,
    description,
    openGraph: {
      url: canonical,
      siteName: applicationName,
      title,
      description,
      images,
    },
    twitter: {
      title,
      description,
      images,
    },
  };
}
