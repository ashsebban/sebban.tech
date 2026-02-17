"use client";

// Home page content: headshot + tagline, "What I Do" cards, and highlight tags (all with FadeIn)
import Image from "next/image";
import Link from "next/link";
import {
  SITE_NAME,
  SITE_TAGLINE,
  WHAT_I_DO,
  HIGHLIGHTS,
} from "@/lib/constants";
import FadeIn from "@/components/motion/FadeIn";

export default function Hero() {
  return (
    <>
      {/* Hero: avatar, name, tagline, CTA links */}
      <section className="flex items-start justify-center px-6 pt-[18vh] pb-4">
        <div className="max-w-4xl text-center">
          <FadeIn>
            <Image
              src="/images/headshot.jpg"
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
          <FadeIn delay={0.3}>
            <div className="mt-10 flex flex-col sm:flex-row items-center gap-4 justify-center">
              <Link
                href="/projects"
                className="px-6 py-3 bg-accent text-white text-sm font-medium rounded-lg hover:bg-accent-hover transition-colors"
              >
                See My Work
              </Link>
              <Link
                href="/video"
                className="px-6 py-3 border border-border text-foreground text-sm font-medium rounded-lg hover:border-accent hover:text-accent transition-colors"
              >
                Get to Know Me
              </Link>
              <Link
                href="/contact"
                className="text-sm text-muted hover:text-accent transition-colors"
              >
                Let&apos;s Talk &rarr;
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* What I Do */}
      <section className="px-6 pt-8 pb-16">
        <div className="max-w-6xl mx-auto">
          <FadeIn>
            <h2 className="text-3xl md:text-4xl font-bold mb-16 text-center">
              What I Do
            </h2>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {WHAT_I_DO.map((item, index) => (
              <FadeIn key={item.title} delay={index * 0.1}>
                <div className="p-6 rounded-xl border border-border bg-card hover:border-accent/50 transition-all duration-300 hover:-translate-y-0.5">
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

      {/* Highlights */}
      <section className="px-6 py-24">
        <div className="max-w-6xl mx-auto">
          <FadeIn>
            <h2 className="text-3xl md:text-4xl font-bold mb-16 text-center">
              Highlights
            </h2>
          </FadeIn>
          <div className="flex flex-wrap justify-center gap-4">
            {HIGHLIGHTS.map((highlight, index) => (
              <FadeIn key={highlight} delay={index * 0.1}>
                <span className="px-5 py-2.5 text-sm text-muted border border-border rounded-full">
                  {highlight}
                </span>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
