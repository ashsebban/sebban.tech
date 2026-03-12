"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as Si from "react-icons/si";
import FadeIn from "@/components/motion/FadeIn";
import type { ToolkitCategory } from "@/lib/types";

interface Props {
  toolkit: ToolkitCategory[];
}

const initials = (name: string) =>
  name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

export default function ToolkitSection({ toolkit }: Props) {
  const [activeCategory, setActiveCategory] = useState(toolkit[0].category);

  const tools = toolkit.find((c) => c.category === activeCategory)?.tools ?? [];

  return (
    <section className="px-6 pb-24">
      <div className="max-w-3xl mx-auto text-center">
        <FadeIn>
          <h2 className="text-3xl md:text-4xl font-bold mb-3 text-center">Toolkit</h2>
          <p className="text-sm text-muted mb-8">Tools I use regularly across research, development, and operations.</p>
        </FadeIn>

        {/* Category tabs */}
        <FadeIn delay={0.05}>
          <div className="flex gap-2 justify-center flex-wrap mb-10">
            {toolkit.map((cat) => (
              <button
                key={cat.category}
                onClick={() => setActiveCategory(cat.category)}
                className={
                  activeCategory === cat.category
                    ? "px-4 py-1.5 text-sm rounded-full bg-accent text-white transition-colors"
                    : "px-4 py-1.5 text-sm rounded-full border border-border text-muted hover:border-accent hover:text-accent transition-colors"
                }
              >
                {cat.category}
              </button>
            ))}
          </div>
        </FadeIn>

        {/* Logo circles */}
        <FadeIn delay={0.1}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2, ease: [0.21, 0.47, 0.32, 0.98] }}
              className="flex flex-wrap justify-center items-center gap-6"
            >
              {tools.map((tool, i) => {
                if (tool.separator) {
                  return <div key={tool.name} className="w-full border-t border-border my-1" />;
                }

                const IconComponent = tool.icon
                  ? (Si[tool.icon as keyof typeof Si] as React.ElementType | undefined)
                  : undefined;

                if (tool.comingSoon) {
                  return (
                    <motion.div
                      key={tool.name}
                      initial={{ opacity: 0, scale: 0.85 }}
                      animate={{ opacity: 0.4, scale: 1 }}
                      transition={{ duration: 0.2, delay: i * 0.04 }}
                      className="flex flex-col items-center gap-1.5"
                    >
                      <div className="w-12 h-12 rounded-full bg-white/5 border border-dashed border-border flex items-center justify-center">
                        {IconComponent ? (
                          <IconComponent size={22} className="text-foreground/50" />
                        ) : (
                          <span className="text-[11px] font-bold text-muted">{initials(tool.name)}</span>
                        )}
                      </div>
                      <span className="text-xs text-muted whitespace-nowrap">{tool.name}</span>
                      <span className="text-[9px] text-muted/60 -mt-1 uppercase tracking-wide">soon</span>
                    </motion.div>
                  );
                }

                return (
                  <motion.div
                    key={tool.name}
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2, delay: i * 0.04 }}
                    className="group flex flex-col items-center gap-1.5"
                  >
                    <div className="w-12 h-12 rounded-full bg-white/5 border border-border flex items-center justify-center transition-all duration-150 group-hover:bg-white/10 group-hover:border-white/20 group-hover:scale-110">
                      {tool.emoji ? (
                        <span className="text-xl leading-none">{tool.emoji}</span>
                      ) : IconComponent ? (
                        <IconComponent size={22} className="text-foreground/70 group-hover:text-white transition-colors duration-150" />
                      ) : (
                        <span className="text-[11px] font-bold text-muted group-hover:text-white transition-colors duration-150">
                          {initials(tool.name)}
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-muted group-hover:text-foreground transition-colors duration-150 whitespace-nowrap">
                      {tool.name}
                    </span>
                  </motion.div>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </FadeIn>
      </div>
    </section>
  );
}
