import type { Metadata } from "next";
import { Suspense } from "react";
import { ArrowUpRight, Clock3, FileLock2, Mail, MessageSquare, Sparkles } from "lucide-react";
import TenzokNav from "@/components/TenzokNav";
import CtaFooter from "@/components/sections/CtaFooter";
import Reveal from "@/components/sections/Reveal";
import { Container, Eyebrow, Section } from "@/components/ui/Section";
import { SITE, socialMetadata, url } from "@/lib/site";
import ContactForm from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Tell us about your project, your startup, or your semester. Three fields, and a real person replies — usually within a working day.",
  alternates: { canonical: url("/contact") },
  ...socialMetadata({
    title: "Contact — Tenzok",
    description:
      "Tell us about your project, your startup, or your semester. Three fields, and a real person replies — usually within a working day.",
    path: "/contact",
  }),
};

const PROMISES = [
  {
    icon: FileLock2,
    title: "NDA before the details",
    copy: "For company enquiries, we sign before the scoping call—not after.",
  },
  {
    icon: Clock3,
    title: "A reply within a working day",
    copy: "From someone who could build the thing, not a generic sales inbox.",
  },
  {
    icon: MessageSquare,
    title: "One useful conversation",
    copy: "No sales sequence. We reply with the next decision, not a drip campaign.",
  },
];

export default function ContactPage() {
  return (
    <main id="main" tabIndex={-1} className="overflow-hidden bg-surface">
      <TenzokNav />

      <section className="relative overflow-hidden pt-32 pb-20 sm:pt-44 sm:pb-28">
        <div
          aria-hidden
          className="pointer-events-none absolute -left-40 top-0 h-[34rem] w-[34rem] rounded-full bg-accent/10 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-48 top-24 h-[38rem] w-[38rem] rounded-full bg-cool/10 blur-3xl"
        />

        <Container className="relative">
          <Reveal>
            <div className="max-w-4xl">
              <Eyebrow>Start a conversation</Eyebrow>
              <h1 className="mt-6 text-[clamp(2.6rem,1.9rem+3vw,4.75rem)] leading-[0.98] text-ink">
                Tell us what you want to{" "}
                <span className="bg-gradient-to-r from-accent to-cool bg-clip-text text-transparent">
                  build next.
                </span>
              </h1>
              <p className="mt-7 max-w-2xl text-lg leading-relaxed text-ink-muted sm:text-xl">
                A product idea, a problem statement, or simply the sentence
                &ldquo;I&rsquo;m stuck.&rdquo; Give us enough context to understand the
                goal. We&rsquo;ll help map the next step.
              </p>
            </div>
          </Reveal>
        </Container>
      </section>

      <Section bordered className="pt-16 md:pt-20">
        <div className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:gap-10">
          <div className="flex flex-col gap-5">
            <Reveal>
              <div className="relative overflow-hidden rounded-3xl border border-line bg-surface-raised p-7 shadow-2xl shadow-black/20 sm:p-8">
                <div
                  aria-hidden
                  className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-cool/15 blur-3xl"
                />
                <span className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-cool/30 bg-cool/10">
                  <Sparkles size={18} className="text-cool" />
                </span>
                <h2 className="relative mt-6 text-2xl leading-tight text-ink">
                  The first reply should already be useful.
                </h2>
                <p className="relative mt-4 text-sm leading-relaxed text-ink-muted">
                  We read every enquiry in context. If the scope is too broad, the
                  timeline is unrealistic, or another route would serve you better,
                  we&rsquo;ll say so.
                </p>

                <a
                  href={`mailto:${SITE.email}`}
                  className="relative mt-7 flex min-h-14 items-center justify-between gap-4 rounded-2xl border border-line bg-surface-overlay px-5 transition-colors hover:border-line-strong"
                >
                  <span className="flex items-center gap-3">
                    <Mail size={17} className="text-accent" />
                    <span>
                      <span className="block text-xs text-ink-subtle">Prefer email?</span>
                      <span className="mt-0.5 block text-sm font-medium text-ink">
                        {SITE.email}
                      </span>
                    </span>
                  </span>
                  <ArrowUpRight size={16} className="shrink-0 text-ink-subtle" />
                </a>
              </div>
            </Reveal>

            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              {PROMISES.map((promise, index) => {
                const Icon = promise.icon;
                return (
                  <Reveal key={promise.title} delay={index * 60} className="h-full">
                    <article className="flex h-full items-start gap-4 rounded-2xl border border-line bg-surface-raised p-5">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-line bg-surface-overlay">
                        <Icon size={16} className="text-accent" />
                      </span>
                      <span>
                        <span className="block text-sm font-medium text-ink">
                          {promise.title}
                        </span>
                        <span className="mt-1.5 block text-sm leading-relaxed text-ink-muted">
                          {promise.copy}
                        </span>
                      </span>
                    </article>
                  </Reveal>
                );
              })}
            </div>
          </div>

          <Reveal delay={100} className="h-full">
            <div className="relative h-full overflow-hidden rounded-3xl border border-line bg-surface-raised p-6 shadow-2xl shadow-black/25 sm:p-8 lg:p-10">
              <div
                aria-hidden
                className="pointer-events-none absolute -right-24 -top-28 h-72 w-72 rounded-full bg-accent/10 blur-3xl"
              />
              <div className="relative">
                <div className="mb-8 border-b border-line pb-7">
                  <p className="text-xs font-medium uppercase tracking-[0.14em] text-ink-subtle">
                    Project brief
                  </p>
                  <h2 className="mt-3 text-2xl text-ink sm:text-3xl">
                    A few details are enough to begin.
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                    Required fields are kept intentionally short. Add the service if you
                    know it; leave it open if you do not.
                  </p>
                </div>
                <Suspense fallback={<ContactFormFallback />}>
                  <ContactForm />
                </Suspense>
              </div>
            </div>
          </Reveal>
        </div>
      </Section>

      <CtaFooter />
    </main>
  );
}

function ContactFormFallback() {
  return (
    <div aria-label="Preparing contact form" className="space-y-5">
      {[1, 2, 3, 4].map((item) => (
        <div key={item}>
          <div className="mb-2 h-4 w-24 animate-pulse rounded bg-white/[0.06]" />
          <div className="h-12 animate-pulse rounded-xl border border-line bg-surface-overlay" />
        </div>
      ))}
      <div className="h-12 w-40 animate-pulse rounded-full bg-accent/20" />
    </div>
  );
}
