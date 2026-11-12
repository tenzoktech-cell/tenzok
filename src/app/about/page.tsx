import type { Metadata } from "next";
import { Building2, FileCheck2, GraduationCap, PackageOpen } from "lucide-react";
import JsonLd from "@/components/JsonLd";
import PageHero from "@/components/marketing/PageHero";
import Commitments from "@/components/sections/Commitments";
import CtaFooter from "@/components/sections/CtaFooter";
import Reveal from "@/components/sections/Reveal";
import SectionHeading from "@/components/sections/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { breadcrumbSchema, organizationSchema } from "@/lib/seo";
import { SITE, socialMetadata, url } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "Tenzok is an engineering studio that builds real systems with students and for companies, with written scope, visible progress, reviewed work, and full handover.",
  alternates: { canonical: url("/about") },
  ...socialMetadata({
    title: "About Tenzok",
    description:
      "An engineering studio for serious software delivery and guided student projects.",
    path: "/about",
  }),
};

const WORKING_MODEL = [
  {
    icon: FileCheck2,
    title: "Scoped in writing",
    copy: "The brief, milestones, and expected handover are clear before the work starts.",
  },
  {
    icon: Building2,
    title: "Built in the open",
    copy: "Progress is visible through reviewed work and regular demos, not hidden behind status reports.",
  },
  {
    icon: PackageOpen,
    title: "Handed over completely",
    copy: "Source, documentation, infrastructure information, and knowledge transfer stay with the client.",
  },
];

const LEADERSHIP_DEMO = [
  { role: "Director", initials: "DR" },
  { role: "Chief Executive Officer", initials: "CEO" },
  { role: "Chief Technology Officer", initials: "CTO" },
] as const;

export default function AboutPage() {
  return (
    <main id="main" tabIndex={-1} className="bg-surface">
      <JsonLd
        schema={[
          organizationSchema(),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "About", path: "/about" },
          ]),
        ]}
      />

      <PageHero
        eyebrow="About Tenzok"
        title={
          <>
            Serious software.{" "}
            <span className="gradient-text">
              Shared understanding.
            </span>
          </>
        }
        copy={SITE.description}
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <ButtonLink href="/contact" size="lg">
            Start your project
          </ButtonLink>
          <ButtonLink href="/services" variant="secondary" size="lg">
            Explore services
          </ButtonLink>
        </div>
      </PageHero>

      <Section compact bordered>
        <div className="grid gap-6 lg:grid-cols-2">
          <AudienceCard
            icon={Building2}
            eyebrow="For companies"
            title="Delivery without the black box."
            copy="Product engineering, delivery pods, modernization, cloud, digital marketing, and launch support—run with a named lead, visible progress, and documentation your team can inherit."
            href="/services/company-services"
            linkLabel="Company services"
          />
          <AudienceCard
            icon={GraduationCap}
            eyebrow="For students"
            title="Build it. Understand it. Defend it."
            copy="Mini and major projects are architected and built with you, reviewed line by line, deployed to a real URL, documented, and prepared for the viva."
            href="/services/student-projects"
            linkLabel="Student project support"
          />
        </div>
      </Section>

      <Section compact bordered>
        <SectionHeading compact
          eyebrow="Leadership"
          title={
            <>
              The people behind{" "}
              <span className="gradient-text">the direction.</span>
            </>
          }
          copy="A preview of how the leadership profiles will appear. Names, photographs, and profile details can be added later."
        />

        <div className="mobile-rail mt-8 grid gap-4 md:grid-cols-3">
          {LEADERSHIP_DEMO.map((profile, index) => (
            <Reveal key={profile.role} delay={index * 70} className="h-full">
              <article className="premium-card premium-card-hover group h-full overflow-hidden rounded-3xl">
                <div className="relative aspect-[16/10] overflow-hidden border-b border-line bg-surface-overlay">
                  <div
                    aria-hidden
                    className={`absolute inset-0 ${
                      index === 0
                        ? "bg-surface-overlay"
                        : index === 1
                          ? "bg-surface-overlay"
                          : "bg-surface-overlay"
                    }`}
                  />
                  <div
                    aria-hidden
                    className="page-grid absolute inset-0 opacity-30 transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex h-24 w-24 items-center justify-center rounded-full border border-ink/10 bg-ink/[0.045] text-lg font-semibold tracking-[0.12em] text-ink-muted shadow-sm shadow-ink/5">
                      {profile.initials}
                    </div>
                  </div>
                  <span className="absolute left-4 top-4 rounded-full border border-ink/10 bg-surface/85 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-muted backdrop-blur-md">
                    Demo profile
                  </span>
                  <span className="absolute bottom-4 right-4 text-[10px] uppercase tracking-[0.16em] text-ink-subtle">
                    Photo placeholder
                  </span>
                </div>

                <div className="p-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-cool">
                    {profile.role}
                  </p>
                  <h3 className="mt-3 text-xl text-ink">Name placeholder</h3>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section compact bordered>
        <div className="max-w-2xl">
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-ink-subtle">
            How we work
          </p>
          <h2 className="mt-4 text-2xl leading-[1.12] text-ink sm:text-3xl">
            A simple operating model, applied{" "}
            <span className="gradient-text">
              to every engagement.
            </span>
          </h2>
        </div>
        <div className="mobile-rail mt-8 grid gap-4 lg:grid-cols-3">
          {WORKING_MODEL.map((item, index) => {
            const Icon = item.icon;
            return (
              <article
                key={item.title}
                className="premium-card premium-card-hover rounded-3xl p-6"
              >
                <div className="flex items-center justify-between">
                  <Icon aria-hidden size={20} className="text-accent" />
                  <span className="font-display text-xl italic text-ink-subtle">
                    0{index + 1}
                  </span>
                </div>
                <h3 className="mt-5 text-lg text-ink">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                  {item.copy}
                </p>
              </article>
            );
          })}
        </div>
      </Section>

      <Commitments />
      <CtaFooter />
    </main>
  );
}

function AudienceCard({
  icon: Icon,
  eyebrow,
  title,
  copy,
  href,
  linkLabel,
}: {
  icon: typeof Building2;
  eyebrow: string;
  title: string;
  copy: string;
  href: string;
  linkLabel: string;
}) {
  return (
    <article className="premium-card premium-card-hover flex h-full flex-col rounded-3xl p-6">
      <Icon aria-hidden size={22} className="text-accent" />
      <p className="mt-8 text-xs font-medium uppercase tracking-[0.14em] text-ink-subtle">
        {eyebrow}
      </p>
      <h2 className="mt-3 text-xl text-ink">{title}</h2>
      <p className="mt-4 flex-1 text-base leading-relaxed text-ink-muted">{copy}</p>
      <ButtonLink href={href} variant="secondary" className="mt-8 self-start">
        {linkLabel}
      </ButtonLink>
    </article>
  );
}
