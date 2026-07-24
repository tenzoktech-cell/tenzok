import type { Metadata } from "next";
import HeroTenzok from "@/components/HeroTenzok";
import JsonLd from "@/components/JsonLd";
import AgencyServices from "@/components/sections/AgencyServices";
import CapabilityMarquee from "@/components/sections/CapabilityMarquee";
import ConceptProducts from "@/components/sections/ConceptProducts";
import CtaFooter from "@/components/sections/CtaFooter";
import DeliveryProcess from "@/components/sections/DeliveryProcess";
import InsightsFaq from "@/components/sections/InsightsFaq";
import { organizationSchema, websiteSchema } from "@/lib/seo";
import { SITE, socialMetadata, url } from "@/lib/site";

export const metadata: Metadata = {
  alternates: { canonical: url("/") },
  ...socialMetadata({
    title: `${SITE.name} — Software Products, AI Solutions & Student Projects`,
    description: SITE.description,
    path: "/",
  }),
};

export default function Home() {
  return (
    <main id="main" tabIndex={-1} className="bg-surface">
      <JsonLd schema={[organizationSchema(), websiteSchema()]} />
      <HeroTenzok />
      <CapabilityMarquee />
      <AgencyServices />
      <ConceptProducts />
      <DeliveryProcess />
      <InsightsFaq />
      <CtaFooter />
    </main>
  );
}
