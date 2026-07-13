import { ArrowRight } from "lucide-react";
import { NAV_ITEMS } from "../nav-links";
import StartJourneyButton from "../StartJourneyModal";
import TenzokLogo from "../TenzokLogo";
import Reveal from "./Reveal";

export default function CtaFooter() {
  return (
    <section
      id="contact"
      className="relative scroll-mt-20 overflow-hidden border-t border-white/5 bg-black"
    >
      <div className="pointer-events-none absolute left-1/2 top-1/4 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-[#e8702a]/10 blur-[130px]" />

      <div className="relative mx-auto flex max-w-4xl flex-col items-center px-5 py-24 text-center sm:py-32">
        <Reveal className="flex flex-col items-center">
          <p className="flex items-center gap-2.5 text-xs font-medium uppercase tracking-[0.25em] text-[#e8702a]">
            <span className="h-px w-6 bg-[#e8702a]/60" aria-hidden />
            Start today
            <span className="h-px w-6 bg-[#e8702a]/60" aria-hidden />
          </p>
          <h2
            className="mt-5 text-5xl leading-[1.02] text-white sm:text-6xl md:text-7xl"
            style={{ letterSpacing: "-0.05em" }}
          >
            We own it. We teach it.
            <span className="block font-playfair italic text-[#e8702a]">We ship it.</span>
          </h2>
          <p className="mt-6 max-w-xl text-sm leading-relaxed text-white/55 sm:text-base">
            Tell us about your project, your startup, or your semester — we’ll map the
            path from brief to launched, portfolio-ready outcome.
          </p>
        </Reveal>

        <Reveal delay={150}>
          <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
            <StartJourneyButton className="rounded-full bg-[#e8702a] px-8 py-3.5 text-sm font-medium text-white transition-all hover:scale-[1.03] hover:bg-[#d2611f] hover:shadow-lg hover:shadow-[#e8702a]/30 active:scale-95" />
            <a
              href="mailto:hello@tenzok.com"
              className="flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-7 py-3 text-sm text-white/80 transition-all hover:bg-white/10 hover:text-white"
            >
              Book a Call
              <ArrowRight size={14} />
            </a>
          </div>
        </Reveal>
      </div>

      <footer className="relative border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-5 py-10 sm:px-8 md:flex-row">
          <div className="flex items-center gap-2.5">
            <TenzokLogo size={20} />
            <span className="font-playfair text-xl italic text-white">Tenzok</span>
          </div>

          <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.id}
                href={item.href}
                className="text-xs text-white/50 transition-colors hover:text-white"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <p className="text-xs text-white/40">© 2026 Tenzok · Obsession · Purpose · Excellence</p>
        </div>
      </footer>
    </section>
  );
}
