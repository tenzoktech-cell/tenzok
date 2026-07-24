import { ArrowRight, Cloud, Code2, GraduationCap, Users, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { Section } from "../ui/Section";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

interface Offer {
  icon: LucideIcon;
  title: string;
  desc: string;
  tags: string[];
}

const OFFERS: Offer[] = [
  {
    icon: Code2,
    title: "Product Engineering",
    desc: "MVPs to v1 launches — web, mobile, and AI features shipped with tests, CI/CD, and documentation your team can actually inherit.",
    tags: ["Web", "Mobile", "AI features"],
  },
  {
    icon: Users,
    title: "Dedicated Delivery Pods",
    desc: "A senior Tenzok lead with mentored engineers, running your backlog in weekly sprints — demos every Friday, no black boxes.",
    tags: ["Sprint delivery", "Team extension"],
  },
  {
    icon: Cloud,
    title: "Modernization & Cloud",
    desc: "Audits, refactors, and migrations that move legacy systems to cloud-native without stopping the business.",
    tags: ["DevOps", "Migrations", "Audits"],
  },
  {
    icon: GraduationCap,
    title: "Corporate Training",
    desc: "Upskilling programs and campus-to-corporate pipelines that turn fresh hires into shipping contributors in weeks.",
    tags: ["Workshops", "Hiring pipelines"],
  },
];

export default function CompanyServices() {
  return (
    <Section id="company-services" bordered>
      <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeading
            eyebrow="Company Services"
            title={
              <>
                Your product,{" "}
                <span className="gradient-text">owned</span> like ours.
              </>
            }
            copy="We don't just take the project — we own it, teach it, and ship it. Engagements built for startups and enterprises that want delivery plus durable knowledge."
          />
          <Reveal delay={120}>
            <Link
              href="/contact?service=company-services"
              className="mt-8 inline-flex min-h-11 items-center gap-2 rounded-full border border-line-strong bg-surface-raised px-5 text-sm font-medium text-ink transition-colors hover:bg-surface-overlay"
            >
              Book a scoping call
              <ArrowRight size={15} />
            </Link>
          </Reveal>
        </div>

        <div className="premium-card divide-y divide-line overflow-hidden rounded-3xl">
          {OFFERS.map((offer, i) => {
            const Icon = offer.icon;
            return (
              <Reveal key={offer.title} delay={i * 70}>
                <div className="flex items-start gap-5 p-7 transition-colors hover:bg-white/[0.025]">
                  <span className="font-display text-sm font-bold text-accent">
                    0{i + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-3">
                      <Icon size={18} className="shrink-0 text-ink-muted" />
                      <h3 className="text-lg text-ink">{offer.title}</h3>
                    </div>
                    <p className="mt-3 max-w-lg text-sm leading-relaxed text-ink-muted">
                      {offer.desc}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {offer.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-md border border-line px-2 py-1 text-xs text-ink-subtle"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
