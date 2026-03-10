// Central config: site name/description/URL, nav links, social links, and home-page copy
import {
  NavLink,
  ProductThinkingItem,
  QuickActionLink,
  ReferencesPageContent,
  SelectedWorkItem,
  SocialLink,
} from "./types";

// ——— Site metadata (SEO, OG, Twitter) ———
export const SITE_NAME = "Asher Sebban";
export const SITE_DESCRIPTION =
  "Product and systems builder exploring AI, automation, and developer tooling.";
export const SITE_URL = "https://ashersebban.com";
export const SITE_TAGLINE = "Product Strategy | Systems | AI";

export const HERO_SUBTITLE =
  "I build products and operational systems that help teams move faster.";

export const HERO_CREDIBILITY =
  "Former UX Researcher at Anaconda. Builder of AI tools and product infrastructure.";

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
    title: "Product Strategy",
    description:
      "I turn business goals and real constraints into clear product direction. I define strategy, prioritize the right bets, and build roadmaps that move the business.",
  },
  {
    title: "Product Discovery & Insight",
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
    principle: "Start with the problem, not the solution",
    description:
      "Good product work begins by deeply understanding the problem space before jumping to what to build.",
  },
  {
    principle: "Make it real, then make it right",
    description:
      "Ship something working early. A rough prototype in front of users beats a perfect spec in a doc.",
  },
  {
    principle: "Systems over heroics",
    description:
      "Sustainable teams run on processes and infrastructure, not individual effort or constant firefighting.",
  },
  {
    principle: "Clarity is the job",
    description:
      "Whether writing a spec, running a meeting, or building a dashboard — making things clear for others is always the work.",
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

// ——— Home page: Current Focus pills ———
export const CURRENT_FOCUS = ["AI agents", "Developer tooling", "Autonomous workflows"];

export const CURRENT_FOCUS_NOTE =
  "Currently experimenting with OpenClaw, Codex, and agent systems.";

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
