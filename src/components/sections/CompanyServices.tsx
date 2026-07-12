import {
  ArrowRight,
  ArrowUpRight,
  Cloud,
  Code2,
  GraduationCap,
  Users,
  type LucideIcon,
} from "lucide-react";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

interface Service {
  icon: LucideIcon;
  title: string;
  desc: string;
  tags: string[];
}

const SERVICES: Service[] = [
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

const TRUST_POINTS = ["NDA-first", "Fixed scope or retainer", "Weekly demos", "Global time zones"];

export default function CompanyServices() {
  return (
    <section
      id="company-services"
      className="relative scroll-mt-20 border-t border-white/5 bg-black py-24 sm:py-32"
    >
      <div className="mx-auto grid max-w-6xl gap-14 px-5 sm:px-8 lg:grid-cols-[1fr_1.5fr]">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeading
            eyebrow="Company Services"
            title={
              <>
                Your product,{" "}
                <span className="font-playfair italic text-[#e8702a]">owned</span> like
                ours.
              </>
            }
            copy="We don’t just take the project — we own it, teach it, and ship it. Engagements built for startups and enterprises that want delivery plus durable knowledge."
          />
          <Reveal delay={150}>
            <div className="mt-8 flex flex-wrap gap-2">
              {TRUST_POINTS.map((point) => (
                <span
                  key={point}
                  className="rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-xs text-white/55"
                >
                  {point}
                </span>
              ))}
            </div>
            <a
              href="#contact"
              className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-white transition-colors hover:text-[#e8702a]"
            >
              Book a scoping call
              <ArrowRight size={14} />
            </a>
          </Reveal>
        </div>

        <div className="divide-y divide-white/10 border-y border-white/10">
          {SERVICES.map((service, i) => {
            const Icon = service.icon;
            return (
              <Reveal key={service.title} delay={i * 80}>
                <div className="group flex items-start gap-5 rounded-lg px-2 py-8 transition-colors hover:bg-white/[0.03] sm:gap-7 sm:px-4">
                  <span className="pt-1 font-playfair text-xl italic text-white/30 transition-colors group-hover:text-[#e8702a] sm:text-2xl">
                    0{i + 1}
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <Icon size={18} className="text-[#e8702a]" />
                      <h3 className="text-lg font-medium text-white sm:text-xl">
                        {service.title}
                      </h3>
                    </div>
                    <p className="mt-2 max-w-lg text-sm leading-relaxed text-white/55">
                      {service.desc}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {service.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-white/50"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <span className="hidden h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/50 transition-all group-hover:border-[#e8702a] group-hover:bg-[#e8702a] group-hover:text-white sm:flex">
                    <ArrowUpRight size={16} />
                  </span>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
