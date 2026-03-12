"use client";

interface WhyTileProps {
  title: string;
  body: string;
  onDismiss: () => void;
}

export default function WhyTile({ title, body, onDismiss }: WhyTileProps) {
  return (
    <article className="flex h-full flex-col rounded-xl border border-accent/40 bg-card p-6">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-accent">{title}</p>
      <p className="mb-4 flex-1 text-xs leading-relaxed text-foreground/70">{body}</p>
      <div className="mt-auto">
        <button
          type="button"
          onClick={onDismiss}
          className="rounded-full border border-white/30 px-2.5 py-0.5 text-xs text-white/60 hover:border-white/60 hover:text-white/90 transition-colors"
        >
          Close
        </button>
      </div>
    </article>
  );
}
