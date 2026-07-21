#!/usr/bin/env python3
"""Regenerate 10 real-estate templates with distinct layouts + motion CSS."""
from __future__ import annotations

import json
from pathlib import Path

ROOT = Path("src/components/site-builder/studio/data/templates")
CONFIG = Path("scripts/re-templates-config.json")


def big_stat(t):
    return {
        "parcel": ("12", "דונם פעילים"),
        "urbanix": ("240", "דירות במאגר"),
        "skylara": ("42", "קומות במגדלים"),
    }.get(t["id"], ("18", "עסקאות השנה"))


def hero_jsx(t):
    p = t["palette"]
    secondary = t["pages"][1][0]
    layout = t["layout"]

    if layout == "cinematic":
        return f'''
      <section className="relative isolate min-h-[92vh] overflow-hidden">
        <img src={{v(data, "heroImage")}} alt="" className="tpl-ken absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0" style={{{{ background: "linear-gradient(180deg, transparent 20%, {p['bg']}f2 88%)" }}}} />
        <div className="tpl-pulse-line absolute inset-x-0 top-[42%] h-px" style={{{{ background: "linear-gradient(90deg, transparent, {p['primary']}, transparent)" }}}} />
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

    if layout == "typoSearch":
        return f'''
      <section className="relative overflow-hidden border-b px-5 py-16 lg:px-8 lg:py-24" style={{{{ borderColor: "{p['line']}", background: "{p['bg']}" }}}}>
        <div className="pointer-events-none absolute -left-10 top-10 text-[12rem] font-black leading-none opacity-[0.06] md:text-[18rem]" style={{{{ color: "{p['primary']}" }}}}>K</div>
        <div className="relative z-10 mx-auto max-w-7xl">
          <p className="tpl-rise text-xs font-semibold tracking-[0.28em]" style={{{{ color: "{p['primary']}" }}}}>{{v(data, "heroEyebrow")}}</p>
          <h1 className="tpl-display tpl-rise-2 mt-5 max-w-4xl text-6xl font-extrabold leading-[0.95] md:text-8xl">{{v(data, "heroTitle")}}</h1>
          <p className="tpl-rise-3 mt-6 max-w-2xl text-lg leading-8" style={{{{ color: "{p['muted']}" }}}}>{{v(data, "heroSubtitle")}}</p>
          <div className="tpl-rise-3 mt-10 grid gap-3 border p-3 md:grid-cols-[1.4fr_1fr_1fr_auto]" style={{{{ borderColor: "{p['line']}", background: "{p['surface']}" }}}}>
            <input className="border-0 bg-transparent px-4 py-4 text-sm outline-none" placeholder="עיר / שכונה" style={{{{ color: "{p['text']}" }}}} />
            <input className="border-0 bg-transparent px-4 py-4 text-sm outline-none" placeholder="תקציב" style={{{{ color: "{p['text']}" }}}} />
            <input className="border-0 bg-transparent px-4 py-4 text-sm outline-none" placeholder="חדרים" style={{{{ color: "{p['text']}" }}}} />
            <button type="button" onClick={{onCta}} className="px-6 py-4 text-sm font-bold" style={{{{ background: "{p['primary']}", color: "{p['primaryText']}" }}}}>{{v(data, "heroPrimary")}}</button>
          </div>
          <div className="mt-10 grid grid-cols-3 gap-6 border-t pt-8" style={{{{ borderColor: "{p['line']}" }}}}>
            {{[["240+","נכסים"],["48ש׳","זמן מענה"],["96%","שביעות רצון"]].map(([n,l]) => (
              <div key={{l}} className="tpl-climb">
                <div className="tpl-display text-4xl font-extrabold md:text-5xl" style={{{{ color: "{p['primary']}" }}}}>{{n}}</div>
                <div className="mt-2 text-sm" style={{{{ color: "{p['muted']}" }}}}>{{l}}</div>
              </div>
            ))}}
          </div>
        </div>
      </section>'''

    if layout == "posterOverlap":
        return f'''
      <section className="relative grid min-h-[88vh] lg:grid-cols-[0.9fr_1.1fr]">
        <div className="relative z-10 flex flex-col justify-between border-b p-8 lg:border-b-0 lg:border-l lg:p-12" style={{{{ borderColor: "{p['line']}", background: "{p['bg']}" }}}}>
          <div>
            <p className="tpl-rise text-xs font-semibold tracking-[0.3em]" style={{{{ color: "{p['primary']}" }}}}>{{v(data, "heroEyebrow")}}</p>
            <div className="tpl-draw mt-6 h-px w-28" style={{{{ background: "{p['primary']}" }}}} />
            <h1 className="tpl-display tpl-rise-2 mt-8 text-6xl font-bold leading-[0.92] md:text-7xl lg:text-8xl">{{v(data, "heroTitle")}}</h1>
          </div>
          <div className="tpl-rise-3 mt-10">
            <p className="max-w-md text-lg leading-8" style={{{{ color: "{p['muted']}" }}}}>{{v(data, "heroSubtitle")}}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button type="button" onClick={{onCta}} className="px-7 py-3.5 text-sm font-bold" style={{{{ background: "{p['primary']}", color: "{p['primaryText']}" }}}}>{{v(data, "heroPrimary")}}</button>
              <button type="button" onClick={{() => goTo("{secondary}")}} className="border px-7 py-3.5 text-sm font-semibold" style={{{{ borderColor: "{p['line']}" }}}}>{{v(data, "heroSecondary")}}</button>
            </div>
          </div>
        </div>
        <div className="relative min-h-[48vh] overflow-hidden lg:min-h-[88vh]">
          <img src={{v(data, "heroImage")}} alt="" className="tpl-ken h-full w-full object-cover" />
          <div className="absolute bottom-8 left-8 right-8 border p-5 backdrop-blur-md tpl-float" style={{{{ borderColor: "{p['primary']}", background: "{p['bg']}cc" }}}}>
            <p className="text-xs tracking-[0.24em]" style={{{{ color: "{p['primary']}" }}}}>PRIVATE ACCESS</p>
            <p className="tpl-display mt-2 text-2xl font-bold">תיק נכסים סגור</p>
          </div>
        </div>
      </section>'''

    if layout == "circleCenter":
        return f'''
      <section className="relative overflow-hidden px-5 py-16 lg:px-8 lg:py-24" style={{{{ background: "{p['bg']}" }}}}>
        <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
          <p className="tpl-rise text-xs font-semibold tracking-[0.28em]" style={{{{ color: "{p['primary']}" }}}}>{{v(data, "heroEyebrow")}}</p>
          <div className="tpl-float relative mt-8 h-[280px] w-[280px] overflow-hidden rounded-full border-4 md:h-[380px] md:w-[380px]" style={{{{ borderColor: "{p['primary']}" }}}}>
            <img src={{v(data, "heroImage")}} alt="" className="tpl-ken h-full w-full object-cover" />
          </div>
          <h1 className="tpl-display tpl-rise-2 mt-10 text-5xl font-bold leading-[1.05] md:text-7xl">{{v(data, "heroTitle")}}</h1>
          <p className="tpl-rise-3 mt-6 max-w-xl text-lg leading-8" style={{{{ color: "{p['muted']}" }}}}>{{v(data, "heroSubtitle")}}</p>
          <div className="tpl-rise-3 mt-8 flex flex-wrap justify-center gap-3">
            <button type="button" onClick={{onCta}} className="px-7 py-3.5 text-sm font-bold" style={{{{ background: "{p['primary']}", color: "{p['primaryText']}" }}}}>{{v(data, "heroPrimary")}}</button>
            <button type="button" onClick={{() => goTo("{secondary}")}} className="border px-7 py-3.5 text-sm font-semibold" style={{{{ borderColor: "{p['line']}" }}}}>{{v(data, "heroSecondary")}}</button>
          </div>
        </div>
      </section>'''

    if layout == "marqueeUrban":
        return f'''
      <section className="relative overflow-hidden" style={{{{ background: "{p['bg']}" }}}}>
        <div className="absolute inset-y-0 left-0 w-2 tpl-pulse-line" style={{{{ background: "{p['primary']}" }}}} />
        <div className="relative px-5 pt-16 lg:px-8 lg:pt-24">
          <div className="mx-auto max-w-7xl">
            <p className="tpl-rise text-xs font-semibold tracking-[0.3em]" style={{{{ color: "{p['primary']}" }}}}>{{v(data, "heroEyebrow")}}</p>
            <h1 className="tpl-display tpl-rise-2 mt-4 max-w-5xl text-6xl font-black leading-[0.9] md:text-8xl lg:text-9xl">{{v(data, "heroTitle")}}</h1>
            <p className="tpl-rise-3 mt-6 max-w-xl text-lg leading-8" style={{{{ color: "{p['muted']}" }}}}>{{v(data, "heroSubtitle")}}</p>
            <div className="tpl-rise-3 mt-8 flex flex-wrap gap-3">
              <button type="button" onClick={{onCta}} className="px-7 py-3.5 text-sm font-bold" style={{{{ background: "{p['primary']}", color: "{p['primaryText']}" }}}}>{{v(data, "heroPrimary")}}</button>
              <button type="button" onClick={{() => goTo("{secondary}")}} className="border px-7 py-3.5 text-sm font-semibold" style={{{{ borderColor: "{p['line']}" }}}}>{{v(data, "heroSecondary")}}</button>
            </div>
          </div>
        </div>
        <div className="tpl-sweep relative mt-14 overflow-hidden border-y py-4" style={{{{ borderColor: "{p['line']}", background: "{p['surface']}" }}}}>
          <div className="tpl-marquee-track gap-10 px-4 text-sm font-bold tracking-[0.2em]" style={{{{ color: "{p['primary']}" }}}}>
            {{["פלורנטין","רוטשילד","הצפון הישן","סיטי","נווה צדק","יפו","רמת אביב","פלורנטין","רוטשילד","הצפון הישן","סיטי","נווה צדק","יפו","רמת אביב"].map((x,i)=>(
              <span key={{i}} className="whitespace-nowrap">{{x}} ·</span>
            ))}}
          </div>
        </div>
        <div className="mx-auto grid max-w-7xl gap-0 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="min-h-[360px] overflow-hidden"><img src={{v(data, "heroImage")}} alt="" className="tpl-ken h-full w-full object-cover" /></div>
          <div className="flex flex-col justify-end border-t p-8 lg:border-t-0 lg:border-r" style={{{{ borderColor: "{p['line']}", background: "{p['surface']}" }}}}>
            <div className="tpl-display text-7xl font-black" style={{{{ color: "{p['primary']}" }}}}>{{v(data, "bigStat")}}</div>
            <p className="mt-2 text-sm tracking-[0.18em]" style={{{{ color: "{p['muted']}" }}}}>{{v(data, "bigStatLabel")}}</p>
          </div>
        </div>
      </section>'''

    if layout == "waveBands":
        return f'''
      <section style={{{{ background: "{p['bg']}" }}}}>
        <div className="px-5 py-14 lg:px-8 lg:py-20">
          <div className="mx-auto max-w-7xl">
            <p className="tpl-rise text-xs font-semibold tracking-[0.28em]" style={{{{ color: "{p['primary']}" }}}}>{{v(data, "heroEyebrow")}}</p>
            <h1 className="tpl-display tpl-rise-2 mt-4 max-w-4xl text-5xl font-bold leading-[1.02] md:text-7xl">{{v(data, "heroTitle")}}</h1>
            <p className="tpl-rise-3 mt-6 max-w-2xl text-lg leading-8" style={{{{ color: "{p['muted']}" }}}}>{{v(data, "heroSubtitle")}}</p>
            <div className="tpl-rise-3 mt-8 flex flex-wrap gap-3">
              <button type="button" onClick={{onCta}} className="px-7 py-3.5 text-sm font-bold" style={{{{ background: "{p['primary']}", color: "{p['primaryText']}" }}}}>{{v(data, "heroPrimary")}}</button>
              <button type="button" onClick={{() => goTo("{secondary}")}} className="border px-7 py-3.5 text-sm font-semibold" style={{{{ borderColor: "{p['line']}" }}}}>{{v(data, "heroSecondary")}}</button>
            </div>
          </div>
        </div>
        {{[v(data,"heroImage"), v(data,"bandOneImage"), v(data,"bandTwoImage")].map((src, i) => (
          <div key={{i}} className="relative h-[28vh] overflow-hidden border-t md:h-[34vh]" style={{{{ borderColor: "{p['line']}" }}}}>
            <img src={{src}} alt="" className="tpl-ken absolute inset-0 h-full w-full object-cover" style={{{{ animationDelay: `${{i * 1.2}}s` }}}} />
            <div className="absolute inset-0" style={{{{ background: i % 2 === 0 ? "{p['bg']}55" : "{p['primary']}22" }}}} />
            <div className="absolute bottom-6 right-6 text-sm font-bold tracking-[0.2em]" style={{{{ color: "{p['text']}" }}}}>{{["מים","אור","שקט"][i]}}</div>
          </div>
        ))}}
      </section>'''

    if layout == "centeredCinema":
        return f'''
      <section className="relative overflow-hidden px-5 py-16 text-center lg:px-8 lg:py-24" style={{{{ background: "{p['bg']}" }}}}>
        <p className="tpl-rise text-xs font-semibold tracking-[0.34em]" style={{{{ color: "{p['primary']}" }}}}>{{v(data, "heroEyebrow")}}</p>
        <h1 className="tpl-display tpl-rise-2 mx-auto mt-6 max-w-4xl text-6xl font-bold leading-[0.95] md:text-8xl">{{v(data, "heroTitle")}}</h1>
        <div className="tpl-draw mx-auto mt-8 h-px w-40" style={{{{ background: "{p['primary']}" }}}} />
        <p className="tpl-rise-3 mx-auto mt-8 max-w-xl text-lg leading-8" style={{{{ color: "{p['muted']}" }}}}>{{v(data, "heroSubtitle")}}</p>
        <div className="tpl-rise-3 mt-8 flex flex-wrap justify-center gap-3">
          <button type="button" onClick={{onCta}} className="px-7 py-3.5 text-sm font-bold" style={{{{ background: "{p['primary']}", color: "{p['primaryText']}" }}}}>{{v(data, "heroPrimary")}}</button>
          <button type="button" onClick={{() => goTo("{secondary}")}} className="border px-7 py-3.5 text-sm font-semibold" style={{{{ borderColor: "{p['line']}" }}}}>{{v(data, "heroSecondary")}}</button>
        </div>
        <div className="tpl-sweep relative mx-auto mt-14 max-w-6xl overflow-hidden">
          <img src={{v(data, "heroImage")}} alt="" className="tpl-ken aspect-[21/9] w-full object-cover" />
        </div>
      </section>'''

    if layout == "bigNumberMap":
        return f'''
      <section className="relative overflow-hidden px-5 py-16 lg:px-8 lg:py-24" style={{{{ background: "{p['bg']}" }}}}>
        <div className="pointer-events-none absolute inset-0 opacity-30" style={{{{ backgroundImage: "linear-gradient({p['line']} 1px, transparent 1px), linear-gradient(90deg, {p['line']} 1px, transparent 1px)", backgroundSize: "48px 48px" }}}} />
        <div className="relative z-10 mx-auto grid max-w-7xl items-end gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="tpl-rise text-xs font-semibold tracking-[0.28em]" style={{{{ color: "{p['primary']}" }}}}>{{v(data, "heroEyebrow")}}</p>
            <div className="tpl-display tpl-rise-2 mt-4 text-[7rem] font-bold leading-none md:text-[10rem]" style={{{{ color: "{p['primary']}" }}}}>{{v(data, "bigStat")}}</div>
            <p className="mt-2 text-sm tracking-[0.2em]" style={{{{ color: "{p['muted']}" }}}}>{{v(data, "bigStatLabel")}}</p>
            <h1 className="tpl-display tpl-rise-3 mt-8 text-5xl font-bold leading-[1.05] md:text-6xl">{{v(data, "heroTitle")}}</h1>
            <p className="mt-6 max-w-xl text-lg leading-8" style={{{{ color: "{p['muted']}" }}}}>{{v(data, "heroSubtitle")}}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button type="button" onClick={{onCta}} className="px-7 py-3.5 text-sm font-bold" style={{{{ background: "{p['primary']}", color: "{p['primaryText']}" }}}}>{{v(data, "heroPrimary")}}</button>
              <button type="button" onClick={{() => goTo("{secondary}")}} className="border px-7 py-3.5 text-sm font-semibold" style={{{{ borderColor: "{p['line']}" }}}}>{{v(data, "heroSecondary")}}</button>
            </div>
          </div>
          <div className="tpl-float border p-3" style={{{{ borderColor: "{p['line']}", background: "{p['surface']}" }}}}>
            <img src={{v(data, "heroImage")}} alt="" className="aspect-[4/5] w-full object-cover" />
            <p className="mt-3 px-2 pb-2 text-xs tracking-[0.18em]" style={{{{ color: "{p['muted']}" }}}}>PLOT · SURVEY · PLAN</p>
          </div>
        </div>
      </section>'''

    if layout == "verticalTower":
        return f'''
      <section className="relative grid min-h-[90vh] lg:grid-cols-[0.42fr_1.58fr]" style={{{{ background: "{p['bg']}" }}}}>
        <div className="relative min-h-[40vh] overflow-hidden border-b lg:min-h-[90vh] lg:border-b-0 lg:border-l" style={{{{ borderColor: "{p['line']}" }}}}>
          <img src={{v(data, "heroImage")}} alt="" className="tpl-ken absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0" style={{{{ background: "linear-gradient(180deg, transparent, {p['bg']}dd)" }}}} />
          <div className="absolute bottom-6 right-6 left-6 space-y-2">
            {{["42","28","16","08"].map((floor, i) => (
              <div key={{floor}} className="tpl-climb flex items-center justify-between border-t pt-2 text-sm font-bold" style={{{{ borderColor: "{p['primary']}", animationDelay: `${{i * 0.1}}s`, color: "{p['primary']}" }}}}>
                <span>FLOOR</span><span>{{floor}}</span>
              </div>
            ))}}
          </div>
        </div>
        <div className="flex flex-col justify-center px-5 py-16 lg:px-12 lg:py-24">
          <p className="tpl-rise text-xs font-semibold tracking-[0.3em]" style={{{{ color: "{p['primary']}" }}}}>{{v(data, "heroEyebrow")}}</p>
          <h1 className="tpl-display tpl-rise-2 mt-5 max-w-3xl text-6xl font-bold leading-[0.95] md:text-8xl">{{v(data, "heroTitle")}}</h1>
          <div className="tpl-draw mt-8 h-px w-32" style={{{{ background: "{p['primary']}" }}}} />
          <p className="tpl-rise-3 mt-6 max-w-xl text-lg leading-8" style={{{{ color: "{p['muted']}" }}}}>{{v(data, "heroSubtitle")}}</p>
          <div className="tpl-rise-3 mt-8 flex flex-wrap gap-3">
            <button type="button" onClick={{onCta}} className="px-7 py-3.5 text-sm font-bold" style={{{{ background: "{p['primary']}", color: "{p['primaryText']}" }}}}>{{v(data, "heroPrimary")}}</button>
            <button type="button" onClick={{() => goTo("{secondary}")}} className="border px-7 py-3.5 text-sm font-semibold" style={{{{ borderColor: "{p['line']}" }}}}>{{v(data, "heroSecondary")}}</button>
          </div>
        </div>
      </section>'''

    # quoteFeature
    return f'''
      <section className="relative overflow-hidden" style={{{{ background: "{p['bg']}" }}}}>
        <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-20">
          <p className="tpl-rise text-xs font-semibold tracking-[0.28em]" style={{{{ color: "{p['primary']}" }}}}>{{v(data, "heroEyebrow")}}</p>
          <blockquote className="tpl-display tpl-rise-2 mt-6 max-w-4xl text-5xl font-bold leading-[1.08] md:text-7xl">
            <span style={{{{ color: "{p['primary']}" }}}}>“</span>{{v(data, "quote")}}<span style={{{{ color: "{p['primary']}" }}}}>”</span>
          </blockquote>
          <h1 className="tpl-rise-3 mt-8 text-2xl font-bold md:text-3xl">{{v(data, "heroTitle")}}</h1>
          <p className="mt-4 max-w-xl text-lg leading-8" style={{{{ color: "{p['muted']}" }}}}>{{v(data, "heroSubtitle")}}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button type="button" onClick={{onCta}} className="px-7 py-3.5 text-sm font-bold" style={{{{ background: "{p['primary']}", color: "{p['primaryText']}" }}}}>{{v(data, "heroPrimary")}}</button>
            <button type="button" onClick={{() => goTo("{secondary}")}} className="border px-7 py-3.5 text-sm font-semibold" style={{{{ borderColor: "{p['line']}" }}}}>{{v(data, "heroSecondary")}}</button>
          </div>
        </div>
        <div className="relative mx-auto max-w-7xl px-5 pb-16 lg:px-8">
          <div className="tpl-sweep relative overflow-hidden">
            <img src={{v(data, "heroImage")}} alt="" className="tpl-ken aspect-[16/8] w-full object-cover" />
            <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-end justify-between gap-4 border-t px-5 py-5 backdrop-blur-md" style={{{{ borderColor: "{p['line']}", background: "{p['dark']}cc", color: "#f5f7fa" }}}}>
              <div>
                <p className="text-xs tracking-[0.22em]" style={{{{ color: "{p['primary']}" }}}}>FEATURED</p>
                <p className="tpl-display mt-1 text-2xl font-bold">{{v(data, "item1Title")}}</p>
              </div>
              <p className="text-sm" style={{{{ color: "{p['muted']}" }}}}>{{v(data, "item1Meta")}}</p>
            </div>
          </div>
        </div>
      </section>'''


def thumbnail_body(t):
    p = t["palette"]
    name = t["name"]
    layout = t["layout"]
    imgs = t["images"]
    fonts = t["fonts"]["displayCss"]
    niche = t["niche"]

    bodies = {
        "cinematic": f'''<div className="absolute inset-0">
        <div className="absolute inset-0" style={{{{ backgroundImage: "url({imgs['hero']})", backgroundSize: "cover", backgroundPosition: "center" }}}} />
        <div className="absolute inset-0" style={{{{ background: "linear-gradient(180deg, transparent 30%, {p['bg']} 90%)" }}}} />
        <div className="absolute inset-x-8 top-[45%] h-px" style={{{{ background: "{p['primary']}" }}}} />
        <div className="absolute bottom-5 right-5 left-5">
          <p className="text-[10px] tracking-[0.2em]" style={{{{ color: "{p['primary']}" }}}}>{niche}</p>
          <h3 className="mt-1 text-3xl font-bold" style={{{{ fontFamily: '{fonts}', color: "{p['text']}" }}}}>{name}</h3>
        </div>
      </div>''',
        "typoSearch": f'''<div className="flex h-full min-h-[260px] flex-col justify-between p-5" style={{{{ background: "{p['bg']}", color: "{p['text']}" }}}}>
        <div>
          <p className="text-[10px] tracking-[0.2em]" style={{{{ color: "{p['primary']}" }}}}>{niche}</p>
          <h3 className="mt-3 text-4xl font-black leading-none" style={{{{ fontFamily: '{fonts}', color: "{p['primary']}" }}}}>{name}</h3>
          <p className="mt-3 text-xs opacity-70">חיפוש · תקציב · חדרים</p>
        </div>
        <div className="grid grid-cols-3 gap-2 border-t pt-3 text-center" style={{{{ borderColor: "{p['line']}" }}}}>
          <div><div className="text-lg font-bold" style={{{{ color: "{p['primary']}" }}}}>240+</div><div className="text-[10px] opacity-60">נכסים</div></div>
          <div><div className="text-lg font-bold" style={{{{ color: "{p['primary']}" }}}}>48ש׳</div><div className="text-[10px] opacity-60">מענה</div></div>
          <div><div className="text-lg font-bold" style={{{{ color: "{p['primary']}" }}}}>96%</div><div className="text-[10px] opacity-60">שביעות</div></div>
        </div>
      </div>''',
        "posterOverlap": f'''<div className="grid h-full min-h-[260px] grid-cols-2">
        <div className="flex flex-col justify-between p-4" style={{{{ background: "{p['bg']}", color: "{p['text']}" }}}}>
          <p className="text-[10px] tracking-[0.2em]" style={{{{ color: "{p['primary']}" }}}}>PRIVATE</p>
          <h3 className="text-3xl font-bold leading-none" style={{{{ fontFamily: '{fonts}' }}}}>{name}</h3>
        </div>
        <div style={{{{ backgroundImage: "url({imgs['hero']})", backgroundSize: "cover", backgroundPosition: "center" }}}} />
      </div>''',
        "circleCenter": f'''<div className="flex h-full min-h-[260px] flex-col items-center justify-center p-5 text-center" style={{{{ background: "{p['bg']}", color: "{p['text']}" }}}}>
        <div className="h-28 w-28 overflow-hidden rounded-full border-4" style={{{{ borderColor: "{p['primary']}", backgroundImage: "url({imgs['hero']})", backgroundSize: "cover", backgroundPosition: "center" }}}} />
        <h3 className="mt-4 text-3xl font-bold" style={{{{ fontFamily: '{fonts}' }}}}>{name}</h3>
        <p className="mt-1 text-[10px] tracking-[0.2em]" style={{{{ color: "{p['primary']}" }}}}>{niche}</p>
      </div>''',
        "marqueeUrban": f'''<div className="relative h-full min-h-[260px] overflow-hidden p-5" style={{{{ background: "{p['bg']}", color: "{p['text']}" }}}}>
        <div className="absolute inset-y-0 left-0 w-1.5" style={{{{ background: "{p['primary']}" }}}} />
        <p className="text-[10px] tracking-[0.2em]" style={{{{ color: "{p['primary']}" }}}}>CITY</p>
        <h3 className="mt-2 text-5xl font-black leading-none" style={{{{ fontFamily: '{fonts}', color: "{p['primary']}" }}}}>{name}</h3>
        <div className="absolute bottom-0 inset-x-0 border-t px-3 py-2 text-[10px] font-bold tracking-[0.18em]" style={{{{ borderColor: "{p['line']}", background: "{p['surface']}", color: "{p['primary']}" }}}}>פלורנטין · רוטשילד · סיטי · יפו</div>
      </div>''',
        "waveBands": f'''<div className="flex h-full min-h-[260px] flex-col" style={{{{ background: "{p['bg']}", color: "{p['text']}" }}}}>
        <div className="p-4"><h3 className="text-3xl font-bold" style={{{{ fontFamily: '{fonts}' }}}}>{name}</h3><p className="text-[10px]" style={{{{ color: "{p['primary']}" }}}}>{niche}</p></div>
        <div className="flex-1" style={{{{ backgroundImage: "url({imgs['hero']})", backgroundSize: "cover" }}}} />
        <div className="h-10" style={{{{ backgroundImage: "url({imgs['a']})", backgroundSize: "cover", opacity: .85 }}}} />
        <div className="h-8" style={{{{ backgroundImage: "url({imgs['b']})", backgroundSize: "cover", opacity: .7 }}}} />
      </div>''',
        "centeredCinema": f'''<div className="flex h-full min-h-[260px] flex-col items-center justify-center p-5 text-center" style={{{{ background: "{p['bg']}", color: "{p['text']}" }}}}>
        <p className="text-[10px] tracking-[0.28em]" style={{{{ color: "{p['primary']}" }}}}>{niche}</p>
        <h3 className="mt-3 text-4xl font-bold" style={{{{ fontFamily: '{fonts}' }}}}>{name}</h3>
        <div className="mt-3 h-px w-16" style={{{{ background: "{p['primary']}" }}}} />
        <div className="mt-5 h-20 w-full max-w-[220px]" style={{{{ backgroundImage: "url({imgs['hero']})", backgroundSize: "cover", backgroundPosition: "center" }}}} />
      </div>''',
        "bigNumberMap": f'''<div className="relative h-full min-h-[260px] p-5" style={{{{ background: "{p['bg']}", color: "{p['text']}" }}}}>
        <div className="pointer-events-none absolute inset-0 opacity-25" style={{{{ backgroundImage: "linear-gradient({p['line']} 1px, transparent 1px), linear-gradient(90deg, {p['line']} 1px, transparent 1px)", backgroundSize: "28px 28px" }}}} />
        <div className="relative">
          <div className="text-7xl font-bold leading-none" style={{{{ fontFamily: '{fonts}', color: "{p['primary']}" }}}}>12</div>
          <p className="text-[10px] tracking-[0.18em]" style={{{{ color: "{p['muted']}" }}}}>דונם</p>
          <h3 className="mt-4 text-3xl font-bold">{name}</h3>
        </div>
      </div>''',
        "verticalTower": f'''<div className="grid h-full min-h-[260px] grid-cols-[0.4fr_0.6fr]" style={{{{ background: "{p['bg']}", color: "{p['text']}" }}}}>
        <div style={{{{ backgroundImage: "url({imgs['hero']})", backgroundSize: "cover", backgroundPosition: "center" }}}} />
        <div className="flex flex-col justify-center p-4">
          <p className="text-[10px] tracking-[0.2em]" style={{{{ color: "{p['primary']}" }}}}>FLOOR 42</p>
          <h3 className="mt-2 text-3xl font-bold leading-none" style={{{{ fontFamily: '{fonts}' }}}}>{name}</h3>
        </div>
      </div>''',
        "quoteFeature": f'''<div className="flex h-full min-h-[260px] flex-col justify-between p-5" style={{{{ background: "{p['bg']}", color: "{p['text']}" }}}}>
        <div>
          <p className="text-4xl font-bold leading-none" style={{{{ fontFamily: '{fonts}', color: "{p['primary']}" }}}}>“</p>
          <h3 className="mt-1 text-2xl font-bold leading-snug" style={{{{ fontFamily: '{fonts}' }}}}>פחות נכסים. יותר התאמה.</h3>
        </div>
        <div className="h-16 w-full" style={{{{ backgroundImage: "url({imgs['hero']})", backgroundSize: "cover", backgroundPosition: "center" }}}} />
      </div>''',
    }
    return bodies[layout]


def gen_default_data(t, index):
    nav = "\n".join(
        f'  nav{pid[0].upper() + pid[1:]}: "{label}",'
        for pid, label, _ in t["pages"]
    )
    items = "\n".join(
        f'  item{i}Title: "{it[0]}",\n  item{i}Meta: "{it[1]}",\n  item{i}Text: "{it[2]}",'
        for i, it in enumerate(t["copy"]["items"], 1)
    )
    stat, label = big_stat(t)
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
  bandOneTitle: "{c["items"][0][0]}",
  bandOneText: "{c["items"][0][2]}",
  bandOneImage: "{imgs["a"]}",
  bandTwoTitle: "{c["items"][1][0]}",
  bandTwoText: "{c["items"][1][2]}",
  bandTwoImage: "{imgs["b"]}",
  aboutTitle: "{c["aboutTitle"]}",
  aboutText: "{c["aboutText"]}",
  aboutImage: "{imgs["c"]}",
  contactTitle: "{c["contactTitle"]}",
  contactText: "{c["contactText"]}",
  cta: "{c["primary"]}",
  phone: "03-555-{1000 + index}",
  email: "hello@{t["id"]}.estate",
  address: "ישראל",
  bigStat: "{stat}",
  bigStatLabel: "{label}",
  quote: "בית טוב מתחיל מהתאמה — לא מרשימה ארוכה.",
{items}
}};
'''


def gen_editor_css(t):
    p = t["palette"]
    tid = t["id"]
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
@keyframes {tid}-draw {{ from {{ transform: scaleX(0); }} to {{ transform: scaleX(1); }} }}
@keyframes {tid}-marquee {{ from {{ transform: translateX(0); }} to {{ transform: translateX(50%); }} }}
@keyframes {tid}-pulse-line {{ 0%,100% {{ opacity: .35; }} 50% {{ opacity: 1; }} }}
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
[data-template-id="{tid}"] .tpl-draw, [data-template-id="{tid}-preview"] .tpl-draw {{
  transform-origin: right center;
  animation: {tid}-draw 1.1s cubic-bezier(.22,1,.36,1) .2s both;
}}
[data-template-id="{tid}"] .tpl-marquee-track, [data-template-id="{tid}-preview"] .tpl-marquee-track {{
  display: flex; width: max-content; animation: {tid}-marquee 28s linear infinite;
}}
[data-template-id="{tid}"] .tpl-pulse-line, [data-template-id="{tid}-preview"] .tpl-pulse-line {{
  animation: {tid}-pulse-line 2.4s ease-in-out infinite;
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
`;
'''


def gen_pages(t):
    p = t["palette"]
    tid = t["id"]
    name = t["name"]
    pages_arr = "\n".join(
        f'  {{ id: "{pid}", label: "{label}", slug: "{slug}" }},'
        for pid, label, slug in t["pages"]
    )
    hero = hero_jsx(t)
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

function ItemsList({{ data }}: {{ data: Record<string, any> }}) {{
  const items = [1, 2, 3].map((i) => [v(data, `item${{i}}Title`), v(data, `item${{i}}Meta`), v(data, `item${{i}}Text`)]);
  return (
    <section className="border-t px-5 py-16 lg:px-8 lg:py-20" style={{{{ borderColor: "{p['line']}" }}}}>
      <div className="mx-auto max-w-7xl">
        <p className="text-xs font-semibold tracking-[0.24em]" style={{{{ color: "{p['primary']}" }}}}>{{v(data, "brandName")}}</p>
        <h2 className="tpl-display mt-3 text-4xl font-bold md:text-5xl">נכסים נבחרים</h2>
        <div className="mt-10">
          {{items.map(([title, meta, text]) => (
            <div key={{title}} className="grid gap-3 border-t py-8 md:grid-cols-[1.2fr_0.6fr_1.2fr] md:items-baseline" style={{{{ borderColor: "{p['line']}" }}}}>
              <h3 className="tpl-display text-2xl font-bold">{{title}}</h3>
              <p className="text-sm font-semibold" style={{{{ color: "{p['primary']}" }}}}>{{meta}}</p>
              <p className="text-base leading-7" style={{{{ color: "{p['muted']}" }}}}>{{text}}</p>
            </div>
          ))}}
        </div>
      </div>
    </section>
  );
}}

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
      <ItemsList data={{data}} />
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
        {{pg.id.includes("contact") ? null : <ItemsList data={{merged}} />}}
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
  category: "real-estate", categoryLabel: "נדל״ן", niche: "real-estate", layout: "full",
  image: ({tid}DefaultData as any).heroImage,
  heroTitle: ({tid}DefaultData as any).heroTitle,
  heroSubtitle: ({tid}DefaultData as any).heroSubtitle,
  palette,
  blocks: [
    {{ type: "header", variant: "sharp-nav", title: "Header" }},
    {{ type: "hero", variant: "{t['layout']}", title: "Hero" }},
    {{ type: "services", variant: "list", title: "Listings" }},
    {{ type: "contact", variant: "plain-form", title: "Contact" }},
    {{ type: "footer", variant: "minimal", title: "Footer" }},
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


def main():
    templates = json.loads(CONFIG.read_text())
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
        print("ok", t["id"], t["layout"])
    print("done", len(templates))


if __name__ == "__main__":
    main()
