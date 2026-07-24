import Link from "next/link";
import {
  ArrowUpRight,
  Bot,
  Cloud,
  Code2,
  FileCheck2,
  GraduationCap,
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

      <div className="mt-14 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {BUSINESS.map((item, index) => {
          const Icon = item.icon;
          return (
            <Reveal key={item.title} delay={(index % 3) * 60} className="h-full">
              <article className="premium-card premium-card-hover group flex h-full flex-col rounded-3xl p-6 sm:p-7">
                <div className="flex items-start justify-between">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-cool/15 to-accent/15">
                    <Icon size={21} className="text-cool" />
                  </span>
                  <span className="font-display text-sm font-semibold text-ink-subtle">
                    0{index + 1}
                  </span>
                </div>
                <h3 className="mt-7 text-xl text-ink">{item.title}</h3>
                <p className="mt-3 flex-1 text-sm leading-6 text-ink-muted">
                  {item.copy}
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-line bg-white/[0.025] px-2.5 py-1 text-[11px] text-ink-subtle"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </article>
            </Reveal>
          );
        })}
      </div>

      <Reveal delay={100}>
        <div className="premium-card mt-6 grid overflow-hidden rounded-3xl border border-accent/20 p-6 sm:p-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:gap-12">
          <div>
            <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-accent/25 bg-accent/12">
              <GraduationCap size={20} className="text-accent" />
            </span>
            <p className="mt-5 text-xs font-semibold uppercase tracking-[0.16em] text-cool">
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
              className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-full border border-cool/25 bg-cool/10 px-5 text-sm font-semibold text-cool transition-colors hover:bg-cool/15"
            >
              Explore student projects
              <ArrowUpRight size={15} />
            </Link>
          </div>
          <div className="mt-8 grid gap-2.5 sm:grid-cols-2 lg:mt-0">
            {STUDENT.map((item) => (
              <div
                key={item}
                className="flex min-h-14 items-center gap-3 rounded-2xl border border-line bg-white/[0.025] px-4 py-3 transition-colors hover:border-accent/25 hover:bg-accent/[0.04]"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent/10">
                  <FileCheck2 size={15} className="text-accent" />
                </span>
                <p className="text-sm leading-5 text-ink-muted">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
