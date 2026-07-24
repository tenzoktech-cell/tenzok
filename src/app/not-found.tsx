import Link from "next/link";
import { ArrowLeft, Search } from "lucide-react";
import TenzokNav from "@/components/TenzokNav";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Section";

export default function NotFound() {
  return (
    <main id="main" tabIndex={-1} className="min-h-screen bg-surface">
      <TenzokNav />
      <Container className="flex min-h-screen items-center justify-center py-32">
        <div className="premium-card relative w-full max-w-2xl overflow-hidden rounded-[2rem] p-8 text-center sm:p-12">
          <div
            aria-hidden
            className="absolute inset-x-0 top-0 h-40 bg-[radial-gradient(ellipse_at_top,rgba(117,93,255,0.2),transparent_70%)]"
          />
          <Search size={28} className="relative mx-auto text-cool" />
          <p className="relative mt-6 text-xs font-semibold uppercase tracking-[0.18em] text-accent">
            Error 404
          </p>
          <h1 className="text-balance relative mt-4 text-4xl text-ink sm:text-5xl">
            This page is outside the build.
          </h1>
          <p className="relative mx-auto mt-5 max-w-lg text-base leading-7 text-ink-muted">
            The address may have changed, or the page never existed. The main site
            and project catalogue are still one click away.
          </p>
          <div className="relative mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <ButtonLink href="/">
              <ArrowLeft size={15} />
              Back home
            </ButtonLink>
            <ButtonLink href="/projects" variant="secondary">
              Browse projects
            </ButtonLink>
          </div>
          <Link
            href="/contact"
            className="relative mt-7 inline-flex min-h-11 items-center text-sm text-ink-muted underline underline-offset-4 hover:text-ink"
          >
            Tell us about a broken link
          </Link>
        </div>
      </Container>
    </main>
  );
}
