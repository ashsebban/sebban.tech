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
    deployUrl: "/apps/art-studio/index.html",
    preview: {
      mode: "external",
    }
  },
  {
    id: "b-seder",
    title: "B'Seder",
    description: "A goal-tracking app designed for the Orthodox Jewish community, tailored to the rhythms of frum life.",
    category: "app",
    tech: ["Goal Tracking", "Community Product", "Workflow Design"],
    status: "coming-soon",
    deployUrl: "",
    preview: {
      mode: "external",
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
    id: "cathedral-chess",
    title: "Cathedral Chess",
    collection: "chess",
    description: "Bishops gain a one-square sideways move, letting them change square color.",
    category: "game",
    tech: ["Chess engine", "Variant design"],
    status: "live",
    deployUrl: "/games/chess/index.html?mode=cathedral",
    preview: { mode: "external" },
  },
  {
    id: "lancer-chess",
    title: "Paladin Chess",
    collection: "chess",
    description: "Knights keep their L-shaped leap and gain a one-square sideways move.",
    category: "game",
    tech: ["Chess engine", "Variant design"],
    status: "live",
    deployUrl: "/games/chess/index.html?mode=lancer",
    preview: { mode: "external" },
  },
  {
    id: "concord-chess",
    title: "Royal Court Chess",
    collection: "chess",
    description: "Both bishops and knights gain a one-square sideways move.",
    category: "game",
    tech: ["Chess engine", "Variant design"],
    status: "live",
    deployUrl: "/games/chess/index.html?mode=concord",
    preview: { mode: "external" },
  },
  {
    id: "squires-chess",
    title: "Squire’s Chess",
    collection: "chess",
    description: "A knight directly behind a friendly pawn can advance both pieces together.",
    category: "game",
    tech: ["Chess engine", "Variant design"],
    status: "live",
    deployUrl: "/games/chess/index.html?mode=squires",
    preview: { mode: "external" },
  },
  {
    id: "royal-retinue-chess",
    collection: "chess",
    title: "Royal Retinue Chess",
    description: "The king borrows standard moves from its surviving army.",
    category: "game",
    tech: ["Chess engine", "Variant design"],
    status: "live",
    deployUrl: "/games/chess/index.html?mode=retinue",
    preview: { mode: "external" },
  },
  {
    id: "mongols-chess",
    collection: "chess",
    title: "Mongol’s Chess",
    description: "Raid two corner castles with mounted archers while defending your own.",
    category: "game",
    tech: ["Chess engine", "Variant design"],
    status: "live",
    deployUrl: "/games/chess/index.html?mode=mongols",
    preview: { mode: "external" },
  },
  {
    id: "flappy-bird-rebuild",
    title: "Sleepy Bird",
    description: "Keep a dozing bird in the air as you fly through a valley from dusk to dawn.",
    category: "game",
    tech: ["Processing", "Game Development"],
    status: "live",
    repoUrl: "https://github.com/ashsebban/happy-bird",
    deployUrl: "/game-preview/happy-bird/index.html",
    preview: {
      mode: "embed",
      embedUrl: "/game-preview/happy-bird/index.html",
      fallback: "new-tab"
    }
  },
  {
    id: "mindful-ocean",
    title: "Mindful Ocean",
    description: "Watch fish drift by, tap them to clear the ocean, or follow a guided breathing exercise.",
    category: "game",
    tech: ["Processing", "Animation", "Creative Coding"],
    status: "live",
    repoUrl: "https://github.com/ashsebban/mindful-ocean",
    deployUrl: "/game-preview/mindful-ocean/index.html",
    preview: {
      mode: "embed",
      embedUrl: "/game-preview/mindful-ocean/index.html",
      fallback: "new-tab"
    }
  },
  {
    id: "shape-runner-arcade",
    title: "Shape Runner",
    description: "Switch between circle, square, and triangle as you run. Each shape moves differently.",
    category: "game",
    tech: ["JavaScript", "Game Design", "OOP"],
    status: "live",
    repoUrl: "https://github.com/ashsebban/shape-runner",
    deployUrl: "/game-preview/shape-runner/index.html",
    preview: {
      mode: "embed",
      embedUrl: "/game-preview/shape-runner/index.html",
      fallback: "new-tab"
    }
  },
];
