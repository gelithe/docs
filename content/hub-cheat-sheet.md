---
title: Hub Cheat-Sheet
emoji: 🗺️
category: library
updated: 2026-07-05
---

A short, practical reference for how this Hub works.

## The basics

- **What a card is:** a plain `.md` file in the `content/` folder of this repo, with frontmatter at the top (`title`, `emoji`, `category`, `updated`). Push the file, reload the Hub, and it shows up as a card. This file you're reading is one.
- **The two categories:** `tools` is for things your AI runs or produces for you (reports, briefings, generated results); `library` is for saved references, prompts, and DNA — things you keep and reuse. The category must be exactly `tools` or `library`, lowercase.
- **Scheduled tasks write cards:** a scheduled task (a recurring job your AI runs on a timer) can end its run by committing its result as a markdown card here. That turns any repeating chore — a morning briefing, a weekly report — into a card that's always fresh when you open the Hub.
- **Ideas and Wins:** add an idea to the Ideas board whenever something occurs to you, however rough. When an idea gets built and ships, it moves to Wins — so the board doubles as a backlog and a record of what you've actually finished.

## What's next: starter ideas

Grounded in what you actually have set up today — Gmail, Google Calendar, Google Drive, and Notion connected; a GitHub-backed Mintlify docs site (this repo) that deploys on push to main; Claude Code skills like code-review, security-review, and dataviz; and no scheduled tasks yet, so the field is open:

1. **Morning briefing card** — a daily scheduled task that reads your unread Gmail and today's Calendar events and writes a "Today" card to `tools` before you sit down.
2. **Inbox triage summary** — a scheduled task that searches Gmail for threads awaiting your reply and writes a short "needs answer" list as a `tools` card, so triage happens in the Hub instead of the inbox.
3. **Docs health report** — a weekly task that runs `mint broken-links` on this very repo and writes the results as a `tools` card, catching rot before readers do.
4. **Docs changelog card** — after each push to this docs site, have the session append a plain-language "what changed this week" entry to a `tools` card, since Mintlify already deploys on every push to main.
5. **Notion → Hub sync** — a task that pulls a chosen Notion page or database (notes, decisions, a reading list) into a `library` card, making the Hub the single place you check.
6. **Meeting recap card** — after Calendar events end, a task drafts a recap (attendees, topic, follow-ups) into a rolling `tools` card you can skim at day's end.
7. **Prompt DNA card** — start a `library` card where you paste the prompts and instructions that work well for you, so every future session can read your DNA straight from the repo.
8. **Weekly repo activity snapshot** — a scheduled task that summarizes the week's commits and PRs on this repo (optionally with a dataviz chart) into a `tools` card — a lightweight standup for a team of one.
