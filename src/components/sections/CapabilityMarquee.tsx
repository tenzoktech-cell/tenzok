const CAPABILITIES = [
  "Web applications",
  "Mobile products",
  "AI systems",
  "Automation",
  "UI/UX design",
  "Cloud delivery",
  "Next.js",
  "Supabase",
  "React Native",
  "Python & ML",
];

export default function CapabilityMarquee() {
  return (
    <section
      aria-label="Tenzok capabilities"
      className="border-y border-line bg-surface-raised/55 py-4"
    >
      <div className="capability-marquee-window overflow-hidden">
        <div className="marquee-track flex min-w-max whitespace-nowrap text-xs font-semibold uppercase tracking-[0.2em] text-ink-subtle sm:text-sm">
          <CapabilityGroup />
          <CapabilityGroup duplicate />
        </div>
      </div>
    </section>
  );
}

function CapabilityGroup({ duplicate = false }: { duplicate?: boolean }) {
  return (
    <div
      aria-hidden={duplicate || undefined}
      className="marquee-group flex shrink-0 items-center gap-8 pr-8 sm:gap-12 sm:pr-12"
    >
      {CAPABILITIES.map((item) => (
        <span key={item} className="inline-flex items-center gap-8 sm:gap-12">
          {item}
          <span aria-hidden className="marquee-star text-cool">
            ✦
          </span>
        </span>
      ))}
    </div>
  );
}
