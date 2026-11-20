import { Metadata } from "next";
import FadeIn from "@/components/motion/FadeIn";
import { projects } from "../projects/_content/projects";
import ProjectCard from "../projects/_components/ProjectCard";
import AppsSection from "../projects/_components/AppsSection";

export const metadata: Metadata = {
  title: "Apps",
  description: "Apps and side projects built by Asher Sebban.",
};

const siteProjects = projects.filter((p) => p.category === "project");
const apps = projects.filter((p) => p.category === "app");

export default function AppsPage() {
  return (
    <div className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-20">
          <FadeIn>
            <h1 className="mb-4 text-4xl font-bold md:text-5xl">Apps</h1>
          </FadeIn>
          <FadeIn delay={0.1}>
            <p className="max-w-2xl text-lg text-muted">
              A selection of apps I’ve built or am working on.
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

        {apps.length > 0 && <AppsSection apps={apps} />}
      </div>
    </div>
  );
}
