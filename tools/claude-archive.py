#!/usr/bin/env python3
"""Export local Claude Code transcripts to readable markdown.

Transcripts live as JSONL under ~/.claude/projects/<slug>/<session>.jsonl and are
deleted once untouched for `cleanupPeriodDays`. This writes a durable markdown copy
grouped by project, so a dormant-but-relevant project keeps its reasoning.

Runs locally only: cloud sessions are stored server-side, not in ~/.claude.

  claude-archive.py --dry-run          # show what would be written
  claude-archive.py                    # digest: prompts + replies
  claude-archive.py --full             # also include tool output (larger, riskier)
"""
import argparse, json, os, re, sys
from datetime import datetime, timezone
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from redact import scrub  # noqa: E402

def slugify(text, words=7):
    picked = re.sub(r"[^a-z0-9\s-]", "", text.lower()).split()[:words]
    return "-".join(picked)[:60] or "untitled"


def read_session(path):
    """Return (records, cwd, started_at) or None if the file yields nothing usable."""
    records, cwd, started = [], None, None
    with open(path, encoding="utf-8", errors="replace") as handle:
        for line in handle:
            line = line.strip()
            if not line:
                continue
            try:
                obj = json.loads(line)
            except json.JSONDecodeError:
                continue  # a live session's last line can be a partial write
            cwd = cwd or obj.get("cwd")
            started = started or obj.get("timestamp")
            if obj.get("type") in ("user", "assistant"):
                records.append(obj)
    return (records, cwd, started) if records else None


def blocks(record):
    content = (record.get("message") or {}).get("content")
    if isinstance(content, str):
        return [{"type": "text", "text": content}]
    return content if isinstance(content, list) else []


def render(records, full):
    """Turn records into markdown lines. Tool results are summarised unless --full."""
    out, first_prompt, pending = [], None, []

    def flush_tools():
        """Collapse a run of tool calls into one line: `-> Bash x3, WebFetch`."""
        if not pending:
            return
        counts = {}
        for name in pending:
            counts[name] = counts.get(name, 0) + 1
        parts = [n if c == 1 else f"{n} x{c}" for n, c in counts.items()]
        out.append(f"\n`-> {', '.join(parts)}`\n")
        pending.clear()

    for record in records:
        who = record.get("type")
        sidechain = record.get("isSidechain")
        for block in blocks(record):
            kind = block.get("type")
            if kind == "text":
                text = (block.get("text") or "").strip()
                if not text:
                    continue
                if who == "user":
                    if text.startswith("<") and text.endswith(">"):
                        continue  # system-injected envelope, not something typed
                    flush_tools()
                    first_prompt = first_prompt or text
                    out.append(f"\n### You\n\n{text}\n")
                else:
                    flush_tools()
                    label = "Claude (subagent)" if sidechain else "Claude"
                    out.append(f"\n### {label}\n\n{text}\n")
            elif kind == "tool_use":
                pending.append(block.get("name"))
            elif kind == "tool_result" and full:
                flush_tools()
                body = block.get("content")
                body = body if isinstance(body, str) else json.dumps(body)[:4000]
                out.append(
                    f"\n<details><summary>tool output</summary>\n\n```\n{body[:4000]}\n```\n\n</details>\n"
                )
    flush_tools()
    return out, first_prompt


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--source", default=Path.home() / ".claude" / "projects", type=Path)
    ap.add_argument("--dest", default=Path.home() / "claude-archive", type=Path)
    ap.add_argument("--full", action="store_true", help="include tool output")
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()

    if not args.source.is_dir():
        sys.exit(f"No transcripts at {args.source}")

    written = skipped = 0
    for jsonl in sorted(args.source.glob("*/*.jsonl")):
        parsed = read_session(jsonl)
        if not parsed:
            continue
        records, cwd, started = parsed
        body, first_prompt = render(records, args.full)
        if not body:
            continue

        project = Path(cwd).name if cwd else jsonl.parent.name.strip("-")
        try:
            date = datetime.fromisoformat(started.replace("Z", "+00:00"))
        except (AttributeError, ValueError):
            date = datetime.fromtimestamp(jsonl.stat().st_mtime, timezone.utc)
        name = f"{date:%Y-%m-%d}-{slugify(first_prompt or jsonl.stem)}-{jsonl.stem[:8]}.md"
        target = args.dest / project / name

        # Re-export only when the transcript moved on since the last run.
        if target.exists() and target.stat().st_mtime >= jsonl.stat().st_mtime:
            skipped += 1
            continue

        header = (
            f"# {first_prompt.splitlines()[0][:100] if first_prompt else jsonl.stem}\n\n"
            f"- project: `{cwd or project}`\n"
            f"- session: `{jsonl.stem}`\n"
            f"- started: {date:%Y-%m-%d %H:%M UTC}\n"
            f"- exported: {datetime.now(timezone.utc):%Y-%m-%d}\n\n---\n"
        )
        text = scrub(header + "".join(body))

        print(f"{'would write' if args.dry_run else 'writing'}: {target}  ({len(text)//1024} KB)")
        if not args.dry_run:
            target.parent.mkdir(parents=True, exist_ok=True)
            target.write_text(text, encoding="utf-8")
        written += 1

    print(f"\n{written} exported, {skipped} unchanged -> {args.dest}")
    if not args.full:
        print("Digest mode: tool output omitted. Use --full to include it.")


if __name__ == "__main__":
    main()
