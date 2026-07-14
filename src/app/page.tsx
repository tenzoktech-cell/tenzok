import type { Metadata } from "next";
import HeroTenzok from "@/components/HeroTenzok";
import JsonLd from "@/components/JsonLd";
import Commitments from "@/components/sections/Commitments";
import CompanyServices from "@/components/sections/CompanyServices";
import CtaFooter from "@/components/sections/CtaFooter";
import GrowthLaunch from "@/components/sections/GrowthLaunch";
import Mentorship from "@/components/sections/Mentorship";
import ProjectDomains from "@/components/sections/ProjectDomains";
import { organizationSchema, websiteSchema } from "@/lib/seo";
import { url } from "@/lib/site";

export const metadata: Metadata = {
  alternates: { canonical: url("/") },
  openGraph: { url: url("/") },
};

export default function Home() {
  return (
    <main id="main" tabIndex={-1} className="bg-surface">
      <JsonLd schema={[organizationSchema(), websiteSchema()]} />
      <HeroTenzok />
      <ProjectDomains />
      <Mentorship />
      <CompanyServices />
      <GrowthLaunch />
      <Commitments />
      <CtaFooter />
    </main>
  );
}
