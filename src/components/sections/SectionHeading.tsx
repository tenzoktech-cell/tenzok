import type { ReactNode } from "react";
import { Eyebrow } from "../ui/Section";
import Reveal from "./Reveal";

interface SectionHeadingProps {
  eyebrow: string;
  title: ReactNode;
  copy?: string;
  align?: "left" | "center";
  /** Smaller heading for inner pages. */
  compact?: boolean;
}

export default function SectionHeading({
  eyebrow,
  title,
  copy,
  align = "left",
  compact = true,
}: SectionHeadingProps) {
  const centered = align === "center";
  return (
    <Reveal className={centered ? "flex flex-col items-center text-center" : ""}>
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2
        className={`text-balance max-w-3xl leading-[1.08] text-ink ${
          compact
            ? "mt-4 text-2xl sm:text-3xl md:text-[2.5rem]"
            : "mt-6 text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem]"
        }`}
      >
        {title}
      </h2>
      {copy && (
        <p
          className={`max-w-2xl text-base leading-7 text-ink-muted ${
            compact ? "mt-4" : "mt-6 sm:text-lg"
          }`}
        >
          {copy}
        </p>
      )}
    </Reveal>
  );
}
