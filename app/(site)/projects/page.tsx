import { Metadata } from "next";
import FadeIn from "@/components/motion/FadeIn";
import { projects } from "./_content/projects";
import ProjectCard from "./_components/ProjectCard";

export const metadata: Metadata = {
  title: "Projects",
  description: "Projects, apps, and games built by Asher Sebban.",
};

const siteProjects = projects.filter((p) => p.category === "project");
const apps = projects.filter((p) => p.category === "app");
const games = projects.filter((p) => p.category === "game");

export default function ProjectsPage() {
  return (
    <div className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-20">
          <FadeIn>
            <h1 className="mb-4 text-4xl font-bold md:text-5xl">Projects</h1>
          </FadeIn>
          <FadeIn delay={0.1}>
            <p className="max-w-2xl text-lg text-muted">
              A collection of things I&apos;ve built. Games run live in the browser, pulled directly from their own repos.
            </p>
          </FadeIn>
        </div>

        {siteProjects.length > 0 && (
          <section className="mb-20">
            <FadeIn>
              <div className="mb-8">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-muted">Projects</h2>
              </div>
            </FadeIn>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {siteProjects.map((project, index) => (
                <ProjectCard key={project.id} project={project} index={index} />
              ))}
            </div>
          </section>
        )}

        {apps.length > 0 && (
          <section className="mb-20">
            <FadeIn>
              <div className="mb-8">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-muted">Apps</h2>
              </div>
            </FadeIn>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {apps.map((project, index) => (
                <ProjectCard key={project.id} project={project} index={index} />
              ))}
            </div>
          </section>
        )}

        {games.length > 0 && (
          <section className="mb-20">
            <FadeIn>
              <div className="mb-8">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-muted">Games</h2>
              </div>
            </FadeIn>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {games.map((project, index) => (
                <ProjectCard key={project.id} project={project} index={index} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
