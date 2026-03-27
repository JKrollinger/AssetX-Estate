# CLAUDE.md — AssetX-Estate

This file provides guidance for AI assistants (Claude Code and others) working on this repository.

---

## Project Overview

**AssetX-Estate** is a real estate workflow and process management system.

> README (Thai): "เพื่อสร้างกระบวนการทำงานอสังหาริมทรัพย์"
> Translation: "To create a real estate workflow/process system"

The project is in its **initial stage** — no source code, dependencies, or infrastructure have been set up yet. This CLAUDE.md will be updated as the codebase evolves.

---

## Repository State (as of 2026-03-27)

```
AssetX-Estate/
├── .git/
├── CLAUDE.md        (this file)
└── README.md
```

- No package manager or language/framework chosen yet
- No CI/CD, Docker, or deployment configuration
- No database schema or API design
- One commit in history: "Initial commit" (2026-03-09)

---

## Git Workflow

### Branch Strategy

- `main` — stable, production-ready code
- `claude/<description>` — branches created by AI assistants for documentation or automated tasks
- Feature branches should follow: `feature/<short-description>`
- Bug fix branches: `fix/<short-description>`

### Current Working Branch

When contributing automated changes, develop on the designated branch provided in the session context (e.g., `claude/add-claude-documentation-ayU5D`).

### Commit Conventions

Use clear, descriptive commit messages in the imperative mood:

```
Add CLAUDE.md with project overview and conventions
Fix property listing pagination bug
Update README with setup instructions
```

- Do NOT amend published commits
- Do NOT force-push to `main`
- Always push with: `git push -u origin <branch-name>`

### Remote

```
http://local_proxy@127.0.0.1:45009/git/JKrollinger/AssetX-Estate
```

GitHub repository: `jkrollinger/assetx-estate`

---

## Development Guidelines for AI Assistants

### General Principles

1. **Read before editing** — always read a file before modifying it
2. **Minimal changes** — only change what is necessary for the task; do not refactor surrounding code
3. **No speculative features** — do not add functionality not explicitly requested
4. **No unnecessary files** — prefer editing existing files over creating new ones
5. **No documentation files** (`.md`) unless explicitly requested

### Security

- Never commit secrets, API keys, tokens, or credentials
- Validate all external input (user input, API responses) at system boundaries
- Avoid OWASP Top 10 vulnerabilities: SQL injection, XSS, command injection, etc.
- If insecure code is written, fix it immediately

### Risky Actions — Require Confirmation

Always ask the user before:
- Deleting files or branches
- Force-pushing or hard-resetting
- Modifying CI/CD pipelines
- Pushing to `main`
- Creating pull requests (unless explicitly asked)

---

## Planned Domain: Real Estate Workflow

Based on the README, this system is intended to manage real estate processes. Likely domain concepts include:

- **Properties** — listings, units, land parcels
- **Transactions** — sales, rentals, leases
- **Agents / Brokers** — user roles and assignments
- **Clients / Leads** — contact and CRM data
- **Documents** — contracts, title deeds, inspections
- **Workflow stages** — inquiry → viewing → offer → contract → closing

These are inferred from the project name and description. Confirm with the user before building any of these.

---

## How to Update This File

Update CLAUDE.md whenever:
- A technology stack is chosen (language, framework, database)
- A new architectural pattern is established
- Testing or linting conventions are added
- New environment variables or configuration files are introduced
- Deployment infrastructure is set up

Keep this file accurate — it is the primary reference for AI assistants onboarding to this project.
