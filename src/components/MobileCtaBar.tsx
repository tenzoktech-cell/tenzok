"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight } from "lucide-react";

/** Pages where a "start a project" prompt would be noise or redundant. */
const HIDDEN_ON = ["/contact", "/login", "/signup", "/profile", "/admin"];

/** Phone-only bottom bar keeping the one primary action within thumb reach. */
export default function MobileCtaBar() {
  const pathname = usePathname() ?? "/";
  if (HIDDEN_ON.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
    return null;
  }

  return (
    <>
      {/* Spacer so the bar never covers the end of the footer. */}
      <div aria-hidden className="h-16 md:hidden" />
      <div className="fixed inset-x-0 bottom-0 z-[80] border-t border-line bg-surface/95 px-4 py-2.5 backdrop-blur md:hidden">
        <Link
          href="/contact"
          className="flex min-h-11 w-full items-center justify-center gap-2 rounded-md bg-accent text-sm font-medium text-accent-ink transition-colors hover:bg-accent-strong"
        >
          Start your project
          <ArrowRight size={16} />
        </Link>
      </div>
    </>
  );
}
