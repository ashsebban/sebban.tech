// Projects page: featured and "Other Work" sections using content/projects data
import { Metadata } from "next";
import ProjectCard from "@/components/projects/ProjectCard";
import { projects } from "@/content/projects/projects";

export const metadata: Metadata = {
  title: "Projects",
  description: "Check out my portfolio of projects and work",
};

export default function ProjectsPage() {
  const featuredProjects = projects.filter((p) => p.featured);
  const otherProjects = projects.filter((p) => !p.featured);

  return (
    <div className="px-6 py-24">
      <div className="max-w-6xl mx-auto">
        <div className="mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Projects</h1>
          <p className="text-lg text-muted max-w-2xl">
            Personal and side projects that demonstrate how I think, build, and solve problems.
          </p>
        </div>

        {/* Featured projects first, then "Other Work" */}
        {featuredProjects.length > 0 && (
          <div className="mb-20">
            <h2 className="text-sm font-semibold text-muted uppercase tracking-wider mb-8">
              Featured
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProjects.map((project, index) => (
                <ProjectCard key={project.id} project={project} index={index} />
              ))}
            </div>
          </div>
        )}

        {otherProjects.length > 0 && (
          <div>
            <h2 className="text-sm font-semibold text-muted uppercase tracking-wider mb-8">
              Other Work
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {otherProjects.map((project, index) => (
                <ProjectCard key={project.id} project={project} index={index + featuredProjects.length} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
