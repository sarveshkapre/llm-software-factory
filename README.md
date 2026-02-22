# llm-software-factory

Prompt-to-production software factory.

## Product Goal

One prompt: `What do you want to build?`

The system resolves a target website (or competitor fallback), crawls pages, captures screenshots, maps endpoints, and scaffolds a local project in a user-selected path.

## Local Scaffold Rules

- User selects a local output root path in the UI.
- Path is validated before execution.
- A new project folder is created under that root path.
- Captured screenshots are saved in `artifacts/screenshots/` inside the generated project.
- Generated README files include: `Built by Codex, LLM AI Software Factory.`

## Backend Quickstart

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -e .[dev]
pytest
python -m llm_software_factory
```

## UI Quickstart

```bash
cd code/ui
npm install
npm run dev
```

## Project Layout

- `src/llm_software_factory/` - Python package
- `tests/` - Python tests
- `code/ui/` - Next.js + Tailwind + shadcn frontend
