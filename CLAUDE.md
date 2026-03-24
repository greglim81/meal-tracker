# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Docs-First Requirement

**Before generating any code, always read the relevant file(s) in `/docs/` first.** The `/docs/` directory contains coding standards and conventions that all generated code must follow. If a relevant docs file exists for the area you are working in (UI, API, database, etc.), consult it before writing any code.

- /docs/ui.md
- /docs/data-fetching.md
- /docs/auth.md
- /docs/data-mutations.md

## Commands

```bash
npm run dev      # Start development server on http://localhost:3000
npm run build    # Production build
npm run lint     # Run ESLint
```

## Stack

- **Next.js 16.2.0** (App Router) — see `node_modules/next/dist/docs/` for this version's API
- **React 19.2.4**
- **TypeScript**
- **Tailwind CSS v4** (via `@tailwindcss/postcss`)

## Architecture

Uses the App Router under `src/app/`. Currently a scaffolded starter — `layout.tsx` sets up Geist fonts and a flex-column body; `page.tsx` is the home route.

Route files go in `src/app/`. Shared UI belongs in `src/components/` (create as needed). There is no data layer yet.
