import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import PageHero from "@/components/marketing/PageHero";
import { PRODUCTS } from "@/components/products-data";
import CtaFooter from "@/components/sections/CtaFooter";
import ProductShowcase from "@/components/sections/ProductShowcase";
import { ButtonLink } from "@/components/ui/Button";
import { breadcrumbSchema } from "@/lib/seo";
import { socialMetadata, url } from "@/lib/site";

const DESCRIPTION = `Software products designed, built and shipped by Tenzok, including ${PRODUCTS.map(
  (p) => p.name,
).join(", ")}. Open any of them and try the live demo.`;

export const metadata: Metadata = {
  title: "Products",
  description: DESCRIPTION,
  alternates: { canonical: url("/products") },
  ...socialMetadata({
    title: "Products — Tenzok",
    description: DESCRIPTION,
    path: "/products",
  }),
};

export default function ProductsPage() {
  return (
    <main id="main" tabIndex={-1} className="bg-surface">
      <JsonLd
        schema={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Products", path: "/products" },
          ]),
        ]}
      />

      <PageHero
        eyebrow="Tenzok products"
        title={
          <>
            Software we design, build{" "}
            <span className="gradient-text">and ship.</span>
          </>
        }
        copy="Alongside client work and student projects, we build our own products end to end — strategy, design, engineering and launch. Each one below is live: open it and try it."
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <ButtonLink href="/contact" size="lg">
            Build a product with us
          </ButtonLink>
          <ButtonLink href="/services" variant="secondary" size="lg">
            Explore services
          </ButtonLink>
        </div>
      </PageHero>

      <ProductShowcase showHeading={false} />

      <CtaFooter />
    </main>
  );
}
