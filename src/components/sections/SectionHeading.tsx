import type { ReactNode } from "react";
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
      <p className="flex items-center gap-2.5 text-xs font-medium uppercase tracking-[0.25em] text-[#e8702a]">
        <span className="h-px w-6 bg-[#e8702a]/60" aria-hidden />
        {eyebrow}
        {centered && <span className="h-px w-6 bg-[#e8702a]/60" aria-hidden />}
      </p>
      <h2
        className="mt-4 max-w-2xl text-4xl sm:text-5xl text-white leading-[1.05]"
        style={{ letterSpacing: "-0.04em" }}
      >
        {title}
      </h2>
      {copy && (
        <p className="mt-5 max-w-xl text-sm sm:text-base text-white/55 leading-relaxed">
          {copy}
        </p>
      )}
    </Reveal>
  );
}
