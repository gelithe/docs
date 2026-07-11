---
title: AH Task Scaffold
emoji: 🏗️
category: library
updated: 2026-07-11
---

The reusable template for every `AH_` scheduled task. Copy the prompt below, fill in the
blanks, and the task arrives with the Card-Emitter step, error handling, and naming
convention already built in.

## How to use it

1. Pick a task name prefixed `AH_` (e.g. `AH_daily-briefing`, `AH_inbox-summary`).
2. Decide the card mode: **daily** (`content/<name>-<YYYY-MM-DD>.md`, keeps history) or
   **always-current** (fixed filename, overwritten each run).
3. Fill in the template and create the scheduled task with it.

## The template

```text
You are running the scheduled task <AH_TASK_NAME>.

GOAL
<One sentence: what this task produces and for whom.>

GATHER
<The sources to read and exactly what to pull from each,
 e.g. "unread Gmail from the last 24h" / "today's Calendar events" /
 "this repo's commits since the last run.">

SYNTHESIZE
<The shape of the output: sections, ordering, what to include and what
 to leave out. Keep it skimmable — this becomes a card, not a report.>

EMIT CARD (Card-Emitter step — always last)
Use the publish-card skill in this repo (.claude/skills/publish-card/):
- Write the result to content/<CARD_FILENAME> with frontmatter:
  title: <CARD_TITLE>, emoji: <EMOJI>, category: tools, updated: <today>.
- category is exactly "tools" (or "library" only for reference material) —
  never any other value.
- Run python3 scripts/lint_cards.py and fix any failure before pushing.
- Commit and push with plain git over HTTPS.

ON FAILURE
Do not die silently. If gathering or synthesis fails, still emit the card,
with a short "⚠️ Run failed" section stating what broke and what to check —
a visible failure in the Hub beats an invisible one in a log.

LIMITS
Never include secrets, tokens, or credentials in the card. If the output
would contain them, skip the Card-Emitter step and report why instead.
```

## First candidate to instantiate

**AH_daily-briefing** — GATHER: unread Gmail (last 24h) + today's Calendar events.
SYNTHESIZE: "Today at a glance" — meetings with times, mails needing a reply, one-line
weather-of-the-inbox. EMIT: daily card `content/morning-briefing-<date>.md`, category
`tools`, emoji ☀️.
