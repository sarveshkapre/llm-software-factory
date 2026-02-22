# UI Workspace

Frontend for `llm-software-factory`.

## Stack

- Next.js (App Router)
- Tailwind CSS v4
- shadcn/ui

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

## Structure

- `src/components/ui` - shadcn primitives
- `src/components/sections` - page sections
- `src/components/layout` - layout-level visual primitives
- `src/content` - static page copy/data
- `src/app` - route entrypoints and global styles

See `UI_GUIDELINES.md` for design direction.
