import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import FaqList from "@/components/marketing/FaqList";
import { GENERAL_FAQS } from "@/components/marketing/faq-data";
import PageHero from "@/components/marketing/PageHero";
import TenzokNav from "@/components/TenzokNav";
import CtaFooter from "@/components/sections/CtaFooter";
import { ButtonLink } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { breadcrumbSchema, faqSchema } from "@/lib/seo";
import { socialMetadata, url } from "@/lib/site";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description:
    "Answers about Tenzok services, student projects, mini and major project scope, company delivery, source-code handover, and response times.",
  alternates: { canonical: url("/faq") },
  ...socialMetadata({
    title: "Frequently Asked Questions — Tenzok",
    description:
      "Clear answers about working with Tenzok on software delivery and guided student projects.",
    path: "/faq",
  }),
};

export default function FaqPage() {
  return (
    <main id="main" tabIndex={-1} className="bg-surface">
      <JsonLd
        schema={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "FAQ", path: "/faq" },
          ]),
          faqSchema([...GENERAL_FAQS]),
        ]}
      />
      <TenzokNav />

      <PageHero
        eyebrow="Frequently asked questions"
        title={
          <>
            Clear answers before{" "}
            <span className="gradient-text">we start.</span>
          </>
        }
        copy="What the process includes, how student and company engagements differ, and what you own at the end."
      >
        <ButtonLink href="/contact" size="lg">
          Ask a different question
        </ButtonLink>
      </PageHero>

      <Section bordered>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)] lg:gap-16">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-ink-subtle">
              The practical details
            </p>
            <h2 className="mt-5 text-3xl leading-[1.12] text-ink sm:text-4xl">
              No vague promises.{" "}
              <span className="gradient-text">
                Just the working model.
              </span>
            </h2>
            <p className="mt-5 max-w-md text-base leading-relaxed text-ink-muted">
              These answers reflect the services, project scopes, and handover standards
              already described across the Tenzok site.
            </p>
          </div>
          <FaqList items={GENERAL_FAQS} />
        </div>
      </Section>

      <CtaFooter />
    </main>
  );
}
