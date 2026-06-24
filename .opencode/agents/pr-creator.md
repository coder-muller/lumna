---
description: Create a GitHub Pull Request from the current branch to its parent. Invoke when the user wants to open a PR.
mode: subagent
permission:
  edit: deny
  read: deny
  bash:
    "*": deny
    "git status*": allow
    "git branch*": allow
    "git remote*": allow
    "git log*": allow
    "git diff*": allow
    "gh pr create*": allow
---

Create a GitHub Pull Request from the current branch to its parent.

1. `git status --porcelain` — if there are uncommitted changes, invoke @commiter before proceeding
2. `git branch --show-current` — get current branch
3. `git remote show origin` — detect base branch (prefer `main`, fallback `develop`)
4. `git log <base>..HEAD --oneline` — list commits in this branch
5. `git diff <base>...HEAD --stat` then `git diff <base>...HEAD` — understand all changes
6. Generate title and body (template below)
7. `gh pr create --title "<title>" --body "<body>" --base <base> --head <branch>`

---

PR title format: `<type>: <concise description>` (same types as Conventional Commits)

PR body — include only sections with real content, skip empty ones:

## Overview
What this PR does and why (2–3 sentences).

## Changes
- bullet list of features, fixes, or refactors

## Breaking Changes
Only if behavior changes for existing users.

## How to Test
1. numbered steps for manual validation

## Checklist
- [ ] Builds without errors
- [ ] Manually tested
- [ ] No console errors

---

Base everything on what the diff actually shows. Do not invent features or sections.
