#!/usr/bin/env python3
"""Generate 13 NEW food/restaurant studio templates (batch2) with unique-page sections."""
from __future__ import annotations

import json
from pathlib import Path

from _food_batch2_sections import LAYOUT_SECTIONS, paint

ROOT = Path("src/components/site-builder/studio/data/templates")
CONFIG = Path("scripts/food-templates-batch2-config.json")

CITIES = [
    "רח׳ הקמח 7, תל אביב",
    "שדרות הצ׳ילי 3, יפו",
    "רח׳ הגלידה 11, הרצליה",
    "דרך השיפוד 19, ראשון לציון",
    "רח׳ הקערה 5, תל אביב",
    "סמטת הקיטור 2, חיפה",
    "רח׳ הסמאש 14, רמת גן",
    "נמל הדייגים 1, יפו",
    "רח׳ השורש 9, ירושלים",
    "בור העשן 4, באר שבע",
    "רח׳ הנודלס 16, תל אביב",
    "סמטת הסוכר 8, נתניה",
    "רח׳ ההדרים 21, רעננה",
]

META_BLOCKS = {
    "laminateLayers": [
        ("header", "flour-dust-nav", "Flour dust sticky nav"),
        ("hero", "laminate-pastry-layers", "Laminate pastry layers hero"),
        ("menu", "layered-shelf-pastries", "Layered shelf pastries"),
        ("process", "lam-process", "Laminate process"),
        ("gallery", "bakery-gallery", "Bakery gallery"),
        ("reviews", "bakery-reviews", "Bakery reviews"),
        ("hours", "oven-stats-hours", "Oven stats + hours"),
        ("cta", "bakery-home-cta", "Home CTA teaser"),
        ("pastriesPage", "full-pastry-menu", "Full pastry menu page"),
        ("ovenPage", "oven-story", "Oven story page"),
        ("about", "baker-timeline", "Baker timeline + portrait"),
        ("contact", "ticket-reserve-faq", "Ticket reserve + FAQ"),
        ("footer", "crust-crumb", "Crust crumb footer"),
    ],
    "papelFlutter": [
        ("header", "papel-sticker-nav", "Papel sticker nav"),
        ("hero", "papel-flutter-hero", "Papel flutter taco hero"),
        ("menu", "flutter-taco-cards", "Flutter taco cards"),
        ("process", "salsa-process", "Salsa process"),
        ("gallery", "taco-gallery", "Taco gallery"),
        ("reviews", "taco-reviews", "Taco reviews"),
        ("stats", "chili-stats", "Chili stats + hours"),
        ("cta", "taco-home-cta", "Home CTA teaser"),
        ("tacosPage", "full-taco-menu", "Full taco menu page"),
        ("salsaPage", "salsa-story", "Salsa story page"),
        ("about", "plancha-timeline", "Plancha timeline"),
        ("contact", "market-note-faq", "Market note reserve + FAQ"),
        ("footer", "papel-tear", "Papel tear footer"),
    ],
    "meltDrip": [
        ("header", "scoop-pill-nav", "Scoop pill nav"),
        ("hero", "melt-drip-hero", "Melt drip gelato hero"),
        ("menu", "scoop-ring-flavors", "Scoop ring flavors"),
        ("process", "gelato-process", "Gelato process"),
        ("gallery", "gelato-gallery", "Gelato gallery"),
        ("reviews", "gelato-reviews", "Gelato reviews"),
        ("stats", "scoop-stats", "Scoop stats + hours"),
        ("cta", "gelato-home-cta", "Home CTA teaser"),
        ("scoopsPage", "full-flavor-menu", "Full flavor menu page"),
        ("labPage", "lab-story", "Lab story page"),
        ("about", "maestro-timeline", "Maestro timeline"),
        ("contact", "sweet-reserve-faq", "Sweet reserve + FAQ"),
        ("footer", "drip-line", "Drip line footer"),
    ],
    "spitRotate": [
        ("header", "spit-bar-nav", "Spit bar nav"),
        ("hero", "rotating-spit-hero", "Rotating spit hero"),
        ("menu", "spit-vertical-rail", "Spit vertical rail"),
        ("process", "shawarma-process", "Shawarma process"),
        ("gallery", "spit-gallery", "Spit gallery"),
        ("reviews", "shawarma-reviews", "Shawarma reviews"),
        ("stats", "spit-stats", "Spit stats + hours"),
        ("cta", "shawarma-home-cta", "Home CTA teaser"),
        ("platesPage", "full-plate-menu", "Full plate menu page"),
        ("spitPage", "spit-story", "Spit story page"),
        ("about", "grill-timeline", "Grill timeline"),
        ("contact", "counter-reserve-faq", "Counter reserve + FAQ"),
        ("footer", "pita-edge", "Pita edge footer"),
    ],
    "bowlOrbit": [
        ("header", "orbit-thin-nav", "Orbit thin nav"),
        ("hero", "bowl-orbit-hero", "Bowl orbit hero"),
        ("menu", "orbit-bowl-map", "Orbit bowl map"),
        ("process", "poke-process", "Poke process"),
        ("gallery", "poke-gallery", "Poke gallery"),
        ("reviews", "poke-reviews", "Poke reviews"),
        ("stats", "bowl-stats", "Bowl stats + hours"),
        ("cta", "poke-home-cta", "Home CTA teaser"),
        ("bowlsPage", "full-bowl-menu", "Full bowl menu page"),
        ("buildPage", "build-story", "Build story page"),
        ("about", "pacific-timeline", "Pacific timeline"),
        ("contact", "circle-reserve-faq", "Circle reserve + FAQ"),
        ("footer", "orbit-ring", "Orbit ring footer"),
    ],
    "basketSteam": [
        ("header", "bamboo-nav", "Bamboo steam nav"),
        ("hero", "basket-steam-hero", "Basket steam hero"),
        ("menu", "steam-basket-stack", "Steam basket stack"),
        ("process", "dimsum-process", "Dim sum process"),
        ("gallery", "steam-gallery", "Steam gallery"),
        ("reviews", "dimsum-reviews", "Dim sum reviews"),
        ("stats", "steam-stats", "Steam stats + hours"),
        ("cta", "dimsum-home-cta", "Home CTA teaser"),
        ("basketsPage", "full-basket-menu", "Full basket menu page"),
        ("steamPage", "steam-story", "Steam story page"),
        ("about", "wok-timeline", "Wok timeline"),
        ("contact", "round-reserve-faq", "Round reserve + FAQ"),
        ("footer", "bamboo-wave", "Bamboo wave footer"),
    ],
    "smashStack": [
        ("header", "smash-badge-nav", "Smash badge nav"),
        ("hero", "smash-stack-hero", "Smash stack hero"),
        ("menu", "burger-smash-pile", "Burger smash pile"),
        ("process", "smash-process", "Smash process"),
        ("gallery", "burger-gallery", "Burger gallery"),
        ("reviews", "burger-reviews", "Burger reviews"),
        ("stats", "grill-stats", "Grill stats + hours"),
        ("cta", "burger-home-cta", "Home CTA teaser"),
        ("burgersPage", "full-burger-menu", "Full burger menu page"),
        ("smashPage", "smash-story", "Smash story page"),
        ("about", "patty-timeline", "Patty timeline"),
        ("contact", "ticket-smash-faq", "Ticket smash FAQ"),
        ("footer", "bun-tear", "Bun tear footer"),
    ],
    "foamWave": [
        ("header", "foam-nav", "Foam wave nav"),
        ("hero", "foam-wave-hero", "Foam wave seafood hero"),
        ("menu", "wave-catch-cards", "Wave catch cards"),
        ("process", "seafood-process", "Seafood process"),
        ("gallery", "sea-gallery", "Sea gallery"),
        ("reviews", "sea-reviews", "Sea reviews"),
        ("stats", "tide-stats", "Tide stats + hours"),
        ("cta", "sea-home-cta", "Home CTA teaser"),
        ("catchPage", "full-catch-menu", "Full catch menu page"),
        ("wavesPage", "waves-story", "Waves story page"),
        ("about", "harbor-timeline", "Harbor timeline"),
        ("contact", "harbor-reserve-faq", "Harbor reserve + FAQ"),
        ("footer", "foam-line", "Foam line footer"),
    ],
    "rootGrow": [
        ("header", "leaf-nav", "Leaf grow nav"),
        ("hero", "root-grow-hero", "Root grow plant hero"),
        ("menu", "root-trail-plates", "Root trail plates"),
        ("process", "plant-process", "Plant process"),
        ("gallery", "garden-gallery", "Garden gallery"),
        ("reviews", "plant-reviews", "Plant reviews"),
        ("stats", "garden-stats", "Garden stats + hours"),
        ("cta", "plant-home-cta", "Home CTA teaser"),
        ("platesPage", "full-plant-menu", "Full plant menu page"),
        ("gardenPage", "garden-story", "Garden story page"),
        ("about", "soil-timeline", "Soil timeline"),
        ("contact", "garden-reserve-faq", "Garden reserve + FAQ"),
        ("footer", "root-line", "Root line footer"),
    ],
    "smokePlume": [
        ("header", "smoke-nav", "Smoke plume nav"),
        ("hero", "smoke-plume-hero", "Smoke plume BBQ hero"),
        ("menu", "smoke-meat-grid", "Smoke meat grid"),
        ("process", "bbq-process", "BBQ process"),
        ("gallery", "pit-gallery", "Pit gallery"),
        ("reviews", "bbq-reviews", "BBQ reviews"),
        ("stats", "smoke-stats", "Smoke stats + hours"),
        ("cta", "bbq-home-cta", "Home CTA teaser"),
        ("meatsPage", "full-meat-menu", "Full meat menu page"),
        ("smokePage", "smoke-story", "Smoke story page"),
        ("about", "pit-timeline", "Pit timeline"),
        ("contact", "ember-reserve-faq", "Ember reserve + FAQ"),
        ("footer", "ash-line", "Ash line footer"),
    ],
    "noodleSwirl": [
        ("header", "swirl-nav", "Noodle swirl nav"),
        ("hero", "noodle-swirl-hero", "Noodle swirl pasta hero"),
        ("menu", "swirl-pasta-board", "Swirl pasta board"),
        ("process", "pasta-process", "Pasta process"),
        ("gallery", "pasta-gallery", "Pasta gallery"),
        ("reviews", "pasta-reviews", "Pasta reviews"),
        ("stats", "sauce-stats", "Sauce stats + hours"),
        ("cta", "pasta-home-cta", "Home CTA teaser"),
        ("pastasPage", "full-pasta-menu", "Full pasta menu page"),
        ("saucePage", "sauce-story", "Sauce story page"),
        ("about", "nonna-timeline", "Nonna timeline"),
        ("contact", "trattoria-reserve-faq", "Trattoria reserve + FAQ"),
        ("footer", "swirl-svg", "Swirl SVG footer"),
    ],
    "sugarCrystal": [
        ("header", "crystal-nav", "Sugar crystal nav"),
        ("hero", "sugar-crystal-hero", "Sugar crystal dessert hero"),
        ("menu", "crystal-facet-sweets", "Crystal facet sweets"),
        ("process", "patisserie-process", "Patisserie process"),
        ("gallery", "sweet-gallery", "Sweet gallery"),
        ("reviews", "sweet-reviews", "Sweet reviews"),
        ("stats", "sugar-stats", "Sugar stats + hours"),
        ("cta", "dessert-home-cta", "Home CTA teaser"),
        ("sweetsPage", "full-sweet-menu", "Full sweet menu page"),
        ("atelierPage", "atelier-story", "Atelier story page"),
        ("about", "sugar-timeline", "Sugar timeline"),
        ("contact", "atelier-reserve-faq", "Atelier reserve + FAQ"),
        ("footer", "crystal-stamp", "Crystal stamp footer"),
    ],
    "citrusBurst": [
        ("header", "citrus-nav", "Citrus burst nav"),
        ("hero", "citrus-burst-hero", "Citrus burst juice hero"),
        ("menu", "burst-juice-circles", "Burst juice circles"),
        ("process", "press-process", "Press process"),
        ("gallery", "juice-gallery", "Juice gallery"),
        ("reviews", "juice-reviews", "Juice reviews"),
        ("stats", "press-stats", "Press stats + hours"),
        ("cta", "juice-home-cta", "Home CTA teaser"),
        ("juicesPage", "full-juice-menu", "Full juice menu page"),
        ("pressPage", "press-story", "Press story page"),
        ("about", "orchard-timeline", "Orchard timeline"),
        ("contact", "bottle-reserve-faq", "Bottle reserve + FAQ"),
        ("footer", "citrus-dots", "Citrus dots footer"),
    ],
}

EXTRA_CSS = {
    "laminateLayers": """
@keyframes {tid}-lam {{ 0%,100% {{ transform: translateY(0); }} 50% {{ transform: translateY(-6px); }} }}
@keyframes {tid}-flour {{ 0% {{ transform: translateY(-5%); opacity:.7; }} 100% {{ transform: translateY(110vh); opacity:.1; }} }}
[data-template-id="{tid}"] .tpl-lam-layer, [data-template-id="{tid}-preview"] .tpl-lam-layer {{ animation: {tid}-lam 5s ease-in-out infinite; }}
[data-template-id="{tid}"] .tpl-flour, [data-template-id="{tid}-preview"] .tpl-flour {{ animation: {tid}-flour var(--flour-dur, 8s) linear infinite; }}
""",
    "papelFlutter": """
@keyframes {tid}-papel {{ 0%,100% {{ transform: rotate(var(--rot, -2deg)) translateY(0); }} 50% {{ transform: rotate(calc(var(--rot, -2deg) + 3deg)) translateY(-8px); }} }}
[data-template-id="{tid}"] .tpl-papel, [data-template-id="{tid}-preview"] .tpl-papel {{ animation: {tid}-papel 4.5s ease-in-out infinite; }}
""",
    "meltDrip": """
@keyframes {tid}-drip {{ 0% {{ transform: translateY(-10%) scaleY(.6); opacity:.8; }} 100% {{ transform: translateY(40px) scaleY(1.2); opacity:.2; }} }}
@keyframes {tid}-scoop {{ 0%,100% {{ transform: translateY(0); }} 50% {{ transform: translateY(-10px); }} }}
[data-template-id="{tid}"] .tpl-drip, [data-template-id="{tid}-preview"] .tpl-drip {{ animation: {tid}-drip 3.2s ease-in infinite; }}
[data-template-id="{tid}"] .tpl-scoop, [data-template-id="{tid}-preview"] .tpl-scoop {{ animation: {tid}-scoop 4s ease-in-out infinite; }}
""",
    "spitRotate": """
@keyframes {tid}-spit {{ 0% {{ transform: rotate(0deg); }} 100% {{ transform: rotate(360deg); }} }}
[data-template-id="{tid}"] .tpl-spit, [data-template-id="{tid}-preview"] .tpl-spit {{ animation: {tid}-spit 18s linear infinite; transform-origin: center top; }}
""",
    "bowlOrbit": """
@keyframes {tid}-orbit {{ 0% {{ transform: rotate(0deg); }} 100% {{ transform: rotate(360deg); }} }}
[data-template-id="{tid}"] .tpl-orbit, [data-template-id="{tid}-preview"] .tpl-orbit {{ animation: {tid}-orbit 36s linear infinite; }}
""",
    "basketSteam": """
@keyframes {tid}-steam {{ 0% {{ transform: translateY(0) scaleX(1); opacity:.5; }} 100% {{ transform: translateY(-70vh) scaleX(1.5); opacity:0; }} }}
@keyframes {tid}-basket {{ 0%,100% {{ transform: translateY(0); }} 50% {{ transform: translateY(-6px); }} }}
[data-template-id="{tid}"] .tpl-steam, [data-template-id="{tid}-preview"] .tpl-steam {{ animation: {tid}-steam var(--steam-dur, 6s) ease-in infinite; }}
[data-template-id="{tid}"] .tpl-basket, [data-template-id="{tid}-preview"] .tpl-basket {{ animation: {tid}-basket 4s ease-in-out infinite; }}
""",
    "smashStack": """
@keyframes {tid}-smash {{ from {{ opacity:0; transform: translateY(24px) scale(.96); }} to {{ opacity:1; transform: translateY(0) scale(1); }} }}
[data-template-id="{tid}"] .tpl-smash, [data-template-id="{tid}-preview"] .tpl-smash {{ animation: {tid}-smash .7s cubic-bezier(.22,1,.36,1) both; }}
""",
    "foamWave": """
@keyframes {tid}-wave {{ 0% {{ transform: translateX(0); }} 100% {{ transform: translateX(-50%); }} }}
[data-template-id="{tid}"] .tpl-wave, [data-template-id="{tid}-preview"] .tpl-wave {{ animation: {tid}-wave 14s linear infinite; }}
""",
    "rootGrow": """
@keyframes {tid}-root {{ 0% {{ transform: scaleY(0); }} 100% {{ transform: scaleY(1); }} }}
[data-template-id="{tid}"] .tpl-root, [data-template-id="{tid}-preview"] .tpl-root {{ transform-origin: top; animation: {tid}-root 1.4s cubic-bezier(.22,1,.36,1) both; }}
""",
    "smokePlume": """
@keyframes {tid}-smoke {{ 0% {{ transform: translateY(0) scale(1); opacity:.5; }} 100% {{ transform: translateY(-80vh) scale(1.8); opacity:0; }} }}
[data-template-id="{tid}"] .tpl-smoke, [data-template-id="{tid}-preview"] .tpl-smoke {{ animation: {tid}-smoke 7s ease-out infinite; }}
""",
    "noodleSwirl": """
@keyframes {tid}-swirl {{ 0% {{ transform: rotate(0deg); }} 100% {{ transform: rotate(360deg); }} }}
[data-template-id="{tid}"] .tpl-swirl, [data-template-id="{tid}-preview"] .tpl-swirl {{ animation: {tid}-swirl 28s linear infinite; }}
""",
    "sugarCrystal": """
@keyframes {tid}-crystal {{ 0%,100% {{ filter: brightness(1); transform: scale(1); }} 50% {{ filter: brightness(1.15); transform: scale(1.02); }} }}
[data-template-id="{tid}"] .tpl-crystal, [data-template-id="{tid}-preview"] .tpl-crystal {{ animation: {tid}-crystal 3.5s ease-in-out infinite; }}
""",
    "citrusBurst": """
@keyframes {tid}-burst {{ 0% {{ transform: rotate(0deg) scale(1); }} 100% {{ transform: rotate(360deg) scale(1.05); }} }}
[data-template-id="{tid}"] .tpl-burst, [data-template-id="{tid}-preview"] .tpl-burst {{ animation: {tid}-burst 22s linear infinite; }}
""",
}


def _p(t):
    return t["palette"]


def _esc(s: str) -> str:
    return str(s).replace("\\", "\\\\").replace('"', '\\"').replace("\n", " ")


def header_jsx(t):
    p = _p(t)
    layout = t["layout"]
    common_nav = '''
        <nav className="hidden items-center gap-5 lg:flex">
          {nav.map(([id, label]) => (
            <button key={id} type="button" onClick={() => goTo(id)} className="text-sm font-semibold"
              style={{ color: currentPage === id ? "%(text)s" : "%(muted)s" }}>{label}</button>
          ))}
        </nav>''' % {"text": p["text"], "muted": p["muted"]}

    headers = {
        "laminateLayers": f'''
    <header data-template-section-type="header" data-section-kind="header" className="sticky top-0 z-50 border-b"
      style={{{{ background: "{p['bg']}f2", borderColor: "{p['line']}" }}}}>
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 lg:px-8">
        <button type="button" onClick={{() => goTo("home")}} className="text-right">
          <span className="tpl-display text-2xl font-bold">{{v(data, "brandName")}}</span>
          <span className="mt-1 block h-0.5 w-16" style={{{{ background: "{p['primary']}" }}}} />
        </button>
        {common_nav}
        <button type="button" onClick={{onCta}} className="px-5 py-2.5 text-sm font-bold" style={{{{ background: "{p['primary']}", color: "{p['primaryText']}" }}}}>{{v(data, "heroPrimary")}}</button>
      </div>
    </header>''',
        "papelFlutter": f'''
    <header data-template-section-type="header" data-section-kind="header" className="sticky top-0 z-50" style={{{{ background: "transparent" }}}}>
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 lg:px-8">
        <button type="button" onClick={{() => goTo("home")}} className="-rotate-2 border-2 px-3 py-2" style={{{{ borderColor: "{p['primary']}", background: "{p['surface']}" }}}}>
          <span className="tpl-display text-lg font-black">{{v(data, "logoText")}} · {{v(data, "brandName")}}</span>
        </button>
        {common_nav}
        <button type="button" onClick={{onCta}} className="border-2 px-4 py-2 text-sm font-black" style={{{{ borderColor: "{p['primary']}", color: "{p['primary']}" }}}}>{{v(data, "heroPrimary")}}</button>
      </div>
    </header>''',
        "meltDrip": f'''
    <header data-template-section-type="header" data-section-kind="header" className="fixed inset-x-0 top-4 z-50 px-4">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 rounded-full border px-5 py-3" style={{{{ background: "{p['surface']}ee", borderColor: "{p['line']}", backdropFilter: "blur(14px)" }}}}>
        <button type="button" onClick={{() => goTo("home")}} className="tpl-display text-xl font-bold">{{v(data, "brandName")}}</button>
        {common_nav}
        <button type="button" onClick={{onCta}} className="rounded-full px-4 py-2 text-xs font-bold" style={{{{ background: "{p['primary']}", color: "{p['primaryText']}" }}}}>{{v(data, "heroPrimary")}}</button>
      </div>
    </header>''',
        "spitRotate": f'''
    <header data-template-section-type="header" data-section-kind="header" className="sticky top-0 z-50 border-b" style={{{{ background: "{p['dark']}f0", borderColor: "{p['line']}" }}}}>
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3 lg:px-8">
        <button type="button" onClick={{() => goTo("home")}} className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center text-sm font-bold" style={{{{ background: "{p['primary']}", color: "{p['primaryText']}" }}}}>{{v(data, "logoText")}}</span>
          <span className="tpl-display text-xl font-bold">{{v(data, "brandName")}}</span>
        </button>
        {common_nav}
        <button type="button" onClick={{onCta}} className="px-5 py-2 text-sm font-bold" style={{{{ background: "{p['primary']}", color: "{p['primaryText']}" }}}}>{{v(data, "heroPrimary")}}</button>
      </div>
    </header>''',
        "bowlOrbit": f'''
    <header data-template-section-type="header" data-section-kind="header" className="sticky top-0 z-50 border-b" style={{{{ background: "{p['bg']}", borderColor: "{p['line']}" }}}}>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-2.5 lg:px-8">
        <button type="button" onClick={{() => goTo("home")}} className="tpl-display text-lg font-semibold tracking-[0.18em]">{{v(data, "brandName")}}</button>
        {common_nav}
        <button type="button" onClick={{onCta}} className="rounded-full border px-4 py-1.5 text-xs font-semibold" style={{{{ borderColor: "{p['primary']}", color: "{p['primary']}" }}}}>{{v(data, "heroPrimary")}}</button>
      </div>
    </header>''',
        "basketSteam": f'''
    <header data-template-section-type="header" data-section-kind="header" className="sticky top-0 z-50 border-b" style={{{{ background: "{p['surface']}f0", borderColor: "{p['line']}" }}}}>
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 lg:px-8">
        <button type="button" onClick={{() => goTo("home")}} className="tpl-display text-2xl font-bold">{{v(data, "brandName")}}</button>
        {common_nav}
        <button type="button" onClick={{onCta}} className="rounded-full px-5 py-2.5 text-sm font-bold" style={{{{ background: "{p['primary']}", color: "{p['primaryText']}" }}}}>{{v(data, "heroPrimary")}}</button>
      </div>
    </header>''',
        "smashStack": f'''
    <header data-template-section-type="header" data-section-kind="header" className="sticky top-0 z-50" style={{{{ background: "{p['dark']}" }}}}>
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 lg:px-8">
        <button type="button" onClick={{() => goTo("home")}} className="border-4 px-3 py-1" style={{{{ borderColor: "{p['primary']}" }}}}>
          <span className="tpl-display text-xl font-black">{{v(data, "brandName")}}</span>
        </button>
        {common_nav}
        <button type="button" onClick={{onCta}} className="px-5 py-2.5 text-sm font-black" style={{{{ background: "{p['primary']}", color: "{p['primaryText']}" }}}}>{{v(data, "heroPrimary")}}</button>
      </div>
    </header>''',
        "foamWave": f'''
    <header data-template-section-type="header" data-section-kind="header" className="sticky top-0 z-50 border-b" style={{{{ background: "{p['bg']}f5", borderColor: "{p['line']}" }}}}>
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 lg:px-8">
        <button type="button" onClick={{() => goTo("home")}} className="tpl-display text-2xl font-semibold">{{v(data, "brandName")}}</button>
        {common_nav}
        <button type="button" onClick={{onCta}} className="rounded-full px-5 py-2.5 text-sm font-bold" style={{{{ background: "{p['primary']}", color: "{p['primaryText']}" }}}}>{{v(data, "heroPrimary")}}</button>
      </div>
    </header>''',
        "rootGrow": f'''
    <header data-template-section-type="header" data-section-kind="header" className="sticky top-0 z-50" style={{{{ background: "{p['bg']}f0" }}}}>
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 lg:px-8">
        <button type="button" onClick={{() => goTo("home")}} className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full" style={{{{ background: "{p['primary']}" }}}} />
          <span className="tpl-display text-2xl font-bold">{{v(data, "brandName")}}</span>
        </button>
        {common_nav}
        <button type="button" onClick={{onCta}} className="rounded-sm px-5 py-2.5 text-sm font-bold" style={{{{ background: "{p['primary']}", color: "{p['primaryText']}" }}}}>{{v(data, "heroPrimary")}}</button>
      </div>
    </header>''',
        "smokePlume": f'''
    <header data-template-section-type="header" data-section-kind="header" className="sticky top-0 z-50 border-b"
      style={{{{ background: "{p['dark']}ee", borderColor: "{p['line']}", backdropFilter: "blur(10px)" }}}}>
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3.5 lg:px-8">
        <button type="button" onClick={{() => goTo("home")}} className="tpl-display text-2xl font-bold tracking-wide">{{v(data, "brandName")}}</button>
        {common_nav}
        <button type="button" onClick={{onCta}} className="px-5 py-2.5 text-sm font-bold" style={{{{ background: "{p['primary']}", color: "{p['primaryText']}" }}}}>{{v(data, "heroPrimary")}}</button>
      </div>
    </header>''',
        "noodleSwirl": f'''
    <header data-template-section-type="header" data-section-kind="header" className="sticky top-0 z-50 border-b" style={{{{ background: "{p['bg']}f5", borderColor: "{p['line']}" }}}}>
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 lg:px-8">
        <button type="button" onClick={{() => goTo("home")}} className="tpl-display text-2xl font-bold italic">{{v(data, "brandName")}}</button>
        {common_nav}
        <button type="button" onClick={{onCta}} className="px-5 py-2.5 text-sm font-bold" style={{{{ background: "{p['primary']}", color: "{p['primaryText']}" }}}}>{{v(data, "heroPrimary")}}</button>
      </div>
    </header>''',
        "sugarCrystal": f'''
    <header data-template-section-type="header" data-section-kind="header" className="sticky top-0 z-50 border-b" style={{{{ background: "{p['bg']}f5", borderColor: "{p['line']}" }}}}>
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-3 px-5 py-5">
        <button type="button" onClick={{() => goTo("home")}} className="tpl-display text-4xl font-bold">{{v(data, "brandName")}}</button>
        <nav className="flex flex-wrap items-center justify-center gap-5">
          {{nav.map(([id, label]) => (
            <button key={{id}} type="button" onClick={{() => goTo(id)}} className="text-xs font-medium tracking-[0.2em] uppercase"
              style={{{{ color: currentPage === id ? "{p['primary']}" : "{p['muted']}" }}}}>{{label}}</button>
          ))}}
        </nav>
      </div>
    </header>''',
        "citrusBurst": f'''
    <header data-template-section-type="header" data-section-kind="header" className="sticky top-0 z-50 bg-transparent">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 lg:px-8">
        <button type="button" onClick={{() => goTo("home")}} className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-full text-sm font-bold" style={{{{ background: "{p['primary']}", color: "{p['primaryText']}" }}}}>{{v(data, "logoText")}}</span>
          <span className="tpl-display text-xl font-bold">{{v(data, "brandName")}}</span>
        </button>
        <nav className="hidden items-center gap-5 rounded-full border px-6 py-2 lg:flex" style={{{{ borderColor: "{p['line']}", background: "{p['surface']}cc" }}}}>
          {{nav.map(([id, label]) => (
            <button key={{id}} type="button" onClick={{() => goTo(id)}} className="text-sm font-semibold"
              style={{{{ color: currentPage === id ? "{p['text']}" : "{p['muted']}" }}}}>{{label}}</button>
          ))}}
        </nav>
        <button type="button" onClick={{onCta}} className="rounded-full px-5 py-2.5 text-sm font-bold" style={{{{ background: "{p['primary']}", color: "{p['primaryText']}" }}}}>{{v(data, "heroPrimary")}}</button>
      </div>
    </header>''',
    }
    return headers[layout]


def hero_jsx(t):
    p = _p(t)
    secondary = t["pages"][1][0]
    layout = t["layout"]
    base_text = f'''
          <p className="tpl-rise text-xs font-semibold tracking-[0.28em]" style={{{{ color: "{p['primary']}" }}}}>{{v(data, "heroEyebrow")}}</p>
          <h1 className="tpl-display tpl-rise-2 mt-4 max-w-4xl text-6xl font-bold leading-[0.92] md:text-8xl">{{v(data, "heroTitle")}}</h1>
          <p className="tpl-rise-3 mt-6 max-w-xl text-lg leading-8" style={{{{ color: "{p['muted']}" }}}}>{{v(data, "heroSubtitle")}}</p>
          <div className="tpl-rise-3 mt-8 flex flex-wrap gap-3">
            <button type="button" onClick={{onCta}} className="px-7 py-3.5 text-sm font-bold" style={{{{ background: "{p['primary']}", color: "{p['primaryText']}" }}}}>{{v(data, "heroPrimary")}}</button>
            <button type="button" onClick={{() => goTo("{secondary}")}} className="border px-7 py-3.5 text-sm font-semibold" style={{{{ borderColor: "{p['line']}" }}}}>{{v(data, "heroSecondary")}}</button>
          </div>'''

    heroes = {
        "laminateLayers": f'''
      <section className="relative isolate min-h-[90vh] overflow-hidden">
        <img src={{v(data, "heroImage")}} alt="" className="tpl-ken absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0" style={{{{ background: "linear-gradient(100deg, {p['bg']}ee 20%, {p['bg']}66 70%, transparent)" }}}} />
        {{Array.from({{ length: 12 }}).map((_, i) => (
          <div key={{i}} className="tpl-flour pointer-events-none absolute h-1.5 w-1.5 rounded-full" style={{{{ left: `${{8 + i * 7}}%`, top: "-2%", background: "{p['primary']}", animationDelay: `${{i * 0.4}}s`, ["--flour-dur" as string]: `${{6 + (i % 4)}}s` }}}} />
        ))}}
        <div className="relative z-10 mx-auto flex min-h-[90vh] max-w-7xl flex-col justify-center px-5 py-28 lg:px-8">
          {base_text}
        </div>
      </section>''',
        "papelFlutter": f'''
      <section className="relative isolate min-h-[92vh] overflow-hidden">
        <img src={{v(data, "heroImage")}} alt="" className="tpl-ken absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0" style={{{{ background: "linear-gradient(180deg, {p['dark']}88, {p['bg']}f2)" }}}} />
        <div className="relative z-10 mx-auto flex min-h-[92vh] max-w-7xl flex-col justify-end px-5 pb-16 pt-28 lg:px-8">
          {base_text}
        </div>
      </section>''',
        "meltDrip": f'''
      <section className="relative isolate min-h-[92vh] overflow-hidden pt-20">
        <div className="absolute inset-0" style={{{{ background: `radial-gradient(circle at 50% 30%, {p['surface']}, {p['bg']})` }}}} />
        <div className="tpl-drip absolute left-[20%] top-0 h-32 w-10 rounded-b-full opacity-50" style={{{{ background: "{p['primary']}" }}}} />
        <div className="tpl-drip absolute left-[55%] top-0 h-24 w-8 rounded-b-full opacity-40" style={{{{ background: "{p['primary']}", animationDelay: ".6s" }}}} />
        <div className="relative z-10 mx-auto grid min-h-[92vh] max-w-7xl items-center gap-10 px-5 py-24 lg:grid-cols-2 lg:px-8">
          <div>{base_text}</div>
          <div className="tpl-scoop mx-auto aspect-square w-full max-w-md overflow-hidden rounded-full border-8" style={{{{ borderColor: "{p['primary']}" }}}}>
            <img src={{v(data, "heroImage")}} alt="" className="h-full w-full object-cover" />
          </div>
        </div>
      </section>''',
        "spitRotate": f'''
      <section className="relative isolate min-h-[90vh] overflow-hidden">
        <img src={{v(data, "heroImage")}} alt="" className="tpl-ken absolute inset-0 h-full w-full object-cover opacity-70" />
        <div className="absolute inset-0" style={{{{ background: "linear-gradient(90deg, {p['bg']}f2, {p['bg']}66)" }}}} />
        <div className="relative z-10 mx-auto flex min-h-[90vh] max-w-7xl flex-col justify-center px-5 py-28 lg:px-8">
          {base_text}
        </div>
      </section>''',
        "bowlOrbit": f'''
      <section className="relative isolate min-h-[92vh] overflow-hidden">
        <div className="absolute inset-0" style={{{{ background: "{p['bg']}" }}}} />
        <div className="tpl-orbit absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed opacity-30" style={{{{ borderColor: "{p['primary']}" }}}} />
        <div className="relative z-10 mx-auto grid min-h-[92vh] max-w-7xl items-center gap-10 px-5 py-24 lg:grid-cols-2 lg:px-8">
          <div>{base_text}</div>
          <div className="relative mx-auto aspect-square w-full max-w-md overflow-hidden rounded-full">
            <img src={{v(data, "heroImage")}} alt="" className="h-full w-full object-cover" />
          </div>
        </div>
      </section>''',
        "basketSteam": f'''
      <section className="relative isolate min-h-[92vh] overflow-hidden">
        <img src={{v(data, "heroImage")}} alt="" className="tpl-ken absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0" style={{{{ background: "linear-gradient(180deg, {p['bg']}99, {p['bg']}f0)" }}}} />
        {{Array.from({{ length: 10 }}).map((_, i) => (
          <div key={{i}} className="tpl-steam pointer-events-none absolute bottom-[20%] rounded-full bg-white/25" style={{{{ left: `${{10 + i * 8}}%`, width: `${{10 + (i % 3) * 4}}px`, height: `${{24 + (i % 4) * 10}}px`, animationDelay: `${{i * 0.35}}s` }}}} />
        ))}}
        <div className="relative z-10 mx-auto flex min-h-[92vh] max-w-7xl flex-col justify-end px-5 pb-16 pt-28 lg:px-8">
          {base_text}
        </div>
      </section>''',
        "smashStack": f'''
      <section className="relative isolate min-h-[90vh] overflow-hidden">
        <img src={{v(data, "heroImage")}} alt="" className="tpl-ken absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0" style={{{{ background: "linear-gradient(180deg, {p['dark']}66, {p['bg']}f5)" }}}} />
        <div className="relative z-10 mx-auto flex min-h-[90vh] max-w-7xl flex-col justify-end px-5 pb-16 pt-28 lg:px-8">
          {base_text}
        </div>
      </section>''',
        "foamWave": f'''
      <section className="relative isolate min-h-[92vh] overflow-hidden">
        <img src={{v(data, "heroImage")}} alt="" className="tpl-ken absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0" style={{{{ background: "linear-gradient(180deg, {p['bg']}55, {p['bg']}f2)" }}}} />
        <svg className="tpl-wave pointer-events-none absolute bottom-0 left-0 w-[200%] opacity-40" viewBox="0 0 1200 120" preserveAspectRatio="none" style={{{{ color: "{p['primary']}" }}}}><path fill="currentColor" d="M0,60 C150,120 350,0 600,60 C850,120 1050,0 1200,60 L1200,120 L0,120 Z" /></svg>
        <div className="relative z-10 mx-auto flex min-h-[92vh] max-w-7xl flex-col justify-center px-5 py-28 lg:px-8">
          {base_text}
        </div>
      </section>''',
        "rootGrow": f'''
      <section className="relative isolate min-h-[90vh] overflow-hidden">
        <img src={{v(data, "heroImage")}} alt="" className="tpl-ken absolute inset-0 h-full w-full object-cover opacity-80" />
        <div className="absolute inset-0" style={{{{ background: "linear-gradient(100deg, {p['bg']}f0 25%, transparent)" }}}} />
        <div className="relative z-10 mx-auto flex min-h-[90vh] max-w-7xl flex-col justify-center px-5 py-28 lg:px-8">
          {base_text}
        </div>
      </section>''',
        "smokePlume": f'''
      <section className="relative isolate min-h-[92vh] overflow-hidden">
        <img src={{v(data, "heroImage")}} alt="" className="tpl-ken absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0" style={{{{ background: "linear-gradient(180deg, {p['dark']}88, {p['bg']}f0)" }}}} />
        {{Array.from({{ length: 12 }}).map((_, i) => (
          <div key={{i}} className="tpl-smoke pointer-events-none absolute bottom-0 rounded-full bg-white/10 blur-md" style={{{{ left: `${{4 + i * 8}}%`, width: `${{28 + (i % 4) * 12}}px`, height: `${{40 + (i % 3) * 20}}px`, animationDelay: `${{i * 0.45}}s` }}}} />
        ))}}
        <div className="relative z-10 mx-auto flex min-h-[92vh] max-w-7xl flex-col justify-end px-5 pb-16 pt-28 lg:px-8">
          {base_text}
        </div>
      </section>''',
        "noodleSwirl": f'''
      <section className="relative isolate min-h-[90vh] overflow-hidden">
        <div className="absolute inset-0" style={{{{ background: "{p['bg']}" }}}} />
        <div className="tpl-swirl absolute -left-20 top-20 h-80 w-80 rounded-full opacity-40" style={{{{ background: `conic-gradient(from 0deg, {p['primary']}55, transparent, {p['primary']}33)` }}}} />
        <div className="relative z-10 mx-auto grid min-h-[90vh] max-w-7xl items-center gap-10 px-5 py-24 lg:grid-cols-2 lg:px-8">
          <div>{base_text}</div>
          <img src={{v(data, "heroImage")}} alt="" className="aspect-[4/5] w-full object-cover" style={{{{ borderRadius: "40% 60% 50% 50%" }}}} />
        </div>
      </section>''',
        "sugarCrystal": f'''
      <section className="relative isolate min-h-[92vh] overflow-hidden">
        <img src={{v(data, "heroImage")}} alt="" className="tpl-ken absolute inset-0 h-full w-full object-cover opacity-50" />
        <div className="absolute inset-0" style={{{{ background: "{p['bg']}cc" }}}} />
        <div className="relative z-10 mx-auto flex min-h-[92vh] max-w-5xl flex-col items-center justify-center px-5 py-28 text-center">
          {base_text}
        </div>
      </section>''',
        "citrusBurst": f'''
      <section className="relative isolate min-h-[92vh] overflow-hidden">
        <div className="tpl-burst absolute -right-24 -top-24 h-96 w-96 rounded-full opacity-40" style={{{{ background: `conic-gradient(from 0deg, {p['primary']}, transparent, {p['primary']})` }}}} />
        <img src={{v(data, "heroImage")}} alt="" className="tpl-ken absolute inset-0 h-full w-full object-cover opacity-45" />
        <div className="absolute inset-0" style={{{{ background: "linear-gradient(90deg, {p['bg']}f5, {p['bg']}88)" }}}} />
        <div className="relative z-10 mx-auto flex min-h-[92vh] max-w-7xl flex-col justify-center px-5 py-28 lg:px-8">
          {base_text}
        </div>
      </section>''',
    }
    return heroes[layout]


def footer_jsx(t):
    p = _p(t)
    layout = t["layout"]
    footers = {
        "laminateLayers": f'''
    <footer className="border-t px-5 py-8 lg:px-8" style={{{{ borderColor: "{p['line']}" }}}}>
      <div className="mx-auto flex max-w-7xl flex-col gap-3 text-sm md:flex-row md:items-center md:justify-between" style={{{{ color: "{p['muted']}" }}}}>
        <span className="tpl-display text-lg font-bold" style={{{{ color: "{p['text']}" }}}}>{{v(data, "brandName")}}</span>
        <span>{{v(data, "email")}} · {{v(data, "phone")}}</span>
      </div>
    </footer>''',
        "papelFlutter": f'''
    <footer className="px-5 py-8 lg:px-8">
      <div className="mx-auto max-w-7xl border-2 border-dashed p-5" style={{{{ borderColor: "{p['primary']}" }}}}>
        <div className="flex flex-col gap-2 text-sm md:flex-row md:justify-between" style={{{{ color: "{p['muted']}" }}}}>
          <span className="tpl-display text-lg font-black" style={{{{ color: "{p['text']}" }}}}>{{v(data, "brandName")}}</span>
          <span>{{v(data, "phone")}}</span>
        </div>
      </div>
    </footer>''',
        "meltDrip": f'''
    <footer className="border-t px-5 py-10 lg:px-8" style={{{{ borderColor: "{p['line']}" }}}}>
      <div className="mx-auto max-w-5xl text-center">
        <div className="tpl-drip mx-auto mb-4 h-8 w-4 rounded-b-full" style={{{{ background: "{p['primary']}" }}}} />
        <span className="tpl-display text-2xl font-bold">{{v(data, "brandName")}}</span>
        <p className="mt-2 text-sm" style={{{{ color: "{p['muted']}" }}}}>{{v(data, "email")}}</p>
      </div>
    </footer>''',
        "spitRotate": f'''
    <footer className="border-t px-5 py-8 lg:px-8" style={{{{ borderColor: "{p['line']}", background: "{p['surface']}" }}}}>
      <div className="mx-auto flex max-w-7xl items-center justify-between text-sm" style={{{{ color: "{p['muted']}" }}}}>
        <span className="tpl-display text-lg font-bold" style={{{{ color: "{p['text']}" }}}}>{{v(data, "brandName")}}</span>
        <span>{{v(data, "address")}}</span>
      </div>
    </footer>''',
        "bowlOrbit": f'''
    <footer className="px-5 py-10 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-3">
        <div className="h-10 w-10 rounded-full border-2" style={{{{ borderColor: "{p['primary']}" }}}} />
        <span className="tpl-display text-lg font-semibold tracking-[0.2em]">{{v(data, "brandName")}}</span>
        <span className="text-sm" style={{{{ color: "{p['muted']}" }}}}>{{v(data, "email")}} · {{v(data, "phone")}}</span>
      </div>
    </footer>''',
        "basketSteam": f'''
    <footer className="border-t px-5 py-8 lg:px-8" style={{{{ borderColor: "{p['line']}" }}}}>
      <svg className="mx-auto mb-4 h-6 w-full max-w-7xl opacity-40" viewBox="0 0 400 20" style={{{{ color: "{p['primary']}" }}}}><path fill="none" stroke="currentColor" strokeWidth="2" d="M0,10 Q50,0 100,10 T200,10 T300,10 T400,10" /></svg>
      <div className="mx-auto flex max-w-7xl justify-between text-sm" style={{{{ color: "{p['muted']}" }}}}>
        <span className="tpl-display font-bold" style={{{{ color: "{p['text']}" }}}}>{{v(data, "brandName")}}</span>
        <span>{{v(data, "phone")}}</span>
      </div>
    </footer>''',
        "smashStack": f'''
    <footer className="px-5 py-8 lg:px-8" style={{{{ background: "{p['dark']}" }}}}>
      <div className="mx-auto flex max-w-7xl items-center justify-between border-4 px-4 py-3" style={{{{ borderColor: "{p['primary']}" }}}}>
        <span className="tpl-display text-xl font-black">{{v(data, "brandName")}}</span>
        <span className="text-sm" style={{{{ color: "{p['muted']}" }}}}>{{v(data, "email")}}</span>
      </div>
    </footer>''',
        "foamWave": f'''
    <footer className="relative overflow-hidden px-5 py-10 lg:px-8" style={{{{ background: "{p['surface']}" }}}}>
      <svg className="tpl-wave pointer-events-none absolute bottom-0 left-0 w-[200%] opacity-20" viewBox="0 0 1200 80" style={{{{ color: "{p['primary']}" }}}}><path fill="currentColor" d="M0,40 C200,80 400,0 600,40 C800,80 1000,0 1200,40 L1200,80 L0,80 Z" /></svg>
      <div className="relative mx-auto flex max-w-7xl justify-between text-sm" style={{{{ color: "{p['muted']}" }}}}>
        <span className="tpl-display text-lg font-semibold" style={{{{ color: "{p['text']}" }}}}>{{v(data, "brandName")}}</span>
        <span>{{v(data, "phone")}}</span>
      </div>
    </footer>''',
        "rootGrow": f'''
    <footer className="border-t px-5 py-8 lg:px-8" style={{{{ borderColor: "{p['line']}" }}}}>
      <div className="mx-auto h-px max-w-7xl tpl-root" style={{{{ background: "{p['primary']}" }}}} />
      <div className="mx-auto mt-6 flex max-w-7xl justify-between text-sm" style={{{{ color: "{p['muted']}" }}}}>
        <span className="tpl-display text-lg font-bold" style={{{{ color: "{p['text']}" }}}}>{{v(data, "brandName")}}</span>
        <span>{{v(data, "address")}}</span>
      </div>
    </footer>''',
        "smokePlume": f'''
    <footer className="border-t px-5 py-8 lg:px-8" style={{{{ borderColor: "{p['line']}" }}}}>
      <div className="mx-auto h-px max-w-7xl" style={{{{ background: "linear-gradient(90deg, transparent, {p['primary']}, transparent)" }}}} />
      <div className="mx-auto mt-6 flex max-w-7xl justify-between text-sm" style={{{{ color: "{p['muted']}" }}}}>
        <span className="tpl-display text-lg font-bold" style={{{{ color: "{p['text']}" }}}}>{{v(data, "brandName")}}</span>
        <span>{{v(data, "email")}} · {{v(data, "phone")}}</span>
      </div>
    </footer>''',
        "noodleSwirl": f'''
    <footer className="px-5 py-10 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-2 text-center">
        <div className="tpl-swirl h-8 w-8 rounded-full border-2" style={{{{ borderColor: "{p['primary']}" }}}} />
        <span className="tpl-display text-xl font-bold italic">{{v(data, "brandName")}}</span>
        <span className="text-sm" style={{{{ color: "{p['muted']}" }}}}>{{v(data, "email")}}</span>
      </div>
    </footer>''',
        "sugarCrystal": f'''
    <footer className="border-t px-5 py-10 lg:px-8" style={{{{ borderColor: "{p['line']}" }}}}>
      <div className="mx-auto max-w-5xl text-center">
        <span className="inline-block border px-3 py-1 text-[10px] tracking-[0.3em]" style={{{{ borderColor: "{p['primary']}", color: "{p['primary']}" }}}}>ATELIER</span>
        <p className="tpl-display mt-3 text-3xl font-bold">{{v(data, "brandName")}}</p>
        <p className="mt-2 text-sm" style={{{{ color: "{p['muted']}" }}}}>{{v(data, "phone")}}</p>
      </div>
    </footer>''',
        "citrusBurst": f'''
    <footer className="px-5 py-8 lg:px-8" style={{{{ background: "{p['surface']}" }}}}>
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-3 md:flex-row md:justify-between">
        <span className="tpl-display text-xl font-bold">{{v(data, "brandName")}}</span>
        <div className="flex gap-1">{{[1,2,3,4,5].map((i) => <span key={{i}} className="h-2 w-2 rounded-full" style={{{{ background: "{p['primary']}" }}}} />)}}</div>
        <span className="text-sm" style={{{{ color: "{p['muted']}" }}}}>{{v(data, "email")}}</span>
      </div>
    </footer>''',
    }
    return footers[layout]


def thumbnail_body(t):
    p = t["palette"]
    name = t["name"]
    imgs = t["images"]
    fonts = t["fonts"]["displayCss"]
    niche = t["niche"]
    return f'''<div className="absolute inset-0" style={{{{ background: "{p['bg']}" }}}}>
        <div className="absolute inset-0 opacity-60" style={{{{ backgroundImage: "url({imgs['hero']})", backgroundSize: "cover" }}}} />
        <div className="absolute inset-0" style={{{{ background: "linear-gradient(180deg, transparent, {p['bg']})" }}}} />
        <div className="absolute bottom-8 right-4 left-4">
          <p className="text-[10px] tracking-[0.2em]" style={{{{ color: "{p['primary']}" }}}}>{niche}</p>
          <h3 className="mt-1 text-3xl font-bold" style={{{{ fontFamily: '{fonts}', color: "{p['text']}" }}}}>{name}</h3>
        </div>
      </div>'''


def _page_fn_name(pid: str) -> str:
    return "".join(part.capitalize() for part in pid.replace("-", "_").split("_")) + "Page"


def gen_pages(t):
    p = t["palette"]
    tid = t["id"]
    name = t["name"]
    layout = t["layout"]
    pages = t["pages"]
    pages_arr = "\n".join(
        f'  {{ id: "{pid}", label: "{label}", slug: "{slug}" }},'
        for pid, label, slug in pages
    )
    hero = hero_jsx(t)
    header = header_jsx(t)
    footer = footer_jsx(t)
    sec = LAYOUT_SECTIONS[layout]
    home_defs = paint(sec["home_defs"], p)
    page1_defs = paint(sec["page1_defs"], p)
    page2_defs = paint(sec["page2_defs"], p)
    about_defs = paint(sec["about_defs"], p)
    contact_defs = paint(sec["contact_defs"], p)
    home_bits = "\n      ".join(sec["home_uses"])
    page1_bits = "\n      ".join(sec["page1_uses"])
    page2_bits = "\n      ".join(sec["page2_uses"])
    about_bits = "\n      ".join(sec["about_uses"])
    contact_bits = "\n      ".join(sec["contact_uses"])

    p1_id, p2_id, about_id, contact_id = pages[1][0], pages[2][0], pages[3][0], pages[4][0]
    p1_fn, p2_fn, about_fn, contact_fn = map(_page_fn_name, [p1_id, p2_id, about_id, contact_id])

    page_content_block = "\n".join([
        f'    home: <HomePage data={{merged}} goTo={{goTo}} onCta={{() => goTo("contact")}} />,',
        f'    {p1_id}: <{p1_fn} data={{merged}} goTo={{goTo}} onCta={{() => goTo("contact")}} />,',
        f'    {p2_id}: <{p2_fn} data={{merged}} goTo={{goTo}} onCta={{() => goTo("contact")}} />,',
        f'    {about_id}: <{about_fn} data={{merged}} goTo={{goTo}} onCta={{() => goTo("contact")}} />,',
        f'    {contact_id}: <{contact_fn} data={{merged}} goTo={{goTo}} onCta={{() => goTo("contact")}} />,',
    ])

    return f'''import React, {{ useMemo }} from "react";
import {{ VisualPageStack }} from "../../../../runtime/VisualPageStack";
import {{ {tid}DefaultData }} from "./defaultData";
import {{ {tid}EditorCss }} from "./editorCss";
import {{ useTemplatePageNavigation }} from "../shared/useTemplatePageNavigation";
import {{ Reveal }} from "../shared/Reveal";

export const {tid}Pages = [
{pages_arr}
];

const allowedPages = {tid}Pages.map((p) => p.id);

type Props = {{
  initialPage?: string; initialPageId?: string; page?: string; pageId?: string;
  activePageId?: string; currentPageId?: string; mode?: "preview" | "edit" | "published";
  data?: Record<string, any>; onPageChange?: (pageId: string) => void;
  isPublic?: boolean; viewMode?: string; runtimeMode?: string;
}};

function v(data: Record<string, any>, key: string) {{
  return data?.[key] ?? ({tid}DefaultData as Record<string, any>)[key] ?? "";
}}

function Header({{ data, currentPage, goTo, onCta }}: {{ data: Record<string, any>; currentPage: string; goTo: (id: string) => void; onCta: () => void }}) {{
  const nav = {tid}Pages.map((p) => [p.id, v(data, `nav${{p.id[0].toUpperCase()}}${{p.id.slice(1)}}`) || p.label] as const);
  return ({header}
  );
}}

function Hero({{ data, goTo, onCta }}: {{ data: Record<string, any>; goTo: (id: string) => void; onCta: () => void }}) {{
  return ({hero}
  );
}}

{home_defs}

{page1_defs}

{page2_defs}

{about_defs}

{contact_defs}

function Footer({{ data }}: {{ data: Record<string, any> }}) {{
  return ({footer}
  );
}}

function HomePage({{ data, goTo, onCta }}: {{ data: Record<string, any>; goTo: (id: string) => void; onCta: () => void }}) {{
  return (
    <>
      <Hero data={{data}} goTo={{goTo}} onCta={{onCta}} />
      {home_bits}
      <Footer data={{data}} />
    </>
  );
}}

function {p1_fn}({{ data, goTo, onCta }}: {{ data: Record<string, any>; goTo: (id: string) => void; onCta: () => void }}) {{
  return (
    <>
      {page1_bits}
      <Footer data={{data}} />
    </>
  );
}}

function {p2_fn}({{ data, goTo, onCta }}: {{ data: Record<string, any>; goTo: (id: string) => void; onCta: () => void }}) {{
  return (
    <>
      {page2_bits}
      <Footer data={{data}} />
    </>
  );
}}

function {about_fn}({{ data, goTo, onCta }}: {{ data: Record<string, any>; goTo: (id: string) => void; onCta: () => void }}) {{
  return (
    <>
      {about_bits}
      <Footer data={{data}} />
    </>
  );
}}

function {contact_fn}({{ data, goTo, onCta }}: {{ data: Record<string, any>; goTo: (id: string) => void; onCta: () => void }}) {{
  return (
    <>
      {contact_bits}
      <Footer data={{data}} />
    </>
  );
}}

export default function {name}Pages({{
  initialPage = "home", initialPageId, page, pageId, activePageId, currentPageId,
  mode = "preview", data, onPageChange, isPublic, viewMode, runtimeMode,
}}: Props) {{
  const merged = useMemo(() => ({{ ...{tid}DefaultData, ...(data ?? {{}}) }}), [data]);
  const {{ currentPage, goTo }} = useTemplatePageNavigation(
    {{ page, pageId, initialPage, initialPageId, activePageId, currentPageId, onPageChange, isPublic, viewMode, runtimeMode }},
    {{ allowedPages, fallbackPage: "home" }},
  );
  const pageContent: Record<string, React.ReactNode> = {{
{page_content_block}
  }};
  return (
    <div dir="rtl" data-template-id={{mode === "preview" ? "{tid}-preview" : "{tid}"}} className="min-h-screen w-full overflow-x-hidden"
      style={{{{ background: "{p['bg']}", color: "{p['text']}" }}}}>
      <style dangerouslySetInnerHTML={{{{ __html: {tid}EditorCss }}}} />
      <Header data={{merged}} currentPage={{currentPage}} goTo={{goTo}} onCta={{() => goTo("contact")}} />
      <VisualPageStack activePageId={{currentPage}} pages={{Object.entries(pageContent).map(([id, content]) => ({{ id, content }}))}} />
    </div>
  );
}}
'''


def gen_default_data(t, index):
    nav = "\n".join(
        f'  nav{pid[0].upper() + pid[1:]}: "{_esc(label)}",'
        for pid, label, _ in t["pages"]
    )
    c = t["copy"]
    imgs = t["images"]
    address = CITIES[index % len(CITIES)]
    items_lines = []
    for i, it in enumerate(c["items"], 1):
        key = {1: "a", 2: "b", 3: "c", 4: "d", 5: "e", 6: "f"}[i]
        items_lines.append(
            f'  item{i}Title: "{_esc(it[0])}",\n'
            f'  item{i}Meta: "{_esc(it[1])}",\n'
            f'  item{i}Text: "{_esc(it[2])}",\n'
            f'  item{i}Image: "{imgs[key]}",'
        )
    rev_lines = []
    for i, (text, name, role) in enumerate(c["reviews"], 1):
        rev_lines.append(
            f'  review{i}Text: "{_esc(text)}",\n'
            f'  review{i}Name: "{_esc(name)}",\n'
            f'  review{i}Role: "{_esc(role)}",'
        )
    faq_lines = [f'  faq{i}Q: "{_esc(q)}",\n  faq{i}A: "{_esc(a)}",' for i, (q, a) in enumerate(c["faq"], 1)]
    proc_lines = [f'  process{i}Title: "{_esc(title)}",\n  process{i}Text: "{_esc(text)}",' for i, (title, text) in enumerate(c["processSteps"], 1)]
    cat_lines = [f'  cat{i}Title: "{_esc(title)}",\n  cat{i}Text: "{_esc(text)}",' for i, (title, text) in enumerate(c["categories"], 1)]
    pair_lines = [f'  pair{i}Title: "{_esc(title)}",\n  pair{i}Text: "{_esc(text)}",' for i, (title, text) in enumerate(c["pairings"], 1)]
    tech_lines = [f'  tech{i}Title: "{_esc(title)}",\n  tech{i}Text: "{_esc(text)}",' for i, (title, text) in enumerate(c["techSteps"], 1)]
    mat_lines = [f'  mat{i}Title: "{_esc(title)}",\n  mat{i}Text: "{_esc(text)}",' for i, (title, text) in enumerate(c["materials"], 1)]
    tl_lines = [f'  timeline{i}Year: "{_esc(year)}",\n  timeline{i}Text: "{_esc(text)}",' for i, (year, text) in enumerate(c["timeline"], 1)]
    val_lines = [f'  value{i}Title: "{_esc(title)}",\n  value{i}Text: "{_esc(text)}",' for i, (title, text) in enumerate(c["values"], 1)]

    return f'''export const {t["id"]}DefaultData = {{
  templateId: "{t["id"]}",
  name: "{_esc(t["name"])}",
  brandName: "{_esc(t["brand"])}",
  logoText: "{_esc(t["logo"])}",
{nav}
  heroEyebrow: "{_esc(t["niche"])}",
  heroTitle: "{_esc(c["title"])}",
  heroSubtitle: "{_esc(c["subtitle"])}",
  heroPrimary: "{_esc(c["primary"])}",
  heroSecondary: "{_esc(c["secondary"])}",
  heroImage: "{imgs["hero"]}",
  featuredTitle: "{_esc(c["featuredTitle"])}",
  processTitle: "{_esc(c["processTitle"])}",
{chr(10).join(proc_lines)}
  galleryTitle: "{_esc(c["galleryTitle"])}",
  galleryImage1: "{imgs["gallery1"]}",
  galleryImage2: "{imgs["gallery2"]}",
  galleryImage3: "{imgs["gallery3"]}",
  galleryImage4: "{imgs["gallery4"]}",
  reviewsTitle: "{_esc(c["reviewsTitle"])}",
{chr(10).join(rev_lines)}
  stat1: "{_esc(c["stat1"])}",
  stat1Label: "{_esc(c["stat1Label"])}",
  stat2: "{_esc(c["stat2"])}",
  stat2Label: "{_esc(c["stat2Label"])}",
  stat3: "{_esc(c["stat3"])}",
  stat3Label: "{_esc(c["stat3Label"])}",
  hours: "{_esc(c["hours"])}",
  ctaBandTitle: "{_esc(c["ctaBandTitle"])}",
  ctaBandText: "{_esc(c["ctaBandText"])}",
  page1Title: "{_esc(c["page1Title"])}",
  page1Subtitle: "{_esc(c["page1Subtitle"])}",
  page2Title: "{_esc(c["page2Title"])}",
  page2Subtitle: "{_esc(c["page2Subtitle"])}",
  menuListTitle: "{_esc(c["menuListTitle"])}",
{chr(10).join(cat_lines)}
  pairingTitle: "{_esc(c["pairingTitle"])}",
{chr(10).join(pair_lines)}
  chefPickEyebrow: "{_esc(c["chefPickEyebrow"])}",
  chefPickTitle: "{_esc(c["chefPickTitle"])}",
  chefPickText: "{_esc(c["chefPickText"])}",
  techTitle: "{_esc(c["techTitle"])}",
{chr(10).join(tech_lines)}
  matTitle: "{_esc(c["matTitle"])}",
{chr(10).join(mat_lines)}
  eventsTitle: "{_esc(c["eventsTitle"])}",
  eventsText: "{_esc(c["eventsText"])}",
  eventsMeta: "{_esc(c["eventsMeta"])}",
  aboutEyebrow: "{_esc(c["aboutEyebrow"])}",
  aboutPageTitle: "{_esc(c["aboutPageTitle"])}",
  aboutPageLead: "{_esc(c["aboutPageLead"])}",
  aboutTitle: "{_esc(c["aboutTitle"])}",
  aboutText: "{_esc(c["aboutText"])}",
  aboutImage: "{imgs["c"]}",
  timelineTitle: "{_esc(c["timelineTitle"])}",
{chr(10).join(tl_lines)}
  chefLabel: "{_esc(c["chefLabel"])}",
  chefName: "{_esc(c["chefName"])}",
  chefBio: "{_esc(c["chefBio"])}",
  chefQuote: "{_esc(c["chefQuote"])}",
  chefImage: "{imgs["chef"]}",
{chr(10).join(val_lines)}
  contactEyebrow: "{_esc(c["contactEyebrow"])}",
  contactPageTitle: "{_esc(c["contactPageTitle"])}",
  contactPageText: "{_esc(c["contactPageText"])}",
  contactTitle: "{_esc(c["contactTitle"])}",
  contactText: "{_esc(c["contactText"])}",
  hoursTitle: "{_esc(c["hoursTitle"])}",
  mapLabel: "{_esc(c["mapLabel"])}",
  faqTitle: "{_esc(c["faqTitle"])}",
{chr(10).join(faq_lines)}
  cta: "{_esc(c["primary"])}",
  phone: "03-555-{2000 + index}",
  email: "hello@{t["id"]}.co.il",
  address: "{address}",
{chr(10).join(items_lines)}
}};
'''


def gen_editor_css(t):
    p = t["palette"]
    tid = t["id"]
    extra = EXTRA_CSS[t["layout"]].format(
        tid=tid, primary=p["primary"], muted=p["muted"], bg=p["bg"],
        surface=p["surface"], text=p["text"], dark=p["dark"], line=p["line"],
    )
    return f'''export const {tid}EditorCss = `
@import url("https://fonts.googleapis.com/css2?family={t["fonts"]["display"]}&family=Heebo:wght@400;500;700&display=swap");

[data-template-id="{tid}"], [data-template-id="{tid}-preview"] {{
  direction: rtl; text-align: right;
  font-family: "Heebo", Heebo, sans-serif;
  --tpl-bg: {p["bg"]}; --tpl-surface: {p["surface"]}; --tpl-text: {p["text"]};
  --tpl-muted: {p["muted"]}; --tpl-primary: {p["primary"]}; --tpl-primary-text: {p["primaryText"]};
  --tpl-line: {p["line"]}; --tpl-dark: {p["dark"]};
}}

[data-template-id="{tid}"] .tpl-display,
[data-template-id="{tid}-preview"] .tpl-display {{
  font-family: {t["fonts"]["displayCss"]}, "Heebo", serif;
}}

[data-visual-template-canvas="true"] [data-template-id="{tid}"] > header {{
  position: sticky !important; top: 0 !important; z-index: 50 !important;
}}

@keyframes {tid}-ken {{ 0% {{ transform: scale(1); }} 100% {{ transform: scale(1.08); }} }}
@keyframes {tid}-rise {{ from {{ opacity: 0; transform: translateY(28px); }} to {{ opacity: 1; transform: translateY(0); }} }}

[data-template-id="{tid}"] .tpl-ken, [data-template-id="{tid}-preview"] .tpl-ken {{
  animation: {tid}-ken 18s ease-in-out infinite alternate; transform-origin: center;
}}
[data-template-id="{tid}"] .tpl-rise, [data-template-id="{tid}-preview"] .tpl-rise {{
  animation: {tid}-rise .9s cubic-bezier(.22,1,.36,1) both;
}}
[data-template-id="{tid}"] .tpl-rise-2, [data-template-id="{tid}-preview"] .tpl-rise-2 {{
  animation: {tid}-rise .9s cubic-bezier(.22,1,.36,1) .12s both;
}}
[data-template-id="{tid}"] .tpl-rise-3, [data-template-id="{tid}-preview"] .tpl-rise-3 {{
  animation: {tid}-rise .9s cubic-bezier(.22,1,.36,1) .24s both;
}}
{extra}
`;
'''


def gen_thumbnail(t):
    return f'''import React from "react";
export default function {t["name"]}Thumbnail() {{
  return (
    <div dir="rtl" className="relative h-full min-h-[260px] w-full overflow-hidden">
      {thumbnail_body(t)}
    </div>
  );
}}
'''


def gen_preview(t):
    p = t["palette"]
    return f'''import React from "react";
import {t["name"]}Pages from "./pages";
export default function {t["name"]}Preview() {{
  return (
    <div dir="rtl" data-template-id="{t["id"]}-preview" className="min-h-screen w-full" style={{{{ background: "{p['bg']}", color: "{p['text']}" }}}}>
      <{t["name"]}Pages initialPage="home" mode="preview" />
    </div>
  );
}}
'''


def gen_schema(t):
    tid = t["id"]
    return (
        f'export const {tid}Schema = {{\n'
        f'  id: "{tid}",\n'
        '  fields: [\n'
        '    { key: "brandName", label: "שם המותג", type: "text" },\n'
        '    { key: "heroTitle", label: "כותרת ראשית", type: "text" },\n'
        '    { key: "heroSubtitle", label: "תת כותרת", type: "textarea" },\n'
        '    { key: "heroImage", label: "תמונת הירו", type: "image" },\n'
        '    { key: "cta", label: "טקסט כפתור", type: "text" },\n'
        '    { key: "phone", label: "טלפון", type: "text" },\n'
        '    { key: "email", label: "אימייל", type: "text" },\n'
        '  ],\n'
        '};\n'
    )


def gen_meta(t):
    p = t["palette"]
    name = t["name"]
    tid = t["id"]
    blocks = ",\n    ".join(
        f'{{ type: "{btype}", variant: "{variant}", title: "{title}" }}'
        for btype, variant, title in META_BLOCKS[t["layout"]]
    )
    desc = _esc(t["desc"])
    niche = _esc(t["niche"])
    return f"""import React from "react";
import type {{ ReadyWebsitePalette, ReadyWebsiteTemplateSeed }} from "../../readyWebsiteTypes";
import type {{ StudioTemplateDefinition }} from "../types";
import {name}Pages, {{ {tid}Pages }} from "./pages";
import {name}Preview from "./preview";
import {name}Thumbnail from "./thumbnail";
import {{ {tid}EditorCss }} from "./editorCss";
import {{ {tid}Schema }} from "./schema";
import {{ {tid}DefaultData }} from "./defaultData";

const palette: ReadyWebsitePalette = {{
  primary: "{p['primary']}", secondary: "{p['muted']}", accent: "{p['primary']}",
  background: "{p['bg']}", surface: "{p['surface']}", text: "{p['text']}", muted: "{p['muted']}", dark: "{p['dark']}",
}};

export const {tid}Seed = {{
  id: "{tid}", key: "{tid}", name: "{name}", title: "{name}",
  description: "{desc}",
  category: "food", categoryLabel: "אוכל ומסעדות", niche: "{niche}", layout: "full",
  image: ({tid}DefaultData as any).heroImage,
  heroTitle: ({tid}DefaultData as any).heroTitle,
  heroSubtitle: ({tid}DefaultData as any).heroSubtitle,
  palette,
  blocks: [
    {blocks},
  ].map((b, i) => ({{ id: `{tid}-${{i+1}}-${{b.type}}`, ...b }})),
  pages: {tid}Pages,
  editor: {{ pages: {tid}Pages, css: {tid}EditorCss }},
  css: {tid}EditorCss, data: {tid}DefaultData, defaultData: {tid}DefaultData,
}} as unknown as ReadyWebsiteTemplateSeed;

export const {tid}Template = {{
  id: "{tid}", key: "{tid}", name: "{name}", title: "{name}", author: "Bizuply", priceLabel: "כלול",
  category: "food", categoryLabel: "אוכל ומסעדות", badge: "חדש",
  description: "{desc}",
  thumbnail: React.createElement({name}Thumbnail),
  preview: React.createElement({name}Preview),
  component: {name}Pages, Component: {name}Pages,
  seed: {tid}Seed, pages: {tid}Pages, editorCss: {tid}EditorCss, schema: {tid}Schema, defaultData: {tid}DefaultData,
  renderer: {{
    key: "{tid}", name: "{name}", Component: {name}Pages, component: {name}Pages, pages: {tid}Pages,
    editorMode: "visual-react", editorCss: {tid}EditorCss, schema: {tid}Schema, defaultData: {tid}DefaultData,
  }},
}} as unknown as StudioTemplateDefinition;

export default {tid}Template;
"""


def main():
    templates = json.loads(CONFIG.read_text(encoding="utf-8"))
    assert len(templates) == 13
    created = []
    existing = {
        "emberplate", "noodlix", "crustora", "mezzaline", "sushisen",
        "brunchhaus", "tapasora", "spiceforge", "vineria", "streetbite",
    }
    for i, t in enumerate(templates):
        if t["id"] in existing:
            raise SystemExit(f"refusing to overwrite existing food template: {t['id']}")
        d = ROOT / t["id"]
        d.mkdir(parents=True, exist_ok=True)
        (d / "defaultData.ts").write_text(gen_default_data(t, i), encoding="utf-8")
        (d / "editorCss.ts").write_text(gen_editor_css(t), encoding="utf-8")
        (d / "pages.tsx").write_text(gen_pages(t), encoding="utf-8")
        (d / "thumbnail.tsx").write_text(gen_thumbnail(t), encoding="utf-8")
        (d / "preview.tsx").write_text(gen_preview(t), encoding="utf-8")
        (d / "schema.ts").write_text(gen_schema(t), encoding="utf-8")
        (d / "meta.ts").write_text(gen_meta(t), encoding="utf-8")
        created.append(t["id"])
        print("ok", t["id"], t["layout"], "pages.tsx lines", len((d / "pages.tsx").read_text().splitlines()))
    print("done", len(created), created)
    return created


if __name__ == "__main__":
    main()
