import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  ChevronDown,
  Clock3,
  Mail,
} from "lucide-react";
import ArticleBody, { headingId } from "@/components/ArticleBody";
import JsonLd from "@/components/JsonLd";
import TenzokNav from "@/components/TenzokNav";
import { POSTS, getPost } from "@/components/blog-posts";
import CtaFooter from "@/components/sections/CtaFooter";
import Reveal from "@/components/sections/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { Container, Eyebrow, Section } from "@/components/ui/Section";
import { articleSchema, breadcrumbSchema, faqSchema } from "@/lib/seo";
import { SITE, socialMetadata, url } from "@/lib/site";

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return POSTS.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  const social = socialMetadata({
    title: post.title,
    description: post.description,
    path: `/blogs/${slug}`,
    imagePath: `/blogs/${slug}/opengraph-image`,
  });

  return {
    title: post.title,
    description: post.description,
    keywords: post.keywords,
    alternates: { canonical: url(`/blogs/${slug}`) },
    openGraph: {
      ...social.openGraph,
      type: "article",
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt ?? post.publishedAt,
      tags: post.tags,
    },
    twitter: social.twitter,
  };
}

function formatDate(iso: string) {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

export default async function BlogPostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const headings = post.body.filter((block) => block.type === "h2");
  const more = POSTS.filter((item) => item.slug !== post.slug)
    .sort((a, b) => {
      const aShared = a.tags.filter((tag) => post.tags.includes(tag)).length;
      const bShared = b.tags.filter((tag) => post.tags.includes(tag)).length;
      return bShared - aShared || b.publishedAt.localeCompare(a.publishedAt);
    })
    .slice(0, 3);

  return (
    <main id="main" tabIndex={-1} className="overflow-hidden bg-surface">
      <JsonLd
        schema={[
          articleSchema(post),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Blog", path: "/blogs" },
            { name: post.title, path: `/blogs/${post.slug}` },
          ]),
          ...(post.faq.length > 0 ? [faqSchema(post.faq)] : []),
        ]}
      />
      <TenzokNav />

      <article>
        <header className="relative overflow-hidden pt-32 pb-20 sm:pt-44 sm:pb-28">
          <div
            aria-hidden
            className="pointer-events-none absolute -left-40 top-0 h-[34rem] w-[34rem] rounded-full bg-cool/10 blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -right-48 top-24 h-[38rem] w-[38rem] rounded-full bg-accent/10 blur-3xl"
          />
          <Container className="relative">
            <Link
              href="/blogs"
              className="inline-flex min-h-11 items-center gap-2 text-sm text-ink-subtle transition-colors hover:text-ink"
            >
              <ArrowLeft size={14} />
              All insights
            </Link>

            <div className="mt-8 max-w-5xl">
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1.5 text-xs font-medium text-accent">
                  <BookOpen size={13} />
                  Engineering insight
                </span>
                <time dateTime={post.publishedAt} className="text-sm text-ink-subtle">
                  {formatDate(post.publishedAt)}
                </time>
                <span aria-hidden className="text-ink-subtle">
                  ·
                </span>
                <span className="flex items-center gap-1.5 text-sm text-ink-subtle">
                  <Clock3 size={14} />
                  {post.readingMinutes} min read
                </span>
              </div>

              <h1 className="mt-7 text-[clamp(2.5rem,1.7rem+3.3vw,5rem)] leading-[1.02] text-ink">
                {post.title}
              </h1>
              <p className="mt-7 max-w-3xl text-lg leading-relaxed text-ink-muted sm:text-xl">
                {post.excerpt}
              </p>
              <div className="mt-8 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-line bg-surface-raised px-3 py-1.5 text-xs text-ink-muted"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </Container>
        </header>

        <Container>
          <div className="grid grid-cols-1 gap-14 border-t border-line pt-12 lg:grid-cols-[minmax(0,1fr)_260px] lg:gap-20">
            <div className="min-w-0 max-w-3xl">
              <ArticleBody body={post.body} />

              {post.faq.length > 0 && (
                <section className="mt-24 border-t border-line pt-14">
                  <Eyebrow>Frequently asked</Eyebrow>
                  <h2 className="mt-6 text-3xl leading-tight text-ink sm:text-4xl">
                    Questions people actually ask
                  </h2>
                  <div className="mt-8 flex flex-col gap-3">
                    {post.faq.map((item, index) => (
                      <details
                        key={item.q}
                        className="group rounded-2xl border border-line bg-surface-raised open:border-line-strong open:bg-surface-overlay"
                        open={index === 0}
                      >
                        <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-5 px-5 py-4 text-left text-base font-medium text-ink sm:px-6 [&::-webkit-details-marker]:hidden">
                          {item.q}
                          <ChevronDown
                            aria-hidden
                            size={17}
                            className="shrink-0 text-ink-subtle transition-transform group-open:rotate-180 group-open:text-accent"
                          />
                        </summary>
                        <p className="border-t border-line px-5 py-5 text-base leading-[1.75] text-ink-muted sm:px-6">
                          {item.a}
                        </p>
                      </details>
                    ))}
                  </div>
                </section>
              )}

              <aside className="relative mt-24 overflow-hidden rounded-3xl border border-accent/25 bg-surface-raised p-8 sm:p-10">
                <div
                  aria-hidden
                  className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-accent/15 blur-3xl"
                />
                <div className="relative">
                  <Eyebrow>Apply it to your project</Eyebrow>
                  <h2 className="mt-6 text-2xl leading-tight text-ink sm:text-3xl">
                    Stuck on this in your own build?
                  </h2>
                  <p className="mt-4 max-w-xl text-base leading-relaxed text-ink-muted">
                    This is the kind of problem we work through in code reviews every
                    week. Send the problem statement and we&rsquo;ll tell you honestly
                    whether the scope is right.
                  </p>
                  <ButtonLink href="/contact" size="lg" className="mt-7">
                    Talk to us
                    <ArrowRight size={16} />
                  </ButtonLink>
                </div>
              </aside>
            </div>

            <aside className="hidden lg:block lg:self-start">
              <div className="sticky top-28 space-y-5">
                {headings.length > 2 && (
                  <nav
                    aria-label="On this page"
                    className="rounded-2xl border border-line bg-surface-raised p-5"
                  >
                    <p className="text-xs font-medium uppercase tracking-[0.14em] text-ink-subtle">
                      On this page
                    </p>
                    <ul className="mt-5 flex flex-col gap-1">
                      {headings.map((heading) => (
                        <li key={heading.text}>
                          <a
                            href={`#${headingId(heading.text)}`}
                            className="block rounded-xl border border-transparent px-3 py-2.5 text-sm leading-snug text-ink-subtle transition-colors hover:border-line hover:bg-surface-overlay hover:text-ink"
                          >
                            {heading.text}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </nav>
                )}
                <div className="rounded-2xl border border-line bg-surface-raised p-5">
                  <p className="text-sm font-medium text-ink">Need a second opinion?</p>
                  <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                    Send the problem statement directly to the Tenzok team.
                  </p>
                  <a
                    href={`mailto:${SITE.email}`}
                    className="mt-4 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-accent"
                  >
                    <Mail size={14} />
                    Email us
                  </a>
                </div>
              </div>
            </aside>
          </div>
        </Container>
      </article>

      {more.length > 0 && (
        <Section bordered className="mt-24">
          <div className="flex flex-col gap-7 md:flex-row md:items-end md:justify-between">
            <div>
              <Eyebrow>Keep reading</Eyebrow>
              <h2 className="mt-6 text-3xl leading-tight text-ink sm:text-4xl">
                Related engineering notes
              </h2>
            </div>
            <ButtonLink href="/blogs" variant="secondary">
              Browse all insights
              <ArrowRight size={15} />
            </ButtonLink>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {more.map((other, index) => (
              <Reveal key={other.slug} delay={index * 70} className="h-full">
                <Link
                  href={`/blogs/${other.slug}`}
                  className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-surface-raised p-6 transition-[border-color,background-color,transform] duration-300 hover:-translate-y-1 hover:border-line-strong hover:bg-surface-overlay"
                >
                  <div
                    aria-hidden
                    className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cool to-transparent opacity-50"
                  />
                  <p className="text-xs text-ink-subtle">
                    {formatDate(other.publishedAt)} · {other.readingMinutes} min
                  </p>
                  <h3 className="mt-4 text-lg leading-snug text-ink">{other.title}</h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-muted">
                    {other.excerpt}
                  </p>
                  <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-ink transition-colors group-hover:text-accent">
                    Read article
                    <ArrowUpRight
                      size={15}
                      className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </Section>
      )}

      <CtaFooter />
      <p className="sr-only">
        Published by {SITE.name}. Contact {SITE.email}.
      </p>
    </main>
  );
}
