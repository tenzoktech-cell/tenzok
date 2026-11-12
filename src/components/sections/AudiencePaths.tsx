import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "../ui/Section";

/** Two clear doors straight after the hero: one for companies, one for students. */
const PATHS = [
  {
    label: "For businesses",
    title: "Websites, web apps, mobile and AI systems built to launch.",
    cta: "See services",
    href: "/services",
    dark: true,
  },
  {
    label: "For students",
    title: "Mini and final-year projects you can explain and defend.",
    cta: "Browse project briefs",
    href: "/projects",
    dark: false,
  },
] as const;

export default function AudiencePaths() {
  return (
    <section aria-label="Choose your path" className="pb-12 sm:pb-16">
      <Container>
        <div className="grid gap-4 md:grid-cols-2">
          {PATHS.map((path) => (
            <Link
              key={path.href}
              href={path.href}
              className={`group flex min-h-44 flex-col justify-between rounded-xl border p-6 transition-colors sm:p-7 ${
                path.dark
                  ? "theme-ink border-transparent bg-surface text-ink hover:bg-surface-raised"
                  : "border-ink bg-surface-raised text-ink hover:bg-[#fffdf8]"
              }`}
            >
              <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent">
                {path.label}
              </span>
              <span className="mt-6 block max-w-md font-display text-xl leading-[1.2] sm:text-2xl">
                {path.title}
              </span>
              <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium">
                {path.cta}
                <ArrowUpRight
                  size={16}
                  className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </span>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
