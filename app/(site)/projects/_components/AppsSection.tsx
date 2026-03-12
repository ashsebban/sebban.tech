"use client";

import { useState } from "react";
import FadeIn from "@/components/motion/FadeIn";
import { SiteProject } from "@/lib/shared/projects";
import ProjectCard from "./ProjectCard";
import WhyTile from "./WhyTile";

export default function AppsSection({ apps }: { apps: SiteProject[] }) {
  const [showTile, setShowTile] = useState(true);

  return (
    <section className="mb-20">
      <FadeIn>
        <div className="mb-8">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted">Apps</h2>
        </div>
      </FadeIn>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {showTile && (
          <FadeIn>
            <WhyTile
              title="How I think about apps"
              body="Prototyping early is how I figure out what to build — not just how to build it. My canvas app started as a tool to design characters and mechanics for my games. Using it revealed a gap immediately: I had to draw shapes manually because there was no shape tool. That's the kind of insight you only get by being your own user. The feature is on the list."
              accentClass="border-emerald-500/30 bg-emerald-950/30"
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
