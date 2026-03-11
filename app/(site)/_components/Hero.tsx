"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import AnacomicsModal from "./AnacomicsModal";
import {
  SITE_NAME,
  SITE_TAGLINE,
  HERO_SUBTITLE,
  HERO_CREDIBILITY,
  WHAT_I_DO,
  SELECTED_WORK,
  PRODUCT_THINKING,
  TOOLKIT,
  QUICK_ACTIONS,
} from "@/lib/constants";
import FadeIn from "@/components/motion/FadeIn";

const QUICK_ACTION_VARIANTS = {
  primary:
    "px-6 py-3 bg-accent text-white text-sm font-medium rounded-lg hover:bg-accent-hover transition-colors",
  secondary:
    "px-6 py-3 border border-border text-foreground text-sm font-medium rounded-lg hover:border-accent hover:text-accent transition-colors",
  text: "text-sm text-muted hover:text-accent transition-colors",
} as const;

const sectionHeading = "text-3xl md:text-4xl font-bold mb-16 text-center";
const card =
  "p-6 rounded-xl border border-border bg-card hover:border-accent/50 transition-all duration-300 hover:-translate-y-0.5";

export default function Hero() {
  const [anacomicsOpen, setAnacomicsOpen] = useState(false);
  const [openPrinciple, setOpenPrinciple] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState(TOOLKIT[0].category);

  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="flex items-start justify-center px-6 pt-[18vh] pb-4">
        <div className="max-w-4xl text-center">
          <FadeIn>
            <Image
              src="/images/headshot2.png"
              alt={SITE_NAME}
              width={176}
              height={176}
              className="rounded-full border-2 border-border object-cover w-36 h-36 md:w-44 md:h-44 mx-auto mb-8"
              priority
            />
          </FadeIn>
          <FadeIn delay={0.1}>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
              {SITE_NAME}
            </h1>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="mt-6 text-2xl md:text-3xl text-muted leading-snug">
              {SITE_TAGLINE}
            </p>
          </FadeIn>
          <FadeIn delay={0.25}>
            <p className="mt-4 text-lg md:text-xl text-foreground leading-snug">
              {HERO_SUBTITLE}
            </p>
          </FadeIn>
          <FadeIn delay={0.3}>
            <p className="mt-3 text-sm md:text-base text-muted">
              {HERO_CREDIBILITY}
            </p>
          </FadeIn>
          <FadeIn delay={0.35}>
            <div className="mt-10 flex flex-wrap items-center gap-4 justify-center">
              {QUICK_ACTIONS.map((action) => (
                <Link
                  key={action.label}
                  href={action.href}
                  className={QUICK_ACTION_VARIANTS[action.variant]}
                  target={action.external ? "_blank" : undefined}
                  rel={action.external ? "noopener noreferrer" : undefined}
                >
                  {action.label}
                </Link>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── Selected Work ─────────────────────────────────────────────────── */}
      <section className="px-6 pt-8 pb-16">
        <div className="max-w-6xl mx-auto">
          <FadeIn>
            <h2 className={sectionHeading}>Selected Work</h2>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {SELECTED_WORK.map((item, index) => (
              <FadeIn key={item.title} delay={index * 0.1} className="h-full">
                {item.title === "Created ANACOMICS" ? (
                  <button
                    onClick={() => setAnacomicsOpen(true)}
                    className={`${card} h-full flex flex-col min-h-[10rem] w-full text-left cursor-pointer`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-semibold">{item.title}</h3>
                      <span className="text-xs text-accent ml-3 flex-shrink-0">Preview →</span>
                    </div>
                    <p className="text-sm text-muted leading-relaxed flex-1">
                      {item.description}
                    </p>
                  </button>
                ) : (
                  <div className={`${card} h-full flex flex-col min-h-[10rem]`}>
                    <h3 className="text-lg font-semibold mb-3">{item.title}</h3>
                    <p className="text-sm text-muted leading-relaxed flex-1">
                      {item.description}
                    </p>
                  </div>
                )}
              </FadeIn>
            ))}
          </div>
          {anacomicsOpen && <AnacomicsModal onClose={() => setAnacomicsOpen(false)} />}
        </div>
      </section>

      {/* ── Product Thinking ──────────────────────────────────────────────── */}
      <section className="px-6 pt-8 pb-16">
        <div className="max-w-3xl mx-auto">
          <FadeIn>
            <h2 className={sectionHeading}>Product Thinking</h2>
          </FadeIn>
          <div className="divide-y divide-border border-t border-border">
            {PRODUCT_THINKING.map((item, index) => (
              <FadeIn key={item.principle} delay={index * 0.05}>
                <div>
                  <button
                    onClick={() =>
                      setOpenPrinciple(
                        openPrinciple === item.principle ? null : item.principle
                      )
                    }
                    className="w-full flex items-center justify-between py-4 text-left"
                  >
                    <span className="text-base font-semibold text-foreground pr-4">
                      {item.principle}
                    </span>
                    <span className="text-muted flex-shrink-0 text-lg leading-none">
                      {openPrinciple === item.principle ? "−" : "+"}
                    </span>
                  </button>
                  {openPrinciple === item.principle && (
                    <p className="pb-4 text-sm text-muted leading-relaxed">
                      {item.description}
                    </p>
                  )}
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── What I Bring ──────────────────────────────────────────────────── */}
      <section className="px-6 pt-8 pb-16">
        <div className="max-w-6xl mx-auto">
          <FadeIn>
            <h2 className={sectionHeading}>What I Bring</h2>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {WHAT_I_DO.map((item, index) => (
              <FadeIn key={item.title} delay={index * 0.1}>
                <div className={card}>
                  <h3 className="text-lg font-semibold mb-3">{item.title}</h3>
                  <p className="text-sm text-muted leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── Toolkit ───────────────────────────────────────────────────────── */}
      <section className="px-6 pb-24">
        <div className="max-w-3xl mx-auto text-center">
          <FadeIn>
            <h2 className={sectionHeading}>Toolkit</h2>
          </FadeIn>
          <FadeIn delay={0.05}>
            <div className="flex gap-2 justify-center flex-wrap mb-8">
              {TOOLKIT.map((cat) => (
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
          <FadeIn delay={0.1}>
            <div className="flex flex-wrap justify-center gap-3">
              {TOOLKIT.find((c) => c.category === activeCategory)?.tools.map((tool) => (
                <span
                  key={tool.name}
                  className="px-5 py-2 text-sm border border-border rounded-full bg-card text-foreground flex items-center gap-2"
                >
                  {tool.name}
                  {tool.learning && (
                    <span className="text-[10px] text-accent border border-accent/40 rounded px-1 py-0.5 leading-none">
                      learning
                    </span>
                  )}
                </span>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
