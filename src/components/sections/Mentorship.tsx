import { Check } from "lucide-react";
import StartJourneyButton from "../StartJourneyModal";
import { Section } from "../ui/Section";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

interface Track {
  name: string;
  audience: string;
  duration: string;
  featured?: boolean;
  points: string[];
}

const TRACKS: Track[] = [
  {
    name: "Foundation",
    audience: "For students starting out",
    duration: "8 weeks",
    points: [
      "Git, code review culture & clean-code habits",
      "Core language mastery through weekly drills",
      "Your first deployed, publicly-linked project",
      "1:1 mentor check-ins every week",
    ],
  },
  {
    name: "Builder",
    audience: "For final-year students & switchers",
    duration: "12 weeks",
    featured: true,
    points: [
      "System design & architecture reviews",
      "An industry-grade capstone from a real brief",
      "Cloud deployment, CI/CD & monitoring",
      "Portfolio, GitHub & documentation polish",
    ],
  },
  {
    name: "Career",
    audience: "For job-seekers & fresh graduates",
    duration: "6 weeks",
    points: [
      "Mock interviews with working engineers",
      "Resume, LinkedIn & portfolio teardowns",
      "Client communication & soft skills",
      "Referrals into the Tenzok partner network",
    ],
  },
];

function TrackCard({ track }: { track: Track }) {
  return (
    <article
      className={`relative flex h-full flex-col rounded-2xl border p-6 ${
        track.featured
          ? "border-accent/40 bg-accent/[0.06]"
          : "border-line bg-surface-raised"
      }`}
    >
      {track.featured && (
        <span className="absolute -top-3 left-6 rounded-md bg-accent px-2 py-1 text-xs font-medium text-accent-ink">
          Most chosen
        </span>
      )}
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="text-xl text-ink">{track.name}</h3>
        <span className="rounded-md border border-line px-2 py-1 text-xs text-ink-subtle">
          {track.duration}
        </span>
      </div>
      <p className="mt-2 text-sm text-ink-subtle">{track.audience}</p>

      <ul className="mt-6 flex flex-1 flex-col gap-3">
        {track.points.map((point) => (
          <li
            key={point}
            className="flex items-start gap-3 text-sm leading-relaxed text-ink-muted"
          >
            <Check size={15} className="mt-1 shrink-0 text-accent" />
            {point}
          </li>
        ))}
      </ul>

      <StartJourneyButton
        label={`Join the ${track.name} track`}
        defaultService="mentorship"
        variant={track.featured ? "primary" : "secondary"}
        className="mt-8 w-full"
      />
    </article>
  );
}

export default function Mentorship() {
  return (
    <Section id="mentorship" bordered>
      <SectionHeading
        align="center"
        eyebrow="Mentorship"
        title={
          <>
            Tracks that make you{" "}
            <span className="font-display italic text-accent">industry-ready.</span>
          </>
        }
        copy="Code reviews, architecture, deployment, and the soft skills nobody teaches — on real work, not slide decks. Pick the track that matches where you actually are."
      />

      <div className="mt-16 grid items-stretch gap-6 md:grid-cols-3">
        {TRACKS.map((track, i) => (
          <Reveal key={track.name} delay={i * 90} className="h-full">
            <TrackCard track={track} />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
