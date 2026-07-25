#!/usr/bin/env python3
"""Regenerate 10 food/restaurant studio templates with completely unique layouts + motion CSS."""
from __future__ import annotations

import json
from pathlib import Path

ROOT = Path("src/components/site-builder/studio/data/templates")
CONFIG = Path("scripts/food-templates-config.json")

from _food_page_sections import LAYOUT_SECTIONS, paint  # noqa: E402

CITIES = [
    "רח׳ הפחם 12, תל אביב",
    "שדרות הנמל 8, חיפה",
    "רח׳ התנור 3, ירושלים",
    "דרך הזית 22, הרצליה",
    "רח׳ הזהב 5, רמת גן",
    "שדרות הים 14, תל אביב-יפו",
    "רח׳ הבר 9, יפו",
    "רח׳ התבלין 17, ראשון לציון",
    "רח׳ המרתף 4, נתניה",
    "רח׳ הרחוב 31, באר שבע",
]

META_BLOCKS = {
    "flameStack": [
        ("header", "charcoal-ember-nav", "Charcoal ember sticky nav"),
        ("hero", "rising-ember-sparks", "Rising ember sparks hero"),
        ("menu", "vertical-meat-timeline", "Vertical meat timeline"),
        ("process", "ember-process-strip", "Ember process strip"),
        ("gallery", "ember-gallery-mosaic", "Ember gallery mosaic"),
        ("reviews", "ember-reviews-rail", "Ember reviews rail"),
        ("hours", "glowing-hour-chips", "Glowing hour chips + stats"),
        ("cta", "ember-home-cta", "Home CTA teaser"),
        ("menuPage", "full-meat-menu", "Full meat menu page"),
        ("grillPage", "coal-process-story", "Grill process story page"),
        ("about", "ash-timeline-portrait", "Ash timeline + pitmaster"),
        ("contact", "ember-reserve-faq", "Ember reserve + FAQ"),
        ("footer", "ember-line", "Ember line footer"),
    ],
    "steamBowl": [
        ("header", "floating-pill-nav", "Floating pill nav"),
        ("hero", "centered-bowl-steam", "Centered bowl steam hero"),
        ("dishes", "radial-circular-dishes", "Radial circular dishes"),
        ("process", "steam-process-steps", "Steam process steps"),
        ("gallery", "steam-round-gallery", "Steam round gallery"),
        ("reviews", "steam-reviews", "Steam reviews"),
        ("stats", "steam-stats-hours", "Steam stats + hours"),
        ("cta", "steam-home-cta", "Home CTA teaser"),
        ("bowlsPage", "full-bowl-menu", "Full bowls menu page"),
        ("brothPage", "broth-lab-story", "Broth lab story page"),
        ("about", "steam-timeline-chef", "Steam timeline + chef"),
        ("contact", "circular-steam-reserve", "Circular reserve + FAQ"),
        ("footer", "noodle-wave-svg", "Noodle wave footer"),
    ],
    "doughStretch": [
        ("header", "stretch-underline-logo", "Stretch underline logo nav"),
        ("hero", "diagonal-rotating-pizza", "Diagonal rotating pizza hero"),
        ("menu", "triangular-masonry", "Triangular masonry menu"),
        ("process", "crust-process-steps", "Crust process steps"),
        ("gallery", "crust-gallery", "Crust gallery"),
        ("reviews", "crust-reviews", "Crust reviews"),
        ("stats", "oven-stats-hours", "Oven stats + hours"),
        ("cta", "crust-home-cta", "Home CTA teaser"),
        ("pizzasPage", "full-pizza-menu", "Full pizza menu page"),
        ("ovenPage", "oven-story", "Oven story page"),
        ("about", "flour-timeline-chef", "Flour timeline + chef"),
        ("contact", "ticket-reserve-faq", "Ticket reserve + FAQ"),
        ("footer", "crust-edge", "Crust edge footer"),
    ],
    "mezzeMosaic": [
        ("header", "olive-branch-nav", "Olive branch underline nav"),
        ("hero", "four-tile-olive-orbs", "4-tile mosaic olive orbs hero"),
        ("platter", "horizontal-platter-scroll", "Horizontal platter scroll"),
        ("process", "mezze-process", "Mezze process"),
        ("gallery", "mezze-gallery", "Mezze gallery"),
        ("reviews", "mezze-reviews", "Mezze reviews"),
        ("stats", "mezze-stats", "Mezze stats + hours"),
        ("cta", "mezze-home-cta", "Home CTA teaser"),
        ("mezzePage", "full-mezze-menu", "Full mezze menu page"),
        ("tablePage", "shared-table-story", "Shared table story page"),
        ("about", "botanical-timeline", "Botanical timeline + chef"),
        ("contact", "garden-reserve-faq", "Garden reserve + FAQ"),
        ("footer", "mezze-shared", "Mezze footer"),
    ],
    "conveyorRail": [
        ("header", "minimal-thin-bar", "Minimal thin bar nav"),
        ("hero", "conveyor-belt-scroll", "Conveyor belt hero"),
        ("nigiri", "nigiri-snap-rail", "Nigiri snap rail"),
        ("process", "zen-process", "Zen process"),
        ("gallery", "zen-gallery", "Zen gallery"),
        ("reviews", "zen-reviews", "Zen reviews"),
        ("stats", "wasabi-pulse-stats", "Wasabi pulse stats"),
        ("cta", "zen-home-cta", "Home CTA teaser"),
        ("omakasePage", "omakase-full-menu", "Omakase full menu page"),
        ("nigiriPage", "nigiri-story", "Nigiri story page"),
        ("about", "zen-timeline-portrait", "Zen timeline + portrait"),
        ("contact", "lacquer-reserve-faq", "Lacquer reserve + FAQ"),
        ("footer", "thin-gold-line", "Thin gold footer"),
    ],
    "sunnyBrunch": [
        ("header", "airy-sunny-circle", "Airy sunny circle logo nav"),
        ("hero", "rotating-sun-rays", "Soft cream sun rays hero"),
        ("gallery", "polaroid-scatter", "Polaroid featured brunch"),
        ("process", "sunny-process", "Sunny process"),
        ("photos", "sunny-gallery", "Sunny gallery"),
        ("reviews", "sunny-reviews", "Sunny reviews"),
        ("hours", "weekend-stats-hours", "Weekend stats + hours"),
        ("cta", "sunny-home-cta", "Home CTA teaser"),
        ("brunchPage", "full-brunch-menu", "Full brunch menu page"),
        ("coffeePage", "coffee-story", "Coffee story page"),
        ("about", "note-timeline-chef", "Note timeline + chef"),
        ("contact", "postcard-reserve-faq", "Postcard reserve + FAQ"),
        ("footer", "dotted-napkin", "Dotted napkin footer"),
    ],
    "nightTapas": [
        ("header", "neon-glow-logo", "Neon glow logo nav"),
        ("hero", "cascade-small-plates", "Cascade rising plates hero"),
        ("menu", "bento-grid-tapas", "Bento grid menu"),
        ("process", "neon-process", "Neon process"),
        ("gallery", "neon-gallery", "Neon gallery"),
        ("reviews", "neon-reviews", "Neon reviews"),
        ("stats", "neon-stats", "Neon stats + hours"),
        ("cta", "neon-home-cta", "Home CTA teaser"),
        ("tapasPage", "full-tapas-menu", "Full tapas menu page"),
        ("barPage", "bar-story", "Bar story page"),
        ("about", "chalk-timeline", "Chalk timeline + chef"),
        ("contact", "bar-tab-reserve-faq", "Bar-tab reserve + FAQ"),
        ("footer", "neon-flicker", "Neon flicker footer"),
    ],
    "spiceWheel": [
        ("header", "ornate-bordered-nav", "Ornate bordered nav"),
        ("hero", "spice-particle-fall", "Spice particle fall hero"),
        ("menu", "conic-spice-wheel", "Conic-gradient spice wheel"),
        ("process", "spice-process", "Spice process"),
        ("gallery", "spice-gallery", "Spice gallery"),
        ("reviews", "spice-reviews", "Spice reviews"),
        ("stats", "spice-stats", "Spice stats + hours"),
        ("cta", "spice-home-cta", "Home CTA teaser"),
        ("thaliPage", "full-thali-menu", "Full thali menu page"),
        ("spicesPage", "spice-room-story", "Spice room story page"),
        ("about", "terra-timeline", "Terracotta timeline + chef"),
        ("contact", "thali-reserve-faq", "Thali reserve + FAQ"),
        ("footer", "spice-dots", "Spice dots footer"),
    ],
    "cellarDepth": [
        ("header", "centered-elegant-serif", "Centered elegant serif nav"),
        ("hero", "parallax-cellar-layers", "Parallax cellar depth hero"),
        ("tasting", "vertical-notes-timeline", "Vertical tasting notes"),
        ("process", "cellar-process", "Cellar process"),
        ("gallery", "cellar-gallery", "Cellar gallery"),
        ("reviews", "cellar-reviews", "Cellar reviews"),
        ("stats", "cellar-stats", "Cellar stats + hours"),
        ("cta", "cellar-home-cta", "Home CTA teaser"),
        ("winesPage", "full-wine-list", "Full wine list page"),
        ("tastingPage", "tasting-story", "Tasting story page"),
        ("about", "letterpress-timeline", "Letterpress timeline + chef"),
        ("contact", "elegant-reserve-faq", "Elegant reserve + FAQ"),
        ("footer", "vintage-stamp", "Vintage stamp footer"),
    ],
    "neonStreet": [
        ("header", "sticker-badge-nav", "Sticker badge nav"),
        ("hero", "truck-slide-neon-title", "Food truck + neon title hero"),
        ("stack", "night-market-card-stack", "Night market vertical stack"),
        ("process", "street-process", "Street process"),
        ("gallery", "street-gallery", "Street gallery"),
        ("reviews", "street-reviews", "Street reviews"),
        ("stats", "street-stats-pins", "Street stats + hours"),
        ("cta", "street-home-cta", "Home CTA teaser"),
        ("trucksPage", "full-truck-menu", "Full truck menu page"),
        ("spotsPage", "city-spots-story", "City spots story page"),
        ("about", "comic-timeline", "Comic timeline + chef"),
        ("contact", "sms-reserve-faq", "SMS reserve + FAQ"),
        ("footer", "ticket-tear", "Ticket tear footer"),
    ],
}

EXTRA_CSS = {
    "flameStack": """
@keyframes {tid}-ember-rise {{ 0% {{ transform: translateY(0) scale(1); opacity: .9; }} 100% {{ transform: translateY(-110vh) scale(.4); opacity: 0; }} }}
@keyframes {tid}-ember-pulse {{ 0%,100% {{ box-shadow: 0 0 0 0 rgba(232,93,4,.55); }} 50% {{ box-shadow: 0 0 28px 6px rgba(232,93,4,.35); }} }}
@keyframes {tid}-glow-chip {{ 0%,100% {{ filter: brightness(1); }} 50% {{ filter: brightness(1.35); }} }}
[data-template-id="{tid}"] .tpl-ember, [data-template-id="{tid}-preview"] .tpl-ember {{
  animation: {tid}-ember-rise var(--ember-dur, 7s) linear infinite;
}}
[data-template-id="{tid}"] .tpl-ember-pulse, [data-template-id="{tid}-preview"] .tpl-ember-pulse {{
  animation: {tid}-ember-pulse 2.4s ease-in-out infinite;
}}
[data-template-id="{tid}"] .tpl-glow-chip, [data-template-id="{tid}-preview"] .tpl-glow-chip {{
  animation: {tid}-glow-chip 2.8s ease-in-out infinite;
}}
[data-template-id="{tid}"] .tpl-meat-line, [data-template-id="{tid}-preview"] .tpl-meat-line {{
  position: relative;
}}
[data-template-id="{tid}"] .tpl-meat-line::before, [data-template-id="{tid}-preview"] .tpl-meat-line::before {{
  content: ""; position: absolute; right: 0; top: 0; bottom: 0; width: 2px;
  background: linear-gradient(180deg, transparent, {primary}, transparent);
}}""",
    "steamBowl": """
@keyframes {tid}-steam {{ 0% {{ transform: translateY(0) scaleX(1); opacity: .55; }} 100% {{ transform: translateY(-80vh) scaleX(1.6); opacity: 0; }} }}
@keyframes {tid}-bowl-float {{ 0%,100% {{ transform: translateY(0); }} 50% {{ transform: translateY(-12px); }} }}
@keyframes {tid}-radial-spin {{ 0% {{ transform: rotate(0deg); }} 100% {{ transform: rotate(360deg); }} }}
[data-template-id="{tid}"] .tpl-steam, [data-template-id="{tid}-preview"] .tpl-steam {{
  animation: {tid}-steam var(--steam-dur, 6s) ease-in infinite;
}}
[data-template-id="{tid}"] .tpl-bowl-float, [data-template-id="{tid}-preview"] .tpl-bowl-float {{
  animation: {tid}-bowl-float 5s ease-in-out infinite;
}}
[data-template-id="{tid}"] .tpl-radial-orbit, [data-template-id="{tid}-preview"] .tpl-radial-orbit {{
  animation: {tid}-radial-spin 40s linear infinite;
}}
[data-template-id="{tid}"] .tpl-steam-card, [data-template-id="{tid}-preview"] .tpl-steam-card {{
  backdrop-filter: blur(14px); background: rgba(255,255,255,.06); border: 1px solid rgba(255,255,255,.12);
}}""",
    "doughStretch": """
@keyframes {tid}-pizza-spin {{ 0% {{ transform: rotate(0deg); }} 100% {{ transform: rotate(360deg); }} }}
@keyframes {tid}-flour {{ 0% {{ transform: translateY(-5%) translateX(0); opacity: .7; }} 100% {{ transform: translateY(110vh) translateX(20px); opacity: .1; }} }}
@keyframes {tid}-heat-shimmer {{ 0%,100% {{ transform: skewX(0deg) scaleY(1); opacity: .35; }} 50% {{ transform: skewX(2deg) scaleY(1.04); opacity: .6; }} }}
@keyframes {tid}-stretch-line {{ 0% {{ transform: scaleX(0); }} 100% {{ transform: scaleX(1); }} }}
[data-template-id="{tid}"] .tpl-pizza-spin, [data-template-id="{tid}-preview"] .tpl-pizza-spin {{
  animation: {tid}-pizza-spin 28s linear infinite;
}}
[data-template-id="{tid}"] .tpl-flour, [data-template-id="{tid}-preview"] .tpl-flour {{
  animation: {tid}-flour var(--flour-dur, 8s) linear infinite;
}}
[data-template-id="{tid}"] .tpl-heat-shimmer, [data-template-id="{tid}-preview"] .tpl-heat-shimmer {{
  animation: {tid}-heat-shimmer 2.6s ease-in-out infinite;
}}
[data-template-id="{tid}"] .tpl-stretch-under, [data-template-id="{tid}-preview"] .tpl-stretch-under {{
  transform-origin: right center; animation: {tid}-stretch-line 1.2s cubic-bezier(.22,1,.36,1) both;
}}
[data-template-id="{tid}"] .tpl-tri-card, [data-template-id="{tid}-preview"] .tpl-tri-card {{
  clip-path: polygon(50% 0%, 100% 100%, 0% 100%);
}}""",
    "mezzeMosaic": """
@keyframes {tid}-olive-float {{ 0%,100% {{ transform: translate(0,0) rotate(0deg); }} 50% {{ transform: translate(10px,-16px) rotate(12deg); }} }}
@keyframes {tid}-platter-drift {{ 0% {{ transform: translateX(0); }} 100% {{ transform: translateX(-40%); }} }}
[data-template-id="{tid}"] .tpl-olive, [data-template-id="{tid}-preview"] .tpl-olive {{
  animation: {tid}-olive-float 6s ease-in-out infinite;
}}
[data-template-id="{tid}"] .tpl-platter-rail, [data-template-id="{tid}-preview"] .tpl-platter-rail {{
  display: flex; gap: 1.25rem; overflow-x: auto; scroll-snap-type: x mandatory; padding-bottom: .5rem;
}}
[data-template-id="{tid}"] .tpl-platter-rail > *, [data-template-id="{tid}-preview"] .tpl-platter-rail > * {{
  scroll-snap-align: start; flex: 0 0 min(280px, 78vw);
}}
[data-template-id="{tid}"] .tpl-branch-under, [data-template-id="{tid}-preview"] .tpl-branch-under {{
  height: 2px; background: linear-gradient(90deg, transparent, {primary}, transparent);
}}""",
    "conveyorRail": """
@keyframes {tid}-conveyor {{ 0% {{ transform: translateX(0); }} 100% {{ transform: translateX(-50%); }} }}
@keyframes {tid}-wasabi-pulse {{ 0%,100% {{ transform: scale(1); box-shadow: 0 0 0 0 rgba(212,175,55,.4); }} 50% {{ transform: scale(1.06); box-shadow: 0 0 20px 4px rgba(212,175,55,.25); }} }}
@keyframes {tid}-nigiri-snap {{ 0%,90%,100% {{ transform: translateY(0); }} 95% {{ transform: translateY(-6px); }} }}
[data-template-id="{tid}"] .tpl-conveyor, [data-template-id="{tid}-preview"] .tpl-conveyor {{
  display: flex; width: max-content; animation: {tid}-conveyor 22s linear infinite; gap: 1rem;
}}
[data-template-id="{tid}"] .tpl-wasabi, [data-template-id="{tid}-preview"] .tpl-wasabi {{
  animation: {tid}-wasabi-pulse 2.2s ease-in-out infinite;
}}
[data-template-id="{tid}"] .tpl-nigiri-rail, [data-template-id="{tid}-preview"] .tpl-nigiri-rail {{
  display: flex; gap: 1rem; overflow-x: auto; scroll-snap-type: x mandatory;
}}
[data-template-id="{tid}"] .tpl-nigiri-card, [data-template-id="{tid}-preview"] .tpl-nigiri-card {{
  scroll-snap-align: center; flex: 0 0 min(240px, 70vw);
  animation: {tid}-nigiri-snap 4s ease-in-out infinite;
}}""",
    "sunnyBrunch": """
@keyframes {tid}-sun-rays {{ 0% {{ transform: rotate(0deg); }} 100% {{ transform: rotate(360deg); }} }}
@keyframes {tid}-polaroid-wiggle {{ 0%,100% {{ transform: rotate(var(--rot, -4deg)); }} 50% {{ transform: rotate(calc(var(--rot, -4deg) + 3deg)) translateY(-6px); }} }}
[data-template-id="{tid}"] .tpl-sun-rays, [data-template-id="{tid}-preview"] .tpl-sun-rays {{
  animation: {tid}-sun-rays 40s linear infinite;
}}
[data-template-id="{tid}"] .tpl-polaroid, [data-template-id="{tid}-preview"] .tpl-polaroid {{
  animation: {tid}-polaroid-wiggle 5s ease-in-out infinite;
}}
[data-template-id="{tid}"] .tpl-sunny-logo, [data-template-id="{tid}-preview"] .tpl-sunny-logo {{
  border-radius: 999px; background: radial-gradient(circle at 30% 30%, {primary}88, transparent 70%);
}}
[data-template-id="{tid}"] .tpl-napkin-dot, [data-template-id="{tid}-preview"] .tpl-napkin-dot {{
  background-image: radial-gradient({primary}55 1px, transparent 1px); background-size: 10px 10px;
}}""",
    "nightTapas": """
@keyframes {tid}-plate-rise {{ 0% {{ transform: translateY(40px); opacity: 0; }} 100% {{ transform: translateY(0); opacity: 1; }} }}
@keyframes {tid}-neon-flicker {{ 0%,19%,21%,23%,25%,54%,56%,100% {{ opacity: 1; text-shadow: 0 0 12px {primary}, 0 0 28px {primary}; }} 20%,24%,55% {{ opacity: .45; text-shadow: none; }} }}
@keyframes {tid}-wine-pour {{ 0% {{ height: 0%; }} 100% {{ height: 70%; }} }}
@keyframes {tid}-marquee {{ from {{ transform: translateX(0); }} to {{ transform: translateX(50%); }} }}
[data-template-id="{tid}"] .tpl-plate-rise, [data-template-id="{tid}-preview"] .tpl-plate-rise {{
  animation: {tid}-plate-rise .9s cubic-bezier(.22,1,.36,1) both;
}}
[data-template-id="{tid}"] .tpl-neon, [data-template-id="{tid}-preview"] .tpl-neon {{
  animation: {tid}-neon-flicker 4s linear infinite; color: {primary};
}}
[data-template-id="{tid}"] .tpl-wine-fill, [data-template-id="{tid}-preview"] .tpl-wine-fill {{
  animation: {tid}-wine-pour 3.5s ease-in-out infinite alternate;
}}
[data-template-id="{tid}"] .tpl-marquee-track, [data-template-id="{tid}-preview"] .tpl-marquee-track {{
  display: flex; width: max-content; animation: {tid}-marquee 24s linear infinite;
}}""",
    "spiceWheel": """
@keyframes {tid}-spice-fall {{ 0% {{ transform: translateY(-10%) rotate(0deg); opacity: .9; }} 100% {{ transform: translateY(110vh) rotate(420deg); opacity: .15; }} }}
@keyframes {tid}-wheel-spin {{ 0% {{ transform: rotate(0deg); }} 100% {{ transform: rotate(360deg); }} }}
@keyframes {tid}-spiral-in {{ from {{ opacity: 0; transform: scale(.8) rotate(-8deg); }} to {{ opacity: 1; transform: scale(1) rotate(0); }} }}
[data-template-id="{tid}"] .tpl-spice, [data-template-id="{tid}-preview"] .tpl-spice {{
  animation: {tid}-spice-fall var(--spice-dur, 9s) linear infinite;
}}
[data-template-id="{tid}"] .tpl-spice-wheel, [data-template-id="{tid}-preview"] .tpl-spice-wheel {{
  animation: {tid}-wheel-spin 50s linear infinite;
  background: conic-gradient(from 0deg, {primary}, #e9c46a, #f4a261, {primary}, #9b2226, {primary});
}}
[data-template-id="{tid}"] .tpl-spiral-step, [data-template-id="{tid}-preview"] .tpl-spiral-step {{
  animation: {tid}-spiral-in .85s cubic-bezier(.22,1,.36,1) both;
}}""",
    "cellarDepth": """
@keyframes {tid}-depth-drift {{ 0% {{ transform: translateY(0) scale(1); }} 100% {{ transform: translateY(-24px) scale(1.04); }} }}
@keyframes {tid}-cork-float {{ 0%,100% {{ transform: translateY(0) rotate(-6deg); }} 50% {{ transform: translateY(-14px) rotate(6deg); }} }}
@keyframes {tid}-stamp {{ 0% {{ transform: scale(1.2) rotate(-8deg); opacity: 0; }} 100% {{ transform: scale(1) rotate(-8deg); opacity: 1; }} }}
[data-template-id="{tid}"] .tpl-depth-1, [data-template-id="{tid}-preview"] .tpl-depth-1 {{
  animation: {tid}-depth-drift 16s ease-in-out infinite alternate;
}}
[data-template-id="{tid}"] .tpl-depth-2, [data-template-id="{tid}-preview"] .tpl-depth-2 {{
  animation: {tid}-depth-drift 12s ease-in-out infinite alternate-reverse;
}}
[data-template-id="{tid}"] .tpl-cork, [data-template-id="{tid}-preview"] .tpl-cork {{
  animation: {tid}-cork-float 5.5s ease-in-out infinite;
}}
[data-template-id="{tid}"] .tpl-stamp, [data-template-id="{tid}-preview"] .tpl-stamp {{
  animation: {tid}-stamp .8s cubic-bezier(.22,1,.36,1) both;
}}""",
    "neonStreet": """
@keyframes {tid}-truck-slide {{ 0% {{ transform: translateX(110%); }} 100% {{ transform: translateX(-110%); }} }}
@keyframes {tid}-neon-flicker {{ 0%,18%,22%,25%,53%,57%,100% {{ opacity: 1; text-shadow: 0 0 10px {primary}, 0 0 24px {primary}; }} 20%,24%,55% {{ opacity: .4; text-shadow: none; }} }}
@keyframes {tid}-pin-bounce {{ 0%,100% {{ transform: translateY(0); }} 50% {{ transform: translateY(-12px); }} }}
@keyframes {tid}-stack-in {{ from {{ opacity: 0; transform: translateY(30px) scale(.96); }} to {{ opacity: 1; transform: translateY(0) scale(1); }} }}
[data-template-id="{tid}"] .tpl-truck, [data-template-id="{tid}-preview"] .tpl-truck {{
  animation: {tid}-truck-slide 18s linear infinite;
}}
[data-template-id="{tid}"] .tpl-neon-title, [data-template-id="{tid}-preview"] .tpl-neon-title {{
  animation: {tid}-neon-flicker 3.5s linear infinite; color: {primary};
}}
[data-template-id="{tid}"] .tpl-pin, [data-template-id="{tid}-preview"] .tpl-pin {{
  animation: {tid}-pin-bounce 1.8s ease-in-out infinite;
}}
[data-template-id="{tid}"] .tpl-stack-card, [data-template-id="{tid}-preview"] .tpl-stack-card {{
  animation: {tid}-stack-in .8s cubic-bezier(.22,1,.36,1) both;
}}
[data-template-id="{tid}"] .tpl-ticket-tear, [data-template-id="{tid}-preview"] .tpl-ticket-tear {{
  mask-image: radial-gradient(circle at 0 50%, transparent 8px, black 9px);
}}""",
}


def _p(t):
    return t["palette"]


def header_jsx(t):
    p = _p(t)
    layout = t["layout"]
    tid = t["id"]

    if layout == "flameStack":
        return f'''
    <header data-template-section-type="header" data-section-kind="header" className="sticky top-0 z-50 border-b"
      style={{{{ background: "{p['dark']}ee", borderColor: "{p['line']}", backdropFilter: "blur(10px)" }}}}>
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3.5 lg:px-8">
        <button type="button" onClick={{() => goTo("home")}} className="flex items-center gap-3 text-right">
          <span className="relative grid h-10 w-10 place-items-center text-sm font-bold" style={{{{ background: "{p['primary']}", color: "{p['primaryText']}" }}}}>
            {{v(data, "logoText")}}
            <span className="tpl-ember absolute -top-1 -left-1 h-1.5 w-1.5 rounded-full" style={{{{ background: "{p['primary']}", ["--ember-dur" as string]: "5s" }}}} />
            <span className="tpl-ember absolute top-0 left-2 h-1 w-1 rounded-full" style={{{{ background: "#ffba08", ["--ember-dur" as string]: "6.5s", animationDelay: ".4s" }}}} />
          </span>
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
    </header>'''

    if layout == "steamBowl":
        return f'''
    <header data-template-section-type="header" data-section-kind="header" className="fixed inset-x-0 top-4 z-50 px-4">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 rounded-full border px-5 py-3 shadow-lg"
        style={{{{ background: "{p['surface']}dd", borderColor: "{p['line']}", backdropFilter: "blur(16px)" }}}}>
        <button type="button" onClick={{() => goTo("home")}} className="tpl-display text-lg font-bold">{{v(data, "brandName")}}</button>
        <nav className="hidden items-center gap-5 lg:flex">
          {{nav.map(([id, label]) => (
            <button key={{id}} type="button" onClick={{() => goTo(id)}} className="text-sm font-semibold"
              style={{{{ color: currentPage === id ? "{p['primary']}" : "{p['muted']}" }}}}>{{label}}</button>
          ))}}
        </nav>
        <button type="button" onClick={{onCta}} className="rounded-full px-4 py-2 text-xs font-bold" style={{{{ background: "{p['primary']}", color: "{p['primaryText']}" }}}}>{{v(data, "heroPrimary")}}</button>
      </div>
    </header>'''

    if layout == "doughStretch":
        return f'''
    <header data-template-section-type="header" data-section-kind="header" className="sticky top-0 z-50 border-b" style={{{{ background: "{p['bg']}f5", borderColor: "{p['line']}" }}}}>
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 lg:px-8">
        <button type="button" onClick={{() => goTo("home")}} className="group text-right">
          <span className="tpl-display text-2xl font-black tracking-tight">{{v(data, "brandName")}}</span>
          <span className="tpl-stretch-under mt-1 block h-1 w-full" style={{{{ background: "{p['primary']}" }}}} />
        </button>
        <nav className="hidden items-center gap-6 lg:flex">
          {{nav.map(([id, label]) => (
            <button key={{id}} type="button" onClick={{() => goTo(id)}} className="text-sm font-bold uppercase tracking-wide"
              style={{{{ color: currentPage === id ? "{p['primary']}" : "{p['muted']}" }}}}>{{label}}</button>
          ))}}
        </nav>
        <button type="button" onClick={{onCta}} className="px-5 py-2.5 text-sm font-bold" style={{{{ background: "{p['primary']}", color: "{p['primaryText']}" }}}}>{{v(data, "heroPrimary")}}</button>
      </div>
    </header>'''

    if layout == "mezzeMosaic":
        return f'''
    <header data-template-section-type="header" data-section-kind="header" className="sticky top-0 z-50" style={{{{ background: "{p['bg']}f0" }}}}>
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 lg:px-8">
        <button type="button" onClick={{() => goTo("home")}} className="text-right">
          <span className="tpl-display text-2xl font-bold">{{v(data, "brandName")}}</span>
          <span className="tpl-branch-under mt-2 block w-24" />
        </button>
        <nav className="hidden items-center gap-6 lg:flex">
          {{nav.map(([id, label]) => (
            <button key={{id}} type="button" onClick={{() => goTo(id)}} className="relative text-sm font-semibold"
              style={{{{ color: currentPage === id ? "{p['text']}" : "{p['muted']}" }}}}>
              {{label}}
              {{currentPage === id ? <span className="absolute -bottom-1 right-0 left-0 h-px" style={{{{ background: "{p['primary']}" }}}} /> : null}}
            </button>
          ))}}
        </nav>
        <button type="button" onClick={{onCta}} className="rounded-sm px-5 py-2.5 text-sm font-bold" style={{{{ background: "{p['primary']}", color: "{p['primaryText']}" }}}}>{{v(data, "heroPrimary")}}</button>
      </div>
    </header>'''

    if layout == "conveyorRail":
        return f'''
    <header data-template-section-type="header" data-section-kind="header" className="sticky top-0 z-50 border-b" style={{{{ background: "{p['bg']}", borderColor: "{p['line']}" }}}}>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-2.5 lg:px-8">
        <button type="button" onClick={{() => goTo("home")}} className="tpl-display text-lg font-semibold tracking-[0.2em]">{{v(data, "brandName")}}</button>
        <nav className="hidden items-center gap-8 lg:flex">
          {{nav.map(([id, label]) => (
            <button key={{id}} type="button" onClick={{() => goTo(id)}} className="text-xs font-medium tracking-[0.18em] uppercase"
              style={{{{ color: currentPage === id ? "{p['primary']}" : "{p['muted']}" }}}}>{{label}}</button>
          ))}}
        </nav>
        <button type="button" onClick={{onCta}} className="border px-4 py-1.5 text-xs font-semibold tracking-wider" style={{{{ borderColor: "{p['primary']}", color: "{p['primary']}" }}}}>{{v(data, "heroPrimary")}}</button>
      </div>
    </header>'''

    if layout == "sunnyBrunch":
        return f'''
    <header data-template-section-type="header" data-section-kind="header" className="sticky top-0 z-50 bg-transparent">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 lg:px-8">
        <button type="button" onClick={{() => goTo("home")}} className="flex items-center gap-3">
          <span className="tpl-sunny-logo grid h-12 w-12 place-items-center text-sm font-bold" style={{{{ color: "{p['text']}" }}}}>{{v(data, "logoText")}}</span>
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
    </header>'''

    if layout == "nightTapas":
        return f'''
    <header data-template-section-type="header" data-section-kind="header" className="sticky top-0 z-50 border-b" style={{{{ background: "{p['dark']}f0", borderColor: "{p['line']}" }}}}>
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 lg:px-8">
        <button type="button" onClick={{() => goTo("home")}} className="tpl-neon tpl-display text-2xl font-bold tracking-tight">{{v(data, "brandName")}}</button>
        <nav className="hidden items-center gap-6 lg:flex">
          {{nav.map(([id, label]) => (
            <button key={{id}} type="button" onClick={{() => goTo(id)}} className="text-sm font-semibold uppercase tracking-wider"
              style={{{{ color: currentPage === id ? "{p['primary']}" : "{p['muted']}" }}}}>{{label}}</button>
          ))}}
        </nav>
        <button type="button" onClick={{onCta}} className="px-5 py-2.5 text-sm font-bold" style={{{{ background: "{p['primary']}", color: "{p['primaryText']}" }}}}>{{v(data, "heroPrimary")}}</button>
      </div>
    </header>'''

    if layout == "spiceWheel":
        return f'''
    <header data-template-section-type="header" data-section-kind="header" className="sticky top-0 z-50 px-4 pt-3">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 border-2 px-5 py-3 lg:px-8"
        style={{{{ background: "{p['surface']}", borderColor: "{p['primary']}", borderImage: "none" }}}}>
        <button type="button" onClick={{() => goTo("home")}} className="tpl-display text-xl font-bold">{{v(data, "brandName")}}</button>
        <nav className="hidden items-center gap-5 lg:flex">
          {{nav.map(([id, label]) => (
            <button key={{id}} type="button" onClick={{() => goTo(id)}} className="border-b-2 text-sm font-semibold"
              style={{{{ borderColor: currentPage === id ? "{p['primary']}" : "transparent", color: "{p['text']}" }}}}>{{label}}</button>
          ))}}
        </nav>
        <button type="button" onClick={{onCta}} className="px-5 py-2 text-sm font-bold" style={{{{ background: "{p['primary']}", color: "{p['primaryText']}" }}}}>{{v(data, "heroPrimary")}}</button>
      </div>
    </header>'''

    if layout == "cellarDepth":
        return f'''
    <header data-template-section-type="header" data-section-kind="header" className="sticky top-0 z-50 border-b" style={{{{ background: "{p['bg']}f5", borderColor: "{p['line']}" }}}}>
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-3 px-5 py-5">
        <button type="button" onClick={{() => goTo("home")}} className="tpl-display text-3xl font-semibold tracking-[0.12em]">{{v(data, "brandName")}}</button>
        <nav className="flex flex-wrap items-center justify-center gap-5">
          {{nav.map(([id, label]) => (
            <button key={{id}} type="button" onClick={{() => goTo(id)}} className="text-xs font-medium tracking-[0.22em] uppercase"
              style={{{{ color: currentPage === id ? "{p['primary']}" : "{p['muted']}" }}}}>{{label}}</button>
          ))}}
        </nav>
      </div>
    </header>'''

    # neonStreet
    return f'''
    <header data-template-section-type="header" data-section-kind="header" className="sticky top-0 z-50" style={{{{ background: "transparent" }}}}>
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 lg:px-8">
        <button type="button" onClick={{() => goTo("home")}} className="-rotate-2 border-2 px-4 py-2 shadow-[4px_4px_0_0_{p['primary']}]"
          style={{{{ background: "{p['surface']}", borderColor: "{p['primary']}" }}}}>
          <span className="tpl-display text-lg font-black">{{v(data, "logoText")}} · {{v(data, "brandName")}}</span>
        </button>
        <nav className="hidden items-center gap-3 lg:flex">
          {{nav.map(([id, label]) => (
            <button key={{id}} type="button" onClick={{() => goTo(id)}} className="rotate-1 border px-3 py-1.5 text-xs font-bold"
              style={{{{ borderColor: "{p['line']}", background: currentPage === id ? "{p['primary']}" : "{p['surface']}", color: currentPage === id ? "{p['primaryText']}" : "{p['text']}" }}}}>{{label}}</button>
          ))}}
        </nav>
        <button type="button" onClick={{onCta}} className="border-2 px-4 py-2 text-sm font-black" style={{{{ borderColor: "{p['primary']}", color: "{p['primary']}" }}}}>{{v(data, "heroPrimary")}}</button>
      </div>
    </header>'''


def hero_jsx(t):
    p = _p(t)
    secondary = t["pages"][1][0]
    layout = t["layout"]

    if layout == "flameStack":
        return f'''
      <section className="relative isolate min-h-[92vh] overflow-hidden">
        <img src={{v(data, "heroImage")}} alt="" className="tpl-ken absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0" style={{{{ background: "linear-gradient(180deg, {p['dark']}88, {p['bg']}ee)" }}}} />
        {{Array.from({{ length: 18 }}).map((_, i) => (
          <div key={{i}} className="tpl-ember pointer-events-none absolute rounded-full" style={{{{ left: `${{4 + i * 5.2}}%`, bottom: `-2%`, width: `${{3 + (i % 3)}}px`, height: `${{3 + (i % 3)}}px`, background: i % 2 ? "{p['primary']}" : "#ffba08", animationDelay: `${{i * 0.35}}s`, ["--ember-dur" as string]: `${{5 + (i % 5)}}s` }}}} />
        ))}}
        <div className="relative z-10 mx-auto flex min-h-[92vh] max-w-7xl flex-col justify-end px-5 pb-16 pt-28 lg:px-8">
          <p className="tpl-rise text-xs font-semibold tracking-[0.28em]" style={{{{ color: "{p['primary']}" }}}}>{{v(data, "heroEyebrow")}}</p>
          <h1 className="tpl-display tpl-rise-2 mt-4 max-w-4xl text-6xl font-bold leading-[0.92] md:text-8xl">{{v(data, "heroTitle")}}</h1>
          <p className="tpl-rise-3 mt-6 max-w-xl text-lg leading-8" style={{{{ color: "{p['muted']}" }}}}>{{v(data, "heroSubtitle")}}</p>
          <div className="tpl-rise-3 mt-8 flex flex-wrap gap-3">
            <button type="button" onClick={{onCta}} className="px-7 py-3.5 text-sm font-bold" style={{{{ background: "{p['primary']}", color: "{p['primaryText']}" }}}}>{{v(data, "heroPrimary")}}</button>
            <button type="button" onClick={{() => goTo("{secondary}")}} className="border px-7 py-3.5 text-sm font-semibold" style={{{{ borderColor: "{p['line']}" }}}}>{{v(data, "heroSecondary")}}</button>
          </div>
        </div>
      </section>'''

    if layout == "steamBowl":
        return f'''
      <section className="relative isolate flex min-h-[92vh] flex-col items-center justify-center overflow-hidden px-5 pt-28" style={{{{ background: "radial-gradient(ellipse at 50% 60%, {p['surface']}, {p['bg']})" }}}}>
        {{Array.from({{ length: 10 }}).map((_, i) => (
          <div key={{i}} className="tpl-steam pointer-events-none absolute rounded-full blur-md" style={{{{ left: `${{35 + (i % 5) * 6}}%`, bottom: "38%", width: `${{20 + i * 4}}px`, height: `${{40 + i * 8}}px`, background: "rgba(238,246,241,.18)", animationDelay: `${{i * 0.5}}s`, ["--steam-dur" as string]: `${{5 + (i % 4)}}s` }}}} />
        ))}}
        <div className="tpl-bowl-float relative z-10 mb-8 h-40 w-40 overflow-hidden rounded-full border-4 md:h-52 md:w-52" style={{{{ borderColor: "{p['primary']}" }}}}>
          <img src={{v(data, "heroImage")}} alt="" className="h-full w-full object-cover" />
        </div>
        <p className="tpl-rise text-xs font-semibold tracking-[0.28em]" style={{{{ color: "{p['primary']}" }}}}>{{v(data, "heroEyebrow")}}</p>
        <h1 className="tpl-display tpl-rise-2 mt-4 max-w-3xl text-center text-5xl font-bold leading-[0.95] md:text-7xl">{{v(data, "heroTitle")}}</h1>
        <p className="tpl-rise-3 mt-6 max-w-lg text-center text-lg leading-8" style={{{{ color: "{p['muted']}" }}}}>{{v(data, "heroSubtitle")}}</p>
        <div className="tpl-rise-3 mt-8 flex flex-wrap justify-center gap-3">
          <button type="button" onClick={{onCta}} className="rounded-full px-7 py-3.5 text-sm font-bold" style={{{{ background: "{p['primary']}", color: "{p['primaryText']}" }}}}>{{v(data, "heroPrimary")}}</button>
          <button type="button" onClick={{() => goTo("{secondary}")}} className="rounded-full border px-7 py-3.5 text-sm font-semibold" style={{{{ borderColor: "{p['line']}" }}}}>{{v(data, "heroSecondary")}}</button>
        </div>
      </section>'''

    if layout == "doughStretch":
        return f'''
      <section className="grid min-h-[88vh] lg:grid-cols-2" style={{{{ background: "{p['bg']}" }}}}>
        <div className="relative flex flex-col justify-center px-5 py-16 lg:px-12" style={{{{ clipPath: "polygon(0 0, 100% 0, 88% 100%, 0 100%)" }}}}>
          <p className="tpl-rise text-xs font-semibold tracking-[0.28em]" style={{{{ color: "{p['primary']}" }}}}>{{v(data, "heroEyebrow")}}</p>
          <h1 className="tpl-display tpl-rise-2 mt-4 text-5xl font-black leading-[0.95] md:text-7xl">{{v(data, "heroTitle")}}</h1>
          <p className="tpl-rise-3 mt-6 max-w-md text-lg leading-8" style={{{{ color: "{p['muted']}" }}}}>{{v(data, "heroSubtitle")}}</p>
          <div className="tpl-rise-3 mt-8 flex flex-wrap gap-3">
            <button type="button" onClick={{onCta}} className="px-7 py-3.5 text-sm font-bold" style={{{{ background: "{p['primary']}", color: "{p['primaryText']}" }}}}>{{v(data, "heroPrimary")}}</button>
            <button type="button" onClick={{() => goTo("{secondary}")}} className="border px-7 py-3.5 text-sm font-semibold" style={{{{ borderColor: "{p['line']}" }}}}>{{v(data, "heroSecondary")}}</button>
          </div>
        </div>
        <div className="relative flex items-center justify-center overflow-hidden py-12" style={{{{ background: "{p['surface']}" }}}}>
          <div className="tpl-pizza-spin h-64 w-64 overflow-hidden rounded-full border-8 shadow-2xl md:h-80 md:w-80" style={{{{ borderColor: "{p['primary']}" }}}}>
            <img src={{v(data, "heroImage")}} alt="" className="h-full w-full object-cover" />
          </div>
        </div>
      </section>'''

    if layout == "mezzeMosaic":
        return f'''
      <section className="relative overflow-hidden px-5 py-16 lg:px-8 lg:py-20" style={{{{ background: "{p['bg']}" }}}}>
        {{[["12%","18%"],["78%","12%"],["60%","70%"],["22%","65%"]].map(([l, top], i) => (
          <div key={{i}} className="tpl-olive pointer-events-none absolute h-4 w-3 rounded-full" style={{{{ left: l, top: top, background: i % 2 ? "{p['primary']}" : "{p['dark']}", animationDelay: `${{i * 0.6}}s` }}}} />
        ))}}
        <div className="relative z-10 mx-auto max-w-7xl">
          <div className="grid grid-cols-2 gap-2 md:gap-3">
            {{[v(data, "heroImage"), v(data, "item1Image"), v(data, "item2Image"), v(data, "item3Image")].map((src, i) => (
              <div key={{i}} className={{`overflow-hidden ${{i === 0 ? "row-span-1 aspect-[4/3]" : "aspect-square"}}`}}>
                <img src={{src}} alt="" className="tpl-ken h-full w-full object-cover" />
              </div>
            ))}}
          </div>
          <div className="mt-10 max-w-2xl">
            <p className="tpl-rise text-xs font-semibold tracking-[0.28em]" style={{{{ color: "{p['primary']}" }}}}>{{v(data, "heroEyebrow")}}</p>
            <h1 className="tpl-display tpl-rise-2 mt-4 text-5xl font-bold leading-[0.95] md:text-7xl">{{v(data, "heroTitle")}}</h1>
            <p className="tpl-rise-3 mt-6 text-lg leading-8" style={{{{ color: "{p['muted']}" }}}}>{{v(data, "heroSubtitle")}}</p>
            <div className="tpl-rise-3 mt-8 flex flex-wrap gap-3">
              <button type="button" onClick={{onCta}} className="px-7 py-3.5 text-sm font-bold" style={{{{ background: "{p['primary']}", color: "{p['primaryText']}" }}}}>{{v(data, "heroPrimary")}}</button>
              <button type="button" onClick={{() => goTo("{secondary}")}} className="border px-7 py-3.5 text-sm font-semibold" style={{{{ borderColor: "{p['line']}" }}}}>{{v(data, "heroSecondary")}}</button>
            </div>
          </div>
        </div>
      </section>'''

    if layout == "conveyorRail":
        return f'''
      <section className="relative min-h-[88vh] overflow-hidden" style={{{{ background: "{p['bg']}" }}}}>
        <div className="absolute inset-x-0 top-[30%] overflow-hidden border-y py-4" style={{{{ borderColor: "{p['primary']}44", background: "{p['surface']}" }}}}>
          <div className="tpl-conveyor">
            {{[v(data, "heroImage"), v(data, "item1Image"), v(data, "item2Image"), v(data, "item3Image"), v(data, "heroImage"), v(data, "item1Image")].map((src, i) => (
              <div key={{i}} className="h-36 w-48 flex-shrink-0 overflow-hidden md:h-44 md:w-64">
                <img src={{src}} alt="" className="h-full w-full object-cover" />
              </div>
            ))}}
          </div>
        </div>
        <div className="relative z-10 mx-auto flex min-h-[88vh] max-w-7xl flex-col justify-end px-5 pb-16 pt-28 lg:px-8">
          <p className="tpl-rise text-xs font-semibold tracking-[0.34em]" style={{{{ color: "{p['primary']}" }}}}>{{v(data, "heroEyebrow")}}</p>
          <h1 className="tpl-display tpl-rise-2 mt-4 max-w-3xl text-6xl font-bold leading-[0.92] md:text-7xl">{{v(data, "heroTitle")}}</h1>
          <p className="tpl-rise-3 mt-6 max-w-xl text-lg leading-8" style={{{{ color: "{p['muted']}" }}}}>{{v(data, "heroSubtitle")}}</p>
          <div className="tpl-rise-3 mt-8 flex flex-wrap gap-3">
            <button type="button" onClick={{onCta}} className="px-7 py-3.5 text-sm font-bold" style={{{{ background: "{p['primary']}", color: "{p['primaryText']}" }}}}>{{v(data, "heroPrimary")}}</button>
            <button type="button" onClick={{() => goTo("{secondary}")}} className="border px-7 py-3.5 text-sm font-semibold" style={{{{ borderColor: "{p['line']}" }}}}>{{v(data, "heroSecondary")}}</button>
          </div>
        </div>
      </section>'''

    if layout == "sunnyBrunch":
        return f'''
      <section className="relative min-h-[88vh] overflow-hidden px-5 py-20 lg:px-8" style={{{{ background: "{p['bg']}" }}}}>
        <div className="tpl-sun-rays pointer-events-none absolute -left-20 -top-20 h-[420px] w-[420px] opacity-40" style={{{{ background: `conic-gradient(from 0deg, transparent 0deg, {p['primary']}44 20deg, transparent 40deg, {p['primary']}33 60deg, transparent 80deg)` }}}} />
        <div className="relative z-10 mx-auto grid max-w-7xl gap-10 pt-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p className="tpl-rise text-xs font-semibold tracking-[0.28em]" style={{{{ color: "{p['primary']}" }}}}>{{v(data, "heroEyebrow")}}</p>
            <h1 className="tpl-display tpl-rise-2 mt-4 text-5xl font-bold leading-[1.02] md:text-7xl">{{v(data, "heroTitle")}}</h1>
            <p className="tpl-rise-3 mt-6 max-w-xl text-lg leading-8" style={{{{ color: "{p['muted']}" }}}}>{{v(data, "heroSubtitle")}}</p>
            <div className="tpl-rise-3 mt-8 flex flex-wrap gap-3">
              <button type="button" onClick={{onCta}} className="rounded-full px-7 py-3.5 text-sm font-bold" style={{{{ background: "{p['primary']}", color: "{p['primaryText']}" }}}}>{{v(data, "heroPrimary")}}</button>
              <button type="button" onClick={{() => goTo("{secondary}")}} className="rounded-full border px-7 py-3.5 text-sm font-semibold" style={{{{ borderColor: "{p['line']}" }}}}>{{v(data, "heroSecondary")}}</button>
            </div>
          </div>
          <div className="overflow-hidden rounded-3xl border-8 border-white shadow-xl" style={{{{ borderColor: "{p['surface']}" }}}}>
            <img src={{v(data, "heroImage")}} alt="" className="tpl-ken aspect-[4/5] w-full object-cover" />
          </div>
        </div>
      </section>'''

    if layout == "nightTapas":
        return f'''
      <section className="relative min-h-[90vh] overflow-hidden px-5 py-20 lg:px-8" style={{{{ background: "{p['bg']}" }}}}>
        <div className="absolute inset-0 opacity-30" style={{{{ backgroundImage: `url(${{v(data, "heroImage")}})`, backgroundSize: "cover" }}}} />
        <div className="absolute inset-0" style={{{{ background: "linear-gradient(180deg, {p['dark']}cc, {p['bg']})" }}}} />
        <div className="relative z-10 mx-auto max-w-7xl pt-16">
          <p className="tpl-rise text-xs font-semibold tracking-[0.28em]" style={{{{ color: "{p['primary']}" }}}}>{{v(data, "heroEyebrow")}}</p>
          <h1 className="tpl-display tpl-rise-2 tpl-neon mt-4 max-w-3xl text-5xl font-bold leading-[0.95] md:text-7xl">{{v(data, "heroTitle")}}</h1>
          <p className="tpl-rise-3 mt-6 max-w-xl text-lg leading-8" style={{{{ color: "{p['muted']}" }}}}>{{v(data, "heroSubtitle")}}</p>
          <div className="mt-12 grid grid-cols-3 gap-3 md:max-w-xl">
            {{[v(data, "item1Image"), v(data, "item2Image"), v(data, "item3Image")].map((src, i) => (
              <div key={{i}} className="tpl-plate-rise aspect-square overflow-hidden rounded-full border-2" style={{{{ borderColor: "{p['primary']}", animationDelay: `${{i * 0.15}}s` }}}}>
                <img src={{src}} alt="" className="h-full w-full object-cover" />
              </div>
            ))}}
          </div>
          <div className="tpl-rise-3 mt-10 flex flex-wrap gap-3">
            <button type="button" onClick={{onCta}} className="px-7 py-3.5 text-sm font-bold" style={{{{ background: "{p['primary']}", color: "{p['primaryText']}" }}}}>{{v(data, "heroPrimary")}}</button>
            <button type="button" onClick={{() => goTo("{secondary}")}} className="border px-7 py-3.5 text-sm font-semibold" style={{{{ borderColor: "{p['line']}" }}}}>{{v(data, "heroSecondary")}}</button>
          </div>
        </div>
      </section>'''

    if layout == "spiceWheel":
        return f'''
      <section className="relative isolate min-h-[92vh] overflow-hidden">
        <img src={{v(data, "heroImage")}} alt="" className="tpl-ken absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0" style={{{{ background: "linear-gradient(180deg, {p['dark']}99, {p['bg']}f0)" }}}} />
        {{Array.from({{ length: 16 }}).map((_, i) => (
          <div key={{i}} className="tpl-spice pointer-events-none absolute h-2 w-2 rounded-sm" style={{{{ left: `${{3 + i * 6}}%`, top: `-2%`, background: ["{p['primary']}", "#e9c46a", "#f4a261", "#9b2226"][i % 4], animationDelay: `${{i * 0.4}}s`, ["--spice-dur" as string]: `${{7 + (i % 5)}}s` }}}} />
        ))}}
        <div className="relative z-10 mx-auto flex min-h-[92vh] max-w-7xl flex-col justify-center px-5 pt-28 lg:px-8">
          <p className="tpl-rise text-xs font-semibold tracking-[0.28em]" style={{{{ color: "{p['primary']}" }}}}>{{v(data, "heroEyebrow")}}</p>
          <h1 className="tpl-display tpl-rise-2 mt-4 max-w-4xl text-5xl font-bold leading-[0.95] md:text-7xl">{{v(data, "heroTitle")}}</h1>
          <p className="tpl-rise-3 mt-6 max-w-xl text-lg leading-8" style={{{{ color: "{p['muted']}" }}}}>{{v(data, "heroSubtitle")}}</p>
          <div className="tpl-rise-3 mt-8 flex flex-wrap gap-3">
            <button type="button" onClick={{onCta}} className="px-7 py-3.5 text-sm font-bold" style={{{{ background: "{p['primary']}", color: "{p['primaryText']}" }}}}>{{v(data, "heroPrimary")}}</button>
            <button type="button" onClick={{() => goTo("{secondary}")}} className="border px-7 py-3.5 text-sm font-semibold" style={{{{ borderColor: "{p['line']}" }}}}>{{v(data, "heroSecondary")}}</button>
          </div>
        </div>
      </section>'''

    if layout == "cellarDepth":
        return f'''
      <section className="relative isolate min-h-[92vh] overflow-hidden">
        <div className="tpl-depth-1 absolute inset-0">
          <img src={{v(data, "heroImage")}} alt="" className="h-full w-full object-cover opacity-70" />
        </div>
        <div className="tpl-depth-2 absolute inset-x-0 bottom-0 h-[50%]" style={{{{ background: "linear-gradient(180deg, transparent, {p['dark']})" }}}} />
        <div className="absolute inset-0" style={{{{ background: "linear-gradient(180deg, {p['bg']}55, {p['bg']}ee)" }}}} />
        <div className="relative z-10 mx-auto flex min-h-[92vh] max-w-4xl flex-col items-center justify-center px-5 pt-28 text-center">
          <p className="tpl-rise text-xs font-semibold tracking-[0.4em]" style={{{{ color: "{p['primary']}" }}}}>{{v(data, "heroEyebrow")}}</p>
          <h1 className="tpl-display tpl-rise-2 mt-6 text-5xl font-semibold leading-[1.05] md:text-7xl">{{v(data, "heroTitle")}}</h1>
          <p className="tpl-rise-3 mt-6 max-w-lg text-lg leading-8" style={{{{ color: "{p['muted']}" }}}}>{{v(data, "heroSubtitle")}}</p>
          <div className="tpl-rise-3 mt-10 flex flex-wrap justify-center gap-3">
            <button type="button" onClick={{onCta}} className="px-8 py-3.5 text-sm font-semibold tracking-wider" style={{{{ background: "{p['primary']}", color: "{p['primaryText']}" }}}}>{{v(data, "heroPrimary")}}</button>
            <button type="button" onClick={{() => goTo("{secondary}")}} className="border px-8 py-3.5 text-sm font-semibold" style={{{{ borderColor: "{p['line']}" }}}}>{{v(data, "heroSecondary")}}</button>
          </div>
        </div>
      </section>'''

    # neonStreet
    return f'''
      <section className="relative min-h-[90vh] overflow-hidden" style={{{{ background: "{p['bg']}" }}}}>
        <div className="absolute inset-x-0 top-[40%] h-24 overflow-hidden">
          <div className="tpl-truck flex gap-6 whitespace-nowrap">
            <div className="flex h-20 w-40 items-center justify-center border-2 text-xs font-black" style={{{{ borderColor: "{p['primary']}", background: "{p['surface']}" }}}}>FOOD TRUCK</div>
            <img src={{v(data, "heroImage")}} alt="" className="h-20 w-48 object-cover" />
            <div className="flex h-20 w-40 items-center justify-center border-2 text-xs font-black" style={{{{ borderColor: "{p['primary']}", background: "{p['surface']}" }}}}>OPEN LATE</div>
          </div>
        </div>
        <div className="relative z-10 mx-auto flex min-h-[90vh] max-w-7xl flex-col justify-center px-5 pt-24 lg:px-8">
          <p className="tpl-rise text-xs font-black tracking-[0.28em]" style={{{{ color: "{p['muted']}" }}}}>{{v(data, "heroEyebrow")}}</p>
          <h1 className="tpl-display tpl-rise-2 tpl-neon-title mt-4 max-w-4xl text-5xl font-black leading-[0.95] md:text-8xl">{{v(data, "heroTitle")}}</h1>
          <p className="tpl-rise-3 mt-6 max-w-xl text-lg leading-8" style={{{{ color: "{p['muted']}" }}}}>{{v(data, "heroSubtitle")}}</p>
          <div className="tpl-rise-3 mt-8 flex flex-wrap gap-3">
            <button type="button" onClick={{onCta}} className="border-2 px-7 py-3.5 text-sm font-black" style={{{{ background: "{p['primary']}", color: "{p['primaryText']}", borderColor: "{p['primary']}" }}}}>{{v(data, "heroPrimary")}}</button>
            <button type="button" onClick={{() => goTo("{secondary}")}} className="border-2 px-7 py-3.5 text-sm font-black" style={{{{ borderColor: "{p['line']}" }}}}>{{v(data, "heroSecondary")}}</button>
          </div>
        </div>
      </section>'''


def home_sections_jsx(t):
    p = _p(t)
    layout = t["layout"]
    return _HOME_SECTIONS[layout].format(**p)


_HOME_SECTIONS = {
    "flameStack": '''
function MeatTimeline({{ data }}: {{ data: Record<string, any> }}) {{
  const cards = [1, 2, 3].map((i) => ({{
    title: v(data, `item${{i}}Title`), meta: v(data, `item${{i}}Meta`), text: v(data, `item${{i}}Text`), img: v(data, `item${{i}}Image`),
  }}));
  return (
    <section className="border-t px-5 py-16 lg:px-8 lg:py-20" style={{{{ borderColor: "{line}", background: "{surface}" }}}}>
      <div className="mx-auto max-w-3xl tpl-meat-line pr-8">
        <Reveal><h2 className="tpl-display text-4xl font-bold md:text-5xl">ציר הבשר</h2></Reveal>
        <div className="mt-10 grid gap-8">
          {{cards.map((c, i) => (
            <Reveal key={{c.title}} delayMs={{i * 100}} variant="right">
              <article className="grid gap-4 md:grid-cols-[140px_1fr] md:items-center">
                <img src={{c.img}} alt="" className="aspect-square w-full object-cover" />
                <div>
                  <p className="text-xs font-semibold tracking-[0.2em]" style={{{{ color: "{primary}" }}}}>{{c.meta}}</p>
                  <h3 className="tpl-display mt-1 text-2xl font-bold">{{c.title}}</h3>
                  <p className="mt-2 text-sm leading-7" style={{{{ color: "{muted}" }}}}>{{c.text}}</p>
                </div>
              </article>
            </Reveal>
          ))}}
        </div>
      </div>
    </section>
  );
}}

function GlowHourChips({{ data }}: {{ data: Record<string, any> }}) {{
  const chips = [["א׳–ה׳", "12:00–23:00"], ["ו׳", "12:00–15:00"], ["שבת", "סגור"]];
  return (
    <section className="border-t px-5 py-12 lg:px-8" style={{{{ borderColor: "{line}" }}}}>
      <div className="mx-auto flex max-w-7xl flex-wrap justify-center gap-4">
        {{chips.map(([d, h], i) => (
          <Reveal key={{d}} delayMs={{i * 80}} variant="scale">
            <div className="tpl-glow-chip border px-6 py-4 text-center" style={{{{ borderColor: "{primary}", background: "{surface}", animationDelay: `${{i * 0.3}}s` }}}}>
              <div className="text-xs font-bold tracking-wider" style={{{{ color: "{primary}" }}}}>{{d}}</div>
              <div className="mt-1 text-sm font-semibold">{{h}}</div>
            </div>
          </Reveal>
        ))}}
      </div>
    </section>
  );
}}''',
    "steamBowl": '''
function RadialDishes({{ data }}: {{ data: Record<string, any> }}) {{
  const cards = [1, 2, 3].map((i) => [v(data, `item${{i}}Title`), v(data, `item${{i}}Meta`), v(data, `item${{i}}Text`), v(data, `item${{i}}Image`)]);
  return (
    <section className="border-t px-5 py-16 lg:px-8 lg:py-20" style={{{{ borderColor: "{line}" }}}}>
      <div className="mx-auto max-w-7xl text-center">
        <Reveal><h2 className="tpl-display text-4xl font-bold md:text-5xl">קערות היום</h2></Reveal>
        <div className="relative mx-auto mt-14 flex max-w-3xl flex-wrap items-center justify-center gap-8">
          <div className="tpl-radial-orbit pointer-events-none absolute inset-0 rounded-full border border-dashed opacity-30" style={{{{ borderColor: "{primary}" }}}} />
          {{cards.map(([title, meta, text, img], i) => (
            <Reveal key={{title}} delayMs={{i * 100}} variant="scale">
              <article className="w-40 text-center md:w-48">
                <div className="mx-auto aspect-square overflow-hidden rounded-full border-2" style={{{{ borderColor: "{primary}" }}}}>
                  <img src={{img}} alt="" className="h-full w-full object-cover" />
                </div>
                <p className="mt-3 text-xs" style={{{{ color: "{primary}" }}}}>{{meta}}</p>
                <h3 className="tpl-display mt-1 text-lg font-bold">{{title}}</h3>
                <p className="mt-1 text-xs leading-5" style={{{{ color: "{muted}" }}}}>{{text}}</p>
              </article>
            </Reveal>
          ))}}
        </div>
      </div>
    </section>
  );
}}

function ChopstickSteps({{ data }}: {{ data: Record<string, any> }}) {{
  const steps = [["01", "ציר איטי"], ["02", "אטריות טריות"], ["03", "הרכבה חמה"]];
  return (
    <section className="border-t px-5 py-14 lg:px-8" style={{{{ borderColor: "{line}", background: "{surface}" }}}}>
      <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-3">
        {{steps.map(([n, label], i) => (
          <Reveal key={{n}} delayMs={{i * 90}} variant="up">
            <div className="relative border-r pr-4" style={{{{ borderColor: "{primary}" }}}}>
              <div className="tpl-display text-4xl font-bold" style={{{{ color: "{primary}" }}}}>{{n}}</div>
              <p className="mt-2 text-sm font-semibold">{{label}}</p>
              <div className="absolute -left-1 top-2 h-16 w-0.5 rotate-12" style={{{{ background: "{muted}" }}}} />
            </div>
          </Reveal>
        ))}}
      </div>
    </section>
  );
}}''',
    "doughStretch": '''
function TriMasonryMenu({{ data }}: {{ data: Record<string, any> }}) {{
  const cards = [1, 2, 3].map((i) => [v(data, `item${{i}}Title`), v(data, `item${{i}}Meta`), v(data, `item${{i}}Text`), v(data, `item${{i}}Image`)]);
  return (
    <section className="border-t px-5 py-16 lg:px-8 lg:py-20" style={{{{ borderColor: "{line}", background: "{surface}" }}}}>
      <div className="mx-auto max-w-7xl">
        <Reveal><h2 className="tpl-display text-4xl font-black md:text-5xl">משולשי תפריט</h2></Reveal>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {{cards.map(([title, meta, text, img], i) => (
            <Reveal key={{title}} delayMs={{i * 100}} variant="up">
              <article className="text-center">
                <div className="tpl-tri-card mx-auto aspect-square max-w-[220px] overflow-hidden bg-black">
                  <img src={{img}} alt="" className="h-full w-full object-cover" />
                </div>
                <p className="mt-4 text-xs font-bold" style={{{{ color: "{primary}" }}}}>{{meta}}</p>
                <h3 className="tpl-display mt-1 text-2xl font-black">{{title}}</h3>
                <p className="mt-2 text-sm" style={{{{ color: "{muted}" }}}}>{{text}}</p>
              </article>
            </Reveal>
          ))}}
        </div>
      </div>
    </section>
  );
}}

function OvenHeatStrip({{ data }}: {{ data: Record<string, any> }}) {{
  return (
    <section className="tpl-heat-shimmer relative overflow-hidden border-y py-10" style={{{{ borderColor: "{line}", background: `linear-gradient(90deg, {primary}22, {surface}, {primary}22)` }}}}>
      <Reveal>
        <p className="text-center tpl-display text-2xl font-black md:text-3xl">450° · 90 שניות · תנור עצים</p>
      </Reveal>
    </section>
  );
}}''',
    "mezzeMosaic": '''
function PlatterScroll({{ data }}: {{ data: Record<string, any> }}) {{
  const dishes = [1, 2, 3].map((i) => [v(data, `item${{i}}Title`), v(data, `item${{i}}Meta`), v(data, `item${{i}}Text`), v(data, `item${{i}}Image`)]);
  return (
    <section className="border-t px-5 py-16 lg:px-8 lg:py-20" style={{{{ borderColor: "{line}", background: "{surface}" }}}}>
      <div className="mx-auto max-w-7xl">
        <Reveal><h2 className="tpl-display text-4xl font-bold md:text-5xl">מגש משותף</h2></Reveal>
        <div className="tpl-platter-rail mt-10">
          {{dishes.map(([title, meta, text, img], i) => (
            <Reveal key={{title}} delayMs={{i * 80}} variant="left">
              <article className="overflow-hidden border" style={{{{ borderColor: "{line}", background: "{bg}" }}}}>
                <img src={{img}} alt="" className="aspect-[5/4] w-full object-cover" />
                <div className="p-4">
                  <p className="text-xs" style={{{{ color: "{primary}" }}}}>{{meta}}</p>
                  <h3 className="tpl-display mt-1 text-xl font-bold">{{title}}</h3>
                  <p className="mt-2 text-sm leading-6" style={{{{ color: "{muted}" }}}}>{{text}}</p>
                </div>
              </article>
            </Reveal>
          ))}}
        </div>
      </div>
    </section>
  );
}}

function ParchmentQuote({{ data }}: {{ data: Record<string, any> }}) {{
  return (
    <section className="border-y px-5 py-14 lg:px-8" style={{{{ borderColor: "{line}", background: "{bg}" }}}}>
      <Reveal variant="fade">
        <blockquote className="mx-auto max-w-3xl text-center">
          <p className="tpl-display text-2xl font-semibold leading-relaxed md:text-3xl" style={{{{ color: "{text}" }}}}>״שולחן מלא צבעים — ככה נראית אהבה ים-תיכונית.״</p>
          <footer className="mt-4 text-sm" style={{{{ color: "{muted}" }}}}>— {{v(data, "brandName")}}</footer>
        </blockquote>
      </Reveal>
    </section>
  );
}}''',
    "conveyorRail": '''
function NigiriSnapRail({{ data }}: {{ data: Record<string, any> }}) {{
  const boards = [1, 2, 3].map((i) => [v(data, `item${{i}}Title`), v(data, `item${{i}}Meta`), v(data, `item${{i}}Text`), v(data, `item${{i}}Image`)]);
  return (
    <section className="border-t px-5 py-16 lg:px-8 lg:py-20" style={{{{ borderColor: "{line}", background: "{surface}" }}}}>
      <div className="mx-auto max-w-7xl">
        <Reveal><h2 className="tpl-display text-4xl font-bold md:text-5xl">מסילת ניגירי</h2></Reveal>
        <div className="tpl-nigiri-rail mt-10 pb-2">
          {{boards.map(([title, meta, text, img], i) => (
            <article key={{title}} className="tpl-nigiri-card border p-3" style={{{{ borderColor: "{line}", background: "{bg}", animationDelay: `${{i * 0.5}}s` }}}}>
              <img src={{img}} alt="" className="aspect-[4/3] w-full object-cover" />
              <p className="mt-3 text-xs tracking-wider" style={{{{ color: "{primary}" }}}}>{{meta}}</p>
              <h3 className="tpl-display mt-1 text-xl font-bold">{{title}}</h3>
              <p className="mt-2 text-sm" style={{{{ color: "{muted}" }}}}>{{text}}</p>
            </article>
          ))}}
        </div>
      </div>
    </section>
  );
}}

function WasabiStats({{ data }}: {{ data: Record<string, any> }}) {{
  const stats = [["12", "מושבים"], ["6:00", "דג טרי"], ["18", "מנות יום"]];
  return (
    <section className="border-t px-5 py-12 lg:px-8" style={{{{ borderColor: "{line}" }}}}>
      <div className="mx-auto grid max-w-7xl grid-cols-3 gap-6 text-center">
        {{stats.map(([n, l], i) => (
          <Reveal key={{l}} delayMs={{i * 80}} variant="scale">
            <div className="tpl-wasabi mx-auto inline-block border px-6 py-5" style={{{{ borderColor: "{primary}", animationDelay: `${{i * 0.25}}s` }}}}>
              <div className="tpl-display text-4xl font-bold" style={{{{ color: "{primary}" }}}}>{{n}}</div>
              <p className="mt-2 text-xs tracking-wider" style={{{{ color: "{muted}" }}}}>{{l}}</p>
            </div>
          </Reveal>
        ))}}
      </div>
    </section>
  );
}}''',
    "sunnyBrunch": '''
function PolaroidScatter({{ data }}: {{ data: Record<string, any> }}) {{
  const shots = [1, 2, 3].map((i) => [v(data, `item${{i}}Title`), v(data, `item${{i}}Meta`), v(data, `item${{i}}Image`)]);
  const rots = ["-6deg", "4deg", "-2deg"];
  return (
    <section className="border-t px-5 py-16 lg:px-8 lg:py-20" style={{{{ borderColor: "{line}", background: "{surface}" }}}}>
      <div className="mx-auto max-w-7xl">
        <Reveal><h2 className="tpl-display text-4xl font-bold md:text-5xl">רגעי בראנץ׳</h2></Reveal>
        <div className="mt-12 flex flex-wrap items-end justify-center gap-6">
          {{shots.map(([title, meta, img], i) => (
            <Reveal key={{title}} delayMs={{i * 90}} variant="scale">
              <figure className="tpl-polaroid w-40 bg-white p-2 pb-8 shadow-lg md:w-48" style={{{{ ["--rot" as string]: rots[i], transform: `rotate(${{rots[i]}})` }}}}>
                <img src={{img}} alt="" className="aspect-square w-full object-cover" />
                <figcaption className="mt-2 text-center text-xs font-semibold" style={{{{ color: "{text}" }}}}>{{title}}</figcaption>
              </figure>
            </Reveal>
          ))}}
        </div>
      </div>
    </section>
  );
}}

function WeekendCalendar({{ data }}: {{ data: Record<string, any> }}) {{
  const days = [["ו׳", "08–15"], ["ש׳", "09–16"], ["א׳", "09–14"]];
  return (
    <section className="border-t px-5 py-12 lg:px-8" style={{{{ borderColor: "{line}" }}}}>
      <div className="mx-auto grid max-w-3xl grid-cols-3 gap-3">
        {{days.map(([d, h], i) => (
          <Reveal key={{d}} delayMs={{i * 70}} variant="up">
            <div className="border p-4 text-center" style={{{{ borderColor: "{line}", background: "{bg}" }}}}>
              <div className="tpl-display text-2xl font-bold" style={{{{ color: "{primary}" }}}}>{{d}}</div>
              <p className="mt-1 text-sm" style={{{{ color: "{muted}" }}}}>{{h}}</p>
            </div>
          </Reveal>
        ))}}
      </div>
    </section>
  );
}}''',
    "nightTapas": '''
function BentoTapas({{ data }}: {{ data: Record<string, any> }}) {{
  const cards = [1, 2, 3].map((i) => [v(data, `item${{i}}Title`), v(data, `item${{i}}Meta`), v(data, `item${{i}}Text`), v(data, `item${{i}}Image`)]);
  return (
    <section className="border-t px-5 py-16 lg:px-8 lg:py-20" style={{{{ borderColor: "{line}" }}}}>
      <div className="mx-auto max-w-7xl">
        <Reveal><h2 className="tpl-display text-4xl font-bold md:text-5xl">בנטו לילה</h2></Reveal>
        <div className="mt-10 grid gap-3 md:grid-cols-4 md:grid-rows-2">
          {{cards.map(([title, meta, text, img], i) => (
            <Reveal key={{title}} delayMs={{i * 80}} variant="up" className={{i === 0 ? "md:col-span-2 md:row-span-2" : ""}}>
              <article className="h-full overflow-hidden border" style={{{{ borderColor: "{line}", background: "{surface}" }}}}>
                <img src={{img}} alt="" className={{i === 0 ? "aspect-[4/3] w-full object-cover md:aspect-auto md:h-[70%]" : "aspect-[4/3] w-full object-cover"}} />
                <div className="p-4">
                  <p className="text-xs font-semibold" style={{{{ color: "{primary}" }}}}>{{meta}}</p>
                  <h3 className="tpl-display mt-1 text-xl font-bold">{{title}}</h3>
                  <p className="mt-1 text-sm" style={{{{ color: "{muted}" }}}}>{{text}}</p>
                </div>
              </article>
            </Reveal>
          ))}}
        </div>
      </div>
    </section>
  );
}}

function NightMarquee({{ data }}: {{ data: Record<string, any> }}) {{
  const tags = ["TAPAS", "NEON", "WINE", "LATE", "SHARE", "TAPAS", "NEON", "WINE"];
  return (
    <section className="overflow-hidden border-y py-3" style={{{{ borderColor: "{line}", background: "{surface}" }}}}>
      <div className="tpl-marquee-track gap-8 px-4 text-sm font-bold tracking-[0.28em]" style={{{{ color: "{primary}" }}}}>
        {{tags.map((x, i) => <span key={{i}} className="whitespace-nowrap">{{x}} ·</span>)}}
      </div>
    </section>
  );
}}

function WinePour({{ data }}: {{ data: Record<string, any> }}) {{
  const bottles = [["אדום", "{primary}"], ["לבן", "{muted}"], ["רוזה", "#ff8fab"]];
  return (
    <section className="border-t px-5 py-14 lg:px-8" style={{{{ borderColor: "{line}" }}}}>
      <div className="mx-auto flex max-w-3xl justify-center gap-8">
        {{bottles.map(([name, color], i) => (
          <Reveal key={{name}} delayMs={{i * 100}} variant="up">
            <div className="flex flex-col items-center">
              <div className="relative h-32 w-10 overflow-hidden rounded-t-full border" style={{{{ borderColor: "{line}", background: "{dark}" }}}}>
                <div className="tpl-wine-fill absolute inset-x-0 bottom-0" style={{{{ background: color, animationDelay: `${{i * 0.4}}s` }}}} />
              </div>
              <p className="mt-3 text-xs font-bold tracking-wider">{{name}}</p>
            </div>
          </Reveal>
        ))}}
      </div>
    </section>
  );
}}''',
    "spiceWheel": '''
function SpiceWheelMenu({{ data }}: {{ data: Record<string, any> }}) {{
  const cards = [1, 2, 3].map((i) => [v(data, `item${{i}}Title`), v(data, `item${{i}}Meta`), v(data, `item${{i}}Text`)]);
  return (
    <section className="border-t px-5 py-16 lg:px-8 lg:py-20" style={{{{ borderColor: "{line}", background: "{surface}" }}}}>
      <div className="mx-auto max-w-7xl">
        <Reveal><h2 className="tpl-display text-4xl font-bold md:text-5xl">גלגל התבלינים</h2></Reveal>
        <div className="mt-12 grid items-center gap-10 lg:grid-cols-[280px_1fr]">
          <div className="tpl-spice-wheel mx-auto h-56 w-56 rounded-full border-4 p-8" style={{{{ borderColor: "{bg}" }}}}>
            <div className="flex h-full w-full items-center justify-center rounded-full text-center text-sm font-bold" style={{{{ background: "{bg}" }}}}>THALI</div>
          </div>
          <div className="grid gap-4">
            {{cards.map(([title, meta, text], i) => (
              <Reveal key={{title}} delayMs={{i * 90}} variant="right">
                <div className="border-r-4 pr-4" style={{{{ borderColor: "{primary}" }}}}>
                  <p className="text-xs" style={{{{ color: "{primary}" }}}}>{{meta}}</p>
                  <h3 className="tpl-display mt-1 text-2xl font-bold">{{title}}</h3>
                  <p className="mt-1 text-sm" style={{{{ color: "{muted}" }}}}>{{text}}</p>
                </div>
              </Reveal>
            ))}}
          </div>
        </div>
      </div>
    </section>
  );
}}

function SpiralRecipe({{ data }}: {{ data: Record<string, any> }}) {{
  const steps = [["1", "לטגן בצל"], ["2", "להוסיף מסאלה"], ["3", "לבשל לאט"], ["4", "להגיש חם"]];
  return (
    <section className="border-t px-5 py-14 lg:px-8" style={{{{ borderColor: "{line}" }}}}>
      <div className="mx-auto flex max-w-4xl flex-wrap justify-center gap-4">
        {{steps.map(([n, label], i) => (
          <Reveal key={{n}} delayMs={{i * 80}} variant="scale">
            <div className="tpl-spiral-step border px-5 py-4 text-center" style={{{{ borderColor: "{line}", background: "{surface}", animationDelay: `${{i * 0.1}}s`, transform: `rotate(${{(i - 1.5) * 4}}deg)` }}}}>
              <div className="text-2xl font-bold" style={{{{ color: "{primary}" }}}}>{{n}}</div>
              <p className="mt-1 text-sm">{{label}}</p>
            </div>
          </Reveal>
        ))}}
      </div>
    </section>
  );
}}''',
    "cellarDepth": '''
function TastingTimeline({{ data }}: {{ data: Record<string, any> }}) {{
  const notes = [1, 2, 3].map((i) => [v(data, `item${{i}}Title`), v(data, `item${{i}}Meta`), v(data, `item${{i}}Text`)]);
  return (
    <section className="border-t px-5 py-16 lg:px-8 lg:py-20" style={{{{ borderColor: "{line}" }}}}>
      <div className="mx-auto max-w-3xl">
        <Reveal><h2 className="tpl-display text-4xl font-semibold md:text-5xl">הערות טעימה</h2></Reveal>
        <div className="relative mt-12">
          <div className="absolute right-3 top-0 bottom-0 w-px" style={{{{ background: "{line}" }}}} />
          {{notes.map(([title, meta, text], i) => (
            <Reveal key={{title}} delayMs={{i * 100}} variant="right">
              <div className="relative grid gap-2 pb-10 pr-12">
                <div className="absolute right-1.5 top-1 h-3 w-3 rounded-full border-2" style={{{{ borderColor: "{primary}", background: "{bg}" }}}} />
                <p className="text-xs tracking-[0.2em]" style={{{{ color: "{primary}" }}}}>{{meta}}</p>
                <h3 className="tpl-display text-2xl font-semibold">{{title}}</h3>
                <p className="text-sm leading-7" style={{{{ color: "{muted}" }}}}>{{text}}</p>
              </div>
            </Reveal>
          ))}}
        </div>
      </div>
    </section>
  );
}}

function CorkBadges({{ data }}: {{ data: Record<string, any> }}) {{
  const corks = ["אדום", "לבן", "מבעבע", "טבעי"];
  return (
    <section className="border-t px-5 py-12 lg:px-8" style={{{{ borderColor: "{line}", background: "{surface}" }}}}>
      <div className="mx-auto flex max-w-7xl flex-wrap justify-center gap-5">
        {{corks.map((c, i) => (
          <Reveal key={{c}} delayMs={{i * 70}} variant="scale">
            <div className="tpl-cork flex h-16 w-12 items-center justify-center rounded-sm text-[10px] font-bold tracking-wider" style={{{{ background: "#c4a574", color: "{dark}", animationDelay: `${{i * 0.3}}s` }}}}>{{c}}</div>
          </Reveal>
        ))}}
      </div>
    </section>
  );
}}''',
    "neonStreet": '''
function NightCardStack({{ data }}: {{ data: Record<string, any> }}) {{
  const cards = [1, 2, 3].map((i) => [v(data, `item${{i}}Title`), v(data, `item${{i}}Meta`), v(data, `item${{i}}Text`), v(data, `item${{i}}Image`)]);
  return (
    <section className="border-t px-5 py-16 lg:px-8 lg:py-20" style={{{{ borderColor: "{line}" }}}}>
      <div className="mx-auto max-w-lg">
        <Reveal><h2 className="tpl-display text-4xl font-black md:text-5xl">ערימת לילה</h2></Reveal>
        <div className="relative mt-10 space-y-4">
          {{cards.map(([title, meta, text, img], i) => (
            <Reveal key={{title}} delayMs={{i * 100}} variant="up">
              <article className="tpl-stack-card flex gap-4 border-2 p-3" style={{{{ borderColor: "{primary}", background: "{surface}", animationDelay: `${{i * 0.1}}s`, transform: `rotate(${{(i - 1) * 1.5}}deg)` }}}}>
                <img src={{img}} alt="" className="h-20 w-20 object-cover" />
                <div>
                  <p className="text-xs font-black" style={{{{ color: "{primary}" }}}}>{{meta}}</p>
                  <h3 className="tpl-display text-xl font-black">{{title}}</h3>
                  <p className="text-xs" style={{{{ color: "{muted}" }}}}>{{text}}</p>
                </div>
              </article>
            </Reveal>
          ))}}
        </div>
      </div>
    </section>
  );
}}

function BouncePins({{ data }}: {{ data: Record<string, any> }}) {{
  const pins = [["דיזנגוף", "עכשיו"], ["נמל ת״א", "21:00"], ["רוטשילד", "מחר"]];
  return (
    <section className="border-t px-5 py-12 lg:px-8" style={{{{ borderColor: "{line}", background: "{surface}" }}}}>
      <div className="mx-auto flex max-w-7xl flex-wrap justify-center gap-8">
        {{pins.map(([place, when], i) => (
          <Reveal key={{place}} delayMs={{i * 80}} variant="up">
            <div className="text-center">
              <div className="tpl-pin mx-auto h-4 w-4 rounded-full" style={{{{ background: "{primary}", animationDelay: `${{i * 0.2}}s` }}}} />
              <p className="mt-2 text-sm font-black">{{place}}</p>
              <p className="text-xs" style={{{{ color: "{muted}" }}}}>{{when}}</p>
            </div>
          </Reveal>
        ))}}
      </div>
    </section>
  );
}}''',
}

HOME_SECTION_USE = {
    "flameStack": ["<MeatTimeline data={data} />", "<GlowHourChips data={data} />"],
    "steamBowl": ["<RadialDishes data={data} />", "<ChopstickSteps data={data} />"],
    "doughStretch": ["<TriMasonryMenu data={data} />", "<OvenHeatStrip data={data} />"],
    "mezzeMosaic": ["<PlatterScroll data={data} />", "<ParchmentQuote data={data} />"],
    "conveyorRail": ["<NigiriSnapRail data={data} />", "<WasabiStats data={data} />"],
    "sunnyBrunch": ["<PolaroidScatter data={data} />", "<WeekendCalendar data={data} />"],
    "nightTapas": ["<BentoTapas data={data} />", "<NightMarquee data={data} />", "<WinePour data={data} />"],
    "spiceWheel": ["<SpiceWheelMenu data={data} />", "<SpiralRecipe data={data} />"],
    "cellarDepth": ["<TastingTimeline data={data} />", "<CorkBadges data={data} />"],
    "neonStreet": ["<NightCardStack data={data} />", "<BouncePins data={data} />"],
}

def about_jsx(t):
    p = _p(t)
    layout = t["layout"]

    if layout == "flameStack":
        return f'''
    <section className="relative border-t overflow-hidden" style={{{{ borderColor: "{p['line']}" }}}}>
      <div className="absolute inset-0 opacity-20" style={{{{ backgroundImage: "radial-gradient({p['muted']} 1px, transparent 1px)", backgroundSize: "6px 6px" }}}} />
      <div className="relative mx-auto grid max-w-7xl lg:grid-cols-[0.9fr_1.1fr]">
        <div className="order-2 min-h-[360px] overflow-hidden lg:order-1"><img src={{v(data, "aboutImage")}} alt="" className="tpl-ken h-full w-full object-cover" /></div>
        <div className="order-1 px-5 py-16 lg:order-2 lg:px-8 lg:py-20">
          <p className="text-xs font-semibold tracking-[0.24em]" style={{{{ color: "{p['primary']}" }}}}>אודות</p>
          <h2 className="tpl-display mt-4 text-4xl font-bold md:text-5xl">{{v(data, "aboutTitle")}}</h2>
          <p className="mt-6 max-w-xl text-lg leading-8" style={{{{ color: "{p['muted']}" }}}}>{{v(data, "aboutText")}}</p>
        </div>
      </div>
    </section>'''

    if layout == "steamBowl":
        return f'''
    <section className="border-t px-5 py-16 lg:px-8 lg:py-20" style={{{{ borderColor: "{p['line']}", background: "{p['surface']}" }}}}>
      <div className="mx-auto max-w-3xl space-y-4">
        <Reveal>
          <div className="tpl-steam-card rounded-2xl p-6">
            <p className="text-xs font-semibold tracking-[0.24em]" style={{{{ color: "{p['primary']}" }}}}>אודות</p>
            <h2 className="tpl-display mt-3 text-3xl font-bold md:text-4xl">{{v(data, "aboutTitle")}}</h2>
          </div>
        </Reveal>
        <Reveal delayMs={{100}}>
          <div className="tpl-steam-card rounded-2xl p-6">
            <p className="text-lg leading-8" style={{{{ color: "{p['muted']}" }}}}>{{v(data, "aboutText")}}</p>
          </div>
        </Reveal>
        <Reveal delayMs={{180}} variant="scale">
          <div className="tpl-steam-card overflow-hidden rounded-2xl">
            <img src={{v(data, "aboutImage")}} alt="" className="aspect-[21/9] w-full object-cover" />
          </div>
        </Reveal>
      </div>
    </section>'''

    if layout == "doughStretch":
        return f'''
    <section className="relative border-t overflow-hidden px-5 py-16 lg:px-8 lg:py-20" style={{{{ borderColor: "{p['line']}" }}}}>
      {{Array.from({{ length: 12 }}).map((_, i) => (
        <div key={{i}} className="tpl-flour pointer-events-none absolute h-1.5 w-1.5 rounded-full bg-white/70" style={{{{ left: `${{8 + i * 7}}%`, top: `-2%`, animationDelay: `${{i * 0.45}}s`, ["--flour-dur" as string]: `${{7 + (i % 4)}}s` }}}} />
      ))}}
      <div className="relative z-10 mx-auto grid max-w-7xl gap-10 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="text-xs font-bold tracking-[0.24em]" style={{{{ color: "{p['primary']}" }}}}>אודות</p>
          <h2 className="tpl-display mt-4 text-4xl font-black md:text-5xl">{{v(data, "aboutTitle")}}</h2>
          <p className="mt-6 text-lg leading-8" style={{{{ color: "{p['muted']}" }}}}>{{v(data, "aboutText")}}</p>
        </div>
        <img src={{v(data, "aboutImage")}} alt="" className="aspect-[4/3] w-full object-cover border" style={{{{ borderColor: "{p['line']}" }}}} />
      </div>
    </section>'''

    if layout == "mezzeMosaic":
        return f'''
    <section className="border-t px-5 py-16 lg:px-8 lg:py-20" style={{{{ borderColor: "{p['line']}", background: "{p['surface']}" }}}}>
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr] lg:items-end">
          <div>
            <p className="text-xs font-semibold tracking-[0.24em]" style={{{{ color: "{p['primary']}" }}}}>מהגינה</p>
            <h2 className="tpl-display mt-4 text-4xl font-bold md:text-5xl">{{v(data, "aboutTitle")}}</h2>
          </div>
          <p className="text-lg leading-8" style={{{{ color: "{p['muted']}" }}}}>{{v(data, "aboutText")}}</p>
        </div>
        <div className="mt-10 grid grid-cols-3 gap-2">
          <img src={{v(data, "aboutImage")}} alt="" className="col-span-2 aspect-[16/10] w-full object-cover" />
          <div className="flex flex-col justify-between border p-4" style={{{{ borderColor: "{p['line']}", background: "{p['bg']}" }}}}>
            <span className="inline-block h-8 w-8 rounded-full" style={{{{ background: "{p['primary']}" }}}} />
            <p className="text-sm font-semibold">עשבי תיבול טריים כל בוקר</p>
          </div>
        </div>
      </div>
    </section>'''

    if layout == "conveyorRail":
        return f'''
    <section className="border-t px-5 py-20 lg:px-8" style={{{{ borderColor: "{p['line']}" }}}}>
      <div className="mx-auto flex max-w-xl flex-col items-center text-center">
        <div className="h-72 w-56 overflow-hidden border" style={{{{ borderColor: "{p['primary']}" }}}}>
          <img src={{v(data, "aboutImage")}} alt="" className="tpl-ken h-full w-full object-cover" />
        </div>
        <p className="mt-8 text-xs tracking-[0.34em]" style={{{{ color: "{p['primary']}" }}}}>אודות</p>
        <h2 className="tpl-display mt-3 text-4xl font-bold">{{v(data, "aboutTitle")}}</h2>
        <p className="mt-5 text-lg leading-8" style={{{{ color: "{p['muted']}" }}}}>{{v(data, "aboutText")}}</p>
      </div>
    </section>'''

    if layout == "sunnyBrunch":
        return f'''
    <section className="border-t px-5 py-16 lg:px-8 lg:py-20" style={{{{ borderColor: "{p['line']}" }}}}>
      <div className="mx-auto max-w-2xl -rotate-1 border-2 border-dashed bg-white p-8 shadow-md" style={{{{ borderColor: "{p['primary']}", color: "{p['text']}" }}}}>
        <p className="text-xs font-semibold tracking-[0.2em]" style={{{{ color: "{p['primary']}" }}}}>פתק מהשף</p>
        <h2 className="tpl-display mt-4 text-3xl font-bold md:text-4xl">{{v(data, "aboutTitle")}}</h2>
        <p className="mt-5 text-lg leading-8" style={{{{ color: "{p['muted']}" }}}}>{{v(data, "aboutText")}}</p>
        <img src={{v(data, "aboutImage")}} alt="" className="mt-6 aspect-[16/9] w-full object-cover" />
      </div>
    </section>'''

    if layout == "nightTapas":
        return f'''
    <section className="border-t px-5 py-16 lg:px-8 lg:py-20" style={{{{ borderColor: "{p['line']}", background: "#1a1520" }}}}>
      <div className="mx-auto max-w-3xl border-2 border-dashed p-8 md:p-12" style={{{{ borderColor: "{p['muted']}" }}}}>
        <p className="text-xs font-bold tracking-[0.28em] uppercase" style={{{{ color: "{p['primary']}" }}}}>Chalkboard</p>
        <h2 className="tpl-display mt-4 text-4xl font-bold md:text-5xl" style={{{{ color: "#f8f4e8" }}}}>{{v(data, "aboutTitle")}}</h2>
        <p className="mt-6 text-lg leading-8" style={{{{ color: "{p['muted']}" }}}}>{{v(data, "aboutText")}}</p>
      </div>
    </section>'''

    if layout == "spiceWheel":
        return f'''
    <section className="border-t overflow-hidden" style={{{{ borderColor: "{p['line']}", background: "linear-gradient(135deg, {p['surface']}, #3d2314)" }}}}>
      <div className="mx-auto grid max-w-7xl lg:grid-cols-2">
        <div className="px-5 py-16 lg:px-8 lg:py-20">
          <p className="text-xs font-semibold tracking-[0.24em]" style={{{{ color: "{p['primary']}" }}}}>אודות</p>
          <h2 className="tpl-display mt-4 text-4xl font-bold md:text-5xl">{{v(data, "aboutTitle")}}</h2>
          <p className="mt-6 text-lg leading-8" style={{{{ color: "{p['muted']}" }}}}>{{v(data, "aboutText")}}</p>
        </div>
        <div className="relative min-h-[320px]">
          <img src={{v(data, "aboutImage")}} alt="" className="absolute inset-0 h-full w-full object-cover opacity-80" />
          <div className="absolute inset-0" style={{{{ background: "radial-gradient(circle at 70% 40%, #e9c46a55, transparent 50%)" }}}} />
        </div>
      </div>
    </section>'''

    if layout == "cellarDepth":
        return f'''
    <section className="border-t px-5 py-16 lg:px-8 lg:py-20" style={{{{ borderColor: "{p['line']}", background: "{p['surface']}" }}}}>
      <div className="mx-auto max-w-3xl border px-8 py-12 text-center" style={{{{ borderColor: "{p['line']}" }}}}>
        <p className="text-xs tracking-[0.4em]" style={{{{ color: "{p['primary']}" }}}}>LETTERPRESS</p>
        <h2 className="tpl-display mt-5 text-4xl font-semibold md:text-5xl">{{v(data, "aboutTitle")}}</h2>
        <div className="mx-auto mt-6 h-px w-24" style={{{{ background: "{p['primary']}" }}}} />
        <p className="mt-6 text-lg leading-8" style={{{{ color: "{p['muted']}" }}}}>{{v(data, "aboutText")}}</p>
        <img src={{v(data, "aboutImage")}} alt="" className="mx-auto mt-8 aspect-[21/9] w-full max-w-lg object-cover opacity-90" />
      </div>
    </section>'''

    # neonStreet
    return f'''
    <section className="border-t px-5 py-16 lg:px-8 lg:py-20" style={{{{ borderColor: "{p['line']}" }}}}>
      <div className="mx-auto grid max-w-4xl gap-0 border-4 md:grid-cols-2" style={{{{ borderColor: "{p['text']}" }}}}>
        <div className="border-b-4 p-6 md:border-b-0 md:border-l-4" style={{{{ borderColor: "{p['text']}", background: "{p['surface']}" }}}}>
          <p className="text-xs font-black uppercase" style={{{{ color: "{p['primary']}" }}}}>Comic · 01</p>
          <h2 className="tpl-display mt-3 text-3xl font-black">{{v(data, "aboutTitle")}}</h2>
          <p className="mt-4 text-sm leading-7" style={{{{ color: "{p['muted']}" }}}}>{{v(data, "aboutText")}}</p>
        </div>
        <div className="relative min-h-[240px]">
          <img src={{v(data, "aboutImage")}} alt="" className="absolute inset-0 h-full w-full object-cover" />
          <span className="absolute bottom-3 left-3 border-2 px-2 py-1 text-xs font-black" style={{{{ background: "{p['primary']}", color: "{p['primaryText']}", borderColor: "{p['text']}" }}}}>POW!</span>
        </div>
      </div>
    </section>'''


def contact_jsx(t):
    p = _p(t)
    layout = t["layout"]

    if layout == "flameStack":
        return f'''
    <section className="border-t px-5 py-16 lg:px-8 lg:py-20" style={{{{ borderColor: "{p['line']}", background: "{p['surface']}" }}}}>
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2">
        <div>
          <p className="text-xs font-semibold tracking-[0.24em]" style={{{{ color: "{p['primary']}" }}}}>הזמנה</p>
          <h2 className="tpl-display mt-4 text-4xl font-bold md:text-5xl">{{v(data, "contactTitle")}}</h2>
          <p className="mt-6 text-lg leading-8" style={{{{ color: "{p['muted']}" }}}}>{{v(data, "contactText")}}</p>
          <div className="mt-8 space-y-2 text-sm" style={{{{ color: "{p['muted']}" }}}}>
            <p>{{v(data, "phone")}}</p><p>{{v(data, "email")}}</p><p>{{v(data, "address")}}</p>
          </div>
        </div>
        <form className="tpl-ember-pulse grid gap-3 border p-6" style={{{{ borderColor: "{p['primary']}" }}}} onSubmit={{(e) => e.preventDefault()}}>
          <input className="w-full border bg-transparent px-4 py-3.5 text-right outline-none" style={{{{ borderColor: "{p['line']}", color: "{p['text']}" }}}} placeholder="שם מלא" />
          <input className="w-full border bg-transparent px-4 py-3.5 text-right outline-none" style={{{{ borderColor: "{p['line']}", color: "{p['text']}" }}}} placeholder="טלפון" />
          <input className="w-full border bg-transparent px-4 py-3.5 text-right outline-none" style={{{{ borderColor: "{p['line']}", color: "{p['text']}" }}}} placeholder="תאריך" />
          <button type="button" onClick={{onCta}} className="px-6 py-4 text-sm font-bold" style={{{{ background: "{p['primary']}", color: "{p['primaryText']}" }}}}>{{v(data, "cta")}}</button>
        </form>
      </div>
    </section>'''

    if layout == "steamBowl":
        return f'''
    <section className="border-t px-5 py-16 lg:px-8 lg:py-20" style={{{{ borderColor: "{p['line']}" }}}}>
      <div className="mx-auto flex max-w-xl flex-col items-center text-center">
        <h2 className="tpl-display text-4xl font-bold">{{v(data, "contactTitle")}}</h2>
        <p className="mt-4 text-lg" style={{{{ color: "{p['muted']}" }}}}>{{v(data, "contactText")}}</p>
        <form className="tpl-steam-card mt-8 grid w-full max-w-md gap-3 rounded-full border p-8" style={{{{ borderColor: "{p['primary']}" }}}} onSubmit={{(e) => e.preventDefault()}}>
          <input className="w-full rounded-full border bg-transparent px-4 py-3 text-center outline-none" style={{{{ borderColor: "{p['line']}" }}}} placeholder="שם" />
          <input className="w-full rounded-full border bg-transparent px-4 py-3 text-center outline-none" style={{{{ borderColor: "{p['line']}" }}}} placeholder="טלפון" />
          <button type="button" onClick={{onCta}} className="rounded-full px-6 py-3 text-sm font-bold" style={{{{ background: "{p['primary']}", color: "{p['primaryText']}" }}}}>{{v(data, "cta")}}</button>
        </form>
        <p className="mt-6 text-sm" style={{{{ color: "{p['muted']}" }}}}>{{v(data, "phone")}} · {{v(data, "email")}}</p>
      </div>
    </section>'''

    if layout == "doughStretch":
        return f'''
    <section className="border-t px-5 py-16 lg:px-8 lg:py-20" style={{{{ borderColor: "{p['line']}", background: "{p['surface']}" }}}}>
      <div className="mx-auto max-w-lg">
        <div className="relative border-2 bg-white p-6 shadow-lg" style={{{{ borderColor: "{p['dark']}", borderStyle: "dashed" }}}}>
          <p className="text-center text-xs font-black tracking-[0.3em]">ORDER TICKET</p>
          <h2 className="tpl-display mt-3 text-center text-3xl font-black">{{v(data, "contactTitle")}}</h2>
          <p className="mt-3 text-center text-sm" style={{{{ color: "{p['muted']}" }}}}>{{v(data, "contactText")}}</p>
          <form className="mt-6 grid gap-3" onSubmit={{(e) => e.preventDefault()}}>
            <input className="border-b bg-transparent px-2 py-3 text-right outline-none" style={{{{ borderColor: "{p['line']}" }}}} placeholder="שם" />
            <input className="border-b bg-transparent px-2 py-3 text-right outline-none" style={{{{ borderColor: "{p['line']}" }}}} placeholder="כתובת" />
            <input className="border-b bg-transparent px-2 py-3 text-right outline-none" style={{{{ borderColor: "{p['line']}" }}}} placeholder="טלפון" />
            <button type="button" onClick={{onCta}} className="mt-2 px-6 py-3 text-sm font-bold" style={{{{ background: "{p['primary']}", color: "{p['primaryText']}" }}}}>{{v(data, "cta")}}</button>
          </form>
          <p className="mt-4 text-center text-xs" style={{{{ color: "{p['muted']}" }}}}>{{v(data, "address")}}</p>
        </div>
      </div>
    </section>'''

    if layout == "mezzeMosaic":
        return f'''
    <section className="border-t px-5 py-16 lg:px-8 lg:py-20" style={{{{ borderColor: "{p['line']}", background: "{p['bg']}" }}}}>
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_1fr] lg:items-start">
        <div className="border p-8" style={{{{ borderColor: "{p['line']}", background: "{p['surface']}" }}}}>
          <p className="text-xs tracking-[0.24em]" style={{{{ color: "{p['primary']}" }}}}>שולחן גן</p>
          <h2 className="tpl-display mt-3 text-4xl font-bold">{{v(data, "contactTitle")}}</h2>
          <p className="mt-4 leading-8" style={{{{ color: "{p['muted']}" }}}}>{{v(data, "contactText")}}</p>
          <div className="mt-6 space-y-1 text-sm" style={{{{ color: "{p['muted']}" }}}}>
            <p>{{v(data, "phone")}}</p><p>{{v(data, "email")}}</p><p>{{v(data, "address")}}</p>
          </div>
        </div>
        <form className="grid gap-3" onSubmit={{(e) => e.preventDefault()}}>
          <input className="w-full border bg-transparent px-4 py-3.5 text-right outline-none" style={{{{ borderColor: "{p['line']}" }}}} placeholder="שם מלא" />
          <input className="w-full border bg-transparent px-4 py-3.5 text-right outline-none" style={{{{ borderColor: "{p['line']}" }}}} placeholder="טלפון" />
          <input className="w-full border bg-transparent px-4 py-3.5 text-right outline-none" style={{{{ borderColor: "{p['line']}" }}}} placeholder="מספר סועדים" />
          <button type="button" onClick={{onCta}} className="px-6 py-4 text-sm font-bold" style={{{{ background: "{p['primary']}", color: "{p['primaryText']}" }}}}>{{v(data, "cta")}}</button>
        </form>
      </div>
    </section>'''

    if layout == "conveyorRail":
        return f'''
    <section className="border-t px-5 py-16 lg:px-8 lg:py-20" style={{{{ borderColor: "{p['line']}", background: "{p['dark']}" }}}}>
      <div className="mx-auto max-w-xl border p-8" style={{{{ borderColor: "{p['primary']}" }}}}>
        <div className="mb-6 h-px w-full" style={{{{ background: "linear-gradient(90deg, transparent, {p['primary']}, transparent)" }}}} />
        <h2 className="tpl-display text-center text-3xl font-bold">{{v(data, "contactTitle")}}</h2>
        <p className="mt-3 text-center text-sm" style={{{{ color: "{p['muted']}" }}}}>{{v(data, "contactText")}}</p>
        <form className="mt-8 grid gap-3" onSubmit={{(e) => e.preventDefault()}}>
          <input className="w-full border bg-transparent px-4 py-3 text-right outline-none" style={{{{ borderColor: "{p['line']}" }}}} placeholder="שם" />
          <input className="w-full border bg-transparent px-4 py-3 text-right outline-none" style={{{{ borderColor: "{p['line']}" }}}} placeholder="טלפון" />
          <button type="button" onClick={{onCta}} className="px-6 py-3 text-sm font-bold tracking-wider" style={{{{ background: "{p['primary']}", color: "{p['primaryText']}" }}}}>{{v(data, "cta")}}</button>
        </form>
        <div className="mt-6 h-px w-full" style={{{{ background: "linear-gradient(90deg, transparent, {p['primary']}, transparent)" }}}} />
      </div>
    </section>'''

    if layout == "sunnyBrunch":
        return f'''
    <section className="border-t px-5 py-16 lg:px-8 lg:py-20" style={{{{ borderColor: "{p['line']}", background: "{p['surface']}" }}}}>
      <div className="mx-auto max-w-md rotate-1 border bg-[#fffdf8] p-6 shadow-xl" style={{{{ borderColor: "{p['line']}" }}}}>
        <p className="text-center text-xs tracking-[0.3em]" style={{{{ color: "{p['primary']}" }}}}>POSTCARD</p>
        <h2 className="tpl-display mt-3 text-center text-3xl font-bold">{{v(data, "contactTitle")}}</h2>
        <p className="mt-3 text-center text-sm" style={{{{ color: "{p['muted']}" }}}}>{{v(data, "contactText")}}</p>
        <form className="mt-6 grid gap-3" onSubmit={{(e) => e.preventDefault()}}>
          <input className="border-b bg-transparent px-2 py-2 text-right outline-none" style={{{{ borderColor: "{p['line']}" }}}} placeholder="שם" />
          <input className="border-b bg-transparent px-2 py-2 text-right outline-none" style={{{{ borderColor: "{p['line']}" }}}} placeholder="טלפון" />
          <textarea className="min-h-20 border bg-transparent px-3 py-2 text-right outline-none" style={{{{ borderColor: "{p['line']}" }}}} placeholder="הודעה קצרה" />
          <button type="button" onClick={{onCta}} className="rounded-full px-6 py-3 text-sm font-bold" style={{{{ background: "{p['primary']}", color: "{p['primaryText']}" }}}}>{{v(data, "cta")}}</button>
        </form>
      </div>
    </section>'''

    if layout == "nightTapas":
        return f'''
    <section className="border-t px-5 py-16 lg:px-8 lg:py-20" style={{{{ borderColor: "{p['line']}", background: "{p['surface']}" }}}}>
      <div className="mx-auto max-w-md font-mono">
        <div className="border p-5" style={{{{ borderColor: "{p['line']}", background: "{p['bg']}" }}}}>
          <div className="flex justify-between text-xs" style={{{{ color: "{p['muted']}" }}}}><span>TAB #042</span><span>OPEN</span></div>
          <h2 className="tpl-display mt-4 text-3xl font-bold">{{v(data, "contactTitle")}}</h2>
          <p className="mt-2 text-sm" style={{{{ color: "{p['muted']}" }}}}>{{v(data, "contactText")}}</p>
          <form className="mt-6 grid gap-2" onSubmit={{(e) => e.preventDefault()}}>
            <input className="w-full border bg-transparent px-3 py-2 text-right text-sm outline-none" style={{{{ borderColor: "{p['line']}" }}}} placeholder="שם" />
            <input className="w-full border bg-transparent px-3 py-2 text-right text-sm outline-none" style={{{{ borderColor: "{p['line']}" }}}} placeholder="טלפון" />
            <div className="mt-2 flex justify-between border-t pt-3 text-sm" style={{{{ borderColor: "{p['line']}" }}}}><span>TOTAL</span><span style={{{{ color: "{p['primary']}" }}}}>שמירת מקום</span></div>
            <button type="button" onClick={{onCta}} className="mt-2 px-4 py-3 text-sm font-bold" style={{{{ background: "{p['primary']}", color: "{p['primaryText']}" }}}}>{{v(data, "cta")}}</button>
          </form>
        </div>
      </div>
    </section>'''

    if layout == "spiceWheel":
        return f'''
    <section className="border-t px-5 py-16 lg:px-8 lg:py-20" style={{{{ borderColor: "{p['line']}" }}}}>
      <div className="mx-auto flex max-w-lg flex-col items-center">
        <div className="relative flex h-80 w-80 flex-col items-center justify-center rounded-full border-4 p-8 text-center" style={{{{ borderColor: "{p['primary']}", background: "{p['surface']}" }}}}>
          <h2 className="tpl-display text-2xl font-bold">{{v(data, "contactTitle")}}</h2>
          <p className="mt-2 text-xs" style={{{{ color: "{p['muted']}" }}}}>{{v(data, "contactText")}}</p>
          <form className="mt-4 grid w-full gap-2" onSubmit={{(e) => e.preventDefault()}}>
            <input className="w-full rounded-full border bg-transparent px-3 py-2 text-center text-sm outline-none" style={{{{ borderColor: "{p['line']}" }}}} placeholder="שם" />
            <input className="w-full rounded-full border bg-transparent px-3 py-2 text-center text-sm outline-none" style={{{{ borderColor: "{p['line']}" }}}} placeholder="טלפון" />
            <button type="button" onClick={{onCta}} className="rounded-full px-4 py-2 text-sm font-bold" style={{{{ background: "{p['primary']}", color: "{p['primaryText']}" }}}}>{{v(data, "cta")}}</button>
          </form>
        </div>
      </div>
    </section>'''

    if layout == "cellarDepth":
        return f'''
    <section className="border-t px-5 py-16 lg:px-8 lg:py-20" style={{{{ borderColor: "{p['line']}", background: "{p['surface']}" }}}}>
      <div className="mx-auto grid max-w-4xl gap-10 lg:grid-cols-2">
        <div className="text-center lg:text-right">
          <p className="text-xs tracking-[0.34em]" style={{{{ color: "{p['primary']}" }}}}>RESERVATION</p>
          <h2 className="tpl-display mt-4 text-4xl font-semibold">{{v(data, "contactTitle")}}</h2>
          <p className="mt-4 leading-8" style={{{{ color: "{p['muted']}" }}}}>{{v(data, "contactText")}}</p>
          <p className="mt-6 text-sm" style={{{{ color: "{p['muted']}" }}}}>{{v(data, "phone")}} · {{v(data, "email")}}</p>
        </div>
        <form className="grid gap-4 border p-6" style={{{{ borderColor: "{p['line']}" }}}} onSubmit={{(e) => e.preventDefault()}}>
          <input className="w-full border-b bg-transparent px-2 py-3 text-right outline-none" style={{{{ borderColor: "{p['line']}" }}}} placeholder="שם מלא" />
          <input className="w-full border-b bg-transparent px-2 py-3 text-right outline-none" style={{{{ borderColor: "{p['line']}" }}}} placeholder="טלפון" />
          <input className="w-full border-b bg-transparent px-2 py-3 text-right outline-none" style={{{{ borderColor: "{p['line']}" }}}} placeholder="תאריך מועדף" />
          <button type="button" onClick={{onCta}} className="mt-2 px-6 py-3 text-sm font-semibold tracking-wider" style={{{{ background: "{p['primary']}", color: "{p['primaryText']}" }}}}>{{v(data, "cta")}}</button>
        </form>
      </div>
    </section>'''

    # neonStreet
    return f'''
    <section className="border-t px-5 py-16 lg:px-8 lg:py-20" style={{{{ borderColor: "{p['line']}", background: "{p['surface']}" }}}}>
      <div className="mx-auto max-w-md">
        <div className="rounded-2xl border p-4" style={{{{ borderColor: "{p['line']}", background: "{p['bg']}" }}}}>
          <p className="mb-4 text-center text-xs font-bold" style={{{{ color: "{p['muted']}" }}}}>SMS · Streetbite</p>
          <div className="mb-3 mr-8 rounded-2xl rounded-tr-sm px-4 py-2 text-sm" style={{{{ background: "{p['primary']}", color: "{p['primaryText']}" }}}}>{{v(data, "contactTitle")}}</div>
          <div className="mb-4 ml-8 rounded-2xl rounded-tl-sm border px-4 py-2 text-sm" style={{{{ borderColor: "{p['line']}" }}}}>{{v(data, "contactText")}}</div>
          <form className="grid gap-2" onSubmit={{(e) => e.preventDefault()}}>
            <input className="w-full rounded-full border bg-transparent px-4 py-3 text-right text-sm outline-none" style={{{{ borderColor: "{p['line']}" }}}} placeholder="הקלידו הודעה..." />
            <button type="button" onClick={{onCta}} className="rounded-full px-4 py-3 text-sm font-black" style={{{{ background: "{p['primary']}", color: "{p['primaryText']}" }}}}>{{v(data, "cta")}}</button>
          </form>
        </div>
      </div>
    </section>'''


def footer_jsx(t):
    p = _p(t)
    layout = t["layout"]

    if layout == "flameStack":
        return f'''
    <footer className="border-t px-5 py-8 lg:px-8" style={{{{ borderColor: "{p['line']}" }}}}>
      <div className="mx-auto h-px max-w-7xl" style={{{{ background: `linear-gradient(90deg, transparent, {p['primary']}, transparent)` }}}} />
      <div className="mx-auto mt-6 flex max-w-7xl flex-col gap-3 text-sm md:flex-row md:items-center md:justify-between" style={{{{ color: "{p['muted']}" }}}}>
        <span className="tpl-display text-lg font-bold" style={{{{ color: "{p['text']}" }}}}>{{v(data, "brandName")}}</span>
        <span>{{v(data, "email")}} · {{v(data, "phone")}}</span>
      </div>
    </footer>'''

    if layout == "steamBowl":
        return f'''
    <footer className="relative overflow-hidden px-5 pb-8 pt-4 lg:px-8" style={{{{ background: "{p['dark']}" }}}}>
      <svg className="mb-4 w-full" viewBox="0 0 1440 60" preserveAspectRatio="none" aria-hidden="true">
        <path fill="none" stroke="{p['primary']}" strokeWidth="2" d="M0,30 Q180,5 360,30 T720,30 T1080,30 T1440,30" />
      </svg>
      <div className="mx-auto flex max-w-7xl flex-col gap-2 text-sm md:flex-row md:justify-between" style={{{{ color: "{p['muted']}" }}}}>
        <span className="tpl-display text-lg font-bold" style={{{{ color: "{p['text']}" }}}}>{{v(data, "brandName")}}</span>
        <span>{{v(data, "address")}}</span>
      </div>
    </footer>'''

    if layout == "doughStretch":
        return f'''
    <footer className="relative px-5 py-10 lg:px-8" style={{{{ background: "{p['primary']}", color: "{p['primaryText']}" }}}}>
      <div className="absolute inset-x-0 -top-3 h-3" style={{{{ background: `radial-gradient(circle at 10px 0, transparent 8px, {p['primary']} 9px)`, backgroundSize: "20px 12px" }}}} />
      <div className="mx-auto flex max-w-7xl flex-col gap-2 text-sm md:flex-row md:justify-between">
        <span className="tpl-display text-lg font-black">{{v(data, "brandName")}}</span>
        <span>{{v(data, "email")}} · {{v(data, "phone")}}</span>
      </div>
    </footer>'''

    if layout == "mezzeMosaic":
        return f'''
    <footer className="border-t px-5 py-10 lg:px-8" style={{{{ borderColor: "{p['line']}", background: "{p['surface']}" }}}}>
      <div className="mx-auto grid max-w-7xl gap-4 text-sm md:grid-cols-3 md:items-center" style={{{{ color: "{p['muted']}" }}}}>
        <span className="tpl-display text-lg font-bold" style={{{{ color: "{p['text']}" }}}}>{{v(data, "brandName")}}</span>
        <span className="text-center">מזטה · שמן זית · שולחן משותף</span>
        <span className="md:text-left">{{v(data, "phone")}}</span>
      </div>
    </footer>'''

    if layout == "conveyorRail":
        return f'''
    <footer className="px-5 py-6 lg:px-8" style={{{{ background: "{p['bg']}" }}}}>
      <div className="mx-auto h-px max-w-7xl" style={{{{ background: "{p['primary']}" }}}} />
      <div className="mx-auto mt-4 flex max-w-7xl justify-between text-xs tracking-[0.2em]" style={{{{ color: "{p['muted']}" }}}}>
        <span>{{v(data, "brandName")}}</span>
        <span>{{v(data, "email")}}</span>
      </div>
    </footer>'''

    if layout == "sunnyBrunch":
        return f'''
    <footer className="tpl-napkin-dot border-t px-5 py-10 lg:px-8" style={{{{ borderColor: "{p['line']}", background: "{p['bg']}" }}}}>
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-2 text-sm" style={{{{ color: "{p['muted']}" }}}}>
        <span className="tpl-display text-xl font-bold" style={{{{ color: "{p['text']}" }}}}>{{v(data, "brandName")}}</span>
        <span>{{v(data, "email")}} · {{v(data, "phone")}}</span>
      </div>
    </footer>'''

    if layout == "nightTapas":
        return f'''
    <footer className="border-t px-5 py-8 lg:px-8" style={{{{ borderColor: "{p['line']}", background: "{p['dark']}" }}}}>
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-2">
        <span className="tpl-neon tpl-display text-2xl font-bold">{{v(data, "brandName")}}</span>
        <span className="text-sm" style={{{{ color: "{p['muted']}" }}}}>{{v(data, "phone")}} · {{v(data, "email")}}</span>
      </div>
    </footer>'''

    if layout == "spiceWheel":
        return f'''
    <footer className="border-t px-5 py-8 lg:px-8" style={{{{ borderColor: "{p['line']}" }}}}>
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 text-sm" style={{{{ color: "{p['muted']}" }}}}>
        <span className="tpl-display text-lg font-bold" style={{{{ color: "{p['text']}" }}}}>{{v(data, "brandName")}}</span>
        <div className="flex gap-2">{{[0,1,2,3,4].map((i) => <span key={{i}} className="h-2 w-2 rounded-full" style={{{{ background: ["{p['primary']}", "#e9c46a", "#f4a261", "#9b2226", "{p['muted']}"][i] }}}} />)}}</div>
        <span>{{v(data, "address")}}</span>
      </div>
    </footer>'''

    if layout == "cellarDepth":
        return f'''
    <footer className="border-t px-5 py-10 lg:px-8" style={{{{ borderColor: "{p['line']}" }}}}>
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-4">
        <div className="tpl-stamp border-2 px-4 py-2 text-xs font-bold tracking-[0.3em]" style={{{{ borderColor: "{p['primary']}", color: "{p['primary']}" }}}}>EST. CELLAR</div>
        <span className="tpl-display text-xl font-semibold">{{v(data, "brandName")}}</span>
        <span className="text-sm" style={{{{ color: "{p['muted']}" }}}}>{{v(data, "email")}} · {{v(data, "phone")}}</span>
      </div>
    </footer>'''

    # neonStreet
    return f'''
    <footer className="tpl-ticket-tear border-t px-5 py-8 lg:px-8" style={{{{ borderColor: "{p['line']}", background: "{p['surface']}" }}}}>
      <div className="mx-auto flex max-w-7xl flex-col gap-2 text-sm md:flex-row md:items-center md:justify-between" style={{{{ color: "{p['muted']}" }}}}>
        <span className="tpl-display text-lg font-black" style={{{{ color: "{p['text']}" }}}}>{{v(data, "brandName")}} ★</span>
        <span>{{v(data, "email")}} · {{v(data, "phone")}}</span>
      </div>
    </footer>'''

def thumbnail_body(t):
    p = t["palette"]
    name = t["name"]
    layout = t["layout"]
    imgs = t["images"]
    fonts = t["fonts"]["displayCss"]
    niche = t["niche"]
    bodies = {
        "flameStack": f'''<div className="absolute inset-0" style={{{{ background: "{p['bg']}" }}}}>
        <div className="absolute inset-0 opacity-70" style={{{{ backgroundImage: "url({imgs['hero']})", backgroundSize: "cover" }}}} />
        <div className="absolute inset-0" style={{{{ background: "linear-gradient(180deg, transparent, {p['bg']})" }}}} />
        <div className="absolute bottom-8 right-4 left-4">
          <div className="mb-2 flex gap-1">{{[1,2,3,4].map((i) => <span key={{i}} className="h-1.5 w-1.5 rounded-full" style={{{{ background: "{p['primary']}" }}}} />)}}</div>
          <p className="text-[10px] tracking-[0.2em]" style={{{{ color: "{p['primary']}" }}}}>{niche}</p>
          <h3 className="mt-1 text-3xl font-bold" style={{{{ fontFamily: '{fonts}', color: "{p['text']}" }}}}>{name}</h3>
        </div>
      </div>''',
        "steamBowl": f'''<div className="relative flex h-full min-h-[260px] flex-col items-center justify-center" style={{{{ background: "radial-gradient(circle at 50% 60%, {p['surface']}, {p['bg']})" }}}}>
        <div className="h-16 w-16 rounded-full border-2" style={{{{ borderColor: "{p['primary']}", backgroundImage: "url({imgs['hero']})", backgroundSize: "cover" }}}} />
        <p className="mt-4 text-[10px]" style={{{{ color: "{p['primary']}" }}}}>{niche}</p>
        <h3 className="text-3xl font-bold" style={{{{ fontFamily: '{fonts}', color: "{p['text']}" }}}}>{name}</h3>
      </div>''',
        "doughStretch": f'''<div className="grid h-full min-h-[260px] grid-cols-2">
        <div className="flex flex-col justify-center p-4" style={{{{ background: "{p['bg']}", color: "{p['text']}" }}}}>
          <p className="text-[10px]" style={{{{ color: "{p['primary']}" }}}}>{niche}</p>
          <h3 className="text-3xl font-black leading-none" style={{{{ fontFamily: '{fonts}' }}}}>{name}</h3>
          <div className="mt-2 h-1 w-16" style={{{{ background: "{p['primary']}" }}}} />
        </div>
        <div className="flex items-center justify-center" style={{{{ background: "{p['surface']}" }}}}>
          <div className="h-24 w-24 rounded-full border-4" style={{{{ borderColor: "{p['primary']}", backgroundImage: "url({imgs['hero']})", backgroundSize: "cover" }}}} />
        </div>
      </div>''',
        "mezzeMosaic": f'''<div className="relative h-full min-h-[260px] p-3" style={{{{ background: "{p['bg']}" }}}}>
        <div className="grid h-[55%] grid-cols-2 gap-1">
          <div style={{{{ backgroundImage: "url({imgs['hero']})", backgroundSize: "cover" }}}} />
          <div style={{{{ backgroundImage: "url({imgs['a']})", backgroundSize: "cover" }}}} />
          <div style={{{{ backgroundImage: "url({imgs['b']})", backgroundSize: "cover" }}}} />
          <div style={{{{ backgroundImage: "url({imgs['c']})", backgroundSize: "cover" }}}} />
        </div>
        <p className="mt-3 text-[10px]" style={{{{ color: "{p['primary']}" }}}}>{niche}</p>
        <h3 className="text-2xl font-bold" style={{{{ fontFamily: '{fonts}', color: "{p['text']}" }}}}>{name}</h3>
      </div>''',
        "conveyorRail": f'''<div className="relative h-full min-h-[260px] overflow-hidden" style={{{{ background: "{p['bg']}" }}}}>
        <div className="absolute inset-x-0 top-1/3 flex gap-2 overflow-hidden py-2" style={{{{ background: "{p['surface']}" }}}}>
          <div className="h-14 w-20 flex-shrink-0" style={{{{ backgroundImage: "url({imgs['hero']})", backgroundSize: "cover" }}}} />
          <div className="h-14 w-20 flex-shrink-0" style={{{{ backgroundImage: "url({imgs['a']})", backgroundSize: "cover" }}}} />
          <div className="h-14 w-20 flex-shrink-0" style={{{{ backgroundImage: "url({imgs['b']})", backgroundSize: "cover" }}}} />
        </div>
        <div className="absolute bottom-4 right-4 left-4">
          <p className="text-[10px] tracking-[0.2em]" style={{{{ color: "{p['primary']}" }}}}>{niche}</p>
          <h3 className="text-3xl font-bold" style={{{{ fontFamily: '{fonts}', color: "{p['text']}" }}}}>{name}</h3>
        </div>
      </div>''',
        "sunnyBrunch": f'''<div className="relative flex h-full min-h-[260px] flex-col justify-end p-4" style={{{{ background: "{p['bg']}" }}}}>
        <div className="absolute -left-8 -top-8 h-40 w-40 rounded-full opacity-50" style={{{{ background: `conic-gradient(from 0deg, transparent, {p['primary']}55, transparent)` }}}} />
        <p className="relative text-[10px]" style={{{{ color: "{p['primary']}" }}}}>{niche}</p>
        <h3 className="relative text-3xl font-bold" style={{{{ fontFamily: '{fonts}', color: "{p['text']}" }}}}>{name}</h3>
        <div className="relative mt-3 flex gap-2">
          <div className="h-12 w-10 -rotate-6 bg-white p-0.5 shadow"><div className="h-full w-full" style={{{{ backgroundImage: "url({imgs['a']})", backgroundSize: "cover" }}}} /></div>
          <div className="h-12 w-10 rotate-3 bg-white p-0.5 shadow"><div className="h-full w-full" style={{{{ backgroundImage: "url({imgs['b']})", backgroundSize: "cover" }}}} /></div>
        </div>
      </div>''',
        "nightTapas": f'''<div className="relative h-full min-h-[260px] p-4" style={{{{ background: "{p['bg']}" }}}}>
        <p className="text-[10px]" style={{{{ color: "{p['muted']}" }}}}>{niche}</p>
        <h3 className="mt-1 text-3xl font-bold" style={{{{ fontFamily: '{fonts}', color: "{p['primary']}", textShadow: `0 0 12px {p['primary']}` }}}}>{name}</h3>
        <div className="mt-6 flex gap-2">
          <div className="h-14 w-14 rounded-full border-2" style={{{{ borderColor: "{p['primary']}", backgroundImage: "url({imgs['a']})", backgroundSize: "cover" }}}} />
          <div className="h-14 w-14 rounded-full border-2" style={{{{ borderColor: "{p['primary']}", backgroundImage: "url({imgs['b']})", backgroundSize: "cover" }}}} />
          <div className="h-14 w-14 rounded-full border-2" style={{{{ borderColor: "{p['primary']}", backgroundImage: "url({imgs['c']})", backgroundSize: "cover" }}}} />
        </div>
      </div>''',
        "spiceWheel": f'''<div className="relative flex h-full min-h-[260px] flex-col justify-between p-4" style={{{{ background: "{p['bg']}" }}}}>
        <div>
          <p className="text-[10px]" style={{{{ color: "{p['primary']}" }}}}>{niche}</p>
          <h3 className="text-3xl font-bold" style={{{{ fontFamily: '{fonts}', color: "{p['text']}" }}}}>{name}</h3>
        </div>
        <div className="ml-auto h-20 w-20 rounded-full border-4" style={{{{ borderColor: "{p['bg']}", background: "conic-gradient({p['primary']}, #e9c46a, #f4a261, {p['primary']})" }}}} />
      </div>''',
        "cellarDepth": f'''<div className="relative flex h-full min-h-[260px] flex-col items-center justify-center p-5 text-center" style={{{{ background: "{p['bg']}" }}}}>
        <div className="absolute inset-0 opacity-40" style={{{{ backgroundImage: "url({imgs['hero']})", backgroundSize: "cover" }}}} />
        <div className="absolute inset-0" style={{{{ background: "{p['bg']}cc" }}}} />
        <p className="relative text-[10px] tracking-[0.3em]" style={{{{ color: "{p['primary']}" }}}}>{niche}</p>
        <h3 className="relative mt-2 text-3xl font-semibold" style={{{{ fontFamily: '{fonts}', color: "{p['text']}" }}}}>{name}</h3>
        <div className="relative mt-3 border px-2 py-1 text-[9px] tracking-widest" style={{{{ borderColor: "{p['primary']}", color: "{p['primary']}" }}}}>CELLAR</div>
      </div>''',
        "neonStreet": f'''<div className="relative h-full min-h-[260px] overflow-hidden p-4" style={{{{ background: "{p['bg']}" }}}}>
        <div className="absolute top-8 -right-4 rotate-[-8deg] border-2 px-3 py-1 text-xs font-black" style={{{{ borderColor: "{p['primary']}", background: "{p['surface']}", color: "{p['text']}" }}}}>TRUCK</div>
        <p className="mt-16 text-[10px]" style={{{{ color: "{p['muted']}" }}}}>{niche}</p>
        <h3 className="text-3xl font-black" style={{{{ fontFamily: '{fonts}', color: "{p['primary']}", textShadow: "0 0 10px {p['primary']}" }}}}>{name}</h3>
        <div className="mt-4 h-10 w-full" style={{{{ backgroundImage: "url({imgs['hero']})", backgroundSize: "cover" }}}} />
      </div>''',
    }
    return bodies[layout]


def _esc(s: str) -> str:
    return str(s).replace("\\", "\\\\").replace('"', '\\"').replace("\n", " ")


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
    items = "\n".join(items_lines)
    rev_lines = []
    for i, (text, name, role) in enumerate(c["reviews"], 1):
        rev_lines.append(
            f'  review{i}Text: "{_esc(text)}",\n'
            f'  review{i}Name: "{_esc(name)}",\n'
            f'  review{i}Role: "{_esc(role)}",'
        )
    faq_lines = []
    for i, (q, a) in enumerate(c["faq"], 1):
        faq_lines.append(f'  faq{i}Q: "{_esc(q)}",\n  faq{i}A: "{_esc(a)}",')
    proc_lines = []
    for i, (title, text) in enumerate(c["processSteps"], 1):
        proc_lines.append(f'  process{i}Title: "{_esc(title)}",\n  process{i}Text: "{_esc(text)}",')
    cat_lines = []
    for i, (title, text) in enumerate(c["categories"], 1):
        cat_lines.append(f'  cat{i}Title: "{_esc(title)}",\n  cat{i}Text: "{_esc(text)}",')
    pair_lines = []
    for i, (title, text) in enumerate(c["pairings"], 1):
        pair_lines.append(f'  pair{i}Title: "{_esc(title)}",\n  pair{i}Text: "{_esc(text)}",')
    tech_lines = []
    for i, (title, text) in enumerate(c["techSteps"], 1):
        tech_lines.append(f'  tech{i}Title: "{_esc(title)}",\n  tech{i}Text: "{_esc(text)}",')
    mat_lines = []
    for i, (title, text) in enumerate(c["materials"], 1):
        mat_lines.append(f'  mat{i}Title: "{_esc(title)}",\n  mat{i}Text: "{_esc(text)}",')
    tl_lines = []
    for i, (year, text) in enumerate(c["timeline"], 1):
        tl_lines.append(f'  timeline{i}Year: "{_esc(year)}",\n  timeline{i}Text: "{_esc(text)}",')
    val_lines = []
    for i, (title, text) in enumerate(c["values"], 1):
        val_lines.append(f'  value{i}Title: "{_esc(title)}",\n  value{i}Text: "{_esc(text)}",')

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
  phone: "03-555-{1000 + index}",
  email: "hello@{t["id"]}.co.il",
  address: "{address}",
{items}
}};
'''


def gen_editor_css(t):
    p = t["palette"]
    tid = t["id"]
    extra = EXTRA_CSS[t["layout"]].format(tid=tid, primary=p["primary"], muted=p["muted"], bg=p["bg"], surface=p["surface"], text=p["text"], dark=p["dark"], line=p["line"])
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

    p1_id = pages[1][0]
    p2_id = pages[2][0]
    about_id = pages[3][0]
    contact_id = pages[4][0]
    p1_fn = _page_fn_name(p1_id)
    p2_fn = _page_fn_name(p2_id)
    about_fn = _page_fn_name(about_id)
    contact_fn = _page_fn_name(contact_id)

    needs_use_state = "setOpen" in header or layout == "flameStack"
    react_import = (
        'import React, { useMemo, useState } from "react";'
        if needs_use_state
        else 'import React, { useMemo } from "react";'
    )
    open_line = "  const [open, setOpen] = useState(false);\n" if "setOpen" in header else ""

    page_content_block = "\n".join(
        [
            f'    home: <HomePage data={{merged}} goTo={{goTo}} onCta={{() => goTo("contact")}} />,',
            f'    {p1_id}: <{p1_fn} data={{merged}} goTo={{goTo}} onCta={{() => goTo("contact")}} />,',
            f'    {p2_id}: <{p2_fn} data={{merged}} goTo={{goTo}} onCta={{() => goTo("contact")}} />,',
            f'    {about_id}: <{about_fn} data={{merged}} goTo={{goTo}} onCta={{() => goTo("contact")}} />,',
            f'    {contact_id}: <{contact_fn} data={{merged}} goTo={{goTo}} onCta={{() => goTo("contact")}} />,',
        ]
    )

    return f'''{react_import}
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
{open_line}  const nav = {tid}Pages.map((p) => [p.id, v(data, `nav${{p.id[0].toUpperCase()}}${{p.id.slice(1)}}`) || p.label] as const);
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
  category: "food", categoryLabel: "אוכל ומסעדות", niche: "{t['niche']}", layout: "full",
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
        (d / "defaultData.ts").write_text(gen_default_data(t, i), encoding="utf-8")
        (d / "editorCss.ts").write_text(gen_editor_css(t), encoding="utf-8")
        (d / "pages.tsx").write_text(gen_pages(t), encoding="utf-8")
        (d / "thumbnail.tsx").write_text(gen_thumbnail(t), encoding="utf-8")
        (d / "preview.tsx").write_text(gen_preview(t), encoding="utf-8")
        (d / "schema.ts").write_text(gen_schema(t), encoding="utf-8")
        (d / "meta.ts").write_text(gen_meta(t), encoding="utf-8")
        created.append(t["id"])
        print("ok", t["id"], t["layout"])
    print("done", len(templates))
    return created


if __name__ == "__main__":
    main()
