import { Card, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { listAnalyses } from "@/lib/actions";
import type { Locale } from "@/lib/i18n-config";
import { getBaseUrl, getDefaultGroup } from "@/lib/utils";
import type { Analysis } from "@/types/api";
import Link from "next/link";
import { Suspense } from "react";

const POSTS_PER_PAGE = 6;

interface LatestPostsSidebarProps {
  language: Locale;
  dictionary: any;
}

export function LatestPostsSidebar({
  language,
  dictionary,
}: LatestPostsSidebarProps) {
  return (
    <aside className="h-[40vh] overflow-y-auto">
      <h2 className="mb-2 text-base font-semibold">
        {dictionary.blog.latestPosts}
      </h2>
      <div className="flex flex-col space-y-2 px-1">
        <Suspense
          fallback={Array.from({ length: 4 }).map((_, i) => (
            <Card
              key={i}
              className="flex flex-row items-center overflow-hidden border border-gray-100 p-0 shadow-none"
            >
              <div className="flex flex-col justify-between p-1">
                <Skeleton className="my-[2px] h-3 w-full" />
                <Skeleton className="my-[2px] h-3 w-full" />
                <Skeleton className="my-[2px] h-3 w-3/4" />
              </div>
            </Card>
          ))}
        >
          <LatestPostsContent language={language} />
        </Suspense>
      </div>
    </aside>
  );
}

async function LatestPostsContent({ language }: { language: Locale }) {
  let latest: Analysis[];
  try {
    latest = await listAnalyses({
      pageNum: 1,
      pageSize: POSTS_PER_PAGE,
      selectFields: ["analysisId", "jsonContent"],
      metadata: {
        group: getDefaultGroup(),
        language: language,
      },
    });
  } catch (error) {
    latest = [];
  }

  function renderCard(post: Analysis) {
    const title = post.jsonContent?.title || "";

    return (
      <Link
        href={`${getBaseUrl()}/${language}/${post.analysisId}${post.jsonContent?.slug ? `/${encodeURIComponent(post.jsonContent?.slug)}` : ""}`}
      >
        <Card
          key={post.analysisId}
          className="flex flex-row items-center border-2 border-transparent p-0 transition-colors hover:border-primary/50 dark:hover:bg-accent/50"
        >
          <CardTitle className="line-clamp-3 text-ellipsis break-all p-1 text-xs font-semibold">
            {title}
          </CardTitle>
        </Card>
      </Link>
    );
  }

  return latest.map(renderCard);
}
