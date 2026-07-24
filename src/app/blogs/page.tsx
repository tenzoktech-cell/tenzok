import type { Metadata } from "next";
import { BookOpen, Code2, Lightbulb, Search } from "lucide-react";
import BlogExplorer, { type ExplorerPost } from "@/components/BlogExplorer";
import JsonLd from "@/components/JsonLd";
import TenzokNav from "@/components/TenzokNav";
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
      <TenzokNav />

      <section className="relative overflow-hidden pt-32 pb-20 sm:pt-44 sm:pb-28">
        <div
          aria-hidden
          className="pointer-events-none absolute -left-40 top-0 h-[34rem] w-[34rem] rounded-full bg-cool/10 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-48 top-24 h-[38rem] w-[38rem] rounded-full bg-accent/10 blur-3xl"
        />

        <Container className="relative">
          <div className="grid items-end gap-12 lg:grid-cols-[minmax(0,1.3fr)_minmax(18rem,0.7fr)] lg:gap-16">
            <Reveal>
              <Eyebrow>Insights</Eyebrow>
              <h1 className="mt-6 max-w-4xl text-[clamp(2.6rem,1.9rem+3vw,4.75rem)] leading-[0.98] text-ink">
                Engineering notes from the{" "}
                <span className="bg-gradient-to-r from-accent to-cool bg-clip-text text-transparent">
                  workshop floor.
                </span>
              </h1>
              <p className="mt-7 max-w-2xl text-lg leading-relaxed text-ink-muted sm:text-xl">
                The bugs, scope decisions, and hard questions that keep appearing in
                code reviews—written down clearly enough to use in your next build.
              </p>
            </Reveal>

            <Reveal delay={120}>
              <aside className="relative overflow-hidden rounded-3xl border border-line bg-surface-raised p-7 shadow-2xl shadow-black/25">
                <div
                  aria-hidden
                  className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-cool/15 blur-3xl"
                />
                <BookOpen size={22} className="relative text-cool" />
                <p className="relative mt-6 text-5xl font-medium tracking-tight text-ink">
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

      <Section bordered>
        <SectionHeading
          eyebrow="Explore the library"
          title={
            <>
              Search by the problem{" "}
              <span className="gradient-text">you are solving.</span>
            </>
          }
          copy="Browse every existing article by title, topic, or the specific engineering challenge inside it."
        />
        <Reveal delay={100} className="mt-12">
          <BlogExplorer posts={EXPLORER_POSTS} />
        </Reveal>
      </Section>

      <Section bordered>
        <SectionHeading
          align="center"
          eyebrow="Editorial standard"
          title={
            <>
              No hype. Just{" "}
              <span className="gradient-text">useful reasoning.</span>
            </>
          }
        />
        <div className="mt-12 grid gap-4 md:grid-cols-3">
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
