import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { Container, Eyebrow } from "@/components/ui/Section";
import { url } from "@/lib/site";
import SignupForm from "./SignupForm";
import LoginSessionRedirect from "../login/LoginSessionRedirect";

export const metadata: Metadata = {
  title: "Sign up",
  description: "Create your Tenzok account.",
  alternates: { canonical: url("/signup") },
  robots: { index: false },
};

export default function SignupPage() {
  return (
    <main id="main" tabIndex={-1} className="bg-surface">
      <LoginSessionRedirect />

      <section className="relative isolate overflow-hidden pb-16 pt-28 sm:pt-32 lg:pb-20">
        <div
          aria-hidden
          className="pointer-events-none absolute left-[-10rem] top-16 -z-10 h-[32rem] w-[32rem] rounded-full bg-accent/10 hidden"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-[-10rem] right-[-10rem] -z-10 h-[36rem] w-[36rem] rounded-full bg-cool/10 hidden"
        />

        <Container className="max-w-7xl">
          <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(28rem,0.9fr)] lg:gap-14">
            <div className="max-w-xl lg:sticky lg:top-28">
              <Eyebrow>Join the workspace</Eyebrow>
              <h1 className="mt-5 text-[clamp(2.25rem,1.7rem+2.2vw,3.5rem)] font-normal leading-[1.02] tracking-[-0.03em] text-ink">
                Ideas move faster
                <span className="mt-1 block gradient-text">
                  with the right team.
                </span>
              </h1>
              <p className="mt-5 text-base leading-7 text-ink-muted">
                Create your Tenzok account to organise your work, share context,
                and stay close to the people helping you ship.
              </p>
            </div>

            <div className="relative">
              <div
                aria-hidden
                className="absolute -inset-px rounded-xl bg-gradient-to-br from-cool/45 via-line to-accent/45 hidden"
              />
              <div className="relative overflow-hidden rounded-xl border border-ink/10 bg-surface-raised/90 p-6 sm:p-7">
                <div className="flex items-center justify-between gap-4 border-b border-line pb-5">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-[0.18em] text-cool">
                      Get started
                    </p>
                    <h2 className="mt-1.5 text-xl font-semibold tracking-tight text-ink">
                      Create your account
                    </h2>
                  </div>
                  <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-accent/30 bg-accent/10 text-accent">
                    <Sparkles size={20} />
                  </span>
                </div>

                <div className="mt-5">
                  <SignupForm />
                </div>

                <p className="mt-5 border-t border-line pt-5 text-sm text-ink-muted">
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    className="inline-flex items-center gap-1 font-medium text-ink transition-colors hover:text-cool"
                  >
                    Log in
                    <ArrowUpRight size={14} />
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}
