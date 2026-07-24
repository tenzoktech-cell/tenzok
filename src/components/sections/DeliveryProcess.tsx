import { Section } from "../ui/Section";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

const STEPS = [
  {
    number: "01",
    title: "Discover",
    copy: "Goals, users, constraints, risks, and the real problem behind the request.",
  },
  {
    number: "02",
    title: "Plan",
    copy: "A written scope, architecture direction, milestones, and a delivery model.",
  },
  {
    number: "03",
    title: "Design",
    copy: "Flows and interfaces shaped around clarity before implementation begins.",
  },
  {
    number: "04",
    title: "Develop",
    copy: "Small reviewed increments, visible progress, and working demos every week.",
  },
  {
    number: "05",
    title: "Deliver",
    copy: "QA, deployment, documentation, source access, and knowledge transfer.",
  },
  {
    number: "06",
    title: "Support",
    copy: "A practical handoff period and a roadmap for the next useful iteration.",
  },
];

export default function DeliveryProcess() {
  return (
    <Section id="process" bordered>
      <div className="grid gap-14 lg:grid-cols-[0.75fr_1.25fr] lg:gap-20">
        <SectionHeading
          eyebrow="How we work"
          title={
            <>
              Clear from first call to{" "}
              <span className="gradient-text">final handover.</span>
            </>
          }
          copy="No mystery phase and no disappearing into a black box. Every engagement follows a visible path with decisions, demos, and ownership built in."
        />

        <ol className="grid gap-px overflow-hidden rounded-3xl border border-line bg-line sm:grid-cols-2">
          {STEPS.map((step, index) => (
            <Reveal key={step.number} delay={(index % 2) * 50} className="h-full">
              <li className="group flex h-full gap-5 bg-surface-raised p-6 transition-colors hover:bg-surface-overlay sm:p-7">
                <span className="font-display text-sm font-bold text-accent">
                  {step.number}
                </span>
                <div>
                  <h3 className="text-lg text-ink">{step.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-ink-muted">{step.copy}</p>
                </div>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </Section>
  );
}
