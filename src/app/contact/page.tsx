import type { Metadata } from "next";
import { Clock, FileLock2, Mail, MessageSquare } from "lucide-react";
import TenzokNav from "@/components/TenzokNav";
import { getService } from "@/components/services-data";
import CtaFooter from "@/components/sections/CtaFooter";
import { Container, Eyebrow } from "@/components/ui/Section";
import { SITE, url } from "@/lib/site";
import ContactForm from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Tell us about your project, your startup, or your semester. Three fields, and a real person replies — usually within a working day.",
  alternates: { canonical: url("/contact") },
  openGraph: { url: url("/contact") },
};

const PROMISES = [
  {
    icon: FileLock2,
    title: "NDA before we hear a detail",
    copy: "For company enquiries, we sign before the scoping call — not after.",
  },
  {
    icon: Clock,
    title: "A reply within a working day",
    copy: "From a person who could actually build the thing, not a sales inbox.",
  },
  {
    icon: MessageSquare,
    title: "No sales sequence",
    copy: "One reply, one conversation. We don't run drip campaigns at students.",
  },
];

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ service?: string }>;
}) {
  const { service } = await searchParams;
  // The picker sends a slug; the form's <select> is keyed by display name.
  const preselected = service ? getService(service)?.name : undefined;

  return (
    <main id="main" tabIndex={-1} className="bg-surface">
      <TenzokNav />

      <section className="pt-36 pb-24 sm:pt-44 md:pb-32">
        <Container>
          <div className="grid gap-16 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
            <div>
              <Eyebrow>Contact</Eyebrow>
              <h1 className="mt-6 text-[clamp(2rem,1.5rem+2.4vw,3.5rem)] leading-[1.08] text-ink">
                Tell us what you&rsquo;re{" "}
                <span className="font-display italic text-accent">building.</span>
              </h1>
              <p className="mt-6 text-lg leading-relaxed text-ink-muted">
                A problem statement, a product idea, or just the sentence
                &ldquo;I&rsquo;m stuck.&rdquo; That&rsquo;s enough to start.
              </p>

              <ul className="mt-12 flex flex-col gap-6">
                {PROMISES.map((promise) => {
                  const Icon = promise.icon;
                  return (
                    <li key={promise.title} className="flex items-start gap-4">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-line bg-surface-raised">
                        <Icon size={17} className="text-accent" />
                      </span>
                      <span>
                        <span className="block text-sm font-medium text-ink">
                          {promise.title}
                        </span>
                        <span className="mt-1 block text-sm leading-relaxed text-ink-muted">
                          {promise.copy}
                        </span>
                      </span>
                    </li>
                  );
                })}
              </ul>

              <p className="mt-12 border-t border-line pt-8 text-sm text-ink-subtle">
                Prefer email?{" "}
                <a
                  href={`mailto:${SITE.email}`}
                  className="inline-flex items-center gap-1.5 text-ink-muted underline underline-offset-4 transition-colors hover:text-ink"
                >
                  <Mail size={14} />
                  {SITE.email}
                </a>
              </p>
            </div>

            <div className="rounded-2xl border border-line bg-surface-raised/50 p-6 sm:p-8">
              <ContactForm defaultService={preselected} />
            </div>
          </div>
        </Container>
      </section>

      <CtaFooter />
    </main>
  );
}
