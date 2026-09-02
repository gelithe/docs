#!/usr/bin/env python3
"""Show which local Claude Code sessions have gone stale, and what they were about.

Read-only: it never deletes anything. Run it once a year to decide what is worth
keeping before the retention sweep drops it at `cleanupPeriodDays`.

  claude-screen.py                 # everything, newest first, grouped by project
  claude-screen.py --stale 365     # only sessions untouched for a year or more
  claude-screen.py --expiring 730  # what the sweep will drop next, soonest first
"""
import argparse, json, sys, time
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from redact import scrub  # noqa: E402


def summarise(path):
    """First typed prompt, session cwd, size and age. None if nothing usable."""
    prompt, cwd = None, None
    with open(path, encoding="utf-8", errors="replace") as handle:
        for line in handle:
            line = line.strip()
            if not line:
                continue
            try:
                obj = json.loads(line)
            except json.JSONDecodeError:
                continue
            cwd = cwd or obj.get("cwd")
            if prompt is None and obj.get("type") == "user":
                content = (obj.get("message") or {}).get("content")
                if isinstance(content, list):
                    content = next(
                        (b.get("text") for b in content if b.get("type") == "text"), None
                    )
                if isinstance(content, str):
                    text = content.strip()
                    # Skip system-injected envelopes; keep what the human typed.
                    if text and not (text.startswith("<") and text.endswith(">")):
                        prompt = scrub(" ".join(text.split()))[:80]
            if prompt and cwd:
                break
    if prompt is None and cwd is None:
        return None
    stat = path.stat()
    return {
        "project": Path(cwd).name if cwd else path.parent.name.strip("-"),
        "prompt": prompt or "(no prompt)",
        "days": (time.time() - stat.st_mtime) / 86400,
        "kb": stat.st_size / 1024,
        "path": path,
    }


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--source", default=Path.home() / ".claude" / "projects", type=Path)
    ap.add_argument("--stale", type=float, metavar="DAYS",
                    help="only sessions untouched this long")
    ap.add_argument("--expiring", type=float, metavar="RETENTION",
                    help="days until the sweep drops each session, soonest first")
    args = ap.parse_args()

    if not args.source.is_dir():
        sys.exit(f"No transcripts at {args.source}")

    rows = [r for r in (summarise(p) for p in args.source.glob("*/*.jsonl")) if r]
    if args.stale:
        rows = [r for r in rows if r["days"] >= args.stale]
    if not rows:
        print("Nothing matches.")
        return

    if args.expiring:
        rows.sort(key=lambda r: -r["days"])
        print(f"{'LEFT':>6}  {'AGE':>6}  {'SIZE':>8}  PROJECT / PROMPT")
        for r in rows:
            left = args.expiring - r["days"]
            mark = "  <-- SOON" if left < 60 else ""
            print(f"{left:>5.0f}d  {r['days']:>5.0f}d  {r['kb']:>7.0f}K  "
                  f"{r['project']}: {r['prompt']}{mark}")
    else:
        by_project = {}
        for r in rows:
            by_project.setdefault(r["project"], []).append(r)
        for project in sorted(by_project):
            sessions = sorted(by_project[project], key=lambda r: r["days"])
            total = sum(s["kb"] for s in sessions)
            print(f"\n{project}  ({len(sessions)} sessions, {total:.0f} KB)")
            for s in sessions:
                print(f"  {s['days']:>5.0f}d ago  {s['kb']:>6.0f}K  {s['prompt']}")

    print(f"\n{len(rows)} sessions, {sum(r['kb'] for r in rows)/1024:.1f} MB total")


if __name__ == "__main__":
    main()
