"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { WorkPillar } from "@/lib/types";

interface Props {
  pillars: WorkPillar[];
  onPreview?: () => void;
}

export default function ImpactTabs({ pillars, onPreview }: Props) {
  const [active, setActive] = useState(0);
  const item = pillars[active];

  function switchTab(i: number) {
    if (i === active) return;
    setActive(i);
  }

  return (
    <div>
      {/* Tab strip */}
      <div className="flex flex-wrap justify-center border-b border-border">
        {pillars.map((p, i) => (
          <button
            key={p.capability}
            onClick={() => switchTab(i)}
            className={`px-5 py-3 text-sm font-medium transition-colors duration-150 border-b-2 -mb-px whitespace-nowrap ${
              active === i
                ? "text-foreground border-accent"
                : "text-muted border-transparent hover:text-foreground hover:border-border"
            }`}
          >
            {p.capability}
          </button>
        ))}
      </div>

      {/* Tiles */}
      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="pt-6 pb-2 min-h-[120px]"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {item.examples.map((example, i) => {
              const tile = (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: i * 0.07, ease: [0.21, 0.47, 0.32, 0.98] }}
                  className="p-5 rounded-xl border border-border bg-card h-full transition-colors duration-150 hover:border-accent/30"
                >
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-foreground">{example.title}</span>
                    {example.preview && (
                      <span className="text-xs text-accent font-medium">Preview →</span>
                    )}
                  </div>
                  <p className="text-xs text-muted leading-relaxed mt-1.5">{example.description}</p>
                </motion.div>
              );

              if (example.preview && onPreview) {
                return (
                  <button
                    key={example.title}
                    onClick={onPreview}
                    className="text-left hover:border-accent/50 rounded-lg transition-colors h-full"
                  >
                    {tile}
                  </button>
                );
              }

              if (example.href) {
                return (
                  <a
                    key={example.title}
                    href={example.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:border-accent/50 rounded-lg transition-colors h-full"
                  >
                    {tile}
                  </a>
                );
              }

              return <div key={example.title}>{tile}</div>;
            })}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
