"use client";

import { useEffect, useState } from "react";

const scoreKeys: Record<string, string> = {
  "flappy-bird-rebuild": "happybird_best",
  "shape-runner-arcade": "shape-runner-best-v1",
};

export default function PersonalBest({ gameId }: { gameId: string }) {
  const key = scoreKeys[gameId];
  const [best, setBest] = useState<number | null>(null);

  useEffect(() => {
    if (!key) return;
    function readScore() {
      try {
        const value = window.localStorage.getItem(key);
        const score = Number(value);
        setBest(value !== null && Number.isSafeInteger(score) && score >= 0 ? score : null);
      } catch {
        setBest(null);
      }
    }
    readScore();
    window.addEventListener("pageshow", readScore);
    window.addEventListener("storage", readScore);
    return () => {
      window.removeEventListener("pageshow", readScore);
      window.removeEventListener("storage", readScore);
    };
  }, [key]);

  if (!key) return null;
  return <p className="mt-4 text-sm text-muted">Personal best <strong className="text-foreground">{best ?? "—"}</strong></p>;
}
