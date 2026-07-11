---
title: Diligence Template
emoji: 🔍
category: library
updated: 2026-07-11
---

A decision-record template for evaluating anything before adopting it — a tool, a vendor,
a subscription, an automation idea. Copy the skeleton into a new card
(`content/diligence-<topic>.md`, category `library`), fill it in, and the Hub accumulates
a searchable record of *what* you decided and *why*.

The discipline is in the two boxes people skip: **kill criteria** (what would make you
drop this later) and **the decision itself** (one sentence, dated — not "we'll see").

## The skeleton

```markdown
---
title: Diligence — <topic>
emoji: 🔍
category: library
updated: <YYYY-MM-DD>
---

## Problem
What am I actually trying to solve? One paragraph. If I can't state it,
stop here — there is nothing to evaluate yet.

## Options considered
| Option | What it is | Cost | Notes |
|---|---|---|---|
| A | | | |
| B | | | |
| Do nothing | keeping the status quo | free | always include this row |

## Evaluation
- **Fit:** does it solve the stated problem, or an adjacent one?
- **Cost:** money, but also setup time, maintenance, and switching cost later.
- **Risk:** lock-in, data/privacy exposure, what happens if it disappears.
- **Trial:** what's the smallest test that proves it works for me? Result?

## Kill criteria
The conditions under which I drop this, written down in advance,
e.g. "unused for 30 days", "price rises above X", "requires manual fixing
more than once a week".

## Decision
<date> — Adopt / Reject / Defer until <condition>, because <one sentence>.

## Revisit
<date or trigger for re-checking this decision, if any.>
```

## Tips

- One card per evaluation; never recycle a card for a new topic — the history is the point.
- Ask the AI to do the GATHER work (pricing pages, docs, alternatives) but write the
  **Decision** line yourself.
- When a decision ships something, link it from the Ideas/Wins board.
