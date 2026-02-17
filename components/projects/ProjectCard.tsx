"use client";

// Card for one project on the Projects page: title, description, tech tags, Code/Live links
import { Project } from "@/lib/types";
import FadeIn from "@/components/motion/FadeIn";

interface ProjectCardProps {
  project: Project;
  index: number;
}

export default function ProjectCard({ project, index }: ProjectCardProps) {
  return (
    <FadeIn delay={index * 0.1}>
      <div className="group p-6 rounded-xl border border-border bg-card hover:border-accent/50 transition-all duration-300 hover:-translate-y-0.5 h-full flex flex-col">
        <h3 className="text-lg font-semibold mb-2">{project.title}</h3>
        <p className="text-sm text-muted leading-relaxed mb-4 flex-1">
          {project.description}
        </p>

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

        {/* Optional GitHub and live demo links */}
        <div className="flex gap-4">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-accent hover:text-accent-hover transition-colors"
            >
              Code &rarr;
            </a>
          )}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-accent hover:text-accent-hover transition-colors"
            >
              Live Demo &rarr;
            </a>
          )}
        </div>
      </div>
    </FadeIn>
  );
}
