import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  Sparkles,
} from "lucide-react";
import JsonLd from "@/components/JsonLd";
import ProcessBar from "@/components/ProcessBar";
import StartJourneyButton from "@/components/StartJourneyModal";
import TenzokNav from "@/components/TenzokNav";
import CtaFooter from "@/components/sections/CtaFooter";
import Reveal from "@/components/sections/Reveal";
import SectionHeading from "@/components/sections/SectionHeading";
import { SERVICES, getService } from "@/components/services-data";
import { ButtonLink } from "@/components/ui/Button";
import { Container, Eyebrow, Section } from "@/components/ui/Section";
import { breadcrumbSchema, serviceSchema } from "@/lib/seo";
import { socialMetadata, url } from "@/lib/site";

interface ServicePageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return SERVICES.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return {};

  return {
    title: service.name,
    description: service.intro,
    alternates: { canonical: url(`/services/${slug}`) },
    ...socialMetadata({
      title: `${service.name} — Tenzok`,
      description: service.intro,
      path: `/services/${slug}`,
    }),
  };
}

export default async function ServicePage({ params }: ServicePageProps) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  const Icon = service.icon;
  const otherServices = SERVICES.filter((item) => item.slug !== service.slug);

  return (
    <main id="main" tabIndex={-1} className="overflow-hidden bg-surface">
      <JsonLd
        schema={[
          serviceSchema({
            name: service.name,
            description: service.intro,
            slug: service.slug,
            audience: service.audience,
          }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Services", path: "/services" },
            { name: service.name, path: `/services/${service.slug}` },
          ]),
        ]}
      />
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
          <Link
            href="/services"
            className="inline-flex min-h-11 items-center gap-2 text-sm text-ink-subtle transition-colors hover:text-ink"
          >
            <ArrowLeft size={14} />
            All services
          </Link>

          <div className="mt-9 grid items-end gap-12 lg:grid-cols-[minmax(0,1.25fr)_minmax(19rem,0.75fr)] lg:gap-16">
            <Reveal>
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1.5 text-xs font-medium text-accent">
                  <Icon size={14} />
                  {service.name}
                </span>
                <span className="rounded-full border border-line bg-surface-raised px-3 py-1.5 text-xs text-ink-muted">
                  {service.audience}
                </span>
              </div>

              <h1 className="mt-7 max-w-4xl text-[clamp(2.75rem,1.8rem+3.5vw,5.25rem)] leading-[0.98] text-ink">
                {service.headline.plain}{" "}
                <span className="bg-gradient-to-r from-accent to-cool bg-clip-text text-transparent">
                  {service.headline.accent}
                </span>
              </h1>
              <p className="mt-7 max-w-3xl text-lg leading-relaxed text-ink-muted sm:text-xl">
                {service.intro}
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <StartJourneyButton
                  defaultService={service.slug}
                  label="Start your project"
                  size="lg"
                />
                <a
                  href="#process"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-line-strong bg-surface-raised px-7 text-sm font-medium text-ink transition-colors hover:bg-surface-overlay sm:text-base"
                >
                  See how it works
                  <ArrowRight size={16} />
                </a>
              </div>
            </Reveal>

            <Reveal delay={120}>
              <aside className="relative overflow-hidden rounded-3xl border border-line bg-surface-raised p-7 shadow-2xl shadow-black/25">
                <div
                  aria-hidden
                  className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-cool/15 blur-3xl"
                />
                <div className="relative flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-cool/30 bg-cool/10">
                    <Sparkles size={18} className="text-cool" />
                  </span>
                  <div>
                    <p className="text-sm font-medium text-ink">Clear from day one</p>
                    <p className="mt-0.5 text-xs text-ink-subtle">
                      Scope, ownership, progress, handover.
                    </p>
                  </div>
                </div>

                <dl className="relative mt-7 space-y-1">
                  {service.stats.map((stat) => (
                    <div
                      key={stat.label}
                      className="flex items-center justify-between gap-5 border-t border-line py-4 first:border-t-0"
                    >
                      <dt className="text-sm leading-snug text-ink-muted">{stat.label}</dt>
                      <dd className="shrink-0 text-xl font-medium tracking-tight text-ink">
                        {stat.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </aside>
            </Reveal>
          </div>
        </Container>
      </section>

      <Section id="process" bordered>
        <SectionHeading
          align="center"
          eyebrow="The Tenzok way"
          title={
            <>
              Every milestone,{" "}
              <span className="gradient-text">visible.</span>
            </>
          }
          copy={`Every ${service.name} engagement follows the same transparent path. You know what is happening, what is next, and what exists at the end.`}
        />
        <Reveal delay={120} className="mt-12">
          <ProcessBar steps={service.steps} />
        </Reveal>
      </Section>

      <Section bordered>
        <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
          <Reveal>
            <Eyebrow>{service.big.eyebrow}</Eyebrow>
            <h2 className="mt-7 text-3xl leading-tight text-ink sm:text-4xl md:text-5xl">
              {service.big.headline.plain}{" "}
              <span className="gradient-text">
                {service.big.headline.accent}
              </span>
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-ink-muted">
              {service.big.copy}
            </p>
            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {service.big.points.map((point) => (
                <li
                  key={point}
                  className="flex items-start gap-3 rounded-xl border border-line bg-surface-raised p-4 text-sm leading-relaxed text-ink-muted"
                >
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-accent/30 bg-accent/10">
                    <Check size={11} className="text-accent" />
                  </span>
                  {point}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={120}>
            <div className="relative overflow-hidden rounded-3xl border border-accent/25 bg-accent/[0.06] p-8 shadow-2xl shadow-black/20 sm:p-10">
              <div
                aria-hidden
                className="absolute -right-16 -top-20 h-56 w-56 rounded-full bg-cool/15 blur-3xl"
              />
              <p className="relative bg-gradient-to-r from-accent to-cool bg-clip-text text-6xl font-medium tracking-tight text-transparent sm:text-7xl">
                {service.big.stat.value}
              </p>
              <p className="relative mt-6 max-w-sm text-base leading-relaxed text-ink-muted">
                {service.big.stat.label}
              </p>
            </div>
          </Reveal>
        </div>
      </Section>

      <Section bordered>
        <SectionHeading
          align="center"
          eyebrow="What you get"
          title={
            <>
              Tangible outputs.{" "}
              <span className="gradient-text">No black boxes.</span>
            </>
          }
          copy="The work is only complete when you have the assets, context, and confidence to own what comes next."
        />

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {service.deliverables.map((item, index) => {
            const ItemIcon = item.icon;
            return (
              <Reveal key={item.title} delay={(index % 3) * 60} className="h-full">
                <article className="group relative h-full overflow-hidden rounded-2xl border border-line bg-surface-raised p-6 transition-[border-color,background-color,transform] duration-300 hover:-translate-y-1 hover:border-line-strong hover:bg-surface-overlay">
                  <div
                    aria-hidden
                    className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cool to-transparent opacity-0 transition-opacity group-hover:opacity-60"
                  />
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-line bg-surface-overlay transition-colors group-hover:border-cool/30 group-hover:bg-cool/10">
                    <ItemIcon
                      size={19}
                      className="text-ink-muted transition-colors group-hover:text-cool"
                    />
                  </span>
                  <p className="mt-6 text-xs font-medium uppercase tracking-[0.14em] text-ink-subtle">
                    0{index + 1}
                  </p>
                  <h3 className="mt-3 text-lg text-ink">{item.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-ink-muted">{item.desc}</p>
                </article>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={120}>
          <div className="relative mt-12 flex flex-col items-center justify-between gap-6 overflow-hidden rounded-3xl border border-accent/25 bg-surface-raised p-8 text-center sm:flex-row sm:text-left">
            <div
              aria-hidden
              className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-accent/15 blur-3xl"
            />
            <p className="relative max-w-xl text-base text-ink">{service.ctaLine}</p>
            <ButtonLink
              href={`/contact?service=${service.slug}`}
              size="lg"
              className="relative shrink-0"
            >
              Talk to Tenzok
              <ArrowRight size={16} />
            </ButtonLink>
          </div>
        </Reveal>
      </Section>

      <Section bordered>
        <div className="flex flex-col gap-7 md:flex-row md:items-end md:justify-between">
          <div>
            <Eyebrow>Explore more from Tenzok</Eyebrow>
            <h2 className="mt-6 text-3xl leading-tight text-ink sm:text-4xl">
              The rest of the studio
            </h2>
          </div>
          <ButtonLink href="/services" variant="secondary">
            View all services
            <ArrowRight size={15} />
          </ButtonLink>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {otherServices.map((other) => {
            const OtherIcon = other.icon;
            return (
              <Link
                key={other.slug}
                href={`/services/${other.slug}`}
                className="group flex min-h-20 items-center justify-between gap-3 rounded-2xl border border-line bg-surface-raised px-5 transition-[border-color,background-color] hover:border-line-strong hover:bg-surface-overlay"
              >
                <span className="flex items-center gap-3 text-sm font-medium text-ink-muted transition-colors group-hover:text-ink">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-line bg-surface-overlay">
                    <OtherIcon size={16} className="text-ink-subtle" />
                  </span>
                  {other.name}
                </span>
                <ArrowUpRight
                  size={15}
                  className="shrink-0 text-ink-subtle transition-[color,transform] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent"
                />
              </Link>
            );
          })}
        </div>
      </Section>

      <CtaFooter />
    </main>
  );
}
