"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, BookOpen, Clock3, RotateCcw, Search } from "lucide-react";

export interface ExplorerPost {
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  readingMinutes: number;
  tags: string[];
}

function formatDate(iso: string) {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

export default function BlogExplorer({ posts }: { posts: ExplorerPost[] }) {
  const [query, setQuery] = useState("");
  const [tag, setTag] = useState("all");

  const tags = useMemo(
    () =>
      Array.from(new Set(posts.flatMap((post) => post.tags))).sort((a, b) =>
        a.localeCompare(b),
      ),
    [posts],
  );

  const filtered = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase();
    return posts.filter(
      (post) =>
        (tag === "all" || post.tags.includes(tag)) &&
        (needle.length === 0 ||
          [post.title, post.excerpt, ...post.tags]
            .join(" ")
            .toLocaleLowerCase()
            .includes(needle)),
    );
  }, [posts, query, tag]);

  const [featured, ...rest] = filtered;
  const hasFilters = query.trim().length > 0 || tag !== "all";

  function resetFilters() {
    setQuery("");
    setTag("all");
  }

  return (
    <div>
      <div className="rounded-2xl border border-line bg-surface-raised p-4 sm:p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <form
            role="search"
            aria-label="Search articles"
            onSubmit={(event) => event.preventDefault()}
            className="relative flex-1"
          >
            <label>
              <span className="sr-only">Search articles</span>
              <Search
                aria-hidden
                size={17}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-subtle"
              />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search deployment, RAG, viva..."
                className="min-h-12 w-full rounded-xl border border-line bg-surface-overlay pl-11 pr-4 text-base text-ink outline-none placeholder:text-ink-subtle transition-colors hover:border-line-strong focus:border-accent"
              />
            </label>
          </form>

          <label className="lg:w-64">
            <span className="sr-only">Filter articles by topic</span>
            <select
              value={tag}
              onChange={(event) => setTag(event.target.value)}
              className="min-h-12 w-full cursor-pointer rounded-xl border border-line bg-surface-overlay px-4 text-base text-ink outline-none transition-colors hover:border-line-strong focus:border-accent"
            >
              <option value="all">Every topic</option>
              {tags.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>

          {hasFilters && (
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-full px-4 text-sm font-medium text-ink-muted transition-colors hover:text-ink"
            >
              <RotateCcw size={14} />
              Clear
            </button>
          )}
        </div>
        <p className="mt-3 text-sm text-ink-subtle" aria-live="polite" aria-atomic="true">
          Showing {filtered.length} {filtered.length === 1 ? "article" : "articles"}
        </p>
      </div>

      {featured ? (
        <>
          <Link
            href={`/blogs/${featured.slug}`}
            className="group relative mt-8 grid overflow-hidden rounded-3xl border border-line bg-surface-raised transition-[border-color,background-color,transform] duration-300 hover:-translate-y-1 hover:border-line-strong hover:bg-surface-overlay lg:grid-cols-[1.35fr_0.65fr]"
          >
            <div
              aria-hidden
              className="pointer-events-none absolute -right-20 -top-28 h-80 w-80 rounded-full bg-cool/10 blur-3xl"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -bottom-28 left-1/3 h-64 w-64 rounded-full bg-accent/10 blur-3xl"
            />

            <div className="relative p-7 sm:p-10 lg:p-12">
              <span className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1.5 text-xs font-medium text-accent">
                <BookOpen size={13} />
                {hasFilters ? "Top match" : "Featured article"}
              </span>
              <h2 className="mt-6 max-w-3xl text-2xl leading-tight text-ink sm:text-3xl lg:text-4xl">
                {featured.title}
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink-muted">
                {featured.excerpt}
              </p>
              <span className="mt-7 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-accent">
                Read the article
                <ArrowUpRight
                  size={15}
                  className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </span>
            </div>

            <div className="relative flex flex-col justify-end border-t border-line bg-surface-overlay/60 p-7 sm:p-10 lg:border-l lg:border-t-0">
              <PostMeta post={featured} />
              <div className="mt-6 flex flex-wrap gap-2">
                {featured.tags.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-line bg-surface-raised px-3 py-1.5 text-xs text-ink-muted"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </Link>

          {rest.length > 0 && (
            <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {rest.map((post) => (
                <ArticleCard key={post.slug} post={post} />
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="mt-8 rounded-2xl border border-dashed border-line-strong bg-surface-raised px-6 py-16 text-center">
          <BookOpen size={24} className="mx-auto text-ink-subtle" />
          <h2 className="mt-4 text-lg text-ink">No article matches that search</h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-ink-muted">
            Try a broader phrase or reset the topic filter.
          </p>
          <button
            type="button"
            onClick={resetFilters}
            className="mt-6 inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border border-line-strong bg-surface-overlay px-5 text-sm font-medium text-ink transition-colors hover:border-accent"
          >
            <RotateCcw size={14} />
            Reset search
          </button>
        </div>
      )}
    </div>
  );
}

function ArticleCard({ post }: { post: ExplorerPost }) {
  return (
    <Link
      href={`/blogs/${post.slug}`}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-surface-raised p-6 transition-[border-color,background-color,transform] duration-300 hover:-translate-y-1 hover:border-line-strong hover:bg-surface-overlay"
    >
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cool to-transparent opacity-50"
      />
      <PostMeta post={post} />
      <h2 className="mt-5 text-lg leading-snug text-ink">{post.title}</h2>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-muted">{post.excerpt}</p>
      <div className="mt-6 flex flex-wrap gap-1.5 border-t border-line pt-5">
        {post.tags.slice(0, 3).map((item) => (
          <span
            key={item}
            className="rounded-md border border-line bg-surface px-2 py-1 text-xs text-ink-subtle"
          >
            {item}
          </span>
        ))}
      </div>
      <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-ink transition-colors group-hover:text-accent">
        Read article
        <ArrowUpRight
          size={14}
          className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        />
      </span>
    </Link>
  );
}

function PostMeta({ post }: { post: ExplorerPost }) {
  return (
    <div className="flex flex-wrap items-center gap-3 text-xs text-ink-subtle">
      <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
      <span aria-hidden>·</span>
      <span className="flex items-center gap-1.5">
        <Clock3 size={12} />
        {post.readingMinutes} min read
      </span>
    </div>
  );
}
