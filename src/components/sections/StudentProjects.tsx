import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  Brain,
  Cpu,
  Navigation,
  Recycle,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

interface Project {
  icon: LucideIcon;
  name: string;
  domain: string;
  blurb: string;
  outcome: string;
  stack: string[];
}

const PROJECTS: Project[] = [
  {
    icon: Brain,
    name: "MediTriage AI",
    domain: "AI / ML",
    blurb:
      "A symptom-triage assistant for a final-year capstone — trained, evaluated, and served behind a real API.",
    outcome: "Ships with an evaluation report",
    stack: ["TensorFlow", "FastAPI", "React"],
  },
  {
    icon: Cpu,
    name: "GridSense IoT",
    domain: "IoT",
    blurb:
      "Smart-grid monitoring with live telemetry from campus substations, alerting before failures happen.",
    outcome: "Ships with a live telemetry demo",
    stack: ["ESP32", "MQTT", "Grafana"],
  },
  {
    icon: Wallet,
    name: "Campus Pay",
    domain: "FinTech",
    blurb:
      "A closed-loop campus wallet with UPI-style flows, reconciliation, and an admin console for the canteen.",
    outcome: "Ships with a reconciliation suite",
    stack: ["Next.js", "PostgreSQL", "Razorpay"],
  },
  {
    icon: Recycle,
    name: "VisionSort",
    domain: "Computer Vision",
    blurb:
      "A waste-sorting robot arm that classifies recyclables on a moving belt, built and demoed end-to-end.",
    outcome: "Ships with a hardware demo rig",
    stack: ["OpenCV", "ROS", "PyTorch"],
  },
  {
    icon: Activity,
    name: "StockPulse",
    domain: "Data Engineering",
    blurb:
      "Real-time market dashboards streaming ticks through a proper pipeline instead of a cron job and a prayer.",
    outcome: "Ships with a defensible pipeline",
    stack: ["Kafka", "ClickHouse", "React"],
  },
  {
    icon: Navigation,
    name: "SafeRoute",
    domain: "Mobile",
    blurb:
      "A safety-first navigation app with trusted-contact tracking, built to reach the Play Store before graduation.",
    outcome: "Ships with a store release checklist",
    stack: ["Flutter", "Firebase", "Maps SDK"],
  },
];

const PIPELINE = ["Scope", "Architect", "Build with a mentor", "Deploy", "Defend it in interviews"];

function ProjectCard({ project }: { project: Project }) {
  const Icon = project.icon;
  return (
    <article className="group relative h-full overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] transition-all duration-300 hover:-translate-y-1.5 hover:border-white/20 hover:shadow-2xl hover:shadow-[#e8702a]/10">
      <div className="relative h-36 overflow-hidden border-b border-white/10">
        <div className="absolute -top-10 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full bg-[#e8702a]/25 blur-[70px] opacity-60 transition-opacity duration-300 group-hover:opacity-100" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="rounded-xl border border-white/10 bg-white/5 p-3.5 backdrop-blur transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3">
            <Icon size={26} className="text-[#e8702a]" />
          </div>
        </div>
        <span className="absolute left-3 top-3 rounded-full border border-white/10 bg-black/40 px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-white/60 backdrop-blur">
          {project.domain}
        </span>
      </div>

      <div className="flex flex-col gap-3 p-5">
        <h3 className="text-lg font-medium text-white">{project.name}</h3>
        <p className="text-sm leading-relaxed text-white/55">{project.blurb}</p>
        <div className="flex flex-wrap gap-1.5">
          {project.stack.map((tech) => (
            <span
              key={tech}
              className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-white/50"
            >
              {tech}
            </span>
          ))}
        </div>
        <div className="mt-2 flex items-center justify-between border-t border-white/10 pt-3 text-xs">
          <span className="text-white/45">{project.outcome}</span>
          <ArrowUpRight
            size={14}
            className="text-white/40 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#e8702a]"
          />
        </div>
      </div>
    </article>
  );
}

export default function StudentProjects() {
  return (
    <section
      id="student-projects"
      className="relative scroll-mt-20 overflow-hidden bg-[#050505] py-24 sm:py-32"
    >
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-[#e8702a]/[0.07] blur-[130px]" />

      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            eyebrow="Student Projects"
            title={
              <>
                Capstones that read like{" "}
                <span className="font-playfair italic text-[#e8702a]">case studies.</span>
              </>
            }
            copy="A taste of the briefs we mentor — architected, built, and deployed for real. You leave with a running product, a defensible design, and a story interviewers remember."
          />
          <Reveal delay={150}>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-white/15 bg-white/5 px-6 py-2.5 text-sm text-white/80 transition-all hover:bg-white/10 hover:text-white"
            >
              Request a sample brief
              <ArrowRight size={14} />
            </a>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {PROJECTS.map((project, i) => (
            <Reveal key={project.name} delay={(i % 3) * 90} className="h-full">
              <ProjectCard project={project} />
            </Reveal>
          ))}
        </div>

        <Reveal delay={100} className="mt-14">
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2">
            {PIPELINE.map((step, i) => (
              <span key={step} className="flex items-center gap-3">
                <span className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 text-xs text-white/60">
                  {step}
                </span>
                {i < PIPELINE.length - 1 && (
                  <ArrowRight size={13} className="text-[#e8702a]/70" />
                )}
              </span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
