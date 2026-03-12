"use client";

import { useState } from "react";
import FadeIn from "@/components/motion/FadeIn";
import { SiteProject } from "@/lib/shared/projects";
import ProjectCard from "./ProjectCard";
import WhyTile from "./WhyTile";

export default function GamesSection({ games }: { games: SiteProject[] }) {
  const [showTile, setShowTile] = useState(false);

  return (
    <section className="mb-20">
      <FadeIn>
        <div className="mb-8 flex items-center gap-3">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted">Games</h2>
          {!showTile && (
            <button
              type="button"
              onClick={() => setShowTile(true)}
              className="rounded-full border border-white/30 px-2.5 py-0.5 text-xs text-white/60 hover:border-white/60 hover:text-white/90 transition-colors"
            >
              Why I do this
            </button>
          )}
        </div>
      </FadeIn>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {showTile && (
          <FadeIn>
            <WhyTile
              title="Why I build games"
              body="Games are my playground for practicing product philosophy. Atomic Habits changed how I think about products — less as objects, more as behaviors. Every game I build, I ask: Is it obvious? Simple? Attractive? Satisfying enough to come back to?"
              onDismiss={() => setShowTile(false)}
            />
          </FadeIn>
        )}
        {games.map((project, index) => (
          <ProjectCard key={project.id} project={project} index={index} />
        ))}
      </div>
    </section>
  );
}
