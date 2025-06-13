import { Analysis } from "@/types/api";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { i18n, type Locale } from "./i18n-config";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(
  dateString: string,
  locale: Locale = i18n.defaultLocale,
) {
  const date = new Date(dateString);

  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

export function getPaginationRange(
  current: number,
  total: number,
  siblingCount: number = 2,
) {
  const totalPageNumbers = siblingCount * 2 + 5;
  if (total <= totalPageNumbers) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  const pages: (number | string)[] = [];
  const leftSibling = Math.max(current - siblingCount, 2);
  const rightSibling = Math.min(current + siblingCount, total - 1);

  pages.push(1);
  if (leftSibling > 2) {
    pages.push("...");
  }
  for (let i = leftSibling; i <= rightSibling; i++) {
    pages.push(i);
  }
  if (rightSibling < total - 1) {
    pages.push("...");
  }
  // pages.push(total);
  return pages;
}

export function getDefaultGroup() {
  return getBaseUrl();
}

export function getBasePath() {
  return process.env.NEXT_PUBLIC_BASE_PATH || "";
}

export function getBaseUrl() {
  return `https://${process.env.NEXT_PUBLIC_ROOT_DOMAIN}${getBasePath()}`;
}

export function getDefaultImage() {
  return (
    process.env.NEXT_PUBLIC_IMAGE || "https://cdn.searchlysis.com/logo.svg"
  );
}

export function getDefaultFavicon() {
  return process.env.NEXT_PUBLIC_ICON || "https://cdn.searchlysis.com/icon.svg";
}

/**
 * Encodes a string to a URL-safe Base64 format.
 *
 * This function uses the browser's `btoa` method to encode the input string to Base64,
 * then replaces characters to make the result URL-safe by:
 * - Replacing '+' with '-'
 * - Replacing '/' with '_'
 * - Removing any trailing '=' padding characters
 *
 * @param data - The string to encode.
 * @returns The URL-safe Base64 encoded string.
 */
export function encode(data: string) {
  return btoa(data).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function getAppType() {
  switch (process.env.NEXT_PUBLIC_APP_TYPE) {
    case "blog":
      return "blog";
    case "directory":
      return "directory";
    default:
      return "blog";
  }
}

export function getTagFrequency(analyses: Analysis[]) {
  const tagFreq: { [key: string]: number } = {};
  analyses.forEach((analysis) => {
    const tags = analysis.jsonContent?.tags || [];
    tags.forEach((tag: string) => {
      tagFreq[tag] = (tagFreq[tag] || 0) + 1;
    });
  });
  return Object.entries(tagFreq)
    .sort(([, a], [, b]) => b - a)
    .map(([tag, count]) => ({ tag, count }));
}
