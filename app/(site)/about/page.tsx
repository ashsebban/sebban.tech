import { Metadata } from "next";
import Link from "next/link";
import FadeIn from "@/components/motion/FadeIn";
import HighlightGrid from "./_components/HighlightGrid";

export const metadata: Metadata = {
  title: "About",
  description: "Asher Sebban’s work in GTM engineering, product research, and technical prototyping.",
};

export default function AboutPage() {
  return (
    <div className="px-6 py-24">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <FadeIn>
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">About</h1>
            <p className="text-lg text-muted leading-relaxed mb-3">
              I’m a GTM engineer at HiveMQ.
            </p>
            <p className="text-base text-muted leading-relaxed">
              Before HiveMQ, I worked in UX research at Anaconda. I bring that approach to
              engineering by learning where a workflow breaks down, building a prototype,
              and testing it with the people who will use it.
            </p>
          </div>
        </FadeIn>

        {/* Highlights */}
        <HighlightGrid />

        {/* References link */}
        <FadeIn delay={0.1}>
          <div className="mb-16 p-5 rounded-xl border border-border bg-card flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-foreground mb-1">References available</p>
              <p className="text-xs text-muted">A selection of leaders, professors, and mentors I've worked with directly.</p>
            </div>
            <Link
              href="/references"
              className="flex-shrink-0 text-sm text-accent hover:text-accent/80 transition-colors"
            >
              View →
            </Link>
          </div>
        </FadeIn>

      </div>
    </div>
  );
}
