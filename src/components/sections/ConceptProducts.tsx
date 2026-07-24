import Link from "next/link";
import { ArrowUpRight, BarChart3, Boxes, Sparkles } from "lucide-react";
import { ButtonLink } from "../ui/Button";
import { Section } from "../ui/Section";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

const PRODUCTS = [
  {
    icon: Boxes,
    eyebrow: "Concept product",
    name: "Tenzok Orbit",
    tagline: "A calmer way to run every build.",
    copy: "A delivery workspace for briefs, milestones, reviews, handover files, and the decisions that usually get lost in chat.",
    tags: ["Projects", "Realtime", "Handover"],
    variant: "orbit",
  },
  {
    icon: Sparkles,
    eyebrow: "Concept product",
    name: "Tenzok Lens",
    tagline: "Useful answers from your own knowledge.",
    copy: "A focused AI knowledge layer that turns internal documents into searchable, cited answers for teams that need context fast.",
    tags: ["AI", "RAG", "Knowledge"],
    variant: "lens",
  },
  {
    icon: BarChart3,
    eyebrow: "Demo build",
    name: "Tenzok Ledger",
    tagline: "Operations you can see at a glance.",
    copy: "A modular operations dashboard concept for service businesses that need orders, people, revenue, and exceptions in one place.",
    tags: ["Dashboards", "Analytics", "Automation"],
    variant: "ledger",
  },
] as const;

export default function ConceptProducts() {
  return (
    <Section id="products" bordered>
      <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
        <SectionHeading
          eyebrow="Built by Tenzok"
          title={
            <>
              Products we are <span className="gradient-text">shaping in public.</span>
            </>
          }
          copy="A few product directions from our studio. They are clearly marked concepts and demo builds—useful proof of how we think, not invented client case studies."
        />
        <Reveal delay={100}>
          <ButtonLink href="/contact" variant="secondary">
            Turn your idea into a product
            <ArrowUpRight size={15} />
          </ButtonLink>
        </Reveal>
      </div>

      <div className="mt-14 grid gap-5 lg:grid-cols-3">
        {PRODUCTS.map((product, index) => {
          const Icon = product.icon;
          return (
            <Reveal key={product.name} delay={index * 70} className="h-full">
              <Link
                href="/contact"
                className="premium-card premium-card-hover group flex h-full flex-col overflow-hidden rounded-3xl"
              >
                <ProductPreview variant={product.variant} />
                <div className="flex flex-1 flex-col p-6 sm:p-7">
                  <div className="flex items-center justify-between gap-3">
                    <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-cool">
                      <Icon size={14} />
                      {product.eyebrow}
                    </span>
                    <ArrowUpRight
                      size={17}
                      className="text-ink-subtle transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
                    />
                  </div>
                  <h3 className="mt-5 text-2xl text-ink">{product.name}</h3>
                  <p className="mt-2 text-sm font-medium text-ink-muted">{product.tagline}</p>
                  <p className="mt-4 flex-1 text-sm leading-6 text-ink-muted">{product.copy}</p>
                  <div className="mt-6 flex flex-wrap gap-2 border-t border-line pt-5">
                    {product.tags.map((tag) => (
                      <span key={tag} className="rounded-full border border-line px-2.5 py-1 text-[11px] text-ink-subtle">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}

function ProductPreview({ variant }: { variant: (typeof PRODUCTS)[number]["variant"] }) {
  return (
    <div className={"relative h-52 overflow-hidden border-b border-line bg-surface-overlay p-5 " + variant}>
      <div aria-hidden className="absolute -right-12 -top-16 h-44 w-44 rounded-full bg-accent/15 blur-3xl" />
      <div aria-hidden className="absolute -bottom-20 left-8 h-40 w-40 rounded-full bg-cool/10 blur-3xl" />
      <div className="relative h-full rounded-2xl border border-white/10 bg-[#0b0d14]/90 p-4 shadow-2xl shadow-black/30">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex gap-1.5">
            <span className="h-2 w-2 rounded-full bg-red-300/70" />
            <span className="h-2 w-2 rounded-full bg-amber-300/70" />
            <span className="h-2 w-2 rounded-full bg-emerald-300/70" />
          </div>
          <span className="text-[9px] font-semibold uppercase tracking-[0.16em] text-ink-subtle">Preview</span>
        </div>
        <div className="mt-4 grid grid-cols-[0.72fr_1.28fr] gap-3">
          <div className="space-y-2">
            <span className="block h-2 w-16 rounded-full bg-cool/40" />
            <span className="block h-2 w-24 rounded-full bg-white/10" />
            <span className="block h-2 w-20 rounded-full bg-white/10" />
            <span className="block h-2 w-28 rounded-full bg-white/10" />
          </div>
          <div className="grid grid-cols-3 gap-2">
            <span className="h-16 rounded-xl border border-cool/20 bg-cool/10" />
            <span className="h-16 rounded-xl border border-accent/20 bg-accent/10" />
            <span className="h-16 rounded-xl border border-white/10 bg-white/[0.04]" />
          </div>
        </div>
        <div className="mt-3 h-2 rounded-full bg-gradient-to-r from-cool/60 via-accent/70 to-transparent" />
      </div>
    </div>
  );
}
