import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Globe2,
  Laptop2,
  Layers3,
  Megaphone,
  Palette,
  Route,
  Search,
  ShieldCheck,
  ShoppingCart,
  Smartphone,
  Settings2,
} from "lucide-react";
import JsonLd from "@/components/JsonLd";
import StartJourneyButton from "@/components/StartJourneyModal";
import TenzokNav from "@/components/TenzokNav";
import { SERVICES } from "@/components/services-data";
import CtaFooter from "@/components/sections/CtaFooter";
import Reveal from "@/components/sections/Reveal";
import SectionHeading from "@/components/sections/SectionHeading";
import { Container, Eyebrow, Section } from "@/components/ui/Section";
import { breadcrumbSchema, itemListSchema } from "@/lib/seo";
import { socialMetadata, url } from "@/lib/site";

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
  ...socialMetadata({
    title: "Services — Tenzok",
    description:
      "Five ways to work with Tenzok — scoped in writing, built in the open, handed over with nothing hidden.",
    path: "/services",
  }),
};

const PRINCIPLES = [
  {
    icon: Route,
    title: "A written path",
    copy: "Scope, milestones, and ownership are clear before the first build sprint starts.",
  },
  {
    icon: Layers3,
    title: "Visible progress",
    copy: "Working software and concrete deliverables replace vague status updates.",
  },
  {
    icon: ShieldCheck,
    title: "A complete handover",
    copy: "Source, documentation, deployment, and explanation stay with you.",
  },
];

const CAPABILITIES = [
  { icon: Smartphone, title: "Mobile App Development", copy: "Cross-platform iOS and Android products built for reliable everyday use.", href: "/services/company-services" },
  { icon: Globe2, title: "Web App Development", copy: "Full-stack applications with modern, reactive interfaces.", href: "/services/company-services" },
  { icon: Palette, title: "UI/UX Design", copy: "Clear flows and polished interfaces shaped around real users.", href: "/services/company-services" },
  { icon: ShoppingCart, title: "E-Commerce Solutions", copy: "Online stores and commerce workflows that are easy to operate.", href: "/services/company-services" },
  { icon: Settings2, title: "Admin Panel Development", copy: "Dashboards and back-office tools your team can actually use.", href: "/services/company-services" },
  { icon: Megaphone, title: "Digital Marketing", copy: "SEO, content, campaigns, and launch support that compound.", href: "/services/digital-marketing" },
  { icon: Laptop2, title: "Custom Software", copy: "Bespoke systems built around the way your business works.", href: "/services/company-services" },
  { icon: Search, title: "Tech Consulting", copy: "Practical architecture and product decisions before expensive build work.", href: "/services/company-services" },
] as const;

export default function ServicesIndexPage() {
  return (
    <main id="main" tabIndex={-1} className="overflow-hidden bg-surface">
      <JsonLd
        schema={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Services", path: "/services" },
          ]),
          itemListSchema(
            "Tenzok services",
            SERVICES.map((service) => ({
              name: service.name,
              path: `/services/${service.slug}`,
            })),
          ),
        ]}
      />
      <TenzokNav />

      <section className="relative overflow-hidden pt-28 pb-16 sm:pt-32 sm:pb-20">
        <div
          aria-hidden
          className="pointer-events-none absolute -left-40 top-0 h-[34rem] w-[34rem] rounded-full bg-accent/10 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-48 top-20 h-[38rem] w-[38rem] rounded-full bg-cool/10 blur-3xl"
        />
        <Container className="relative">
          <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.08fr)_minmax(18rem,0.92fr)] lg:gap-14">
            <Reveal>
              <Eyebrow>Services</Eyebrow>
              <h1 className="mt-6 max-w-3xl text-[clamp(2.6rem,1.9rem+3vw,4.75rem)] leading-[0.98] text-ink">
                From the first brief to a{" "}
                <span className="bg-gradient-to-r from-accent to-cool bg-clip-text text-transparent">
                  confident launch.
                </span>
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-ink-muted sm:text-lg">
                Product delivery for companies, guided engineering for students, and
                growth support when the work is ready to meet the world. One team owns
                the journey end to end.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <StartJourneyButton size="lg" label="Start your project" />
                <a
                  href="#services"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-line-strong bg-surface-raised px-7 text-sm font-medium text-ink transition-colors hover:bg-surface-overlay sm:text-base"
                >
                  Explore services
                  <ArrowRight size={16} />
                </a>
              </div>
            </Reveal>

            <Reveal delay={120}>
              <div className="relative max-w-md overflow-hidden rounded-3xl border border-line bg-surface-raised/80 p-6 shadow-2xl shadow-black/20 lg:ml-auto">
                <div
                  aria-hidden
                  className="absolute -right-16 -top-20 h-48 w-48 rounded-full bg-cool/12 blur-3xl"
                />
                <p className="relative text-xs font-semibold uppercase tracking-[0.16em] text-cool">
                  End-to-end delivery
                </p>
                <p className="relative mt-4 text-base leading-7 text-ink-muted">
                From idea to launch — we handle every layer of your digital product.
                </p>
                <div className="relative mt-5 flex flex-wrap gap-2">
                  {["Strategy", "Design", "Engineering", "Launch"].map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-line bg-white/[0.035] px-3 py-1.5 text-xs text-ink-muted"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      <Section id="capabilities" bordered>
        <SectionHeading
          eyebrow="What we do"
          title={
            <>
              Services built around{" "}
              <span className="gradient-text">the outcome.</span>
            </>
          }
          copy="A focused team across product strategy, design, engineering, and growth — assembled around what you need next."
        />
        <div className="mt-12 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {CAPABILITIES.map((item, index) => {
            const Icon = item.icon;
            return (
              <Reveal key={item.title} delay={(index % 4) * 60} className="h-full">
                <Link
                  href={item.href}
                  className="premium-card premium-card-hover group flex h-full min-h-64 flex-col rounded-2xl p-6"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-cool/20 bg-cool/10 text-cool">
                    <Icon size={20} />
                  </span>
                  <h2 className="mt-8 text-xl leading-tight text-ink">{item.title}</h2>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-muted">{item.copy}</p>
                  <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-ink-muted transition-colors group-hover:text-cool">
                    Explore capability <ArrowUpRight size={15} />
                  </span>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </Section>

      <Section id="services" bordered>
        <SectionHeading
          eyebrow="Choose your starting point"
          title={
            <>
              Different needs.{" "}
              <span className="gradient-text">One delivery standard.</span>
            </>
          }
          copy="Each service has its own pace and deliverables, but every engagement stays transparent, reviewable, and built for a clean handover."
        />

        <div className="mt-12 grid gap-5 lg:grid-cols-2">
          {SERVICES.map((service, index) => {
            const Icon = service.icon;
            const featured = service.slug === "company-services";

            return (
              <Reveal
                key={service.slug}
                delay={(index % 2) * 70}
                className={index === SERVICES.length - 1 ? "h-full lg:col-span-2" : "h-full"}
              >
                <Link
                  href={`/services/${service.slug}`}
                  className={`group relative flex h-full flex-col overflow-hidden rounded-3xl border p-7 transition-[border-color,background-color,transform] duration-300 hover:-translate-y-1 sm:p-8 ${
                    featured
                      ? "border-accent/30 bg-accent/[0.06] hover:border-accent/50"
                      : "border-line bg-surface-raised hover:border-line-strong hover:bg-surface-overlay"
                  }`}
                >
                  <div
                    aria-hidden
                    className={`absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent ${
                      featured ? "via-accent" : "via-cool"
                    } to-transparent opacity-60`}
                  />
                  <div className="flex items-start justify-between gap-5">
                    <div className="flex items-center gap-4">
                      <span
                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border ${
                          featured
                            ? "border-accent/30 bg-accent/10"
                            : "border-line bg-surface-overlay"
                        }`}
                      >
                        <Icon
                          size={21}
                          className={featured ? "text-accent" : "text-cool"}
                        />
                      </span>
                      <div>
                        <p className="text-xs font-medium uppercase tracking-[0.14em] text-ink-subtle">
                          0{index + 1}
                        </p>
                        <p className="mt-1 text-sm text-ink-muted">{service.audience}</p>
                      </div>
                    </div>
                    <ArrowUpRight
                      size={18}
                      className="shrink-0 text-ink-subtle transition-[color,transform] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent"
                    />
                  </div>

                  <h2 className="mt-7 text-2xl text-ink sm:text-3xl">{service.name}</h2>
                  <p className="mt-4 max-w-2xl flex-1 text-base leading-relaxed text-ink-muted">
                    {service.intro}
                  </p>

                  <div className="mt-7 grid gap-2 sm:grid-cols-3">
                    {service.deliverables.slice(0, 3).map((item) => (
                      <span
                        key={item.title}
                        className="rounded-xl border border-line bg-surface/50 px-3 py-2.5 text-xs text-ink-muted"
                      >
                        {item.title}
                      </span>
                    ))}
                  </div>
                  <span className="mt-7 inline-flex min-h-11 items-center gap-2 border-t border-line pt-5 text-sm font-medium text-ink transition-colors group-hover:text-accent">
                    Explore {service.name.toLocaleLowerCase()}
                    <ArrowRight size={15} />
                  </span>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </Section>

      <Section bordered>
        <SectionHeading
          align="center"
          eyebrow="The operating standard"
          title={
            <>
              Serious software needs{" "}
              <span className="gradient-text">clear ownership.</span>
            </>
          }
          copy="The format changes with the engagement. These three principles do not."
        />
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {PRINCIPLES.map((item, index) => {
            const Icon = item.icon;
            return (
              <Reveal key={item.title} delay={index * 70} className="h-full">
                <article className="h-full rounded-2xl border border-line bg-surface-raised p-6">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-line bg-surface-overlay">
                    <Icon size={18} className="text-cool" />
                  </span>
                  <h2 className="mt-6 text-lg text-ink">{item.title}</h2>
                  <p className="mt-3 text-sm leading-relaxed text-ink-muted">{item.copy}</p>
                </article>
              </Reveal>
            );
          })}
        </div>
      </Section>

      <Section bordered>
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-accent/25 bg-surface-raised p-8 text-center sm:p-10">
            <div
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-accent/15 blur-3xl"
            />
            <div className="relative mx-auto max-w-2xl">
              <Eyebrow className="justify-center">Not sure where to begin?</Eyebrow>
              <h2 className="mt-6 text-3xl leading-tight text-ink sm:text-4xl">
                Bring the goal. We&rsquo;ll map the route.
              </h2>
              <p className="mt-4 text-base leading-relaxed text-ink-muted">
                One short conversation is enough to identify the right service, scope,
                and next decision.
              </p>
              <StartJourneyButton className="mt-7" size="lg" />
            </div>
          </div>
        </Reveal>
      </Section>

      <CtaFooter />
    </main>
  );
}
