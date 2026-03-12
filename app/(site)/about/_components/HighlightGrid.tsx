"use client";

import { useState } from "react";
import { ABOUT_HIGHLIGHTS } from "@/lib/constants";
import HighlightCard from "./HighlightCard";

export default function HighlightGrid() {
  const [openLabel, setOpenLabel] = useState<string | null>(null);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-16">
      {ABOUT_HIGHLIGHTS.map((h, i) => (
        <HighlightCard
          key={h.label}
          highlight={h}
          index={i}
          isFlipped={openLabel === h.label}
          onFlip={() => setOpenLabel(openLabel === h.label ? null : h.label)}
        />
      ))}
    </div>
  );
}
