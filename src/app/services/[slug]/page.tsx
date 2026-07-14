import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ArrowUpRight, Check } from "lucide-react";
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
import { url } from "@/lib/site";

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
    openGraph: {
      title: `${service.name} — Tenzok`,
      description: service.intro,
      url: url(`/services/${slug}`),
    },
  };
}

export default async function ServicePage({ params }: ServicePageProps) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  const Icon = service.icon;
  const otherServices = SERVICES.filter((s) => s.slug !== service.slug);

  return (
    <main id="main" tabIndex={-1} className="bg-surface">
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

      {/* ------------------------------ Hero ------------------------------ */}
      <section className="pt-36 pb-8 sm:pt-44">
        <Container>
          <Reveal>
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-md border border-line bg-surface-raised px-3 py-1.5 text-xs font-medium text-ink-muted">
                <Icon size={14} className="text-accent" />
                {service.name}
              </span>
              <span className="rounded-md border border-line px-3 py-1.5 text-xs text-ink-subtle">
                {service.audience}
              </span>
            </div>

            <h1 className="mt-8 max-w-3xl text-[clamp(2rem,1.5rem+2.4vw,3.5rem)] leading-[1.08] text-ink">
              {service.headline.plain}{" "}
              <span className="font-display italic text-accent">
                {service.headline.accent}
              </span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-muted">
              {service.intro}
            </p>
          </Reveal>

          <Reveal delay={100}>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <StartJourneyButton defaultService={service.slug} size="lg" />
              <a
                href="#process"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-line-strong bg-surface-raised px-7 text-sm font-medium text-ink transition-colors hover:bg-surface-overlay sm:text-base"
              >
                See how we work
                <ArrowRight size={15} />
              </a>
            </div>
          </Reveal>

          <Reveal delay={180}>
            <dl className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-3">
              {service.stats.map((stat) => (
                <div key={stat.label} className="flex flex-col gap-2 bg-surface-raised p-6">
                  <dd className="text-3xl font-medium tracking-tight text-ink sm:text-4xl">
                    {stat.value}
                  </dd>
                  <dt className="text-sm text-ink-muted">{stat.label}</dt>
                </div>
              ))}
            </dl>
          </Reveal>
        </Container>
      </section>

      {/* --------------------- Client journey / process ------------------- */}
      <Section id="process">
        <SectionHeading
          align="center"
          eyebrow="The Tenzok Way"
          title={
            <>
              Every step,{" "}
              <span className="font-display italic text-accent">in the open.</span>
            </>
          }
          copy={`Every ${service.name} engagement follows the same transparent path. Here is exactly what happens after you say hello — no surprises, no black boxes.`}
        />
        <Reveal delay={120} className="mt-16">
          <ProcessBar steps={service.steps} />
        </Reveal>
      </Section>

      {/* ---------------------------- Big pitch --------------------------- */}
      <Section bordered>
        <div className="grid items-center gap-12 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
          <Reveal>
            <Eyebrow>{service.big.eyebrow}</Eyebrow>
            <h2 className="mt-6 text-3xl leading-[1.15] text-ink sm:text-4xl md:text-5xl">
              {service.big.headline.plain}{" "}
              <span className="font-display italic text-accent">
                {service.big.headline.accent}
              </span>
            </h2>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-ink-muted">
              {service.big.copy}
            </p>
            <ul className="mt-8 flex flex-col gap-3">
              {service.big.points.map((point) => (
                <li
                  key={point}
                  className="flex items-start gap-3 text-sm leading-relaxed text-ink-muted"
                >
                  <Check size={15} className="mt-1 shrink-0 text-accent" />
                  {point}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={120}>
            <div className="rounded-2xl border border-line bg-surface-raised p-10">
              <p className="font-display text-6xl italic text-accent sm:text-7xl">
                {service.big.stat.value}
              </p>
              <p className="mt-6 max-w-xs text-base leading-relaxed text-ink-muted">
                {service.big.stat.label}
              </p>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* --------------------------- Deliverables ------------------------- */}
      <Section bordered>
        <SectionHeading
          align="center"
          eyebrow="What you get"
          title={
            <>
              Deliverables,{" "}
              <span className="font-display italic text-accent">not promises.</span>
            </>
          }
        />

        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {service.deliverables.map((item, i) => {
            const ItemIcon = item.icon;
            return (
              <Reveal key={item.title} delay={(i % 3) * 60} className="h-full">
                <article className="h-full rounded-2xl border border-line bg-surface-raised p-6">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-line bg-surface-overlay">
                    <ItemIcon size={19} className="text-ink-muted" />
                  </span>
                  <h3 className="mt-6 text-base text-ink">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-muted">{item.desc}</p>
                </article>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={120}>
          <div className="mt-16 flex flex-col items-center justify-between gap-6 rounded-2xl border border-accent/30 bg-accent/[0.06] p-8 text-center sm:flex-row sm:text-left">
            <p className="max-w-xl text-base text-ink">{service.ctaLine}</p>
            <ButtonLink
              href={`/contact?service=${service.slug}`}
              size="lg"
              className="shrink-0"
            >
              Talk to Tenzok
            </ButtonLink>
          </div>
        </Reveal>
      </Section>

      {/* -------------------------- Other services ------------------------ */}
      <Section bordered>
        <Eyebrow>Explore more from Tenzok</Eyebrow>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {otherServices.map((other) => {
            const OtherIcon = other.icon;
            return (
              <Link
                key={other.slug}
                href={`/services/${other.slug}`}
                className="group flex min-h-14 items-center justify-between gap-3 rounded-2xl border border-line bg-surface-raised px-5 transition-colors hover:border-line-strong hover:bg-surface-overlay"
              >
                <span className="flex items-center gap-3 text-sm font-medium text-ink-muted group-hover:text-ink">
                  <OtherIcon size={16} className="shrink-0 text-ink-subtle" />
                  {other.name}
                </span>
                <ArrowUpRight
                  size={15}
                  className="shrink-0 text-ink-subtle transition-colors group-hover:text-accent"
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
