"use client";

import { useState } from "react";
import { Project } from "@/lib/types";
import FadeIn from "@/components/motion/FadeIn";
import { GitHubIcon, PlayIcon, GlobeIcon } from "@/components/icons/SocialIcons";
import GameModal from "@/components/games/GameModal";

interface ProjectCardProps {
  project: Project;
  index: number;
}

export default function ProjectCard({ project, index }: ProjectCardProps) {
  const [demoOpen, setDemoOpen] = useState(false);

  return (
    <>
      <FadeIn delay={index * 0.08}>
        <div className="relative group p-6 rounded-xl border border-border bg-card hover:border-accent/50 transition-all duration-300 hover:-translate-y-0.5 h-full flex flex-col">

          {/* Language badge — top right, games only */}
          {project.language && (
            <span className="absolute top-4 right-4 text-xs px-2 py-0.5 rounded border border-border text-muted bg-background">
              {project.language}
            </span>
          )}

          <h3 className="text-lg font-semibold mb-2 pr-20">{project.title}</h3>
          <p className="text-sm text-muted leading-relaxed mb-4 flex-1">
            {project.description}
          </p>

          {/* Tech tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {project.technologies.map((tech) => (
              <span
                key={tech}
                className="text-xs px-2.5 py-1 rounded-full border border-border text-muted"
              >
                {tech}
              </span>
            ))}
          </div>

          {/* CTAs — vary by category */}
          <div className="flex gap-4 items-center">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm text-accent hover:text-accent-hover transition-colors"
              >
                <GitHubIcon className="w-4 h-4" />
                Code &rarr;
              </a>
            )}

            {/* GAMES: Play button opens modal */}
            {project.category === "game" && project.demoUrl && (
              <button
                onClick={() => setDemoOpen(true)}
                className="flex items-center gap-1.5 text-sm text-accent hover:text-accent-hover transition-colors"
              >
                <PlayIcon className="w-3.5 h-3.5" />
                Play &rarr;
              </button>
            )}

            {/* WEBSITES: Explore opens modal */}
            {project.category === "website" && project.demoUrl && (
              <button
                onClick={() => setDemoOpen(true)}
                className="flex items-center gap-1.5 text-sm text-accent hover:text-accent-hover transition-colors"
              >
                <GlobeIcon className="w-4 h-4" />
                Explore &rarr;
              </button>
            )}

            {/* APPS: Launch live app, or open embedded app when demoUrl is available */}
            {project.category === "app" && project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-accent hover:text-accent-hover transition-colors"
              >
                Launch &rarr;
              </a>
            )}
            {project.category === "app" && !project.liveUrl && project.demoUrl && (
              <button
                onClick={() => setDemoOpen(true)}
                className="flex items-center gap-1.5 text-sm text-accent hover:text-accent-hover transition-colors"
              >
                Open &rarr;
              </button>
            )}
          </div>
        </div>
      </FadeIn>

      {demoOpen && project.demoUrl && (
        <GameModal
          title={project.title}
          src={project.demoUrl}
          onClose={() => setDemoOpen(false)}
        />
      )}
    </>
  );
}
