#!/usr/bin/env python3
"""Merge built-in template demo copy into src/i18n/templateSeedPhrasebook.json.

Existing phrasebook keys are kept. New Hebrew sources are added for template
meta/defaultData strings and leftover Studio library picker titles.
"""
from __future__ import annotations

import json
import re
from pathlib import Path

from phrasebook_lexicon_core import EXACT
from phrasebook_lexicon_extra import EXTRA
from phrasebook_lexicon_templates import EXACT as TEMPLATE_EXACT
from phrasebook_lexicon_words import FRAGMENTS

ROOT = Path(__file__).resolve().parents[1]
PHRASEBOOK = ROOT / "src/i18n/templateSeedPhrasebook.json"
INVENTORY = ROOT / "scripts/template-hebrew-strings.json"
LIBRARY_DIRS = [
    ROOT / "src/components/site-builder/studio/visual-editor/library",
    ROOT / "src/components/site-builder/studio/data",
]
LIBRARY_FILES = [
    "sectionCatalogBuilders.ts",
    "elementLibrary.ts",
    "extraWebsiteElements.ts",
    "cardVariants.ts",
    "lottieLibrary.ts",
    "carePlanPortalSections.ts",
    "crmDynamicElementLibrary.ts",
    "mediaLibrary.ts",
    "buttonLibrary.ts",
]

HE = re.compile(r"[\u0590-\u05FF]")
FIELD_RE = re.compile(
    r"""(?:title|label|description|headline|badge|name|copy|primary|secondary|kicker|eyebrow|buttonText|cta|alt|placeholder)\s*[:=]\s*(["'`])(.+?)\1""",
    re.S,
)
HTML_RE = re.compile(r"<[^>]+>")
URL_RE = re.compile(r"https?://|www\.|/[A-Za-z0-9_\-./]+\.(?:png|jpe?g|webp|gif|svg|mp4)", re.I)
EMAIL_RE = re.compile(r"[\w.+-]+@[\w.-]+\.\w+")
PHONE_RE = re.compile(r"\+?\d[\d\-()\s]{6,}\d")
BRANDS = (
    "Crustora",
    "Polyglota",
    "BizUply",
    "Bizuply",
    "Virello",
    "Citadel",
    "Framehaus",
    "Gridline",
    "Horizon",
    "Kinetic",
    "Ledger",
    "Monolith",
    "Prism",
    "Steelworks",
    "Vertex",
    "Homecraft",
    "Sportifya",
    "Lumenware",
    "Panora",
    "Shiny",
    "Astral Threads",
)

# Demo person names stay in Hebrew.
NAME_EXACT = {
    "נועה שחר",
    "מיכל רוזן",
    "נועה כ.",
    "יואב מ.",
    "דנה ר.",
    "דנה לוי",
    "מאיה לב",
    "רוני כהן",
    "תמר שלו",
    "איתי ברק",
    "דנה כהן",
    "רoni ושירה מ.",
    "אבי נחmias",
    "יוסי מזרחi",
    "מיכal רוזן",
    "עמית שרון",
    "דניאל כהן",
    "יובל מ.",
    "מאיה כ.",
    "איתי ל.",
    "נועה ארז",
    "מיקה לוי",
    "יעל ומור",
    "אורי ש.",
    "רוני א.",
    "מיה רוזן",
    "תמר אלון",
    "נועה ברק",
}
FIRST_NAMES = {
    "נועה",
    "מיכל",
    "דנה",
    "יואב",
    "מאיה",
    "רוני",
    "תמר",
    "איתי",
    "אבי",
    "יוסי",
    "עמית",
    "דניאל",
    "יובל",
    "אורי",
    "יעל",
    "מור",
    "מיה",
    "מיקה",
}

NAME_RE = re.compile(
    r"^[\u05d0-\u05ea]{2,}(?:\s+[\u05d0-\u05ea]{2,})?(?:\s+[A-Za-z\u05d0-\u05ea]\.)?$"
)


def is_html_only(text: str) -> bool:
    stripped = HTML_RE.sub("", text).strip()
    return text.strip().startswith("<") and not HE.search(stripped)


def is_url_or_asset(text: str) -> bool:
    t = text.strip()
    if t.startswith("http") or t.startswith("www."):
        return True
    if URL_RE.search(t) and not HE.search(HTML_RE.sub("", t)):
        return True
    return False


def is_person_name(text: str) -> bool:
    s = text.strip()
    if s in NAME_EXACT:
        return True
    if not NAME_RE.match(s):
        return False
    parts = s.split()
    if not parts:
        return False
    if parts[0] in FIRST_NAMES:
        return True
    return bool(re.match(r"^[\u05d0-\u05ea]+\s+[A-Za-z\u05d0-\u05ea]\.$", s))


def extract_library_titles() -> list[str]:
    found: set[str] = set()
    for folder in LIBRARY_DIRS:
        for name in LIBRARY_FILES:
            path = folder / name
            if not path.exists():
                continue
            src = path.read_text(encoding="utf-8")
            for match in FIELD_RE.finditer(src):
                raw = match.group(2).strip()
                if not HE.search(raw):
                    continue
                if is_html_only(raw) or is_url_or_asset(raw):
                    continue
                if "${" in raw:
                    continue
                found.add(raw)
    return sorted(found)


def load_inventory() -> list[str]:
    if not INVENTORY.exists():
        return []
    rows = json.loads(INVENTORY.read_text(encoding="utf-8"))
    return [row["text"] if isinstance(row, dict) else str(row) for row in rows]


def should_skip(text: str) -> bool:
    if not text or not HE.search(text):
        return True
    if is_html_only(text) or is_url_or_asset(text):
        return True
    if is_person_name(text):
        return True
    return False


def token_boundary_replace(source: str, phrase: str, replacement: str) -> str:
    if phrase not in source:
        return source
    pattern = re.compile(
        r"(?<![\u0590-\u05FF])" + re.escape(phrase) + r"(?![\u0590-\u05FF])"
    )
    return pattern.sub(lambda _: replacement, source)


PREFIXES = (
    ("וה", {"en": "and the ", "es": "y el ", "pt-BR": "e o ", "ar": "و"}),
    ("ול", {"en": "and to ", "es": "y a ", "pt-BR": "e para ", "ar": "وإلى "}),
    ("וב", {"en": "and in ", "es": "y en ", "pt-BR": "e em ", "ar": "وفي "}),
    ("ומ", {"en": "and from ", "es": "y de ", "pt-BR": "e de ", "ar": "ومن "}),
    ("וכ", {"en": "and as ", "es": "y como ", "pt-BR": "e como ", "ar": "وكما "}),
    ("שה", {"en": "that the ", "es": "que el ", "pt-BR": "que o ", "ar": "أن "}),
    ("של", {"en": "that to ", "es": "que a ", "pt-BR": "que para ", "ar": "الذي ل"}),
    ("ה", {"en": "the ", "es": "el ", "pt-BR": "o ", "ar": "ال"}),
    ("ל", {"en": "to ", "es": "a ", "pt-BR": "para ", "ar": "ل"}),
    ("ב", {"en": "in ", "es": "en ", "pt-BR": "em ", "ar": "في "}),
    ("מ", {"en": "from ", "es": "de ", "pt-BR": "de ", "ar": "من "}),
    ("ו", {"en": "and ", "es": "y ", "pt-BR": "e ", "ar": "و"}),
    ("ש", {"en": "that ", "es": "que ", "pt-BR": "que ", "ar": "الذي "}),
    ("כ", {"en": "as ", "es": "como ", "pt-BR": "como ", "ar": "ك"}),
)

TOKEN_RE = re.compile(r"[\u0590-\u05FF][\u0590-\u05FF\"״\'’-]*")


def _value(found: dict, locale: str) -> str | None:
    dest = found.get(locale)
    if dest is None:
        dest = found.get("en")
    return dest


def stem_candidates(token: str) -> list[str]:
    out = [token]
    if token.endswith("ות") and len(token) > 3:
        out.append(token[:-2] + "ה")
        out.append(token[:-2])
    if token.endswith("ים") and len(token) > 3:
        out.append(token[:-2])
    if token.endswith("ית") and len(token) > 3:
        out.append(token[:-2])
        out.append(token[:-1] + "ה")
    if token.endswith("ת") and len(token) > 3:
        out.append(token[:-1] + "ה")
        out.append(token[:-1])
    if token.endswith("י") and len(token) > 3:
        out.append(token[:-1])
    return out


def lookup_token(token: str, locale: str, index: dict[str, dict]) -> str | None:
    for candidate in stem_candidates(token):
        found = index.get(candidate)
        if found:
            dest = _value(found, locale)
            if dest is not None:
                return dest
    for prefix, glue in PREFIXES:
        if len(token) <= len(prefix) + 1 or not token.startswith(prefix):
            continue
        rest = token[len(prefix) :]
        for candidate in stem_candidates(rest):
            found = index.get(candidate)
            if not found:
                continue
            word = _value(found, locale)
            if word is None or word == "":
                continue
            return f"{glue.get(locale) or glue['en']}{word}"
    return None


def compose(text: str, locale: str, table: list[tuple[str, dict]]) -> str:
    out = text
    for src, trans in table:
        if src not in out:
            continue
        dest = trans.get(locale)
        if dest is None:
            dest = trans.get("en")
        if dest is None:
            dest = src
        if dest == src:
            continue
        out = token_boundary_replace(out, src, dest)
    index = {src: trans for src, trans in table}

    def replace_token(match: re.Match) -> str:
        token = match.group(0)
        found = lookup_token(token, locale, index)
        return found if found else token

    out = TOKEN_RE.sub(replace_token, out)
    out = re.sub(r"(?<![\u0590-\u05FF])[\u0590-\u05FF](?![\u0590-\u05FF])", "", out)
    out = re.sub(r"[ \t]{2,}", " ", out)
    out = re.sub(r"\s+([,.;:!?])", r"\1", out)
    return out.strip()


PRODUCT_FROM_CATALOG = re.compile(r"^מוצר\s+(.+?)\s+מתוך קטלוג\s+(.+?)\.?$")
ALL_EXACT = {**EXACT, **TEMPLATE_EXACT}


def merge_tables() -> list[tuple[str, dict]]:
    merged: dict[str, dict] = {}
    for src, trans in FRAGMENTS.items():
        merged[src] = dict(trans)
    for src, trans in EXTRA.items():
        merged[src] = dict(trans)
    for src, trans in ALL_EXACT.items():
        merged[src] = dict(trans)
    return sorted(merged.items(), key=lambda item: len(item[0]), reverse=True)


def pattern_entry(text: str, table: list[tuple[str, dict]]) -> dict | None:
    match = PRODUCT_FROM_CATALOG.match(text.strip())
    if not match:
        return None
    kind = compose(match.group(1), "en", table)
    catalog = match.group(2)
    return {
        "en": f"{kind} product from the {catalog} catalog.",
        "es": f"Producto de {compose(match.group(1), 'es', table)} del catálogo {catalog}.",
        "pt-BR": f"Produto de {compose(match.group(1), 'pt-BR', table)} do catálogo {catalog}.",
        "ar": f"منتج {compose(match.group(1), 'ar', table)} من كتالوج {catalog}.",
    }


def main() -> None:
    existing = json.loads(PHRASEBOOK.read_text(encoding="utf-8"))
    # Never overwrite the hand-authored seed book that shipped on the branch.
    protected = set()
    try:
        import subprocess

        raw = subprocess.check_output(
            ["git", "show", "HEAD:src/i18n/templateSeedPhrasebook.json"],
            cwd=ROOT,
            text=True,
        )
        protected = set(json.loads(raw))
    except Exception:
        protected = set(existing)
    table = merge_tables()
    sources: list[str] = []
    seen: set[str] = set()
    for text in [*load_inventory(), *extract_library_titles(), *ALL_EXACT.keys(), *existing.keys()]:
        if text in seen:
            continue
        seen.add(text)
        sources.append(text)

    out = {key: existing[key] for key in protected if key in existing}
    if not out:
        out = dict(existing)
        protected = set(existing)
    added = 0
    leftover = 0
    for text in sources:
        if text in protected and text in out:
            continue
        if should_skip(text):
            continue
        entry = ALL_EXACT.get(text) or pattern_entry(text, table)
        if not entry:
            entry = {
                locale: compose(text, locale, table)
                for locale in ("en", "es", "pt-BR", "ar")
            }
        if any(HE.search(entry.get(locale, "")) for locale in ("en", "es", "pt-BR", "ar")):
            leftover += 1
        out[text] = {
            "en": entry.get("en") or text,
            "es": entry.get("es") or entry.get("en") or text,
            "pt-BR": entry.get("pt-BR") or entry.get("en") or text,
            "ar": entry.get("ar") or entry.get("en") or text,
        }
        added += 1

    PHRASEBOOK.write_text(
        json.dumps(out, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    print(
        f"phrasebook keys={len(out)} added={added} existing={len(existing)} leftover_hebrew={leftover}"
    )


if __name__ == "__main__":
    main()
