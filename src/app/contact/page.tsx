import type { Metadata } from "next";
import { Suspense } from "react";
import { ArrowUpRight, Clock3, FileLock2, Mail, MessageSquare } from "lucide-react";
import CtaFooter from "@/components/sections/CtaFooter";
import Reveal from "@/components/sections/Reveal";
import { Container, Eyebrow } from "@/components/ui/Section";
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
      <section className="pt-28 pb-10 sm:pt-32 sm:pb-12">
        <Container>
          <Reveal>
            <div className="max-w-3xl">
              <Eyebrow>Start a conversation</Eyebrow>
              <h1 className="mt-5 text-[clamp(2.25rem,1.7rem+2.2vw,3.5rem)] leading-[1.02] text-ink">
                Tell us what you want to{" "}
                <span className="gradient-text">
                  build next.
                </span>
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-ink-muted">
                A product idea, a problem statement, or simply the sentence
                &ldquo;I&rsquo;m stuck.&rdquo; Give us enough context to understand the
                goal. We&rsquo;ll help map the next step.
              </p>
            </div>
          </Reveal>
        </Container>
      </section>

      <section className="border-t border-line py-12 sm:py-16">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)] lg:gap-14">
            <div className="order-2 flex flex-col gap-8 lg:order-1 lg:pt-2">
              <Reveal>
                <div>
                  <h2 className="text-xl leading-tight text-ink sm:text-2xl">
                    The first reply should already be useful.
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-ink-muted">
                    We read every enquiry in context. If the scope is too broad, the
                    timeline is unrealistic, or another route would serve you better,
                    we&rsquo;ll say so.
                  </p>

                  <a
                    href={`mailto:${SITE.email}`}
                    className="mt-5 inline-flex items-center gap-2.5 text-sm text-ink-muted transition-colors hover:text-ink"
                  >
                    <Mail size={16} className="text-accent" />
                    <span>
                      Prefer email?{" "}
                      <span className="font-medium text-ink underline decoration-line-strong underline-offset-4">
                        {SITE.email}
                      </span>
                    </span>
                    <ArrowUpRight size={14} className="shrink-0" />
                  </a>
                </div>
              </Reveal>

              <div className="border-t border-line">
                {PROMISES.map((promise, index) => {
                  const Icon = promise.icon;
                  return (
                    <Reveal key={promise.title} delay={index * 60}>
                      <div className="flex items-start gap-3.5 border-b border-line py-4">
                        <Icon size={16} className="mt-0.5 shrink-0 text-accent" />
                        <span>
                          <span className="block text-sm font-medium text-ink">
                            {promise.title}
                          </span>
                          <span className="mt-1 block text-[13px] leading-5 text-ink-muted">
                            {promise.copy}
                          </span>
                        </span>
                      </div>
                    </Reveal>
                  );
                })}
              </div>
            </div>

            <Reveal delay={100} className="order-1 lg:order-2">
              <div className="rounded-xl border border-line bg-surface-raised p-5 sm:p-7">
                <div className="mb-5 border-b border-line pb-5">
                  <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-subtle">
                    Project brief
                  </p>
                  <h2 className="mt-2 text-xl text-ink sm:text-2xl">
                    A few details are enough to begin.
                  </h2>
                  <p className="mt-2 text-[13px] leading-5 text-ink-muted">
                    Required fields are kept intentionally short. Add the service if you
                    know it; leave it open if you do not.
                  </p>
                </div>
                <Suspense fallback={<ContactFormFallback />}>
                  <ContactForm />
                </Suspense>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      <CtaFooter />
    </main>
  );
}

function ContactFormFallback() {
  return (
    <div aria-label="Preparing contact form" className="space-y-5">
      {[1, 2, 3, 4].map((item) => (
        <div key={item}>
          <div className="mb-2 h-4 w-24 animate-pulse rounded bg-ink/[0.06]" />
          <div className="h-11 animate-pulse rounded-lg border border-line bg-surface-overlay" />
        </div>
      ))}
      <div className="h-12 w-40 animate-pulse rounded-full bg-accent/20" />
    </div>
  );
}
