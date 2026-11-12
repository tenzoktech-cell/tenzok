import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { Container, Eyebrow } from "@/components/ui/Section";
import { url } from "@/lib/site";
import LoginForm from "./LoginForm";
import LoginSessionRedirect from "./LoginSessionRedirect";

export const metadata: Metadata = {
  title: "Log in",
  description: "Log in to your Tenzok account.",
  alternates: { canonical: url("/login") },
  robots: { index: false },
};

export default function LoginPage() {
  return (
    <main id="main" tabIndex={-1} className="bg-surface">
      <LoginSessionRedirect />

      <section className="relative isolate overflow-hidden pb-16 pt-28 sm:pt-32 lg:pb-20">
        <div
          aria-hidden
          className="pointer-events-none absolute left-[-12rem] top-24 -z-10 h-[30rem] w-[30rem] rounded-full bg-cool/10 hidden"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-[-12rem] right-[-8rem] -z-10 h-[34rem] w-[34rem] rounded-full bg-accent/10 hidden"
        />

        <Container className="max-w-7xl">
          <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(25rem,0.75fr)] lg:gap-14">
            <div className="max-w-2xl">
              <Eyebrow>Client workspace</Eyebrow>
              <h1 className="mt-5 text-[clamp(2.25rem,1.7rem+2.2vw,3.5rem)] font-normal leading-[1.02] tracking-[-0.03em] text-ink">
                Welcome back.
                <span className="mt-1 block gradient-text">
                  Let&rsquo;s keep building.
                </span>
              </h1>
              <p className="mt-5 max-w-xl text-base leading-7 text-ink-muted">
                Return to your projects, profile, and conversations with the
                Tenzok team from one focused workspace.
              </p>
            </div>

            <div className="relative">
              <div
                aria-hidden
                className="absolute -inset-px rounded-xl bg-gradient-to-br from-cool/50 via-line to-accent/40 hidden"
              />
              <div className="relative overflow-hidden rounded-xl border border-ink/10 bg-surface-raised/90 p-6 sm:p-7">
                <div className="flex items-center justify-between gap-4 border-b border-line pb-5">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-[0.18em] text-cool">
                      Secure access
                    </p>
                    <h2 className="mt-1.5 text-xl font-semibold tracking-tight text-ink">
                      Log in to Tenzok
                    </h2>
                  </div>
                  <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-cool/30 bg-cool/10 text-cool">
                    <ShieldCheck size={21} />
                  </span>
                </div>

                <div className="mt-5">
                  <LoginForm />
                </div>

                <div className="mt-5 border-t border-line pt-5">
                  <Link href="/signup" className="group inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md border border-ink px-5 text-sm font-medium text-ink transition-all hover:border-cool/40 hover:bg-surface hover:text-cool">
                    Create account
                    <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </div>

              </div>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}
