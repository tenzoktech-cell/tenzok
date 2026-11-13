import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Check, Plus } from "lucide-react";
import { PRODUCTS, type Product } from "../products-data";
import { buttonClass } from "../ui/Button";
import { Section } from "../ui/Section";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

const hostOf = (url: string) => new URL(url).host;
const pad = (n: number) => String(n).padStart(2, "0");

export default function ProductShowcase({
  showHeading = true,
}: {
  /** Off on /products, where the page hero already introduces the list. */
  showHeading?: boolean;
}) {
  if (!PRODUCTS.length) return null;

  return (
    <Section id="products" bordered>
      {showHeading && (
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <SectionHeading
          eyebrow="Our products"
          title={
            <>
              Products, <span className="gradient-text">not just projects.</span>
            </>
          }
          copy="Alongside client work, we design, build and ship our own software. Open any of them and try it live."
        />
        <Reveal className="shrink-0">
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-subtle">
            {pad(PRODUCTS.length)} live · more on the way
          </p>
        </Reveal>
      </div>
      )}

      <div className={`flex flex-col gap-6 sm:gap-8 ${showHeading ? "mt-10 sm:mt-12" : ""}`}>
        {PRODUCTS.map((product, index) => (
          <ProductRow key={product.slug} product={product} index={index} />
        ))}

        <Reveal>
          <div className="flex flex-col items-start justify-between gap-5 rounded-2xl border border-dashed border-line-strong p-6 sm:flex-row sm:items-center sm:p-8">
            <div className="flex items-start gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-line-strong text-ink-muted">
                <Plus size={18} />
              </span>
              <div>
                <p className="font-display text-xl text-ink">More products on the way</p>
                <p className="mt-1 text-sm leading-6 text-ink-muted">
                  Got a product idea of your own? We take those from first sketch to launch.
                </p>
              </div>
            </div>
            <Link href="/contact" className={buttonClass("secondary", "md", "group shrink-0 rounded-full!")}>
              Talk to us
              <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

function ProductRow({ product, index }: { product: Product; index: number }) {
  const flip = index % 2 === 1;
  const host = hostOf(product.url);

  return (
    <Reveal>
      <article className="grid overflow-hidden rounded-2xl border border-line bg-surface-raised lg:grid-cols-[1.2fr_1fr]">
        {/* Visual: the live product in a browser frame. */}
        <a
          href={product.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Open ${product.name} live demo (opens in a new tab)`}
          className={`group relative block bg-surface-overlay p-3 sm:p-6 lg:p-8 ${
            flip ? "lg:order-2" : ""
          }`}
        >
          <div className="overflow-hidden rounded-xl border border-ink/10 bg-surface-raised shadow-[0_24px_60px_-28px_rgba(27,23,18,0.45)] transition-transform duration-500 ease-out group-hover:-translate-y-1">
            <div className="flex items-center gap-3 border-b border-line px-3 py-2.5 sm:px-4">
              <span aria-hidden className="flex gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-ink/15" />
                <span className="h-2.5 w-2.5 rounded-full bg-ink/15" />
                <span className="h-2.5 w-2.5 rounded-full bg-ink/15" />
              </span>
              <span className="min-w-0 flex-1 truncate rounded-full bg-ink/[0.05] px-3 py-1 text-center font-mono text-[11px] text-ink-subtle">
                {host}
              </span>
              <ArrowUpRight
                aria-hidden
                size={15}
                className="shrink-0 text-ink-subtle transition-colors group-hover:text-accent"
              />
            </div>
            <div className="relative aspect-[16/10] overflow-hidden">
              <Image
                src={product.image}
                alt={product.imageAlt}
                fill
                sizes="(min-width: 1280px) 680px, (min-width: 1024px) 55vw, 100vw"
                className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.03]"
              />
            </div>
          </div>
        </a>

        {/* Story */}
        <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10">
          <div className="flex items-center justify-between gap-4">
            <span className="inline-flex items-center gap-2 rounded-full border border-line px-3 py-1 text-xs font-medium text-ink">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#1f8a70] opacity-60 motion-reduce:hidden" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#1f8a70]" />
              </span>
              {product.status}
            </span>
            <span className="font-display text-2xl text-ink/20">{pad(index + 1)}</span>
          </div>

          <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.14em] text-accent">
            {product.category}
          </p>
          <h3 className="mt-2 text-3xl leading-tight text-ink sm:text-4xl">{product.name}</h3>
          <p className="mt-3 text-lg leading-7 text-ink">{product.tagline}</p>
          <p className="mt-3 text-sm leading-6 text-ink-muted">{product.description}</p>

          <ul className="mt-6 grid gap-x-6 gap-y-2.5 sm:grid-cols-2">
            {product.highlights.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-sm leading-5 text-ink-muted">
                <Check size={15} className="mt-0.5 shrink-0 text-accent" />
                {item}
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3">
            <a
              href={product.url}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonClass("primary", "md", "group rounded-full! pl-5! pr-4!")}
            >
              Open live demo
              <ArrowUpRight
                size={15}
                className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
            <span className="font-mono text-[11px] text-ink-subtle">{host}</span>
          </div>
        </div>
      </article>
    </Reveal>
  );
}
