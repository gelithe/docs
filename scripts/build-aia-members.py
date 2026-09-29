#!/usr/bin/env python3
"""Build the AI Advantage Club member database from the captured directory listing.

Usage:  python3 scripts/build-aia-members.py

Reads   data/ai-advantage-members.source.txt   `@@`-delimited capture:
                                               profile_id@@name@@tagline@@location
Writes  data/ai-advantage-members.csv          the systematized database
        data/ai-advantage-members.json         same rows, for the dashboard
        content/ai-advantage-members.md         the Hub card

To refresh: re-copy the directory listing into the source file, then re-run this.
"""
import csv, json, os, sys, collections

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, "scripts"))
from aia_locations import resolve                      # noqa: E402
from aia_people import (normalize_name, classify_account, split_roles,  # noqa: E402
                        extract_website, classify_domains, completeness)

SRC   = os.path.join(ROOT, "data", "ai-advantage-members.source.txt")
CSV   = os.path.join(ROOT, "data", "ai-advantage-members.csv")
JSON  = os.path.join(ROOT, "data", "ai-advantage-members.json")
CARD  = os.path.join(ROOT, "content", "ai-advantage-members.md")
URLF  = os.path.join(ROOT, "data", "dashboard-url.txt")

# Where the data files this card links to are browsable. Override when the card is
# mirrored into another repo:  AIA_REPO=owner/name python3 scripts/build-aia-members.py
REPO   = os.environ.get("AIA_REPO", "gelithe/docs")
BRANCH = os.environ.get("AIA_BRANCH", "main")
BLOB   = f"https://github.com/{REPO}/blob/{BRANCH}"

FOUNDERS = {"859db9d2", "f01f77bb"}
# Staff whose profile name carries no `| AIA Team` suffix but whose tagline is a club role.
EXTRA_STAFF = {"cda4854c", "1b654a1d", "195f12c6"}

COLUMNS = ["profile_id","name","name_raw","account_type","role_in_club","staff_role",
           "tagline","roles","domain_primary","domain_secondary","website",
           "city","region","country","country_code","continent","location_raw",
           "location_granularity","location_ambiguous","completeness","profile_url"]


def build_rows():
    rows = []
    for line in open(SRC, encoding="utf-8"):
        line = line.rstrip("\n")
        if not line.strip():
            continue
        uid, name_raw, tagline, location = line.split("@@")

        is_staff = "AIA Team" in name_raw or name_raw.startswith("AIA ") or uid in EXTRA_STAFF
        role_in_club = "founder" if uid in FOUNDERS else "staff" if is_staff else "member"

        clean_name = normalize_name(name_raw.split(" | AIA Team")[0].strip())
        staff_role = tagline.strip() if is_staff else ""

        loc = resolve(location)
        roles = split_roles(tagline)
        primary, secondary = classify_domains(tagline)
        if is_staff:
            primary, secondary = "AI Advantage staff", ""

        rows.append({
            "profile_id": uid,
            "name": clean_name,
            "name_raw": name_raw,
            "account_type": classify_account(name_raw, is_staff),
            "role_in_club": role_in_club,
            "staff_role": staff_role,
            "tagline": tagline.strip(),
            "roles": " ; ".join(roles),
            "domain_primary": primary,
            "domain_secondary": secondary,
            "website": extract_website(tagline),
            "city": loc["city"],
            "region": loc["region"],
            "country": loc["country"],
            "country_code": loc["country_code"],
            "continent": loc["continent"],
            "location_raw": loc["location_raw"],
            "location_granularity": loc["location_granularity"],
            "location_ambiguous": loc["location_ambiguous"],
            "completeness": completeness(bool(tagline.strip()),
                                         loc["location_granularity"],
                                         bool(primary)),
            "profile_url": f"https://community.aiadvantage.com/u/{uid}",
        })
    rows.sort(key=lambda r: r["name"].lower())
    return rows


def write_data(rows):
    with open(CSV, "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=COLUMNS)
        w.writeheader()
        w.writerows(rows)
    with open(JSON, "w", encoding="utf-8") as f:
        json.dump(rows, f, ensure_ascii=False, separators=(",", ":"))


def esc(s):
    return (s or "").replace("|", "\\|").strip()


def write_card(rows):
    n = len(rows)
    members = [r for r in rows if r["role_in_club"] == "member"]
    staff   = [r for r in rows if r["role_in_club"] == "staff"]
    founder = [r for r in rows if r["role_in_club"] == "founder"]
    tagged  = [r for r in rows if r["tagline"]]
    placed  = [r for r in rows if r["country"]]
    cities  = [r for r in rows if r["location_granularity"] == "city"]

    ctry = collections.Counter(r["country"] for r in placed)
    cont = collections.Counter(r["continent"] for r in placed if r["continent"])
    dom  = collections.Counter(r["domain_primary"] for r in members if r["domain_primary"])
    st   = collections.Counter(r["region"] for r in placed
                               if r["country"] == "United States" and r["region"])
    city = collections.Counter(r["city"] for r in cities if r["city"])
    gran = collections.Counter(r["location_granularity"] for r in rows)

    dash = ""
    if os.path.exists(URLF):
        dash = open(URLF, encoding="utf-8").read().strip()

    o = []
    w = o.append
    w("---")
    w("title: AI Advantage Club Member Database")
    w("emoji: 🧭")
    w("category: library")
    w("updated: 2026-09-29")
    w("---")
    w("")
    w(f"All **{n} AI Advantage Club profiles**, systematized into one queryable table of your "
      "AI mastery peers — with the directory's free-text location and bio fields split into "
      "structured, filterable columns.")
    w("")
    if dash:
        w(f"**[Open the interactive dashboard →]({dash})** — filter by country, domain and "
          "completeness; charts update as you filter.")
        w("")
    w("| Where | What |")
    w("| --- | --- |")
    if dash:
        w(f"| [Dashboard]({dash}) | Charts + searchable, filterable table |")
    w(f"| [`data/ai-advantage-members.csv`]({BLOB}/data/ai-advantage-members.csv) | The database — 21 columns, one row per member |")
    w(f"| [`data/ai-advantage-members.json`]({BLOB}/data/ai-advantage-members.json) | Same rows, for any tool that wants JSON |")
    w(f"| [`data/SCHEMA.md`]({BLOB}/data/SCHEMA.md) | Data dictionary: every column, and how it was derived |")
    w("| This card | The readable summary and the full roster |")
    w("")

    w("## How the scattered data was systematized")
    w("")
    w("The directory gives three free-text fields — a name, a one-line bio, a location — all "
      "written by hand, at whatever level of detail each member felt like. Those became "
      "structured columns:")
    w("")
    w("| Was | Became |")
    w("| --- | --- |")
    w("| `location` — a city, a state, a country or a region, all in one field (`San Diego`, "
      "`California`, `United States`, `San Francisco Bay Area`, `15th arrondissement`) | "
      "`city`, `region`, `country`, `country_code`, `continent`, plus `location_granularity` "
      "recording how precise the original was |")
    w("| `name` — with a `\\| AIA Team` suffix on staff, SHOUTED or lowercase on others, and "
      "sometimes an email address or two people on one account | `name` (re-cased), "
      "`name_raw` (untouched), `account_type`, `role_in_club`, `staff_role` |")
    w("| `tagline` — a job title, a motto, a company name or a mission statement | `tagline`, "
      "`roles` (split when it reads as a list), `domain_primary` / `domain_secondary` from a "
      "fixed 11-term vocabulary, and `website` where one was embedded |")
    w("| nothing | `completeness` 0–100, so you can sort the people you can actually act on "
      "to the top |")
    w("")
    w("`name_raw` and `location_raw` keep the originals, so nothing is lost and every "
      "derivation is checkable.")
    w("")

    w("## The shape of the room")
    w("")
    w(f"- **{n} profiles**: {len(members)} peers, {len(staff)} AI Advantage staff, "
      f"{len(founder)} founder accounts.")
    w(f"- **{len(tagged)} ({len(tagged)*100//n}%)** wrote a bio; **{len(placed)} "
      f"({len(placed)*100//n}%)** can be placed in a country; **{len(cities)} "
      f"({len(cities)*100//n}%)** down to a city.")
    w(f"- **{len(ctry)} countries** across **{len(cont)} continents**. "
      f"{ctry['United States']} are in the US — {ctry['United States']*100//len(placed)}% of "
      "everyone locatable — with Canada ({}) and the UK ({}) next."
      .format(ctry["Canada"], ctry["United Kingdom"]))
    median = sorted(r["completeness"] for r in rows)[n // 2]
    w(f"- Median profile completeness is **{median}/100**. That is the real ceiling on this "
      "database: the directory is half-empty by the members' own choice.")
    w("")

    w("### Location precision")
    w("")
    w("| Granularity | Members | Meaning |")
    w("| --- | ---: | --- |")
    for k, label in [("city","Named a city"),("metro","Named a metro or county"),
                     ("region","Named a state / province / county only"),
                     ("country","Named a country only"),
                     ("unresolved","Unparseable (`North`)"),("none","Left it blank")]:
        if gran.get(k):
            w(f"| `{k}` | {gran[k]} | {label} |")
    w("")

    w("### Where they are")
    w("")
    w("| Continent | Members |")
    w("| --- | ---: |")
    for k, v in cont.most_common():
        w(f"| {k} | {v} |")
    w("")
    w("| Country | Members |")
    w("| --- | ---: |")
    for k, v in ctry.most_common():
        w(f"| {k} | {v} |")
    w("")

    w("### Top US states")
    w("")
    w("| State | Members |")
    w("| --- | ---: |")
    for k, v in st.most_common(12):
        w(f"| {k} | {v} |")
    w("")

    w("### Cities with the most members")
    w("")
    w("| City | Members |")
    w("| --- | ---: |")
    for k, v in city.most_common(12):
        w(f"| {k} | {v} |")
    w("")

    w("### What they do")
    w("")
    w(f"`domain_primary` for the {len(members)} peers, from the fixed vocabulary. Only the "
      f"{sum(dom.values())} who wrote a bio with a recognisable professional signal are "
      "classified.")
    w("")
    w("| Domain | Members |")
    w("| --- | ---: |")
    for k, v in dom.most_common():
        w(f"| {k} | {v} |")
    w(f"| _No usable signal_ | {len(members) - sum(dom.values())} |")
    w("")

    w("## Running the club")
    w("")
    w("| Name | Role | Location | Profile |")
    w("| --- | --- | --- | --- |")
    for r in sorted(founder + staff, key=lambda r: (r["role_in_club"], r["name"].lower())):
        w(f"| {esc(r['name'])} | {esc(r['staff_role']) or ('Founder' if r['role_in_club']=='founder' else '—')} "
          f"| {esc(r['location_raw']) or '—'} | [profile]({r['profile_url']}) |")
    w("")

    w("## Full roster")
    w("")
    w(f"All {len(members)} peers, alphabetical. **Focus** is the member's own bio where they "
      "wrote one. Staff and founders are listed above, not here.")
    w("")
    w("| Name | Focus | City | Country | Domain | ✓ | Profile |")
    w("| --- | --- | --- | --- | --- | ---: | --- |")
    for r in members:
        w(f"| {esc(r['name'])} | {esc(r['tagline']) or '—'} "
          f"| {esc(r['city'] or r['location_raw']) or '—'} | {r['country'] or '—'} "
          f"| {r['domain_primary'] or '—'} | {r['completeness']} "
          f"| [profile]({r['profile_url']}) |")
    w("")

    amb = sorted({r["location_raw"] for r in rows if r["location_ambiguous"]})
    dupes = [k for k, v in collections.Counter(r["name"] for r in rows).items() if v > 1]
    w("## Data-quality notes")
    w("")
    w(f"- **Ambiguous cities.** {sum(1 for r in rows if r['location_ambiguous'])} members "
      "named a city that exists in more than one country, so `country` is a best guess, "
      f"flagged in `location_ambiguous`: {', '.join(amb)}.")
    w("- **One unresolvable location.** A member lists `North`; "
      "`location_granularity` reads `unresolved`.")
    w(f"- **Repeated names.** {', '.join(sorted(dupes))} each appear under two profile IDs. "
      "Possibly duplicate accounts, possibly two people; both rows are kept.")
    w("- **Three profiles show an email address instead of a name** — `account_type` is "
      "`email_placeholder`. That is what the directory shows, not a capture error.")
    w("- **`domain_*` is keyword-inferred** from one self-written line, so it is a sorting "
      "aid rather than a fact. A bio that is a motto (\"Life happens for me, not to me!\") "
      "classifies as nothing at all, which says nothing about the person.")
    w("- **No open-web research.** Every column is derived from the directory text above. "
      "Nothing here came from searching for these people elsewhere.")
    w("- **Emoji and some accents were stripped** during capture; the profile link is always "
      "the authoritative version.")
    w("")
    w("## Refreshing this")
    w("")
    w("The directory is live and members keep joining, so this is a dated snapshot. Re-copy "
      "the members list into `data/ai-advantage-members.source.txt` and run "
      "`python3 scripts/build-aia-members.py` — the CSV, the JSON and this card all "
      "regenerate. The filename is fixed, so the Hub always shows the current version.")
    w("")

    open(CARD, "w", encoding="utf-8").write("\n".join(o))


if __name__ == "__main__":
    rows = build_rows()
    write_data(rows)
    write_card(rows)
    print(f"{len(rows)} members -> {CSV}, {JSON}, {CARD}")
