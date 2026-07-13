import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import StartJourneyButton from "@/components/StartJourneyModal";
import TenzokNav from "@/components/TenzokNav";
import CtaFooter from "@/components/sections/CtaFooter";
import Reveal from "@/components/sections/Reveal";
import { SERVICES } from "@/components/services-data";

export const metadata: Metadata = {
  title: "Our Services — Tenzok",
  description:
    "Mentorship, student projects, company services, digital marketing, and launch support — every Tenzok engagement, end to end.",
};

export default function ServicesIndexPage() {
  return (
    <main className="bg-black tracking-[-0.02em]">
      <TenzokNav />

      <section className="relative overflow-hidden pb-20 pt-36 sm:pb-24 sm:pt-44">
        <div className="pointer-events-none absolute -top-32 left-1/2 h-[420px] w-[760px] -translate-x-1/2 rounded-full bg-[#e8702a]/[0.08] blur-[130px]" />

        <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
          <Reveal>
            <p className="flex items-center gap-2.5 text-xs font-medium uppercase tracking-[0.25em] text-[#e8702a]">
              <span className="h-px w-6 bg-[#e8702a]/60" aria-hidden />
              Our Services
            </p>
            <h1
              className="mt-6 max-w-3xl text-5xl leading-[1.02] text-white sm:text-6xl md:text-7xl"
              style={{ letterSpacing: "-0.05em" }}
            >
              One team,{" "}
              <span className="font-playfair italic text-[#e8702a]">
                brief to launch.
              </span>
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/60 sm:text-lg">
              Five ways to work with Tenzok — each one runs on the same
              transparent process: scoped in writing, built in the open, and
              handed over with nothing hidden.
            </p>
          </Reveal>

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((service, i) => {
              const Icon = service.icon;
              return (
                <Reveal key={service.slug} delay={i * 70} className="h-full">
                  <Link
                    href={`/services/${service.slug}`}
                    className="group flex h-full flex-col rounded-3xl border border-white/10 bg-white/[0.04] p-7 transition-all duration-300 hover:-translate-y-1.5 hover:border-[#e8702a]/40 hover:shadow-2xl hover:shadow-[#e8702a]/10"
                  >
                    <div className="flex items-start justify-between">
                      <span className="inline-flex rounded-2xl border border-[#e8702a]/25 bg-[#e8702a]/10 p-3 transition-transform duration-300 group-hover:-rotate-3 group-hover:scale-110">
                        <Icon size={20} className="text-[#e8702a]" />
                      </span>
                      <ArrowUpRight
                        size={16}
                        className="text-white/40 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#e8702a]"
                      />
                    </div>
                    <h2 className="mt-5 text-lg font-medium text-white">{service.name}</h2>
                    <p className="mt-1 text-xs text-white/45">{service.audience}</p>
                    <p className="mt-3 text-sm leading-relaxed text-white/55">
                      {service.intro}
                    </p>
                  </Link>
                </Reveal>
              );
            })}

            <Reveal delay={SERVICES.length * 70} className="h-full">
              <div className="flex h-full flex-col items-start justify-center rounded-3xl border border-[#e8702a]/25 bg-[#e8702a]/[0.07] p-7">
                <h2 className="text-lg font-medium text-white">Not sure which fits?</h2>
                <p className="mt-2 text-sm leading-relaxed text-white/60">
                  Tell us where you are — we&rsquo;ll point you to the right
                  starting line in one call.
                </p>
                <StartJourneyButton className="mt-5 rounded-full bg-[#e8702a] px-6 py-2.5 text-sm font-medium text-white transition-all hover:scale-[1.03] hover:bg-[#d2611f] hover:shadow-lg hover:shadow-[#e8702a]/30 active:scale-95" />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <CtaFooter />
    </main>
  );
}
