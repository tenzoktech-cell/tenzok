import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ArrowUpRight, Check } from "lucide-react";
import ProcessBar from "@/components/ProcessBar";
import StartJourneyButton from "@/components/StartJourneyModal";
import TenzokNav from "@/components/TenzokNav";
import CtaFooter from "@/components/sections/CtaFooter";
import Reveal from "@/components/sections/Reveal";
import SectionHeading from "@/components/sections/SectionHeading";
import { SERVICES, getService } from "@/components/services-data";

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
    title: `${service.name} — Tenzok`,
    description: service.intro,
  };
}

export default async function ServicePage({ params }: ServicePageProps) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  const Icon = service.icon;
  const otherServices = SERVICES.filter((s) => s.slug !== service.slug);

  return (
    <main className="bg-black tracking-[-0.02em]">
      <TenzokNav />

      {/* ------------------------------ Hero ------------------------------ */}
      <section className="relative overflow-hidden border-b border-white/5 pb-20 pt-36 sm:pb-24 sm:pt-44">
        <div className="pointer-events-none absolute -top-32 left-1/2 h-[420px] w-[760px] -translate-x-1/2 rounded-full bg-[#e8702a]/[0.08] blur-[130px]" />

        <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
          <Reveal>
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#e8702a]/30 bg-[#e8702a]/10 px-4 py-1.5 text-xs font-medium text-[#e8702a]">
                <Icon size={14} />
                {service.name}
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs text-white/60">
                {service.audience}
              </span>
            </div>
            <h1
              className="mt-7 max-w-3xl text-5xl leading-[1.02] text-white sm:text-6xl md:text-7xl"
              style={{ letterSpacing: "-0.05em" }}
            >
              {service.headline.plain}{" "}
              <span className="font-playfair italic text-[#e8702a]">
                {service.headline.accent}
              </span>
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/60 sm:text-lg">
              {service.intro}
            </p>
          </Reveal>

          <Reveal delay={120}>
            <div className="mt-9 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
              <StartJourneyButton
                defaultService={service.slug}
                className="rounded-full bg-[#e8702a] px-8 py-3.5 text-sm font-medium text-white transition-all hover:scale-[1.03] hover:bg-[#d2611f] hover:shadow-lg hover:shadow-[#e8702a]/30 active:scale-95"
              />
              <a
                href="#process"
                className="flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-7 py-3 text-sm text-white/80 transition-all hover:bg-white/10 hover:text-white"
              >
                See how we work
                <ArrowRight size={14} />
              </a>
            </div>
          </Reveal>

          <Reveal delay={200}>
            <dl className="mt-14 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-3">
              {service.stats.map((stat) => (
                <div key={stat.label} className="flex flex-col gap-1.5 bg-[#0a0a0a] p-6 sm:p-7">
                  <dd className="order-1 text-3xl font-semibold text-white sm:text-4xl">
                    {stat.value}
                  </dd>
                  <dt className="order-2 text-sm text-white/50">{stat.label}</dt>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </section>

      {/* --------------------- Client journey / process ------------------- */}
      <section id="process" className="scroll-mt-20 bg-black py-24 sm:py-32">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <SectionHeading
            align="center"
            eyebrow="The Tenzok Way"
            title={
              <>
                Every step,{" "}
                <span className="font-playfair italic text-[#e8702a]">in the open.</span>
              </>
            }
            copy={`Every ${service.name} engagement follows the same transparent path. Here is exactly what happens after you say hello — no surprises, no black boxes.`}
          />
          <Reveal delay={150} className="mt-16">
            <ProcessBar steps={service.steps} />
          </Reveal>
        </div>
      </section>

      {/* ---------------------------- Big pitch --------------------------- */}
      <section className="relative overflow-hidden border-t border-white/5 bg-[#050505] py-24 sm:py-32">
        <div className="pointer-events-none absolute -bottom-40 left-1/4 h-[420px] w-[720px] rounded-full bg-[#e8702a]/[0.06] blur-[130px]" />

        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
          <Reveal>
            <p className="flex items-center gap-2.5 text-xs font-medium uppercase tracking-[0.25em] text-[#e8702a]">
              <span className="h-px w-6 bg-[#e8702a]/60" aria-hidden />
              {service.big.eyebrow}
            </p>
            <h2
              className="mt-4 text-4xl leading-[1.05] text-white sm:text-5xl"
              style={{ letterSpacing: "-0.04em" }}
            >
              {service.big.headline.plain}{" "}
              <span className="font-playfair italic text-[#e8702a]">
                {service.big.headline.accent}
              </span>
            </h2>
            <p className="mt-6 max-w-xl text-sm leading-relaxed text-white/60 sm:text-base">
              {service.big.copy}
            </p>
            <ul className="mt-8 flex flex-col gap-3">
              {service.big.points.map((point) => (
                <li
                  key={point}
                  className="flex items-start gap-2.5 text-sm leading-relaxed text-white/70"
                >
                  <Check size={15} className="mt-0.5 shrink-0 text-[#e8702a]" />
                  {point}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={150}>
            <div className="relative overflow-hidden rounded-3xl border border-[#e8702a]/25 bg-gradient-to-br from-[#e8702a]/15 via-[#0a0a0a] to-black p-10 sm:p-12">
              <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[#e8702a]/20 blur-[90px]" />
              <p className="relative font-playfair text-7xl italic text-[#e8702a] sm:text-8xl">
                {service.big.stat.value}
              </p>
              <p className="relative mt-5 max-w-xs text-base leading-relaxed text-white/70">
                {service.big.stat.label}
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* --------------------------- Deliverables ------------------------- */}
      <section className="border-t border-white/5 bg-black py-24 sm:py-32">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <SectionHeading
            align="center"
            eyebrow="What you get"
            title={
              <>
                Deliverables, <span className="font-playfair italic text-[#e8702a]">not promises.</span>
              </>
            }
          />

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {service.deliverables.map((item, i) => {
              const ItemIcon = item.icon;
              return (
                <Reveal key={item.title} delay={i * 60} className="h-full">
                  <article className="group h-full rounded-3xl border border-white/10 bg-white/[0.04] p-7 transition-all duration-300 hover:-translate-y-1.5 hover:border-white/20 hover:shadow-2xl hover:shadow-[#e8702a]/10">
                    <div className="inline-flex rounded-2xl border border-[#e8702a]/25 bg-[#e8702a]/10 p-3 transition-transform duration-300 group-hover:-rotate-3 group-hover:scale-110">
                      <ItemIcon size={20} className="text-[#e8702a]" />
                    </div>
                    <h3 className="mt-4 text-lg font-medium text-white">{item.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-white/55">{item.desc}</p>
                  </article>
                </Reveal>
              );
            })}
          </div>

          <Reveal delay={150}>
            <div className="mt-14 flex flex-col items-center justify-between gap-5 rounded-3xl border border-[#e8702a]/25 bg-[#e8702a]/[0.07] px-8 py-8 text-center sm:flex-row sm:text-left">
              <p className="max-w-xl text-base text-white/80">{service.ctaLine}</p>
              <a
                href="mailto:hello@tenzok.com"
                className="shrink-0 rounded-full bg-[#e8702a] px-7 py-3 text-sm font-medium text-white transition-all hover:scale-[1.03] hover:bg-[#d2611f] hover:shadow-lg hover:shadow-[#e8702a]/30 active:scale-95"
              >
                Talk to Tenzok
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* -------------------------- Other services ------------------------ */}
      <section className="border-t border-white/5 bg-black py-16">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <Reveal>
            <p className="text-xs font-medium uppercase tracking-[0.25em] text-[#e8702a]">
              Explore more from Tenzok
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {otherServices.map((other) => {
                const OtherIcon = other.icon;
                return (
                  <Link
                    key={other.slug}
                    href={`/services/${other.slug}`}
                    className="group flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 transition-all hover:-translate-y-1 hover:border-[#e8702a]/40 hover:bg-white/[0.06]"
                  >
                    <span className="flex items-center gap-3 text-sm font-medium text-white/80 group-hover:text-white">
                      <OtherIcon size={16} className="shrink-0 text-[#e8702a]" />
                      {other.name}
                    </span>
                    <ArrowUpRight
                      size={15}
                      className="shrink-0 text-white/40 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#e8702a]"
                    />
                  </Link>
                );
              })}
            </div>
          </Reveal>
        </div>
      </section>

      <CtaFooter />
    </main>
  );
}
