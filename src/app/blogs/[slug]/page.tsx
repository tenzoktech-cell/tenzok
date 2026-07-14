import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Clock } from "lucide-react";
import ArticleBody, { headingId } from "@/components/ArticleBody";
import JsonLd from "@/components/JsonLd";
import TenzokNav from "@/components/TenzokNav";
import { POSTS, getPost } from "@/components/blog-posts";
import CtaFooter from "@/components/sections/CtaFooter";
import { ButtonLink } from "@/components/ui/Button";
import { Container, Eyebrow, Section } from "@/components/ui/Section";
import { articleSchema, breadcrumbSchema, faqSchema } from "@/lib/seo";
import { SITE, url } from "@/lib/site";

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

  return {
    title: post.title,
    description: post.description,
    keywords: post.keywords,
    alternates: { canonical: url(`/blogs/${slug}`) },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      url: url(`/blogs/${slug}`),
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt ?? post.publishedAt,
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
    },
  };
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function BlogPostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const headings = post.body.filter((b) => b.type === "h2");
  const more = POSTS.filter((p) => p.slug !== post.slug).slice(0, 3);

  return (
    <main id="main" tabIndex={-1} className="bg-surface">
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
        <header className="pt-36 pb-8 sm:pt-44">
          <Container>
            <Link
              href="/blogs"
              className="inline-flex min-h-11 items-center gap-2 text-sm text-ink-subtle transition-colors hover:text-ink"
            >
              <ArrowLeft size={14} />
              All articles
            </Link>

            <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-ink-subtle">
              <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
              <span aria-hidden>·</span>
              <span className="flex items-center gap-1.5">
                <Clock size={13} />
                {post.readingMinutes} min read
              </span>
            </div>

            <h1 className="mt-6 max-w-4xl text-[clamp(1.875rem,1.4rem+2.2vw,3.25rem)] leading-[1.1] text-ink">
              {post.title}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-muted">
              {post.excerpt}
            </p>

            <div className="mt-8 flex flex-wrap gap-1.5">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-md border border-line bg-surface-raised px-2.5 py-1.5 text-xs text-ink-muted"
                >
                  {tag}
                </span>
              ))}
            </div>
          </Container>
        </header>

        <Container>
          <div className="grid gap-12 border-t border-line pt-12 lg:grid-cols-[1fr_220px] lg:gap-16">
            {/* max-w-2xl: a measure of ~70 characters. Long lines are the single
                most common reason people bounce off a long article. */}
            <div className="max-w-2xl">
              <ArticleBody body={post.body} />

              {post.faq.length > 0 && (
                <section className="mt-20 border-t border-line pt-12">
                  <h2 className="text-2xl text-ink sm:text-3xl">
                    Questions people actually ask
                  </h2>
                  <dl className="mt-8 flex flex-col gap-6">
                    {post.faq.map((item) => (
                      <div
                        key={item.q}
                        className="rounded-2xl border border-line bg-surface-raised p-6"
                      >
                        <dt className="text-base font-medium text-ink">{item.q}</dt>
                        <dd className="mt-3 text-base leading-[1.7] text-ink-muted">
                          {item.a}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </section>
              )}

              <aside className="mt-20 rounded-2xl border border-accent/30 bg-accent/[0.06] p-8">
                <h2 className="text-xl text-ink">Stuck on this in your own project?</h2>
                <p className="mt-3 text-base leading-relaxed text-ink-muted">
                  This is the kind of thing we work through in code reviews every week.
                  Send us your problem statement — we&rsquo;ll tell you honestly whether
                  it&rsquo;s scoped right.
                </p>
                <ButtonLink href="/contact" size="lg" className="mt-6">
                  Talk to us
                </ButtonLink>
              </aside>
            </div>

            {/* On-page table of contents. Google uses these anchors for
                "jump to section" links in search results. */}
            {headings.length > 2 && (
              <nav
                aria-label="On this page"
                className="hidden lg:sticky lg:top-28 lg:block lg:self-start"
              >
                <p className="text-xs font-medium uppercase tracking-[0.14em] text-ink-subtle">
                  On this page
                </p>
                <ul className="mt-4 flex flex-col gap-3 border-l border-line">
                  {headings.map((h) => (
                    <li key={h.text}>
                      <a
                        href={`#${headingId(h.text)}`}
                        className="-ml-px block border-l border-transparent pl-4 text-sm leading-snug text-ink-subtle transition-colors hover:border-accent hover:text-ink"
                      >
                        {h.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            )}
          </div>
        </Container>
      </article>

      {more.length > 0 && (
        <Section bordered className="mt-24">
          <Eyebrow>Keep reading</Eyebrow>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {more.map((other) => (
              <Link
                key={other.slug}
                href={`/blogs/${other.slug}`}
                className="group flex flex-col rounded-2xl border border-line bg-surface-raised p-6 transition-colors hover:border-line-strong hover:bg-surface-overlay"
              >
                <h3 className="text-base leading-snug text-ink">{other.title}</h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-muted">
                  {other.excerpt}
                </p>
                <ArrowUpRight
                  size={16}
                  className="mt-5 text-ink-subtle transition-colors group-hover:text-accent"
                />
              </Link>
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
