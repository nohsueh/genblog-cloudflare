import { LatestPostsSidebar } from "@/components/latest-posts-sidebar";
import { markdownToHtml } from "@/components/markdown";
import { OnThisPage } from "@/components/on-this-page";
import { RelatedBlogList } from "@/components/related-post-list";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { getAnalysis } from "@/lib/actions";
import type { Locale } from "@/lib/i18n-config";
import { formatDate, getBaseUrl } from "@/lib/utils";
import type { Analysis } from "@/types/api";
import { TableOfContents } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Share } from "./share";
import ViewCounter from "./view-counter";

interface BlogPostProps {
  analysisId: string;
  language: Locale;
  dictionary: any;
}

export async function BlogPost({
  analysisId,
  language,
  dictionary,
}: BlogPostProps) {
  const post: Analysis = await getAnalysis(analysisId);
  if (!Boolean(post)) {
    notFound();
  }
  const { html, headings } = markdownToHtml(post.jsonContent?.article || "");
  const tags = post.jsonContent?.tags || [];

  return (
    <div className="relative">
      <div className="lg:mr-[calc(48rem-50vw)] 2xl:mr-0">
        <article className="break-all">
          <header className="mb-6 space-y-4">
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
              {post.jsonContent?.title}
            </h1>
            <p className="text-xl leading-7 text-muted-foreground [&:not(:first-child)]:mt-6">
              {post.jsonContent?.overview}
            </p>
          </header>

          <div className="mb-6 space-y-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>{formatDate(post.updatedAt, language)}</span>
              {post.analysis.author && (
                <span>
                  {" "}
                  {dictionary.blog.by} {post.analysis.author}
                </span>
              )}
              <ViewCounter
                analysisId={post.analysisId}
                metadata={post.metadata}
              />
            </div>

            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag: string) => (
                  <Link
                    key={tag}
                    href={`${getBaseUrl()}/${language}/tag/${encodeURIComponent(tag)}`}
                  >
                    <Badge
                      variant="secondary"
                      className="cursor-pointer hover:bg-accent"
                    >
                      {tag}
                    </Badge>
                  </Link>
                ))}
              </div>
            )}

            <Share text={post.jsonContent?.overview} />
          </div>

          <div className="prose prose-gray max-w-none dark:prose-invert">
            <div
              className="prose prose-sm prose-gray w-full max-w-none break-all dark:prose-invert sm:prose-base prose-a:text-blue-600 prose-a:underline hover:prose-a:text-blue-500"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          </div>
        </article>

        <RelatedBlogList
          language={language}
          dictionary={dictionary}
          currentId={post.analysisId}
        />
      </div>

      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="fixed right-4 top-20 z-50 lg:hidden"
          >
            <TableOfContents className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-[300px]">
          <div className="h-[90vh] space-y-8">
            <OnThisPage headings={headings} />
            <LatestPostsSidebar language={language} dictionary={dictionary} />
          </div>
        </SheetContent>
      </Sheet>

      <div className="fixed top-24 hidden h-[90vh] w-60 space-y-8 lg:right-4 lg:block 2xl:left-[calc(50vw+32rem)]">
        <OnThisPage headings={headings} />
        <LatestPostsSidebar language={language} dictionary={dictionary} />
      </div>
    </div>
  );
}
