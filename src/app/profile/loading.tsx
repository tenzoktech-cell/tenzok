import { Container } from "@/components/ui/Section";

/** Skeleton shown while the profile data loads. */
export default function ProfileLoading() {
  return (
    <div className="relative isolate overflow-hidden pb-24 pt-28 sm:pt-36">
      <div
        aria-hidden
        className="pointer-events-none absolute right-[-10rem] top-12 -z-10 h-[28rem] w-[28rem] rounded-full bg-cool/10 blur-[130px]"
      />
      <Container className="max-w-7xl">
        <div className="animate-pulse overflow-hidden rounded-[2rem] border border-line bg-surface-raised/80 shadow-2xl shadow-black/20">
          <div className="h-40 bg-gradient-to-r from-cool/10 via-surface-overlay to-accent/10 sm:h-52" />
          <div className="p-6 sm:p-9">
            <div className="-mt-20 h-24 w-24 rounded-3xl border-4 border-surface-raised bg-surface-overlay sm:-mt-24 sm:h-28 sm:w-28" />
            <div className="mt-6 h-7 w-52 rounded-full bg-surface-overlay" />
            <div className="mt-3 h-4 w-36 rounded-full bg-surface-overlay" />
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-12 rounded-2xl bg-surface-overlay" />
              ))}
            </div>
          </div>
        </div>
        <div className="mt-8 h-14 w-full max-w-xl animate-pulse rounded-2xl bg-surface-overlay" />
        <div className="mt-8 h-72 animate-pulse rounded-[2rem] border border-line bg-surface-raised" />
      </Container>
    </div>
  );
}
