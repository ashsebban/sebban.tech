import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SITE_NAME, SITE_DESCRIPTION } from "@/lib/constants";
import GameCenterFeature from "./games/GameCenterFeature";

export const metadata: Metadata = {
  title: { absolute: SITE_NAME },
  description: SITE_DESCRIPTION,
};

const sections = [
  { id: "selected-work", name: "Work", href: "/work", description: "Go-to-market engineering, UX research, and selected projects." },
  { id: "build-notes", name: "Build Notes", href: "/build-notes", description: "What I tried, what changed, and what I learned along the way." },
];

export default function Home() {
  return (
    <div className="mx-auto max-w-6xl px-4 pb-20 pt-12 sm:px-6 sm:pt-20">
      <header className="mb-10 flex flex-wrap items-center gap-5 sm:mb-14 sm:gap-7">
        <Image src="/images/headshot2.png" alt="" width={80} height={80}
          className="h-16 w-16 rounded-full border border-border object-cover sm:h-20 sm:w-20" priority />
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl">{SITE_NAME}</h1>
          <p className="mt-3 max-w-xl text-base text-muted sm:text-lg">
            I build go-to-market systems at HiveMQ and make browser games for fun.
          </p>
        </div>
      </header>
      <section aria-labelledby="play-title">
        <div className="mb-4 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
          <h2 id="play-title" className="text-2xl font-bold">Play</h2>
          <Link href="/games" className="rounded-md px-2 py-2 font-semibold text-accent hover:underline">
            Explore the Game Center <span aria-hidden="true">→</span>
          </Link>
        </div>
        <GameCenterFeature heading="h3" />
      </section>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {sections.map(({ id, name, href, description }) => (
          <Link key={id} id={id} href={href}
            className="group scroll-mt-24 rounded-2xl border border-border bg-card p-5 transition-colors hover:border-accent sm:p-7">
            <h2 className="flex items-baseline justify-between gap-4 text-2xl font-bold">
              {name}<span aria-hidden="true" className="text-accent">↗</span>
            </h2>
            <p className="mt-2 text-muted">{description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
