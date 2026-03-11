// Central config: site name/description/URL, nav links, social links, and home-page copy
import {
  ChangelogEntry,
  NavLink,
  ProductThinkingItem,
  QuickActionLink,
  ReferencesPageContent,
  SelectedWorkItem,
  SocialLink,
  ToolkitCategory,
} from "./types";

// ——— Site metadata (SEO, OG, Twitter) ———
export const SITE_NAME = "Asher Sebban";
export const SITE_DESCRIPTION =
  "Product and systems builder exploring AI, automation, and developer tooling.";
export const SITE_URL = "https://ashersebban.com";
export const SITE_TAGLINE = "Product Leader | Systems Builder | AI Enthusiast";

export const HERO_SUBTITLE =
  "I build products and operational systems that help teams move faster.";

export const HERO_CREDIBILITY =
  "Former UX Researcher at Anaconda.";

// ——— Main nav (Navbar + Footer) ———
export const NAV_LINKS: NavLink[] = [
  { name: "Home", href: "/" },
  { name: "Projects", href: "/projects" },
  { name: "Video", href: "/video" },
  { name: "How I Built This", href: "/how-i-built-this" },
  { name: "Contact", href: "/contact" },
];

// ——— Social / contact (Footer, Contact page) ———
export const SOCIAL_LINKS: SocialLink[] = [
  { name: "GitHub", href: "https://github.com/ashsebban", icon: "FaGithub" },
  { name: "LinkedIn", href: "https://www.linkedin.com/in/asher-sebban/", icon: "FaLinkedin" },
  { name: "Email", href: "mailto:ashersamuelsebban@gmail.com", icon: "FaEnvelope" },
];

// ——— Home page Hero: "What I Do" cards ———
export const WHAT_I_DO = [
  {
    title: "Product Leadership",
    description:
      "I translate business goals and inspiring ideas into clear product direction and communicate team constraints to other stakeholders so we all align on what is possible. ",
  },
  {
    title: "Discovery & Insight",
    description:
      "I combine research, data, and product intuition to understand real problems. I turn insight into clear product decisions and focus teams on what actually matters.",
  },
  {
    title: "Rapid Prototyping & AI Systems",
    description:
      "I move quickly from idea to working MVP using AI and modern development tools. I prototype to test ideas early and turn ambiguous problems into real products teams can build on.",
  },
  {
    title: "Systems & Operational Infrastructure",
    description:
      "I design the internal systems that help organizations move faster. I build tools, workflows, and operational infrastructure that turn strategy into repeatable execution.",
  },
];

// ——— Home page: Product Thinking principles ———
export const PRODUCT_THINKING: ProductThinkingItem[] = [
  {
    principle: "Vision matters more now that everyone can build",
    description:
      "AI has dramatically lowered the cost of building. The constraint is no longer the ability to build, but the judgment to decide what should exist in the first place. The builders who thrive will be the ones with strong product intuition, a deep understanding of users, and clear business context.",
  },
  {
    principle: "Fix the system before adding technology",
    description:
      "When teams struggle, the instinct is often to reach for a new tool or AI solution. In many cases the real problem is the system itself. Clear workflows, shared context, and well-designed processes usually unlock more progress than additional technology layered on top of disorder.",
  },
  {
    principle: "Humans set direction, AI provides speed",
    description:
      "AI is most powerful when it amplifies clear thinking. Humans should define structure, strategy, and intent. AI can then accelerate execution. When AI is given ownership of the work instead of assisting it, teams often move faster in the short term but slower in the long run.",
  },
  {
    principle: "Build early to expose reality",
    description:
      "Ideas sound convincing until they encounter real constraints. Early prototypes expose assumptions, trade-offs, and edge cases much faster than discussion alone. Even rough tools can clarify thinking and dramatically improve decisions.",
  },
  {
    principle: "Favor leverage over effort",
    description:
      "The most valuable improvements often come from changing the system rather than working harder within it. A small improvement to a workflow, tool, or piece of infrastructure can compound across a team or organization. I look for changes that unlock progress at scale rather than solving problems one instance at a time.",
  },
  {
    principle: "Design systems that produce good outcomes",
    description:
      "Good products and good operations both shape behavior. Instead of focusing only on the end result, I try to design workflows and systems where the right actions become obvious, simple, and satisfying.",
  },
];

// ——— Home page: Selected Work cards ———
export const SELECTED_WORK: SelectedWorkItem[] = [
  {
    title: "Built AI Tools at Anaconda",
    description:
      "Developed internal AI tools and workflows to accelerate research synthesis and product decision making.",
  },
  {
    title: "Created ANACOMICS",
    description:
      "Designed a comic-style onboarding system explaining Python packaging, environments, and the Anaconda ecosystem for new employees.",
  },
  {
    title: "Research that Shaped Product Roadmaps",
    description:
      "Led UX research that directly informed roadmap priorities and product strategy across multiple product cycles.",
  },
  {
    title: "Built Infrastructure for a 20-Person UX Organization",
    description:
      "Created the tooling, workflows, and systems that supported research and product teams across the organization.",
  },
];

// ——— Home page: Toolkit section ———
export const TOOLKIT: ToolkitCategory[] = [
  {
    category: "Research",
    tools: [
      { name: "SurveyMonkey" },
      { name: "Great Question" },
      { name: "Google Suite" },
    ],
  },
  {
    category: "Design",
    tools: [
      { name: "Miro" },
      { name: "Figma", learning: true },
    ],
  },
  {
    category: "AI & Code",
    tools: [
      { name: "Claude Code" },
      { name: "Codex" },
      { name: "OpenClaw" },
      { name: "Anaconda Assistant" },
    ],
  },
];

// ——— How I Built This: changelog entries ———
export const CHANGELOG: ChangelogEntry[] = [
  {
    date: "2026-02-11",
    label: "Feb 2026",
    feature: "Site launched",
    note: "Initial build with Next.js, TypeScript, and Tailwind CSS. Started from scratch rather than a template — structure and copy written from a hiring manager's perspective.",
  },
  {
    date: "2026-02-18",
    label: "Feb 2026",
    feature: "Rebuilt + games added",
    note: "Stripped the first version and rebuilt with a dark theme and cleaner layout. Added three embedded browser games: a Processing-style canvas, a calming Fishtank, and Shape Runner v2.",
  },
  {
    date: "2026-03-10",
    label: "Mar 2026",
    feature: "ANACOMICS",
    note: "ANACOMICS is a comic series explaining Python packaging, environments, and the Anaconda ecosystem. Launched the Deployment Architecture module — 7 pages with custom image sequencing, serif typography, and an accessible panel layout.",
  },
  {
    date: "2026-03-11",
    label: "Mar 2026",
    feature: "Homepage redesign",
    note: "Repositioned the site around product and systems thinking. Rewrote all copy, restructured every section, and replaced static lists with an accordion, a 2×2 card grid, a Toolkit, and this build log.",
  },
];

// ——— Home page Hero: CTA links + quick actions ———
export const RESUME_PDF_PATH = "/images/asher_sebban_resume.pdf";

export const QUICK_ACTIONS: QuickActionLink[] = [
  { label: "See My Work",  href: "/projects", variant: "primary",   external: false },
  { label: "View Resume",  href: "/resume",   variant: "secondary", external: false },
  { label: "Let's Talk →", href: "/contact",  variant: "text",      external: false },
];

// ——— References page: logo paths per group (drop files into /public/logos/) ———
export const REFERENCE_GROUP_LOGOS: Record<string, string> = {
  Anaconda: "/logos/anaconda.png",
  "LTC Ally": "/logos/ltc-ally.png",
  NYU: "/logos/nyu.png",
};

// ——— References page content (placeholder launch) ———
export const REFERENCES_PAGE: ReferencesPageContent = {
  title: "References",
  intro:
    "A selection of leaders, professors, and mentors I have worked with directly.",
  statusNote: "Additional references are available upon request.",
  references: [
    { group: "Anaconda", name: "Barry Libert", role: "ex-CEO" },
    { group: "Anaconda", name: "Saundra Monroe", role: "VP of Anaconda AI Platform" },
    { group: "Anaconda", name: "Melissa Stamer", role: "Senior UX Researcher" },
    { group: "LTC Ally", name: "Shachi Nubaum", role: "CTO" },
    { group: "LTC Ally", name: "Michael Bauman", role: "CEO" },
    { group: "NYU", name: "Professor Amos Bloomberg", role: "Computer Science" },
    { group: "Mentors", name: "Tom Steinberg", role: "Founder, TS Partners · Finance" },
    { group: "Mentors", name: "Brad Berger", role: "ex-CEO · Real Estate" },
    { group: "Mentors", name: "Alex Oppenheimer", role: "Founder, Verissimo Ventures · VC" },
  ],
};
