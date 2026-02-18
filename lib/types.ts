// Shared TypeScript types for nav, social, projects, and blog

/** Nav item used in Navbar and Footer (from constants) */
export interface NavLink {
  name: string;
  href: string;
}

/** Social/contact link (GitHub, LinkedIn, Email, etc.) */
export interface SocialLink {
  name: string;
  href: string;
  icon: string;
}

/** Project entry for the Projects page (from content/projects) */
export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  technologies: string[];
  imageUrl: string;
  category: "game" | "website" | "app";
  language?: string;
  githubUrl?: string;
  liveUrl?: string;
  demoUrl?: string;
}

/** Blog post as loaded from MD/MDX (slug, frontmatter, raw content) */
export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  content: string;
  tags: string[];
  image?: string;
}

/** Frontmatter shape for blog Markdown files */
export interface BlogFrontmatter {
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
  image?: string;
}
