import { ArrowRight, type LucideIcon } from "lucide-react";
import TenzokNav from "./TenzokNav";
import { ButtonLink } from "./ui/Button";
import { Container, Eyebrow } from "./ui/Section";

interface ComingSoonProps {
  icon: LucideIcon;
  name: string;
  headline: { plain: string; accent: string };
  copy: string;
}

/** Holding page for a route that has no content yet. */
export default function ComingSoon({
  icon: Icon,
  name,
  headline,
  copy,
}: ComingSoonProps) {
  return (
    <main
      id="main"
      tabIndex={-1}
      className="flex min-h-dvh flex-col bg-surface"
    >
      <TenzokNav />

      <section className="flex flex-1 items-center py-32">
        <Container>
          <div className="mx-auto flex max-w-xl flex-col items-center text-center">
            <div className="relative flex h-20 w-20 items-center justify-center">
              <span
                aria-hidden
                className="cs-ring absolute inset-0 rounded-full border border-accent/40"
              />
              <span
                aria-hidden
                className="cs-ring absolute inset-0 rounded-full border border-accent/20"
                style={{ animationDelay: "1.2s" }}
              />
              <span className="flex h-20 w-20 items-center justify-center rounded-full border border-line bg-surface-raised">
                <Icon size={30} className="text-accent" />
              </span>
            </div>

            <div className="mt-10">
              <Eyebrow>{name} · Coming soon</Eyebrow>
            </div>

            <h1 className="mt-6 text-[clamp(1.75rem,1.25rem+2vw,3rem)] leading-[1.1] text-ink">
              {headline.plain}{" "}
              <span className="font-display italic text-accent">{headline.accent}</span>
            </h1>

            <p className="mt-6 text-base leading-relaxed text-ink-muted">{copy}</p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/projects" size="lg">
                Browse our projects
                <ArrowRight size={16} />
              </ButtonLink>
              <ButtonLink href="/" variant="secondary" size="lg">
                Back to home
              </ButtonLink>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}
