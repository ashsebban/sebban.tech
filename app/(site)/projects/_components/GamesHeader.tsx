"use client";

import { useState, useRef, useEffect } from "react";

export default function GamesHeader() {
  const [open, setOpen] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <div className="mb-8">
      <div className="flex items-center gap-3">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted">Games</h2>
        <div className="relative" ref={popupRef}>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="rounded-full border border-white/30 px-2.5 py-0.5 text-xs text-white/60 hover:border-white/60 hover:text-white/90 transition-colors"
          >
            Why I do this
          </button>
          {open && (
            <div className="absolute left-0 top-8 z-50 w-72 rounded-xl border border-white/10 bg-[#111] p-4 shadow-xl">
              <p className="text-sm text-white/80 leading-relaxed">
                Games are my playground for practicing product philosophy. Reading{" "}
                <span className="text-white font-medium">Atomic Habits</span> changed how I think
                about products — less as objects, more as behaviors. Every game I build, I'm asking
                the same questions I ask about any product: Is it obvious? Is it simple? Is it
                attractive? Is it satisfying enough to come back to?
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
