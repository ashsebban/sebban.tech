# Project Structure

> **Keep this file in sync.** Any time you add, remove, or rename a file or folder, update this document to reflect the change.

---

## Strategy & Conventions

- **Framework:** Next.js 15 App Router with TypeScript and Tailwind CSS.
- **Route grouping:** `app/(site)/` is a route group (the parentheses prevent it from becoming a URL segment). All public-facing pages live here.
- **Colocation:** Components, content, and data that belong to a single route live _next to_ that route using `_`-prefixed folders (`_components/`, `_content/`). The underscore makes them private to Next.js — they are not routable.
- **Global vs. local components:** A component starts life colocated with its route. If it gets imported by a second route, it graduates to the root `components/` folder.
- **Data / logic separation:** Shared utilities and types live in `lib/`. Route-specific data (e.g. project list) lives in `_content/` next to its route.
- **Static assets:** Everything in `public/` is served at the root URL (`/images/headshot2.png` → `https://sebban.tech/images/headshot2.png`).

---

## Top-Level Files

| File | Purpose |
|---|---|
| `next.config.ts` | Next.js configuration (image domains, redirects, etc.) |
| `tailwind.config.ts` | Tailwind theme extensions and content paths |
| `postcss.config.js` | PostCSS pipeline (required by Tailwind) |
| `tsconfig.json` | TypeScript compiler config, path aliases (`@/*`) |
| `package.json` | Dependencies and npm scripts |
| `STRUCTURE.md` | This file — project map and conventions |
| `README.md` | Public-facing project overview |

---

## Folder Map

```
/
├── app/
│   ├── (site)/                   # Route group — all public pages
│   │   ├── _components/
│   │   │   └── Hero.tsx          # Home page hero section
│   │   ├── page.tsx              # Home page /
│   │   ├── blog/
│   │   │   ├── _components/
│   │   │   │   └── BlogCard.tsx  # Card used in the blog listing
│   │   │   ├── [slug]/
│   │   │   │   └── page.tsx      # Individual blog post /blog/:slug
│   │   │   └── page.tsx          # Blog index /blog
│   │   ├── contact/
│   │   │   ├── _components/
│   │   │   │   └── ContactForm.tsx
│   │   │   └── page.tsx          # Contact page /contact
│   │   ├── build-notes/
│   │   │   └── page.tsx          # Build Notes /build-notes
│   │   ├── projects/
│   │   │   ├── _components/
│   │   │   │   ├── ProjectCard.tsx
│   │   │   │   └── ProjectPreviewModal.tsx
│   │   │   ├── _content/
│   │   │   │   └── projects.ts   # Project data (title, description, links…)
│   │   │   └── page.tsx          # Projects page /projects
│   │   ├── references/
│   │   │   └── page.tsx          # References page /references
│   │   ├── resume/
│   │   │   └── page.tsx          # Resume viewer + CTA page /resume
│   ├── globals.css               # Global styles + Tailwind base imports
│   └── layout.tsx                # Root layout (fonts, Navbar, Footer)
│
├── components/                   # Global shared components
│   ├── icons/
│   │   └── SocialIcons.tsx       # GitHub, Twitter, LinkedIn icon set
│   ├── motion/
│   │   └── FadeIn.tsx            # Reusable Framer Motion fade-in wrapper
│   ├── navigation/
│   │   ├── Navbar.tsx            # Top navigation bar
│   │   └── Footer.tsx            # Site footer
│   └── ui/
│       └── Modal.tsx             # Generic modal primitive
│
├── content/                      # MDX source files for blog posts
│   └── blog/
│       ├── welcome-to-my-blog.mdx
│       └── building-with-nextjs.mdx
│
├── lib/                          # Shared utilities, types, and data
│   ├── blog.ts                   # MDX parsing helpers (getAllPosts, getPost)
│   ├── constants.ts              # Site-wide constants (name, nav links…)
│   ├── types.ts                  # Shared TypeScript types
│   └── shared/
│       └── projects.ts           # Shared project data (if used across routes)
├── scripts/
│   └── extract-resume-text.mjs   # Generates public/resume-content.txt from resume PDF
│
└── public/                       # Static assets, served at /
    ├── resume-content.txt        # Auto-generated plain-text resume content
    └── images/
        ├── asher_sebban_resume.pdf # Resume PDF source for /resume page
        └── headshot2.png
```

---

## Decision Log

| Decision | Reason |
|---|---|
| Route group `(site)` | Keeps app shell files (`layout.tsx`, `globals.css`) separate from page routes without affecting URLs |
| `_components` colocation | Enforces ownership — a component lives with the code that uses it |
| `lib/shared/` vs `_content/` | `lib/shared/` for data consumed by multiple routes; `_content/` for data owned by one route |
| Root `components/` folder | Only for components used in more than one route or in the root layout |
