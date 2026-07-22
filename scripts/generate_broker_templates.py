#!/usr/bin/env python3
"""Regenerate 12 broker real-estate templates with distinct layouts + motion CSS."""
from __future__ import annotations

import json
from pathlib import Path

ROOT = Path("src/components/site-builder/studio/data/templates")
CONFIG = Path("scripts/broker-templates-config.json")

META_BLOCKS = {'bentoGrid': [('header', 'bento-nav', 'Nav'),
               ('hero', 'asymmetric-bento', 'Hero'),
               ('listings', 'bento-showcase', 'Showcase'),
               ('marquee', 'neighborhood-tags', 'Marquee'),
               ('process', 'line-draw-steps', 'Process'),
               ('about', 'agency-story', 'About'),
               ('contact', 'inquiry-form', 'Contact'),
               ('footer', 'minimal', 'Footer')],
 'cityPins': [('header', 'map-nav', 'Nav'),
              ('hero', 'city-silhouette', 'Hero'),
              ('areas', 'area-guides', 'Areas'),
              ('listings', 'location-rows', 'Rows'),
              ('about', 'local-story', 'About'),
              ('contact', 'area-form', 'Contact'),
              ('footer', 'minimal', 'Footer')],
 'compareSlider': [('header', 'compare-nav', 'Nav'),
                   ('hero', 'split-slider', 'Hero'),
                   ('showcase', 'before-after', 'Showcase'),
                   ('bands', 'value-props', 'Bands'),
                   ('about', 'transform-story', 'About'),
                   ('contact', 'estimate-form', 'Contact'),
                   ('footer', 'minimal', 'Footer')],
 'curtainReveal': [('header', 'vault-nav', 'Nav'),
                   ('hero', 'curtain-gold', 'Hero'),
                   ('listings', 'vault-cards', 'Cards'),
                   ('testimonials', 'carousel-strip', 'Testimonials'),
                   ('about', 'luxury-story', 'About'),
                   ('contact', 'vip-form', 'Contact'),
                   ('footer', 'minimal', 'Footer')],
 'diagonalAxis': [('header', 'axis-nav', 'Nav'),
                  ('hero', 'diagonal-split', 'Hero'),
                  ('listings', 'skewed-grid', 'Grid'),
                  ('contact-panel', 'angled-form', 'Panel'),
                  ('about', 'geometry-story', 'About'),
                  ('contact', 'axis-form', 'Contact'),
                  ('footer', 'minimal', 'Footer')],
 'elevatorTower': [('header', 'tower-nav', 'Nav'),
                   ('hero', 'elevator-floors', 'Hero'),
                   ('penthouses', 'stacked-cards', 'Penthouses'),
                   ('stats', 'skyline-stats', 'Stats'),
                   ('about', 'height-story', 'About'),
                   ('contact', 'view-form', 'Contact'),
                   ('footer', 'minimal', 'Footer')],
 'floorPlan': [('header', 'plan-nav', 'Nav'),
               ('hero', 'floor-plan-split', 'Hero'),
               ('rooms', 'hotspot-cards', 'Hotspots'),
               ('compare', 'property-compare', 'Compare'),
               ('mortgage', 'calc-visual', 'Mortgage'),
               ('about', 'dwell-story', 'About'),
               ('contact', 'plan-form', 'Contact'),
               ('footer', 'minimal', 'Footer')],
 'liveCounters': [('header', 'counter-nav', 'Nav'),
                  ('hero', 'live-stats', 'Hero'),
                  ('listings', 'badge-cards', 'Cards'),
                  ('faq', 'accordion-visual', 'FAQ'),
                  ('about', 'data-story', 'About'),
                  ('contact', 'smart-form', 'Contact'),
                  ('footer', 'minimal', 'Footer')],
 'propertyTicker': [('header', 'broker-ticker-nav', 'Ticker nav'),
                    ('hero', 'cinematic-ticker-hero', 'Hero'),
                    ('listings', 'featured-zoom-cards', 'Cards'),
                    ('team', 'agent-strip', 'Agents'),
                    ('stats', 'animated-stats', 'Stats'),
                    ('about', 'broker-story', 'About'),
                    ('contact', 'broker-form', 'Contact'),
                    ('footer', 'minimal', 'Footer')],
 'rotatingPanels': [('header', 'openhaus-nav', 'Nav'),
                    ('hero', 'rotate-3d', 'Hero'),
                    ('schedule', 'open-house-timeline', 'Timeline'),
                    ('gallery', 'masonry-grid', 'Gallery'),
                    ('about', 'tour-story', 'About'),
                    ('contact', 'tour-form', 'Contact'),
                    ('footer', 'minimal', 'Footer')],
 'stackingBlocks': [('header', 'block-nav', 'Nav'),
                    ('hero', 'stack-climb', 'Hero'),
                    ('index', 'numbered-rows', 'Index'),
                    ('contact-band', 'bold-type', 'Band'),
                    ('about', 'brutalist-story', 'About'),
                    ('contact', 'direct-form', 'Contact'),
                    ('footer', 'minimal', 'Footer')],
 'stampProcess': [('header', 'signet-nav', 'Nav'),
                  ('hero', 'stamp-seal', 'Hero'),
                  ('process', 'stamp-steps', 'Steps'),
                  ('spotlight', 'listing-spotlight', 'Spotlight'),
                  ('about', 'trust-story', 'About'),
                  ('contact', 'deal-form', 'Contact'),
                  ('footer', 'minimal', 'Footer')]}

EXTRA_CSS = {'bentoGrid': '[data-template-id="{tid}"] .tpl-bento, [data-template-id="{tid}-preview"] '
              '.tpl-bento {{ display:grid;gap:.75rem;grid-template-columns:repeat(6,1fr); }}\n'
              '@keyframes {tid}-draw {{ from {{ transform:scaleX(0); }} to {{ transform:scaleX(1); '
              '}} }}\n'
              '[data-template-id="{tid}"] .tpl-line-draw, [data-template-id="{tid}-preview"] '
              '.tpl-line-draw {{ transform-origin:right;animation:{tid}-draw 1.2s both; }}',
 'cityPins': '@keyframes {tid}-pin {{ 0%,100%{{transform:scale(1);opacity:.6}} '
             '50%{{transform:scale(1.4);opacity:1}} }}\n'
             '[data-template-id="{tid}"] .tpl-pin, [data-template-id="{tid}-preview"] .tpl-pin {{ '
             'animation:{tid}-pin 2s infinite; }}',
 'compareSlider': '@keyframes {tid}-handle {{ 0%,100%{{left:35%}} 50%{{left:65%}} }}\n'
                  '[data-template-id="{tid}"] .tpl-compare-handle, '
                  '[data-template-id="{tid}-preview"] .tpl-compare-handle {{ '
                  'animation:{tid}-handle 5s infinite; }}',
 'curtainReveal': '@keyframes {tid}-curtain {{ 0%{{clip-path:inset(0 100% 0 0)}} '
                  '100%{{clip-path:inset(0)}} }}\n'
                  '[data-template-id="{tid}"] .tpl-curtain img, [data-template-id="{tid}-preview"] '
                  '.tpl-curtain img {{ animation:{tid}-curtain 1.8s both; }}\n'
                  '@keyframes {tid}-testi {{ to {{ transform:translateX(-50%); }} }}\n'
                  '[data-template-id="{tid}"] .tpl-testi-track, [data-template-id="{tid}-preview"] '
                  '.tpl-testi-track {{ display:flex;width:max-content;animation:{tid}-testi 24s '
                  'linear infinite; }}',
 'diagonalAxis': '@keyframes {tid}-axis {{ from{{transform:scaleX(0)}} to{{transform:scaleX(1)}} '
                 '}}\n'
                 '[data-template-id="{tid}"] .tpl-axis-line, [data-template-id="{tid}-preview"] '
                 '.tpl-axis-line {{ animation:{tid}-axis 1.4s both; }}\n'
                 '[data-template-id="{tid}"] .tpl-skew-grid, [data-template-id="{tid}-preview"] '
                 '.tpl-skew-grid {{ transform:skewY(-2deg); }}\n'
                 '[data-template-id="{tid}"] .tpl-skew-grid > *, '
                 '[data-template-id="{tid}-preview"] .tpl-skew-grid > * {{ transform:skewY(2deg); '
                 '}}',
 'elevatorTower': '@keyframes {tid}-elevator {{ 0%,20%{{transform:translateY(0)}} '
                  '25%,45%{{transform:translateY(-1.2em)}} 50%,70%{{transform:translateY(-2.4em)}} '
                  '75%,100%{{transform:translateY(-3.6em)}} }}\n'
                  '[data-template-id="{tid}"] .tpl-elevator-digits, '
                  '[data-template-id="{tid}-preview"] .tpl-elevator-digits {{ '
                  'animation:{tid}-elevator 8s infinite; }}',
 'floorPlan': '@keyframes {tid}-plan-pulse {{ 0%,100%{{opacity:.4}} '
              '50%{{opacity:1;transform:scale(1.15)}} }}\n'
              '[data-template-id="{tid}"] .tpl-hotspot, [data-template-id="{tid}-preview"] '
              '.tpl-hotspot {{ animation:{tid}-plan-pulse 2.4s infinite; }}\n'
              '@keyframes {tid}-draw-plan {{ to {{ stroke-dashoffset:0; }} }}\n'
              '[data-template-id="{tid}"] .tpl-plan-line, [data-template-id="{tid}-preview"] '
              '.tpl-plan-line {{ '
              'stroke-dasharray:400;stroke-dashoffset:400;animation:{tid}-draw-plan 2s forwards; '
              '}}',
 'liveCounters': '@keyframes {tid}-count {{ from{{opacity:.3;transform:translateY(8px)}} '
                 'to{{opacity:1;transform:translateY(0)}} }}\n'
                 '[data-template-id="{tid}"] .tpl-counter, [data-template-id="{tid}-preview"] '
                 '.tpl-counter {{ animation:{tid}-count 1s both; }}',
 'propertyTicker': '@keyframes {tid}-ticker {{ from {{ transform: translateX(0); }} to {{ '
                   'transform: translateX(-50%); }} }}\n'
                   '[data-template-id="{tid}"] .tpl-prop-ticker, '
                   '[data-template-id="{tid}-preview"] .tpl-prop-ticker {{ '
                   'display:flex;width:max-content;animation:{tid}-ticker 35s linear infinite; }}\n'
                   '[data-template-id="{tid}"] .tpl-zoom-card:hover img, '
                   '[data-template-id="{tid}-preview"] .tpl-zoom-card:hover img {{ '
                   'transform:scale(1.1); }}',
 'rotatingPanels': '@keyframes {tid}-rotate {{ 0%,30%{{transform:rotateY(0)}} '
                   '33%,63%{{transform:rotateY(-120deg)}} 66%,96%{{transform:rotateY(-240deg)}} '
                   '100%{{transform:rotateY(-360deg)}} }}\n'
                   '[data-template-id="{tid}"] .tpl-rotate-stage, '
                   '[data-template-id="{tid}-preview"] .tpl-rotate-stage {{ perspective:1200px; '
                   '}}\n'
                   '[data-template-id="{tid}"] .tpl-rotate-track, '
                   '[data-template-id="{tid}-preview"] .tpl-rotate-track {{ '
                   'transform-style:preserve-3d;animation:{tid}-rotate 18s infinite; }}\n'
                   '[data-template-id="{tid}"] .tpl-masonry, [data-template-id="{tid}-preview"] '
                   '.tpl-masonry {{ columns:2;column-gap:1rem; }}',
 'stackingBlocks': '@keyframes {tid}-stack {{ from{{transform:translateY(60px);opacity:0}} '
                   'to{{transform:translateY(0);opacity:1}} }}\n'
                   '[data-template-id="{tid}"] .tpl-block, [data-template-id="{tid}-preview"] '
                   '.tpl-block {{ animation:{tid}-stack .7s both; }}',
 'stampProcess': '@keyframes {tid}-stamp {{ 0%{{transform:scale(2) rotate(-12deg);opacity:0}} '
                 '100%{{transform:scale(1);opacity:1}} }}\n'
                 '[data-template-id="{tid}"] .tpl-stamp, [data-template-id="{tid}-preview"] '
                 '.tpl-stamp {{ animation:{tid}-stamp .9s both; }}'}

HOME_SECTION_USE = {'bentoGrid': ['<BentoShowcase data={data} />',
               '<NeighborhoodMarquee data={data} />',
               '<ProcessSteps data={data} />'],
 'cityPins': ['<AreaGuides data={data} />', '<LocationRows data={data} />'],
 'compareSlider': ['<BeforeAfterShowcase data={data} />', '<ValueBands data={data} />'],
 'curtainReveal': ['<VaultCards data={data} />', '<TestimonialStrip data={data} />'],
 'diagonalAxis': ['<SkewedGrid data={data} />', '<AngledContactPanel data={data} onCta={onCta} />'],
 'elevatorTower': ['<PenthouseStack data={data} />', '<SkylineStats data={data} />'],
 'floorPlan': ['<HotspotCards data={data} />',
               '<CompareStrip data={data} />',
               '<MortgageVisual data={data} />'],
 'liveCounters': ['<BadgeCards data={data} />', '<FaqVisual data={data} />'],
 'propertyTicker': ['<FeaturedCards data={data} />',
                    '<AgentStrip data={data} />',
                    '<AnimatedStats data={data} />'],
 'rotatingPanels': ['<OpenHouseTimeline data={data} />', '<MasonryGallery data={data} />'],
 'stackingBlocks': ['<NumberedIndex data={data} />',
                    '<BoldContactBand data={data} onCta={onCta} />'],
 'stampProcess': ['<StampSteps data={data} />', '<ListingSpotlight data={data} />']}

import importlib.util

_snip_path = Path(__file__).parent / "_broker_jsx_snippets.py"
_snip_spec = importlib.util.spec_from_file_location("_broker_jsx_snippets", _snip_path)
_snip = importlib.util.module_from_spec(_snip_spec)
assert _snip_spec.loader is not None
_snip_spec.loader.exec_module(_snip)
HERO_JSX = _snip.HERO_JSX
SECTIONS_JSX = _snip.SECTIONS_JSX
THUMBNAIL_JSX = _snip.THUMBNAIL_JSX


def _apply_palette(s: str, p: dict, extra: dict | None = None) -> str:
    for k, v in p.items():
        s = s.replace("{" + k + "}", str(v))
    if extra:
        for k, v in extra.items():
            s = s.replace("{" + k + "}", str(v))
    return s

def hero_jsx(t):
    p = t["palette"]
    secondary = t["pages"][1][0]
    return _apply_palette(HERO_JSX[t["layout"]], p, {"secondary": secondary})

def home_sections_jsx(t):
    return _apply_palette(SECTIONS_JSX[t["layout"]], t["palette"])

def thumbnail_body(t):
    p = t["palette"]
    extra = {
        "name": t["name"], "niche": t["niche"], "fonts": t["fonts"]["displayCss"],
        "hero": t["images"]["hero"], "a": t["images"]["a"],
    }
    return _apply_palette(THUMBNAIL_JSX[t["layout"]], p, extra)

def gen_default_data(t, index):
    nav = "\n".join(
        f'  nav{pid[0].upper() + pid[1:]}: "{label}",'
        for pid, label, _ in t["pages"]
    )
    items = "\n".join(
        f'  item{i}Title: "{it[0]}",\n  item{i}Meta: "{it[1]}",\n  item{i}Text: "{it[2]}",\n  item{i}Price: "{it[3]}",\n  item{i}Image: "{t["images"][chr(96 + i)]}",'
        for i, it in enumerate(t["copy"]["items"], 1)
    )
    c = t["copy"]
    imgs = t["images"]
    stats = f"""  stat1Value: "{c['stat1Value']}",
  stat1Label: "{c['stat1Label']}",
  stat2Value: "{c['stat2Value']}",
  stat2Label: "{c['stat2Label']}",
  stat3Value: "{c['stat3Value']}",
  stat3Label: "{c['stat3Label']}",
  quote: "{c['quote']}","""
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
  phone: "03-555-{1000 + index}",
  email: "hello@{t["id"]}.co.il",
  address: "ישראל",
{stats}
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
    inner_bits = "\n        ".join(
        s.replace("{data}", "{merged}").replace(
            "onCta={onCta}", "onCta={() => goTo(\"contact\")}"
        )
        for s in HOME_SECTION_USE[layout]
    )
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
  category: "real-estate", categoryLabel: "נדל״ן", niche: "{t['niche']}", layout: "full",
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
  category: "real-estate", categoryLabel: "נדל״ן", badge: "חדש",
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


def fix_generated_tsx(content: str) -> str:
    import re

    content = re.sub(
        r"style=\{\{([^}]+(?:\{[^}]*\}[^}]*)?)\} (?=[a-zA-Z])",
        r"style={{\1}} ",
        content,
    )
    content = re.sub(
        r"style=\{\{([^}]+(?:\{[^}]*\}[^}]*)?)\}\)>",
        r"style={{\1}}>",
        content,
    )
    content = re.sub(
        r"style=\{\{([^}]+(?:\{[^}]*\}[^}]*)?)\}>",
        r"style={{\1}}>",
        content,
    )
    content = content.replace("}} }}>", "}}>")
    content = content.replace("}} }} />", "}} />")
    content = re.sub(r"` \} />", "` }} />", content)
    content = re.sub(r"` \}>", "` }}>", content)
    content = re.sub(r'"\s*\}/>', '" }} />', content)
    return content


def main():
    templates = json.loads(CONFIG.read_text())
    created = []
    for i, t in enumerate(templates):
        d = ROOT / t["id"]
        d.mkdir(parents=True, exist_ok=True)
        (d / "defaultData.ts").write_text(gen_default_data(t, i))
        (d / "editorCss.ts").write_text(gen_editor_css(t))
        (d / "pages.tsx").write_text(fix_generated_tsx(gen_pages(t)))
        (d / "thumbnail.tsx").write_text(fix_generated_tsx(gen_thumbnail(t)))
        (d / "preview.tsx").write_text(gen_preview(t))
        (d / "schema.ts").write_text(gen_schema(t))
        (d / "meta.ts").write_text(gen_meta(t))
        created.append(t["id"])
        print("ok", t["id"], t["layout"])
    print("done", len(templates))
    return created


if __name__ == "__main__":
    main()
