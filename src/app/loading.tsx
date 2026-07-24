import { Container } from "@/components/ui/Section";

export default function Loading() {
  return (
    <main className="min-h-screen bg-surface pt-28">
      <Container>
        <div className="animate-pulse py-20">
          <div className="h-7 w-36 rounded-full bg-surface-overlay" />
          <div className="mt-7 h-16 max-w-3xl rounded-2xl bg-surface-overlay" />
          <div className="mt-5 h-6 max-w-2xl rounded-full bg-surface-raised" />
          <div className="mt-14 grid gap-4 md:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="h-56 rounded-3xl border border-line bg-surface-raised"
              />
            ))}
          </div>
        </div>
      </Container>
    </main>
  );
}
