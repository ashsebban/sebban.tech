"use client";

import { useState } from "react";
import { Project } from "@/lib/types";
import FadeIn from "@/components/motion/FadeIn";
import { GitHubIcon, PlayIcon, GlobeIcon, LaunchIcon } from "@/components/icons/SocialIcons";
import GameModal from "@/components/games/GameModal";

interface ProjectCardProps {
  project: Project;
  index: number;
}

/**
 * Presentational card for a single portfolio project.
 *
 * Derives a small set of booleans from `project` to keep the JSX
 * readable and to centralize the rules for which CTAs should render.
 */
export default function ProjectCard({ project, index }: ProjectCardProps) {
  const [demoOpen, setDemoOpen] = useState(false);

  // High‑level lifecycle flags drive both the badge and which CTAs are interactive.
  const isLocked = project.lifecycle === "locked";
  const isLive = !project.lifecycle || project.lifecycle === "live";

  // We treat on‑site demos differently from fully external demos (e.g. CodeSandbox, deployed site).
  const isExternalDemo = Boolean(project.demoUrl?.startsWith("http://") || project.demoUrl?.startsWith("https://"));

  // Reusable boolean helpers that encode when each kind of CTA should appear.
  const showCode = Boolean(project.githubUrl);
  const showGamePlay = project.category === "game" && Boolean(project.demoUrl);
  const showWebsiteExplore = project.category === "website" && Boolean(project.demoUrl);
  const showAppLaunch = project.category === "app" && Boolean(project.liveUrl);
  const showAppOpen = project.category === "app" && !project.liveUrl && Boolean(project.demoUrl);

  // Normalized list of technology badges: technologies + (optional) primary language, deduplicated.
  const techTags = Array.from(
    new Set(
      [...project.technologies, ...(project.language ? [project.language] : [])]
        .map((tech) => String(tech).trim())
        .filter(Boolean)
    )
  );

  return (
    <>
      <FadeIn delay={index * 0.08}>
        <div className={`group p-6 rounded-xl border border-border bg-card transition-all duration-300 h-full flex flex-col ${isLocked ? "opacity-80" : "hover:border-accent/50 hover:-translate-y-0.5"}`}>
          <div className="mb-2 flex items-start justify-between gap-3">
            <h3 className="text-lg font-semibold leading-tight">{project.title}</h3>
            {(isLocked || isLive) && (
              <span
                className={`shrink-0 text-[10px] px-2 py-0.5 rounded border bg-background ${
                  isLocked ? "border-border text-muted" : "border-blue-500/40 text-blue-400"
                }`}
              >
                {isLocked ? "Coming Soon" : "Live"}
              </span>
            )}
          </div>
          <p className="text-sm text-muted leading-relaxed mb-4 flex-1">
            {project.description}
          </p>

          {/* Tech tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {techTags.map((tech, techIndex) => (
              <span
                key={`${tech}-${techIndex}`}
                className="text-xs px-2.5 py-1 rounded-full border border-border text-muted"
              >
                {tech}
              </span>
            ))}
          </div>

          {/* CTAs — vary by category */}
          <div className="mt-auto flex flex-wrap gap-4 items-center">
            {!isLocked && showCode && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm text-accent hover:text-accent-hover transition-colors"
              >
                <GitHubIcon className="w-4 h-4" />
                Code
              </a>
            )}
            {isLocked && showCode && (
              <span className="flex items-center gap-1.5 text-sm text-muted opacity-60 cursor-not-allowed">
                <GitHubIcon className="w-4 h-4" />
                Code
              </span>
            )}

            {/* GAMES: Play button opens modal */}
            {!isLocked && showGamePlay && (
              <button
                onClick={() => setDemoOpen(true)}
                className="flex items-center gap-1.5 text-sm text-accent hover:text-accent-hover transition-colors"
              >
                <PlayIcon className="w-4 h-4" />
                Play Now
              </button>
            )}
            {isLocked && showGamePlay && (
              <span className="flex items-center gap-1.5 text-sm text-muted opacity-60 cursor-not-allowed">
                <PlayIcon className="w-4 h-4" />
                Play Now
              </span>
            )}

            {/* WEBSITES: Preview opens modal or external link */}
            {!isLocked && showWebsiteExplore && !isExternalDemo && (
              <button
                onClick={() => setDemoOpen(true)}
                className="flex items-center gap-1.5 text-sm text-accent hover:text-accent-hover transition-colors"
              >
                <GlobeIcon className="w-4 h-4" />
                Preview
              </button>
            )}
            {!isLocked && showWebsiteExplore && isExternalDemo && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm text-accent hover:text-accent-hover transition-colors"
              >
                <GlobeIcon className="w-4 h-4" />
                Preview
              </a>
            )}
            {isLocked && showWebsiteExplore && (
              <span className="flex items-center gap-1.5 text-sm text-muted opacity-60 cursor-not-allowed">
                <GlobeIcon className="w-4 h-4" />
                Preview
              </span>
            )}

            {/* APPS: Launch live app, or open embedded app when demoUrl is available */}
            {!isLocked && showAppLaunch && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm text-accent hover:text-accent-hover transition-colors"
              >
                <LaunchIcon className="w-4 h-4" />
                Launch
              </a>
            )}
            {isLocked && showAppLaunch && (
              <span className="flex items-center gap-1.5 text-sm text-muted opacity-60 cursor-not-allowed">
                <LaunchIcon className="w-4 h-4" />
                Launch
              </span>
            )}
            {!isLocked && showAppOpen && (
              <button
                onClick={() => setDemoOpen(true)}
                className="flex items-center gap-1.5 text-sm text-accent hover:text-accent-hover transition-colors"
              >
                <LaunchIcon className="w-4 h-4" />
                Launch
              </button>
            )}
            {isLocked && showAppOpen && (
              <span className="flex items-center gap-1.5 text-sm text-muted opacity-60 cursor-not-allowed">
                <LaunchIcon className="w-4 h-4" />
                Launch
              </span>
            )}
          </div>
        </div>
      </FadeIn>

      {/* Shared modal surface used for both games and embedded website/app demos. */}
      {demoOpen && project.demoUrl && !isLocked && (
        <GameModal
          title={project.title}
          src={project.demoUrl}
          onClose={() => setDemoOpen(false)}
        />
      )}
    </>
  );
}
