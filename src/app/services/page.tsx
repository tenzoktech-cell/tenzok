import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import JsonLd from "@/components/JsonLd";
import StartJourneyButton from "@/components/StartJourneyModal";
import TenzokNav from "@/components/TenzokNav";
import { SERVICES } from "@/components/services-data";
import CtaFooter from "@/components/sections/CtaFooter";
import Reveal from "@/components/sections/Reveal";
import { Container, Eyebrow, Section } from "@/components/ui/Section";
import { breadcrumbSchema, itemListSchema } from "@/lib/seo";
import { url } from "@/lib/site";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Mentorship, student projects, company services, digital marketing, and launch support — every Tenzok engagement, end to end.",
  keywords: [
    "software mentorship",
    "final year project help",
    "software development company",
    "product engineering services",
    "capstone project guidance",
  ],
  alternates: { canonical: url("/services") },
  openGraph: {
    title: "Services — Tenzok",
    description:
      "Five ways to work with Tenzok — scoped in writing, built in the open, handed over with nothing hidden.",
    url: url("/services"),
  },
};

export default function ServicesIndexPage() {
  return (
    <main id="main" tabIndex={-1} className="bg-surface">
      <JsonLd
        schema={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Services", path: "/services" },
          ]),
          itemListSchema(
            "Tenzok services",
            SERVICES.map((s) => ({ name: s.name, path: `/services/${s.slug}` })),
          ),
        ]}
      />
      <TenzokNav />

      <section className="pt-28 pb-8 sm:pt-44">
        <Container>
          <Reveal>
            <Eyebrow>Our Services</Eyebrow>
            <h1 className="mt-6 max-w-3xl text-[clamp(2rem,1.5rem+2.4vw,3.5rem)] leading-[1.08] text-ink">
              One team,{" "}
              <span className="font-display italic text-accent">brief to launch.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-muted">
              Five ways to work with Tenzok — each one runs on the same transparent
              process: scoped in writing, built in the open, and handed over with nothing
              hidden.
            </p>
          </Reveal>
        </Container>
      </section>

      <Section>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((service, i) => {
            const Icon = service.icon;
            return (
              <Reveal key={service.slug} delay={(i % 3) * 70} className="h-full">
                <Link
                  href={`/services/${service.slug}`}
                  className="group flex h-full flex-col rounded-2xl border border-line bg-surface-raised p-6 transition-colors hover:border-line-strong hover:bg-surface-overlay"
                >
                  <div className="flex items-start justify-between">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-line bg-surface-overlay">
                      <Icon
                        size={20}
                        className="text-ink-muted transition-colors group-hover:text-accent"
                      />
                    </span>
                    <ArrowUpRight
                      size={16}
                      className="text-ink-subtle transition-colors group-hover:text-accent"
                    />
                  </div>
                  <h2 className="mt-6 text-lg text-ink">{service.name}</h2>
                  <p className="mt-1 text-sm text-ink-subtle">{service.audience}</p>
                  <p className="mt-4 text-sm leading-relaxed text-ink-muted">
                    {service.intro}
                  </p>
                </Link>
              </Reveal>
            );
          })}

          <Reveal delay={140} className="h-full">
            <div className="flex h-full flex-col items-start justify-center rounded-2xl border border-accent/30 bg-accent/[0.06] p-6">
              <h2 className="text-lg text-ink">Not sure which fits?</h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                Tell us where you are — we&rsquo;ll point you to the right starting line
                in one call.
              </p>
              <StartJourneyButton className="mt-6" />
            </div>
          </Reveal>
        </div>
      </Section>

      <CtaFooter />
    </main>
  );
}
