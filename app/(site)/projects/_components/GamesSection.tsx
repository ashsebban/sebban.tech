"use client";

import { useState } from "react";
import FadeIn from "@/components/motion/FadeIn";
import { SiteProject } from "@/lib/shared/projects";
import ProjectCard from "./ProjectCard";
import WhyTile from "./WhyTile";

export default function GamesSection({ games }: { games: SiteProject[] }) {
  const [showTile, setShowTile] = useState(true);

  return (
    <section className="mb-20">
      <FadeIn>
        <div className="mb-8">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted">Games</h2>
        </div>
      </FadeIn>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {showTile && (
          <FadeIn>
            <WhyTile
              title="Why I build games"
              body="Games are my playground for practicing product philosophy. Reading Atomic Habits changed how I think about products — less as objects, more as behaviors. Every game I build, I ask the same questions I ask about any product: Is it obvious? Is it simple? Is it attractive? Is it satisfying enough to come back to?"
              accentClass="border-blue-500/30 bg-blue-950/30"
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
