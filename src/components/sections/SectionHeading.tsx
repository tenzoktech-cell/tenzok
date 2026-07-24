import type { ReactNode } from "react";
import { Eyebrow } from "../ui/Section";
import Reveal from "./Reveal";

interface SectionHeadingProps {
  eyebrow: string;
  title: ReactNode;
  copy?: string;
  align?: "left" | "center";
}

export default function SectionHeading({
  eyebrow,
  title,
  copy,
  align = "left",
}: SectionHeadingProps) {
  const centered = align === "center";
  return (
    <Reveal className={centered ? "flex flex-col items-center text-center" : ""}>
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className="text-balance mt-6 max-w-3xl text-3xl leading-[1.08] text-ink sm:text-4xl md:text-5xl lg:text-[3.5rem]">
        {title}
      </h2>
      {copy && (
        <p className="mt-6 max-w-2xl text-base leading-7 text-ink-muted sm:text-lg">
          {copy}
        </p>
      )}
    </Reveal>
  );
}
