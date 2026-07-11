#!/usr/bin/env python3
"""Tests for lint_cards.py. Run: python3 -m unittest scripts/test_lint_cards.py -v
(or from scripts/: python3 -m unittest test_lint_cards -v)"""

import sys
import tempfile
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import lint_cards


def make_card(tmpdir, name, body):
    path = Path(tmpdir) / name
    path.write_text(body, encoding="utf-8")
    return path


GOOD = """---
title: Test Card
emoji: 🧪
category: tools
updated: 2026-07-11
---

Hello.
"""


class LintCardTests(unittest.TestCase):
    def setUp(self):
        self._tmp = tempfile.TemporaryDirectory()
        self.tmpdir = self._tmp.name

    def tearDown(self):
        self._tmp.cleanup()

    def lint(self, name, body):
        return lint_cards.lint_card(make_card(self.tmpdir, name, body))

    def test_valid_card_passes(self):
        self.assertEqual(self.lint("good.md", GOOD), [])

    def test_valid_library_card_passes(self):
        self.assertEqual(self.lint("lib.md", GOOD.replace("category: tools", "category: library")), [])

    def test_missing_frontmatter(self):
        problems = self.lint("bare.md", "just text, no frontmatter\n")
        self.assertTrue(any("no frontmatter" in p for p in problems))

    def test_unclosed_frontmatter(self):
        problems = self.lint("unclosed.md", "---\ntitle: X\n")
        self.assertTrue(any("not closed" in p for p in problems))

    def test_invalid_category_rejected(self):
        for bad in ("Briefing", "news", "Tools", "TOOLS", "reference"):
            problems = self.lint("bad-cat.md", GOOD.replace("category: tools", f"category: {bad}"))
            self.assertTrue(
                any("category must be exactly" in p for p in problems),
                f"category {bad!r} should be rejected",
            )

    def test_missing_keys_reported(self):
        body = "---\ntitle: Only Title\n---\n"
        problems = self.lint("missing.md", body)
        for key in ("emoji", "category", "updated"):
            self.assertTrue(any(key in p for p in problems), f"missing {key} not reported")

    def test_bad_updated_date(self):
        for bad in ("2026-13-01", "2026-02-30", "July 11", "2026/07/11"):
            problems = self.lint("bad-date.md", GOOD.replace("2026-07-11", bad))
            self.assertTrue(
                any("updated must be a real" in p for p in problems),
                f"date {bad!r} should be rejected",
            )

    def test_dated_filename_valid(self):
        self.assertEqual(self.lint("briefing-2026-07-11.md", GOOD), [])

    def test_dated_filename_impossible_date(self):
        problems = self.lint("briefing-2026-02-31.md", GOOD)
        self.assertTrue(any("filename date" in p for p in problems))

    def test_quoted_values_accepted(self):
        body = GOOD.replace("title: Test Card", 'title: "Test Card"')
        self.assertEqual(self.lint("quoted.md", body), [])

    def test_main_fails_on_bad_dir_of_cards(self):
        make_card(self.tmpdir, "bad.md", GOOD.replace("category: tools", "category: nope"))
        rc = lint_cards.main(["lint_cards.py", self.tmpdir])
        self.assertEqual(rc, 1)

    def test_main_passes_on_good_dir(self):
        make_card(self.tmpdir, "good.md", GOOD)
        rc = lint_cards.main(["lint_cards.py", self.tmpdir])
        self.assertEqual(rc, 0)


if __name__ == "__main__":
    unittest.main()
