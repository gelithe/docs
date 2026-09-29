---
title: AI Advantage Club Member Database
emoji: 🧭
category: library
updated: 2026-09-29
---

All **608 AI Advantage Club profiles**, systematized into one queryable table of your AI mastery peers — with the directory's free-text location and bio fields split into structured, filterable columns.

**[Open the interactive dashboard →](https://claude.ai/artifact/V19C45DjQv9GiT8PMpdjmZ)** — filter by country, domain and completeness; charts update as you filter.

| Where | What |
| --- | --- |
| [Dashboard](https://claude.ai/artifact/V19C45DjQv9GiT8PMpdjmZ) | Charts + searchable, filterable table |
| [`data/ai-advantage-members.csv`](https://github.com/gelithe/docs/blob/main/data/ai-advantage-members.csv) | The database — 21 columns, one row per member |
| [`data/ai-advantage-members.json`](https://github.com/gelithe/docs/blob/main/data/ai-advantage-members.json) | Same rows, for any tool that wants JSON |
| [`data/SCHEMA.md`](https://github.com/gelithe/docs/blob/main/data/SCHEMA.md) | Data dictionary: every column, and how it was derived |
| This card | The readable summary and the full roster |

## How the scattered data was systematized

The directory gives three free-text fields — a name, a one-line bio, a location — all written by hand, at whatever level of detail each member felt like. Those became structured columns:

| Was | Became |
| --- | --- |
| `location` — a city, a state, a country or a region, all in one field (`San Diego`, `California`, `United States`, `San Francisco Bay Area`, `15th arrondissement`) | `city`, `region`, `country`, `country_code`, `continent`, plus `location_granularity` recording how precise the original was |
| `name` — with a `\| AIA Team` suffix on staff, SHOUTED or lowercase on others, and sometimes an email address or two people on one account | `name` (re-cased), `name_raw` (untouched), `account_type`, `role_in_club`, `staff_role` |
| `tagline` — a job title, a motto, a company name or a mission statement | `tagline`, `roles` (split when it reads as a list), `domain_primary` / `domain_secondary` from a fixed 11-term vocabulary, and `website` where one was embedded |
| nothing | `completeness` 0–100, so you can sort the people you can actually act on to the top |

`name_raw` and `location_raw` keep the originals, so nothing is lost and every derivation is checkable.

## The shape of the room

- **608 profiles**: 587 peers, 19 AI Advantage staff, 2 founder accounts.
- **215 (35%)** wrote a bio; **310 (50%)** can be placed in a country; **243 (39%)** down to a city.
- **35 countries** across **6 continents**. 210 are in the US — 67% of everyone locatable — with Canada (26) and the UK (14) next.
- Median profile completeness is **30/100**. That is the real ceiling on this database: the directory is half-empty by the members' own choice.

### Location precision

| Granularity | Members | Meaning |
| --- | ---: | --- |
| `city` | 243 | Named a city |
| `metro` | 6 | Named a metro or county |
| `region` | 37 | Named a state / province / county only |
| `country` | 24 | Named a country only |
| `unresolved` | 1 | Unparseable (`North`) |
| `none` | 297 | Left it blank |

### Where they are

| Continent | Members |
| --- | ---: |
| North America | 244 |
| Europe | 48 |
| Oceania | 11 |
| Asia | 5 |
| South America | 1 |
| Africa | 1 |

| Country | Members |
| --- | ---: |
| United States | 210 |
| Canada | 26 |
| United Kingdom | 14 |
| Germany | 10 |
| Australia | 8 |
| New Zealand | 3 |
| Panama | 2 |
| Sweden | 2 |
| Czechia | 2 |
| France | 2 |
| Belgium | 2 |
| Poland | 2 |
| Portugal | 2 |
| Switzerland | 2 |
| United Arab Emirates | 2 |
| Netherlands | 2 |
| Mexico | 1 |
| Suriname | 1 |
| Serbia | 1 |
| Jamaica | 1 |
| Honduras | 1 |
| Ireland | 1 |
| Gibraltar | 1 |
| Cayman Islands | 1 |
| Greece | 1 |
| Vietnam | 1 |
| Japan | 1 |
| Finland | 1 |
| South Africa | 1 |
| Greenland | 1 |
| Bahrain | 1 |
| Bulgaria | 1 |
| Bahamas | 1 |
| Slovenia | 1 |
| Spain | 1 |

### Top US states

| State | Members |
| --- | ---: |
| CA | 40 |
| FL | 25 |
| AZ | 16 |
| TX | 15 |
| NY | 11 |
| WA | 9 |
| CO | 7 |
| OR | 7 |
| PA | 5 |
| CT | 5 |
| GA | 4 |
| NC | 4 |

### Cities with the most members

| City | Members |
| --- | ---: |
| Toronto | 9 |
| San Diego | 6 |
| Miami | 5 |
| Phoenix | 5 |
| London | 5 |
| Dallas | 5 |
| New York City | 5 |
| Calgary | 4 |
| Melbourne | 3 |
| Los Angeles | 3 |
| Portland | 3 |
| Atlanta | 3 |

### What they do

`domain_primary` for the 587 peers, from the fixed vocabulary. Only the 139 who wrote a bio with a recognisable professional signal are classified.

| Domain | Members |
| --- | ---: |
| Technology & AI | 34 |
| Health & Wellness | 23 |
| Coaching & Personal Growth | 19 |
| Finance & Investing | 15 |
| Real Estate | 13 |
| Business & Consulting | 10 |
| Creative & Media | 9 |
| Marketing & Sales | 9 |
| Education & Training | 3 |
| Legal | 2 |
| Trades & Operations | 2 |
| _No usable signal_ | 448 |

## Running the club

| Name | Role | Location | Profile |
| --- | --- | --- | --- |
| Dean Graziosi | Founder | — | [profile](https://community.aiadvantage.com/u/859db9d2) |
| Dean Graziosi & Tony Robbins | Founder | Atlanta | [profile](https://community.aiadvantage.com/u/f01f77bb) |
| Aia Communities Team | Your AI Advantage Club Support Team | Phoenix | [profile](https://community.aiadvantage.com/u/d8f77b93) |
| Aia Tech Team | — | Phoenix | [profile](https://community.aiadvantage.com/u/8256d331) |
| Ariadne Lewis | — | Panama City | [profile](https://community.aiadvantage.com/u/7fa58cd7) |
| Corey Blake | Head of Community | Deerfield | [profile](https://community.aiadvantage.com/u/f51371e3) |
| Daniel Pierce | Part of the core content creation team for AI Advantage. | Alabama | [profile](https://community.aiadvantage.com/u/cda4854c) |
| Dirk Wonhoefer | — | Germany | [profile](https://community.aiadvantage.com/u/ac7cd021) |
| Dominique Withaar | AI Image Fanatic | Stockholm | [profile](https://community.aiadvantage.com/u/700318e6) |
| Filip Lipczynski | — | Warsaw | [profile](https://community.aiadvantage.com/u/bcc8d24c) |
| Gabriela Bae | — | — | [profile](https://community.aiadvantage.com/u/393cdab1) |
| Galyn Fergerson | AIA \| AI Technical Coach | Georgia | [profile](https://community.aiadvantage.com/u/2a420bcb) |
| Igor Pogany | Head Of AI Education | Lisbon | [profile](https://community.aiadvantage.com/u/29c175d9) |
| Jennifer | — | — | [profile](https://community.aiadvantage.com/u/e8ec40c9) |
| Judah | — | — | [profile](https://community.aiadvantage.com/u/5701371a) |
| Len | AI Moderator \| Coach | Scottsdale | [profile](https://community.aiadvantage.com/u/a58d15e2) |
| Lukas Kozanak | — | — | [profile](https://community.aiadvantage.com/u/4f8795fb) |
| Luke Thomas | Community Director | — | [profile](https://community.aiadvantage.com/u/1b654a1d) |
| Mike Bradway | AIA \| Technical Community Moderator | New York | [profile](https://community.aiadvantage.com/u/2b1f6577) |
| Robert Nagy | — | — | [profile](https://community.aiadvantage.com/u/58f320c3) |
| Zachary Kelly | AI Advantage Wins & Stories \| Testimonial Lead | — | [profile](https://community.aiadvantage.com/u/195f12c6) |

## Full roster

All 587 peers, alphabetical. **Focus** is the member's own bio where they wrote one. Staff and founders are listed above, not here.

| Name | Focus | City | Country | Domain | ✓ | Profile |
| --- | --- | --- | --- | --- | ---: | --- |
| A.C. Mata | Principal + Partner @ JTC architects \| Business Owner \| Investor | Arcadia | United States | Finance & Investing | 100 | [profile](https://community.aiadvantage.com/u/bbb17653) |
| Aaron D'Souza | — | Auckland | New Zealand | — | 35 | [profile](https://community.aiadvantage.com/u/7e977d5b) |
| Abir Alameddine | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/6d4436c8) |
| Adam Bishop | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/eb9b40a8) |
| Adolfo Navas | — | Miami | United States | — | 35 | [profile](https://community.aiadvantage.com/u/76d1f107) |
| Agustin Ramos | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/f8e0a255) |
| Aida Cabello-Colon | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/9edc53e0) |
| Ailina Ismail | The Autoimmune Doctor \| Functional Medicine \| 30+ yrs helping people dismissed by "normal" bloodwork | Melbourne | Australia | Health & Wellness | 100 | [profile](https://community.aiadvantage.com/u/70982ac9) |
| Aina San Pedro | Business Systems Analyst | — | — | Technology & AI | 65 | [profile](https://community.aiadvantage.com/u/ebebf122) |
| Alan Masson | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/87970052) |
| Albert Campbell | — | Aurora | United States | — | 35 | [profile](https://community.aiadvantage.com/u/9bbdf215) |
| Alejandro Solis | Professor Xennial | Guadalajara | Mexico | Education & Training | 100 | [profile](https://community.aiadvantage.com/u/a1af109e) |
| Alex Goh | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/931a00aa) |
| Alex Guerin | — | Chambly | Canada | — | 35 | [profile](https://community.aiadvantage.com/u/b13a5dba) |
| Alex Parker | — | Lymm | United Kingdom | — | 35 | [profile](https://community.aiadvantage.com/u/559a6ba4) |
| Alexis Caldicott | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/3d94b6c1) |
| Allan Britten | — | Boise | United States | — | 35 | [profile](https://community.aiadvantage.com/u/c456d078) |
| Allana Everitt | — | Windsor | Canada | — | 35 | [profile](https://community.aiadvantage.com/u/ba2043f8) |
| Allen Johnson | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/2e5a3ab4) |
| Allen Mata | — | Canon City | United States | — | 35 | [profile](https://community.aiadvantage.com/u/5e23525c) |
| Allison Jared | A Journey That Changed Everything | Washington | United States | — | 70 | [profile](https://community.aiadvantage.com/u/4b415d46) |
| Allison Whittaker | Driven by purpose and clarity | Lancaster | United States | — | 70 | [profile](https://community.aiadvantage.com/u/4a087495) |
| Amahau Wood | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/51588624) |
| Amanda Clark | The Atypical Advocate | Philadelphia | United States | — | 70 | [profile](https://community.aiadvantage.com/u/e1d1ea5a) |
| Amanda Marks | Television Writer/Producer \| Los Angeles, CA | Los Angeles | United States | Creative & Media | 100 | [profile](https://community.aiadvantage.com/u/6571af14) |
| Amanda Marks | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/aadd94ec) |
| Amber Hunter | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/e2fa4d22) |
| Amit Gupta | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/beece013) |
| Amy Boutwell | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/1e7ca33f) |
| Amy Sleezer | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/3d651b01) |
| Ana Castilla | — | Portland | United States | — | 35 | [profile](https://community.aiadvantage.com/u/0e10ce00) |
| Ana Maria Silberman | — | Rancho Mission Viejo | United States | — | 35 | [profile](https://community.aiadvantage.com/u/a0398153) |
| Andreea Axani | — | Toronto | Canada | — | 35 | [profile](https://community.aiadvantage.com/u/8ee0dbe3) |
| Angelica Dutton | Commercial Real Estate Broker in Tucson Arizona | Tucson | United States | Real Estate | 100 | [profile](https://community.aiadvantage.com/u/783edbd5) |
| Angelique Blitch | Old school business, new school tools. | Naples | United States | Education & Training | 100 | [profile](https://community.aiadvantage.com/u/3b56c217) |
| Angelo Epiifano | CO-OWNER, CO-CEO of Hollywood DJs & Productions LLC | Middletown | United States | Business & Consulting | 100 | [profile](https://community.aiadvantage.com/u/c6ac60f6) |
| Anita Butler | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/8a0dd920) |
| Ann Moncure | — | Boston | United States | — | 35 | [profile](https://community.aiadvantage.com/u/30b1e8d4) |
| Ann White | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/ae54bb16) |
| Anne Lauck | In a world where you can be anyone, be who YOU decide to be | United States | United States | — | 47 | [profile](https://community.aiadvantage.com/u/cde44355) |
| Anno Bauer | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/af110570) |
| Antoinette Willemsen | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/dabeefe8) |
| Antony Chin A Foeng | — | Suriname | Suriname | — | 12 | [profile](https://community.aiadvantage.com/u/2f349d86) |
| Aphissada Demikul | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/07eac701) |
| Apryl Smith | Boutique & Lifestyle Brand Powerhouse - Founder of Hopkins Beauty Solutions - The Total Diva Experience \| Empowering Confidence Through Fashion, Wellness & Purpose | Amityville | United States | Health & Wellness | 100 | [profile](https://community.aiadvantage.com/u/dd8b5c8d) |
| Archie Tanaka | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/d79ba698) |
| Asa Lindam | — | Sweden | Sweden | — | 12 | [profile](https://community.aiadvantage.com/u/624c28b0) |
| Astrid Lau | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/adf012fa) |
| Bal Dhanda | Company Director \| Owner of Car Servicing & MOT Business \| Life & Business Coach | London | United Kingdom | Coaching & Personal Growth | 100 | [profile](https://community.aiadvantage.com/u/3d7f5861) |
| Barbara Christenson | Co-creating Health and Wellness through Connections | Lake Oswego | United States | Health & Wellness | 100 | [profile](https://community.aiadvantage.com/u/0d0df7d0) |
| Barbara Smith | — | Concord | United States | — | 35 | [profile](https://community.aiadvantage.com/u/e0b70a42) |
| Barbara Zemanova | Barbara with AI | Prague | Czechia | Technology & AI | 100 | [profile](https://community.aiadvantage.com/u/762f2030) |
| Benjamin Genzman | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/d0e190bd) |
| Bernard Allen-Bey | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/fc55bcb4) |
| Beth Allen | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/f5e76b0c) |
| Beth Wilding | I build and optimize funnels that help businesses reach the right people-and consistently generate leads, booked appointments, and sales. | Spanish Fork | United States | Marketing & Sales | 100 | [profile](https://community.aiadvantage.com/u/ef2570b8) |
| Biljana Slankamenac | — | Novi Sad | Serbia | — | 35 | [profile](https://community.aiadvantage.com/u/f5f5bfca) |
| Billy Howard | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/8ae92b2b) |
| Billy Willis | — | Mount Pleasant | United States | — | 35 | [profile](https://community.aiadvantage.com/u/55357984) |
| Bob Gallo | — | New Jersey | United States | — | 22 | [profile](https://community.aiadvantage.com/u/598208aa) |
| Bonnica Vuong | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/002f6ed0) |
| Brad Hughes | Helping leaders clarify work and make it flow, leveraging AI | — | — | Technology & AI | 65 | [profile](https://community.aiadvantage.com/u/76928e99) |
| Bradley McDonald | Architect Painfully embracing A.I. | Glendale | United States | Technology & AI | 100 | [profile](https://community.aiadvantage.com/u/7dd2f541) |
| Brandy Willis | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/865ee15e) |
| Brenda Nabawanguzi | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/53b2a2b2) |
| Brenda Petrillo | — | Arizona | United States | — | 22 | [profile](https://community.aiadvantage.com/u/7986ac45) |
| Brett Greene | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/d59d7cc2) |
| Brian Ewing | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/ddd70e9a) |
| Brian McLain | Building Tomorrows Workforce in Today's Classroom | Oklahoma | United States | Education & Training | 87 | [profile](https://community.aiadvantage.com/u/a5f74303) |
| Brody Atkin | AI Consultant & Parkour Coach | Airdrie | Canada | Coaching & Personal Growth | 100 | [profile](https://community.aiadvantage.com/u/1f630c3a) |
| Brooke Cheney | The Zen of Shooting - Fun with Guns for All | Harwinton | United States | — | 70 | [profile](https://community.aiadvantage.com/u/99b25cea) |
| Brooke Law | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/c4971a71) |
| Bruce Crosby | Always here to help. | Holland Landing | Canada | — | 70 | [profile](https://community.aiadvantage.com/u/d227712d) |
| Bruno Pecly | — | Atlanta | United States | — | 35 | [profile](https://community.aiadvantage.com/u/06b0e824) |
| Bryan Drews | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/8371e472) |
| Bryan Nunan | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/7b231f90) |
| Bryan Wisdom | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/38e51e11) |
| Caglayan Cevrem Campbell | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/17da1028) |
| Cami Colbert | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/8a030f02) |
| Candi B | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/bb8aca14) |
| Carmen Carmen | Learn * Apply * Improve * Share | Virginia | United States | — | 57 | [profile](https://community.aiadvantage.com/u/6fd70dc8) |
| Carmen Oliver | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/51918973) |
| Carole Garnier Louvat | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/e8e044d9) |
| Caroline Krivuzoff | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/915f328b) |
| Carolyn Sims | — | Idaho | United States | — | 22 | [profile](https://community.aiadvantage.com/u/7e9aa88c) |
| Carolyn Taylor | — | United States | United States | — | 12 | [profile](https://community.aiadvantage.com/u/c30ff4bf) |
| Caryn Smith | AI Enthusiast | United States | United States | Technology & AI | 77 | [profile](https://community.aiadvantage.com/u/c49fd415) |
| Catherine Gorgolinski | AI | — | — | Technology & AI | 65 | [profile](https://community.aiadvantage.com/u/159bc69f) |
| Cathy Clark | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/0c1ffe6a) |
| Ceci Kramer | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/1cc8ad60) |
| Celine Thomas | Executive Coach | Paris | France | Coaching & Personal Growth | 100 | [profile](https://community.aiadvantage.com/u/65cf7202) |
| Chani Seiden | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/c6dde7f6) |
| Charlene Shaw | Nothing that we do is existentially relevant... | Lauderdale by the Sea | United States | — | 70 | [profile](https://community.aiadvantage.com/u/3bda3d00) |
| Charles Berger | — | Southbury | United States | — | 35 | [profile](https://community.aiadvantage.com/u/090b3046) |
| Charles Pellegrini | At Your Service. www.StarLoftsPgh.com | Pittsburgh | United States | — | 70 | [profile](https://community.aiadvantage.com/u/df38776f) |
| Charlyn Huss d'Anconia | Helping You Feel Better First-So You Can Get Stronger and Stay That Way \| Creator of the CoreSpring Method | Los Angeles | United States | — | 70 | [profile](https://community.aiadvantage.com/u/4d33522a) |
| Charmaine Green | — | Redondo Beach | United States | — | 35 | [profile](https://community.aiadvantage.com/u/f8b99d58) |
| Chef Marian | Save time. Save money. Eat healthier. | San Diego | United States | Health & Wellness | 100 | [profile](https://community.aiadvantage.com/u/ebebd050) |
| Cheryl Milone | Honored to help inventors and creators monetization their innovation | — | — | Creative & Media | 65 | [profile](https://community.aiadvantage.com/u/097b729b) |
| Cheryl Morris | — | California | United States | — | 22 | [profile](https://community.aiadvantage.com/u/b40e2ee2) |
| Chester Earls | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/530eb9af) |
| Chris Eley | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/e04315b6) |
| Chris Gubbels | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/958b2f57) |
| Chris Hay | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/f734eca9) |
| Chris Jorgensen | — | Clearwater | United States | — | 35 | [profile](https://community.aiadvantage.com/u/cc79287b) |
| Chris Sedlak | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/2d2fad24) |
| Christian Duve | Dispute Resolution - Investment | Frankfurt | Germany | Finance & Investing | 100 | [profile](https://community.aiadvantage.com/u/95293275) |
| Christina Marcos | Global Strategy & Innovation Executive | Bakersfield | United States | Business & Consulting | 100 | [profile](https://community.aiadvantage.com/u/aa64e36f) |
| Christina Micu | Real estate entrepreneur, wife, mother, sister, grandma, friend | — | — | Real Estate | 65 | [profile](https://community.aiadvantage.com/u/245d4cb8) |
| Christine Douheret | Excited to Amplify | San Diego | United States | — | 70 | [profile](https://community.aiadvantage.com/u/baf17505) |
| Christine Faulkner | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/af311aeb) |
| Christine Guidi | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/459c5e43) |
| Christine Koski | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/f7cbcf56) |
| Christine Parker | — | Dallas | United States | — | 35 | [profile](https://community.aiadvantage.com/u/ab85488a) |
| Christopher Perry | To go fast, go alone. To go far, go together. -African proverb | Perrysburg | United States | — | 70 | [profile](https://community.aiadvantage.com/u/feccff52) |
| Cindi Gordon | Operations Executive Exploring AI as a Strategic Partner | Toronto | Canada | Technology & AI | 100 | [profile](https://community.aiadvantage.com/u/0d1fb494) |
| Cindy Jacks | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/21dbfa45) |
| Cinzia Donald | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/597855e5) |
| Cissy Chen | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/2a37c707) |
| Clare Furlonger | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/64b70c5c) |
| Claudia Brenner | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/e8792aec) |
| Claus Beck | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/9067e0be) |
| Corbin Hibbs | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/bee5846a) |
| Curt B | — | Lincoln | United States | — | 35 | [profile](https://community.aiadvantage.com/u/2c826c8d) |
| Cydney Einck | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/7e1245c8) |
| Dan Aloi | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/15114e4e) |
| Dan Gullion | — | Fremont | United States | — | 35 | [profile](https://community.aiadvantage.com/u/88318852) |
| Dan Joandrea | Life happens for me, not to me! | Troy | United States | — | 70 | [profile](https://community.aiadvantage.com/u/912af2f6) |
| Dana Moraru | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/cbb88d69) |
| Dana Weary | Make your move! | Spokane | United States | — | 70 | [profile](https://community.aiadvantage.com/u/1d1db864) |
| Daniel Chan | Working on digital growth in Solar & Batteries | Buffalo | United States | Technology & AI | 100 | [profile](https://community.aiadvantage.com/u/d097327d) |
| daniel@vantablackexecutiveservices.com | Former tree business owner \| Now building an AI Operating System for service businesses | Colorado | United States | Technology & AI | 87 | [profile](https://community.aiadvantage.com/u/04789768) |
| Danny Castle | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/056538b3) |
| Darlene Morse | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/9c8dc826) |
| Darren Liebmann | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/8187f61d) |
| David Branik | — | Prague | Czechia | — | 35 | [profile](https://community.aiadvantage.com/u/5228da32) |
| David Braxton | — | Raleigh | United States | — | 35 | [profile](https://community.aiadvantage.com/u/be637231) |
| David Cann | Songwriter, Singer, Sync Artist, Producer, Process Engineer, Software Designer | Ottawa | Canada | Technology & AI | 100 | [profile](https://community.aiadvantage.com/u/371b68b3) |
| David Carroll | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/7d58b5d8) |
| David Howe | AI Leaner | Sydney | Australia | Technology & AI | 100 | [profile](https://community.aiadvantage.com/u/b0de3cb9) |
| David Pent | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/4eda454d) |
| David Weingarten | — | Portland | United States | — | 35 | [profile](https://community.aiadvantage.com/u/2bf4c407) |
| Debra Phillips | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/b4333f0a) |
| Denise Christie | — | Kitchener | Canada | — | 35 | [profile](https://community.aiadvantage.com/u/c39bb03d) |
| Denise Kay | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/8152d257) |
| Dennis Ward | I'll tune your website so visitors know what you do and what to do next! | Fort Worth | United States | Marketing & Sales | 100 | [profile](https://community.aiadvantage.com/u/18638c17) |
| Derek Grills | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/285feda0) |
| Deretta Faigin | Making others' job easier. | Laguna Niguel | United States | — | 70 | [profile](https://community.aiadvantage.com/u/8a8cdbe0) |
| Dharmin Desai | Strategy-to-Execution Advisor \| Business, Technology & Investment Decision-Making | Sydney | Australia | Finance & Investing | 100 | [profile](https://community.aiadvantage.com/u/9a0e9136) |
| Dominique Seguin | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/1df85146) |
| Don Free | — | Miami | United States | — | 35 | [profile](https://community.aiadvantage.com/u/53dfb7b4) |
| Donatella Battistella | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/91a1448a) |
| Donna Hailey | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/3a4235a6) |
| Donna Hobbs | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/5c396e7e) |
| Donna Marie Romeo | Donna's Future | New York City | United States | — | 70 | [profile](https://community.aiadvantage.com/u/dfeb8096) |
| Donna Vincent | Building my future leveraging AI | Toronto | Canada | Technology & AI | 100 | [profile](https://community.aiadvantage.com/u/14537d1a) |
| Donna Wong | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/845b1f9c) |
| Dori Daknis | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/02ccac46) |
| Doug Brooks | You are only limited by your inability to dream | Jamaica | Jamaica | — | 47 | [profile](https://community.aiadvantage.com/u/33315bfb) |
| Doug Foreman | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/1ecd61d1) |
| Ed Malko | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/bc723dcf) |
| Edith Kernerman | — | Toronto | Canada | — | 35 | [profile](https://community.aiadvantage.com/u/92f5d3c8) |
| Eduardo Arroyo | Brainload Engineering: Making Leadership as We Know It Obsolete | Puerto Rico | United States | Coaching & Personal Growth | 87 | [profile](https://community.aiadvantage.com/u/5a69acaa) |
| Edward Ung | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/393b92e9) |
| Edward Vargas | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/6209cbdc) |
| Eileen Lacerte | AI-Leen | Hawaii | United States | Technology & AI | 87 | [profile](https://community.aiadvantage.com/u/d50408f1) |
| Einaudi Enrico | — | Paris | France | — | 35 | [profile](https://community.aiadvantage.com/u/fbe842ce) |
| Elaine Poon | Sharper Diagnostics. More Presence in Life. Saving time. | Calgary | Canada | — | 70 | [profile](https://community.aiadvantage.com/u/e3cc80f4) |
| Elisabeth Covella-Hanley | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/68a8a639) |
| Elizabeth Aungier | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/5e26812d) |
| Elizabeth Collado | — | United States | United States | — | 12 | [profile](https://community.aiadvantage.com/u/913cdfa1) |
| Eloise Schoeman | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/8b673f8c) |
| Emmanuel Itoje | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/06d253ea) |
| Enid Prasad | — | New York City | United States | — | 35 | [profile](https://community.aiadvantage.com/u/71dbe1a1) |
| Erasmo Di Russo | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/9a5fab71) |
| Eric Marshall | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/00de37bc) |
| Eric Moser | Me + AI = Me v2.0??? | Santa Paula | United States | Technology & AI | 100 | [profile](https://community.aiadvantage.com/u/17e5b9c8) |
| Eric Peter Sabonghy | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/cb816226) |
| Esther Zeidman | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/aaea377a) |
| EvaMarie Walker | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/d1d1524c) |
| Evan Hewitt | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/18b4c3b2) |
| Evy Macquoy | Helping people understand their horses better through acupressure & connection | Bevel | Belgium | Health & Wellness | 100 | [profile](https://community.aiadvantage.com/u/391c6205) |
| Faith Sohl | — | Seattle | United States | — | 35 | [profile](https://community.aiadvantage.com/u/fe4d26c7) |
| Farzad Kohanzadeh | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/31d4976f) |
| Fiona Bromfield | Redefining Eyecare: Blending Clinical Excellence with Style and Heart | Weston-super-Mare | United Kingdom | Health & Wellness | 100 | [profile](https://community.aiadvantage.com/u/8f8f6f69) |
| Fran Ferguson | Senior Executive Performance Coach \| Business Advisor \| Financial Intermediary | Dallas | United States | Finance & Investing | 100 | [profile](https://community.aiadvantage.com/u/ad29a673) |
| Francis Fitzpatrick | Business Owner, Lawyer and Entrepreneur | Portugal | Portugal | Legal | 77 | [profile](https://community.aiadvantage.com/u/4ea744dc) |
| Frank Nuchereno | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/57c34653) |
| Frank Tirelli | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/f6c24718) |
| Franklin Ayensu | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/58a5cb6b) |
| Gabrielle Morquecho / GR Leadership | grleadership consulting | Buffalo | United States | Business & Consulting | 100 | [profile](https://community.aiadvantage.com/u/b240dc2f) |
| Gareth Arbuthnot | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/a33cdaa3) |
| Garry Drisdelle | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/640dd8a9) |
| Gary Browning | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/df8d5562) |
| Gayle Abbott | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/e55329ef) |
| Gene Palmer | — | Perth | Australia | — | 35 | [profile](https://community.aiadvantage.com/u/9ffb732d) |
| Georg Kerschhackl | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/683be058) |
| George Guillory | Broker \| Owner ~ Guillory Real Estate | San Francisco Bay Area | United States | Real Estate | 93 | [profile](https://community.aiadvantage.com/u/500cd459) |
| Gerardo Rivera Pagan | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/a6afa177) |
| German Cerezo | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/b0fa4860) |
| Ginger Ross | Own Your Choices - Own Your Life | Tarpon Springs | United States | — | 70 | [profile](https://community.aiadvantage.com/u/3c40c1c9) |
| Gisele Saenger | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/10cd39b3) |
| Greg Lehrmann | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/d0798d43) |
| Gregory Herrman | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/83233bfc) |
| Guillermo Sosa-Suarez | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/bc86ccf5) |
| Guo Zhan Guo Zhan | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/5ef3e43e) |
| Guorui Kass | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/c1eb88d0) |
| Gurpreet Kaur | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/6006a8d1) |
| Gynelle Bowie | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/27b21c1b) |
| Harmony Le | — | South Carolina | United States | — | 22 | [profile](https://community.aiadvantage.com/u/27505828) |
| Heather Brundage | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/df8ee292) |
| Heather EE Poirier | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/57e19b6b) |
| Heidi Bingham | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/5ec6bb3d) |
| Heidi Evans | — | California | United States | — | 22 | [profile](https://community.aiadvantage.com/u/c4069497) |
| Helen Konstan | — | Melbourne | Australia | — | 35 | [profile](https://community.aiadvantage.com/u/8faaa37d) |
| Helen Qian | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/20875108) |
| HeleneMickey Wilson | Family Life Coach | Newport Beach | United States | Coaching & Personal Growth | 100 | [profile](https://community.aiadvantage.com/u/3e7616d8) |
| Hilary Garner | Inventor, Creative Collaborator, Global Perspective & Provocative Thinker! | Toronto | Canada | Creative & Media | 100 | [profile](https://community.aiadvantage.com/u/ee4d9a44) |
| Honorio Reyes | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/488a90d2) |
| Howard Laiderman | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/33a46352) |
| Hsin Chieh Fang | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/a3b56dc3) |
| Hugo Balarezo | Need AI for Real Estate, Stock investing and Online Program Development | Rockwood | United States | Real Estate | 100 | [profile](https://community.aiadvantage.com/u/66cc6315) |
| Ian Roundell | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/1b477543) |
| Irena Butler | Own Your Life | — | — | — | 35 | [profile](https://community.aiadvantage.com/u/b9e57ce8) |
| Isabel De Haro | Connecting Art and Innovation | Miami | United States | — | 70 | [profile](https://community.aiadvantage.com/u/94985367) |
| Isabella Koeberle | good living energy, Isabella Koeberle | Stuttgart | Germany | — | 70 | [profile](https://community.aiadvantage.com/u/aab7101c) |
| Istvan Takacs | Creativity, passion, solving problems, overcoming setbacks, running marathons and ultra marathons | Fulda | Germany | — | 70 | [profile](https://community.aiadvantage.com/u/f60e4d3a) |
| Iva HoSang | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/03843a0a) |
| Ivelina Atanasova | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/f90c451c) |
| Izumi Yamamoto | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/88c8d0a6) |
| J Wallace | — | Scotland | United Kingdom | — | 22 | [profile](https://community.aiadvantage.com/u/21edcc60) |
| J. Benjamin Membreno | Long Time Life Lover | San Pedro Sula | Honduras | — | 70 | [profile](https://community.aiadvantage.com/u/9c00271f) |
| Jacob DeVary | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/3bd0ea30) |
| Jacqueline Terzieva | Bridge Builder + AI Believer = Human Potential, Unleashed | Hanover | Germany | Technology & AI | 100 | [profile](https://community.aiadvantage.com/u/170e7afa) |
| Jaime James | Love to learn, grow and share together | New Zealand | New Zealand | — | 47 | [profile](https://community.aiadvantage.com/u/52c829e1) |
| Jake Burke | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/c7951416) |
| James Chandler | WealthSkill Creator | San Jose | United States | Finance & Investing | 100 | [profile](https://community.aiadvantage.com/u/480bdc98) |
| James Coles | Founder & CEO, Solec Marketing - AI Concierge Systems That Never Miss a Call | Temecula | United States | Marketing & Sales | 100 | [profile](https://community.aiadvantage.com/u/2075fbaa) |
| James McGee | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/7d6f9f5c) |
| James Sherwood | — | Tampa | United States | — | 35 | [profile](https://community.aiadvantage.com/u/296bfbfd) |
| James Walker | Personal Change Agent working at the level of identity | Fargo | United States | Coaching & Personal Growth | 100 | [profile](https://community.aiadvantage.com/u/a6cb1e31) |
| Jana Tostrude | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/1eaab8b1) |
| Janet Antunez Rojas | Visionary Entrepreneur \| Realtor \| Business Architect \| Empowering Growth Through AI, Real Estate & Innovation | United States | United States | Real Estate | 77 | [profile](https://community.aiadvantage.com/u/62fee4fe) |
| Jaroslav Prusa | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/3176b80e) |
| Jason Randall | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/a84ff27d) |
| Jean-Paul Riby | Author \| Sustainability Advocate \| Neuroscience \| Languages \| French Coach | Houston | United States | Coaching & Personal Growth | 100 | [profile](https://community.aiadvantage.com/u/d5a91b50) |
| Jeanie Abeel | Helping you get your Must Do Goals done and done! | Sultan | United States | — | 70 | [profile](https://community.aiadvantage.com/u/539274e0) |
| Jeff Massone | Leadership and Personal Growth Coach for Young Professionals | Monmouth County | United States | Coaching & Personal Growth | 93 | [profile](https://community.aiadvantage.com/u/bad3d2f1) |
| Jen Hill | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/d7c0621e) |
| Jenni Coward | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/48ca27ce) |
| Jennifer Broome | Artistry Afield "Passionately Going Further" | Connecticut | United States | Creative & Media | 87 | [profile](https://community.aiadvantage.com/u/9d6e039b) |
| Jennifer Brusse | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/7e6e2c40) |
| Jennifer King | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/241358d7) |
| Jennifer Veerkamp | — | Grass Valley | United States | — | 35 | [profile](https://community.aiadvantage.com/u/5f4dda9a) |
| Jennylle Zanzi | AI Architect | Richmond | United States | Technology & AI | 100 | [profile](https://community.aiadvantage.com/u/23352c44) |
| Jeremy Nicolls | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/341f6e5d) |
| Jersey Wulster | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/c30fd532) |
| Jerzy Zych | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/90d5b280) |
| Jess McCarty | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/487ffdbb) |
| Jessica Kunce | Just a regular girl trying to make her way in a robot world | — | — | — | 35 | [profile](https://community.aiadvantage.com/u/96408e53) |
| Jill Larsen | Passionate Entrepreneur, Educator, and Real Estate Investor Committed to Shaping Young Minds and Building Futures | Norwalk | United States | Real Estate | 100 | [profile](https://community.aiadvantage.com/u/bd7d5569) |
| Jill Wolforth | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/17203c3d) |
| Jim Burgoyne | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/63999cbb) |
| Jim Potts | — | San Diego | United States | — | 35 | [profile](https://community.aiadvantage.com/u/f78c0b0f) |
| Joanie Jones | mom to three (49,30,24) wife | Colorado | United States | — | 57 | [profile](https://community.aiadvantage.com/u/0c7f8093) |
| Joanna Maxwell | — | Arizona | United States | — | 22 | [profile](https://community.aiadvantage.com/u/5348964d) |
| Jody Anderson | — | New Zealand | New Zealand | — | 12 | [profile](https://community.aiadvantage.com/u/23612cfb) |
| Jody Ruth | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/e9be326c) |
| Joe Caputo | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/e6bb5439) |
| Joe McGinn | I CREATE MIRACLES - and Teach Others How TO DO IT, TOO! | Oahu | United States | — | 70 | [profile](https://community.aiadvantage.com/u/643071b8) |
| Joe Petrovski | — | North | — | — | 5 | [profile](https://community.aiadvantage.com/u/345b3612) |
| John Casey | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/c18cd905) |
| John Komarnicki | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/9f8344bc) |
| John Samson | Today Matters! | Glendale | United States | — | 70 | [profile](https://community.aiadvantage.com/u/bd43dfa1) |
| John Seibert | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/a7c93342) |
| Jon Goodell | — | South Salem | United States | — | 35 | [profile](https://community.aiadvantage.com/u/1f342444) |
| Jonathan Cox | — | San Diego | United States | — | 35 | [profile](https://community.aiadvantage.com/u/699e4f38) |
| Jonathan O'Rear | Building Amazing People, Places and Experiences | New Orleans | United States | — | 70 | [profile](https://community.aiadvantage.com/u/f20949c9) |
| jorg@apdental.net | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/8acb3db9) |
| Jose Pachicano | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/f946f889) |
| JoseMi Jauregui | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/af7ffe38) |
| Joseph Marsco | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/6a7c19b8) |
| Joseph Pepka | We Take the SH out of IT | Bloomington | United States | — | 70 | [profile](https://community.aiadvantage.com/u/317023f0) |
| Judith Dixon | Living my best life with AI | New Forest | United Kingdom | Technology & AI | 100 | [profile](https://community.aiadvantage.com/u/5e857892) |
| Judy Hall | Helping companies grow their businesses | Nova Scotia | Canada | — | 57 | [profile](https://community.aiadvantage.com/u/8024fea2) |
| Judy Vessels | Profession Service! Person Care! | Dallas | United States | — | 70 | [profile](https://community.aiadvantage.com/u/db4358fd) |
| Julia Brandstetter | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/42117fb9) |
| Julia Klasson Langhorst | — | California | United States | — | 22 | [profile](https://community.aiadvantage.com/u/069c5548) |
| Julian De Silva | — | London | United Kingdom | — | 35 | [profile](https://community.aiadvantage.com/u/6d46397d) |
| Julie Hubert | Founder and President of Workland | Montreal | Canada | Business & Consulting | 100 | [profile](https://community.aiadvantage.com/u/97059cdf) |
| Julie Lappin | — | Charlotte | United States | — | 35 | [profile](https://community.aiadvantage.com/u/6546e148) |
| Julie Torani | Founder of JT Strategic Consulting, Julie Torani drives business and AI transformation while building a botanical brand inspired by nature | Toronto | Canada | Marketing & Sales | 100 | [profile](https://community.aiadvantage.com/u/43e63091) |
| Jun Kawashima | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/ff938876) |
| Justin James | Virtual Event Strategist & Producer for Coaches and Speakers | Phoenix | United States | Coaching & Personal Growth | 100 | [profile](https://community.aiadvantage.com/u/34310a74) |
| Justin Miller | Author, Real Estate Agent, Entrepreneur in Las Vegas | Las Vegas | United States | Real Estate | 100 | [profile](https://community.aiadvantage.com/u/d1b92341) |
| K.T. Williams | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/b98fcc76) |
| Kalyani Gilliam | If not now, when? | Carmel | United States | — | 70 | [profile](https://community.aiadvantage.com/u/d6b27968) |
| Karen Donn | Preserving Humanity Through The Digital Age - Helping Companies Stay Aligned with Their Mission | Midlothian | United States | — | 70 | [profile](https://community.aiadvantage.com/u/06e1cfdc) |
| Karen Lazarich | Live Well. Live Bright. | Celina | United States | — | 70 | [profile](https://community.aiadvantage.com/u/1829c537) |
| Karen Scullion | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/005d2708) |
| Karen Smith | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/30cfe1e1) |
| Karianne Lamm-Kittelsen | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/b78f927c) |
| Karl Goldkamp | — | New Bern | United States | — | 35 | [profile](https://community.aiadvantage.com/u/745702fb) |
| Karla Peperone | Making Joy the New Normal | Louisiana | United States | — | 57 | [profile](https://community.aiadvantage.com/u/e4e520c2) |
| Karolina Fil | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/f12df4ad) |
| Kat Taranto | MINT to grow! | Kansas City | United States | — | 70 | [profile](https://community.aiadvantage.com/u/f61f9c4b) |
| Katherine Chiang | — | Dublin | Ireland | — | 35 | [profile](https://community.aiadvantage.com/u/3d7ae026) |
| Kathy Rehberg | — | Grand Junction | United States | — | 35 | [profile](https://community.aiadvantage.com/u/3cae014f) |
| Kathy Rutherford | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/8946943c) |
| Katie Michael | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/d0219606) |
| Keith Burgad | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/a9c8c5e7) |
| Kelli Avila | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/11c659c0) |
| Kelly Allen | XR Kelly | New Braunfels | United States | — | 70 | [profile](https://community.aiadvantage.com/u/ed2218d6) |
| Kelly Wood | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/4cd30c51) |
| Ken Gootnick | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/554bd871) |
| Ken Thimmel | Ken Thimmel - Paying It Forward | — | — | — | 35 | [profile](https://community.aiadvantage.com/u/ad26f06b) |
| Kerry Scott | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/f9d7266a) |
| Kevin Harvey | — | Surrey | United Kingdom | — | 22 | [profile](https://community.aiadvantage.com/u/ee59806f) |
| Kevin Jameson | Passionate Promoter of Dementia Awareness | Philadelphia | United States | Health & Wellness | 100 | [profile](https://community.aiadvantage.com/u/028e5526) |
| Kim Kake | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/4e8c43dc) |
| Kimberley Wirht | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/cb5d9d23) |
| Kimberly Barton | — | Wisconsin | United States | — | 22 | [profile](https://community.aiadvantage.com/u/a80b2053) |
| Kimberly Capwell | Scaling with AI! | Newport Beach | United States | Technology & AI | 100 | [profile](https://community.aiadvantage.com/u/a009bedd) |
| Kirt Roiz | Father, foreman, and AI forger | Aguanga | United States | Technology & AI | 100 | [profile](https://community.aiadvantage.com/u/b2d12e71) |
| Kostek Sytnyk | — | Warsaw | Poland | — | 35 | [profile](https://community.aiadvantage.com/u/2e833546) |
| Kristi Harjo | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/d128f020) |
| Kristin & James Francis | Bone Health Advocate | Tustin | United States | Health & Wellness | 100 | [profile](https://community.aiadvantage.com/u/bae07e12) |
| Kristine Caruso | Peak Performance Solutions by Edgevity, Inc. | Parkland | United States | Coaching & Personal Growth | 100 | [profile](https://community.aiadvantage.com/u/e4a14e32) |
| Lance Lorfeld | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/bd006560) |
| Lance Lovejoy | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/41e79c50) |
| LaRonda White | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/ec46595c) |
| Larry Ronneberg | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/6772fd77) |
| Laura Blunk | — | Maryland | United States | — | 22 | [profile](https://community.aiadvantage.com/u/dc8e5eef) |
| Laura Warshauer | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/e288e552) |
| Laurel Biddulph | — | Oregon | United States | — | 22 | [profile](https://community.aiadvantage.com/u/a98b0dba) |
| Lauren Rawlings | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/85defe20) |
| Len Goss | Results Coach | Gibraltar | Gibraltar | Coaching & Personal Growth | 77 | [profile](https://community.aiadvantage.com/u/42bb7f58) |
| Leonie Jones | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/f3cc2db3) |
| Leslie Wallop | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/88b9e85a) |
| Linda Bayko | Serial Entrepreneur and Corporate Sales Professional in Software Development | Winter Haven | United States | Marketing & Sales | 100 | [profile](https://community.aiadvantage.com/u/aaf4a4e5) |
| Linda Victor | ParentCare Path, Gives Family Caregivers Solutions for Care, Safety and Comfort | United States | United States | Health & Wellness | 77 | [profile](https://community.aiadvantage.com/u/0d661a41) |
| Lisa Call | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/3c47e514) |
| Lisa Kaye | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/12503293) |
| Lisa Mattingly | Great Days Aren't Had, They're Made | Lake Tapps | United States | — | 70 | [profile](https://community.aiadvantage.com/u/597b020f) |
| Lisa Monk | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/43ae114f) |
| Lisa Simpson | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/2dd512e3) |
| Lisa Van Meter | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/adf8296a) |
| Lloyd Williams | Mastering The Power Of A.i For Business | Sydney | Australia | Technology & AI | 100 | [profile](https://community.aiadvantage.com/u/a7c62aaf) |
| Lorena Martinez Noriega | CFO | Orlando | United States | Finance & Investing | 100 | [profile](https://community.aiadvantage.com/u/97cc4625) |
| Lori Burris | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/c4de695f) |
| Lori McRae McRae | Toronto Designer Makes the Cayman Islands Home | Cayman Islands | Cayman Islands | Creative & Media | 77 | [profile](https://community.aiadvantage.com/u/52f1bc2f) |
| Lori Modico | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/559f0af0) |
| Louise Gooden | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/8bd7a7e7) |
| Lucus Fuentes | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/500e22a1) |
| Lyca Shan | Billy Ryder \| Storyteller, System-Builder, and Wildhearted Creator Helping Women Reclaim Power Through Story. | Kent | United Kingdom | Marketing & Sales | 87 | [profile](https://community.aiadvantage.com/u/b203e106) |
| Lydia Kotini | Holistic Wellness Coach | Greece | Greece | Health & Wellness | 77 | [profile](https://community.aiadvantage.com/u/596456b9) |
| Lyn Lasneski | Creative Genius | Colorado | United States | Creative & Media | 87 | [profile](https://community.aiadvantage.com/u/a5ff1b54) |
| Lynda Anderson | — | Valparaiso | United States | — | 35 | [profile](https://community.aiadvantage.com/u/69ddb589) |
| Mai Hung Ho | Entrepreneur \| EdTech Builder \| Aquaculture Innovator \| Real Estate Investor | Ho Chi Minh City | Vietnam | Real Estate | 100 | [profile](https://community.aiadvantage.com/u/48a815fb) |
| Majah Winblad | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/0458bf2d) |
| Major Sanders | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/6ff22000) |
| Manjiri Rao-Kostas | Locally Known - Internationally Connected Realtor | Franklin | United States | Real Estate | 100 | [profile](https://community.aiadvantage.com/u/c278c5a1) |
| Marc Crawford | — | Baton Rouge | United States | — | 35 | [profile](https://community.aiadvantage.com/u/0e080a39) |
| Marcel Mollet | — | Bern | Switzerland | — | 35 | [profile](https://community.aiadvantage.com/u/a60954dc) |
| Marcy Rodrigues | Driven to Succeed by gaining more time and financial independence! | Toronto | Canada | Finance & Investing | 100 | [profile](https://community.aiadvantage.com/u/d02e25f2) |
| Marek Wyszynski | Better Movement = Better Life | New York City | United States | — | 70 | [profile](https://community.aiadvantage.com/u/bda718f0) |
| Mareko Hedquist | Servant Leadership Thought Leader / Senior Project Manager / Consultant | St. George | United States | Coaching & Personal Growth | 100 | [profile](https://community.aiadvantage.com/u/1229348c) |
| Margrit Wegener | Curious mind, lifelong learner, now diving into AI | Munich | Germany | Technology & AI | 100 | [profile](https://community.aiadvantage.com/u/db9aa3f8) |
| Mario Jimenez Rodriguez | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/70719cab) |
| Mariyn Burnette | Break Free from the emotional pain from pro-longed stress or abuse, and create a life of peace and purpose. That's my goal | Cincinnati | United States | — | 70 | [profile](https://community.aiadvantage.com/u/f482ddeb) |
| Mark Belinson | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/05025e04) |
| Mark Carpenter | — | DeKalb | United States | — | 35 | [profile](https://community.aiadvantage.com/u/87434a4a) |
| Mary McKay | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/d325c557) |
| Marykutty Mathew | — | Mainz | Germany | — | 35 | [profile](https://community.aiadvantage.com/u/120b3958) |
| Mateja Labauri | — | London | United Kingdom | — | 35 | [profile](https://community.aiadvantage.com/u/df06ed61) |
| Matt Fritzeen | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/8f0611a7) |
| Maxine Johnson | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/fc48b23e) |
| Mazen Fardan | — | Dubai | United Arab Emirates | — | 35 | [profile](https://community.aiadvantage.com/u/4b49a422) |
| Megumi Shimonaka | — | Japan | Japan | — | 12 | [profile](https://community.aiadvantage.com/u/8695f9d7) |
| Melissa Mondzelewski | Short Term Rental Owner and Operator | Nashville | United States | Real Estate | 100 | [profile](https://community.aiadvantage.com/u/d1d12e59) |
| Melissa Seil-Butler | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/00961ff3) |
| Michael Ducart | — | Riverview | United States | — | 35 | [profile](https://community.aiadvantage.com/u/7c91c780) |
| Michael Gibson | Founder of Extraordinary Lovers \| Architect of Extraordinary Love | Phoenix | United States | Technology & AI | 100 | [profile](https://community.aiadvantage.com/u/339937f6) |
| Michael Gong | Consulting and Professional Services Leader \| Technology Enablement & Adoption | — | — | Business & Consulting | 65 | [profile](https://community.aiadvantage.com/u/8498377d) |
| Michael Harris | AI Mentor | Brisbane | Australia | Coaching & Personal Growth | 100 | [profile](https://community.aiadvantage.com/u/95e7676e) |
| Michael Klyne | Work Smarter. Lead Better. With Human Judgement @ AI speed. | — | — | Technology & AI | 65 | [profile](https://community.aiadvantage.com/u/49ebb3e6) |
| Michael Kranich | — | Niceville | United States | — | 35 | [profile](https://community.aiadvantage.com/u/65c366ae) |
| Michael Mahmoudi | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/d7eb3845) |
| Michael Modrak | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/ec047a69) |
| Michael Myers | The HypnoMedMan | Palm Desert | United States | Health & Wellness | 100 | [profile](https://community.aiadvantage.com/u/54423847) |
| Michael Sugarman | — | Wilmington | United States | — | 35 | [profile](https://community.aiadvantage.com/u/2eb36482) |
| Micheal Namocot | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/f0f74b6c) |
| Michelle Burgad | Telecom expert & VP at Sandler Partners. Passionate leader helping businesses save big, live boldly, and stay connected-in work and in life. | Stockton | United States | Marketing & Sales | 100 | [profile](https://community.aiadvantage.com/u/ee455000) |
| Michelle Chick | — | Hollister | United States | — | 35 | [profile](https://community.aiadvantage.com/u/c58d5bc8) |
| Michelle Fromm | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/8ed1ee07) |
| Michelle Odessey | — | Atlanta | United States | — | 35 | [profile](https://community.aiadvantage.com/u/183fa86d) |
| Mihalis Belantis | 30 Years in Capital Markets. Now I'm Betting on AI. | Calgary | Canada | Finance & Investing | 100 | [profile](https://community.aiadvantage.com/u/6b564eeb) |
| Miles Von Schriltz | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/40c0f8fd) |
| Misha Kiiso | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/6198cd80) |
| Mishari Alqabandi | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/e1e9e82a) |
| Mollie Manhattan | Transformational Artist | Ocean Springs | United States | Coaching & Personal Growth | 100 | [profile](https://community.aiadvantage.com/u/e765e661) |
| Momir Milacic | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/293f6144) |
| Monica Julien | — | Texas | United States | — | 22 | [profile](https://community.aiadvantage.com/u/20267883) |
| Monica Parolalista | Ops Director turned AI consultant helping businesses scale smarter, faster & sustainably through intelligent, people-first systems. | — | — | Technology & AI | 65 | [profile](https://community.aiadvantage.com/u/f0a99cb1) |
| Monica Rosenberry | Test at Your Best - Performance Coach for Professional, Certification, and College Exams | San Francisco | United States | Coaching & Personal Growth | 100 | [profile](https://community.aiadvantage.com/u/2f303612) |
| Monique Manderson | Psychiatric-Mental Health NP \| Entrepreneur \| Advocate for Innovation & Mentorship in Healthcare Leadership | Lakeland | United States | Health & Wellness | 100 | [profile](https://community.aiadvantage.com/u/5b554c9d) |
| Mury Sutherlin | CFO \| Interested in Building AI-powered businesses + AI leverage for high-growth businesses | Durango | United States | Finance & Investing | 100 | [profile](https://community.aiadvantage.com/u/9a1c137d) |
| Nadeen Vella | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/71d89b56) |
| Nanda Sears | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/92a53032) |
| Naomi Takazawa Welch | Acupuncturist from Japan | New York City | United States | Health & Wellness | 100 | [profile](https://community.aiadvantage.com/u/e5fd21b9) |
| Natalie Huen | — | San Francisco Bay Area | United States | — | 28 | [profile](https://community.aiadvantage.com/u/53263536) |
| Natalie Huen | — | Palo Alto | United States | — | 35 | [profile](https://community.aiadvantage.com/u/c33bb08b) |
| Nate Harris | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/b6e25e29) |
| Nathan Murdoch | — | Calgary | Canada | — | 35 | [profile](https://community.aiadvantage.com/u/28a06f32) |
| Negar Ashtari | Rising phoenix | Toronto | Canada | — | 70 | [profile](https://community.aiadvantage.com/u/795a9d83) |
| Nelson Spinetti | Pediatric Gastroenterologist \| Real Estate Investor \| Educator & Podcaster | McAllen | United States | Health & Wellness | 100 | [profile](https://community.aiadvantage.com/u/0aa748a5) |
| Nga Blanchard | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/6b7230d0) |
| Nikita Kostyuk | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/8a8d6ee6) |
| Nora Bennani | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/6dbe6f82) |
| Nulbis Quintana | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/a9c6d2c2) |
| Orest Frangopol | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/34b97f47) |
| Ornulf Svan Amundsen | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/482c78c2) |
| Pakko Mendez | Excited to Learn AI | San Diego | United States | Technology & AI | 100 | [profile](https://community.aiadvantage.com/u/bb36e8b0) |
| Pamela Metz | Bookkeeper for Photographers/Videographers | Snohomish | United States | Finance & Investing | 100 | [profile](https://community.aiadvantage.com/u/cb08b4ea) |
| Patricia Parker | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/0a07c516) |
| Patrick Meehan | Team Building | Maine | United States | — | 57 | [profile](https://community.aiadvantage.com/u/85b0e91e) |
| Patrick Walker | Brick and Mortar Travel Agency Owner | Dallas | United States | Trades & Operations | 100 | [profile](https://community.aiadvantage.com/u/28e6929e) |
| Patti Heckman | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/8bedcdb1) |
| Patty Schramm | — | Bushnell | United States | — | 35 | [profile](https://community.aiadvantage.com/u/fceb9e63) |
| Paul Baker | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/1dea5b5c) |
| Paul Colligan | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/a8c2cbcf) |
| Paul Dubelsten | — | Portland | United States | — | 35 | [profile](https://community.aiadvantage.com/u/e9743b04) |
| Paul Keigher | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/84449ca8) |
| Paul Wagner | — | Columbus | United States | — | 35 | [profile](https://community.aiadvantage.com/u/7d68d079) |
| Paulo Paias | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/26951522) |
| Pavlina Yanakieva | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/3f8f3892) |
| Peter DiPaoli | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/41f36693) |
| Peter Unger | — | Central Point | United States | — | 35 | [profile](https://community.aiadvantage.com/u/754b7781) |
| Peyton Dodson | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/d578c541) |
| Philippos Soseilos | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/c1e1c670) |
| Pia Lindroos | Building AI <3 | Finland | Finland | Technology & AI | 77 | [profile](https://community.aiadvantage.com/u/ae8c29dc) |
| Pieter Harmse | AImagician | Sedgefield | South Africa | — | 70 | [profile](https://community.aiadvantage.com/u/5fc35a85) |
| Rahul Aakaram | Healthcare Platform \| Maternal health for Mother as centered | Tampa | United States | Health & Wellness | 100 | [profile](https://community.aiadvantage.com/u/53b38b4c) |
| Raluka Mihai | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/3d9f35dc) |
| Ramune Lekamaviciute | Mental Fitness Coach | Frankfurt | Germany | Health & Wellness | 100 | [profile](https://community.aiadvantage.com/u/b83e5ac2) |
| Rasmus Haarup Dalsgaard | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/a8d4fd2a) |
| Razvan M | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/557ff33d) |
| Rebecca Lister | Wildlife photographer and conservationist | South Kingstown | United States | Creative & Media | 100 | [profile](https://community.aiadvantage.com/u/3e298a81) |
| Rejeanne Bischoff | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/c171787c) |
| Rene Massas | — | Geneva | Switzerland | — | 35 | [profile](https://community.aiadvantage.com/u/5f59c819) |
| Rene Olsen | Learning new skills | Nuuk | Greenland | — | 70 | [profile](https://community.aiadvantage.com/u/a50b10aa) |
| Rex Whitton | GOING FULLY FOR THE FULL GOSPEL! | Kansas City | United States | — | 70 | [profile](https://community.aiadvantage.com/u/78430dd7) |
| Rey Perez | — | Palmetto Bay | United States | — | 35 | [profile](https://community.aiadvantage.com/u/581bcf9d) |
| Richard Martyn | — | Grande Prairie | Canada | — | 35 | [profile](https://community.aiadvantage.com/u/550958d4) |
| Richard Ojeda | Excited and ready to work | Connecticut | United States | — | 57 | [profile](https://community.aiadvantage.com/u/94362832) |
| Ricky Best | — | London | United Kingdom | — | 35 | [profile](https://community.aiadvantage.com/u/a530352a) |
| Rob Benjamin | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/a4ac8920) |
| Rob Fazekas | Business owner looking to scale our business | New Jersey | United States | Business & Consulting | 87 | [profile](https://community.aiadvantage.com/u/5150fb4d) |
| Robbert Van Adrichem | Expedition Guide for Growth \| Co-founder Kollet | Delft | Netherlands | Business & Consulting | 100 | [profile](https://community.aiadvantage.com/u/be5a4201) |
| Robert Barnes | — | Leander | United States | — | 35 | [profile](https://community.aiadvantage.com/u/db76c8f9) |
| Robert Boniface | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/d7d99004) |
| Robert Guderian | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/23f83b28) |
| Robert Houghton | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/42dc6bbb) |
| Robert Pafundi | Robert from Los Angeles, California | Los Angeles | United States | — | 70 | [profile](https://community.aiadvantage.com/u/6f7a6221) |
| Robert Rosario | — | Palm Beach | United States | — | 35 | [profile](https://community.aiadvantage.com/u/f21b7c56) |
| Robert Scoggin | — | Boquete | Panama | — | 35 | [profile](https://community.aiadvantage.com/u/07c8c2fb) |
| Robert Smolen | Faith-Driven Relationship Builder \| Partner-Led Growth Leader \| Federal & Enterprise GTM \| Practical AI Learner for the Next Chapter | McKinney | United States | Technology & AI | 100 | [profile](https://community.aiadvantage.com/u/9c305934) |
| Robert Thornton | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/06873de1) |
| Romy Shovelton | Adventurer in Life | Dolgellau | United Kingdom | — | 70 | [profile](https://community.aiadvantage.com/u/94df338e) |
| Ron Crutcher | Navigator | — | — | — | 35 | [profile](https://community.aiadvantage.com/u/ce4170be) |
| Ron Koshko | Leveraging 30+ Years Experience | Northborough | United States | — | 70 | [profile](https://community.aiadvantage.com/u/8fd5c1b8) |
| Rowena Atkins | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/fb55a0d1) |
| Russell Brandon | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/4cc9c2a4) |
| Ryan Melchione | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/2e451a58) |
| Saeed AlMuhairy | — | Dubai | United Arab Emirates | — | 35 | [profile](https://community.aiadvantage.com/u/c29befdf) |
| Sam Johnson | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/47b1760f) |
| Samantha Landwehr | — | Minneapolis | United States | — | 35 | [profile](https://community.aiadvantage.com/u/8aa62033) |
| Samantha McConnell | — | Cardiff-by-the-Sea | United States | — | 35 | [profile](https://community.aiadvantage.com/u/fd2dd7f8) |
| Sandra Chmielewski | Sandra Lee Therapy | Lutz | United States | Health & Wellness | 100 | [profile](https://community.aiadvantage.com/u/bea893ff) |
| Sandra Richter | Happy Day | Albuquerque | United States | — | 70 | [profile](https://community.aiadvantage.com/u/367c674f) |
| sandra@inovarhr.com | Alignment Coach for Overwhelmed Women \| Wish on Wildflowers | — | — | Coaching & Personal Growth | 65 | [profile](https://community.aiadvantage.com/u/85629073) |
| Sandy Yang | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/4ef1ad08) |
| Sara Janes Hoag | Helping people navigate to their financial terrain | Manchester | United Kingdom | Finance & Investing | 100 | [profile](https://community.aiadvantage.com/u/53f046db) |
| Sarah H Zainalabedin | Organizational Design & Strategy \| Excited to Engage | Bahrain | Bahrain | Business & Consulting | 77 | [profile](https://community.aiadvantage.com/u/bd1ff922) |
| Sarah Jean | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/e45ed951) |
| Savannah Simpson | The Abundance Archaeologist - Subconscious Reprogramming Coach for Women | British Columbia | Canada | Coaching & Personal Growth | 87 | [profile](https://community.aiadvantage.com/u/37742abd) |
| Scott Levine | Lawyer, Business Owner, Husband and Father | San Diego County | United States | Legal | 93 | [profile](https://community.aiadvantage.com/u/1fc2b357) |
| Scott Newson | Financial Advisor in Miami, Florida | Miami | United States | Finance & Investing | 100 | [profile](https://community.aiadvantage.com/u/dca19ecf) |
| Seamae Erfani | Natural or Artificial, Intelligence is Intelligence | San Diego | United States | — | 70 | [profile](https://community.aiadvantage.com/u/e7506f6f) |
| Sean Lenihan | Founder at The Honest Bison | Camas | United States | Business & Consulting | 100 | [profile](https://community.aiadvantage.com/u/51ebe0bb) |
| Seema Sharma | Mental Health Private Practice Owner | Pasadena | United States | Health & Wellness | 100 | [profile](https://community.aiadvantage.com/u/c94110af) |
| Selvia Ratnawati | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/8bdcbcbe) |
| Sergei Krasulya | Solving business growth and productivity problems using first principles and advanced technology | Massachusetts | United States | Business & Consulting | 87 | [profile](https://community.aiadvantage.com/u/14f62238) |
| Seth Breitman | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/32781df5) |
| Shaam Gambhir | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/4391dcd7) |
| Shana Ginsburg | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/cd227206) |
| Sharon Lawson | — | Baltimore | United States | — | 35 | [profile](https://community.aiadvantage.com/u/b5a3e9c2) |
| Shawn Dinning | Aviator and Aircraft Dealer/Broker Looking to Fly Higher and Faster with AI Fuel!! | Dallas | United States | Real Estate | 100 | [profile](https://community.aiadvantage.com/u/bd87d7b1) |
| Sheri Del Barrio | Insurance Carrier and Agency Relations Strategist | Honolulu | United States | Finance & Investing | 100 | [profile](https://community.aiadvantage.com/u/f98d085f) |
| Sherry Peng | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/f74f0174) |
| Shruti Patel | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/54a4f7a4) |
| Sidney Huffmyer | Jake and Sid are the same person. We're still working out the details. | Pittsburgh | United States | — | 70 | [profile](https://community.aiadvantage.com/u/ee88c23b) |
| Silke Jacobi | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/1d185837) |
| Silvia Junqueira | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/80c367eb) |
| Simas Tamosaitis | — | Scottsdale | United States | — | 35 | [profile](https://community.aiadvantage.com/u/9fcd6e2d) |
| Simona Stokes | Psychologist \| Educator \| Curious AI Learner | Devon | United Kingdom | Health & Wellness | 87 | [profile](https://community.aiadvantage.com/u/6da36eab) |
| Sofie Den Haeze | I free people from everything that keeps them small, so their true light can shine again. | Ghent | Belgium | — | 70 | [profile](https://community.aiadvantage.com/u/6fdd7db2) |
| Sonja Kirschner | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/bfb1a0d5) |
| Sonya Dimitrova | AI Advantage Bootcamp Sonya | London | United Kingdom | Technology & AI | 100 | [profile](https://community.aiadvantage.com/u/53a06c77) |
| Sophie Stevens-Lemaigre | Finding your true voice to power your relationships | Sofia | Bulgaria | — | 70 | [profile](https://community.aiadvantage.com/u/2fd5caa7) |
| Stacey Rader | A New Beginning | Eldon | United States | — | 70 | [profile](https://community.aiadvantage.com/u/e3b57e6e) |
| Stacey Sparks | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/6c2d891a) |
| Staci Baker | — | Mesa | United States | — | 35 | [profile](https://community.aiadvantage.com/u/76d10110) |
| Stacy Fore | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/fcbdc4fd) |
| Stacy Mangum | Genealogist. Mixologist. Proud Texanadian. | Texas | United States | Creative & Media | 87 | [profile](https://community.aiadvantage.com/u/56f51987) |
| Stephanie Barrios | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/63b3d7fb) |
| Stephanie Bigelow | — | Fort Lauderdale | United States | — | 35 | [profile](https://community.aiadvantage.com/u/cf82f0b8) |
| Stephanie D'Andrea | Launching a people-first directory - using AI to scale SEO, design & content | West Palm Beach | United States | Marketing & Sales | 100 | [profile](https://community.aiadvantage.com/u/0f603bd9) |
| Stephanie Dupuis | Building human clarity in the age of AI | Montreal | Canada | Technology & AI | 100 | [profile](https://community.aiadvantage.com/u/ae34c705) |
| Stephanie Inghram | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/f419f782) |
| Stephanie Klein | Cyber Security Program Manager by day, Beginner Entrepreneur by night | Maryland | United States | Technology & AI | 87 | [profile](https://community.aiadvantage.com/u/87098b30) |
| Stephanie Long | — | Grapevine | United States | — | 35 | [profile](https://community.aiadvantage.com/u/c7823033) |
| Stephen Hodge | — | Raleigh | United States | — | 35 | [profile](https://community.aiadvantage.com/u/abf35804) |
| Stephen Shishko | MEP Engineer | Melville | United States | Technology & AI | 100 | [profile](https://community.aiadvantage.com/u/75ed2f44) |
| Stephen Skeels | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/f59e9d83) |
| Steve Loyd | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/57543c94) |
| Steve Tschudy | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/eddc4550) |
| Steven Nakamoto | Business Growth Strategist & Writer's Digest Award-Winning Author/Publisher | Huntington Beach | United States | Creative & Media | 100 | [profile](https://community.aiadvantage.com/u/7f2ba4c1) |
| Steven Poerschmann | More - Always learning, always growing! | Marana | United States | — | 70 | [profile](https://community.aiadvantage.com/u/fae66889) |
| Steven Selinsky | — | Orange County | United States | — | 28 | [profile](https://community.aiadvantage.com/u/b48db15f) |
| Stuart Adams | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/9591a79f) |
| Susan Sanchez | Bringing Food Suppliers Into the Digital Age | Phoenix | United States | Trades & Operations | 100 | [profile](https://community.aiadvantage.com/u/3eb3278f) |
| Susanna Pullen | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/a17b3f06) |
| Sven Olson | A recovered blind quadriplegic... RESILIENCE and COURAGE are my Watch Words!! | Chandler | United States | — | 70 | [profile](https://community.aiadvantage.com/u/279ce1bf) |
| Sven Simonis | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/8194fd5d) |
| Tammy Keegan | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/5323030b) |
| Tanya D. Milton PA | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/e561d065) |
| Tanya Polic | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/ae5df3fa) |
| Tara Doherty | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/9e5a670b) |
| Tarryn | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/3c293272) |
| Ted Blanchett | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/5674a837) |
| Teresa Zuvela | Teresa Zuvela, LMHC, CSAT, CPTT is a betrayal trauma specialist and creator of the Woodland Pathways Method, helping midlife women restore calm, self-trust, and clarity after relational betrayal. | Wenatchee | United States | Health & Wellness | 100 | [profile](https://community.aiadvantage.com/u/cf85a70f) |
| Terry Lajoie | Residential Realtor - Southern NH | New Hampshire | United States | Real Estate | 87 | [profile](https://community.aiadvantage.com/u/44465c10) |
| Theresa White | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/cbdcf409) |
| Thomas Campbell | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/bfc5dded) |
| Thomas Holownia | Clear, Concise & Compelling Brand Stories | San Francisco Bay Area | United States | Marketing & Sales | 93 | [profile](https://community.aiadvantage.com/u/250314eb) |
| Thomas Musialik | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/40043875) |
| Thorsten Keller | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/d1ea1996) |
| Tibor Berenyi | Landscaping business owner \| Learning how to use AI to build a better, less hands-on business | Melbourne | Australia | Technology & AI | 100 | [profile](https://community.aiadvantage.com/u/af27a6d9) |
| Tiffani Iselin | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/cb1e7b11) |
| Tiffany Bowtell | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/9190c4ef) |
| Tim Stiles | Entrepreneur and financial coach | Kansas City | United States | Finance & Investing | 100 | [profile](https://community.aiadvantage.com/u/077d9816) |
| Timothy Carroll | Best-Selling Author, Speaker & Performance Coach. | The Bahamas | Bahamas | Coaching & Personal Growth | 77 | [profile](https://community.aiadvantage.com/u/9d0d1f3c) |
| Timothy Pelischek | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/eb5d089b) |
| Toby Goldbach | Helping Professionals and Leaders Approach Conflict with Curiosity, Courage & Possibility | Toronto | Canada | — | 70 | [profile](https://community.aiadvantage.com/u/158f0b3b) |
| Tom Johnsson | — | Redondo Beach | United States | — | 35 | [profile](https://community.aiadvantage.com/u/6e5b6a7c) |
| Tommy Branson | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/2b17856e) |
| Tommy Lee | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/1377ffee) |
| Toni Humar | AI Specialist | Slovenia | Slovenia | Technology & AI | 77 | [profile](https://community.aiadvantage.com/u/6034352b) |
| Toni Murphy | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/755d580b) |
| Tosha Vanderkooy | Anything that's meant for you will never pass you by | Canada | Canada | — | 47 | [profile](https://community.aiadvantage.com/u/4ebce913) |
| Tracey Ann Powers | — | Canada | Canada | — | 12 | [profile](https://community.aiadvantage.com/u/bf3c7905) |
| Trent Wehrhahn | Dental Marketing Strategist & Advisor | Calgary | Canada | Health & Wellness | 100 | [profile](https://community.aiadvantage.com/u/205b08a0) |
| ty Tallman | MedSpa Doctors - "Beauty Revolution" | Chandler | United States | Health & Wellness | 100 | [profile](https://community.aiadvantage.com/u/b010d5e3) |
| Umer Saleem | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/0f0a9ffa) |
| Valeria Tyutina | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/fe957b2d) |
| Valerie DuBray | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/3dbc1aee) |
| Vanessa Damgaard | Blockchain Consulting & Venture Capital | Berlin | Germany | Finance & Investing | 100 | [profile](https://community.aiadvantage.com/u/0eae63f2) |
| Vanessa Parletta | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/4e30bfeb) |
| Vanessa Salazar | Life Transformation Coach helping women in midlife reclaim their voice, rebuild confidence, and step into a life they love | United States | United States | Coaching & Personal Growth | 77 | [profile](https://community.aiadvantage.com/u/e61a30d9) |
| Veena Kalia | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/fe6a0c35) |
| Veronica Martin Tolosa | Passionate about creating value in the real estate industry. | Madrid | Spain | Real Estate | 100 | [profile](https://community.aiadvantage.com/u/7bf448ce) |
| Vicky Xie | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/1dc047a5) |
| Vikki Godfrey | — | Tallahassee | United States | — | 35 | [profile](https://community.aiadvantage.com/u/a4e84553) |
| Viktorija Malukaite | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/ffb62519) |
| Vinode Vitthala | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/7d7c93f1) |
| Vlaming Advies | Current Occupation: lawyer, child psychologist and criminologist | Amsterdam | Netherlands | Health & Wellness | 100 | [profile](https://community.aiadvantage.com/u/96f84d09) |
| Wade Timmerson | Here to Learn!!! | Miami | United States | — | 70 | [profile](https://community.aiadvantage.com/u/d4fdf64f) |
| Walter Terry | Architect is My identity. Virtuoso and Orchestrator are my superpowers. | Seattle | United States | Technology & AI | 100 | [profile](https://community.aiadvantage.com/u/759b03d4) |
| Wayne Grimditch | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/794b4058) |
| Yolande Nkaya | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/74eb1106) |
| Yumiko Kaizuka | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/f2e3f36b) |
| Yves Arteel | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/875e8aa7) |
| Yvette Maiello | — | New York City | United States | — | 35 | [profile](https://community.aiadvantage.com/u/3d6c007a) |
| Yvonne Schneider | — | Untergruppenbach | Germany | — | 35 | [profile](https://community.aiadvantage.com/u/99c0dbf9) |
| Yvonnie Ametin | Start Up Actualizer | Key West | United States | — | 70 | [profile](https://community.aiadvantage.com/u/5e609844) |
| Zubby Gabriel | — | — | — | — | 0 | [profile](https://community.aiadvantage.com/u/63416652) |

## Data-quality notes

- **Ambiguous cities.** 31 members named a city that exists in more than one country, so `country` is a best guess, flagged in `location_ambiguous`: Airdrie, Aurora, Bevel, Boston, Carmel, Chambly, Columbus, Concord, Franklin, Glendale, Hanover, Lancaster, Lincoln, Manchester, Melbourne, Middletown, Naples, Panama City, Portland, Richmond, Sedgefield, Surrey, Troy, Washington, Wilmington, Windsor.
- **One unresolvable location.** A member lists `North`; `location_granularity` reads `unresolved`.
- **Repeated names.** Amanda Marks, Natalie Huen each appear under two profile IDs. Possibly duplicate accounts, possibly two people; both rows are kept.
- **Three profiles show an email address instead of a name** — `account_type` is `email_placeholder`. That is what the directory shows, not a capture error.
- **`domain_*` is keyword-inferred** from one self-written line, so it is a sorting aid rather than a fact. A bio that is a motto ("Life happens for me, not to me!") classifies as nothing at all, which says nothing about the person.
- **No open-web research.** Every column is derived from the directory text above. Nothing here came from searching for these people elsewhere.
- **Emoji and some accents were stripped** during capture; the profile link is always the authoritative version.

## Refreshing this

The directory is live and members keep joining, so this is a dated snapshot. Re-copy the members list into `data/ai-advantage-members.source.txt` and run `python3 scripts/build-aia-members.py` — the CSV, the JSON and this card all regenerate. The filename is fixed, so the Hub always shows the current version.
