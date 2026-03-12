"use client";

interface WhyTileProps {
  title: string;
  body: string;
  accentClass: string;
  onDismiss: () => void;
}

export default function WhyTile({ title, body, accentClass, onDismiss }: WhyTileProps) {
  return (
    <article className={`relative flex h-full flex-col rounded-xl border p-6 ${accentClass}`}>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss"
        className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full text-white/40 transition-colors hover:text-white/80"
      >
        ✕
      </button>
      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-white/50">{title}</p>
      <p className="flex-1 text-sm leading-relaxed text-white/80">{body}</p>
    </article>
  );
}
