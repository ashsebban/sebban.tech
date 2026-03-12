"use client";

interface WhyTileProps {
  title: string;
  body: string;
  onDismiss: () => void;
}

export default function WhyTile({ title, body, onDismiss }: WhyTileProps) {
  return (
    <article className="flex h-full flex-col rounded-xl border border-white/20 bg-card p-6">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">{title}</p>
      <p className="mb-4 flex-1 text-sm leading-relaxed text-muted">{body}</p>
      <div className="mt-auto">
        <button
          type="button"
          onClick={onDismiss}
          className="flex items-center gap-1.5 text-sm text-accent transition-colors hover:text-accent-hover"
        >
          Close
        </button>
      </div>
    </article>
  );
}
