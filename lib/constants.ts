// Central config: site name/description/URL, nav links, social links, and home-page copy
import {
  AboutHighlight,
  ChangelogEntry,
  NavLink,
  ProductThinkingItem,
  QuickActionLink,
  ReferencesPageContent,
  SocialLink,
  ToolkitCategory,
  WorkPillar,
} from "./types";

// ——— Site metadata (SEO, OG, Twitter) ———
export const SITE_NAME = "Asher Sebban";
export const SITE_DESCRIPTION =
  "Product leader and builder working at the intersection of AI, research, and systems.";
export const SITE_URL = "https://sebban.tech";
export const SITE_TAGLINE = "Product Builder | Systems Thinker";

export const HERO_SUBTITLE =
  "I find what's broken, build what's needed, and make it feel simple.";

export const HERO_CREDIBILITY = "Previously at Anaconda";

// ——— Main nav (Navbar + Footer) ———
export const NAV_LINKS: NavLink[] = [
  { name: "Home", href: "/" },
  { name: "Projects", href: "/projects" },
  { name: "About", href: "/about" },
  { name: "Build Notes", href: "/how-i-built-this" },
  { name: "Contact", href: "/contact" },
];

// ——— Social / contact (Footer, Contact page) ———
export const SOCIAL_LINKS: SocialLink[] = [
  { name: "GitHub", href: "https://github.com/ashsebban", icon: "FaGithub" },
  { name: "LinkedIn", href: "https://www.linkedin.com/in/asher-sebban/", icon: "FaLinkedin" },
  { name: "Email", href: "mailto:ashersamuelsebban@gmail.com", icon: "FaEnvelope" },
];

// ——— Home page: "How I Create Impact" pillars (capability + work examples) ———
export const WORK_PILLARS: WorkPillar[] = [
  {
    capability: "Product Leadership",
    capabilityDesc:
      "I make ideas tangible before committing to them: building prototypes, stress-testing assumptions, and giving teams something real to react to.",
    examples: [
      {
        title: "De-risked a Five-Figure License Initiative",
        description:
          "Built a staging-ready prototype before any budget was committed, giving leadership the confidence to move forward and engineering a clear spec to implement. It helped turn an abstract idea into something tangible enough to evaluate seriously.",
      },
      {
        title: "Created ANACOMICS",
        description:
          "Created a comic-style onboarding series to make Python packaging and the Anaconda ecosystem feel simple. It became a go-to internal resource for engineers and new users who found the existing documentation too dense to navigate.",
        preview: true,
      },
    ],
  },
  {
    capability: "User Research",
    capabilityDesc:
      "Good product decisions come from sustained contact with users, not opinions in a room. I design research that answers the questions that actually matter to the roadmap.",
    examples: [
      {
        title: "UXR Across 6+ Products",
        description:
          "Led end-to-end research across 6+ product areas (interviews, usability testing, and surveys), translating findings directly into roadmap decisions rather than letting them sit in decks.",
      },
      {
        title: "Developer Conference Research",
        description:
          "Owned booth strategy and structured research at developer conferences, exceeding team goals by 200%+ and surfacing patterns the team had not previously seen. Turned high-volume conversations into a repeatable research playbook.",
      },
    ],
  },
  {
    capability: "Prototyping & AI",
    capabilityDesc:
      "I use AI to compress the gap between idea and working artifact, then use what I build to make better decisions faster.",
    examples: [
      {
        title: "5+ AI-Assisted Internal Tools",
        description:
          "Built and shipped 5+ AI-assisted internal tools that reduced research synthesis time, standardized deliverables, and improved consistency across the team.",
      },
      {
        title: "Built Sebban.tech",
        description:
          "Designed and coded this portfolio from scratch over a month — no templates, no Lovable, no drag-and-drop. Custom Next.js, TypeScript, and Tailwind, built with an AI-assisted workflow where I wrote and reviewed every line. The build log is on this site.",
        href: "/how-i-built-this",
      },
    ],
  },
  {
    capability: "Systems & Operations",
    capabilityDesc:
      "Strong teams run on strong systems. I build the workflows, tooling, and governance structures that let teams move fast without creating chaos.",
    examples: [
      {
        title: "UX Ops Infrastructure for a 20-Person Org",
        description:
          "Built intake systems, planning workflows, and Jira/Confluence governance for a 4-person research team operating inside a ~20-person UX organization, improving visibility, coordination, and day-to-day execution.",
      },
      {
        title: "ResearchOps Toolkit",
        description:
          "Standardized screeners, moderation guides, and research protocols, reducing setup time per study and helping the team run more research with the same headcount.",
      },
    ],
  },
];

// ——— Home page: Product Thinking principles ———
export const PRODUCT_THINKING: ProductThinkingItem[] = [
  {
    principle: "Fix the system first",
    description:
      "Most problems that look like technology problems are actually workflow problems. In my experience, the right process without AI will often outperform powerful AI layered on top of a broken system. Technology amplifies what is already there, good or bad.",
  },
  {
    principle: "Prototype early",
    description:
      "Ideas are easy to agree with. Prototypes are where reality shows up. A working artifact can reveal in a day what weeks of discussion often cannot: what actually works, what breaks, and which assumptions were wrong from the start.",
  },
  {
    principle: "Users decide what matters",
    description:
      "A product can be technically impressive and still fail if it does not fit the way people actually work. Good product decisions come from sustained contact with users, not just opinions in a room. My background in research shaped this view deeply.",
  },
  {
    principle: "Products are habits",
    description:
      "James Clear writes, \"You do not rise to the level of your goals. You fall to the level of your systems.\" The best products do not succeed just because they exist or even because they are better. They succeed when they change behavior: when the right action becomes obvious, easy, and satisfying enough to repeat.",
  },
  {
    principle: "Use AI with judgment",
    description:
      "I use AI constantly for prototyping, synthesis, analysis, and development. But AI accelerates clear thinking; it does not replace it. My rule is simple: humans set direction, AI provides leverage. Used well, it gives individuals the speed of a much larger team.",
  },
];


// ——— Home page: Toolkit section ———
export const TOOLKIT: ToolkitCategory[] = [
  {
    category: "UX | Research",
    tools: [
      { name: "Figma", icon: "SiFigma" },
      { name: "Miro", icon: "SiMiro" },
      { name: "Canva", icon: "SiCanva" },
      { name: "Loom", icon: "SiLoom" },
      { name: "sep-1", separator: true },
      { name: "SurveyMonkey", icon: "SiSurveymonkey" },
      { name: "Great Question" },
      { name: "Google Suite", icon: "SiGoogle" },
      { name: "Notion", icon: "SiNotion", comingSoon: true },
    ],
  },
  {
    category: "AI Tools",
    tools: [
      { name: "Anthropic", icon: "SiAnthropic" },
      { name: "OpenAI", icon: "SiOpenai" },
      { name: "OpenClaw", emoji: "🦞" },
      { name: "Hugging Face", icon: "SiHuggingface", comingSoon: true },
    ],
  },
  {
    category: "Development",
    tools: [
      { name: "Python", icon: "SiPython" },
      { name: "JavaScript", icon: "SiJavascript" },
      { name: "HTML", icon: "SiHtml5" },
      { name: "CSS", icon: "SiCss" },
      { name: "SQL", icon: "SiMysql" },
      { name: "Java", icon: "SiOpenjdk" },
      { name: "sep-2", separator: true },
      { name: "GitHub", icon: "SiGithub" },
      { name: "Vercel", icon: "SiVercel" },
      { name: "Anaconda", icon: "SiAnaconda" },
      { name: "Jupyter", icon: "SiJupyter" },
    ],
  },
  {
    category: "Project Management",
    tools: [
      { name: "Jira", icon: "SiJira" },
      { name: "Confluence", icon: "SiConfluence" },
      { name: "Slack", icon: "SiSlack" },
      { name: "Notion", icon: "SiNotion", comingSoon: true },
      { name: "Monday", icon: "SiMondaydotcom", comingSoon: true },
      { name: "ClickUp", icon: "SiClickup", comingSoon: true },
    ],
  },
];

// ——— How I Built This: changelog entries ———
export const CHANGELOG: ChangelogEntry[] = [
  {
    date: "2026-02-11",
    label: "Feb 2026",
    feature: "Site launched",
    note: "Initial build with Next.js, TypeScript, and Tailwind CSS. Started from scratch rather than a template. Structure and copy written from a hiring manager's perspective.",
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
    note: "ANACOMICS is a comic series explaining Python packaging, environments, and the Anaconda ecosystem. Launched the Deployment Architecture module: 7 pages with custom image sequencing, serif typography, and an accessible panel layout.",
  },
  {
    date: "2026-03-11",
    label: "Mar 2026",
    feature: "Homepage redesign",
    note: "Repositioned the site around product and systems thinking. Rewrote all copy, restructured every section, and replaced static lists with an accordion, a 2×2 card grid, a Toolkit, and this build log.",
  },
  {
    date: "2026-03-12",
    label: "Mar 2026",
    feature: "sebban.tech is live",
    note: "Deployed the site end-to-end: code lives on GitHub, Vercel pulls from the master branch and rebuilds on every push, and Hostinger DNS routes sebban.tech to Vercel via A and CNAME records. Also shipped a full SEO pass: self-hosted fonts, dynamic OG image, favicon, sitemap, and robots.txt.",
  },
];

// ——— Home page Hero: CTA links + quick actions ———
export const FOOTER_TAGLINE =
  "I build products, prototypes, and the systems that help teams ship faster.";

export const RESUME_PDF_PATH = "/images/asher_sebban_resume.pdf";

export const QUICK_ACTIONS: QuickActionLink[] = [
  { label: "See My Work",  href: "/projects", variant: "primary",   external: false },
  { label: "View Resume",  href: "/resume",   variant: "secondary", external: false },
  { label: "Let's Talk →", href: "/contact",  variant: "text",      external: false },
];

// ——— About page: highlight cards ———
export const ABOUT_HIGHLIGHTS: AboutHighlight[] = [
  {
    label: "Education · 2017–2021",
    value: "NYU Gallatin School",
    detail: "Designed an interdisciplinary concentration spanning business, computer science, design, and the humanities. Gallatin requires students to defend why their combination of fields matters. That experience shaped how I approach complex problems.",
  },
  {
    label: "Jerusalem · 2022–2024",
    value: "The Heiden Institute",
    detail: "Studied Talmudic law, Jewish philosophy, and ethics. The experience deepened my discipline and clarified the values I bring to work: responsibility, intellectual honesty, and commitment to community.",
  },
  {
    label: "Career · 2024–2026",
    value: "Anaconda → Product",
    detail: "Joined Anaconda as a Product Operations intern and later returned as a UX Researcher. My work expanded well beyond traditional research: building ops systems, shipping internal AI tools, creating ANACOMICS onboarding, and helping teams move faster through better workflows and prototypes.",
  },
  {
    label: "How I work",
    value: "Builder by default",
    detail: "When I see a recurring problem (unclear workflows, slow research cycles, missing documentation) I tend to build something to fix it. Sometimes a prototype, sometimes a system, sometimes documentation that makes complex tools understandable. The goal is always the same: make the team more effective.",
  },
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
