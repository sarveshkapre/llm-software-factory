# UI Workspace

One-prompt interface for `llm-software-factory`.

## Goal

Ask one question: `What do you want to build?`

The app resolves a target website, crawls it, captures screenshots with Playwright, maps endpoints, and scaffolds a full local project under a validated root path.

## Local Path Behavior

- Default output root path: current runtime directory.
- User can change path and validate it before run.
- On execution, a new folder is created in that root path.
- Website screenshots are saved to `artifacts/screenshots/` in the generated project.
- Scaffolded README includes: `Built by Codex, LLM AI Software Factory.`
- Screenshot folders are excluded from git via `.gitignore`.

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
- `src/app/api/factory/route.ts` - pipeline endpoint + default path
- `src/app/api/factory/validate-path/route.ts` - path validation endpoint
- `src/components/factory` - UI components
- `src/lib/factory` - orchestration, validation, and scaffolding logic
- `UI_GUIDELINES.md` - design and product constraints
