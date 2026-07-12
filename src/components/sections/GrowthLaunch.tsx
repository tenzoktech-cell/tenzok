import { Check, Megaphone, Rocket, type LucideIcon } from "lucide-react";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

interface GrowthPanel {
  id: string;
  icon: LucideIcon;
  title: string;
  desc: string;
  points: string[];
}

const PANELS: GrowthPanel[] = [
  {
    id: "digital-marketing",
    icon: Megaphone,
    title: "Digital Marketing",
    desc: "Growth engines for products, brands, and portfolios — built on content that compounds instead of ads that evaporate.",
    points: [
      "SEO & content systems that compound",
      "Performance campaigns with honest reporting",
      "Brand identity & social playbooks",
      "Analytics dashboards you can actually read",
    ],
  },
  {
    id: "launch-support",
    icon: Rocket,
    title: "Launch Support",
    desc: "From landing page to launch day and the noisy weeks after — we stay in the room until the product finds its footing.",
    points: [
      "Conversion-first landing pages",
      "Launch-day playbooks & war rooms",
      "App Store, Play Store & Product Hunt rollouts",
      "Post-launch iteration sprints",
    ],
  },
];

const STATS = [
  { value: "Weekly", label: "Demos on every engagement" },
  { value: "NDA-first", label: "Before we hear the idea" },
  { value: "100%", label: "Source and docs handed over" },
  { value: "0", label: "Black boxes, ever" },
];

export default function GrowthLaunch() {
  return (
    <section className="relative scroll-mt-20 border-t border-white/5 bg-black py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading
          align="center"
          eyebrow="Growth Lab"
          title={
            <>
              Built. Marketed.{" "}
              <span className="font-playfair italic text-[#e8702a]">Launched.</span>
            </>
          }
          copy="Shipping is the midpoint, not the finish line. Tenzok carries products through the noisy part — being seen, tried, and adopted."
        />

        <div className="mt-14 grid gap-5 md:grid-cols-2">
          {PANELS.map((panel, i) => {
            const Icon = panel.icon;
            return (
              <Reveal key={panel.id} delay={i * 120} className="h-full">
                <article
                  id={panel.id}
                  className="group h-full scroll-mt-28 rounded-3xl border border-white/10 bg-white/[0.04] p-8 transition-all duration-300 hover:-translate-y-1.5 hover:border-white/20 hover:shadow-2xl hover:shadow-[#e8702a]/10"
                >
                  <div className="inline-flex rounded-2xl border border-[#e8702a]/25 bg-[#e8702a]/10 p-3.5 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3">
                    <Icon size={24} className="text-[#e8702a]" />
                  </div>
                  <h3 className="mt-5 text-xl font-medium text-white sm:text-2xl">
                    {panel.title}
                  </h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-white/55">{panel.desc}</p>
                  <ul className="mt-6 flex flex-col gap-3">
                    {panel.points.map((point) => (
                      <li
                        key={point}
                        className="flex items-start gap-2.5 text-sm leading-relaxed text-white/70"
                      >
                        <Check size={15} className="mt-0.5 shrink-0 text-[#e8702a]" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </article>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={100} className="mt-16">
          <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 lg:grid-cols-4">
            {STATS.map((stat) => (
              <div key={stat.label} className="flex flex-col gap-1.5 bg-[#0a0a0a] p-6 sm:p-8">
                <dd className="order-1 text-4xl font-semibold text-white sm:text-5xl">
                  {stat.value}
                </dd>
                <dt className="order-2 text-sm text-white/50">{stat.label}</dt>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
