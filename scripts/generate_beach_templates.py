#!/usr/bin/env python3
"""Regenerate 10 beach/sand travel templates with distinct layouts + motion CSS."""
from __future__ import annotations

import json
from pathlib import Path

ROOT = Path("src/components/site-builder/studio/data/templates")
CONFIG = Path("scripts/beach-templates-config.json")

META_BLOCKS = {
    "duneParallax": [
        ("header", "dune-nav", "Dune nav"),
        ("hero", "parallax-dunes-wave", "Parallax dunes hero"),
        ("listings", "horizontal-villa-rail", "Villa cards rail"),
        ("stats", "sand-sunset-stats", "Sand stats band"),
        ("about", "resort-story", "Resort story"),
        ("contact", "booking-form", "Booking form"),
        ("footer", "minimal", "Footer"),
    ],
    "underwaterGlass": [
        ("header", "deep-nav", "Deep nav"),
        ("hero", "bubble-depth", "Underwater bubble hero"),
        ("services", "glass-cards", "Glass morphism cards"),
        ("timeline", "depth-timeline", "Depth timeline"),
        ("about", "dive-school", "Dive school"),
        ("contact", "signup-form", "Signup form"),
        ("footer", "minimal", "Footer"),
    ],
    "splitSunset": [
        ("header", "club-nav", "Club nav"),
        ("hero", "split-shimmer", "Split sunset hero"),
        ("marquee", "dj-marquee", "DJ marquee"),
        ("events", "cocktail-cards", "Event cards"),
        ("about", "club-story", "Club story"),
        ("contact", "table-booking", "Table booking"),
        ("footer", "minimal", "Footer"),
    ],
    "surfRail": [
        ("header", "surf-nav", "Surf nav"),
        ("hero", "tide-line", "Tide line hero"),
        ("products", "board-rail", "Surfboard rail"),
        ("forecast", "wave-chart", "Wave forecast"),
        ("about", "shop-story", "Shop story"),
        ("contact", "rental-form", "Rental form"),
        ("footer", "minimal", "Footer"),
    ],
    "heatShimmer": [
        ("header", "desert-nav", "Desert nav"),
        ("hero", "heat-shimmer", "Heat shimmer hero"),
        ("suites", "oasis-temp-bands", "Oasis temperature cards"),
        ("wellness", "mirage-band", "Wellness band"),
        ("about", "resort-story", "Resort story"),
        ("contact", "booking-form", "Booking form"),
        ("footer", "minimal", "Footer"),
    ],
    "organicWood": [
        ("header", "wood-nav", "Wood nav"),
        ("hero", "organic-drift", "Organic wood hero"),
        ("menu", "horizontal-menu-scroll", "Menu scroll"),
        ("chef", "story-overlap", "Chef story"),
        ("about", "beach-dining", "Beach dining"),
        ("contact", "reservation-form", "Reservation"),
        ("footer", "minimal", "Footer"),
    ],
    "minimalRipple": [
        ("header", "yacht-nav", "Yacht nav"),
        ("hero", "horizon-ripple", "Horizon ripple hero"),
        ("routes", "route-dots", "Route dots"),
        ("fleet", "vessel-specs", "Vessel specs"),
        ("about", "sailing-story", "Sailing story"),
        ("contact", "charter-form", "Charter form"),
        ("footer", "minimal", "Footer"),
    ],
    "tropicalPetal": [
        ("header", "spa-nav", "Spa nav"),
        ("hero", "petal-fall", "Petal fall hero"),
        ("treatments", "carousel-cards", "Treatment carousel"),
        ("garden", "tropical-garden", "Garden band"),
        ("about", "spa-story", "Spa story"),
        ("contact", "treatment-booking", "Treatment booking"),
        ("footer", "minimal", "Footer"),
    ],
    "coastalIndustrial": [
        ("header", "forge-nav", "Forge nav"),
        ("hero", "grain-grit", "Grain grit hero"),
        ("shop", "masonry-grid", "Masonry product grid"),
        ("craft", "forge-steps", "Craft steps"),
        ("about", "artisan-story", "Artisan story"),
        ("contact", "wholesale-form", "Wholesale form"),
        ("footer", "minimal", "Footer"),
    ],
    "panoramaCarousel": [
        ("header", "photo-nav", "Photo nav"),
        ("hero", "panorama-slide", "Panorama carousel hero"),
        ("gallery", "zoom-grid", "Gallery zoom grid"),
        ("tours", "package-cards", "Tour packages"),
        ("about", "photographer-story", "Photographer story"),
        ("contact", "tour-booking", "Tour booking"),
        ("footer", "minimal", "Footer"),
    ],
}

EXTRA_CSS = {
    "duneParallax": """
@keyframes {tid}-dune-shift {{ 0% {{ transform: translateY(0); }} 100% {{ transform: translateY(-18px); }} }}
[data-template-id="{tid}"] .tpl-dune-back, [data-template-id="{tid}-preview"] .tpl-dune-back {{
  animation: {tid}-dune-shift 14s ease-in-out infinite alternate;
}}
[data-template-id="{tid}"] .tpl-dune-mid, [data-template-id="{tid}-preview"] .tpl-dune-mid {{
  animation: {tid}-dune-shift 10s ease-in-out infinite alternate-reverse;
}}
[data-template-id="{tid}"] .tpl-villa-rail, [data-template-id="{tid}-preview"] .tpl-villa-rail {{
  display: flex; gap: 1.25rem; overflow-x: auto; scroll-snap-type: x mandatory; padding-bottom: .5rem;
}}
[data-template-id="{tid}"] .tpl-villa-rail > *, [data-template-id="{tid}-preview"] .tpl-villa-rail > * {{
  scroll-snap-align: start; flex: 0 0 min(320px, 85vw);
}}""",
    "underwaterGlass": """
@keyframes {tid}-bubble-rise {{ 0% {{ transform: translateY(0) scale(1); opacity: .55; }} 100% {{ transform: translateY(-120vh) scale(1.2); opacity: 0; }} }}
[data-template-id="{tid}"] .tpl-bubble, [data-template-id="{tid}-preview"] .tpl-bubble {{
  animation: {tid}-bubble-rise var(--bubble-dur, 8s) ease-in infinite;
}}
[data-template-id="{tid}"] .tpl-glass, [data-template-id="{tid}-preview"] .tpl-glass {{
  backdrop-filter: blur(16px); background: rgba(255,255,255,.08); border: 1px solid rgba(255,255,255,.14);
}}""",
    "splitSunset": """
@keyframes {tid}-shimmer {{ 0% {{ transform: translateX(-100%) skewX(-12deg); }} 100% {{ transform: translateX(200%) skewX(-12deg); }} }}
[data-template-id="{tid}"] .tpl-shimmer, [data-template-id="{tid}-preview"] .tpl-shimmer {{ position: relative; overflow: hidden; }}
[data-template-id="{tid}"] .tpl-shimmer::after, [data-template-id="{tid}-preview"] .tpl-shimmer::after {{
  content: ""; position: absolute; inset: 0; pointer-events: none;
  background: linear-gradient(90deg, transparent, rgba(255,180,80,.35), transparent);
  animation: {tid}-shimmer 3.2s ease-in-out infinite;
}}""",
    "surfRail": """
@keyframes {tid}-tide {{ 0%,100% {{ transform: translateX(0); }} 50% {{ transform: translateX(-12px); }} }}
@keyframes {tid}-board-tilt {{ 0%,100% {{ transform: rotate(-2deg); }} 50% {{ transform: rotate(2deg); }} }}
[data-template-id="{tid}"] .tpl-tide-line, [data-template-id="{tid}-preview"] .tpl-tide-line {{
  animation: {tid}-tide 4s ease-in-out infinite;
}}
[data-template-id="{tid}"] .tpl-board-rail, [data-template-id="{tid}-preview"] .tpl-board-rail {{
  display: flex; gap: 1rem; overflow-x: auto; scroll-snap-type: x mandatory;
}}
[data-template-id="{tid}"] .tpl-board-card, [data-template-id="{tid}-preview"] .tpl-board-card {{
  scroll-snap-align: center; flex: 0 0 min(280px, 80vw);
  animation: {tid}-board-tilt 5s ease-in-out infinite;
}}""",
    "heatShimmer": """
@keyframes {tid}-shimmer-wobble {{ 0%,100% {{ transform: skewY(0deg) scaleY(1); opacity: .35; }} 50% {{ transform: skewY(1.2deg) scaleY(1.02); opacity: .55; }} }}
[data-template-id="{tid}"] .tpl-shimmer-wobble, [data-template-id="{tid}-preview"] .tpl-shimmer-wobble {{
  animation: {tid}-shimmer-wobble 2.8s ease-in-out infinite;
}}
[data-template-id="{tid}"] .tpl-temp-band, [data-template-id="{tid}-preview"] .tpl-temp-band {{
  height: 4px; border-radius: 999px;
}}""",
    "organicWood": """
@keyframes {tid}-organic-float {{ 0%,100% {{ transform: translate(0,0) rotate(0deg); }} 50% {{ transform: translate(8px,-12px) rotate(4deg); }} }}
[data-template-id="{tid}"] .tpl-organic, [data-template-id="{tid}-preview"] .tpl-organic {{
  animation: {tid}-organic-float 7s ease-in-out infinite;
}}
[data-template-id="{tid}"] .tpl-menu-scroll, [data-template-id="{tid}-preview"] .tpl-menu-scroll {{
  display: flex; gap: 1rem; overflow-x: auto; scroll-snap-type: x mandatory;
}}""",
    "minimalRipple": """
@keyframes {tid}-ripple {{ 0% {{ transform: scale(.6); opacity: .7; }} 100% {{ transform: scale(2.4); opacity: 0; }} }}
[data-template-id="{tid}"] .tpl-ripple, [data-template-id="{tid}-preview"] .tpl-ripple {{
  animation: {tid}-ripple 3.5s ease-out infinite;
}}
[data-template-id="{tid}"] .tpl-horizon, [data-template-id="{tid}-preview"] .tpl-horizon {{
  height: 1px; width: 100%;
}}""",
    "tropicalPetal": """
@keyframes {tid}-petal-fall {{ 0% {{ transform: translateY(-10%) rotate(0deg); opacity: .9; }} 100% {{ transform: translateY(110vh) rotate(360deg); opacity: .2; }} }}
[data-template-id="{tid}"] .tpl-petal, [data-template-id="{tid}-preview"] .tpl-petal {{
  animation: {tid}-petal-fall var(--petal-dur, 9s) linear infinite;
}}
[data-template-id="{tid}"] .tpl-carousel-track, [data-template-id="{tid}-preview"] .tpl-carousel-track {{
  display: flex; gap: 1rem; overflow-x: auto; scroll-snap-type: x mandatory;
}}""",
    "coastalIndustrial": """
@keyframes {tid}-grain-sweep {{ 0% {{ transform: translate(0,0); }} 100% {{ transform: translate(-20%,-10%); }} }}
[data-template-id="{tid}"] .tpl-grain, [data-template-id="{tid}-preview"] .tpl-grain {{
  pointer-events: none; position: absolute; inset: -50%;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E");
  opacity: .18; animation: {tid}-grain-sweep 6s steps(4) infinite;
}}
[data-template-id="{tid}"] .tpl-masonry, [data-template-id="{tid}-preview"] .tpl-masonry {{
  columns: 2; column-gap: 1rem;
}}
@media (min-width: 768px) {{
  [data-template-id="{tid}"] .tpl-masonry, [data-template-id="{tid}-preview"] .tpl-masonry {{ columns: 3; }}
}}""",
    "panoramaCarousel": """
@keyframes {tid}-pan-slide {{ 0% {{ transform: translateX(0); }} 33% {{ transform: translateX(0); }} 38% {{ transform: translateX(-33.333%); }} 71% {{ transform: translateX(-33.333%); }} 76% {{ transform: translateX(-66.666%); }} 100% {{ transform: translateX(-66.666%); }} }}
[data-template-id="{tid}"] .tpl-pan-track, [data-template-id="{tid}-preview"] .tpl-pan-track {{
  display: flex; width: 300%; animation: {tid}-pan-slide 18s ease-in-out infinite;
}}
[data-template-id="{tid}"] .tpl-pan-panel, [data-template-id="{tid}-preview"] .tpl-pan-panel {{
  flex: 0 0 33.333%; min-height: 72vh;
}}
[data-template-id="{tid}"] .tpl-gallery-zoom img, [data-template-id="{tid}-preview"] .tpl-gallery-zoom img {{
  transition: transform .6s cubic-bezier(.22,1,.36,1);
}}
[data-template-id="{tid}"] .tpl-gallery-zoom:hover img, [data-template-id="{tid}-preview"] .tpl-gallery-zoom:hover img {{
  transform: scale(1.08);
}}""",
}


def hero_jsx(t):
    p = t["palette"]
    secondary = t["pages"][1][0]
    layout = t["layout"]
    imgs = t["images"]

    if layout == "duneParallax":
        return f'''
      <section className="relative isolate min-h-[92vh] overflow-hidden">
        <img src={{v(data, "heroImage")}} alt="" className="tpl-ken absolute inset-0 h-full w-full object-cover" />
        <div className="tpl-dune-back absolute inset-x-0 bottom-0 h-[45%]" style={{{{ background: "linear-gradient(180deg, transparent, {p['primary']}44 40%, {p['bg']}cc 100%)" }}}} />
        <div className="tpl-dune-mid absolute inset-x-0 bottom-0 h-[28%]" style={{{{ background: "linear-gradient(180deg, transparent, {p['surface']}aa)" }}}} />
        <div className="relative z-10 mx-auto flex min-h-[92vh] max-w-7xl flex-col justify-center px-5 pt-28 lg:px-8">
          <p className="tpl-rise text-xs font-semibold tracking-[0.28em]" style={{{{ color: "{p['primary']}" }}}}>{{v(data, "heroEyebrow")}}</p>
          <h1 className="tpl-display tpl-rise-2 mt-4 max-w-4xl text-6xl font-bold leading-[0.92] md:text-8xl">{{v(data, "heroTitle")}}</h1>
          <p className="tpl-rise-3 mt-6 max-w-xl text-lg leading-8" style={{{{ color: "{p['muted']}" }}}}>{{v(data, "heroSubtitle")}}</p>
          <div className="tpl-rise-3 mt-8 flex flex-wrap gap-3">
            <button type="button" onClick={{onCta}} className="px-7 py-3.5 text-sm font-bold" style={{{{ background: "{p['primary']}", color: "{p['primaryText']}" }}}}>{{v(data, "heroPrimary")}}</button>
            <button type="button" onClick={{() => goTo("{secondary}")}} className="border px-7 py-3.5 text-sm font-semibold" style={{{{ borderColor: "{p['line']}" }}}}>{{v(data, "heroSecondary")}}</button>
          </div>
        </div>
        <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 1440 120" preserveAspectRatio="none" aria-hidden="true">
          <path fill="{p['bg']}" d="M0,64 C360,120 720,0 1080,48 C1260,72 1380,96 1440,80 L1440,120 L0,120 Z" />
        </svg>
      </section>'''

    if layout == "underwaterGlass":
        return f'''
      <section className="relative isolate min-h-[92vh] overflow-hidden" style={{{{ background: "linear-gradient(180deg, {p['dark']} 0%, {p['bg']} 55%, {p['surface']} 100%)" }}}}>
        {{Array.from({{ length: 12 }}).map((_, i) => (
          <div key={{i}} className="tpl-bubble absolute rounded-full border" style={{{{ left: `${{8 + i * 7}}%`, bottom: `-5%`, width: `${{12 + (i % 4) * 8}}px`, height: `${{12 + (i % 4) * 8}}px`, borderColor: "{p['line']}", animationDelay: `${{i * 0.7}}s`, ["--bubble-dur" as string]: `${{7 + (i % 5)}}s` }}}} />
        ))}}
        <div className="relative z-10 mx-auto flex min-h-[92vh] max-w-7xl flex-col justify-center px-5 pt-28 lg:px-8">
          <p className="tpl-rise text-xs font-semibold tracking-[0.28em]" style={{{{ color: "{p['primary']}" }}}}>{{v(data, "heroEyebrow")}}</p>
          <h1 className="tpl-display tpl-rise-2 mt-4 max-w-4xl text-6xl font-bold leading-[0.92] md:text-8xl">{{v(data, "heroTitle")}}</h1>
          <p className="tpl-rise-3 mt-6 max-w-xl text-lg leading-8" style={{{{ color: "{p['muted']}" }}}}>{{v(data, "heroSubtitle")}}</p>
          <div className="tpl-rise-3 mt-8 flex flex-wrap gap-3">
            <button type="button" onClick={{onCta}} className="px-7 py-3.5 text-sm font-bold" style={{{{ background: "{p['primary']}", color: "{p['primaryText']}" }}}}>{{v(data, "heroPrimary")}}</button>
            <button type="button" onClick={{() => goTo("{secondary}")}} className="border px-7 py-3.5 text-sm font-semibold" style={{{{ borderColor: "{p['line']}" }}}}>{{v(data, "heroSecondary")}}</button>
          </div>
        </div>
      </section>'''

    if layout == "splitSunset":
        return f'''
      <section className="grid min-h-[88vh] lg:grid-cols-2">
        <div className="flex flex-col justify-center px-5 py-16 lg:px-12 lg:py-24" style={{{{ background: "{p['bg']}" }}}}>
          <p className="tpl-rise text-xs font-semibold tracking-[0.28em]" style={{{{ color: "{p['primary']}" }}}}>{{v(data, "heroEyebrow")}}</p>
          <h1 className="tpl-display tpl-rise-2 mt-4 text-6xl font-bold leading-[0.92] md:text-7xl">{{v(data, "heroTitle")}}</h1>
          <p className="tpl-rise-3 mt-6 max-w-xl text-lg leading-8" style={{{{ color: "{p['muted']}" }}}}>{{v(data, "heroSubtitle")}}</p>
          <div className="tpl-rise-3 mt-8 flex flex-wrap gap-3">
            <button type="button" onClick={{onCta}} className="px-7 py-3.5 text-sm font-bold" style={{{{ background: "{p['primary']}", color: "{p['primaryText']}" }}}}>{{v(data, "heroPrimary")}}</button>
            <button type="button" onClick={{() => goTo("{secondary}")}} className="border px-7 py-3.5 text-sm font-semibold" style={{{{ borderColor: "{p['line']}" }}}}>{{v(data, "heroSecondary")}}</button>
          </div>
        </div>
        <div className="tpl-shimmer relative min-h-[44vh] overflow-hidden lg:min-h-[88vh]">
          <img src={{v(data, "heroImage")}} alt="" className="tpl-ken h-full w-full object-cover" />
          <div className="absolute inset-0" style={{{{ background: "linear-gradient(135deg, {p['primary']}33, transparent 60%)" }}}} />
        </div>
      </section>'''

    if layout == "surfRail":
        return f'''
      <section className="relative min-h-[88vh] overflow-hidden">
        <img src={{v(data, "heroImage")}} alt="" className="tpl-ken absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0" style={{{{ background: "linear-gradient(180deg, {p['bg']}88, {p['bg']}ee 70%)" }}}} />
        <div className="tpl-tide-line absolute inset-x-0 top-[58%] h-[3px]" style={{{{ background: "repeating-linear-gradient(90deg, {p['primary']}, {p['primary']} 12px, transparent 12px, transparent 24px)" }}}} />
        <div className="relative z-10 mx-auto flex min-h-[88vh] max-w-7xl flex-col justify-center px-5 pt-24 lg:px-8">
          <p className="tpl-rise text-xs font-semibold tracking-[0.28em]" style={{{{ color: "{p['primary']}" }}}}>{{v(data, "heroEyebrow")}}</p>
          <h1 className="tpl-display tpl-rise-2 mt-4 max-w-4xl text-6xl font-bold leading-[0.92] md:text-7xl">{{v(data, "heroTitle")}}</h1>
          <p className="tpl-rise-3 mt-6 max-w-xl text-lg leading-8" style={{{{ color: "{p['muted']}" }}}}>{{v(data, "heroSubtitle")}}</p>
          <div className="tpl-rise-3 mt-8 flex flex-wrap gap-3">
            <button type="button" onClick={{onCta}} className="px-7 py-3.5 text-sm font-bold" style={{{{ background: "{p['primary']}", color: "{p['primaryText']}" }}}}>{{v(data, "heroPrimary")}}</button>
            <button type="button" onClick={{() => goTo("{secondary}")}} className="border px-7 py-3.5 text-sm font-semibold" style={{{{ borderColor: "{p['line']}" }}}}>{{v(data, "heroSecondary")}}</button>
          </div>
        </div>
      </section>'''

    if layout == "heatShimmer":
        return f'''
      <section className="relative isolate min-h-[90vh] overflow-hidden">
        <div className="tpl-shimmer-wobble absolute inset-0">
          <img src={{v(data, "heroImage")}} alt="" className="tpl-ken h-full w-full object-cover" />
        </div>
        <div className="absolute inset-0" style={{{{ background: "linear-gradient(180deg, {p['bg']}55 20%, {p['bg']}ee 85%)" }}}} />
        <div className="relative z-10 mx-auto flex min-h-[90vh] max-w-7xl flex-col justify-end px-5 pb-16 pt-28 lg:px-8">
          <p className="tpl-rise text-xs font-semibold tracking-[0.28em]" style={{{{ color: "{p['primary']}" }}}}>{{v(data, "heroEyebrow")}}</p>
          <h1 className="tpl-display tpl-rise-2 mt-4 max-w-4xl text-6xl font-bold leading-[0.92] md:text-8xl">{{v(data, "heroTitle")}}</h1>
          <p className="tpl-rise-3 mt-6 max-w-xl text-lg leading-8" style={{{{ color: "{p['muted']}" }}}}>{{v(data, "heroSubtitle")}}</p>
          <div className="tpl-rise-3 mt-8 flex flex-wrap gap-3">
            <button type="button" onClick={{onCta}} className="px-7 py-3.5 text-sm font-bold" style={{{{ background: "{p['primary']}", color: "{p['primaryText']}" }}}}>{{v(data, "heroPrimary")}}</button>
            <button type="button" onClick={{() => goTo("{secondary}")}} className="border px-7 py-3.5 text-sm font-semibold" style={{{{ borderColor: "{p['line']}" }}}}>{{v(data, "heroSecondary")}}</button>
          </div>
        </div>
      </section>'''

    if layout == "organicWood":
        return f'''
      <section className="relative overflow-hidden px-5 py-16 lg:px-8 lg:py-24" style={{{{ background: "{p['bg']}" }}}}>
        {{[["18%","12%","120px"],["72%","22%","80px"],["45%","68%","100px"]].map(([l,t,s], i) => (
          <div key={{i}} className="tpl-organic pointer-events-none absolute rounded-[40%_60%_55%_45%]" style={{{{ left: l, top: t, width: s, height: s, background: "{p['primary']}22", animationDelay: `${{i * 0.8}}s` }}}} />
        ))}}
        <div className="relative z-10 mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p className="tpl-rise text-xs font-semibold tracking-[0.28em]" style={{{{ color: "{p['primary']}" }}}}>{{v(data, "heroEyebrow")}}</p>
            <h1 className="tpl-display tpl-rise-2 mt-4 text-6xl font-bold leading-[0.95] md:text-7xl">{{v(data, "heroTitle")}}</h1>
            <p className="tpl-rise-3 mt-6 max-w-xl text-lg leading-8" style={{{{ color: "{p['muted']}" }}}}>{{v(data, "heroSubtitle")}}</p>
            <div className="tpl-rise-3 mt-8 flex flex-wrap gap-3">
              <button type="button" onClick={{onCta}} className="px-7 py-3.5 text-sm font-bold" style={{{{ background: "{p['primary']}", color: "{p['primaryText']}" }}}}>{{v(data, "heroPrimary")}}</button>
              <button type="button" onClick={{() => goTo("{secondary}")}} className="border px-7 py-3.5 text-sm font-semibold" style={{{{ borderColor: "{p['line']}" }}}}>{{v(data, "heroSecondary")}}</button>
            </div>
          </div>
          <div className="overflow-hidden border" style={{{{ borderColor: "{p['line']}" }}}}>
            <img src={{v(data, "heroImage")}} alt="" className="tpl-ken aspect-[4/5] w-full object-cover" />
          </div>
        </div>
      </section>'''

    if layout == "minimalRipple":
        return f'''
      <section className="relative overflow-hidden px-5 py-20 lg:px-8 lg:py-28" style={{{{ background: "{p['bg']}" }}}}>
        <div className="mx-auto max-w-4xl text-center">
          <p className="tpl-rise text-xs font-semibold tracking-[0.34em]" style={{{{ color: "{p['primary']}" }}}}>{{v(data, "heroEyebrow")}}</p>
          <h1 className="tpl-display tpl-rise-2 mt-6 text-5xl font-bold leading-[1.02] md:text-7xl">{{v(data, "heroTitle")}}</h1>
          <p className="tpl-rise-3 mx-auto mt-6 max-w-xl text-lg leading-8" style={{{{ color: "{p['muted']}" }}}}>{{v(data, "heroSubtitle")}}</p>
          <div className="tpl-rise-3 mt-8 flex flex-wrap justify-center gap-3">
            <button type="button" onClick={{onCta}} className="px-7 py-3.5 text-sm font-bold" style={{{{ background: "{p['primary']}", color: "{p['primaryText']}" }}}}>{{v(data, "heroPrimary")}}</button>
            <button type="button" onClick={{() => goTo("{secondary}")}} className="border px-7 py-3.5 text-sm font-semibold" style={{{{ borderColor: "{p['line']}" }}}}>{{v(data, "heroSecondary")}}</button>
          </div>
        </div>
        <div className="relative mx-auto mt-16 max-w-3xl">
          <div className="tpl-horizon" style={{{{ background: "{p['primary']}" }}}} />
          {{[0, 1, 2].map((i) => (
            <div key={{i}} className="tpl-ripple absolute left-1/2 top-1/2 rounded-full border-2" style={{{{ width: "80px", height: "80px", marginLeft: "-40px", marginTop: "-40px", borderColor: "{p['primary']}", animationDelay: `${{i * 1.1}}s` }}}} />
          ))}}
          <img src={{v(data, "heroImage")}} alt="" className="tpl-ken mt-8 aspect-[21/9] w-full object-cover" />
        </div>
      </section>'''

    if layout == "tropicalPetal":
        return f'''
      <section className="relative isolate min-h-[88vh] overflow-hidden">
        <img src={{v(data, "heroImage")}} alt="" className="tpl-ken absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0" style={{{{ background: "linear-gradient(180deg, {p['bg']}44, {p['bg']}cc 75%)" }}}} />
        {{Array.from({{ length: 14 }}).map((_, i) => (
          <div key={{i}} className="tpl-petal pointer-events-none absolute h-3 w-3 rounded-full" style={{{{ left: `${{4 + i * 6.5}}%`, top: `-2%`, background: "{p['primary']}", animationDelay: `${{i * 0.55}}s`, ["--petal-dur" as string]: `${{8 + (i % 4)}}s` }}}} />
        ))}}
        <div className="relative z-10 mx-auto flex min-h-[88vh] max-w-7xl flex-col justify-center px-5 pt-24 lg:px-8">
          <p className="tpl-rise text-xs font-semibold tracking-[0.28em]" style={{{{ color: "{p['primary']}" }}}}>{{v(data, "heroEyebrow")}}</p>
          <h1 className="tpl-display tpl-rise-2 mt-4 max-w-4xl text-6xl font-bold leading-[0.92] md:text-7xl">{{v(data, "heroTitle")}}</h1>
          <p className="tpl-rise-3 mt-6 max-w-xl text-lg leading-8" style={{{{ color: "{p['muted']}" }}}}>{{v(data, "heroSubtitle")}}</p>
          <div className="tpl-rise-3 mt-8 flex flex-wrap gap-3">
            <button type="button" onClick={{onCta}} className="px-7 py-3.5 text-sm font-bold" style={{{{ background: "{p['primary']}", color: "{p['primaryText']}" }}}}>{{v(data, "heroPrimary")}}</button>
            <button type="button" onClick={{() => goTo("{secondary}")}} className="border px-7 py-3.5 text-sm font-semibold" style={{{{ borderColor: "{p['line']}" }}}}>{{v(data, "heroSecondary")}}</button>
          </div>
        </div>
      </section>'''

    if layout == "coastalIndustrial":
        return f'''
      <section className="relative isolate min-h-[88vh] overflow-hidden">
        <div className="tpl-grain" aria-hidden="true" />
        <img src={{v(data, "heroImage")}} alt="" className="tpl-ken absolute inset-0 h-full w-full object-cover grayscale-[20%]" />
        <div className="absolute inset-0" style={{{{ background: "linear-gradient(180deg, {p['dark']}aa, {p['bg']}ee)" }}}} />
        <div className="relative z-10 mx-auto flex min-h-[88vh] max-w-7xl flex-col justify-end px-5 pb-16 pt-28 lg:px-8">
          <p className="tpl-rise text-xs font-semibold tracking-[0.28em]" style={{{{ color: "{p['primary']}" }}}}>{{v(data, "heroEyebrow")}}</p>
          <h1 className="tpl-display tpl-rise-2 mt-4 max-w-4xl text-6xl font-bold leading-[0.92] md:text-8xl">{{v(data, "heroTitle")}}</h1>
          <p className="tpl-rise-3 mt-6 max-w-xl text-lg leading-8" style={{{{ color: "{p['muted']}" }}}}>{{v(data, "heroSubtitle")}}</p>
          <div className="tpl-rise-3 mt-8 flex flex-wrap gap-3">
            <button type="button" onClick={{onCta}} className="px-7 py-3.5 text-sm font-bold" style={{{{ background: "{p['primary']}", color: "{p['primaryText']}" }}}}>{{v(data, "heroPrimary")}}</button>
            <button type="button" onClick={{() => goTo("{secondary}")}} className="border px-7 py-3.5 text-sm font-semibold" style={{{{ borderColor: "{p['line']}" }}}}>{{v(data, "heroSecondary")}}</button>
          </div>
        </div>
      </section>'''

    # panoramaCarousel
    return f'''
      <section className="relative overflow-hidden">
        <div className="overflow-hidden">
          <div className="tpl-pan-track">
            {{[v(data, "heroImage"), v(data, "item1Image"), v(data, "item2Image")].map((src, i) => (
              <div key={{i}} className="tpl-pan-panel relative">
                <img src={{src}} alt="" className="h-full min-h-[72vh] w-full object-cover" />
                <div className="absolute inset-0 flex items-end p-8" style={{{{ background: "linear-gradient(180deg, transparent 40%, {p['dark']}cc)" }}}}>
                  {{i === 0 ? (
                    <>
                      <div>
                        <p className="text-xs tracking-[0.24em]" style={{{{ color: "{p['primary']}" }}}}>{{v(data, "heroEyebrow")}}</p>
                        <h1 className="tpl-display mt-3 max-w-xl text-5xl font-bold md:text-6xl">{{v(data, "heroTitle")}}</h1>
                        <p className="mt-4 max-w-md text-base leading-7" style={{{{ color: "{p['muted']}" }}}}>{{v(data, "heroSubtitle")}}</p>
                        <div className="mt-6 flex flex-wrap gap-3">
                          <button type="button" onClick={{onCta}} className="px-6 py-3 text-sm font-bold" style={{{{ background: "{p['primary']}", color: "{p['primaryText']}" }}}}>{{v(data, "heroPrimary")}}</button>
                          <button type="button" onClick={{() => goTo("{secondary}")}} className="border px-6 py-3 text-sm font-semibold" style={{{{ borderColor: "{p['line']}" }}}}>{{v(data, "heroSecondary")}}</button>
                        </div>
                      </div>
                    </>
                  ) : null}}
                </div>
              </div>
            ))}}
          </div>
        </div>
      </section>'''


def home_sections_jsx(t):
    p = t["palette"]
    layout = t["layout"]
    return _HOME_SECTIONS[layout].format(**p)


_HOME_SECTIONS = {
    "duneParallax": '''
function VillaCardsRail({{ data }}: {{ data: Record<string, any> }}) {{
  const cards = [1, 2, 3].map((i) => ({{
    title: v(data, `item${{i}}Title`), meta: v(data, `item${{i}}Meta`), text: v(data, `item${{i}}Text`), img: v(data, `item${{i}}Image`),
  }}));
  return (
    <section className="border-t px-5 py-16 lg:px-8 lg:py-20" style={{{{ borderColor: "{line}", background: "{surface}" }}}}>
      <div className="mx-auto max-w-7xl">
        <h2 className="tpl-display text-4xl font-bold md:text-5xl">וילות על הדיונות</h2>
        <div className="tpl-villa-rail mt-10">
          {{cards.map((c) => (
            <article key={{c.title}} className="overflow-hidden border" style={{{{ borderColor: "{line}", background: "{bg}" }}}}>
              <img src={{c.img}} alt="" className="aspect-[4/3] w-full object-cover" />
              <div className="p-5">
                <p className="text-xs font-semibold tracking-[0.2em]" style={{{{ color: "{primary}" }}}}>{{c.meta}}</p>
                <h3 className="tpl-display mt-2 text-2xl font-bold">{{c.title}}</h3>
                <p className="mt-3 text-sm leading-7" style={{{{ color: "{muted}" }}}}>{{c.text}}</p>
              </div>
            </article>
          ))}}
        </div>
      </div>
    </section>
  );
}}

function DuneStats({{ data }}: {{ data: Record<string, any> }}) {{
  const stats = [["12", "וילות"], ["180°", "נוף לים"], ["24/7", "קונסierge"]];
  return (
    <section className="border-t px-5 py-12 lg:px-8" style={{{{ borderColor: "{line}" }}}}>
      <div className="mx-auto grid max-w-7xl grid-cols-3 gap-6 text-center">
        {{stats.map(([n, l]) => (
          <div key={{l}} className="tpl-climb">
            <div className="tpl-display text-4xl font-bold md:text-5xl" style={{{{ color: "{primary}" }}}}>{{n}}</div>
            <p className="mt-2 text-sm" style={{{{ color: "{muted}" }}}}>{{l}}</p>
          </div>
        ))}}
      </div>
    </section>
  );
}}''',
    "underwaterGlass": '''
function GlassCards({{ data }}: {{ data: Record<string, any> }}) {{
  const cards = [1, 2, 3].map((i) => [v(data, `item${{i}}Title`), v(data, `item${{i}}Meta`), v(data, `item${{i}}Text`), v(data, `item${{i}}Image`)]);
  return (
    <section className="border-t px-5 py-16 lg:px-8 lg:py-20" style={{{{ borderColor: "{line}" }}}}>
      <div className="mx-auto max-w-7xl">
        <h2 className="tpl-display text-4xl font-bold md:text-5xl">קורסים וצלילות</h2>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {{cards.map(([title, meta, text, img]) => (
            <article key={{title}} className="tpl-glass overflow-hidden rounded-2xl">
              <img src={{img}} alt="" className="aspect-[4/3] w-full object-cover opacity-90" />
              <div className="p-5">
                <p className="text-xs font-semibold" style={{{{ color: "{primary}" }}}}>{{meta}}</p>
                <h3 className="tpl-display mt-2 text-2xl font-bold">{{title}}</h3>
                <p className="mt-3 text-sm leading-7" style={{{{ color: "{muted}" }}}}>{{text}}</p>
              </div>
            </article>
          ))}}
        </div>
      </div>
    </section>
  );
}}

function DepthTimeline({{ data }}: {{ data: Record<string, any> }}) {{
  const steps = [["0m", "שחייה"], ["12m", "Open Water"], ["30m", "Advanced"], ["40m+", "Tech"]];
  return (
    <section className="border-t px-5 py-14 lg:px-8" style={{{{ borderColor: "{line}", background: "{surface}" }}}}>
      <div className="mx-auto max-w-7xl">
        <h3 className="tpl-display text-2xl font-bold">ציר עומק</h3>
        <div className="mt-8 grid gap-4 md:grid-cols-4">
          {{steps.map(([depth, label], i) => (
            <div key={{depth}} className="tpl-climb border-t pt-4" style={{{{ borderColor: "{primary}", animationDelay: `${{i * 0.12}}s` }}}}>
              <div className="text-2xl font-bold" style={{{{ color: "{primary}" }}}}>{{depth}}</div>
              <p className="mt-1 text-sm" style={{{{ color: "{muted}" }}}}>{{label}}</p>
            </div>
          ))}}
        </div>
      </div>
    </section>
  );
}}''',
    "splitSunset": '''
function DjMarquee({{ data }}: {{ data: Record<string, any> }}) {{
  const tags = ["SUNSET DJ", "COCKTAILS", "VIP TABLES", "LIVE SET", "GOLDEN HOUR", "SUNSET DJ", "COCKTAILS", "VIP TABLES"];
  return (
    <section className="tpl-sweep overflow-hidden border-y py-4" style={{{{ borderColor: "{line}", background: "{surface}" }}}}>
      <div className="tpl-marquee-track gap-8 px-4 text-sm font-bold tracking-[0.22em]" style={{{{ color: "{primary}" }}}}>
        {{tags.map((x, i) => <span key={{i}} className="whitespace-nowrap">{{x}} ·</span>)}}
      </div>
    </section>
  );
}}

function CocktailCards({{ data }}: {{ data: Record<string, any> }}) {{
  const cards = [1, 2, 3].map((i) => [v(data, `item${{i}}Title`), v(data, `item${{i}}Meta`), v(data, `item${{i}}Text`), v(data, `item${{i}}Image`)]);
  return (
    <section className="px-5 py-16 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-7xl">
        <h2 className="tpl-display text-4xl font-bold md:text-5xl">ערבי שקיעה</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {{cards.map(([title, meta, text, img]) => (
            <article key={{title}} className="group overflow-hidden border" style={{{{ borderColor: "{line}" }}}}>
              <div className="tpl-shimmer relative overflow-hidden">
                <img src={{img}} alt="" className="aspect-[3/4] w-full object-cover transition duration-500 group-hover:scale-105" />
              </div>
              <div className="p-5" style={{{{ background: "{surface}" }}}}>
                <p className="text-xs font-semibold" style={{{{ color: "{primary}" }}}}>{{meta}}</p>
                <h3 className="tpl-display mt-2 text-2xl font-bold">{{title}}</h3>
                <p className="mt-2 text-sm leading-7" style={{{{ color: "{muted}" }}}}>{{text}}</p>
              </div>
            </article>
          ))}}
        </div>
      </div>
    </section>
  );
}}''',
    "surfRail": '''
function SurfboardRail({{ data }}: {{ data: Record<string, any> }}) {{
  const boards = [1, 2, 3].map((i) => [v(data, `item${{i}}Title`), v(data, `item${{i}}Meta`), v(data, `item${{i}}Text`), v(data, `item${{i}}Image`)]);
  return (
    <section className="border-t px-5 py-16 lg:px-8 lg:py-20" style={{{{ borderColor: "{line}", background: "{surface}" }}}}>
      <div className="mx-auto max-w-7xl">
        <h2 className="tpl-display text-4xl font-bold md:text-5xl">מסילת גלשנים</h2>
        <div className="tpl-board-rail mt-10 pb-2">
          {{boards.map(([title, meta, text, img], i) => (
            <article key={{title}} className="tpl-board-card overflow-hidden border" style={{{{ borderColor: "{line}", background: "{bg}", animationDelay: `${{i * 0.4}}s` }}}}>
              <img src={{img}} alt="" className="aspect-[3/5] w-full object-cover" />
              <div className="p-4">
                <p className="text-xs font-bold" style={{{{ color: "{primary}" }}}}>{{meta}}</p>
                <h3 className="tpl-display mt-1 text-xl font-bold">{{title}}</h3>
                <p className="mt-2 text-sm" style={{{{ color: "{muted}" }}}}>{{text}}</p>
              </div>
            </article>
          ))}}
        </div>
      </div>
    </section>
  );
}}

function WaveForecast({{ data }}: {{ data: Record<string, any> }}) {{
  const waves = [["08:00", "0.8m"], ["12:00", "1.2m"], ["16:00", "1.6m"], ["20:00", "0.9m"]];
  return (
    <section className="border-t px-5 py-12 lg:px-8" style={{{{ borderColor: "{line}" }}}}>
      <div className="mx-auto max-w-7xl">
        <h3 className="tpl-display text-2xl font-bold">תחזית גלים היום</h3>
        <div className="mt-6 flex flex-wrap gap-3">
          {{waves.map(([time, height]) => (
            <div key={{time}} className="border px-5 py-4 text-center" style={{{{ borderColor: "{line}" }}}}>
              <div className="text-xs" style={{{{ color: "{muted}" }}}}>{{time}}</div>
              <div className="tpl-display mt-1 text-2xl font-bold" style={{{{ color: "{primary}" }}}}>{{height}}</div>
            </div>
          ))}}
        </div>
      </div>
    </section>
  );
}}''',
    "heatShimmer": '''
function OasisCards({{ data }}: {{ data: Record<string, any> }}) {{
  const cards = [1, 2, 3].map((i) => [v(data, `item${{i}}Title`), v(data, `item${{i}}Meta`), v(data, `item${{i}}Text`), v(data, `item${{i}}Image`)]);
  const temps = ["32°", "28°", "24°"];
  return (
    <section className="border-t px-5 py-16 lg:px-8 lg:py-20" style={{{{ borderColor: "{line}", background: "{surface}" }}}}>
      <div className="mx-auto max-w-7xl">
        <h2 className="tpl-display text-4xl font-bold md:text-5xl">אasis בין מדבר לים</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {{cards.map(([title, meta, text, img], i) => (
            <article key={{title}} className="overflow-hidden border" style={{{{ borderColor: "{line}", background: "{bg}" }}}}>
              <div className="tpl-temp-band" style={{{{ background: "linear-gradient(90deg, {primary}, {muted})", opacity: 0.4 + i * 0.2 }}}} />
              <img src={{img}} alt="" className="aspect-[4/3] w-full object-cover" />
              <div className="p-5">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold" style={{{{ color: "{primary}" }}}}>{{meta}}</p>
                  <span className="text-sm font-bold">{{temps[i]}}</span>
                </div>
                <h3 className="tpl-display mt-2 text-2xl font-bold">{{title}}</h3>
                <p className="mt-2 text-sm leading-7" style={{{{ color: "{muted}" }}}}>{{text}}</p>
              </div>
            </article>
          ))}}
        </div>
      </div>
    </section>
  );
}}''',
    "organicWood": '''
function MenuScroll({{ data }}: {{ data: Record<string, any> }}) {{
  const dishes = [1, 2, 3].map((i) => [v(data, `item${{i}}Title`), v(data, `item${{i}}Meta`), v(data, `item${{i}}Text`), v(data, `item${{i}}Image`)]);
  return (
    <section className="border-t px-5 py-16 lg:px-8 lg:py-20" style={{{{ borderColor: "{line}", background: "{surface}" }}}}>
      <div className="mx-auto max-w-7xl">
        <h2 className="tpl-display text-4xl font-bold md:text-5xl">תפריט החוף</h2>
        <div className="tpl-menu-scroll mt-10 pb-2">
          {{dishes.map(([title, meta, text, img]) => (
            <article key={{title}} className="min-w-[260px] flex-shrink-0 overflow-hidden border" style={{{{ borderColor: "{line}", background: "{bg}" }}}}>
              <img src={{img}} alt="" className="aspect-square w-full object-cover" />
              <div className="p-4">
                <p className="text-xs" style={{{{ color: "{primary}" }}}}>{{meta}}</p>
                <h3 className="tpl-display mt-1 text-xl font-bold">{{title}}</h3>
                <p className="mt-2 text-sm leading-6" style={{{{ color: "{muted}" }}}}>{{text}}</p>
              </div>
            </article>
          ))}}
        </div>
      </div>
    </section>
  );
}}''',
    "minimalRipple": '''
function RouteDots({{ data }}: {{ data: Record<string, any> }}) {{
  const routes = [1, 2, 3].map((i) => [v(data, `item${{i}}Title`), v(data, `item${{i}}Meta`), v(data, `item${{i}}Text`)]);
  return (
    <section className="border-t px-5 py-16 lg:px-8 lg:py-20" style={{{{ borderColor: "{line}" }}}}>
      <div className="mx-auto max-w-7xl">
        <h2 className="tpl-display text-4xl font-bold md:text-5xl">מסלולי הפלגה</h2>
        <div className="relative mt-12">
          <div className="absolute right-4 top-0 bottom-0 w-px" style={{{{ background: "{line}" }}}} />
          {{routes.map(([title, meta, text], i) => (
            <div key={{title}} className="tpl-climb relative grid gap-4 pb-10 pr-12 md:grid-cols-[1fr_2fr]" style={{{{ animationDelay: `${{i * 0.1}}s` }}}}>
              <div className="absolute right-[11px] top-2 h-3 w-3 rounded-full border-2" style={{{{ borderColor: "{primary}", background: "{bg}" }}}} />
              <div>
                <p className="text-xs font-semibold" style={{{{ color: "{primary}" }}}}>{{meta}}</p>
                <h3 className="tpl-display mt-1 text-2xl font-bold">{{title}}</h3>
              </div>
              <p className="text-sm leading-7" style={{{{ color: "{muted}" }}}}>{{text}}</p>
            </div>
          ))}}
        </div>
      </div>
    </section>
  );
}}''',
    "tropicalPetal": '''
function TreatmentCarousel({{ data }}: {{ data: Record<string, any> }}) {{
  const items = [1, 2, 3].map((i) => [v(data, `item${{i}}Title`), v(data, `item${{i}}Meta`), v(data, `item${{i}}Text`), v(data, `item${{i}}Image`)]);
  return (
    <section className="border-t px-5 py-16 lg:px-8 lg:py-20" style={{{{ borderColor: "{line}", background: "{surface}" }}}}>
      <div className="mx-auto max-w-7xl">
        <h2 className="tpl-display text-4xl font-bold md:text-5xl">טיפולים טרופיים</h2>
        <div className="tpl-carousel-track mt-10 pb-2">
          {{items.map(([title, meta, text, img]) => (
            <article key={{title}} className="min-w-[300px] flex-shrink-0 overflow-hidden rounded-2xl border" style={{{{ borderColor: "{line}", background: "{bg}" }}}}>
              <img src={{img}} alt="" className="aspect-[5/4] w-full object-cover" />
              <div className="p-5">
                <p className="text-xs font-semibold" style={{{{ color: "{primary}" }}}}>{{meta}}</p>
                <h3 className="tpl-display mt-2 text-2xl font-bold">{{title}}</h3>
                <p className="mt-2 text-sm leading-7" style={{{{ color: "{muted}" }}}}>{{text}}</p>
              </div>
            </article>
          ))}}
        </div>
      </div>
    </section>
  );
}}''',
    "coastalIndustrial": '''
function MasonryGrid({{ data }}: {{ data: Record<string, any> }}) {{
  const products = [1, 2, 3].map((i) => [v(data, `item${{i}}Title`), v(data, `item${{i}}Meta`), v(data, `item${{i}}Text`), v(data, `item${{i}}Image`)]);
  const heights = ["h-48", "h-64", "h-56"];
  return (
    <section className="border-t px-5 py-16 lg:px-8 lg:py-20" style={{{{ borderColor: "{line}" }}}}>
      <div className="mx-auto max-w-7xl">
        <h2 className="tpl-display text-4xl font-bold md:text-5xl">מוצרי חוף</h2>
        <div className="tpl-masonry mt-10">
          {{products.map(([title, meta, text, img], i) => (
            <article key={{title}} className="mb-4 break-inside-avoid overflow-hidden border" style={{{{ borderColor: "{line}", background: "{surface}" }}}}>
              <img src={{img}} alt="" className={{`${{heights[i % 3]}} w-full object-cover`}} />
              <div className="p-4">
                <p className="text-xs font-bold uppercase tracking-wider" style={{{{ color: "{primary}" }}}}>{{meta}}</p>
                <h3 className="tpl-display mt-1 text-xl font-bold">{{title}}</h3>
                <p className="mt-2 text-sm" style={{{{ color: "{muted}" }}}}>{{text}}</p>
              </div>
            </article>
          ))}}
        </div>
      </div>
    </section>
  );
}}''',
    "panoramaCarousel": '''
function GalleryZoomGrid({{ data }}: {{ data: Record<string, any> }}) {{
  const shots = [1, 2, 3].map((i) => [v(data, `item${{i}}Title`), v(data, `item${{i}}Meta`), v(data, `item${{i}}Image`)]);
  return (
    <section className="border-t px-5 py-16 lg:px-8 lg:py-20" style={{{{ borderColor: "{line}", background: "{surface}" }}}}>
      <div className="mx-auto max-w-7xl">
        <h2 className="tpl-display text-4xl font-bold md:text-5xl">גלריית חוף</h2>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {{shots.map(([title, meta, img]) => (
            <figure key={{title}} className="tpl-gallery-zoom overflow-hidden border" style={{{{ borderColor: "{line}" }}}}>
              <img src={{img}} alt="" className="aspect-[4/5] w-full object-cover" />
              <figcaption className="p-4">
                <p className="text-xs" style={{{{ color: "{primary}" }}}}>{{meta}}</p>
                <p className="tpl-display mt-1 text-lg font-bold">{{title}}</p>
              </figcaption>
            </figure>
          ))}}
        </div>
      </div>
    </section>
  );
}}

function TourPackages({{ data }}: {{ data: Record<string, any> }}) {{
  const tours = [1, 2, 3].map((i) => [v(data, `item${{i}}Title`), v(data, `item${{i}}Meta`), v(data, `item${{i}}Text`)]);
  return (
    <section className="border-t px-5 py-12 lg:px-8" style={{{{ borderColor: "{line}" }}}}>
      <div className="mx-auto max-w-7xl grid gap-4 md:grid-cols-3">
        {{tours.map(([title, meta, text]) => (
          <div key={{title}} className="border p-5" style={{{{ borderColor: "{line}" }}}}>
            <p className="text-xs font-semibold" style={{{{ color: "{primary}" }}}}>{{meta}}</p>
            <h3 className="tpl-display mt-2 text-xl font-bold">{{title}}</h3>
            <p className="mt-2 text-sm" style={{{{ color: "{muted}" }}}}>{{text}}</p>
          </div>
        ))}}
      </div>
    </section>
  );
}}''',
}

HOME_SECTION_USE = {
    "duneParallax": ["<VillaCardsRail data={data} />", "<DuneStats data={data} />"],
    "underwaterGlass": ["<GlassCards data={data} />", "<DepthTimeline data={data} />"],
    "splitSunset": ["<DjMarquee data={data} />", "<CocktailCards data={data} />"],
    "surfRail": ["<SurfboardRail data={data} />", "<WaveForecast data={data} />"],
    "heatShimmer": ["<OasisCards data={data} />"],
    "organicWood": ["<MenuScroll data={data} />"],
    "minimalRipple": ["<RouteDots data={data} />"],
    "tropicalPetal": ["<TreatmentCarousel data={data} />"],
    "coastalIndustrial": ["<MasonryGrid data={data} />"],
    "panoramaCarousel": ["<GalleryZoomGrid data={data} />", "<TourPackages data={data} />"],
}


def thumbnail_body(t):
    p = t["palette"]
    name = t["name"]
    layout = t["layout"]
    imgs = t["images"]
    fonts = t["fonts"]["displayCss"]
    niche = t["niche"]
    bodies = {
        "duneParallax": f'''<div className="absolute inset-0">
        <div className="absolute inset-0" style={{{{ backgroundImage: "url({imgs['hero']})", backgroundSize: "cover", backgroundPosition: "center" }}}} />
        <div className="absolute inset-x-0 bottom-0 h-16" style={{{{ background: "linear-gradient(180deg, transparent, {p['bg']})" }}}} />
        <svg className="absolute bottom-0 w-full" viewBox="0 0 400 30" preserveAspectRatio="none"><path fill="{p['bg']}" d="M0,15 Q100,30 200,15 T400,15 L400,30 L0,30 Z"/></svg>
        <div className="absolute bottom-4 right-4 left-4">
          <p className="text-[10px] tracking-[0.2em]" style={{{{ color: "{p['primary']}" }}}}>{niche}</p>
          <h3 className="mt-1 text-3xl font-bold" style={{{{ fontFamily: '{fonts}', color: "{p['text']}" }}}}>{name}</h3>
        </div>
      </div>''',
        "underwaterGlass": f'''<div className="relative h-full min-h-[260px] overflow-hidden" style={{{{ background: "linear-gradient(180deg, {p['dark']}, {p['bg']})" }}}}>
        <div className="absolute bottom-6 left-[20%] h-3 w-3 rounded-full border opacity-50" style={{{{ borderColor: "{p['primary']}" }}}} />
        <div className="absolute bottom-10 left-[50%] h-4 w-4 rounded-full border opacity-50" style={{{{ borderColor: "{p['primary']}" }}}} />
        <div className="absolute bottom-4 left-[75%] h-3 w-3 rounded-full border opacity-50" style={{{{ borderColor: "{p['primary']}" }}}} />
        <div className="absolute inset-x-0 bottom-0 p-4">
          <p className="text-[10px]" style={{{{ color: "{p['primary']}" }}}}>{niche}</p>
          <h3 className="text-3xl font-bold" style={{{{ fontFamily: '{fonts}', color: "{p['text']}" }}}}>{name}</h3>
        </div>
      </div>''',
        "splitSunset": f'''<div className="grid h-full min-h-[260px] grid-cols-2">
        <div className="flex flex-col justify-center p-4" style={{{{ background: "{p['bg']}", color: "{p['text']}" }}}}>
          <p className="text-[10px]" style={{{{ color: "{p['primary']}" }}}}>{niche}</p>
          <h3 className="text-3xl font-bold leading-none" style={{{{ fontFamily: '{fonts}' }}}}>{name}</h3>
        </div>
        <div style={{{{ backgroundImage: "url({imgs['hero']})", backgroundSize: "cover", backgroundPosition: "center" }}}} />
      </div>''',
        "surfRail": f'''<div className="relative h-full min-h-[260px] p-4" style={{{{ background: "{p['bg']}", color: "{p['text']}" }}}}>
        <div className="absolute inset-x-4 top-1/2 h-0.5 opacity-60" style={{{{ background: "repeating-linear-gradient(90deg, {p['primary']}, {p['primary']} 8px, transparent 8px, transparent 16px)" }}}} />
        <p className="text-[10px]" style={{{{ color: "{p['primary']}" }}}}>{niche}</p>
        <h3 className="mt-2 text-4xl font-black" style={{{{ fontFamily: '{fonts}' }}}}>{name}</h3>
        <div className="absolute bottom-4 inset-x-4 flex gap-2">
          <div className="h-12 flex-1 rounded" style={{{{ backgroundImage: "url({imgs['a']})", backgroundSize: "cover" }}}} />
          <div className="h-12 flex-1 rounded" style={{{{ backgroundImage: "url({imgs['b']})", backgroundSize: "cover" }}}} />
        </div>
      </div>''',
        "heatShimmer": f'''<div className="relative h-full min-h-[260px] overflow-hidden" style={{{{ background: "{p['bg']}" }}}}>
        <div className="absolute inset-0 opacity-80" style={{{{ backgroundImage: "url({imgs['hero']})", backgroundSize: "cover" }}}} />
        <div className="absolute inset-0" style={{{{ background: "{p['bg']}aa" }}}} />
        <div className="relative p-4">
          <p className="text-[10px]" style={{{{ color: "{p['primary']}" }}}}>{niche}</p>
          <h3 className="text-3xl font-bold" style={{{{ fontFamily: '{fonts}' }}}}>{name}</h3>
          <div className="mt-4 flex gap-1"><span className="border px-2 py-1 text-[10px]" style={{{{ borderColor: "{p['line']}" }}}}>32°</span><span className="border px-2 py-1 text-[10px]" style={{{{ borderColor: "{p['line']}" }}}}>28°</span></div>
        </div>
      </div>''',
        "organicWood": f'''<div className="relative h-full min-h-[260px] p-4" style={{{{ background: "{p['bg']}", color: "{p['text']}" }}}}>
        <div className="absolute right-4 top-4 h-16 w-16 rounded-[40%_60%_55%_45%]" style={{{{ background: "{p['primary']}33" }}}} />
        <p className="text-[10px]" style={{{{ color: "{p['primary']}" }}}}>{niche}</p>
        <h3 className="mt-2 text-3xl font-bold" style={{{{ fontFamily: '{fonts}' }}}}>{name}</h3>
        <div className="absolute bottom-0 inset-x-0 flex gap-1 p-3">
          <div className="h-10 flex-1" style={{{{ backgroundImage: "url({imgs['a']})", backgroundSize: "cover" }}}} />
          <div className="h-10 flex-1" style={{{{ backgroundImage: "url({imgs['b']})", backgroundSize: "cover" }}}} />
        </div>
      </div>''',
        "minimalRipple": f'''<div className="flex h-full min-h-[260px] flex-col items-center justify-center p-5 text-center" style={{{{ background: "{p['bg']}", color: "{p['text']}" }}}}>
        <p className="text-[10px] tracking-[0.28em]" style={{{{ color: "{p['primary']}" }}}}>{niche}</p>
        <h3 className="mt-2 text-3xl font-bold" style={{{{ fontFamily: '{fonts}' }}}}>{name}</h3>
        <div className="relative mt-4 h-px w-full max-w-[180px]" style={{{{ background: "{p['primary']}" }}}} />
        <div className="mt-3 h-14 w-full max-w-[200px]" style={{{{ backgroundImage: "url({imgs['hero']})", backgroundSize: "cover" }}}} />
      </div>''',
        "tropicalPetal": f'''<div className="relative h-full min-h-[260px] overflow-hidden" style={{{{ backgroundImage: "url({imgs['hero']})", backgroundSize: "cover" }}}}>
        <div className="absolute inset-0" style={{{{ background: "{p['bg']}99" }}}} />
        <div className="absolute top-2 left-[15%] h-2 w-2 rounded-full" style={{{{ background: "{p['primary']}" }}}} />
        <div className="absolute top-4 left-[40%] h-2 w-2 rounded-full" style={{{{ background: "{p['primary']}" }}}} />
        <div className="absolute top-3 left-[70%] h-2 w-2 rounded-full" style={{{{ background: "{p['primary']}" }}}} />
        <div className="absolute bottom-4 right-4 left-4">
          <p className="text-[10px]" style={{{{ color: "{p['primary']}" }}}}>{niche}</p>
          <h3 className="text-3xl font-bold" style={{{{ fontFamily: '{fonts}', color: "{p['text']}" }}}}>{name}</h3>
        </div>
      </div>''',
        "coastalIndustrial": f'''<div className="relative h-full min-h-[260px] overflow-hidden">
        <div className="absolute inset-0" style={{{{ backgroundImage: "url({imgs['hero']})", backgroundSize: "cover", filter: "grayscale(30%)" }}}} />
        <div className="absolute inset-0 opacity-30" style={{{{ background: "{p['dark']}" }}}} />
        <div className="relative grid h-full grid-cols-2 gap-1 p-3">
          <div className="col-span-2"><p className="text-[10px]" style={{{{ color: "{p['primary']}" }}}}>{niche}</p><h3 className="text-2xl font-bold" style={{{{ fontFamily: '{fonts}', color: "#fff" }}}}>{name}</h3></div>
          <div className="h-16" style={{{{ backgroundImage: "url({imgs['a']})", backgroundSize: "cover" }}}} />
          <div className="h-20" style={{{{ backgroundImage: "url({imgs['b']})", backgroundSize: "cover" }}}} />
        </div>
      </div>''',
        "panoramaCarousel": f'''<div className="relative h-full min-h-[260px] overflow-hidden" style={{{{ background: "{p['bg']}" }}}}>
        <div className="flex h-full">
          <div className="w-1/3" style={{{{ backgroundImage: "url({imgs['hero']})", backgroundSize: "cover" }}}} />
          <div className="w-1/3" style={{{{ backgroundImage: "url({imgs['a']})", backgroundSize: "cover" }}}} />
          <div className="w-1/3" style={{{{ backgroundImage: "url({imgs['b']})", backgroundSize: "cover" }}}} />
        </div>
        <div className="absolute inset-x-0 bottom-0 p-3" style={{{{ background: "linear-gradient(transparent, {p['dark']}cc)" }}}}>
          <p className="text-[10px]" style={{{{ color: "{p['primary']}" }}}}>{niche}</p>
          <h3 className="text-2xl font-bold" style={{{{ fontFamily: '{fonts}', color: "{p['text']}" }}}}>{name}</h3>
        </div>
      </div>''',
    }
    return bodies[layout]


def gen_default_data(t, index):
    nav = "\n".join(
        f'  nav{pid[0].upper() + pid[1:]}: "{label}",'
        for pid, label, _ in t["pages"]
    )
    items = "\n".join(
        f'  item{i}Title: "{it[0]}",\n  item{i}Meta: "{it[1]}",\n  item{i}Text: "{it[2]}",\n  item{i}Image: "{t["images"][chr(96 + i)]}",'
        for i, it in enumerate(t["copy"]["items"], 1)
    )
    c = t["copy"]
    imgs = t["images"]
    return f'''export const {t["id"]}DefaultData = {{
  templateId: "{t["id"]}",
  name: "{t["name"]}",
  brandName: "{t["brand"]}",
  logoText: "{t["logo"]}",
{nav}
  heroEyebrow: "{t["niche"]}",
  heroTitle: "{c["title"]}",
  heroSubtitle: "{c["subtitle"]}",
  heroPrimary: "{c["primary"]}",
  heroSecondary: "{c["secondary"]}",
  heroImage: "{imgs["hero"]}",
  aboutTitle: "{c["aboutTitle"]}",
  aboutText: "{c["aboutText"]}",
  aboutImage: "{imgs["c"]}",
  contactTitle: "{c["contactTitle"]}",
  contactText: "{c["contactText"]}",
  cta: "{c["primary"]}",
  phone: "04-555-{1000 + index}",
  email: "hello@{t["id"]}.co.il",
  address: "ישראל",
{items}
}};
'''


def gen_editor_css(t):
    p = t["palette"]
    tid = t["id"]
    extra = EXTRA_CSS[t["layout"]].format(tid=tid)
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
@keyframes {tid}-marquee {{ from {{ transform: translateX(0); }} to {{ transform: translateX(50%); }} }}
@keyframes {tid}-float {{ 0%,100% {{ transform: translateY(0); }} 50% {{ transform: translateY(-10px); }} }}
@keyframes {tid}-sweep {{ 0% {{ transform: translateX(-120%); }} 100% {{ transform: translateX(120%); }} }}
@keyframes {tid}-climb {{ from {{ transform: translateY(40px); opacity: 0; }} to {{ transform: translateY(0); opacity: 1; }} }}

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
[data-template-id="{tid}"] .tpl-marquee-track, [data-template-id="{tid}-preview"] .tpl-marquee-track {{
  display: flex; width: max-content; animation: {tid}-marquee 28s linear infinite;
}}
[data-template-id="{tid}"] .tpl-float, [data-template-id="{tid}-preview"] .tpl-float {{
  animation: {tid}-float 5s ease-in-out infinite;
}}
[data-template-id="{tid}"] .tpl-sweep, [data-template-id="{tid}-preview"] .tpl-sweep {{ position: relative; overflow: hidden; }}
[data-template-id="{tid}"] .tpl-sweep::after, [data-template-id="{tid}-preview"] .tpl-sweep::after {{
  content: ""; position: absolute; inset: 0 auto 0 0; width: 35%; pointer-events: none;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,.16), transparent);
  animation: {tid}-sweep 4.5s ease-in-out infinite;
}}
[data-template-id="{tid}"] .tpl-climb, [data-template-id="{tid}-preview"] .tpl-climb {{
  animation: {tid}-climb .85s cubic-bezier(.22,1,.36,1) both;
}}
{extra}
`;
'''


def gen_pages(t):
    p = t["palette"]
    tid = t["id"]
    name = t["name"]
    layout = t["layout"]
    pages_arr = "\n".join(
        f'  {{ id: "{pid}", label: "{label}", slug: "{slug}" }},'
        for pid, label, slug in t["pages"]
    )
    hero = hero_jsx(t)
    sections = home_sections_jsx(t)
    home_bits = "\n      ".join(HOME_SECTION_USE[layout])
    inner_bits = "\n        ".join(s.replace("{data}", "{merged}") for s in HOME_SECTION_USE[layout])
    inner_jsx = "{pg.id.includes(\"contact\") ? null : (<>\n        " + inner_bits + "\n        </>)}"
    return f'''import React, {{ useMemo, useState }} from "react";
import {{ VisualPageStack }} from "../../../../runtime/VisualPageStack";
import {{ {tid}DefaultData }} from "./defaultData";
import {{ useTemplatePageNavigation }} from "../shared/useTemplatePageNavigation";

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
function cx(...xs: Array<string | false | null | undefined>) {{ return xs.filter(Boolean).join(" "); }}

function Header({{ data, currentPage, goTo, onCta }}: {{ data: Record<string, any>; currentPage: string; goTo: (id: string) => void; onCta: () => void }}) {{
  const [open, setOpen] = useState(false);
  const nav = {tid}Pages.map((p) => [p.id, v(data, `nav${{p.id[0].toUpperCase()}}${{p.id.slice(1)}}`) || p.label] as const);
  return (
    <header data-template-section-type="header" data-section-kind="header" className="sticky top-0 z-50 border-b"
      style={{{{ background: "{p['bg']}f2", borderColor: "{p['line']}", backdropFilter: "blur(12px)" }}}}>
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 lg:px-8">
        <button type="button" onClick={{() => goTo("home")}} className="flex items-center gap-3 text-right">
          <span className="grid h-10 w-10 place-items-center text-sm font-bold" style={{{{ background: "{p['primary']}", color: "{p['primaryText']}" }}}}>{{v(data, "logoText")}}</span>
          <span className="tpl-display text-xl font-bold tracking-tight">{{v(data, "brandName")}}</span>
        </button>
        <nav className="hidden items-center gap-6 lg:flex">
          {{nav.map(([id, label]) => (
            <button key={{id}} type="button" onClick={{() => goTo(id)}} className="text-sm font-semibold"
              style={{{{ color: currentPage === id ? "{p['text']}" : "{p['muted']}" }}}}>{{label}}</button>
          ))}}
        </nav>
        <div className="flex items-center gap-2">
          <button type="button" onClick={{onCta}} className="hidden px-5 py-2.5 text-sm font-bold sm:inline-flex"
            style={{{{ background: "{p['primary']}", color: "{p['primaryText']}" }}}}>{{v(data, "heroPrimary")}}</button>
          <button type="button" onClick={{() => setOpen((x) => !x)}} className="grid h-10 w-10 place-items-center border lg:hidden" style={{{{ borderColor: "{p['line']}" }}}}>{{open ? "×" : "☰"}}</button>
        </div>
      </div>
      {{open ? (
        <div className="border-t px-5 pb-4 lg:hidden" style={{{{ borderColor: "{p['line']}" }}}}>
          <div className="grid gap-1 pt-3">
            {{nav.map(([id, label]) => (
              <button key={{id}} type="button" onClick={{() => {{ goTo(id); setOpen(false); }}}} className="px-3 py-3 text-right text-sm font-semibold">{{label}}</button>
            ))}}
          </div>
        </div>
      ) : null}}
    </header>
  );
}}

function ContactForm({{ data, onCta }}: {{ data: Record<string, any>; onCta: () => void }}) {{
  const field = "w-full border bg-transparent px-4 py-3.5 text-right outline-none";
  return (
    <form className="grid gap-3" onSubmit={{(e) => e.preventDefault()}}>
      <input className={{field}} style={{{{ borderColor: "{p['line']}", color: "{p['text']}" }}}} placeholder="שם מלא" />
      <input className={{field}} style={{{{ borderColor: "{p['line']}", color: "{p['text']}" }}}} placeholder="טלפון" />
      <input className={{field}} style={{{{ borderColor: "{p['line']}", color: "{p['text']}" }}}} placeholder="אימייל" />
      <textarea className={{cx(field, "min-h-28")}} style={{{{ borderColor: "{p['line']}", color: "{p['text']}" }}}} placeholder="מה אתם מחפשים?" />
      <button type="button" onClick={{onCta}} className="px-6 py-4 text-sm font-bold" style={{{{ background: "{p['primary']}", color: "{p['primaryText']}" }}}}>{{v(data, "cta")}}</button>
    </form>
  );
}}

function Hero({{ data, goTo, onCta }}: {{ data: Record<string, any>; goTo: (id: string) => void; onCta: () => void }}) {{
  return ({hero}
  );
}}

{sections}

function AboutBlock({{ data }}: {{ data: Record<string, any> }}) {{
  return (
    <section className="border-t" style={{{{ borderColor: "{p['line']}" }}}}>
      <div className="mx-auto grid max-w-7xl lg:grid-cols-[1.1fr_0.9fr]">
        <div className="px-5 py-16 lg:px-8 lg:py-20">
          <p className="text-xs font-semibold tracking-[0.24em]" style={{{{ color: "{p['primary']}" }}}}>אודות</p>
          <h2 className="tpl-display mt-4 text-4xl font-bold md:text-5xl">{{v(data, "aboutTitle")}}</h2>
          <p className="mt-6 max-w-xl text-lg leading-8" style={{{{ color: "{p['muted']}" }}}}>{{v(data, "aboutText")}}</p>
        </div>
        <div className="min-h-[360px] overflow-hidden"><img src={{v(data, "aboutImage")}} alt="" className="tpl-ken h-full w-full object-cover" /></div>
      </div>
    </section>
  );
}}

function ContactBlock({{ data, onCta }}: {{ data: Record<string, any>; onCta: () => void }}) {{
  return (
    <section className="border-t px-5 py-16 lg:px-8 lg:py-20" style={{{{ borderColor: "{p['line']}", background: "{p['surface']}" }}}}>
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2">
        <div>
          <p className="text-xs font-semibold tracking-[0.24em]" style={{{{ color: "{p['primary']}" }}}}>יצירת קשר</p>
          <h2 className="tpl-display mt-4 text-4xl font-bold md:text-5xl">{{v(data, "contactTitle")}}</h2>
          <p className="mt-6 text-lg leading-8" style={{{{ color: "{p['muted']}" }}}}>{{v(data, "contactText")}}</p>
          <div className="mt-8 space-y-2 text-sm" style={{{{ color: "{p['muted']}" }}}}>
            <p>{{v(data, "phone")}}</p>
            <p>{{v(data, "email")}}</p>
            <p>{{v(data, "address")}}</p>
          </div>
        </div>
        <ContactForm data={{data}} onCta={{onCta}} />
      </div>
    </section>
  );
}}

function Footer({{ data }}: {{ data: Record<string, any> }}) {{
  return (
    <footer className="border-t px-5 py-8 lg:px-8" style={{{{ borderColor: "{p['line']}" }}}}>
      <div className="mx-auto flex max-w-7xl flex-col gap-3 text-sm md:flex-row md:items-center md:justify-between" style={{{{ color: "{p['muted']}" }}}}>
        <span className="tpl-display text-lg font-bold" style={{{{ color: "{p['text']}" }}}}>{{v(data, "brandName")}}</span>
        <span>{{v(data, "email")}} · {{v(data, "phone")}}</span>
      </div>
    </footer>
  );
}}

function HomePage({{ data, goTo, onCta }}: {{ data: Record<string, any>; goTo: (id: string) => void; onCta: () => void }}) {{
  return (
    <>
      <Hero data={{data}} goTo={{goTo}} onCta={{onCta}} />
      {home_bits}
      <AboutBlock data={{data}} />
      <ContactBlock data={{data}} onCta={{onCta}} />
      <Footer data={{data}} />
    </>
  );
}}

function InnerPage({{ data, title, children, onCta }}: {{ data: Record<string, any>; title: string; children: React.ReactNode; onCta: () => void }}) {{
  return (
    <>
      <section className="border-b px-5 py-16 lg:px-8 lg:py-20" style={{{{ borderColor: "{p['line']}" }}}}>
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-semibold tracking-[0.24em]" style={{{{ color: "{p['primary']}" }}}}>{{v(data, "brandName")}}</p>
          <h1 className="tpl-display mt-4 text-5xl font-bold md:text-6xl">{{title}}</h1>
        </div>
      </section>
      {{children}}
      <ContactBlock data={{data}} onCta={{onCta}} />
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
    home: <HomePage data={{merged}} goTo={{goTo}} onCta={{() => goTo("contact")}} />,
  }};
  for (const pg of {tid}Pages) {{
    if (pg.id === "home") continue;
    pageContent[pg.id] = (
      <InnerPage data={{merged}} title={{pg.label}} onCta={{() => goTo("contact")}}>
        {inner_jsx}
      </InnerPage>
    );
  }}
  return (
    <div dir="rtl" data-template-id={{mode === "preview" ? "{tid}-preview" : "{tid}"}} className="min-h-screen w-full overflow-x-hidden"
      style={{{{ background: "{p['bg']}", color: "{p['text']}" }}}}>
      <Header data={{merged}} currentPage={{currentPage}} goTo={{goTo}} onCta={{() => goTo("contact")}} />
      <VisualPageStack activePageId={{currentPage}} pages={{Object.entries(pageContent).map(([id, content]) => ({{ id, content }}))}} />
    </div>
  );
}}
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
    return f'''export const {t["id"]}Schema = {{
  id: "{t["id"]}",
  fields: [
    {{ key: "brandName", label: "שם המותג", type: "text" }},
    {{ key: "heroTitle", label: "כותרת ראשית", type: "text" }},
    {{ key: "heroSubtitle", label: "תת כותרת", type: "textarea" }},
    {{ key: "heroImage", label: "תמונת הירו", type: "image" }},
    {{ key: "cta", label: "טקסט כפתור", type: "text" }},
    {{ key: "phone", label: "טלפון", type: "text" }},
    {{ key: "email", label: "אימייל", type: "text" }},
  ],
}};
'''


def gen_meta(t):
    p = t["palette"]
    name = t["name"]
    tid = t["id"]
    blocks = ",\n    ".join(
        f'{{ type: "{btype}", variant: "{variant}", title: "{title}" }}'
        for btype, variant, title in META_BLOCKS[t["layout"]]
    )
    return f'''import React from "react";
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
  description: "{t['desc']}",
  category: "travel", categoryLabel: "תיירות וחוף", niche: "{t['niche']}", layout: "full",
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
  category: "travel", categoryLabel: "תיירות וחוף", badge: "חדש",
  description: "{t['desc']}",
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
'''


def main():
    templates = json.loads(CONFIG.read_text())
    created = []
    for i, t in enumerate(templates):
        d = ROOT / t["id"]
        d.mkdir(parents=True, exist_ok=True)
        (d / "defaultData.ts").write_text(gen_default_data(t, i))
        (d / "editorCss.ts").write_text(gen_editor_css(t))
        (d / "pages.tsx").write_text(gen_pages(t))
        (d / "thumbnail.tsx").write_text(gen_thumbnail(t))
        (d / "preview.tsx").write_text(gen_preview(t))
        (d / "schema.ts").write_text(gen_schema(t))
        (d / "meta.ts").write_text(gen_meta(t))
        created.append(t["id"])
        print("ok", t["id"], t["layout"])
    print("done", len(templates))
    return created


if __name__ == "__main__":
    main()
