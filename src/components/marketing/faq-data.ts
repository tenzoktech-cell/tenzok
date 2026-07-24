import type { FaqItem } from "./FaqList";

/** Answers are derived from existing service, project, and contact content. */
export const GENERAL_FAQS: readonly FaqItem[] = [
  {
    q: "Who does Tenzok work with?",
    a: "Tenzok works with students and capstone teams, career switchers, startups, product teams, companies, founders, and local businesses. The engagement changes with the audience, but the standard stays the same: a written scope, visible progress, reviewed work, and a clear handover.",
  },
  {
    q: "Can I bring my own project idea or problem statement?",
    a: "Yes. You can choose one of the existing project briefs, bring the problem statement your department gave you, or share a product idea that needs shaping. Tenzok starts by narrowing the scope and choosing an appropriate architecture before the build begins.",
  },
  {
    q: "What is the difference between a mini project and a major project?",
    a: "A mini project is a focused three-to-four-week build: narrow enough to finish and deep enough to demonstrate a real engineering decision. A major project is a ten-to-twelve-week capstone with broader architecture, documented trade-offs, deployment, and viva preparation.",
  },
  {
    q: "Will you simply hand over an academic project?",
    a: "No. Student projects are built with you. Architecture choices are explained, commits are reviewed, the system is deployed, and the reasoning is rehearsed so you can defend the work in a viva rather than present code you do not understand.",
  },
  {
    q: "What can a student-project engagement include?",
    a: "Depending on the agreed scope, it can include an architecture blueprint, a reviewed codebase, live deployment, a hardening pass, a submission-ready report and slides, and viva preparation.",
  },
  {
    q: "How do company engagements begin?",
    a: "Company work begins with scoping and, where needed, an NDA before sensitive details are discussed. Tenzok then provides a proposal and quote, runs a sprint-zero architecture phase, builds in weekly demo loops, and finishes with QA, documentation, handover, and an agreed support path.",
  },
  {
    q: "Who owns the source code and documentation?",
    a: "The client receives the agreed source, documentation, infrastructure information, and knowledge-transfer handover. The operating principle is full handover with no hidden black boxes.",
  },
  {
    q: "How quickly will Tenzok reply to an enquiry?",
    a: "The contact page promises a reply from a real person, usually within one working day. You can send a project idea, a problem statement, or simply explain where you are stuck.",
  },
] as const;
