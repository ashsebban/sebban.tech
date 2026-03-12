# AI Guide — Sebban.tech

Context and rules for any AI assistant working in this codebase.
See [STRUCTURE.md](STRUCTURE.md) for the full file map and architectural conventions.

---

## What This Project Is

A personal portfolio/blog site. It is intentionally simple. The goal is a clean, fast, maintainable site — not a feature-rich platform. Resist the urge to over-engineer.

---

## Rules

### Always
- Keep components colocated with their route unless they are used in more than one place.
- Update `STRUCTURE.md` whenever a file or folder is added, removed, or renamed.
- Use the existing Tailwind config and design tokens — do not add arbitrary values.
- Write TypeScript. No `any` without a comment explaining why.
- Keep pages as server components by default. Add `"use client"` only when interactivity requires it.

### Never
- Do not add new dependencies without asking first.
- Do not move or restructure folders without asking first.
- Do not add comments or docstrings to code you didn't touch.
- Do not create a new abstraction for something that only exists once.
- Do not add error handling for scenarios that cannot happen.
- Do not commit or push without being explicitly asked to.

---

## Key Conventions

**Component location:**
- Used in one route → `app/(site)/<route>/_components/`
- Used in two or more routes → `components/<category>/`

**Data location:**
- Owned by one route → `app/(site)/<route>/_content/`
- Shared across routes → `lib/shared/`

**Types and utilities:**
- Shared types → `lib/types.ts`
- Site-wide constants → `lib/constants.ts`
- MDX/blog helpers → `lib/blog.ts`

**`_` prefix folders** (`_components/`, `_content/`) are private to their route segment — Next.js will not treat them as routes.

---

## What to Check Before Making Changes

1. Read the relevant file before editing it.
2. Check `lib/types.ts` before creating a new type — it may already exist.
3. Check `lib/constants.ts` before hardcoding a string — it may already be there.
4. Check `components/ui/` before building a new primitive (Modal, etc.).

---

## Files That Must Stay in Sync

| File | Update when… |
|---|---|
| `STRUCTURE.md` | Any file/folder is added, removed, or renamed |
| `AI_GUIDE.md` | Conventions or rules change |
| `lib/types.ts` | A new shared type is introduced |
| `lib/constants.ts` | A new site-wide constant is introduced |
| `app/(site)/projects/_content/projects.ts` | A project is added or updated |
