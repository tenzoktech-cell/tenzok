import type { Metadata } from "next";
import { MessageSquare } from "lucide-react";
import ComingSoon from "@/components/ComingSoon";

export const metadata: Metadata = {
  title: "Feedbacks",
  description:
    "Real words from real Tenzok students and clients — coming soon. We'd rather show you genuine feedback than invented praise.",
};

export default function FeedbacksPage() {
  return (
    <ComingSoon
      icon={MessageSquare}
      name="Feedbacks"
      headline={{ plain: "Real words,", accent: "worth the wait." }}
      copy="We're collecting feedback from our first cohort of students and clients — and we'd rather show you nothing than show you something invented. Genuine stories, names attached, coming here soon."
    />
  );
}
