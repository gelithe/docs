# AI Advantage member database — data dictionary

One row per club profile, 608 rows. Built by `scripts/build-aia-members.py` from
`ai-advantage-members.source.txt`; re-running the script regenerates the CSV, the
JSON and the Hub card.

**Source** columns are the directory's own text, unchanged. **Derived** columns are
inferred from that text by the build script. No column comes from searching the open
web for these people.

| Column | Type | Origin | Notes |
| --- | --- | --- | --- |
| `profile_id` | string | source | 8-hex club ID; the stable key |
| `name` | string | derived | `name_raw` re-cased: SHOUTED and lowercase names normalized, initials (`K.T.`), particles (`d'Anconia`) and deliberate mixed case (`McRae`) left alone |
| `name_raw` | string | source | Exactly as the directory shows it |
| `account_type` | enum | derived | `individual` · `shared` (two people, one profile) · `organization` · `email_placeholder` (an email where a name should be) · `staff` |
| `role_in_club` | enum | derived | `member` · `staff` · `founder`. Filter to `member` for peers |
| `staff_role` | string | derived | The club role, for staff rows only |
| `tagline` | string | source | The member's own one-line bio; blank for 65% of the club |
| `roles` | string | derived | ` ; `-separated role phrases, split from `tagline` only when it reads as a list rather than prose |
| `domain_primary` | enum | derived | First match from the 11-term vocabulary below |
| `domain_secondary` | enum | derived | Next distinct match, blank if there is only one |
| `website` | url | derived | A URL embedded in the tagline, normalized to `https://` |
| `city` | string | derived | Blank when the member named only a state or country |
| `region` | string | derived | US state / Canadian province code, or a named county / region |
| `country` | string | derived | Full country name |
| `country_code` | string | derived | ISO 3166-1 alpha-2 |
| `continent` | enum | derived | North America · South America · Europe · Asia · Africa · Oceania |
| `location_raw` | string | source | What the member actually typed |
| `location_granularity` | enum | derived | How precise `location_raw` was — see below |
| `location_ambiguous` | flag | derived | `yes` when the city name exists in several countries, so `country` is a best guess |
| `completeness` | int 0–100 | derived | How much the profile tells you — see below |
| `profile_url` | url | source | Club profile link; the authoritative version of every field |

## `location_granularity`

The directory has one free-text location box, so members answered it at wildly
different resolutions. This column records which:

| Value | Meaning | Count |
| --- | ---: | ---: |
| `city` | Named a city (`San Diego`, `Nuuk`) | 243 |
| `region` | Named a state / province / county only (`California`, `Devon`) | 37 |
| `country` | Named a country only (`United States`, `Japan`) | 24 |
| `metro` | Named a metro or county (`San Francisco Bay Area`) | 6 |
| `unresolved` | Unparseable — one member wrote `North` | 1 |
| `none` | Left it blank | 297 |

Sort or filter on this before mapping anything: a `country`-granularity row is not a
missing city, it is a member who chose not to say.

## `domain_primary` / `domain_secondary`

Controlled vocabulary of 11 values, matched against the tagline by keyword. Terms are
stems (`medic*` matches *medical*, *medicine*) or whole words. The list is evaluated in
a fixed order and the first match wins, so the result is deterministic but ordered by
the vocabulary, not by the order words appear in the bio:

Health & Wellness · Real Estate · Finance & Investing · Legal · Marketing & Sales ·
Coaching & Personal Growth · Technology & AI · Education & Training · Creative & Media ·
Trades & Operations · Business & Consulting

Both columns are blank when the member wrote no bio, or wrote one with no professional
signal in it (a motto, a greeting). Blank means *unknown*, never *none of the above*.

## `completeness`

A 0–100 score for how actionable the profile is, so the people you can actually do
something with sort to the top:

| Signal | Points |
| --- | ---: |
| Wrote a tagline | 35 |
| Location at `city` granularity | 35 |
| … `metro` | 28 |
| … `region` | 22 |
| … `country` | 12 |
| … `unresolved` | 5 |
| A domain could be classified | 30 |

Median across the club is 30/100. That number, more than any other in here, is the
honest summary of the dataset.
