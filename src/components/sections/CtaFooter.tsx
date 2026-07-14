import Link from "next/link";
import { Mail } from "lucide-react";
import { SITE } from "@/lib/site";
import { FOOTER_COMING_SOON, NAV_ITEMS } from "../nav-links";
import StartJourneyButton from "../StartJourneyModal";
import TenzokLogo from "../TenzokLogo";
import { ButtonLink } from "../ui/Button";
import { Container } from "../ui/Section";
import Reveal from "./Reveal";

export default function CtaFooter() {
  return (
    <section id="contact" className="scroll-mt-24 border-t border-line">
      <Container>
        <div className="flex flex-col items-center py-24 text-center md:py-32">
          <Reveal className="flex flex-col items-center">
            <h2 className="max-w-2xl text-3xl leading-[1.15] text-ink sm:text-4xl md:text-5xl">
              We own it. We teach it.{" "}
              <span className="font-display italic text-accent">We ship it.</span>
            </h2>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-ink-muted">
              Tell us about your project, your startup, or your semester — we&rsquo;ll
              map the path from brief to launched, portfolio-ready outcome.
            </p>
          </Reveal>

          <Reveal delay={120}>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
              <StartJourneyButton size="lg" />
              <ButtonLink href="/contact" variant="secondary" size="lg">
                Talk to us
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

      <footer className="border-t border-line">
        <Container>
          <div className="flex flex-col items-center justify-between gap-6 py-10 md:flex-row">
            <div className="flex items-center gap-2.5">
              <TenzokLogo size={20} />
              <span className="font-display text-xl italic text-ink">Tenzok</span>
            </div>

            <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1">
              {[...NAV_ITEMS, { id: "contact", label: "Contact", href: "/contact" }].map(
                (item) => (
                  <Link
                    key={item.id}
                    href={item.href}
                    className="flex min-h-11 items-center text-sm text-ink-muted transition-colors hover:text-ink"
                  >
                    {item.label}
                  </Link>
                ),
              )}
              {FOOTER_COMING_SOON.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  className="flex min-h-11 items-center gap-2 text-sm text-ink-subtle transition-colors hover:text-ink-muted"
                >
                  {item.label}
                  <span className="rounded-md border border-line px-1.5 py-0.5 text-[10px] uppercase tracking-wide">
                    Soon
                  </span>
                </Link>
              ))}
            </nav>

            <p className="text-sm text-ink-subtle">
              © 2026 Tenzok · {SITE.tagline}
            </p>
          </div>
        </Container>
      </footer>
    </section>
  );
}
