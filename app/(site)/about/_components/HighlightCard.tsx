import { useId } from "react";
import FadeIn from "@/components/motion/FadeIn";
import { AboutHighlight } from "@/lib/types";

interface HighlightCardProps {
  highlight: AboutHighlight;
  index: number;
  isFlipped: boolean;
  onFlip: () => void;
}

export default function HighlightCard({ highlight, index, isFlipped, onFlip }: HighlightCardProps) {
  const detailId = useId();
  return (
    <FadeIn delay={index * 0.07}>
      <article className="h-full rounded-xl border border-border bg-card p-5">
        <p className="text-sm uppercase tracking-wide text-muted">{highlight.label}</p>
        <h2 className="mt-3 text-2xl font-bold leading-tight">{highlight.value}</h2>
        <button type="button" onClick={onFlip} aria-expanded={isFlipped} aria-controls={detailId} className="mt-3 flex min-h-11 items-center text-sm font-medium text-accent">{isFlipped ? "Show less" : "Read more"}</button>
        <p id={detailId} hidden={!isFlipped} className="mt-2 text-base leading-relaxed text-foreground/80">{highlight.detail}</p>
      </article>
    </FadeIn>
  );
}
