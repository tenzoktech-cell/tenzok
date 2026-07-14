import {
  Briefcase,
  Building2,
  ChartLine,
  ClipboardCheck,
  Cloud,
  Code2,
  Compass,
  FileText,
  GitBranch,
  GraduationCap,
  LayoutTemplate,
  LifeBuoy,
  Mail,
  Megaphone,
  MessageSquare,
  PenTool,
  Rocket,
  Search,
  ShieldCheck,
  Sparkles,
  Store,
  Target,
  TrendingUp,
  Trophy,
  Users,
  type LucideIcon,
} from "lucide-react";

export interface ServiceStep {
  title: string;
  desc: string;
  duration: string;
}

export interface ServiceStat {
  value: string;
  label: string;
}

export interface ServiceDeliverable {
  icon: LucideIcon;
  title: string;
  desc: string;
}

export interface Service {
  slug: string;
  name: string;
  icon: LucideIcon;
  audience: string;
  headline: { plain: string; accent: string };
  intro: string;
  stats: ServiceStat[];
  /** The client journey rendered by the process status bar. */
  steps: ServiceStep[];
  /** The persuasive "big idea" section. */
  big: {
    eyebrow: string;
    headline: { plain: string; accent: string };
    copy: string;
    stat: ServiceStat;
    points: string[];
  };
  deliverables: ServiceDeliverable[];
  ctaLine: string;
}

export const SERVICES: Service[] = [
  {
    slug: "mentorship",
    name: "Mentorship",
    icon: GraduationCap,
    audience: "For students & career switchers",
    headline: {
      plain: "Guidance that turns students into",
      accent: "working engineers.",
    },
    intro:
      "Weekly 1:1s with working engineers, real code reviews, and a roadmap built around where you actually are — so every week ends with something shipped, not just watched.",
    stats: [
      { value: "1:1", label: "Live weekly sessions with a working engineer" },
      { value: "Live", label: "Every session — nothing is pre-recorded" },
      { value: "3", label: "Tracks: Foundation, Builder, Career" },
    ],
    steps: [
      {
        title: "Skill Audit",
        desc: "A free discovery call where a mentor maps what you know, what's missing, and where you want to land.",
        duration: "Day 1",
      },
      {
        title: "Track Match",
        desc: "We place you on Foundation, Builder, or Career and hand you a week-by-week roadmap with clear milestones.",
        duration: "Week 1",
      },
      {
        title: "Build & Review Loop",
        desc: "You ship code every week; your mentor reviews it line by line, the way a senior reviews a colleague.",
        duration: "Weeks 2–6",
      },
      {
        title: "Capstone Brief",
        desc: "You take on a real industry brief — architecture, deadlines, and demo days included.",
        duration: "Weeks 6–10",
      },
      {
        title: "Portfolio Polish",
        desc: "GitHub, resume, LinkedIn, and project write-ups reworked until they pass a hiring manager's 30-second scan.",
        duration: "Weeks 10–11",
      },
      {
        title: "Interviews & Referrals",
        desc: "Mock interviews with engineers, then warm referrals into the Tenzok partner network.",
        duration: "Week 12+",
      },
    ],
    big: {
      eyebrow: "Why it works",
      headline: { plain: "Courses sell videos.", accent: "We sell repetitions." },
      copy: "Nobody becomes an engineer by watching. Our mentees write code every single week and get it torn apart — kindly, precisely — by someone who does this for a living. That loop, repeated for twelve weeks, is the entire secret. It's how you walk into interviews talking about trade-offs you actually made, not tutorials you once followed.",
      stat: {
        value: "12 wks",
        label: "from your first skill audit to a shipped project you can defend in any interview",
      },
      points: [
        "Every session is 1:1 — never a recorded webinar",
        "Mentors are hands-on engineers, not trainers",
        "Roadmaps rebuilt every two weeks around your progress",
        "You leave with shipped proof, not a PDF certificate",
      ],
    },
    deliverables: [
      {
        icon: ClipboardCheck,
        title: "Personal roadmap",
        desc: "A week-by-week plan built from your skill audit and rebuilt as you grow.",
      },
      {
        icon: Users,
        title: "Weekly 1:1 sessions",
        desc: "A dedicated mentor who knows your code, your gaps, and your goal.",
      },
      {
        icon: GitBranch,
        title: "Real code reviews",
        desc: "Line-by-line feedback that builds the habits teams actually hire for.",
      },
      {
        icon: Trophy,
        title: "Industry capstone",
        desc: "A real brief, shipped and deployed — the centrepiece of your portfolio.",
      },
      {
        icon: FileText,
        title: "Portfolio & resume polish",
        desc: "Write-ups, GitHub, and resume reworked to pass a 30-second scan.",
      },
      {
        icon: Briefcase,
        title: "Referral network",
        desc: "Warm introductions into companies that already trust Tenzok graduates.",
      },
    ],
    ctaLine: "Book a free skill audit and see exactly where twelve weeks can take you.",
  },
  {
    slug: "student-projects",
    name: "Student Projects",
    icon: Code2,
    audience: "For final-year & capstone teams",
    headline: {
      plain: "Projects you can",
      accent: "defend, deploy, and hire with.",
    },
    intro:
      "We architect and build your academic project with you — every decision explained — so you walk into your viva knowing the why behind every line, with a live URL to prove it.",
    stats: [
      { value: "48h", label: "From problem statement to a scoped plan" },
      { value: "Live", label: "Deployed to a real URL, with documentation" },
      { value: "Yours", label: "Full source and docs — no black-box handovers" },
    ],
    steps: [
      {
        title: "Brief & Scope Call",
        desc: "Bring your problem statement — we shape it into a scoped, achievable, genuinely impressive build.",
        duration: "Day 1",
      },
      {
        title: "Architecture Blueprint",
        desc: "Your mentor designs the system with you: stack choices, data model, and diagrams your examiners will love.",
        duration: "Week 1",
      },
      {
        title: "Guided Build Sprints",
        desc: "We build together in weekly sprints — you code, we unblock, and every decision gets explained.",
        duration: "Weeks 2–6",
      },
      {
        title: "Review & Hardening",
        desc: "Testing, edge cases, and security passes so the demo doesn't crack under questioning.",
        duration: "Week 7",
      },
      {
        title: "Deploy & Document",
        desc: "Live deployment plus a report, slides, and README that read like industry work.",
        duration: "Week 8",
      },
      {
        title: "Viva Preparation",
        desc: "Mock Q&A sessions on your own codebase until no examiner question can surprise you.",
        duration: "Final week",
      },
    ],
    big: {
      eyebrow: "The Tenzok difference",
      headline: {
        plain: "You don't submit a zip file.",
        accent: "You defend a shipped product.",
      },
      copy: "Most student projects die on a laptop the day after submission. Ours go live — deployed, documented, and linked from your resume. When an examiner or interviewer asks 'why this database?' or 'what breaks at scale?', you answer from experience, because you were in the room for every decision. That's the difference between a grade and a career opener.",
      stat: {
        value: "Live",
        label: "every project ships to a real URL — no localhost screenshots, ever",
      },
      points: [
        "Live deployment, not localhost screenshots",
        "Documentation written to industry standard",
        "You understand every line — no black-box handovers",
        "Viva prep until the hard questions feel easy",
      ],
    },
    deliverables: [
      {
        icon: Compass,
        title: "Architecture blueprint",
        desc: "System design, stack choices, and diagrams — explained, not just handed over.",
      },
      {
        icon: Code2,
        title: "Reviewed codebase",
        desc: "Clean, commented source built with you through weekly guided sprints.",
      },
      {
        icon: Cloud,
        title: "Live deployment",
        desc: "Your project on a real URL with CI/CD — demo it from any device.",
      },
      {
        icon: ShieldCheck,
        title: "Hardening pass",
        desc: "Tests, edge cases, and security checks so the demo holds under pressure.",
      },
      {
        icon: FileText,
        title: "Report & slides",
        desc: "Submission-ready documentation that reads like a case study.",
      },
      {
        icon: MessageSquare,
        title: "Viva preparation",
        desc: "Mock Q&A on your own code until you can defend every choice.",
      },
    ],
    ctaLine: "Send us your problem statement — we'll reply with a scoped plan within 48 hours.",
  },
  {
    slug: "company-services",
    name: "Company Services",
    icon: Building2,
    audience: "For startups & enterprises",
    headline: {
      plain: "Senior delivery,",
      accent: "without the agency drag.",
    },
    intro:
      "Product engineering, delivery pods, modernization, and corporate training — run in weekly demo loops with documentation your team actually inherits. NDA-first, fixed scope or retainer.",
    stats: [
      { value: "NDA", label: "Signed before we hear a single detail" },
      { value: "1", label: "Named senior lead on every engagement" },
      { value: "Weekly", label: "Friday demos — no black boxes" },
    ],
    steps: [
      {
        title: "Scoping & NDA",
        desc: "A scoping call under NDA to understand the product, the constraints, and what done looks like.",
        duration: "Days 1–3",
      },
      {
        title: "Proposal & Quote",
        desc: "Fixed scope or retainer, milestones, and a named senior lead — all in writing before any work starts.",
        duration: "Week 1",
      },
      {
        title: "Sprint Zero",
        desc: "Architecture, environments, and CI/CD stood up so the first demo lands in week two, not month two.",
        duration: "Weeks 1–2",
      },
      {
        title: "Build & Demo Loop",
        desc: "Weekly sprints, Friday demos in your timezone, and a backlog you can inspect at any hour.",
        duration: "Ongoing",
      },
      {
        title: "QA & Handover",
        desc: "Hardening, documentation, and knowledge-transfer sessions so your team owns it on day one.",
        duration: "Final sprint",
      },
      {
        title: "Support & Scale",
        desc: "Post-launch SLAs, iteration sprints, or a standing delivery pod — your call.",
        duration: "After launch",
      },
    ],
    big: {
      eyebrow: "Our promise",
      headline: { plain: "No black boxes.", accent: "Ever." },
      copy: "The quiet scandal of outsourced software is that clients pay for code they can't read, hosted somewhere they can't reach, built by people they can't ask. Tenzok was built against that. Every engagement has a named senior lead, a Friday demo you can attend from any timezone, and documentation written for the team who inherits the system — yours. When we hand over, you own it completely.",
      stat: {
        value: "100%",
        label: "of engagements end with full source, docs, and a knowledge-transfer session",
      },
      points: [
        "Named senior lead on every engagement",
        "Friday demos across global time zones",
        "Fixed scope or retainer — priced in writing first",
        "Handover docs your engineers actually use",
      ],
    },
    deliverables: [
      {
        icon: Code2,
        title: "Product engineering",
        desc: "MVPs to v1 launches — web, mobile, and AI features with tests and CI/CD.",
      },
      {
        icon: Users,
        title: "Dedicated delivery pods",
        desc: "A senior lead with mentored engineers running your backlog in sprints.",
      },
      {
        icon: Cloud,
        title: "Modernization & cloud",
        desc: "Audits, refactors, and migrations without stopping the business.",
      },
      {
        icon: GraduationCap,
        title: "Corporate training",
        desc: "Campus-to-corporate pipelines that turn fresh hires into contributors.",
      },
      {
        icon: ShieldCheck,
        title: "Audits & QA",
        desc: "Security, performance, and code-quality reviews with actionable reports.",
      },
      {
        icon: LifeBuoy,
        title: "Support & SLAs",
        desc: "Post-launch retainers with response times you can put in a contract.",
      },
    ],
    ctaLine: "Book a scoping call — NDA first, written proposal within a week.",
  },
  {
    slug: "digital-marketing",
    name: "Digital Marketing",
    icon: Megaphone,
    audience: "For products, brands & portfolios",
    headline: {
      plain: "Growth that compounds,",
      accent: "not campaigns that evaporate.",
    },
    intro:
      "SEO, content engines, performance campaigns, and dashboards you can actually read — built to keep working long after the ad budget stops.",
    stats: [
      { value: "3–6 mo", label: "To compounding organic growth" },
      { value: "1", label: "Dashboard for every channel — zero jargon" },
      { value: "Weekly", label: "Plain-language performance readouts" },
    ],
    steps: [
      {
        title: "Growth Audit",
        desc: "We tear down your current funnel, traffic, and positioning and show you exactly where the leaks are.",
        duration: "Week 1",
      },
      {
        title: "Strategy & Channel Map",
        desc: "A written plan: which channels, what content, what budget, and what we expect each one to return.",
        duration: "Week 2",
      },
      {
        title: "Brand & Content Engine",
        desc: "Identity, tone, and a content system designed to compound instead of expire.",
        duration: "Weeks 3–4",
      },
      {
        title: "Campaign Launch",
        desc: "SEO, social, and performance campaigns go live with tracking wired from day one.",
        duration: "Week 5",
      },
      {
        title: "Measure & Iterate",
        desc: "Weekly readouts in plain language — we kill what underperforms and double down on what works.",
        duration: "Ongoing",
      },
      {
        title: "Scale What Works",
        desc: "Winning channels get scaled playbooks; you get a growth engine, not an invoice history.",
        duration: "Month 3+",
      },
    ],
    big: {
      eyebrow: "The big idea",
      headline: { plain: "Ads rent attention.", accent: "Content owns it." },
      copy: "An ad stops working the second you stop paying for it. A ranking article, a sharp brand, an email list — those keep selling at 3 a.m., for years. We still run performance campaigns when the math works, but we build the compounding assets first, so every month of marketing makes the next month cheaper. Most agencies are structured to do exactly the opposite.",
      stat: {
        value: "24/7",
        label: "your content keeps selling — long after the campaign budget ends",
      },
      points: [
        "Compounding assets before rented reach",
        "Plain-language reports, never vanity metrics",
        "Tracking wired before the first campaign runs",
        "We kill underperformers fast — even our own ideas",
      ],
    },
    deliverables: [
      {
        icon: Search,
        title: "SEO & content systems",
        desc: "Keyword strategy and content that climbs the rankings — and stays there.",
      },
      {
        icon: Target,
        title: "Performance campaigns",
        desc: "Paid social and search with honest, readable ROAS reporting.",
      },
      {
        icon: PenTool,
        title: "Brand identity",
        desc: "Logo, voice, and visual language that survives every channel.",
      },
      {
        icon: MessageSquare,
        title: "Social playbooks",
        desc: "Cadences and templates your team can run without us.",
      },
      {
        icon: ChartLine,
        title: "Analytics dashboards",
        desc: "One dashboard, every channel, zero jargon.",
      },
      {
        icon: Mail,
        title: "Email & CRM flows",
        desc: "Automated journeys that turn subscribers into customers.",
      },
    ],
    ctaLine: "Ask for a free growth audit — we'll show you the leaks before you spend anything on ads.",
  },
  {
    slug: "launch-support",
    name: "Launch Support",
    icon: Rocket,
    audience: "For founders & first releases",
    headline: {
      plain: "Shipping is the midpoint.",
      accent: "We stay for the landing.",
    },
    intro:
      "Landing pages, launch-day war rooms, store rollouts, and the noisy weeks after — we stay in the room until your product finds its footing.",
    stats: [
      { value: "T-30", label: "Days of structured pre-launch runway" },
      { value: "24h", label: "War-room cover on launch day" },
      { value: "30", label: "Days of post-launch iteration included" },
    ],
    steps: [
      {
        title: "Readiness Audit",
        desc: "We stress-test the product, the pitch, and the funnel against a checklist built from real launches.",
        duration: "T-30 days",
      },
      {
        title: "Positioning & Landing Page",
        desc: "A conversion-first landing page and messaging that says what you do in five seconds.",
        duration: "T-21 days",
      },
      {
        title: "Pre-Launch Buzz",
        desc: "Waitlists, teasers, and press notes queued so launch day starts with an audience, not silence.",
        duration: "T-14 days",
      },
      {
        title: "Launch-Day War Room",
        desc: "One room, all hands: monitoring, replies, hotfixes, and hourly check-ins until the spike settles.",
        duration: "Day 0",
      },
      {
        title: "Post-Launch Sprints",
        desc: "Two weeks of rapid iteration on real user feedback, while attention is at its highest.",
        duration: "Days 1–14",
      },
      {
        title: "Growth Handoff",
        desc: "A written playbook — what worked, what's next — handed to your team or our marketing pod.",
        duration: "Day 30",
      },
    ],
    big: {
      eyebrow: "Why launches fail",
      headline: {
        plain: "Products don't fail at launch.",
        accent: "They fail in the 30 days after.",
      },
      copy: "The spike is easy — everyone gets a launch-day spike. What decides a product's fate is the fortnight after: the bug filed at midnight, the review that needs answering within the hour, the onboarding step where most users quietly leave. Most teams face that fortnight exhausted and alone. Ours don't — we're in the war room on day zero and still there on day thirty, iterating while attention is highest.",
      stat: {
        value: "0–30",
        label: "days — we stay embedded through the entire critical window",
      },
      points: [
        "A war room, not a wish of good luck",
        "Hotfix and reply cover during the spike",
        "Iteration sprints while attention peaks",
        "A written growth playbook at handoff",
      ],
    },
    deliverables: [
      {
        icon: LayoutTemplate,
        title: "Conversion landing page",
        desc: "Built to explain in five seconds and convert in one visit.",
      },
      {
        icon: ClipboardCheck,
        title: "Launch playbook",
        desc: "A dated, owned, hour-by-hour plan for the two weeks around launch.",
      },
      {
        icon: Store,
        title: "Store rollouts",
        desc: "App Store, Play Store, and web listings — screenshots to review replies.",
      },
      {
        icon: Sparkles,
        title: "Product Hunt launch",
        desc: "Assets, hunter outreach, and day-of engagement handled end to end.",
      },
      {
        icon: LifeBuoy,
        title: "Launch-day war room",
        desc: "Monitoring, hotfixes, and replies with all hands in one room.",
      },
      {
        icon: TrendingUp,
        title: "Post-launch sprints",
        desc: "Two weeks of fast iteration on what real users actually do.",
      },
    ],
    ctaLine: "Tell us your target date — we'll send back a T-minus-30 launch plan.",
  },
];

export function getService(slug: string): Service | undefined {
  return SERVICES.find((service) => service.slug === slug);
}
