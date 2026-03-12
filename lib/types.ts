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

export interface WorkExample {
  title: string;
  description: string;
  preview?: boolean;
  href?: string;
}

export interface WorkPillar {
  capability: string;
  capabilityDesc: string;
  examples: WorkExample[];
}

export interface ProductThinkingItem {
  principle: string;
  description: string;
}

export interface Tool {
  name: string;
  icon?: string;
  emoji?: string;
  separator?: boolean;
  comingSoon?: boolean;
}

export interface ToolkitCategory {
  category: string;
  tools: Tool[];
}

export interface AboutHighlight {
  label: string;
  value: string;
  detail: string;
}

export interface ChangelogEntry {
  date: string;
  label: string;
  feature: string;
  note: string;
}
