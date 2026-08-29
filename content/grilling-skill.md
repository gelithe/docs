---
title: Grilling Skill
emoji: 🔥
category: library
updated: 2026-08-29
---

A saved Claude Code skill that pressure-tests a plan, decision, or idea by interviewing you round by round until nothing is left silently assumed. Installed in this repo at `.claude/skills/grilling/SKILL.md`.

## How to trigger it

Narrow keyword only: say the word **grill**. "Grill this plan", "grill this idea", "grill me", "grill my thinking". Any other phrasing — "stress-test this", "poke holes in this", "what am I not thinking about" — deliberately does *not* fire it.

## How it works

- **Design tree.** The work is mapped as a tree: every decision branches into the decisions that hang off it.
- **Frontier rounds.** Each round asks *every* question whose prerequisites are already settled — the whole answerable frontier at once, numbered, each with a recommended answer attached. Then it stops and waits for you.
- **Reshaping.** Your answers settle branches and push the frontier outward, unblocking questions that depended on them. A question that depends on another still-open question is held for a later round.
- **Facts are the assistant's job, decisions are yours.** Anything lookup-able — files, searches, docs — gets fetched rather than asked. Only genuine judgement calls come to you.
- **Done = empty frontier.** Every branch visited, nothing assumed. No action is taken until you confirm shared understanding.

## Question format

```
❓ **Q1** - **<question title>**: <question body, may include multiple choices>

➡️ <recommended answer>
```

## Good for

Scoping a project before a single line is written, choosing between architectures, sanity-checking a launch plan, or forcing an idea that "feels right" to state its assumptions out loud.

## Note

An earlier version of this skill routed other phrasings to three sibling skills — `idea-refine`, `idea-generator`, `tournament-of-ideas`. None of them exist, so that routing was removed. "Stress-test this", "poke holes in this" and the like are now simply handled in normal conversation; only the word **grill** invokes the full round-by-round treatment.
