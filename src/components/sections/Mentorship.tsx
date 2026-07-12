import { Check } from "lucide-react";
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
      className={`relative flex h-full flex-col rounded-3xl border p-7 transition-all duration-300 hover:-translate-y-1.5 ${
        track.featured
          ? "border-[#e8702a]/40 bg-[#e8702a]/[0.06] hover:shadow-2xl hover:shadow-[#e8702a]/15"
          : "border-white/10 bg-white/[0.04] hover:border-white/20 hover:shadow-2xl hover:shadow-black/60"
      }`}
    >
      {track.featured && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#e8702a] px-3.5 py-1 text-[11px] font-medium text-white">
          Most chosen
        </span>
      )}
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="font-playfair text-2xl italic text-white">{track.name}</h3>
        <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] text-white/60">
          {track.duration}
        </span>
      </div>
      <p className="mt-1.5 text-sm text-white/50">{track.audience}</p>

      <ul className="mt-6 flex flex-col gap-3">
        {track.points.map((point) => (
          <li key={point} className="flex items-start gap-2.5 text-sm leading-relaxed text-white/70">
            <Check size={15} className="mt-0.5 shrink-0 text-[#e8702a]" />
            {point}
          </li>
        ))}
      </ul>

      <a
        href="#contact"
        className={`mt-8 inline-flex items-center justify-center rounded-full px-6 py-2.5 text-sm font-medium transition-all hover:scale-[1.02] active:scale-95 ${
          track.featured
            ? "bg-[#e8702a] text-white hover:bg-[#d2611f] hover:shadow-lg hover:shadow-[#e8702a]/30"
            : "border border-white/20 bg-white/5 text-white/80 hover:bg-white/10 hover:text-white"
        }`}
      >
        Join the {track.name} track
      </a>
    </article>
  );
}

export default function Mentorship() {
  return (
    <section
      id="mentorship"
      className="relative scroll-mt-20 overflow-hidden border-t border-white/5 bg-[#050505] py-24 sm:py-32"
    >
      <div className="pointer-events-none absolute -bottom-40 left-1/2 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-[#e8702a]/[0.06] blur-[130px]" />

      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading
          align="center"
          eyebrow="Mentorship"
          title={
            <>
              Tracks that make you{" "}
              <span className="font-playfair italic text-[#e8702a]">industry-ready.</span>
            </>
          }
          copy="Code reviews, architecture, deployment, and soft skills — taught on real work, not slide decks. Pick the track that matches where you are."
        />

        <div className="mt-14 grid items-stretch gap-5 md:grid-cols-3">
          {TRACKS.map((track, i) => (
            <Reveal key={track.name} delay={i * 100} className="h-full">
              <TrackCard track={track} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
