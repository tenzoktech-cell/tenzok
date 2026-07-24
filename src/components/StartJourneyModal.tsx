"use client";

import { ArrowRight } from "lucide-react";
import { ButtonLink, type ButtonSize, type ButtonVariant } from "./ui/Button";

interface StartJourneyButtonProps {
  label?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  /** Slug of the service to preselect on the contact form. */
  defaultService?: string;
}

/** A direct, low-friction CTA to the existing enquiry form. */
export default function StartJourneyButton({
  label = "Start Your Project",
  variant = "primary",
  size = "md",
  className,
  defaultService,
}: StartJourneyButtonProps) {
  const href = defaultService
    ? `/contact?service=${encodeURIComponent(defaultService)}`
    : "/contact";

  return (
    <ButtonLink href={href} variant={variant} size={size} className={className}>
      {label}
      <ArrowRight size={15} />
    </ButtonLink>
  );
}
