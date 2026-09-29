"""Name, tagline and domain systematizing for the AI Advantage member database."""
import re

# Tokens that stay upper-case when re-casing a shouted name.
KEEP_UPPER = {"PA","LLC","MD","DDS","DO","NP","RN","LMHC","CSAT","CPTT","PhD","JD","CPA",
              "AI","XR","MEP","CFO","CEO","II","III","IV","JR","SR"}

def normalize_name(raw):
    """Re-case SHOUTED and lowercase names; leave deliberate mixed case alone."""
    toks = raw.split()
    shouted = raw.isupper()            # whole name in caps: re-case throughout
    out = []
    for t in toks:
        if "." in t or t in KEEP_UPPER or (len(t) <= 2 and not shouted):
            out.append(t)                      # initials, particles, credentials
        elif t.isupper() or t.islower():
            out.append(t[0].upper() + t[1:].lower())
        else:
            out.append(t)                      # McRae, DeVary, d'Anconia
    return " ".join(out)

ORG_WORDS = ("Team", "Advies", "Consulting", "LLC")

def classify_account(raw_name, is_staff):
    if is_staff:
        return "staff"
    if "@" in raw_name:
        return "email_placeholder"
    if " & " in raw_name:
        return "shared"                        # a couple or pair on one profile
    if raw_name.strip().endswith(ORG_WORDS) or " / " in raw_name:
        return "organization"
    return "individual"

SEPARATORS = re.compile(r"\s*[|/•]\s*|\s+[-–—]\s+")

def split_roles(tagline):
    """Split a tagline into role phrases when it reads as a list, not a sentence."""
    t = (tagline or "").strip()
    if not t:
        return []
    parts = [p.strip(" .") for p in SEPARATORS.split(t) if p.strip(" .")]
    if len(parts) < 2:
        return []
    # A list of roles, not a prose sentence chopped at a dash.
    if all(len(p) <= 60 and p.count(" ") <= 8 for p in parts):
        return parts
    return []

URL_RE = re.compile(r"((?:https?://|www\.)[^\s|]+)", re.I)

def extract_website(tagline):
    m = URL_RE.search(tagline or "")
    if not m:
        return ""
    url = m.group(1).rstrip(".,")
    return url if url.lower().startswith("http") else "https://" + url

# Controlled vocabulary, evaluated in order — first match wins for `domain_primary`,
# the next distinct match becomes `domain_secondary`. A trailing `*` means "stem":
# `medic*` matches medical/medicine, while a bare term must match as a whole word.
DOMAIN_TERMS = [
 ("Health & Wellness", ["health*","wellness","wellbeing","doctor*","medic*","therap*",
  "psycholog*","psychiatr*","acupunctur*","acupressure","nutrition*","medspa","autoimmune",
  "gastroenter*","eyecare","trauma","dementia","holistic","hypno*","caregiver*","fitness",
  "healthcare","maternal","dental","beauty","chiropract*","bone health"]),
 ("Real Estate", ["real estate","realtor*","broker*","rental*","propert*","lofts"]),
 ("Finance & Investing", ["cfo","financ*","capital markets","invest*","wealth*","bookkeep*",
  "insurance","venture capital","blockchain"]),
 ("Legal", ["lawyer*","legal","dispute resolution","criminolog*","patent*","attorney*"]),
 ("Marketing & Sales", ["marketing","funnel*","seo","brand*","sales","storytell*","content",
  "copywrit*","website*","directory","telecom*"]),
 ("Coaching & Personal Growth", ["coach*","mentor*","mindset","transformation*",
  "personal growth","leadership","performance","change agent","alignment","subconscious",
  "empower*"]),
 ("Technology & AI", ["ai","a.i","artificial intelligence","engineer*","software","systems",
  "developer*","technical","cyber*","architect*","analyst*","edtech","solar","automation"]),
 ("Education & Training", ["educat*","teacher*","professor*","classroom","curriculum",
  "school*","training","bootcamp"]),
 ("Creative & Media", ["artist*","writer*","producer*","photograph*","songwriter*","designer*",
  "music*","podcast*","author*","inventor*","creative","genealogist"]),
 ("Trades & Operations", ["landscap*","foreman","aviator","aircraft","travel agency",
  "food suppl*","operations","ops director","servicing"]),
 ("Business & Consulting", ["consult*","founder*","ceo","entrepreneur*","business","director",
  "strateg*","executive","owner","principal","partner"]),
]

def _compile(terms):
    parts = []
    for t in terms:
        if t.endswith("*"):
            parts.append(re.escape(t[:-1]) + r"\w*")
        else:
            parts.append(re.escape(t) + r"\b")
    return re.compile(r"\b(?:" + "|".join(parts) + ")", re.I)

DOMAINS = [(label, _compile(terms)) for label, terms in DOMAIN_TERMS]

def classify_domains(text):
    """Return (primary, secondary) from the controlled vocabulary."""
    blob = (text or "").lower()
    hits = [label for label, pat in DOMAINS if pat.search(blob)]
    primary = hits[0] if hits else ""
    secondary = hits[1] if len(hits) > 1 else ""
    return primary, secondary

def completeness(has_tagline, granularity, has_domain):
    """0-100: how much this profile actually tells you."""
    score = 0
    if has_tagline:
        score += 35
    score += {"city":35,"metro":28,"region":22,"country":12,
              "unresolved":5,"none":0}[granularity]
    if has_domain:
        score += 30
    return min(score, 100)
