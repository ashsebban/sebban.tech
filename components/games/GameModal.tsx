"use client";

import { useEffect } from "react";

interface GameModalProps {
  title: string;
  src: string;
  onClose: () => void;
}

export default function GameModal({ title, src, onClose }: GameModalProps) {
  // Close on ESC
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    // Prevent body scroll while modal is open
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.85)", backdropFilter: "blur(4px)" }}
    >
      {/* Backdrop click to close */}
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />

      {/* Modal panel */}
      <div className="relative z-10 flex flex-col rounded-xl border border-border bg-card overflow-hidden shadow-2xl w-full max-w-[1400px]">
        {/* Title bar */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-border">
          <span className="text-sm font-medium text-foreground">{title}</span>
          <div className="flex items-center gap-3">
            <a
              href={src}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-muted hover:text-foreground transition-colors"
            >
              Open
            </a>
            <button
              onClick={onClose}
              className="text-muted hover:text-foreground transition-colors text-xl leading-none"
              aria-label="Close"
            >
              ×
            </button>
          </div>
        </div>

        {/* Game iframe */}
        <iframe
          src={src}
          title={title}
          className="w-full"
          style={{ height: "700px", border: "none" }}
          sandbox="allow-scripts allow-same-origin allow-downloads"
        />
      </div>
    </div>
  );
}
