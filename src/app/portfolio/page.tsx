import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import {
  CapabilityGrid,
  RepresentativeBriefs,
} from "@/components/marketing/CapabilityLibrary";
import PageHero from "@/components/marketing/PageHero";
import TenzokNav from "@/components/TenzokNav";
import { DOMAINS, TOTAL_PROJECTS } from "@/components/projects-data";
import CtaFooter from "@/components/sections/CtaFooter";
import { ButtonLink } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { breadcrumbSchema, itemListSchema } from "@/lib/seo";
import { socialMetadata, url } from "@/lib/site";

export const metadata: Metadata = {
  title: "Capabilities & Build Library",
  description: `Explore Tenzok capabilities through ${TOTAL_PROJECTS} scoped build briefs across ${DOMAINS.length} engineering domains. These are buildable briefs, not claims of completed client work.`,
  alternates: { canonical: url("/portfolio") },
  ...socialMetadata({
    title: "Capabilities & Build Library — Tenzok",
    description: `A transparent view of the systems Tenzok can scope and build, grounded in ${TOTAL_PROJECTS} existing engineering briefs.`,
    path: "/portfolio",
  }),
};

export default function PortfolioPage() {
  return (
    <main id="main" tabIndex={-1} className="bg-surface">
      <JsonLd
        schema={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Capabilities & Build Library", path: "/portfolio" },
          ]),
          itemListSchema(
            "Tenzok engineering capabilities",
            DOMAINS.map((domain) => ({
              name: domain.name,
              path: `/projects/${domain.slug}`,
            })),
          ),
        ]}
      />
      <TenzokNav />

      <PageHero
        eyebrow="Capabilities & build library"
        title={
          <>
            What we can build,{" "}
            <span className="gradient-text">
              shown without theatre.
            </span>
          </>
        }
        copy={`This is a transparent library of ${TOTAL_PROJECTS} scoped briefs across ${DOMAINS.length} engineering domains—not a gallery of invented client logos or completed-project claims.`}
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <ButtonLink href="/contact" size="lg">
            Discuss your brief
          </ButtonLink>
          <ButtonLink href="/projects" variant="secondary" size="lg">
            Browse all {TOTAL_PROJECTS} briefs
          </ButtonLink>
        </div>
      </PageHero>

      <Section bordered>
        <div className="max-w-3xl">
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-ink-subtle">
            Representative briefs
          </p>
          <h2 className="mt-5 text-3xl leading-[1.12] text-ink sm:text-4xl">
            Real scopes, stacks, and{" "}
            <span className="gradient-text">deliverables.</span>
          </h2>
          <p className="mt-5 text-base leading-relaxed text-ink-muted">
            Each card below is an existing build brief: a concrete starting point that
            can be adapted to a student capstone or a company problem. It is not
            presented as completed client work.
          </p>
        </div>
        <div className="mt-12">
          <RepresentativeBriefs />
        </div>
      </Section>

      <Section bordered>
        <div className="max-w-3xl">
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-ink-subtle">
            Engineering coverage
          </p>
          <h2 className="mt-5 text-3xl leading-[1.12] text-ink sm:text-4xl">
            {DOMAINS.length} domains.{" "}
            <span className="gradient-text">
              One delivery standard.
            </span>
          </h2>
          <p className="mt-5 text-base leading-relaxed text-ink-muted">
            Explore the tools, company use cases, and project briefs already documented
            for every domain.
          </p>
        </div>
        <div className="mt-12">
          <CapabilityGrid />
        </div>
      </Section>

      <CtaFooter />
    </main>
  );
}
