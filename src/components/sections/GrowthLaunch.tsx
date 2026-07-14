import { Check, Megaphone, Rocket, type LucideIcon } from "lucide-react";
import { Section } from "../ui/Section";
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

export default function GrowthLaunch() {
  return (
    <Section bordered>
      <SectionHeading
        align="center"
        eyebrow="Growth Lab"
        title={
          <>
            Built. Marketed.{" "}
            <span className="font-display italic text-accent">Launched.</span>
          </>
        }
        copy="Shipping is the midpoint, not the finish line. Tenzok carries products through the noisy part — being seen, tried, and adopted."
      />

      <div className="mt-16 grid gap-6 md:grid-cols-2">
        {PANELS.map((panel, i) => {
          const Icon = panel.icon;
          return (
            <Reveal key={panel.id} delay={i * 100} className="h-full">
              <article
                id={panel.id}
                className="h-full scroll-mt-28 rounded-2xl border border-line bg-surface-raised p-8"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-line bg-surface-overlay">
                  <Icon size={20} className="text-ink-muted" />
                </span>
                <h3 className="mt-6 text-xl text-ink">{panel.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">{panel.desc}</p>
                <ul className="mt-6 flex flex-col gap-3">
                  {panel.points.map((point) => (
                    <li
                      key={point}
                      className="flex items-start gap-3 text-sm leading-relaxed text-ink-muted"
                    >
                      <Check size={15} className="mt-1 shrink-0 text-accent" />
                      {point}
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
