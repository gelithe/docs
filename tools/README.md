# Transcript tools

Two local scripts for keeping Claude Code chat history that would otherwise age out.

Claude Code stores each session as JSONL under `~/.claude/projects/<slug>/<session>.jsonl`
and deletes anything untouched for `cleanupPeriodDays` (default 30). Resuming a session
refreshes its clock, so active work is never at risk — the sessions that disappear are the
dormant-but-relevant ones.

## Retention setting

```bash
mkdir -p ~/.claude
f=~/.claude/settings.json
[ -s "$f" ] || echo '{}' > "$f"
cp "$f" "$f.bak"
jq '.cleanupPeriodDays = 730' "$f" > "$f.tmp" && mv "$f.tmp" "$f"
```

730 days = two years. Minimum is 1; `0` is rejected with a validation error, so there is no
true "never" — use a large number instead. Run `/status` in a local session afterwards: if
the settings file fails to parse, the sweep pauses itself entirely and warns there.

## `claude-archive.py` — export transcripts to markdown

```bash
./claude-archive.py --dry-run     # show what would be written
./claude-archive.py               # digest -> ~/claude-archive/<project>/<date>-<topic>.md
./claude-archive.py --full        # also embed tool output
```

Digest mode keeps prompts and prose replies, collapses tool calls to a single line, and drops
tool output — roughly 4% of the original size (a 640 KB session becomes 24 KB). That output is
also where credentials leak from, since secrets arrive via command output rather than typing.

Incremental: a session is re-exported only when its transcript has changed since the last run.
Safe to run daily.

## `claude-screen.py` — find stale sessions

```bash
./claude-screen.py                # grouped by project, newest first
./claude-screen.py --stale 365    # untouched for a year or more
./claude-screen.py --expiring 730 # days until the sweep drops each one
```

Read-only; it never deletes. Run it once a year to decide what to keep before the sweep acts.

## Scheduling

These read `~/.claude/` on the machine that ran the sessions, so they must run **locally**.
A cloud session (including an AgentHub `AH_` scheduled task) cannot see your laptop's
transcripts and would archive nothing.

```cron
0 20 * * *  cd ~/path/to/tools && ./claude-archive.py >> ~/claude-archive/.log 2>&1
```

## Scope and limits

- **Local sessions only.** Cloud session transcripts live server-side, outside `~/.claude/`.
- **Redaction is a safety net, not a guarantee.** `redact.py` masks known token shapes
  (GitHub, Anthropic, AWS, Slack, private keys) but cannot catch every secret. Prefer keeping
  credentials out of transcripts in the first place: use a git credential helper
  (`git config --global credential.helper osxkeychain`) rather than a token in a file that
  sessions read.
- **Think before committing the archive.** Exporting into a pushed repo moves plaintext chat
  history from your disk to GitHub. The default destination is `~/claude-archive/`,
  deliberately outside any repo.
