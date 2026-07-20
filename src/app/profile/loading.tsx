import { Container } from "@/components/ui/Section";

/** Skeleton shown while the profile data loads. */
export default function ProfileLoading() {
  return (
    <div className="pb-24 pt-28 sm:pt-36">
      <Container>
        <div className="animate-pulse overflow-hidden rounded-2xl border border-line bg-surface-raised">
          <div className="h-36 bg-surface-overlay sm:h-44" />
          <div className="p-6 sm:p-8">
            <div className="-mt-16 h-24 w-24 rounded-2xl border-4 border-surface-raised bg-surface-overlay sm:-mt-20 sm:h-28 sm:w-28" />
            <div className="mt-5 h-6 w-48 rounded-full bg-surface-overlay" />
            <div className="mt-3 h-4 w-32 rounded-full bg-surface-overlay" />
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-10 rounded-xl bg-surface-overlay" />
              ))}
            </div>
          </div>
        </div>
        <div className="mt-8 h-11 w-full max-w-md animate-pulse rounded-full bg-surface-overlay" />
        <div className="mt-8 h-64 animate-pulse rounded-2xl border border-line bg-surface-raised" />
      </Container>
    </div>
  );
}
