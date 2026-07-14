import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Clock } from "lucide-react";
import JsonLd from "@/components/JsonLd";
import TenzokNav from "@/components/TenzokNav";
import { POSTS } from "@/components/blog-posts";
import CtaFooter from "@/components/sections/CtaFooter";
import Reveal from "@/components/sections/Reveal";
import { Container, Eyebrow, Section } from "@/components/ui/Section";
import { breadcrumbSchema, itemListSchema } from "@/lib/seo";
import { url } from "@/lib/site";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Engineering write-ups for students and teams: data leakage in ML projects, scoping a capstone, RAG that actually retrieves, deploying off localhost, and surviving the viva.",
  alternates: { canonical: url("/blogs") },
  openGraph: {
    title: "Tenzok Blog",
    description:
      "Engineering write-ups for students and teams — specific, honest, and written by people who ship.",
    url: url("/blogs"),
  },
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function BlogsPage() {
  const posts = [...POSTS].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  const [featured, ...rest] = posts;

  return (
    <main id="main" tabIndex={-1} className="bg-surface">
      <JsonLd
        schema={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Blog", path: "/blogs" },
          ]),
          itemListSchema(
            "Tenzok Blog",
            posts.map((p) => ({ name: p.title, path: `/blogs/${p.slug}` })),
          ),
        ]}
      />
      <TenzokNav />

      <section className="pt-36 pb-8 sm:pt-44">
        <Container>
          <Reveal>
            <Eyebrow>Blog</Eyebrow>
            <h1 className="mt-6 max-w-3xl text-[clamp(2rem,1.5rem+2.4vw,3.5rem)] leading-[1.08] text-ink">
              Notes from the{" "}
              <span className="font-display italic text-accent">workshop floor.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-muted">
              The things we end up explaining over and over in code reviews and scoping
              calls, written down properly. No listicles, no hype — the bug that actually
              bites, and how to find it.
            </p>
          </Reveal>

          {featured && (
            <Reveal delay={100}>
              <Link
                href={`/blogs/${featured.slug}`}
                className="group mt-16 block rounded-2xl border border-line bg-surface-raised p-8 transition-colors hover:border-line-strong hover:bg-surface-overlay sm:p-10"
              >
                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded-md bg-accent/15 px-2 py-1 text-xs font-medium text-accent">
                    Latest
                  </span>
                  <PostMeta post={featured} />
                </div>
                <h2 className="mt-6 max-w-3xl text-2xl leading-snug text-ink sm:text-3xl">
                  {featured.title}
                </h2>
                <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-muted">
                  {featured.excerpt}
                </p>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-accent">
                  Read the article
                  <ArrowUpRight
                    size={15}
                    className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </span>
              </Link>
            </Reveal>
          )}
        </Container>
      </section>

      <Section>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {rest.map((post, i) => (
            <Reveal key={post.slug} delay={(i % 3) * 70} className="h-full">
              <Link
                href={`/blogs/${post.slug}`}
                className="group flex h-full flex-col rounded-2xl border border-line bg-surface-raised p-6 transition-colors hover:border-line-strong hover:bg-surface-overlay"
              >
                <PostMeta post={post} />
                <h2 className="mt-5 text-lg leading-snug text-ink">{post.title}</h2>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-muted">
                  {post.excerpt}
                </p>
                <div className="mt-6 flex flex-wrap gap-1.5 border-t border-line pt-5">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md border border-line px-2 py-1 text-xs text-ink-subtle"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </Section>

      <CtaFooter />
    </main>
  );
}

function PostMeta({ post }: { post: { publishedAt: string; readingMinutes: number } }) {
  return (
    <div className="flex flex-wrap items-center gap-3 text-xs text-ink-subtle">
      <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
      <span aria-hidden>·</span>
      <span className="flex items-center gap-1.5">
        <Clock size={12} />
        {post.readingMinutes} min read
      </span>
    </div>
  );
}
