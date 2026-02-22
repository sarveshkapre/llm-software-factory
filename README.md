# llm-software-factory

Starter project for building LLM-powered software workflows.

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

- `src/llm_software_factory/` - Python application package
- `tests/` - Python test suite
- `code/ui/` - Next.js + Tailwind + shadcn frontend
- `pyproject.toml` - Python project configuration
