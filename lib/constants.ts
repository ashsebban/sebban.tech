// Central config: site name/description/URL, nav links, social links, and home-page copy
import { NavLink, SocialLink } from "./types";

// ——— Site metadata (SEO, OG, Twitter) ———
export const SITE_NAME = "Asher Sebban";
export const SITE_DESCRIPTION =
  "Product-minded builder using AI to research, prototype, and ship. Background in UX, ops, and systems. Early career, broad range, high output.";
export const SITE_URL = "https://ashersebban.com";
export const SITE_TAGLINE =
  "I learn how things work — and I make them work better.";

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
      "I translate research and user insight into decisions teams can actually act on — priorities, roadmaps, and bets worth taking.",
  },
  {
    title: "UX Research",
    description:
      "I run research that moves products forward — not just studies, but decisions. I find the patterns that turn assumptions into action.",
  },
  {
    title: "Prototyping & Building",
    description:
      "I use AI to go from problem to working prototype fast — then I iterate until it's real. I build to think, and I think to build.",
  },
  {
    title: "Systems & Operations",
    description:
      "I design the processes behind the product. Workflow optimization, cross-functional coordination, and tooling that helps teams move faster.",
  },
];

// ——— Home page Hero: highlight tag pills ———
export const HIGHLIGHTS = [
  "Built AI tools at Anaconda",
  "Ran user research that moved product decisions",
  "Created ANACOMICS onboarding system",
  "Built operational infrastructure for a 20-person UX org",
];
