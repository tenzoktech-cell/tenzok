import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowUpRight,
  Laptop,
  MapPin,
  MessageCircle,
  Users,
} from "lucide-react";
import JsonLd from "@/components/JsonLd";
import FaqList, { type FaqItem } from "@/components/marketing/FaqList";
import PageHero from "@/components/marketing/PageHero";
import CtaFooter from "@/components/sections/CtaFooter";
import Reveal from "@/components/sections/Reveal";
import SectionHeading from "@/components/sections/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import {
  KERALA_DISTRICTS,
  breadcrumbSchema,
  faqSchema,
  itemListSchema,
  localBusinessSchema,
} from "@/lib/seo";
import { socialMetadata, url } from "@/lib/site";

const PATH = "/final-year-projects-kerala";
const TITLE = "Final Year Projects in Kerala for KTU Students";
const DESCRIPTION =
  "Final year, mini and major project help for KTU students across Kerala. Unique CSE, IT, ECE and EEE ideas, built with engineers at Infopark, Kochi's IT hub.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "final year projects Kerala",
    "KTU final year project",
    "KTU mini project ideas",
    "KTU main project",
    "major project ideas for CSE",
    "unique final year project ideas",
    "final year project help Kochi",
    "computer science projects Kerala",
    "APJ Abdul Kalam Technological University projects",
  ],
  alternates: { canonical: url(PATH) },
  ...socialMetadata({
    title: `${TITLE} — Tenzok`,
    description: DESCRIPTION,
    path: PATH,
  }),
};

type Level = "Mini" | "Major" | "Mini or major";
interface Idea {
  title: string;
  copy: string;
  level: Level;
  domain: string;
  domainName: string;
}

/** Ideas with a Kerala angle where one exists — local problems make stronger projects. */
const IDEA_GROUPS: { branch: string; ideas: Idea[] }[] = [
  {
    branch: "Computer Science & IT",
    ideas: [
      { title: "Malayalam handwriting recognition", copy: "Read handwritten Malayalam from a phone photo with a CNN and a clean web demo.", level: "Major", domain: "deep-learning", domainName: "Deep Learning" },
      { title: "Manglish sentiment analyser", copy: "Classify Malayalam–English code-mixed social posts — a real gap most datasets ignore.", level: "Major", domain: "machine-learning", domainName: "Machine Learning" },
      { title: "KSRTC bus arrival predictor", copy: "Predict arrival times from GPS history and show them in a lightweight passenger app.", level: "Major", domain: "data-engineering", domainName: "Data Engineering" },
      { title: "Monsoon flood alert dashboard", copy: "Combine rainfall and river-level data into district-wise risk alerts on a live map.", level: "Major", domain: "data-analytics-bi", domainName: "Data Analytics & BI" },
      { title: "Coconut leaf disease detection", copy: "Spot common coconut and banana leaf diseases from photos, with treatment hints.", level: "Major", domain: "deep-learning", domainName: "Deep Learning" },
      { title: "Syllabus and regulations chatbot", copy: "A RAG assistant that answers questions from your university's PDFs, with sources cited.", level: "Major", domain: "ai-agents", domainName: "AI & LLM Applications" },
      { title: "Kerala trip planner with an LLM", copy: "Plan day-by-day itineraries with maps, travel time and budget built in.", level: "Major", domain: "ai-agents", domainName: "AI & LLM Applications" },
      { title: "Fake internship offer detector", copy: "Flag scam job and internship posts aimed at students using text features.", level: "Mini", domain: "machine-learning", domainName: "Machine Learning" },
      { title: "Campus lost-and-found portal", copy: "Post, search and match lost items with image similarity and email alerts.", level: "Mini", domain: "python-full-stack", domainName: "Python Full-Stack" },
      { title: "Phishing link checker extension", copy: "A browser extension that scores links before you click them.", level: "Mini or major", domain: "cybersecurity", domainName: "Cybersecurity" },
      { title: "Face attendance with liveness check", copy: "Attendance that a printed photo can't fool, with a teacher dashboard.", level: "Major", domain: "deep-learning", domainName: "Deep Learning" },
      { title: "Hostel mess feedback analytics", copy: "Daily menu ratings turned into waste and preference insights for the warden.", level: "Mini", domain: "js-full-stack", domainName: "JavaScript Full-Stack" },
    ],
  },
  {
    branch: "Electronics & Communication",
    ideas: [
      { title: "Landslide early-warning node", copy: "Soil moisture and tilt sensors with LoRa alerts — built for hilly districts like Idukki and Wayanad.", level: "Major", domain: "iot-embedded", domainName: "IoT & Embedded" },
      { title: "Smart irrigation for paddy fields", copy: "Water-level sensing and automatic pump control with a farmer-friendly app.", level: "Major", domain: "iot-embedded", domainName: "IoT & Embedded" },
      { title: "Malayalam voice commands on a microcontroller", copy: "Keyword spotting for a few Malayalam commands, running fully offline.", level: "Major", domain: "signal-processing-comms", domainName: "Signal Processing" },
      { title: "RISC-V core on an FPGA", copy: "Design, simulate and run a small RISC-V processor on a dev board.", level: "Major", domain: "vlsi-chip-design", domainName: "VLSI & Chip Design" },
      { title: "Drone crop-health mapping", copy: "Capture aerial images and turn them into a field health map.", level: "Major", domain: "robotics-drones", domainName: "Robotics & Drones" },
    ],
  },
  {
    branch: "Electrical & Electronics",
    ideas: [
      { title: "Solar EV charging monitor", copy: "Track solar input, battery state and charging sessions on a live dashboard.", level: "Major", domain: "power-electronics-ev", domainName: "Power Electronics & EV" },
      { title: "Smart meter with theft detection", copy: "Measure consumption and flag tampering patterns automatically.", level: "Major", domain: "power-electronics-ev", domainName: "Power Electronics & EV" },
      { title: "BLDC motor controller for e-bikes", copy: "Build and tune a controller, then test it under real load.", level: "Major", domain: "power-electronics-ev", domainName: "Power Electronics & EV" },
    ],
  },
];

const ALL_IDEAS = IDEA_GROUPS.flatMap((g) => g.ideas);

const STEPS = [
  { title: "Pick a topic your guide approves", copy: "Choose from the ideas here, bring your department's problem statement, or shape your own. We help you write the abstract and scope." },
  { title: "Design before you code", copy: "Architecture, dataset or hardware plan and a timeline — ready for your first review." },
  { title: "Build it together, week by week", copy: "You write and understand the code with us reviewing every step, so the work is genuinely yours." },
  { title: "Report, demo and viva ready", copy: "Documentation, a working demo or live URL, and practice on the questions examiners actually ask." },
];

const WAYS = [
  { icon: MapPin, title: "Based at Infopark, Kochi", copy: "Our engineers work from Infopark in Kakkanad, Kerala's IT hub, so your project follows the way software is built in industry. Meet us in person when it helps." },
  { icon: Laptop, title: "Online across Kerala", copy: "Video sessions and code reviews for students in every district." },
  { icon: MessageCircle, title: "Updates on WhatsApp", copy: "Quick questions and progress updates without waiting for the next call." },
  { icon: Users, title: "Solo or team projects", copy: "Work alone or as a team of three or four — common for final year main projects." },
];

const FAQS: FaqItem[] = [
  {
    q: "Do you help KTU students with final year and mini projects?",
    a: "Yes. We work with B.Tech students of APJ Abdul Kalam Technological University (KTU) and other universities in Kerala on mini projects and final year main projects — from choosing a topic and writing the abstract to the final report, demo and viva.",
  },
  {
    q: "Where is Tenzok located?",
    a: "Our team is based at Infopark, Kakkanad in Kochi, one of Kerala's largest IT parks. Students across Kerala work with us online, and students near Kochi can also meet us in person.",
  },
  {
    q: "Do you work with students outside Kochi?",
    a: `Yes. We support students from all 14 districts of Kerala — ${KERALA_DISTRICTS.join(", ")} — through online sessions and WhatsApp.`,
  },
  {
    q: "Which branches do you support?",
    a: "Computer Science, IT, AI and Data Science, Electronics and Communication, and Electrical and Electronics — covering software, machine learning, IoT, VLSI, robotics and power electronics projects.",
  },
  {
    q: "Will I understand the project well enough for the viva?",
    a: "That is the point of how we work. We build the project with you, not for you: you write and run the code with our guidance, and we prepare you for the questions examiners typically ask about your design choices.",
  },
  {
    q: "What is the difference between a mini project and a main project?",
    a: "A mini project is shorter and focused on one clear feature or technique. The final year main project is larger: a full system with design documentation, a working demo, a detailed report and usually several reviews before the final viva. Your department's scheme sets the exact format.",
  },
  {
    q: "Can I bring my own project idea?",
    a: "Yes. Bring your own idea or the problem statement your department gave you. We help you narrow the scope so it is unique, achievable in your timeline and strong enough for evaluation.",
  },
];

export default function FinalYearProjectsKeralaPage() {
  return (
    <main id="main" tabIndex={-1} className="bg-surface">
      <JsonLd
        schema={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Student Projects", path: "/projects" },
            { name: "Final Year Projects in Kerala", path: PATH },
          ]),
          localBusinessSchema(PATH, DESCRIPTION),
          faqSchema(FAQS),
          itemListSchema(
            "Final year project ideas for KTU students",
            ALL_IDEAS.map((idea) => ({ name: idea.title, path: `/projects/${idea.domain}` })),
          ),
        ]}
      />

      <PageHero
        eyebrow="Kerala · KTU · Kochi"
        title={
          <>
            Final year projects for{" "}
            <span className="gradient-text">KTU students in Kerala.</span>
          </>
        }
        copy="Unique mini and major project ideas for Computer Science, IT, ECE and EEE — built with you by working engineers at Infopark, Kochi, one of Kerala's largest IT hubs, and supported online across every district of Kerala."
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <ButtonLink href="/contact" size="lg">
            Discuss your project
          </ButtonLink>
          <ButtonLink href="#ideas" variant="secondary" size="lg">
            See project ideas
          </ButtonLink>
        </div>
      </PageHero>

      {/* How we work with Kerala students */}
      <Section bordered>
        <SectionHeading
          eyebrow="How we work"
          title={
            <>
              In Kochi or online, <span className="gradient-text">wherever you study.</span>
            </>
          }
          copy="Whether your college is in Thiruvananthapuram, Thrissur, Kozhikode or right here in Ernakulam, you get the same team, the same reviews and the same standard."
        />
        <div className="mobile-rail mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {WAYS.map(({ icon: Icon, title, copy }, i) => (
            <Reveal key={title} delay={i * 60} className="h-full">
              <article className="h-full rounded-2xl border border-line bg-surface-raised p-5">
                <Icon size={20} className="text-accent" />
                <h2 className="mt-4 text-lg text-ink">{title}</h2>
                <p className="mt-2 text-sm leading-6 text-ink-muted">{copy}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Ideas */}
      <Section id="ideas" bordered>
        <SectionHeading
          eyebrow="Unique project ideas"
          title={
            <>
              {ALL_IDEAS.length} ideas that{" "}
              <span className="gradient-text">stand out in a review.</span>
            </>
          }
          copy="Many of these solve problems specific to Kerala — the monsoon, Malayalam, local transport and farming. A local problem is easier to justify, easier to demo and harder to copy."
        />

        <div className="mt-8 space-y-10">
          {IDEA_GROUPS.map((group) => (
            <div key={group.branch}>
              <h3 className="flex items-center gap-3 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-ink-muted">
                <span aria-hidden className="h-1.5 w-1.5 bg-accent" />
                {group.branch}
              </h3>
              <ul className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {group.ideas.map((idea) => (
                  <li key={idea.title}>
                    <Link
                      href={`/projects/${idea.domain}`}
                      className="group flex h-full flex-col rounded-xl border border-line bg-surface-raised p-5 transition-colors hover:border-ink"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="rounded-full border border-line px-2.5 py-0.5 text-[11px] font-medium text-ink-muted">
                          {idea.level} project
                        </span>
                        <ArrowUpRight
                          size={15}
                          className="text-ink-subtle transition-colors group-hover:text-accent"
                        />
                      </div>
                      <span className="mt-4 font-display text-lg leading-snug text-ink">
                        {idea.title}
                      </span>
                      <span className="mt-1.5 flex-1 text-sm leading-6 text-ink-muted">
                        {idea.copy}
                      </span>
                      <span className="mt-4 font-mono text-[11px] uppercase tracking-[0.12em] text-ink-subtle">
                        {idea.domainName}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p className="mt-8 text-sm text-ink-muted">
          Want more? Browse{" "}
          <Link href="/projects" className="font-medium text-ink underline decoration-line-strong underline-offset-4 hover:decoration-accent">
            every mini and major project brief
          </Link>{" "}
          or read our{" "}
          <Link href="/blogs/unique-ktu-final-year-project-ideas" className="font-medium text-ink underline decoration-line-strong underline-offset-4 hover:decoration-accent">
            guide to choosing a unique final year project
          </Link>
          .
        </p>
      </Section>

      {/* Process */}
      <Section bordered>
        <SectionHeading
          eyebrow="From topic to viva"
          title={
            <>
              Planned around how{" "}
              <span className="gradient-text">projects are evaluated.</span>
            </>
          }
          copy="Final year projects are usually assessed in stages — an approved topic, interim reviews, a report and a final viva. We plan the work around those checkpoints."
        />
        <ol className="mt-8 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, i) => (
            <li key={step.title} className="bg-surface-raised p-5 sm:p-6">
              <span className="font-mono text-xs text-accent">0{i + 1}</span>
              <h3 className="mt-3 text-lg text-ink">{step.title}</h3>
              <p className="mt-2 text-sm leading-6 text-ink-muted">{step.copy}</p>
            </li>
          ))}
        </ol>
      </Section>

      {/* Districts */}
      <Section bordered>
        <SectionHeading
          eyebrow="Across Kerala"
          title={
            <>
              Students from <span className="gradient-text">all 14 districts.</span>
            </>
          }
          copy="We work with engineering students wherever their college is — online from anywhere in Kerala, and in person in Kochi."
        />
        <ul className="mt-8 flex flex-wrap gap-2">
          {KERALA_DISTRICTS.map((d) => (
            <li
              key={d}
              className="rounded-full border border-line bg-surface-raised px-3.5 py-1.5 text-sm text-ink-muted"
            >
              {d}
            </li>
          ))}
        </ul>
      </Section>

      {/* FAQ */}
      <Section bordered>
        <SectionHeading
          eyebrow="Questions"
          title={
            <>
              KTU project help, <span className="gradient-text">answered.</span>
            </>
          }
        />
        <div className="mt-8">
          <FaqList items={FAQS} />
        </div>
      </Section>

      <CtaFooter />
    </main>
  );
}
