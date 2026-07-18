import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import TenzokNav from "@/components/TenzokNav";
import { Container, Eyebrow } from "@/components/ui/Section";
import { isSupabaseConfigured } from "@/utils/supabase/config";
import { createClient } from "@/utils/supabase/server";
import { url } from "@/lib/site";
import SignupForm from "./SignupForm";

export const metadata: Metadata = {
  title: "Sign up",
  description: "Create your Tenzok account.",
  alternates: { canonical: url("/signup") },
  robots: { index: false },
};

export default async function SignupPage() {
  if (isSupabaseConfigured) {
    const supabase = createClient(await cookies());
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) redirect("/");
  }

  return (
    <main id="main" tabIndex={-1} className="bg-surface">
      <TenzokNav />

      <section className="pt-28 pb-24 sm:pt-44 md:pb-32">
        <Container>
          <div className="mx-auto max-w-md">
            <Eyebrow>Account</Eyebrow>
            <h1 className="mt-6 text-[clamp(2rem,1.5rem+2.4vw,3.5rem)] leading-[1.08] text-ink">
              Create your{" "}
              <span className="font-display italic text-accent">account.</span>
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-ink-muted">
              Tell us who you are — it takes under a minute.
            </p>

            <div className="mt-10 rounded-2xl border border-line bg-surface-raised/50 p-6 sm:p-8">
              <SignupForm />
            </div>

            <p className="mt-6 text-sm text-ink-muted">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-medium text-accent underline underline-offset-4 transition-colors hover:text-accent-strong"
              >
                Log in
              </Link>
            </p>
          </div>
        </Container>
      </section>
    </main>
  );
}
