# UI Guidelines

This folder contains the frontend implementation and guideline baseline.

## Stack

- Next.js App Router
- Tailwind CSS v4
- shadcn/ui primitives

## Design Direction

- Minimal composition with strong whitespace and clear hierarchy.
- Neutral, warm color system with subtle gradients.
- Expressive typography pairing:
  - Sans: `Sora`
  - Display accent: `Cormorant Garamond`
  - Mono details: `IBM Plex Mono`
- Motion should be sparse and meaningful.

## Architecture

- Compose pages from modular sections under `src/components/sections`.
- Keep non-visual copy and content in `src/content` for easy iteration.
- Use shadcn primitives from `src/components/ui` to maintain consistency.
