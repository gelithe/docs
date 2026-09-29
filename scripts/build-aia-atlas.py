#!/usr/bin/env python3
"""Inject the member data into the Atlas dashboard template.

Usage:  python3 scripts/build-aia-atlas.py
Reads   data/ai-advantage-members.json  +  artifacts/atlas-template.html
Writes  artifacts/ai-advantage-atlas.html   (publish this as the Artifact)
"""
import json, os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
rows = json.load(open(os.path.join(ROOT, "data", "ai-advantage-members.json"), encoding="utf-8"))

# Compact column order, mirrored by COLS in the page script.
def pack(r):
    return [r["name"], r["tagline"], r["city"], r["region"], r["country"], r["continent"],
            r["domain_primary"], r["location_granularity"], 1 if r["location_ambiguous"] else 0,
            r["completeness"], r["profile_id"], r["role_in_club"], r["location_raw"],
            r["staff_role"]]

payload = json.dumps([pack(r) for r in rows], ensure_ascii=False, separators=(",", ":"))
tpl = open(os.path.join(ROOT, "artifacts", "atlas-template.html"), encoding="utf-8").read()
out = tpl.replace("/*__DATA__*/[]", payload)
dest = os.path.join(ROOT, "artifacts", "ai-advantage-atlas.html")
open(dest, "w", encoding="utf-8").write(out)
print(f"{len(rows)} members -> {dest} ({len(out)//1024} KB)")
