# CLAUDE.md — AssetX-Estate

This file provides guidance for AI assistants (Claude Code and others) working on this repository.

---

## Project Overview

**AssetX-Estate** is a real estate workflow and process management system.

> README (Thai): "เพื่อสร้างกระบวนการทำงานอสังหาริมทรัพย์"
> Translation: "To create a real estate workflow/process system"

The first feature implemented is a **daily notification system** that sends summaries via LINE Notify and a web dashboard.

---

## Repository State (as of 2026-03-27)

```
AssetX-Estate/
├── data/
│   ├── appointments.json   ← seed data (นัดหมาย)
│   ├── properties.json     ← seed data (อสังหาริมทรัพย์)
│   └── tasks.json          ← seed data (งาน)
├── src/
│   ├── index.js            ← entry point
│   ├── scheduler.js        ← cron jobs (node-cron)
│   ├── notifiers/
│   │   └── line.js         ← LINE Notify API client
│   ├── services/
│   │   ├── dailySummary.js ← สรุปงานประจำวัน
│   │   ├── propertyReport.js ← รายงานอสังหาริมทรัพย์
│   │   └── reminders.js    ← แจ้งเตือนนัดหมาย
│   ├── store/
│   │   └── db.js           ← JSON file-based data store
│   └── web/
│       ├── server.js       ← Express API + SSE server
│       └── public/
│           └── index.html  ← Web dashboard UI
├── .env.example
├── .gitignore
├── CLAUDE.md               (this file)
├── package.json
└── README.md
```

### Tech Stack

- **Runtime**: Node.js ≥ 18
- **Framework**: Express 4
- **Scheduler**: node-cron 3
- **Notifications**: LINE Notify API, Server-Sent Events (SSE)
- **Storage**: JSON files in `data/` (no database yet)
- **Dependencies**: axios, dotenv, express, node-cron

### Environment Variables

Copy `.env.example` to `.env` and fill in values:

| Variable | Description |
|---|---|
| `LINE_NOTIFY_TOKEN` | Token จาก https://notify-bot.line.me/my/ |
| `PORT` | Port ของ web server (default: 3000) |
| `TZ` | Timezone (default: Asia/Bangkok) |

### Running the Project

```bash
npm install
cp .env.example .env   # แล้วแก้ไข LINE_NOTIFY_TOKEN
npm start              # หรือ npm run dev (ใช้ nodemon)
```

Dashboard จะพร้อมใช้งานที่ `http://localhost:3000`

### Cron Schedule (Asia/Bangkok)

| เวลา | วัน | งาน |
|------|-----|-----|
| 08:00 | ทุกวัน | สรุปงาน + ตารางนัดหมาย |
| 09:00 | จ–ศ | รายงานอสังหาริมทรัพย์ |
| ทุก 30 นาที | ทุกวัน | ตรวจสอบนัดหมายที่ใกล้ถึง |
| 17:30 | จ–ศ | สรุปปิดวัน |

### API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/` | Web dashboard |
| GET | `/events` | SSE stream |
| GET/POST/PUT/DELETE | `/api/tasks` | จัดการงาน |
| GET/POST/PUT/DELETE | `/api/properties` | จัดการอสังหาริมทรัพย์ |
| GET/POST/PUT/DELETE | `/api/appointments` | จัดการนัดหมาย |
| GET | `/api/notify/summary` | ส่งสรุปทันที |

### Data Store

`src/store/db.js` exports: `read(name)`, `write(name, data)`, `add(name, item)`, `update(name, id, changes)`, `remove(name, id)`

- Data files live in `data/<name>.json`
- IDs are `Date.now()` integers
- All items get `createdAt`; updates add `updatedAt`

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

## Domain: Real Estate Workflow

Implemented entities:

- **Tasks** (`data/tasks.json`) — งาน/to-do รายวัน, มี `title`, `dueDate`, `status` (pending/done)
- **Properties** (`data/properties.json`) — อสังหาริมทรัพย์, มี `name`, `type`, `price`, `status` (available/reserved/sold/rented/maintenance)
- **Appointments** (`data/appointments.json`) — นัดหมาย, มี `title`, `datetime`, `location`, `note`, `done`

Planned (not yet built):
- Agents / Brokers — user roles
- Clients / Leads — CRM data
- Documents — contracts, title deeds
- Transaction workflow — inquiry → viewing → offer → contract → closing

---

## How to Update This File

Update CLAUDE.md whenever:
- A technology stack is chosen (language, framework, database)
- A new architectural pattern is established
- Testing or linting conventions are added
- New environment variables or configuration files are introduced
- Deployment infrastructure is set up

Keep this file accurate — it is the primary reference for AI assistants onboarding to this project.
