"use client";

import { useEffect } from "react";
import { CircleAlert, RefreshCw } from "lucide-react";
import TenzokNav from "@/components/TenzokNav";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Section";

export default function ErrorPage({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main id="main" tabIndex={-1} className="min-h-screen bg-surface">
      <TenzokNav />
      <Container className="flex min-h-screen items-center justify-center py-32">
        <div className="premium-card w-full max-w-xl rounded-[2rem] p-8 text-center sm:p-12">
          <CircleAlert size={30} className="mx-auto text-accent" />
          <h1 className="mt-6 text-4xl text-ink">Something interrupted the build.</h1>
          <p className="mt-4 text-base leading-7 text-ink-muted">
            Your data has not been intentionally changed. Try loading this section
            again, or return to it in a moment.
          </p>
          <Button size="lg" className="mt-8" onClick={() => unstable_retry()}>
            <RefreshCw size={15} />
            Try again
          </Button>
        </div>
      </Container>
    </main>
  );
}
