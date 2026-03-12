"use client";

import { useMemo, useState } from "react";
import FadeIn from "@/components/motion/FadeIn";
import { GitHubIcon, GlobeIcon, LaunchIcon, PlayIcon } from "@/components/icons/SocialIcons";
import { SiteProject } from "@/lib/shared/projects";
import ProjectPreviewModal from "./ProjectPreviewModal";

interface ProjectCardProps {
  project: SiteProject;
  index: number;
}

export default function ProjectCard({ project, index }: ProjectCardProps) {
  const [previewOpen, setPreviewOpen] = useState(false);

  const actionLabel = useMemo(() => {
    if (project.category === "game") return "Play";
    if (project.category === "website" || project.category === "enterprise") return "Preview";
    return "Launch";
  }, [project.category]);

  const ActionIcon = useMemo(() => {
    if (project.category === "game") return PlayIcon;
    if (project.category === "website" || project.category === "enterprise") return GlobeIcon;
    return LaunchIcon;
  }, [project.category]);

  const canEmbed = project.preview.mode === "embed" && Boolean(project.preview.embedUrl);

  const openProject = () => {
    if (canEmbed) {
      setPreviewOpen(true);
      return;
    }
    window.open(project.deployUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <>
      <FadeIn delay={index * 0.08}>
        <article className="group flex h-full flex-col rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/50">
          <div className="mb-2 flex items-start justify-between gap-3">
            <h3 className="text-lg font-semibold leading-tight">{project.title}</h3>
            <span className="shrink-0 rounded border border-blue-500/40 bg-background px-2 py-0.5 text-[10px] text-blue-400">
              {project.status === "live" ? "Live" : "Locked"}
            </span>
          </div>

          <p className="mb-4 flex-1 text-sm leading-relaxed text-muted">{project.description}</p>

          <div className="mb-4 flex flex-wrap gap-2">
            {project.tech.map((tech) => (
              <span key={tech} className="rounded-full border border-border px-2.5 py-1 text-xs text-muted">
                {tech}
              </span>
            ))}
          </div>

          <div className="mt-auto flex flex-wrap items-center gap-4">
            {project.repoUrl && (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm text-accent transition-colors hover:text-accent-hover"
              >
                <GitHubIcon className="h-4 w-4" />
                Code
              </a>
            )}

            <button
              onClick={openProject}
              className="flex items-center gap-1.5 text-sm text-accent transition-colors hover:text-accent-hover"
            >
              <ActionIcon className="h-4 w-4" />
              {actionLabel}
            </button>
          </div>
        </article>
      </FadeIn>

      {previewOpen && canEmbed && project.preview.embedUrl && (
        <ProjectPreviewModal
          title={project.title}
          embedUrl={project.preview.embedUrl}
          deployUrl={project.deployUrl}
          onClose={() => setPreviewOpen(false)}
        />
      )}
    </>
  );
}
