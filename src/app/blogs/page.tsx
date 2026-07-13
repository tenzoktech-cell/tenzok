import type { Metadata } from "next";
import { PenTool } from "lucide-react";
import ComingSoon from "@/components/ComingSoon";

export const metadata: Metadata = {
  title: "Blogs — Tenzok",
  description:
    "Engineering breakdowns, launch stories, and mentorship playbooks from the Tenzok team — publishing soon.",
};

export default function BlogsPage() {
  return (
    <ComingSoon
      icon={PenTool}
      name="Blogs"
      headline={{ plain: "Notes from the workshop floor,", accent: "publishing soon." }}
      copy="Engineering breakdowns, launch stories, and mentorship playbooks — written the way we work: specific, honest, no fluff. The first posts are being drafted right now."
      notifySubject="Notify me when the blog launches"
    />
  );
}
