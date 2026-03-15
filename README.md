# Sebban.tech

Personal portfolio built with Next.js 15 App Router, TypeScript, and Tailwind CSS.

This repo contains **website code only**. Project runtimes (games, apps, tools) live in separate repositories and are linked from the Projects page.

## Tech Stack

- Next.js 15 + React 19
- TypeScript
- Tailwind CSS
- React Hook Form + Zod (contact form)

## Quick Start

```bash
npm install
npm run dev
```

```bash
npm run build
npm start
```

> For file structure and architectural conventions, see [STRUCTURE.md](STRUCTURE.md).

## Resume File Contract

The hero quick actions route to `/resume`, which loads the PDF at:

- `public/images/asher_sebban_resume.pdf`

Resume text for the `/resume` clipboard CTA is auto-generated from the PDF into:

- `public/resume-content.txt`

It runs automatically before `npm run dev` and `npm run build` via:

- `npm run extract:resume:text`

## Projects Catalog

Project data lives at `app/(site)/projects/_content/projects.ts`. Each entry defines:

| Field | Purpose |
|---|---|
| `repoUrl` | Link to source code |
| `deployUrl` | Link to live runtime |
| `preview.mode` | `"embed"` (modal iframe) or `"external"` (new tab) |

When `preview.mode = "embed"`, the modal attempts an iframe. If the embed is blocked, it shows a fallback message and automatically opens `deployUrl` in a new tab.
