import { SiteProject } from "@/lib/shared/projects";

export const projects: SiteProject[] = [
  {
    id: "processing-playground",
    title: "Art Studio",
    description: "A playful drawing studio with palettes, zoom, undo/redo, and export tools.",
    category: "app",
    tech: ["Processing", "Creative Coding", "Visual Design"],
    status: "live",
    repoUrl: "https://github.com/ashsebban/art-studio",
    deployUrl: "https://ashsebban.github.io/art-studio/",
    preview: {
      mode: "embed",
      embedUrl: "https://ashsebban.github.io/art-studio/",
      fallback: "new-tab"
    }
  },
  {
    id: "storyboard-ai",
    title: "Storyboard AI",
    description: "An app for planning and producing AI-generated videos — from script to shot list to final output.",
    category: "app",
    tech: ["AI", "Video Generation", "Product Design"],
    status: "coming-soon",
    deployUrl: "",
    preview: {
      mode: "external",
    }
  },
  {
    id: "flappy-bird-rebuild",
    title: "Happy Bird",
    description: "A from-scratch Processing remake of the classic tap-to-fly arcade game.",
    category: "game",
    tech: ["Processing", "Game Development"],
    status: "live",
    repoUrl: "https://github.com/ashsebban/happy-bird",
    deployUrl: "https://ashsebban.github.io/happy-bird/",
    preview: {
      mode: "embed",
      embedUrl: "https://ashsebban.github.io/happy-bird/",
      fallback: "new-tab"
    }
  },
  {
    id: "mindful-ocean",
    title: "Mindful Ocean",
    description: "An interactive ocean experience designed for calm focus and playful interaction.",
    category: "game",
    tech: ["Processing", "Animation", "Creative Coding"],
    status: "live",
    repoUrl: "https://github.com/ashsebban/mindful-ocean",
    deployUrl: "https://ashsebban.github.io/mindful-ocean/",
    preview: {
      mode: "embed",
      embedUrl: "https://ashsebban.github.io/mindful-ocean/",
      fallback: "new-tab"
    }
  },
  {
    id: "shape-runner-arcade",
    title: "Shape Runner",
    description: "A 3-mode shape-switch arcade runner originally built from a CS101 concept.",
    category: "game",
    tech: ["JavaScript", "Game Design", "OOP"],
    status: "live",
    repoUrl: "https://github.com/ashsebban/shape-runner",
    deployUrl: "https://ashsebban.github.io/shape-runner/",
    preview: {
      mode: "embed",
      embedUrl: "https://ashsebban.github.io/shape-runner/",
      fallback: "new-tab"
    }
  },
];
