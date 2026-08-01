import type { CSSProperties, ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Extra transition delay in ms, for staggering siblings. */
  delay?: number;
}

/** Fades content up once it scrolls into view. Animates only the first time. */
export default function Reveal({ children, className = "", delay = 0 }: RevealProps) {
  const style: CSSProperties | undefined = delay
    ? { transitionDelay: `${delay}ms` }
    : undefined;

  return (
    <div
      style={style}
      className={className}
    >
      {children}
    </div>
  );
}
