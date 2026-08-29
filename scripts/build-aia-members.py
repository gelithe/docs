#!/usr/bin/env python3
"""Build the AI Advantage Club member card and CSV from the captured directory listing.

Usage:  python3 scripts/build-aia-members.py

Reads   data/ai-advantage-members.source.txt  (one member per line, `@@`-delimited:
        profile_id@@name@@tagline@@location)
Writes  data/ai-advantage-members.csv         (the database)
        content/ai-advantage-members.md       (the Hub card)

To refresh: re-copy the directory listing into the source file, then re-run this.
"""
import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC  = os.path.join(ROOT, "data", "ai-advantage-members.source.txt")
CSV  = os.path.join(ROOT, "data", "ai-advantage-members.csv")
CARD = os.path.join(ROOT, "content", "ai-advantage-members.md")

import csv, re, collections

LOC = {
 # --- United States ---
 "Atlanta":("United States","GA"),"Scottsdale":("United States","AZ"),"Wenatchee":("United States","WA"),
 "Troy":("United States","MI"),"Boston":("United States","MA"),"Portland":("United States","OR"),
 "Los Angeles":("United States","CA"),"Redondo Beach":("United States","CA"),"Spanish Fork":("United States","UT"),
 "San Jose":("United States","CA"),"Naples":("United States","FL"),"Kansas City":("United States","MO"),
 "Washington":("United States","WA"),"Maine":("United States","ME"),"Cincinnati":("United States","OH"),
 "Stockton":("United States","CA"),"Marana":("United States","AZ"),"Maryland":("United States","MD"),
 "Fremont":("United States","CA"),"Riverview":("United States","FL"),"Spokane":("United States","WA"),
 "New Orleans":("United States","LA"),"Texas":("United States","TX"),"Arizona":("United States","AZ"),
 "Parkland":("United States","FL"),"Virginia":("United States","VA"),"New Jersey":("United States","NJ"),
 "Wisconsin":("United States","WI"),"San Diego":("United States","CA"),"San Diego County":("United States","CA"),
 "Oklahoma":("United States","OK"),"Buffalo":("United States","NY"),"New York City":("United States","NY"),
 "New York":("United States","NY"),"Key West":("United States","FL"),"McAllen":("United States","TX"),
 "Concord":("United States","NH"),"Norwalk":("United States","CT"),"Charlotte":("United States","NC"),
 "Monmouth County":("United States","NJ"),"Massachusetts":("United States","MA"),"Tustin":("United States","CA"),
 "Baltimore":("United States","MD"),"Dallas":("United States","TX"),"Eldon":("United States","MO"),
 "California":("United States","CA"),"Mesa":("United States","AZ"),"Puerto Rico":("United States","PR"),
 "New Braunfels":("United States","TX"),"Miami":("United States","FL"),"Huntington Beach":("United States","CA"),
 "Santa Paula":("United States","CA"),"Midlothian":("United States","VA"),"Oregon":("United States","OR"),
 "Seattle":("United States","WA"),"Pittsburgh":("United States","PA"),"West Palm Beach":("United States","FL"),
 "Bushnell":("United States","FL"),"Sultan":("United States","WA"),"Temecula":("United States","CA"),
 "Hollister":("United States","CA"),"Palm Desert":("United States","CA"),"Aguanga":("United States","CA"),
 "Connecticut":("United States","CT"),"Alabama":("United States","AL"),"Louisiana":("United States","LA"),
 "Phoenix":("United States","AZ"),"Northborough":("United States","MA"),"South Salem":("United States","OR"),
 "Palm Beach":("United States","FL"),"Hawaii":("United States","HI"),"Tarpon Springs":("United States","FL"),
 "Mount Pleasant":("United States","SC"),"Winter Haven":("United States","FL"),"Raleigh":("United States","NC"),
 "Perrysburg":("United States","OH"),"Philadelphia":("United States","PA"),"DeKalb":("United States","IL"),
 "Newport Beach":("United States","CA"),"Harwinton":("United States","CT"),"Rockwood":("United States","TN"),
 "Tucson":("United States","AZ"),"Glendale":("United States","AZ"),"Idaho":("United States","ID"),
 "Fort Worth":("United States","TX"),"Canon City":("United States","CO"),"Cardiff-by-the-Sea":("United States","CA"),
 "Albuquerque":("United States","NM"),"Rancho Mission Viejo":("United States","CA"),"Lakeland":("United States","FL"),
 "Tallahassee":("United States","FL"),"Grand Junction":("United States","CO"),"Lake Oswego":("United States","OR"),
 "Ocean Springs":("United States","MS"),"Celina":("United States","TX"),"Lincoln":("United States","NE"),
 "San Francisco":("United States","CA"),"San Francisco Bay Area":("United States","CA"),
 "Fort Lauderdale":("United States","FL"),"Durango":("United States","CO"),"New Hampshire":("United States","NH"),
 "Tampa":("United States","FL"),"Clearwater":("United States","FL"),"Nashville":("United States","TN"),
 "Deerfield":("United States","IL"),"Carmel":("United States","IN"),"Arcadia":("United States","CA"),
 "Orlando":("United States","FL"),"Lauderdale by the Sea":("United States","FL"),"Honolulu":("United States","HI"),
 "Grapevine":("United States","TX"),"Baton Rouge":("United States","LA"),"Amityville":("United States","NY"),
 "Las Vegas":("United States","NV"),"Oahu":("United States","HI"),"Snohomish":("United States","WA"),
 "Georgia":("United States","GA"),"Middletown":("United States","NY"),"Southbury":("United States","CT"),
 "Orange County":("United States","CA"),"Colorado":("United States","CO"),"Bakersfield":("United States","CA"),
 "Central Point":("United States","OR"),"Grass Valley":("United States","CA"),"Minneapolis":("United States","MN"),
 "Boise":("United States","ID"),"South Kingstown":("United States","RI"),"Fargo":("United States","ND"),
 "Camas":("United States","WA"),"Laguna Niguel":("United States","CA"),"Columbus":("United States","OH"),
 "Lutz":("United States","FL"),"Palmetto Bay":("United States","FL"),"Houston":("United States","TX"),
 "New Bern":("United States","NC"),"Leander":("United States","TX"),"Lake Tapps":("United States","WA"),
 "Chandler":("United States","AZ"),"Bloomington":("United States","IL"),"St. George":("United States","UT"),
 "Valparaiso":("United States","IN"),"Franklin":("United States","TN"),"McKinney":("United States","TX"),
 "Niceville":("United States","FL"),"Richmond":("United States","VA"),"Pasadena":("United States","CA"),
 "Melville":("United States","NY"),"South Carolina":("United States","SC"),"Aurora":("United States","CO"),
 "Wilmington":("United States","DE"),"Palo Alto":("United States","CA"),"Lancaster":("United States","PA"),
 "United States":("United States",""),
 # --- Canada ---
 "Calgary":("Canada","AB"),"Toronto":("Canada","ON"),"Ottawa":("Canada","ON"),"Montreal":("Canada","QC"),
 "Grande Prairie":("Canada","AB"),"Chambly":("Canada","QC"),"Holland Landing":("Canada","ON"),
 "Kitchener":("Canada","ON"),"Windsor":("Canada","ON"),"Airdrie":("Canada","AB"),"Nova Scotia":("Canada","NS"),
 "British Columbia":("Canada","BC"),"Canada":("Canada",""),
 # --- Europe ---
 "Lisbon":("Portugal",""),"Portugal":("Portugal",""),"Bern":("Switzerland",""),"Geneva":("Switzerland",""),
 "Paris":("France",""),"Frankfurt":("Germany",""),"Mainz":("Germany",""),"Fulda":("Germany",""),
 "Germany":("Germany",""),"Berlin":("Germany",""),"Stuttgart":("Germany",""),"Munich":("Germany",""),
 "Untergruppenbach":("Germany",""),"Hanover":("Germany",""),"Prague":("Czechia",""),"Warsaw":("Poland",""),
 "Stockholm":("Sweden",""),"Sweden":("Sweden",""),"Finland":("Finland",""),"Greece":("Greece",""),
 "Ghent":("Belgium",""),"Bevel":("Belgium",""),"Amsterdam":("Netherlands",""),"Delft":("Netherlands",""),
 "Madrid":("Spain",""),"Slovenia":("Slovenia",""),"Dublin":("Ireland",""),"Novi Sad":("Serbia",""),
 "Sofia Capital":("Bulgaria",""),"Gibraltar":("Gibraltar",""),"Nuuk":("Greenland",""),
 "London":("United Kingdom",""),"Kent":("United Kingdom",""),"Dolgellau":("United Kingdom",""),
 "Lymm":("United Kingdom",""),"Weston-super-Mare":("United Kingdom",""),"Wimbledon":("United Kingdom",""),
 "Surrey":("United Kingdom",""),"Scotland":("United Kingdom",""),"Devon":("United Kingdom",""),
 "Manchester":("United Kingdom",""),"New Forest National Park":("United Kingdom",""),
 # --- Rest of world ---
 "Melbourne":("Australia",""),"Brisbane":("Australia",""),"Sydney":("Australia",""),"Perth":("Australia",""),
 "Auckland":("New Zealand",""),"New Zealand":("New Zealand",""),"Japan":("Japan",""),
 "Dubai":("United Arab Emirates",""),"Bahrain":("Bahrain",""),"Ho Chi Minh City":("Vietnam",""),
 "Sedgefield":("South Africa",""),"San Pedro Sula":("Honduras",""),"Guadalajara":("Mexico",""),
 "Boquete District":("Panama",""),"Panama City":("Panama",""),"Cayman Islands":("Cayman Islands",""),
 "Jamaica":("Jamaica",""),"The Bahamas":("Bahamas",""),"Suriname":("Suriname",""),
}
AMBIGUOUS = {"Manchester","Naples","Windsor","Surrey","Aurora","Richmond","Lancaster","Concord",
             "Hanover","Sedgefield","Panama City","Melbourne","Portland","Glendale","Franklin",
             "Middletown","Airdrie","Troy","Washington","Bevel","Chambly","Wilmington","Carmel"}

# Domain buckets, evaluated in order — first match wins.
DOMAINS = [
 ("Health & Wellness", r"\b(health|wellness|doctor|medic|therap|psycholog|psychiatr|acupunctur|nutrition|medspa|autoimmune|gastroenter|eyecare|trauma|dementia|bone|holistic|hypno|caregiver|movement|fitness|healthcare|maternal|dental|beauty)\b"),
 ("Real Estate", r"\b(real estate|realtor|broker|rental|property|lofts)\b"),
 ("Finance & Investing", r"\b(cfo|financ|capital markets|invest|wealth|bookkeep|insurance|venture capital|blockchain)\b"),
 ("Legal", r"\b(lawyer|legal|dispute resolution|criminolog|patent|attorney)\b"),
 ("Marketing & Sales", r"\b(marketing|funnel|seo|brand|sales|storytell|content|copywrit|website|directory|telecom)\b"),
 ("Coaching & Personal Growth", r"\b(coach|mentor|mindset|transformation|personal growth|leadership|performance|change agent|alignment)\b"),
 ("Tech & AI", r"\b(ai|a\.i|engineer|software|systems|developer|technical|cyber|architect|analyst|edtech|solar)\b"),
 ("Education & Training", r"\b(educat|teacher|professor|classroom|curriculum|school|training|bootcamp)\b"),
 ("Creative & Media", r"\b(artist|writer|producer|photograph|songwriter|designer|dj |music|podcast|author|inventor|creative)\b"),
 ("Business & Consulting", r"\b(consult|founder|ceo|entrepreneur|business|director|strateg|operations|executive|owner|principal|partner)\b"),
]

rows=[]
for line in open(SRC, encoding="utf-8"):
    line=line.rstrip("\n")
    if not line.strip(): continue
    uid,name,tagline,loc = line.split("@@")
    team = "AIA Team" in name or name.startswith("AIA ")
    display = name.split(" | AIA Team")[0].strip()
    country,state = LOC.get(loc,("Unknown","")) if loc else ("Not stated","")
    blob = (tagline+" "+name).lower()
    if team:
        domain = "AI Advantage staff"
    else:
        domain = "Not stated" if not tagline.strip() else "Unclassified"
        for label,pat in DOMAINS:
            if re.search(pat, blob):
                domain=label; break
    rows.append({
        "name":display,
        "tagline":tagline,
        "location":loc,
        "state_region":state,
        "country":country,
        "domain":domain,
        "aia_team":"yes" if team else "",
        "location_ambiguous":"yes" if loc in AMBIGUOUS else "",
        "profile_url":f"https://community.aiadvantage.com/u/{uid}",
        "profile_id":uid,
    })

rows.sort(key=lambda r:(r["name"].lower()))
cols=["name","tagline","location","state_region","country","domain","aia_team","location_ambiguous","profile_url","profile_id"]
with open(CSV,"w",newline="",encoding="utf-8") as f:
    w=csv.DictWriter(f,fieldnames=cols); w.writeheader(); w.writerows(rows)


def esc(s): return s.replace("|","\\|").strip()
def link(r): return f"[profile]({r['profile_url']})"

n=len(rows)
tag=sum(1 for r in rows if r["tagline"])
loc=sum(1 for r in rows if r["location"])
team=[r for r in rows if r["aia_team"]]
ctry=collections.Counter(r["country"] for r in rows)
dom=collections.Counter(r["domain"] for r in rows)
st=collections.Counter(r["state_region"] for r in rows if r["country"]=="United States" and r["state_region"])
city=collections.Counter(r["location"] for r in rows if r["location"] and r["location"] not in ("United States","Canada"))
placed=n-ctry["Not stated"]-ctry.get("Unknown",0)

out=[]
w=out.append
w("""---
title: AI Advantage Club Member Database
emoji: 🧭
category: library
updated: 2026-08-29
---

The full **AI Advantage Club** member directory — all 608 profiles — turned into a
structured, filterable database of your AI mastery peers.

Machine-readable copy: [`data/ai-advantage-members.csv`](https://github.com/gelithe/docs/blob/main/data/ai-advantage-members.csv)

## What's in here

Ten columns per member:

| Column | Where it comes from |
| --- | --- |
| `name` | Directory (the ` \\| AIA Team` suffix moved to its own flag) |
| `tagline` | Directory — the member's own one-line bio |
| `location` | Directory — as the member wrote it |
| `state_region` | **Derived** — US state / Canadian province inferred from the city |
| `country` | **Derived** — inferred from the city or region |
| `domain` | **Derived** — professional field inferred from the tagline |
| `aia_team` | **Derived** — flags AI Advantage staff vs. fellow members |
| `location_ambiguous` | **Derived** — flags city names that exist in several countries |
| `profile_url` | Directory |
| `profile_id` | Directory |

Names, taglines, locations and links are exactly as the directory lists them. Everything marked
**Derived** is my inference from that text — nothing here comes from searching the open web for
these people, so treat the derived columns as a sorting aid, not as verified fact.

## The shape of the room
""")

w(f"- **{n} members** total, of whom **{len(team)}** are AI Advantage staff and **{n-len(team)}** are peers.")
w(f"- **{tag} ({tag*100//n}%)** wrote a tagline; **{loc} ({loc*100//n}%)** listed a location.")
w(f"- **{placed}** members can be placed on a map, across **{len([k for k in ctry if k not in ('Not stated','Unknown')])} countries**.")
w(f"- The club is majority-American ({ctry['United States']} members, {ctry['United States']*100//placed}% of everyone who stated a location) but genuinely global — from Nuuk to Ho Chi Minh City.")
w("")

w("### Where they are\n")
w("| Country | Members |")
w("| --- | ---: |")
for k,v in ctry.most_common():
    if k in ("Not stated","Unknown"): continue
    w(f"| {k} | {v} |")
w(f"| _Not stated_ | {ctry['Not stated']} |")
if ctry.get("Unknown"): w(f"| _Unresolved_ | {ctry['Unknown']} |")
w("")

w("### Top US states\n")
w("| State | Members |")
w("| --- | ---: |")
for k,v in st.most_common(12): w(f"| {k} | {v} |")
w("")

w("### Cities with the most members\n")
w("| City / region | Members |")
w("| --- | ---: |")
for k,v in city.most_common(12): w(f"| {k} | {v} |")
w("")

w("### What they do\n")
w("Inferred from taglines, so it only covers the 215 people who wrote one.\n")
w("| Domain | Members |")
w("| --- | ---: |")
for k,v in dom.most_common():
    if k in ("Not stated",): continue
    w(f"| {k} | {v} |")
w(f"| _No tagline written_ | {dom['Not stated']} |")
w("")

w("## AI Advantage staff\n")
w("Worth knowing separately — these are the people running the club, not peers.\n")
w("| Name | Role | Location | Profile |")
w("| --- | --- | --- | --- |")
for r in sorted(team,key=lambda r:r["name"].lower()):
    w(f"| {esc(r['name'])} | {esc(r['tagline']) or '—'} | {esc(r['location']) or '—'} | {link(r)} |")
w("")

w("## Full roster\n")
w(f"All {n} profiles, alphabetical. **Focus** is the member's own tagline where they wrote one.\n")
w("| Name | Focus | Location | Country | Domain | Profile |")
w("| --- | --- | --- | --- | --- | --- |")
for r in rows:
    w(f"| {esc(r['name'])} | {esc(r['tagline']) or '—'} | {esc(r['location']) or '—'} | {r['country']} | {r['domain']} | {link(r)} |")
w("")

amb=sorted({r["location"] for r in rows if r["location_ambiguous"]})
w("## Data-quality notes\n")
w("Things to know before you trust a cell:\n")
w(f"- **Ambiguous cities.** {sum(1 for r in rows if r['location_ambiguous'])} members list a city name "
  f"that exists in more than one country, so their `country` is a best guess and is flagged with "
  f"`location_ambiguous`: {', '.join(amb)}.")
w("- **`North`** is listed as a location by one member and can't be resolved; its country reads `Unknown`.")
w("- **Two names appear twice** — Amanda Marks and Natalie Huen each have two separate profile IDs. "
  "They may be duplicate accounts or two different people; both rows are kept.")
w("- **Three profiles show an email address as the display name** "
  "(`sandra@inovarhr.com`, `daniel@vantablackexecutiveservices.com`, `jorg@apdental.net`) — "
  "that is what the directory shows, not a scraping error.")
w("- **`domain` is keyword-inferred** from a single self-written line. Someone whose tagline is a "
  "motto rather than a job (\"Life happens for me, not to me!\") lands in `Unclassified`, which says "
  "nothing about what they actually do.")
w("- **Emoji and some accents were stripped** from taglines during capture; the profile link is "
  "always the authoritative version.")
w("")
w("## Refreshing this\n")
w("The directory is live and members keep joining, so this is a snapshot dated in the frontmatter. "
  "To refresh it, re-copy the members list, regenerate the CSV, and overwrite this card — the filename "
  "is fixed so the Hub always shows the current version.")
w("")

open(CARD,"w",encoding="utf-8").write("\n".join(out))
print(f"wrote {CARD} and {CSV} ({n} members)")
