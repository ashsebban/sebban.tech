export type ProjectCategory = "project" | "app" | "game" | "website" | "enterprise";
export type ProjectStatus = "live" | "locked";
export type ProjectPreviewMode = "embed" | "external";

export interface ProjectPreview {
  mode: ProjectPreviewMode;
  embedUrl?: string;
  fallback?: "new-tab";
}

export interface SiteProject {
  id: string;
  title: string;
  description: string;
  category: ProjectCategory;
  tech: string[];
  status: ProjectStatus;
  repoUrl?: string;
  deployUrl: string;
  preview: ProjectPreview;
}
