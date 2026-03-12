import { Metadata } from "next";
import Link from "next/link";
import { ABOUT_HIGHLIGHTS } from "@/lib/constants";
import FadeIn from "@/components/motion/FadeIn";
import HighlightCard from "./_components/HighlightCard";

export const metadata: Metadata = {
  title: "About",
  description: "Get to know Asher Sebban: product leader, systems builder, curious human.",
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
              I build systems that help teams move faster, and I make tech feel simple for the people who use them.
            </p>
            <p className="text-base text-muted leading-relaxed">
              My background spans product research, operations, and technical prototyping.
              I'm most useful when a problem is messy: unclear workflows, missing tools,
              or decisions that need real evidence. That's the environment where I tend to
              build something that makes the team around me more effective.
            </p>
          </div>
        </FadeIn>

        {/* Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-16">
          {ABOUT_HIGHLIGHTS.map((h, i) => (
            <HighlightCard key={h.label} highlight={h} index={i} />
          ))}
        </div>

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

        {/* Video section */}
        <FadeIn delay={0.1}>
          <div className="mb-4 flex items-center gap-3">
            <h2 className="text-2xl font-bold">Introduction Video</h2>
            <span className="px-2.5 py-1 text-xs rounded-full border border-dashed border-border text-muted uppercase tracking-wide">
              Coming Soon
            </span>
          </div>
          <p className="text-sm text-muted mb-6">
            A real intro is on the way. In the meantime, here's Rick Astley.
          </p>

          <div className="rounded-xl overflow-hidden border border-border">
            <div className="aspect-video">
              <iframe
                src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                title="Introduction Video"
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </FadeIn>

      </div>
    </div>
  );
}
