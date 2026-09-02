"""Mask credentials before transcript text is written anywhere or printed.

Every pattern requires a long tail, so prose that merely names a prefix — the
`mask github_pat_... in any output` line in CLAUDE.md, for instance — is left
readable. Redaction is best-effort: it catches known token shapes, not every
possible secret. Treat it as a safety net, not a guarantee.
"""
import re

SECRETS = [
    (re.compile(r"github_pat_[A-Za-z0-9_]{20,}"), "[REDACTED:github-pat]"),
    (re.compile(r"gh[pousr]_[A-Za-z0-9]{20,}"), "[REDACTED:github-token]"),
    (re.compile(r"sk-ant-[A-Za-z0-9_\-]{20,}"), "[REDACTED:anthropic-key]"),
    (re.compile(r"sk-[A-Za-z0-9]{32,}"), "[REDACTED:api-key]"),
    (re.compile(r"AKIA[0-9A-Z]{16}"), "[REDACTED:aws-key]"),
    (re.compile(r"xox[baprs]-[A-Za-z0-9-]{10,}"), "[REDACTED:slack-token]"),
    (re.compile(r"-----BEGIN [A-Z ]*PRIVATE KEY-----.*?-----END [A-Z ]*PRIVATE KEY-----",
                re.S), "[REDACTED:private-key]"),
]


def scrub(text):
    for pattern, replacement in SECRETS:
        text = pattern.sub(replacement, text)
    return text
