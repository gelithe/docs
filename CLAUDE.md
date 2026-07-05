# AgentHub. Project Context for Claude

This is my personal AI Hub. Markdown files under content/ are displayed by the Hub as cards.

## Repo & Push
- Hub repo: gelithe/ai-hub-builder
- GitHub token: in gh-token.txt in this folder. Use it for git authentication ONLY, never print
  it, never commit it, and mask github_pat_... in any output.
- Always push with plain git over HTTPS (clone / commit / push). NEVER use the GitHub API
  (blocked in the sandbox), the browser, or computer-use.

## Card Convention
Top-level cards show on the Hub homepage: content/<name>.md with frontmatter
(title, emoji, category, updated).
IMPORTANT: category MUST be exactly `tools` OR `library` (lowercase) — these are the only two
categories the Hub displays. Use `tools` for things your AI runs/produces for me, and `library`
for saved prompts, skills, DNA or references. Never invent other category values (e.g. "Briefing",
"News") — a card with any other category will NOT appear. If unsure, use `tools`.
Daily/rolling: content/<name>-<YYYY-MM-DD>.md. Always-current: a fixed filename, overwritten each run.

## STANDING RULE. Card Emitter for Scheduled Tasks
Whenever I ask you to set up or modify a scheduled task that produces a recurring, useful output,
automatically append a Card-Emitter step: at the end of the task prompt, write the result as a card
under content/ and push it (using the convention and push method above) so the task becomes
visible in the Hub. Always use category `tools` (or `library` for reference material) — never any
other value. Briefly ask for daily-vs-always-current if unclear. Skip it if I say "no card" or the
output contains secrets.

## STANDING RULE. AH_ prefix for scheduled tasks
Whenever you create a scheduled task for this AgentHub, prefix its name with AH_ (for example
AH_daily-briefing, AH_inbox-summary). That way every AgentHub task is instantly recognizable in
the Scheduled list.
