"use client";

import { useState } from "react";
import { homeContent } from "@/content/home";
import FadeIn from "@/components/motion/FadeIn";
import AnacomicsModal from "./AnacomicsModal";
import HeroSection from "./HeroSection";
import ImpactTabs from "./ImpactTabs";
import PrincipleAccordion from "./PrincipleAccordion";
import ToolkitSection from "./ToolkitSection";

const sectionHeading = "text-3xl md:text-4xl font-bold mb-8 text-center";

export default function Hero() {
  const [anacomicsOpen, setAnacomicsOpen] = useState(false);
  const [openPrinciple, setOpenPrinciple] = useState<string | null>(null);

  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <HeroSection {...homeContent.hero} />

      {/* ── How I Create Impact ───────────────────────────────────────────── */}
      <section className="px-6 py-24">
        <div className="max-w-3xl mx-auto">
          <FadeIn>
            <h2 className={sectionHeading}>How I Create Impact</h2>
          </FadeIn>
          <FadeIn delay={0.1}>
            <ImpactTabs
              pillars={homeContent.pillars}
              onPreview={() => setAnacomicsOpen(true)}
            />
          </FadeIn>
          {anacomicsOpen && <AnacomicsModal onClose={() => setAnacomicsOpen(false)} />}
        </div>
      </section>

      {/* ── How I Think About Building Products ───────────────────────────── */}
      <section className="px-6 py-24">
        <div className="max-w-3xl mx-auto">
          <FadeIn>
            <h2 className="text-3xl md:text-4xl font-bold mb-16 text-center">How I Think About Building Products</h2>
          </FadeIn>
          <div className="divide-y divide-border border-t border-border">
            {homeContent.productThinking.map((item, index) => (
              <FadeIn key={item.principle} delay={index * 0.05}>
                <PrincipleAccordion
                  item={item}
                  isOpen={openPrinciple === item.principle}
                  onToggle={() =>
                    setOpenPrinciple(
                      openPrinciple === item.principle ? null : item.principle
                    )
                  }
                />
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── Toolkit ───────────────────────────────────────────────────────── */}
      <ToolkitSection toolkit={homeContent.toolkit} />
    </>
  );
}
