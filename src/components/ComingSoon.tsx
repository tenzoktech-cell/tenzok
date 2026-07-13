import Link from "next/link";
import { ArrowRight, Bell, type LucideIcon } from "lucide-react";
import TenzokNav from "./TenzokNav";

interface ComingSoonProps {
  icon: LucideIcon;
  name: string;
  headline: { plain: string; accent: string };
  copy: string;
  notifySubject: string;
}

/** Full-screen animated "coming soon" holding page. */
export default function ComingSoon({
  icon: Icon,
  name,
  headline,
  copy,
  notifySubject,
}: ComingSoonProps) {
  return (
    <main className="relative flex min-h-dvh flex-col overflow-hidden bg-black tracking-[-0.02em]">
      <TenzokNav />

      <div className="pointer-events-none absolute -top-32 left-1/2 h-[420px] w-[760px] -translate-x-1/2 rounded-full bg-[#e8702a]/[0.08] blur-[130px]" />
      <div className="pointer-events-none absolute -bottom-40 left-1/4 h-[360px] w-[600px] rounded-full bg-[#e8702a]/[0.05] blur-[130px]" />

      <section className="relative flex flex-1 flex-col items-center justify-center px-5 py-32 text-center">
        {/* Floating orb with expanding rings */}
        <div className="cs-float relative flex h-24 w-24 items-center justify-center">
          <span aria-hidden className="cs-ring absolute inset-0 rounded-full border border-[#e8702a]/40" />
          <span
            aria-hidden
            className="cs-ring absolute inset-0 rounded-full border border-[#e8702a]/25"
            style={{ animationDelay: "0.9s" }}
          />
          <span
            aria-hidden
            className="cs-ring absolute inset-0 rounded-full border border-[#e8702a]/15"
            style={{ animationDelay: "1.8s" }}
          />
          <span className="flex h-24 w-24 items-center justify-center rounded-full border border-[#e8702a]/30 bg-gradient-to-br from-[#e8702a]/20 to-transparent shadow-2xl shadow-[#e8702a]/20">
            <Icon size={34} className="text-[#e8702a]" />
          </span>
        </div>

        <p className="mt-12 inline-flex items-center gap-2.5 rounded-full border border-[#e8702a]/30 bg-[#e8702a]/10 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.25em] text-[#e8702a]">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#e8702a] opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[#e8702a]" />
          </span>
          {name} · Coming soon
        </p>

        <h1
          className="mt-6 max-w-3xl text-4xl leading-[1.05] text-white sm:text-6xl"
          style={{ letterSpacing: "-0.05em" }}
        >
          {headline.plain}{" "}
          <span className="font-playfair italic text-[#e8702a]">{headline.accent}</span>
          <span aria-hidden className="ml-3 inline-flex items-baseline gap-1.5">
            <span className="cs-dot inline-block h-1.5 w-1.5 rounded-full bg-[#e8702a]" />
            <span
              className="cs-dot inline-block h-1.5 w-1.5 rounded-full bg-[#e8702a]"
              style={{ animationDelay: "0.2s" }}
            />
            <span
              className="cs-dot inline-block h-1.5 w-1.5 rounded-full bg-[#e8702a]"
              style={{ animationDelay: "0.4s" }}
            />
          </span>
        </h1>

        <p className="mt-6 max-w-xl text-sm leading-relaxed text-white/55 sm:text-base">
          {copy}
        </p>

        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
          <a
            href={`mailto:hello@tenzok.com?subject=${encodeURIComponent(notifySubject)}`}
            className="inline-flex items-center gap-2 rounded-full bg-[#e8702a] px-7 py-3 text-sm font-medium text-white transition-all hover:scale-[1.03] hover:bg-[#d2611f] hover:shadow-lg hover:shadow-[#e8702a]/30 active:scale-95"
          >
            <Bell size={15} />
            Notify me at launch
          </a>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-7 py-3 text-sm text-white/80 transition-all hover:bg-white/10 hover:text-white"
          >
            Back to home
            <ArrowRight size={14} />
          </Link>
        </div>
      </section>
    </main>
  );
}
