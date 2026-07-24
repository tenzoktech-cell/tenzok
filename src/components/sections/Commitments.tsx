import { FileLock2, GitPullRequest, PackageOpen, Receipt, UserCheck, Video } from "lucide-react";
import { Section } from "../ui/Section";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

/**
 * Promises, not testimonials. Every line here is falsifiable — a client can
 * hold us to it — which is the strongest trust signal available to a studio
 * that does not yet have a wall of logos. Do not replace these with invented
 * quotes or metrics.
 */
const COMMITMENTS = [
  {
    icon: FileLock2,
    title: "NDA before we hear a detail",
    copy: "Signed before the scoping call, not after. You should never have to describe your idea to a stranger on trust.",
  },
  {
    icon: Receipt,
    title: "Priced in writing, before work starts",
    copy: "Fixed scope or retainer, with milestones. No hourly creep, no invoice that surprises you.",
  },
  {
    icon: UserCheck,
    title: "One named senior lead",
    copy: "A real person who owns your engagement, whose name you know, and who is in the room every week.",
  },
  {
    icon: Video,
    title: "A demo every week",
    copy: "Working software, in your timezone, on a schedule. Progress you can see beats a status report you have to believe.",
  },
  {
    icon: GitPullRequest,
    title: "Reviewed line by line",
    copy: "Every commit goes through review — for clients, that means quality; for students, it is the entire point.",
  },
  {
    icon: PackageOpen,
    title: "Full handover, no black boxes",
    copy: "Source, docs, infrastructure and a knowledge-transfer session. When we leave, you own all of it.",
  },
];

export default function Commitments() {
  return (
    <Section id="commitments" bordered>
      <SectionHeading
        align="center"
        eyebrow="What you can hold us to"
        title={
          <>
            Six promises.{" "}
            <span className="gradient-text">All falsifiable.</span>
          </>
        }
        copy="We are young enough that we cannot yet show you a wall of client logos. So instead of asking you to take our word for it, here is what you can hold us to — in writing, on every single engagement."
      />

      <div className="mt-16 grid gap-px overflow-hidden rounded-3xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
        {COMMITMENTS.map((item, i) => {
          const Icon = item.icon;
          return (
            <Reveal key={item.title} delay={(i % 3) * 80} className="h-full">
              <div className="flex h-full flex-col bg-surface-raised p-7 transition-colors hover:bg-surface-overlay">
                <Icon size={20} className="text-accent" />
                <h3 className="mt-6 text-base text-ink">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">{item.copy}</p>
              </div>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
