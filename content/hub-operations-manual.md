---
title: Hub Operations Manual
emoji: 📖
category: library
updated: 2026-07-11
---

The runbook for this AgentHub — written so a fresh session (or you at 7am) can operate
and repair it without archaeology. The cheat-sheet card covers *what* the Hub is; this
card covers *how to run it*.

## How a card gets onto the Hub

1. A markdown file lands in `content/` of this repo with valid frontmatter
   (`title`, `emoji`, `category`, `updated`).
2. It's committed and pushed with plain git over HTTPS (never the GitHub API).
3. The Hub (repo: `gelithe/ai-hub-builder`) reads `content/` and renders one card per file.

Machinery that keeps this honest:
- **publish-card skill** (`.claude/skills/publish-card/SKILL.md`) — the convention,
  encoded once, used by every session and scheduled task.
- **Card linter** (`scripts/lint_cards.py`, tests in `scripts/test_lint_cards.py`) —
  run `python3 scripts/lint_cards.py` before any push that touches `content/`.
- **AH task scaffold** (`content/ah-task-scaffold.md`) — the template every scheduled
  task is built from.

## Scheduled tasks

- Every AgentHub task is prefixed **`AH_`** — that's how you spot them in the Scheduled list.
- Every recurring task that produces useful output ends with a **Card-Emitter step**
  (write card → lint → push). Tasks must fail *visibly*: on error they emit a
  "⚠️ Run failed" card rather than nothing.
- New task? Start from the scaffold card, decide daily vs always-current, keep the
  category `tools`.

## When a card doesn't appear

Check in this order — it's almost always #1:

1. **Category typo.** Must be exactly `tools` or `library`, lowercase. Run the linter;
   it flags this explicitly.
2. **Frontmatter broken.** Missing `---` close, missing key, bad `updated` date —
   the linter catches all of these too.
3. **Not actually pushed.** `git log origin/main -1 -- content/` — did the commit land?
4. **Wrong folder or extension.** Cards live at `content/*.md`, top level, no subfolders.

## When a scheduled task goes quiet

- Look for its last card: a dated card that stopped updating tells you the last good run.
- If there's no "⚠️ Run failed" card either, the task died before its Card-Emitter step —
  re-run it manually and watch the output.
- A misbehaving task is paused, not deleted — its prompt is the only spec it has.

## Security rules (non-negotiable)

- The GitHub token lives in `gh-token.txt` at the repo root, untracked. Git
  authentication only. Never print it, never commit it, mask `github_pat_...` anywhere.
- No secrets in cards, ever. If output contains one, the Card-Emitter step is skipped
  and the run reports why.

## Conventions recap

| Thing | Rule |
|---|---|
| Card file | `content/<name>.md`, lowercase-hyphenated |
| Daily card | `content/<name>-<YYYY-MM-DD>.md` |
| Always-current card | fixed filename, overwritten each run |
| Category | exactly `tools` or `library` |
| Task name | `AH_` prefix |
| Commit message | `card: <name> (<category>) — <summary>` |
| Push method | plain git over HTTPS only |
