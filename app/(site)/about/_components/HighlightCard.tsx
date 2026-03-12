"use client";

import { useState } from "react";
import FadeIn from "@/components/motion/FadeIn";
import { AboutHighlight } from "@/lib/types";

interface HighlightCardProps {
  highlight: AboutHighlight;
  index: number;
}

export default function HighlightCard({ highlight, index }: HighlightCardProps) {
  const [flipped, setFlipped] = useState(false);

  return (
    <FadeIn delay={index * 0.07}>
      <div
        onClick={() => setFlipped((v) => !v)}
        className="relative h-44 cursor-pointer transition-transform duration-300 hover:-translate-y-1"
        style={{ perspective: "1000px" }}
      >
        <div
          className="relative w-full h-full"
          style={{
            transformStyle: "preserve-3d",
            transition: "transform 0.45s cubic-bezier(0.4, 0, 0.2, 1)",
            transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
          }}
        >
          {/* Front */}
          <div
            className="absolute inset-0 p-5 rounded-xl border border-border bg-card flex flex-col justify-between transition-colors duration-300 hover:border-accent/50"
            style={{ backfaceVisibility: "hidden" }}
          >
            <p className="text-xs text-muted uppercase tracking-wide">{highlight.label}</p>
            <p className="text-2xl font-bold text-foreground leading-tight">{highlight.value}</p>
            <div className="flex items-center gap-1.5">
              <span className="inline-block w-1 h-1 rounded-full bg-accent/60" />
              <span className="inline-block w-1 h-1 rounded-full bg-accent/40" />
              <span className="inline-block w-1 h-1 rounded-full bg-accent/20" />
            </div>
          </div>

          {/* Back */}
          <div
            className="absolute inset-0 p-5 rounded-xl border border-accent/30 bg-card flex flex-col justify-between"
            style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
          >
            <p className="text-xs text-accent uppercase tracking-wide">{highlight.label}</p>
            <p className="text-xs text-foreground/80 leading-relaxed">{highlight.detail}</p>
            <div className="flex items-center gap-1.5">
              <span className="inline-block w-1 h-1 rounded-full bg-accent/20" />
              <span className="inline-block w-1 h-1 rounded-full bg-accent/40" />
              <span className="inline-block w-1 h-1 rounded-full bg-accent/60" />
            </div>
          </div>
        </div>
      </div>
    </FadeIn>
  );
}
