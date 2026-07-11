---
name: publish-card
description: Publish or update an AgentHub card in content/. Use whenever a task or session needs to write a result, reference, briefing, or report to the Hub. Encodes the card convention (frontmatter, categories, naming) and the push method so they are applied consistently.
---

# Publish a Hub card

Cards are plain `.md` files in `content/` at the repo root. Each file becomes one card
on the Hub homepage after push.

## 1. Choose the filename

- **Always-current card** (overwritten each run): a fixed name, e.g. `content/inbox-summary.md`.
- **Daily / rolling card** (one per day, history kept): `content/<name>-<YYYY-MM-DD>.md`,
  e.g. `content/morning-briefing-2026-07-11.md`.
- Lowercase, hyphen-separated names. If unsure which mode the user wants, ask
  "daily or always-current?" once — don't guess.

## 2. Write the frontmatter

Every card MUST start with exactly this frontmatter:

```yaml
---
title: Human-Readable Title
emoji: 📌
category: tools
updated: 2026-07-11
---
```

Rules:
- `category` is **exactly** `tools` or `library`, lowercase. No other value ever —
  the Hub silently drops cards with any other category.
  - `tools` = things the AI runs or produces (briefings, reports, generated results).
  - `library` = saved references, prompts, templates, DNA. If unsure, use `tools`.
- `updated` is today's date, `YYYY-MM-DD`.
- `title` and `emoji` are required and non-empty.

## 3. Lint before pushing

Always run the card linter and fix anything it reports:

```bash
python3 scripts/lint_cards.py
```

A card that fails lint will likely not render — never push a failing card.

## 4. Commit and push

- Use plain `git` over HTTPS only (clone / commit / push). NEVER the GitHub API,
  browser, or computer-use for publishing cards.
- If token auth is needed, the token is in `gh-token.txt` (repo root, untracked).
  Use it for git authentication only; never print it, never commit it, and mask
  any `github_pat_...` string in output.
- Commit message format: `card: <name> (<category>) — <one-line summary>`.
- Never commit secrets into a card. If the output contains secrets, stop and
  skip publishing.

## 5. Scheduled tasks

When a scheduled task ends by publishing a card (the Card-Emitter step), the task
name must be prefixed `AH_`, and this skill's steps 1–4 are its final actions.
On failure, still publish: write a short card explaining what failed instead of
dying silently (see the AH task scaffold card in `content/ah-task-scaffold.md`).
