#!/usr/bin/env python3
"""Lint AgentHub cards in content/.

Validates the card convention the Hub depends on:
  - frontmatter block present (--- ... ---) at the top of the file
  - title: present, non-empty
  - emoji: present, non-empty
  - category: exactly "tools" or "library" (lowercase)
  - updated: a real date in YYYY-MM-DD format
  - dated filenames (<name>-YYYY-MM-DD.md) end in a real date

Exit code 0 when all cards pass, 1 otherwise. Stdlib only.

Usage: python3 scripts/lint_cards.py [content_dir]
"""

import re
import sys
from datetime import datetime
from pathlib import Path

VALID_CATEGORIES = {"tools", "library"}
REQUIRED_KEYS = ("title", "emoji", "category", "updated")
DATED_NAME = re.compile(r"-(\d{4}-\d{2}-\d{2})\.md$")


def parse_frontmatter(text):
    """Return (dict, error). Only flat `key: value` lines are recognized."""
    if not text.startswith("---"):
        return None, "no frontmatter block at top of file"
    end = text.find("\n---", 3)
    if end == -1:
        return None, "frontmatter block is not closed with ---"
    block = text[3:end].strip("\n")
    data = {}
    for line in block.splitlines():
        if not line.strip() or line.strip().startswith("#"):
            continue
        if ":" not in line:
            return None, f"malformed frontmatter line: {line.strip()!r}"
        key, _, value = line.partition(":")
        data[key.strip()] = value.strip().strip("'\"")
    return data, None


def is_valid_date(value):
    try:
        datetime.strptime(value, "%Y-%m-%d")
        return True
    except ValueError:
        return False


def lint_card(path):
    """Return a list of problem strings for one card file (empty = clean)."""
    problems = []
    text = path.read_text(encoding="utf-8")

    fm, err = parse_frontmatter(text)
    if err:
        return [err]

    for key in REQUIRED_KEYS:
        if not fm.get(key):
            problems.append(f"missing or empty frontmatter key: {key}")

    category = fm.get("category")
    if category and category not in VALID_CATEGORIES:
        problems.append(
            f"category must be exactly 'tools' or 'library', got {category!r}"
            " — the Hub will NOT display this card"
        )

    updated = fm.get("updated")
    if updated and not is_valid_date(updated):
        problems.append(f"updated must be a real YYYY-MM-DD date, got {updated!r}")

    m = DATED_NAME.search(path.name)
    if m and not is_valid_date(m.group(1)):
        problems.append(f"filename date {m.group(1)!r} is not a real date")

    return problems


def main(argv):
    content_dir = Path(argv[1]) if len(argv) > 1 else Path(__file__).resolve().parent.parent / "content"
    if not content_dir.is_dir():
        print(f"lint_cards: content directory not found: {content_dir}")
        return 1

    cards = sorted(content_dir.glob("*.md"))
    if not cards:
        print(f"lint_cards: no cards found in {content_dir}")
        return 0

    failures = 0
    for card in cards:
        problems = lint_card(card)
        if problems:
            failures += 1
            print(f"FAIL {card.name}")
            for p in problems:
                print(f"  - {p}")
        else:
            print(f"ok   {card.name}")

    if failures:
        print(f"\n{failures} of {len(cards)} card(s) failed lint")
        return 1
    print(f"\nall {len(cards)} card(s) passed")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
