import Link from "next/link";
import { ArrowRight, ArrowUpRight, Clock3, Plus } from "lucide-react";
import { POSTS } from "../blog-posts";
import { ButtonLink } from "../ui/Button";
import { Section } from "../ui/Section";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

const FAQS = [
  {
    q: "Can Tenzok work from an idea or an incomplete problem statement?",
    a: "Yes. Scoping is the first stage of every engagement. We clarify the user, constraints, outcome, and realistic first release before deciding what should be built.",
  },
  {
    q: "Do students receive the source code and documentation?",
    a: "Yes. Student work includes the reviewed source, deployment, documentation, presentation support, and explanation needed to defend the project honestly.",
  },
  {
    q: "Can you sign an NDA before a business shares its idea?",
    a: "Yes. We can put confidentiality in writing before the detailed scoping conversation.",
  },
  {
    q: "What happens after launch?",
    a: "Every handover includes source access, documentation, and knowledge transfer. Ongoing support can be scoped when the product needs monitoring, iteration, or a longer roadmap.",
  },
];

export default function InsightsFaq() {
  const posts = [...POSTS]
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
    .slice(0, 3);

  return (
    <>
      <Section bordered>
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <SectionHeading
            eyebrow="Engineering notes"
            title={
              <>
                Useful thinking,{" "}
                <span className="gradient-text">written from the work.</span>
              </>
            }
            copy="Practical guides for product teams and students—specific enough to use in the next build."
          />
          <Reveal>
            <ButtonLink href="/blogs" variant="secondary">
              View all articles
              <ArrowRight size={15} />
            </ButtonLink>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-4 lg:grid-cols-3">
          {posts.map((post, index) => (
            <Reveal key={post.slug} delay={index * 60} className="h-full">
              <Link
                href={`/blogs/${post.slug}`}
                className="premium-card premium-card-hover group flex h-full flex-col rounded-3xl p-6"
              >
                <div className="flex items-center justify-between text-xs text-ink-subtle">
                  <span className="inline-flex items-center gap-1.5">
                    <Clock3 size={12} />
                    {post.readingMinutes} min read
                  </span>
                  <ArrowUpRight
                    size={15}
                    className="transition-colors group-hover:text-accent"
                  />
                </div>
                <h3 className="mt-8 text-xl leading-snug text-ink">{post.title}</h3>
                <p className="mt-3 flex-1 text-sm leading-6 text-ink-muted">
                  {post.excerpt}
                </p>
                <div className="mt-6 flex flex-wrap gap-1.5 border-t border-line pt-5">
                  {post.tags.slice(0, 2).map((tag) => (
                    <span key={tag} className="text-xs text-ink-subtle">
                      #{tag.replace(/\s+/g, "")}
                    </span>
                  ))}
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section bordered>
        <div className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div>
            <SectionHeading
              eyebrow="Frequently asked"
              title={
                <>
                  The details that matter{" "}
                  <span className="gradient-text">before we start.</span>
                </>
              }
              copy="Clear answers now make for a better working relationship later."
            />
            <Reveal delay={100}>
              <ButtonLink href="/faq" variant="secondary" className="mt-8">
                Read every answer
                <ArrowRight size={15} />
              </ButtonLink>
            </Reveal>
          </div>

          <div className="divide-y divide-line border-y border-line">
            {FAQS.map((item) => (
              <Reveal key={item.q}>
                <details className="group">
                  <summary className="flex min-h-20 cursor-pointer list-none items-center justify-between gap-5 py-5 text-left">
                    <span className="font-display text-base font-semibold text-ink sm:text-lg">
                      {item.q}
                    </span>
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line bg-white/[0.035]">
                      <Plus
                        size={15}
                        className="transition-transform duration-200 group-open:rotate-45"
                      />
                    </span>
                  </summary>
                  <p className="max-w-2xl pb-6 pr-12 text-sm leading-7 text-ink-muted">
                    {item.a}
                  </p>
                </details>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>
    </>
  );
}
