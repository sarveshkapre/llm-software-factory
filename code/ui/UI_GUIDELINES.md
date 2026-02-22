# UI Guidelines

This workspace implements a single-product surface: one prompt in, local project out.

## Product Contract

- Primary question: `What do you want to build?`
- User provides:
  - one prompt
  - one local output root path
- System performs:
  - target resolution (direct URL or competitor fallback)
  - website crawl and endpoint discovery
  - screenshot capture planning
  - feature map extraction
  - modular build blueprint generation
  - local project folder scaffolding under selected root path

## Local Build Rules

- Default output path is the current runtime directory.
- Path must be an absolute, existing, writable local directory.
- A new project folder is always created under the selected root.
- Generated README files must include: `Built by Codex, LLM AI Software Factory.`

## Stack

- Next.js App Router
- Tailwind CSS v4
- shadcn/ui primitives

## UX Principles

- Keep interface singular and focused on one action.
- Keep path selection explicit and validated before execution.
- Show pipeline transparency (steps, statuses, fallback reason).
- Prefer clean whitespace and restrained visual hierarchy.

## Architecture

- `src/components/factory` - prompt studio and result report
- `src/app/api/factory` - pipeline + default path API
- `src/app/api/factory/validate-path` - path validation API
- `src/lib/factory` - typed orchestration and scaffolding modules
