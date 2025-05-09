"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  deleteAnalysis,
  getPublishedBlogs,
  updateAnalysis,
} from "@/lib/actions";
import type { Locale } from "@/lib/i18n-config";
import { formatDate, getPaginationRange } from "@/lib/utils";
import type { AnalysisResult } from "@/types/api";
import { debounce } from "lodash";
import { Pencil, Sparkles, Trash } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";

const PAGE_SIZE = 25;

interface AdminDashboardProps {
  lang: Locale;
  dictionary: any;
  groupName: string;
}

export function AdminDashboard({
  lang,
  dictionary,
  groupName,
}: AdminDashboardProps) {
  const [posts, setPosts] = useState<AnalysisResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGroup, setSelectedGroup] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);

  const debouncedToggleVisibility = React.useCallback(
    debounce(async (post: AnalysisResult) => {
      try {
        const formData = new FormData();
        formData.append("analysisId", post.analysisId);
        formData.append("content", post.analysis?.content || "");
        formData.append(
          "group",
          post.metadata?.group === groupName ? "" : groupName
        );
        formData.append(
          "language",
          post.metadata?.language === lang ? "" : lang
        );

        const updatedPost = await updateAnalysis(formData);

        // Update local state
        setPosts(
          posts.map((post) =>
            post.analysisId === updatedPost.analysisId ? updatedPost : post
          )
        );
      } catch (error) {
        toast.error(dictionary.admin.edit.error);
        console.error("Failed to update post visibility:", error);
      }
    }, 500),
    [groupName, posts, dictionary]
  );

  React.useEffect(() => {
    return () => {
      debouncedToggleVisibility.cancel();
    };
  }, [debouncedToggleVisibility]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        // TODO: Add language filter
        const group = selectedGroup === groupName ? selectedGroup : undefined;
        const result = await getPublishedBlogs(
          currentPage,
          PAGE_SIZE,
          group,
          lang
        );
        setPosts(result.blogs);
        setTotal(result.total);
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [groupName, lang, selectedGroup, currentPage]);

  const filteredPosts = posts.filter((post) =>
    post.analysis?.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (post: AnalysisResult) => {
    try {
      await deleteAnalysis(post.analysisId);
      setPosts(posts.filter((p) => p.analysisId !== post.analysisId));
    } catch (error) {
      toast.error(dictionary.admin.edit.error);
      console.error("Failed to delete post:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-3xl font-bold">
          {dictionary.admin.dashboard.title}
        </h1>
        <div className="flex gap-2">
          <Link href={`/${lang}/console/create`}>
            <Button>
              <Sparkles className="mr-2 h-4 w-4" />
              {dictionary.admin.dashboard.createNew}
            </Button>
          </Link>
        </div>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="flex-1">
          <Input
            placeholder={dictionary.admin.dashboard.search}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-full sm:w-64">
          <Select value={selectedGroup} onValueChange={setSelectedGroup}>
            <SelectTrigger>
              <SelectValue placeholder={dictionary.admin.dashboard.filter} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                {dictionary.admin.dashboard.allGroups}
              </SelectItem>
              <SelectItem value={groupName}>{groupName}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {loading ? (
        <div className="py-10 text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="py-10 text-center">
          <p className="text-muted-foreground">
            {dictionary.admin.dashboard.noBlogs}
          </p>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>{dictionary.admin.dashboard.group}</TableHead>
                <TableHead>{dictionary.admin.dashboard.visibility}</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPosts.map((post) => (
                <TableRow key={post.analysisId}>
                  <TableCell className="font-medium break-all">
                    {post.analysis?.title || ""}
                  </TableCell>
                  <TableCell className="text-nowrap">
                    {formatDate(post.updatedAt, lang)}
                  </TableCell>
                  <TableCell className="text-nowrap">
                    {post.metadata?.group ? (
                      <Badge variant="outline">{post.metadata.group}</Badge>
                    ) : (
                      <span className="text-sm text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={
                          post.metadata?.group === groupName &&
                          post.metadata?.language == lang
                        }
                        onCheckedChange={() => debouncedToggleVisibility(post)}
                      />
                      <Label>
                        {post.metadata?.group === groupName &&
                        post.metadata?.language == lang
                          ? dictionary.admin.dashboard.visible
                          : dictionary.admin.dashboard.hidden}
                      </Label>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Link href={`/${lang}/console/edit/${post.analysisId}`}>
                      <Button size="icon" variant="ghost">
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">
                          {dictionary.admin.dashboard.edit}
                        </span>
                      </Button>
                    </Link>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="icon" variant="ghost">
                          <Trash className="h-4 w-4" />
                          <span className="sr-only">
                            {dictionary.admin.dashboard.delete}
                          </span>
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            {dictionary.admin.dashboard.confirmDelete}
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            {post.analysis?.title}
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(post)}>
                            Confirm
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {total > PAGE_SIZE && (
            <div className="flex justify-center p-4">
              <Pagination>
                <PaginationContent>
                  {getPaginationRange(
                    currentPage,
                    Math.ceil(total / PAGE_SIZE)
                  ).map((page, idx) =>
                    page === "..." ? (
                      <PaginationItem key={`ellipsis-${idx}`}>
                        <span className="px-2 text-muted-foreground">...</span>
                      </PaginationItem>
                    ) : (
                      <PaginationItem key={page}>
                        <PaginationLink
                          href="#"
                          onClick={() => setCurrentPage(Number(page))}
                          isActive={currentPage === page}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    )
                  )}
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
