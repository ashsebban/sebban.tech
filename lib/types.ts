export interface NavLink {
  name: string;
  href: string;
}

export interface SocialLink {
  name: string;
  href: string;
  icon: string;
}

export type QuickActionVariant = "primary" | "secondary" | "text";

export interface QuickActionLink {
  label: string;
  href: string;
  variant: QuickActionVariant;
  external: boolean;
}

export interface ReferenceEntry {
  group: string;
  name: string;
  role: string;
}

export interface ReferencesPageContent {
  title: string;
  intro: string;
  statusNote: string;
  references?: ReferenceEntry[];
}

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  content: string;
  tags: string[];
  image?: string;
}

export interface BlogFrontmatter {
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
  image?: string;
}

export interface SelectedWorkItem {
  title: string;
  description: string;
}

export interface ProductThinkingItem {
  principle: string;
  description: string;
}
