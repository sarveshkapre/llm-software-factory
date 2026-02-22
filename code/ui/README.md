# UI Workspace

One-prompt interface for `llm-software-factory`.

## Goal

Ask one question: `What do you want to build?`

The app resolves a target website, crawls it, maps endpoints, plans screenshot capture, and outputs a modular blueprint.

## Run

```bash
npm install
npm run dev
```

## Validate

```bash
npm run lint
npm run build
```

## Core Paths

- `src/app/page.tsx` - one-prompt experience
- `src/app/api/factory/route.ts` - pipeline endpoint
- `src/components/factory` - UI components
- `src/lib/factory` - orchestration logic and types
- `UI_GUIDELINES.md` - design and product constraints
