// Central config: site name/description/URL, nav links, social links, and home-page copy
import {
  NavLink,
  QuickActionLink,
  ReferencesPageContent,
  SocialLink,
} from "./types";

// ——— Site metadata (SEO, OG, Twitter) ———
export const SITE_NAME = "Asher Sebban";
export const SITE_DESCRIPTION =
  "Product-minded builder using AI to research, prototype, and ship. Background in UX, ops, and engineering. Early career, broad range, high output.";
export const SITE_URL = "https://ashersebban.com";
export const SITE_TAGLINE =
  "Product Leader | AI Enthusiast | ex-Anaconda";

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
      "I turn business goals and real constraints into clear product direction. I define strategy, prioritize the right bets, and build roadmaps that move the business forward.",
  },
  {
    title: "Product Discovery & Insight",
    description:
      "I combine research, data, and product intuition to understand real problems. I turn insight into clear product decisions and focus teams on what actually matters.",
  },
  {
    title: "Rapid Prototyping & AI Development",
    description:
      "I move quickly from idea to working MVP using AI and modern development tools. I prototype to test ideas early and turn ambiguous problems into real products teams can build on.",
  },
  {
    title: "Systems & Operational Infrastructure",
    description:
      "I design the internal systems that help organizations move faster. I build tools, workflows, and operational infrastructure that turn strategy into repeatable execution.",
  },
];

// ——— Home page Hero: highlight tag pills ———
export const HIGHLIGHTS = [
  "Built AI tools at Anaconda",
  "Ran user research that moved product decisions",
  "Created ANACOMICS onboarding system",
  "Built operational infrastructure for a 20-person UX org",
];

// ——— Home page: tools currently being learned ———
export const CURRENTLY_LEARNING = ["OpenClaw", "CodeCode", "Codex"];

// ——— Home page Hero: CTA links + quick actions ———
export const RESUME_PDF_PATH = "/images/asher_sebban_resume.pdf";

export const QUICK_ACTIONS: QuickActionLink[] = [
  { label: "See My Work", href: "/projects", variant: "primary", external: false },
  { label: "Get to Know Me", href: "/video", variant: "secondary", external: false },
  { label: "View Resume", href: "/resume", variant: "secondary", external: false },
  { label: "See References", href: "/references", variant: "secondary", external: false },
  { label: "Let's Talk →", href: "/contact", variant: "text", external: false },
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
