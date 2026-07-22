#!/usr/bin/env python3
"""Replace broken Unsplash photo IDs across template sources."""
from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

# Verified working replacements (GET 200)
REPLACEMENTS = {
    "photo-1556761175-4b46a572b786": "photo-1556761175-4b46a572b786",
    "photo-1507525428034-b723cf961d3e": "photo-1507525428034-b723cf961d3e",
    "photo-1512917774080-9991f1c4c750": "photo-1512917774080-9991f1c4c750",
    "photo-1560518883-ce09059eeffa": "photo-1560518883-ce09059eeffa",
    "photo-1600585154340-be6161a56a0c": "photo-1600585154340-be6161a56a0c",
    "photo-1507525428034-b723cf961d3e": "photo-1507525428034-b723cf961d3e",
    "photo-1600585154340-be6161a56a0c": "photo-1600585154340-be6161a56a0c",
    "photo-1505142468610-359e7d316be0": "photo-1505142468610-359e7d316be0",
    "photo-1544551763-46a013bb70d5": "photo-1544551763-46a013bb70d5",
    "photo-1682687220063-4742bd7fd538": "photo-1682687220063-4742bd7fd538",
    "photo-1497366216548-37526070297c": "photo-1497366216548-37526070297c",
    "photo-1560518883-ce09059eeffa": "photo-1560518883-ce09059eeffa",
    "photo-1507525428034-b723cf961d3e": "photo-1507525428034-b723cf961d3e",
    "photo-1520250497591-112f2f40a3f4": "photo-1520250497591-112f2f40a3f4",
    "photo-1505142468610-359e7d316be0": "photo-1505142468610-359e7d316be0",
    "photo-1544551763-46a013bb70d5": "photo-1544551763-46a013bb70d5",
    "photo-1540555700478-4be289fbecef": "photo-1540555700478-4be289fbecef",
    "photo-1544551763-46a013bb70d5": "photo-1544551763-46a013bb70d5",
    "photo-1558618666-fcd25c85cd64": "photo-1558618666-fcd25c85cd64",
    "photo-1571896349842-33c89424de2d": "photo-1571896349842-33c89424de2d",
    "photo-1559827260-dc66d52bef19": "photo-1559827260-dc66d52bef19",
    "photo-1582268611958-ebfd161ef9cf": "photo-1582268611958-ebfd161ef9cf",
    "photo-1600596542815-ffad4c1539a9": "photo-1600596542815-ffad4c1539a9",
    "photo-1600596542815-ffad4c1539a9": "photo-1600596542815-ffad4c1539a9",
    "photo-1505142468610-359e7d316be0": "photo-1505142468610-359e7d316be0",
    "photo-1497366216548-37526070297c": "photo-1497366216548-37526070297c",
    "photo-1582268611958-ebfd161ef9cf": "photo-1582268611958-ebfd161ef9cf",
    "photo-1571896349842-33c89424de2d": "photo-1571896349842-33c89424de2d",
    "photo-1560518883-ce09059eeffa": "photo-1560518883-ce09059eeffa",
}

SCAN_DIRS = [
    ROOT / "src/components/site-builder/studio/data/templates",
    ROOT / "scripts",
]
EXTENSIONS = {".ts", ".tsx", ".json", ".py", ".jsx", ".js"}


def main() -> None:
    changed_files = 0
    total_replacements = 0

    for base in SCAN_DIRS:
        if not base.exists():
            continue
        for path in base.rglob("*"):
            if path.suffix not in EXTENSIONS:
                continue
            text = path.read_text(encoding="utf-8")
            original = text
            for old, new in REPLACEMENTS.items():
                text = text.replace(old, new)
            if text != original:
                path.write_text(text, encoding="utf-8")
                changed_files += 1
                total_replacements += sum(
                    original.count(old) for old in REPLACEMENTS
                )

    print(f"Updated {changed_files} files ({total_replacements} replacements)")


if __name__ == "__main__":
    main()
