#!/usr/bin/env python3
"""Merge Automations + WhatsApp chrome into en/he/es/pt-BR/ar locale files."""
from __future__ import annotations

import json
from copy import deepcopy
from pathlib import Path

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[1] / "src" / "i18n" / "locales"
LANGS = ("en", "he", "es", "pt-BR", "ar")


def deep_merge(base: dict, patch: dict) -> dict:
    out = dict(base)
    for key, value in patch.items():
        if isinstance(value, dict) and isinstance(out.get(key), dict):
            out[key] = deep_merge(out[key], value)
        else:
            out[key] = value
    return out


def flatten(obj, prefix=""):
    if isinstance(obj, dict):
        for key, value in obj.items():
            path = f"{prefix}.{key}" if prefix else key
            yield from flatten(value, path)
    else:
        yield prefix, obj


def unflatten(items: dict) -> dict:
    out: dict = {}
    for path, value in items.items():
        cur = out
        parts = path.split(".")
        for part in parts[:-1]:
            cur = cur.setdefault(part, {})
        cur[parts[-1]] = value
    return out


def assert_parity(packs: dict[str, dict], label: str) -> None:
    en_keys = set(k for k, _ in flatten(packs["en"]))
    for lang, pack in packs.items():
        keys = set(k for k, _ in flatten(pack))
        missing = sorted(en_keys - keys)
        extra = sorted(keys - en_keys)
        if missing or extra:
            raise SystemExit(
                f"{label} key mismatch for {lang}: missing={missing[:20]} extra={extra[:20]}"
            )


def load_json(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8"))


def write_locale(lang: str, automations: dict, whatsapp: dict) -> None:
    path = ROOT / f"{lang}.json"
    data = json.loads(path.read_text(encoding="utf-8"))
    data["automations"] = deep_merge(data.get("automations") or {}, automations)
    data["whatsapp"] = deep_merge(data.get("whatsapp") or {}, whatsapp)
    path.write_text(
        json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    print(f"updated {path}")


def main() -> None:
    from l10n_automations import AUTOMATIONS, ROWS
    from l10n_whatsapp import WHATSAPP

    AUTOMATIONS["en"] = load_json(HERE / "automations.en.json")
    WHATSAPP["en"] = load_json(HERE / "whatsapp-chrome.en.json")
    en_keys = {k for k, _ in flatten(AUTOMATIONS["en"])}
    row_keys = set(ROWS)
    missing = sorted(en_keys - row_keys)
    extra = sorted(row_keys - en_keys)
    if missing or extra:
        raise SystemExit(
            f"ROWS vs EN mismatch missing={missing[:30]} extra={extra[:30]} "
            f"counts missing={len(missing)} extra={len(extra)}"
        )
    assert_parity(AUTOMATIONS, "automations")
    assert_parity(WHATSAPP, "whatsapp")
    for lang in LANGS:
        write_locale(lang, AUTOMATIONS[lang], WHATSAPP[lang])


if __name__ == "__main__":
    main()
