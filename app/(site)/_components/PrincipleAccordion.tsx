"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { ProductThinkingItem } from "@/lib/types";

interface Props {
  item: ProductThinkingItem;
  isOpen: boolean;
  onToggle: () => void;
}

export default function PrincipleAccordion({ item, isOpen, onToggle }: Props) {
  return (
    <div
      className={`group/row -mx-3 px-3 rounded-lg cursor-pointer transition-all duration-150 origin-left
        hover:scale-[1.015] hover:bg-white/[0.04] hover:ring-1 hover:ring-white/10 hover:shadow-[0_0_24px_rgba(255,255,255,0.04)]
        ${isOpen ? "scale-[1.015] bg-white/[0.04] ring-1 ring-white/10" : ""}
      `}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-4 text-left"
      >
        <span className={`text-base font-semibold pr-4 transition-colors duration-150
          ${isOpen ? "text-white" : "text-foreground/50 group-hover/row:text-white"}
        `}>
          {item.principle}
        </span>
        <span className={`flex-shrink-0 text-base leading-none transition-colors duration-150
          ${isOpen ? "text-white/70" : "text-foreground/30 group-hover/row:text-white/70"}
        `}>
          {isOpen ? "−" : "+"}
        </span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.21, 0.47, 0.32, 0.98] }}
            style={{ overflow: "hidden" }}
          >
            <p className="pb-4 text-sm text-muted leading-relaxed">{item.description}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
