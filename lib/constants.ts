import { NavLink, SocialLink } from "./types";

// Site Metadata
export const SITE_NAME = "Asher Sebban";
export const SITE_DESCRIPTION = "Product leader specializing in UX research, AI prototyping, and systems operations";
export const SITE_URL = "https://ashersebban.com";
export const SITE_TAGLINE = "Product • AI Prototyping • UX Research • Systems & Ops";

// Navigation Links
export const NAV_LINKS: NavLink[] = [
  { name: "Home", href: "/" },
  { name: "Projects", href: "/projects" },
  { name: "Blog", href: "/blog" },
  { name: "Video", href: "/video" },
  { name: "Contact", href: "/contact" },
];

// Social Links
export const SOCIAL_LINKS: SocialLink[] = [
  { name: "GitHub", href: "https://github.com/ashersebban", icon: "FaGithub" },
  { name: "LinkedIn", href: "https://linkedin.com/in/asher-sebban", icon: "FaLinkedin" },
  { name: "Email", href: "mailto:ashersamuelsebban@gmail.com", icon: "FaEnvelope" },
];

// Skills
export const SKILLS = [
  "UX Research",
  "Product Strategy",
  "AI Prototyping",
  "Python & SQL",
  "JavaScript/TypeScript",
  "Systems & Ops",
  "Jira & Confluence",
  "User Interviews",
];

// Interests
export const INTERESTS = [
  "Chess",
  "Musical Performance & Songwriting",
  "Basketball",
  "Product Design",
  "AI & Technology",
  "Writing",
];

// About
export const ABOUT_TEXT = `
Hey! I'm Asher, a product leader who bridges the gap between complex technical products and the people who use them.

I spent the last few years at Anaconda working in UX research and product operations, where I learned that the best products come from deeply understanding both the technology and the humans interacting with it. I've built everything from AI-assisted internal tools to comic-style onboarding systems (ANACOMICS), always with the goal of making complex things intuitive.

I love prototyping solutions, optimizing team workflows, and diving deep into user research. Whether it's conducting user interviews, building staging-ready prototypes, or designing systems that help teams execute better, I'm driven by the challenge of turning messy problems into plans teams can actually execute.

When I'm not building or researching, you'll find me playing chess, writing music, or on the basketball court.

Currently exploring opportunities where I can combine product strategy, user research, and hands-on building to create products that truly resonate with users.
`;
