import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowUpRight, Mail, Rss } from "lucide-react";
import { SITE } from "@/lib/site";
import { NAV_ITEMS } from "../nav-links";
import { DOMAINS } from "../projects-data";
import { SERVICES } from "../services-data";
import StartJourneyButton from "../StartJourneyModal";
import TenzokLogo from "../TenzokLogo";
import { ButtonLink } from "../ui/Button";
import { Container } from "../ui/Section";
import Reveal from "./Reveal";

export default function CtaFooter() {
  return (
    <section
      id="contact"
      className="relative scroll-mt-24 overflow-hidden border-t border-line"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 mx-auto h-[34rem] max-w-5xl bg-[radial-gradient(ellipse_at_top,rgba(117,93,255,0.16),transparent_66%)]"
      />

      <Container>
        <div className="relative flex flex-col items-center py-24 text-center md:py-32">
          <Reveal className="flex flex-col items-center">
            <span className="rounded-full border border-accent/25 bg-accent/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-cool">
              Your next build starts here
            </span>
            <h2 className="text-balance mt-7 max-w-4xl text-4xl leading-[1.02] text-ink sm:text-5xl md:text-6xl">
              Turn the idea into{" "}
              <span className="gradient-text">software people trust.</span>
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-7 text-ink-muted sm:text-lg">
              Bring us a product brief, a business problem, or a final-year project.
              We&rsquo;ll turn it into a clear scope, a working build, and a handover
              you fully own.
            </p>
          </Reveal>

          <Reveal delay={120}>
            <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row">
              <StartJourneyButton label="Start Your Project" size="lg" />
              <ButtonLink href="/contact" variant="secondary" size="lg">
                Send your brief
              </ButtonLink>
            </div>
            <p className="mt-6 text-sm text-ink-subtle">
              Prefer email?{" "}
              <a
                href={`mailto:${SITE.email}`}
                className="inline-flex items-center gap-1.5 text-ink-muted underline underline-offset-4 transition-colors hover:text-ink"
              >
                <Mail size={14} />
                {SITE.email}
              </a>
            </p>
          </Reveal>
        </div>
      </Container>

      <footer className="relative border-t border-line bg-black/10">
        <Container>
          <div className="grid gap-12 py-14 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
            <div>
              <div className="flex items-center gap-2.5">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-line bg-white/[0.05]">
                  <TenzokLogo size={20} />
                </span>
                <span className="font-display text-xl font-bold tracking-[-0.04em] text-ink">
                  Tenzok
                </span>
              </div>
              <p className="mt-5 max-w-sm text-sm leading-6 text-ink-muted">
                A product engineering studio for ambitious companies, founders, and
                students who want real, production-minded work.
              </p>
              <a
                href={`mailto:${SITE.email}`}
                className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-ink transition-colors hover:text-cool"
              >
                <Mail size={15} className="text-accent" />
                {SITE.email}
              </a>
              <div className="mt-6 flex items-center gap-2" aria-label="Social links">
                <a href="https://www.instagram.com/tenzok.in" target="_blank" rel="noreferrer" aria-label="Tenzok on Instagram" className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-ink-muted transition-colors hover:border-cool/50 hover:text-cool">
                  <span aria-hidden className="text-xs font-semibold">IG</span>
                </a>
                <a href="https://x.com/tenzokin" target="_blank" rel="noreferrer" aria-label="Tenzok on X" className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-ink-muted transition-colors hover:border-cool/50 hover:text-cool">
                  <span aria-hidden className="text-xs font-semibold">X</span>
                </a>
              </div>
            </div>

            <FooterColumn title="Company">
              {NAV_ITEMS.filter((item) =>
                ["/", "/blogs", "/about", "/contact"].includes(
                  item.href,
                ),
              ).map((item) => (
                <FooterLink key={item.id} href={item.href}>
                  {item.label}
                </FooterLink>
              ))}
              <FooterLink href="/faq">FAQ</FooterLink>
            </FooterColumn>

            <FooterColumn title="Services">
              {SERVICES.map((service) => (
                <FooterLink key={service.slug} href={`/services/${service.slug}`}>
                  {service.name}
                </FooterLink>
              ))}
            </FooterColumn>

            <FooterColumn title="Project domains">
              {DOMAINS.slice(0, 4).map((domain) => (
                <FooterLink key={domain.slug} href={`/projects/${domain.slug}`}>
                  {domain.shortName ?? domain.name}
                </FooterLink>
              ))}
              <FooterLink href="/projects">Explore all 18 domains</FooterLink>
              <a
                href="/blogs/rss.xml"
                className="inline-flex min-h-10 items-center gap-2 text-sm text-ink-muted transition-colors hover:text-ink"
              >
                <Rss size={14} />
                RSS feed
              </a>
            </FooterColumn>
          </div>

          <div className="flex flex-col justify-between gap-3 border-t border-line py-6 text-xs text-ink-subtle sm:flex-row">
            <p>© 2026 Tenzok. All rights reserved.</p>
            <p>{SITE.tagline}</p>
          </div>
        </Container>
      </footer>
    </section>
  );
}

function FooterColumn({ title, children }: { title: string; children: ReactNode }) {
  return (
    <nav aria-label={title}>
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink">
        {title}
      </p>
      <div className="mt-4 flex flex-col">{children}</div>
    </nav>
  );
}

function FooterLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="group inline-flex min-h-10 items-center gap-1.5 text-sm text-ink-muted transition-colors hover:text-ink"
    >
      {children}
      <ArrowUpRight
        size={12}
        className="opacity-0 transition-opacity group-hover:opacity-100"
      />
    </Link>
  );
}
