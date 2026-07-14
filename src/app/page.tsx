import HeroTenzok from "@/components/HeroTenzok";
import Commitments from "@/components/sections/Commitments";
import CompanyServices from "@/components/sections/CompanyServices";
import CtaFooter from "@/components/sections/CtaFooter";
import GrowthLaunch from "@/components/sections/GrowthLaunch";
import Mentorship from "@/components/sections/Mentorship";
import ProjectDomains from "@/components/sections/ProjectDomains";

export default function Home() {
  return (
    <main id="main" tabIndex={-1} className="bg-surface">
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
