# llm-software-factory

Prompt-to-production software factory.

## Product Goal

One prompt: `What do you want to build?`

The system resolves a target website (or best competitor fallback), crawls pages, maps endpoints, plans screenshot coverage, and generates a modular implementation blueprint.

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
