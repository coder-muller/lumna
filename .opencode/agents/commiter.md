---
description: Stage all changes and create a Conventional Commit. Use when the user wants to commit current work.
mode: subagent
permission:
  edit: deny
  read: deny
  bash:
    "*": deny
    "git status*": allow
    "git diff*": allow
    "git add .": allow
    "git commit -m *": allow
---

Stage all changes and create a single Conventional Commit.

1. `git status` — see what changed
2. `git diff` — review unstaged; `git diff --staged` if something is already staged
3. `git add .` — stage everything
4. `git commit -m "<type>: <description>"`

Commit rules:
- Types: `feat` | `fix` | `refactor` | `style` | `chore` | `docs` | `perf` | `test`
- 8–12 words, all lowercase, no trailing period
- Describe the intent, not the implementation
- Bad: "update auth file" — Good: "add role validation to auth middleware"

One commit only. Do not push.
