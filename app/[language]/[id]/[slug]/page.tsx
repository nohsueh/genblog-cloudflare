import { BlogPost } from "@/components/blog-post";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { SitePost } from "@/components/site-post";
import { getAnalysis } from "@/lib/actions";
import { getDictionary } from "@/lib/dictionaries";
import type { Locale } from "@/lib/i18n-config";
import { getAppType, getBaseUrl, getDefaultImage } from "@/lib/utils";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import Loading from "./loading";

export const revalidate = 3600;

export async function generateStaticParams() {
  return [];
}

type Props = {
  language: Locale;
  id: string;
  slug: string;
};

export default async function PostPage({ params }: { params: Promise<Props> }) {
  try {
    const { language, id } = await params;
    const dictionary = await getDictionary(language);

    return (
      <div className="flex min-h-screen flex-col">
        <SiteHeader language={language} dictionary={dictionary} />
        <main className="mx-auto mb-48 max-w-screen-lg flex-1 px-4 py-6">
          <Suspense fallback={<Loading />}>
            {getAppType() === "blog" && (
              <BlogPost
                analysisId={id}
                language={language}
                dictionary={dictionary}
              />
            )}
            {getAppType() === "directory" && (
              <SitePost
                analysisId={id}
                language={language}
                dictionary={dictionary}
              />
            )}
          </Suspense>
        </main>
        <SiteFooter />
      </div>
    );
  } catch (error) {
    console.error(error);
    return notFound();
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Props>;
}): Promise<Metadata> {
  const { language, id } = await params;
  const post = await getAnalysis(id);
  if (!Boolean(post)) {
    notFound();
  }

  const applicationName = process.env.NEXT_PUBLIC_APP_NAME;
  const authors = [{ name: post.analysis.author }, { name: applicationName }];
  const keywords = post.jsonContent?.tags;
  const title =
    post.jsonContent?.title ||
    post.jsonContent?.description ||
    post.analysis.title;
  const description = post.jsonContent?.overview || "";
  const images = post.analysis.image || getDefaultImage();
  const canonical = `${getBaseUrl()}/${language}/${id}${post.jsonContent?.slug ? `/${encodeURIComponent(post.jsonContent?.slug)}` : ""}`;

  return {
    alternates: {
      canonical,
    },
    applicationName,
    authors,
    keywords,
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
