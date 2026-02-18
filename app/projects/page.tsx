import { Metadata } from "next";
import ProjectCard from "@/components/projects/ProjectCard";
import { projects } from "@/content/projects/projects";
import FadeIn from "@/components/motion/FadeIn";

export const metadata: Metadata = {
  title: "Projects",
  description: "Games, websites, and apps — built from scratch.",
};

const games    = projects.filter((p) => p.category === "game");
const websites = projects.filter((p) => p.category === "website");
const apps     = projects.filter((p) => p.category === "app");

export default function ProjectsPage() {
  return (
    <div className="px-6 py-24">
      <div className="max-w-6xl mx-auto">

        {/* Page header */}
        <div className="mb-20">
          <FadeIn>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Projects</h1>
          </FadeIn>
          <FadeIn delay={0.1}>
            <p className="text-lg text-muted max-w-2xl">
              Things I built — games you can play, sites you can explore, and apps you can dig into.
            </p>
          </FadeIn>
        </div>

        {/* GAMES */}
        {games.length > 0 && (
          <div className="mb-20">
            <FadeIn>
              <div className="mb-8">
                <h2 className="text-sm font-semibold text-muted uppercase tracking-wider">Games</h2>
                <p className="text-xs text-muted/60 mt-1">Playable in your browser — built from scratch</p>
              </div>
            </FadeIn>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {games.map((project, index) => (
                <ProjectCard key={project.id} project={project} index={index} />
              ))}
            </div>
          </div>
        )}

        {/* WEBSITES */}
        {websites.length > 0 && (
          <div className="mb-20">
            <FadeIn>
              <div className="mb-8">
                <h2 className="text-sm font-semibold text-muted uppercase tracking-wider">Websites</h2>
                <p className="text-xs text-muted/60 mt-1">HTML/CSS projects and web design work</p>
              </div>
            </FadeIn>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {websites.map((project, index) => (
                <ProjectCard key={project.id} project={project} index={index} />
              ))}
            </div>
          </div>
        )}

        {/* APPS */}
        <div className="mb-20">
          <FadeIn>
            <div className="mb-8">
              <h2 className="text-sm font-semibold text-muted uppercase tracking-wider">Apps</h2>
              <p className="text-xs text-muted/60 mt-1">Tools, data projects, and coursework</p>
            </div>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {apps.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
            {/* Coming soon */}
            <FadeIn delay={apps.length * 0.08}>
              <div className="p-6 rounded-xl border border-dashed border-border bg-card/30 flex flex-col items-center justify-center text-center min-h-[180px]">
                <p className="text-sm text-muted">More coming soon</p>
                <p className="text-xs text-muted/50 mt-1">AI tools and rebuilt projects in progress</p>
              </div>
            </FadeIn>
          </div>
        </div>

      </div>
    </div>
  );
}
