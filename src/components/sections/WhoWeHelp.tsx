import {
  BriefcaseBusiness,
  Building2,
  GraduationCap,
  Rocket,
  type LucideIcon,
} from "lucide-react";
import { Section } from "../ui/Section";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

const AUDIENCES: {
  icon: LucideIcon;
  title: string;
  copy: string;
  outcome: string;
}[] = [
  {
    icon: Building2,
    title: "Businesses",
    copy: "Modernize operations, build customer-facing software, or extend an internal team with transparent delivery.",
    outcome: "Reliable software with a complete handover",
  },
  {
    icon: Rocket,
    title: "Startups",
    copy: "Turn a rough idea into a focused MVP, validate it quickly, and build the foundation without creating a rewrite trap.",
    outcome: "A launchable product and a clear next roadmap",
  },
  {
    icon: GraduationCap,
    title: "Students",
    copy: "Build a technically honest project with review, deployment, documentation, and the confidence to defend every decision.",
    outcome: "A portfolio-ready project you understand",
  },
  {
    icon: BriefcaseBusiness,
    title: "Freelancers",
    copy: "Get architecture support, specialist engineering, QA, or delivery capacity when a client brief grows beyond one person.",
    outcome: "A stronger delivery partner behind your work",
  },
];

export default function WhoWeHelp() {
  return (
    <Section bordered>
      <SectionHeading
        align="center"
        eyebrow="Who we help"
        title={
          <>
            Different starting points.{" "}
            <span className="gradient-text">The same delivery discipline.</span>
          </>
        }
        copy="We adjust the scope, pace, and collaboration model—not the standard of engineering."
      />

      <div className="mt-14 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {AUDIENCES.map((item, index) => {
          const Icon = item.icon;
          return (
            <Reveal key={item.title} delay={index * 60} className="h-full">
              <article className="premium-card premium-card-hover flex h-full flex-col rounded-3xl p-6">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-line bg-white/[0.04]">
                  <Icon size={19} className="text-cool" />
                </span>
                <h3 className="mt-6 text-xl text-ink">{item.title}</h3>
                <p className="mt-3 flex-1 text-sm leading-6 text-ink-muted">{item.copy}</p>
                <p className="mt-6 border-t border-line pt-5 text-xs font-medium leading-5 text-accent">
                  {item.outcome}
                </p>
              </article>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
