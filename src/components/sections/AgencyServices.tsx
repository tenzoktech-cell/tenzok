import Link from "next/link";
import {
  ArrowUpRight,
  Bot,
  Cloud,
  Code2,
  LayoutDashboard,
  Megaphone,
  Smartphone,
  type LucideIcon,
} from "lucide-react";
import { Section } from "../ui/Section";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

interface Capability {
  icon: LucideIcon;
  title: string;
  copy: string;
  tags: string[];
}

const BUSINESS: Capability[] = [
  {
    icon: Code2,
    title: "Custom websites",
    copy: "Fast, conversion-focused company and product sites with an editing model your team can maintain.",
    tags: ["Next.js", "SEO", "CMS-ready"],
  },
  {
    icon: LayoutDashboard,
    title: "Web applications",
    copy: "Secure portals, SaaS products, internal tools, dashboards, and workflow systems built around real operations.",
    tags: ["Full-stack", "SaaS", "Dashboards"],
  },
  {
    icon: Smartphone,
    title: "Mobile products",
    copy: "Cross-platform apps designed for reliable everyday use, thoughtful onboarding, and a clean release path.",
    tags: ["Mobile", "APIs", "Stores"],
  },
  {
    icon: Bot,
    title: "AI & automation",
    copy: "RAG, agents, workflow automation, and ML features measured against a useful business outcome.",
    tags: ["LLMs", "Agents", "ML"],
  },
  {
    icon: Cloud,
    title: "Cloud delivery",
    copy: "Deployment, CI/CD, observability, and modernization work that leaves your team with no hidden infrastructure.",
    tags: ["Cloud", "DevOps", "Support"],
  },
  {
    icon: Megaphone,
    title: "Growth & launch",
    copy: "Positioning, launch pages, analytics, content systems, and post-launch iteration that help good products get seen.",
    tags: ["Launch", "SEO", "Analytics"],
  },
];

const STUDENT = [
  "Final-year and major projects",
  "Mini projects",
  "Python, Java and JavaScript builds",
  "AI, machine learning and deep learning",
  "IoT, robotics, VLSI and power electronics",
  "Documentation, slides and viva preparation",
];

export default function AgencyServices() {
  return (
    <Section id="services" bordered>
      <SectionHeading
        eyebrow="What we build"
        title={
          <>
            Product thinking at every layer.{" "}
            <span className="gradient-text">One accountable team.</span>
          </>
        }
        copy="Tenzok brings strategy, design, engineering, deployment, and support into one delivery system—built for businesses first, with the same professional standard extended to student work."
      />

      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {BUSINESS.map((item, index) => {
          return (
            <Reveal key={item.title} delay={(index % 3) * 60} className="h-full">
              <article className="premium-card premium-card-hover group flex h-full flex-col rounded-3xl p-6">
                <span className="font-mono text-xs text-accent">0{index + 1}</span>
                <h3 className="mt-4 text-xl text-ink">{item.title}</h3>
                <p className="mt-3 flex-1 text-sm leading-6 text-ink-muted">
                  {item.copy}
                </p>
                <p className="mt-6 border-t border-line pt-4 font-mono text-[11px] uppercase tracking-[0.12em] text-ink-subtle">
                  {item.tags.join(" · ")}
                </p>
              </article>
            </Reveal>
          );
        })}
      </div>

      <Reveal delay={100}>
        <div className="premium-card mt-6 grid overflow-hidden rounded-3xl border border-accent/20 p-6 sm:p-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:gap-12">
          <div>
            <p className="font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-accent">
              Student engineering
            </p>
            <h3 className="mt-3 max-w-md text-2xl leading-tight text-ink sm:text-3xl">
              Build it. Understand it.{" "}
              <span className="text-ink-muted">Present it confidently.</span>
            </h3>
            <p className="mt-3 text-sm leading-6 text-ink-muted">
              Architecture, code review, deployment, documentation, and viva support
              are part of the build—not add-ons at the end.
            </p>
            <Link
              href="/projects"
              className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-md border border-cool px-5 text-sm font-semibold text-cool transition-colors hover:bg-cool/15"
            >
              Explore student projects
              <ArrowUpRight size={15} />
            </Link>
          </div>
          <div className="mt-8 grid gap-x-8 sm:grid-cols-2 lg:mt-0">
            {STUDENT.map((item) => (
              <div
                key={item}
                className="flex min-h-12 items-center gap-3 border-b border-line py-3"
              >
                <span aria-hidden className="h-1.5 w-1.5 shrink-0 bg-accent" />
                <p className="text-sm leading-5 text-ink-muted">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
