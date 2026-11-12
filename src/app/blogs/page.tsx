import type { Metadata } from "next";
import { Code2, Lightbulb, Search } from "lucide-react";
import BlogExplorer, { type ExplorerPost } from "@/components/BlogExplorer";
import JsonLd from "@/components/JsonLd";
import { POSTS } from "@/components/blog-posts";
import CtaFooter from "@/components/sections/CtaFooter";
import Reveal from "@/components/sections/Reveal";
import SectionHeading from "@/components/sections/SectionHeading";
import { Container, Eyebrow, Section } from "@/components/ui/Section";
import { breadcrumbSchema, itemListSchema } from "@/lib/seo";
import { socialMetadata, url } from "@/lib/site";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Engineering write-ups for students and teams: data leakage in ML projects, scoping a capstone, RAG that actually retrieves, deploying off localhost, and surviving the viva.",
  alternates: { canonical: url("/blogs") },
  ...socialMetadata({
    title: "Tenzok Blog",
    description:
      "Engineering write-ups for students and teams — specific, honest, and written by people who ship.",
    path: "/blogs",
  }),
};

const EXPLORER_POSTS: ExplorerPost[] = [...POSTS]
  .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
  .map((post) => ({
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    publishedAt: post.publishedAt,
    readingMinutes: post.readingMinutes,
    tags: post.tags,
  }));

const EDITORIAL_VALUES = [
  {
    icon: Code2,
    title: "Built from real reviews",
    copy: "The mistakes and trade-offs that repeatedly show up in working code.",
  },
  {
    icon: Search,
    title: "Specific enough to use",
    copy: "Concrete checks, architecture decisions, and questions you can apply today.",
  },
  {
    icon: Lightbulb,
    title: "Written to explain why",
    copy: "Not just a recipe—the reasoning you need for a viva, interview, or review.",
  },
];

export default function BlogsPage() {
  return (
    <main id="main" tabIndex={-1} className="overflow-hidden bg-surface">
      <JsonLd
        schema={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Blog", path: "/blogs" },
          ]),
          itemListSchema(
            "Tenzok Blog",
            EXPLORER_POSTS.map((post) => ({
              name: post.title,
              path: `/blogs/${post.slug}`,
            })),
          ),
        ]}
      />

      <section className="relative overflow-hidden pt-28 pb-10 sm:pt-32 sm:pb-12">
        <div
          aria-hidden
          className="pointer-events-none absolute -left-40 top-0 h-[34rem] w-[34rem] rounded-full bg-cool/10 hidden"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-48 top-24 h-[38rem] w-[38rem] rounded-full bg-accent/10 hidden"
        />

        <Container className="relative">
          <div className="grid items-end gap-8 lg:grid-cols-[minmax(0,1.3fr)_minmax(18rem,0.7fr)] lg:gap-16">
            <Reveal>
              <Eyebrow>Insights</Eyebrow>
              <h1 className="mt-5 max-w-4xl text-[clamp(2.25rem,1.7rem+2.2vw,3.5rem)] leading-[1.02] text-ink">
                Engineering notes from the{" "}
                <span className="gradient-text">
                  workshop floor.
                </span>
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-ink-muted">
                The bugs, scope decisions, and hard questions that keep appearing in
                code reviews—written down clearly enough to use in your next build.
              </p>
            </Reveal>

            <Reveal delay={120}>
              <aside className="relative border-l-2 border-accent pl-6">
                <div
                  aria-hidden
                  className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-cool/15 hidden"
                />
                                <p className="relative font-display text-4xl text-ink">
                  {POSTS.length}
                </p>
                <p className="relative mt-2 text-sm font-medium text-ink">
                  practical deep dives
                </p>
                <p className="relative mt-4 text-sm leading-relaxed text-ink-muted">
                  From final-year scoping and viva preparation to RAG, deployment, and
                  production-grade microservices.
                </p>
              </aside>
            </Reveal>
          </div>
        </Container>
      </section>

      <Section compact bordered>
        <SectionHeading compact
          eyebrow="Explore the library"
          title={
            <>
              Search by the problem{" "}
              <span className="gradient-text">you are solving.</span>
            </>
          }
          copy="Browse every existing article by title, topic, or the specific engineering challenge inside it."
        />
        <Reveal delay={100} className="mt-8">
          <BlogExplorer posts={EXPLORER_POSTS} />
        </Reveal>
      </Section>

      <Section compact bordered>
        <SectionHeading compact
          align="center"
          eyebrow="Editorial standard"
          title={
            <>
              No hype. Just{" "}
              <span className="gradient-text">useful reasoning.</span>
            </>
          }
        />
        <div className="mobile-rail mt-8 grid gap-4 md:grid-cols-3">
          {EDITORIAL_VALUES.map((item, index) => {
            const Icon = item.icon;
            return (
              <Reveal key={item.title} delay={index * 70} className="h-full">
                <article className="h-full rounded-2xl border border-line bg-surface-raised p-6">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-line bg-surface-overlay">
                    <Icon size={18} className="text-accent" />
                  </span>
                  <h2 className="mt-6 text-lg text-ink">{item.title}</h2>
                  <p className="mt-3 text-sm leading-relaxed text-ink-muted">{item.copy}</p>
                </article>
              </Reveal>
            );
          })}
        </div>
      </Section>

      <CtaFooter />
    </main>
  );
}
