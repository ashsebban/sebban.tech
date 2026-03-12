"use client";

import { useState } from "react";
import FadeIn from "@/components/motion/FadeIn";
import { SiteProject } from "@/lib/shared/projects";
import ProjectCard from "./ProjectCard";
import WhyTile from "./WhyTile";

export default function AppsSection({ apps }: { apps: SiteProject[] }) {
  const [showTile, setShowTile] = useState(false);

  return (
    <section className="mb-20">
      <FadeIn>
        <div className="mb-8 flex items-center gap-3">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted">Apps</h2>
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
              title="How I think about apps"
              body="Prototyping early is how I figure out what to build — not just how to build it. My canvas app started as a tool to design characters and mechanics for my games. Using it revealed a gap immediately: I had to draw shapes manually because there was no shape tool. That's the kind of insight you only get by being your own user. The feature is on the list."
              onDismiss={() => setShowTile(false)}
            />
          </FadeIn>
        )}
        {apps.map((project, index) => (
          <ProjectCard key={project.id} project={project} index={index} />
        ))}
      </div>
    </section>
  );
}
