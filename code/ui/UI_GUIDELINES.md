# UI Guidelines

This workspace implements a single-product surface: one prompt in, production blueprint out.

## Product Contract

- Primary question: `What do you want to build?`
- User enters one prompt only.
- System performs:
  - target resolution (direct URL or competitor fallback)
  - website crawl and endpoint discovery
  - screenshot capture planning
  - feature map extraction
  - modular build blueprint generation

## Stack

- Next.js App Router
- Tailwind CSS v4
- shadcn/ui primitives

## UX Principles

- Keep interface singular and focused on one action.
- Show pipeline transparency (steps, statuses, fallback reason).
- Prefer clean whitespace and restrained visual hierarchy.
- Keep implementation modular and inspectable.

## Architecture

- `src/components/factory` - prompt studio and result report
- `src/app/api/factory` - prompt-to-production API entrypoint
- `src/lib/factory` - typed orchestration modules
