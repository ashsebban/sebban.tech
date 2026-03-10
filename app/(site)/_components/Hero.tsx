"use client";

import Image from "next/image";
import Link from "next/link";
import {
  SITE_NAME,
  SITE_TAGLINE,
  HERO_SUBTITLE,
  HERO_CREDIBILITY,
  WHAT_I_DO,
  SELECTED_WORK,
  PRODUCT_THINKING,
  CURRENT_FOCUS,
  CURRENT_FOCUS_NOTE,
  QUICK_ACTIONS,
} from "@/lib/constants";
import { projects } from "../projects/_content/projects";
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

      {/* ── Product Thinking ──────────────────────────────────────────────── */}
      <section className="px-6 pt-8 pb-16">
        <div className="max-w-3xl mx-auto">
          <FadeIn>
            <h2 className={sectionHeading}>Product Thinking</h2>
          </FadeIn>
          <div className="space-y-12">
            {PRODUCT_THINKING.map((item, index) => (
              <FadeIn key={item.principle} delay={index * 0.08}>
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-foreground">
                    {item.principle}
                  </h3>
                  <p className="text-base text-muted leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── Projects ──────────────────────────────────────────────────────── */}
      <section className="px-6 pt-8 pb-16">
        <div className="max-w-6xl mx-auto">
          <FadeIn>
            <h2 className={sectionHeading}>Projects</h2>
          </FadeIn>
          <FadeIn delay={0.05}>
            <p className="text-sm text-muted text-center mb-10 -mt-10">
              Small experiments and interactive tools I&apos;ve built while learning and exploring ideas.
            </p>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((project, index) => (
              <FadeIn key={project.id} delay={index * 0.1}>
                <div className={card}>
                  <h3 className="text-lg font-semibold mb-3">{project.title}</h3>
                  <p className="text-sm text-muted leading-relaxed">
                    {project.description}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
          <FadeIn delay={0.4}>
            <div className="mt-8 text-center">
              <Link
                href="/projects"
                className="text-sm text-muted hover:text-accent transition-colors"
              >
                View all projects →
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── How I Work ────────────────────────────────────────────────────── */}
      <section className="px-6 pt-8 pb-16">
        <div className="max-w-3xl mx-auto">
          <FadeIn>
            <h2 className={sectionHeading}>How I Work</h2>
          </FadeIn>
          <FadeIn delay={0.1}>
            <ul className="space-y-4">
              {WHAT_I_DO.map((item) => (
                <li key={item.title} className="flex items-start gap-3">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
                  <span className="text-base text-foreground font-medium">
                    {item.title}
                  </span>
                </li>
              ))}
            </ul>
          </FadeIn>
        </div>
      </section>

      {/* ── Current Focus ─────────────────────────────────────────────────── */}
      <section className="px-6 pb-24">
        <div className="max-w-3xl mx-auto text-center">
          <FadeIn>
            <h2 className={sectionHeading}>Current Focus</h2>
          </FadeIn>
          <FadeIn delay={0.1}>
            <p className="text-base text-muted mb-8 leading-relaxed">
              {CURRENT_FOCUS_NOTE}
            </p>
          </FadeIn>
          <div className="flex flex-wrap justify-center gap-3">
            {CURRENT_FOCUS.map((item, index) => (
              <FadeIn key={item} delay={0.2 + index * 0.08}>
                <span className="px-5 py-2 text-sm border border-border rounded-full bg-card text-foreground">
                  {item}
                </span>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
