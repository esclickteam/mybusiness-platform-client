# Per-layout UNIQUE section components — each layout gets its own prefixed JSX bundle.
# Output is inlined only into that template's standalone pages.tsx (no shared runtime).

from __future__ import annotations

# prefix, gallery_layout, agent_layout, testi_layout, stats_style
_LAYOUT = {
    "propertyTicker": ("Ticker", "cinema-strip", "gold-grid", "marquee-quotes", "dark-bar"),
    "bentoGrid": ("Bento", "asymmetric-tiles", "card-row", "stacked-cards", "light-grid"),
    "floorPlan": ("Plan", "blueprint-wall", "profile-row", "split-quotes", "outline-boxes"),
    "curtainReveal": ("Vault", "luxury-reveal", "portrait-row", "gold-carousel", "dark-plaque"),
    "stackingBlocks": ("Block", "brutalist-stack", "bold-cards", "type-quotes", "heavy-blocks"),
    "elevatorTower": ("Tower", "vertical-stack", "tower-cards", "floor-quotes", "skyline-stats"),
    "cityPins": ("Pin", "map-mosaic", "pin-cards", "area-quotes", "pin-stats"),
    "rotatingPanels": ("Panel", "rotate-wall", "panel-agents", "slide-quotes", "panel-stats"),
    "compareSlider": ("Slide", "split-gallery", "dual-cards", "compare-quotes", "band-stats"),
    "liveCounters": ("Counter", "badge-wall", "counter-agents", "data-quotes", "live-stats"),
    "stampProcess": ("Signet", "seal-gallery", "stamp-agents", "seal-quotes", "stamp-stats"),
    "diagonalAxis": ("Axis", "skew-gallery", "angled-agents", "axis-quotes", "skew-stats"),
}


def _gallery(prefix: str, kind: str) -> str:
    if kind == "cinema-strip":
        return f'''
function {prefix}GalleryWall({{ data }}: {{ data: Record<string, any> }}) {{
  const items = [1,2,3,4].map((i) => ({{ t: v(data, `item${{i}}Title`), p: v(data, `item${{i}}Price`), img: v(data, `item${{i}}Image`) }}));
  return (
    <section className="border-t overflow-hidden" style={{{{ borderColor: "{{line}}" }}}}>
      <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
        <h2 className="tpl-display text-4xl font-bold">גלריית נכסים קולנועית</h2>
        <div className="mt-10 flex gap-4 overflow-x-auto pb-4">
          {{items.map((c) => (
            <article key={{c.t}} className="tpl-zoom-card min-w-[280px] shrink-0 overflow-hidden border" style={{{{ borderColor: "{{line}}" }}}}>
              <img src={{c.img}} alt="" className="h-52 w-full object-cover transition duration-700 hover:scale-110" />
              <div className="p-4" style={{{{ background: "{{surface}}" }}}}>
                <h3 className="tpl-display font-bold">{{c.t}}</h3>
                <p className="mt-1 font-bold" style={{{{ color: "{{primary}}" }}}}>{{c.p}}</p>
              </div>
            </article>
          ))}}
        </div>
      </div>
    </section>
  );
}}'''
    if kind == "asymmetric-tiles":
        return f'''
function {prefix}GalleryWall({{ data }}: {{ data: Record<string, any> }}) {{
  return (
    <section className="border-t px-5 py-16 lg:px-8" style={{{{ borderColor: "{{line}}" }}}}>
      <div className="mx-auto max-w-7xl tpl-bento">
        {{[1,2,3,4].map((i) => (
          <figure key={{i}} className="overflow-hidden border" style={{{{ borderColor: "{{line}}", gridColumn: i===1?"span 3":"span 2", background: "{{surface}}" }}}}>
            <img src={{v(data, `item${{i}}Image`)}} alt="" className="aspect-video w-full object-cover" />
            <figcaption className="p-3"><span className="font-bold">{{v(data, `item${{i}}Title`)}}</span></figcaption>
          </figure>
        ))}}
      </div>
    </section>
  );
}}'''
    if kind == "blueprint-wall":
        return f'''
function {prefix}GalleryWall({{ data }}: {{ data: Record<string, any> }}) {{
  return (
    <section className="border-t px-5 py-16 lg:px-8" style={{{{ borderColor: "{{line}}", background: "{{surface}}" }}}}>
      <div className="mx-auto grid max-w-7xl gap-3 md:grid-cols-2">
        {{[1,2,3,4].map((i) => (
          <div key={{i}} className="relative border-2 border-dashed p-3" style={{{{ borderColor: "{{primary}}" }}}}>
            <span className="tpl-hotspot absolute left-3 top-3 h-3 w-3 rounded-full" style={{{{ background: "{{primary}}" }}}} />
            <img src={{v(data, `item${{i}}Image`)}} alt="" className="aspect-[5/3] w-full object-cover opacity-90" />
            <p className="mt-2 font-bold">{{v(data, `item${{i}}Title`)}}</p>
          </div>
        ))}}
      </div>
    </section>
  );
}}'''
    if kind == "luxury-reveal":
        return f'''
function {prefix}GalleryWall({{ data }}: {{ data: Record<string, any> }}) {{
  return (
    <section className="border-t px-5 py-16 lg:px-8" style={{{{ borderColor: "{{primary}}44", background: "{{dark}}" }}}}>
      <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-2">
        {{[1,2,3,4].map((i) => (
          <article key={{i}} className="tpl-curtain group overflow-hidden border" style={{{{ borderColor: "{{primary}}55" }}}}>
            <img src={{v(data, `item${{i}}Image`)}} alt="" className="h-64 w-full object-cover transition duration-700 group-hover:scale-105" />
            <div className="p-5"><h3 className="tpl-display text-2xl font-bold">{{v(data, `item${{i}}Title`)}}</h3></div>
          </article>
        ))}}
      </div>
    </section>
  );
}}'''
    if kind == "brutalist-stack":
        return f'''
function {prefix}GalleryWall({{ data }}: {{ data: Record<string, any> }}) {{
  return (
    <section className="border-t px-5 py-16 lg:px-8" style={{{{ borderColor: "{{line}}" }}}}>
      <div className="mx-auto max-w-7xl space-y-4">
        {{[1,2,3,4].map((i) => (
          <div key={{i}} className="tpl-block grid overflow-hidden border-4 md:grid-cols-[240px_1fr]" style={{{{ borderColor: "{{text}}", animationDelay: `${{i*0.1}}s` }}}}>
            <img src={{v(data, `item${{i}}Image`)}} alt="" className="h-full min-h-[140px] w-full object-cover" />
            <div className="p-6"><h3 className="tpl-display text-3xl font-black">{{v(data, `item${{i}}Title`)}}</h3></div>
          </div>
        ))}}
      </div>
    </section>
  );
}}'''
    if kind == "vertical-stack":
        return f'''
function {prefix}GalleryWall({{ data }}: {{ data: Record<string, any> }}) {{
  return (
    <section className="border-t px-5 py-16 lg:px-8" style={{{{ borderColor: "{{line}}", background: "{{surface}}" }}}}>
      <div className="mx-auto flex max-w-3xl flex-col gap-6">
        {{[1,2,3].map((i) => (
          <article key={{i}} className="tpl-climb overflow-hidden border" style={{{{ borderColor: "{{line}}", marginRight: `${{i*16}}px`, animationDelay: `${{i*0.12}}s` }}}}>
            <img src={{v(data, `item${{i}}Image`)}} alt="" className="h-48 w-full object-cover" />
            <div className="p-5"><h3 className="tpl-display text-xl font-bold">{{v(data, `item${{i}}Title`)}}</h3></div>
          </article>
        ))}}
      </div>
    </section>
  );
}}'''
    if kind == "map-mosaic":
        return f'''
function {prefix}GalleryWall({{ data }}: {{ data: Record<string, any> }}) {{
  return (
    <section className="border-t px-5 py-16 lg:px-8" style={{{{ borderColor: "{{line}}" }}}}>
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-3 md:grid-cols-4">
        {{[1,2,3,4].map((i) => (
          <div key={{i}} className="relative">
            <div className="tpl-pin absolute -left-1 -top-1 z-10 h-4 w-4 rounded-full" style={{{{ background: "{{primary}}" }}}} />
            <img src={{v(data, `item${{i}}Image`)}} alt="" className="aspect-square w-full object-cover" />
          </div>
        ))}}
      </div>
    </section>
  );
}}'''
    if kind == "rotate-wall":
        return f'''
function {prefix}GalleryWall({{ data }}: {{ data: Record<string, any> }}) {{
  return (
    <section className="border-t px-5 py-16 lg:px-8 tpl-masonry" style={{{{ borderColor: "{{line}}", background: "{{surface}}" }}}}>
      <div className="mx-auto max-w-7xl columns-2 gap-4">
        {{[1,2,3,4].map((i) => (
          <figure key={{i}} className="mb-4 break-inside-avoid overflow-hidden border" style={{{{ borderColor: "{{line}}" }}}}>
            <img src={{v(data, `item${{i}}Image`)}} alt="" className="w-full object-cover" style={{{{ height: i%2?"200px":"260px" }}}} />
          </figure>
        ))}}
      </div>
    </section>
  );
}}'''
    if kind == "split-gallery":
        return f'''
function {prefix}GalleryWall({{ data }}: {{ data: Record<string, any> }}) {{
  return (
    <section className="border-t" style={{{{ borderColor: "{{line}}" }}}}>
      <div className="mx-auto grid max-w-7xl md:grid-cols-2">
        <img src={{v(data, "item1Image")}} alt="" className="min-h-[320px] w-full object-cover" />
        <div className="grid grid-cols-2">
          {{[2,3,4].map((i) => <img key={{i}} src={{v(data, `item${{i}}Image`)}} alt="" className="aspect-square w-full object-cover" />)}}
        </div>
      </div>
    </section>
  );
}}'''
    if kind == "badge-wall":
        return f'''
function {prefix}GalleryWall({{ data }}: {{ data: Record<string, any> }}) {{
  return (
    <section className="border-t px-5 py-16 lg:px-8" style={{{{ borderColor: "{{line}}" }}}}>
      <div className="mx-auto grid max-w-7xl gap-4 sm:grid-cols-2">
        {{[1,2,3,4].map((i) => (
          <article key={{i}} className="tpl-counter border p-4" style={{{{ borderColor: "{{line}}", animationDelay: `${{i*0.1}}s` }}}}>
            <img src={{v(data, `item${{i}}Image`)}} alt="" className="mb-3 aspect-video w-full object-cover" />
            <h3 className="font-bold">{{v(data, `item${{i}}Title`)}}</h3>
          </article>
        ))}}
      </div>
    </section>
  );
}}'''
    if kind == "seal-gallery":
        return f'''
function {prefix}GalleryWall({{ data }}: {{ data: Record<string, any> }}) {{
  return (
    <section className="border-t px-5 py-16 lg:px-8" style={{{{ borderColor: "{{line}}", background: "{{surface}}" }}}}>
      <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <img src={{v(data, "item1Image")}} alt="" className="min-h-[360px] w-full object-cover" />
        <div className="grid gap-3">
          {{[2,3,4].map((i) => (
            <div key={{i}} className="tpl-stamp flex gap-3 border p-2" style={{{{ borderColor: "{{primary}}", animationDelay: `${{i*0.15}}s` }}}}>
              <img src={{v(data, `item${{i}}Image`)}} alt="" className="h-20 w-24 object-cover" />
              <div><p className="font-bold">{{v(data, `item${{i}}Title`)}}</p></div>
            </div>
          ))}}
        </div>
      </div>
    </section>
  );
}}'''
    # skew-gallery default
    return f'''
function {prefix}GalleryWall({{ data }}: {{ data: Record<string, any> }}) {{
  return (
    <section className="border-t px-5 py-16 lg:px-8" style={{{{ borderColor: "{{line}}" }}}}>
      <div className="mx-auto max-w-7xl tpl-skew-grid grid gap-4 md:grid-cols-2">
        {{[1,2,3,4].map((i) => (
          <article key={{i}} className="overflow-hidden border" style={{{{ borderColor: "{{line}}", background: "{{surface}}" }}}}>
            <img src={{v(data, `item${{i}}Image`)}} alt="" className="aspect-[4/3] w-full object-cover" />
            <div className="p-4"><h3 className="font-bold">{{v(data, `item${{i}}Title`)}}</h3></div>
          </article>
        ))}}
      </div>
    </section>
  );
}}'''


def _agents(prefix: str, kind: str) -> str:
    agents_arr = "[1,2,3,4].map((i) => ({ n: v(data, `agent${i}Name`), r: v(data, `agent${i}Role`), d: v(data, `agent${i}Deals`), img: v(data, `agent${i}Image`) }))"
    if kind == "gold-grid":
        return f'''
function {prefix}AgentRoster({{ data }}: {{ data: Record<string, any> }}) {{
  const agents = {agents_arr};
  return (
    <section className="border-t px-5 py-16 lg:px-8" style={{{{ borderColor: "{{line}}", background: "{{dark}}" }}}}>
      <h2 className="tpl-display mx-auto max-w-7xl text-4xl font-bold">צוות הפרימיום</h2>
      <div className="mx-auto mt-10 grid max-w-7xl gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {{agents.map((a,i) => (
          <article key={{a.n}} className="tpl-climb border text-center" style={{{{ borderColor: "{{primary}}55", animationDelay: `${{i*0.08}}s` }}}}>
            <img src={{a.img}} alt="" className="aspect-[3/4] w-full object-cover" />
            <div className="p-4"><h3 className="tpl-display text-lg font-bold">{{a.n}}</h3><p className="text-sm" style={{{{ color: "{{primary}}" }}}}>{{a.r}}</p></div>
          </article>
        ))}}
      </div>
    </section>
  );
}}'''
    if kind == "card-row":
        return f'''
function {prefix}AgentRoster({{ data }}: {{ data: Record<string, any> }}) {{
  const agents = {agents_arr};
  return (
    <section className="border-t px-5 py-16 lg:px-8" style={{{{ borderColor: "{{line}}" }}}}>
      <div className="mx-auto flex max-w-7xl gap-4 overflow-x-auto pb-2">
        {{agents.map((a) => (
          <article key={{a.n}} className="min-w-[220px] shrink-0 border p-4" style={{{{ borderColor: "{{line}}", background: "{{surface}}" }}}}>
            <img src={{a.img}} alt="" className="mb-3 h-32 w-full rounded object-cover" />
            <h3 className="font-bold">{{a.n}}</h3><p className="text-xs" style={{{{ color: "{{muted}}" }}}}>{{a.d}}</p>
          </article>
        ))}}
      </div>
    </section>
  );
}}'''
    # profile-row default variant
    return f'''
function {prefix}AgentRoster({{ data }}: {{ data: Record<string, any> }}) {{
  const agents = {agents_arr};
  return (
    <section className="border-t px-5 py-16 lg:px-8" style={{{{ borderColor: "{{line}}", background: "{{surface}}" }}}}>
      <div className="mx-auto max-w-7xl divide-y" style={{{{ borderColor: "{{line}}" }}}}>
        {{agents.map((a) => (
          <div key={{a.n}} className="flex flex-wrap items-center gap-5 py-6">
            <img src={{a.img}} alt="" className="h-20 w-20 rounded-full object-cover" />
            <div><h3 className="tpl-display text-xl font-bold">{{a.n}}</h3><p style={{{{ color: "{{primary}}" }}}}>{{a.r}} · {{a.d}}</p></div>
          </div>
        ))}}
      </div>
    </section>
  );
}}'''


def _testimonials(prefix: str, kind: str) -> str:
    if kind == "marquee-quotes":
        return f'''
function {prefix}QuoteRail({{ data }}: {{ data: Record<string, any> }}) {{
  const q = [v(data,"quote"), v(data,"testimonial2"), v(data,"testimonial3")];
  return (
    <section className="tpl-sweep overflow-hidden border-t py-8" style={{{{ borderColor: "{{line}}" }}}}>
      <div className="tpl-testi-track gap-8 px-6">
        {{q.concat(q).map((t,i) => <span key={{i}} className="whitespace-nowrap text-lg italic" style={{{{ color: "{{muted}}" }}}}>{{t}} —</span>)}}
      </div>
    </section>
  );
}}'''
    if kind == "stacked-cards":
        return f'''
function {prefix}QuoteRail({{ data }}: {{ data: Record<string, any> }}) {{
  const items = [[v(data,"quote"),v(data,"brandName")],[v(data,"testimonial2"),v(data,"testimonial2Author")],[v(data,"testimonial3"),v(data,"testimonial3Author")]];
  return (
    <section className="border-t px-5 py-16 lg:px-8" style={{{{ borderColor: "{{line}}", background: "{{surface}}" }}}}>
      <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-3">
        {{items.map(([q,a]) => (
          <blockquote key={{q}} className="tpl-rise border p-6" style={{{{ borderColor: "{{line}}" }}}}>
            <p className="leading-7">{{q}}</p><footer className="mt-4 text-sm font-bold">{{a}}</footer>
          </blockquote>
        ))}}
      </div>
    </section>
  );
}}'''
    return f'''
function {prefix}QuoteRail({{ data }}: {{ data: Record<string, any> }}) {{
  return (
    <section className="border-t px-5 py-14 lg:px-8" style={{{{ borderColor: "{{line}}" }}}}>
      <div className="mx-auto max-w-3xl border-r-4 pr-8" style={{{{ borderColor: "{{primary}}" }}}}>
        <p className="tpl-display text-3xl font-bold leading-snug">{{v(data, "quote")}}</p>
        <p className="mt-4 text-sm" style={{{{ color: "{{muted}}" }}}}>— {{v(data, "brandName")}}</p>
      </div>
    </section>
  );
}}'''


def _stats(prefix: str, kind: str) -> str:
    stats = '[["stat1Value","stat1Label"],["stat2Value","stat2Label"],["stat3Value","stat3Label"]]'
    if kind == "dark-bar":
        return f'''
function {prefix}TrustMetrics({{ data }}: {{ data: Record<string, any> }}) {{
  const stats = {stats};
  return (
    <section className="border-t px-5 py-12 lg:px-8" style={{{{ borderColor: "{{line}}", background: "{{dark}}" }}}}>
      <div className="mx-auto flex max-w-7xl flex-wrap justify-between gap-8">
        {{stats.map(([vk,lk]) => (
          <div key={{lk}} className="text-center"><div className="tpl-display text-5xl font-bold" style={{{{ color: "{{primary}}" }}}}>{{v(data,vk)}}</div><p className="mt-2 text-xs tracking-widest" style={{{{ color: "{{muted}}" }}}}>{{v(data,lk)}}</p></div>
        ))}}
      </div>
    </section>
  );
}}'''
    return f'''
function {prefix}TrustMetrics({{ data }}: {{ data: Record<string, any> }}) {{
  const stats = {stats};
  return (
    <section className="border-t px-5 py-12 lg:px-8" style={{{{ borderColor: "{{line}}" }}}}>
      <div className="mx-auto grid max-w-7xl grid-cols-3 gap-4">
        {{stats.map(([vk,lk],i) => (
          <div key={{lk}} className="tpl-climb border p-5 text-center" style={{{{ borderColor: "{{line}}", animationDelay: `${{i*0.1}}s` }}}}>
            <div className="tpl-display text-4xl font-bold" style={{{{ color: "{{primary}}" }}}}>{{v(data,vk)}}</div>
            <p className="mt-2 text-sm" style={{{{ color: "{{muted}}" }}}}>{{v(data,lk)}}</p>
          </div>
        ))}}
      </div>
    </section>
  );
}}'''


def _extras_block(prefix: str) -> str:
    return f'''
function {prefix}MarketPulse({{ data }}: {{ data: Record<string, any> }}) {{
  const posts = [[v(data,"insight1Title"),v(data,"insight1Text"),v(data,"insight1Tag")],[v(data,"insight2Title"),v(data,"insight2Text"),v(data,"insight2Tag")],[v(data,"insight3Title"),v(data,"insight3Text"),v(data,"insight3Tag")]];
  return (
    <section className="border-t px-5 py-16 lg:px-8" style={{{{ borderColor: "{{line}}", background: "{{surface}}" }}}}>
      <h2 className="tpl-display mx-auto max-w-7xl text-4xl font-bold">תובנות {prefix}</h2>
      <div className="mx-auto mt-10 grid max-w-7xl gap-5 lg:grid-cols-3">
        {{posts.map(([t,x,g]) => (
          <article key={{t}} className="border p-5" style={{{{ borderColor: "{{line}}" }}}}>
            <span className="text-[10px] font-bold" style={{{{ color: "{{primary}}" }}}}>{{g}}</span>
            <h3 className="tpl-display mt-2 text-xl font-bold">{{t}}</h3>
            <p className="mt-2 text-sm leading-7" style={{{{ color: "{{muted}}" }}}}>{{x}}</p>
          </article>
        ))}}
      </div>
    </section>
  );
}}

function {prefix}CtaRibbon({{ data, onCta }}: {{ data: Record<string, any>; onCta: () => void }}) {{
  return (
    <section className="px-5 py-14 lg:px-8" style={{{{ background: "{{primary}}" }}}}>
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 md:flex-row md:items-center">
        <div><h2 className="tpl-display text-3xl font-bold md:text-4xl" style={{{{ color: "{{primaryText}}" }}}}>{{v(data,"ctaTitle")}}</h2>
        <p className="mt-2 max-w-xl" style={{{{ color: "{{primaryText}}", opacity: 0.85 }}}}>{{v(data,"ctaText")}}</p></div>
        <button type="button" onClick={{onCta}} className="border-2 px-8 py-3 font-bold" style={{{{ borderColor: "{{primaryText}}", color: "{{primaryText}}" }}}}>{{v(data,"cta")}}</button>
      </div>
    </section>
  );
}}

function {prefix}FaqPanel({{ data }}: {{ data: Record<string, any> }}) {{
  const faqs = [[v(data,"faq1Q"),v(data,"faq1A")],[v(data,"faq2Q"),v(data,"faq2A")],[v(data,"faq3Q"),v(data,"faq3A")],[v(data,"faq4Q"),v(data,"faq4A")]];
  return (
    <section className="border-t px-5 py-16 lg:px-8" style={{{{ borderColor: "{{line}}" }}}}>
      <div className="mx-auto max-w-3xl grid gap-2">
        {{faqs.map(([q,a]) => (
          <details key={{q}} className="border" style={{{{ borderColor: "{{line}}" }}}}>
            <summary className="cursor-pointer px-4 py-3 font-bold">{{q}}</summary>
            <p className="border-t px-4 py-3 text-sm leading-7" style={{{{ borderColor: "{{line}}", color: "{{muted}}" }}}}>{{a}}</p>
          </details>
        ))}}
      </div>
    </section>
  );
}}

function {prefix}OfficeBlock({{ data }}: {{ data: Record<string, any> }}) {{
  return (
    <section className="border-t px-5 py-16 lg:px-8" style={{{{ borderColor: "{{line}}", background: "{{surface}}" }}}}>
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-2">
        <div>
          <h2 className="tpl-display text-3xl font-bold">{{v(data,"officeTitle")}}</h2>
          <p className="mt-4 leading-8" style={{{{ color: "{{muted}}" }}}}>{{v(data,"officeText")}}</p>
          <p className="mt-6 text-sm font-semibold">{{v(data,"phone")}} · {{v(data,"email")}}</p>
        </div>
        <div className="relative min-h-[280px] overflow-hidden border" style={{{{ borderColor: "{{line}}" }}}}>
          <img src={{v(data,"aboutImage")}} alt="" className="tpl-ken absolute inset-0 h-full w-full object-cover" />
        </div>
      </div>
    </section>
  );
}}

function {prefix}AwardsLane({{ data }}: {{ data: Record<string, any> }}) {{
  const awards = [v(data,"award1"),v(data,"award2"),v(data,"award3"),v(data,"award4")];
  return (
    <section className="overflow-hidden border-y py-4" style={{{{ borderColor: "{{line}}", background: "{{bg}}" }}}}>
      <div className="tpl-marquee-track gap-10 px-6 text-xs font-bold tracking-[0.25em]" style={{{{ color: "{{primary}}" }}}}>
        {{awards.concat(awards).map((a,i) => <span key={{i}} className="whitespace-nowrap">{{a}} ·</span>)}}
      </div>
    </section>
  );
}}

function {prefix}ProcessRail({{ data }}: {{ data: Record<string, any> }}) {{
  const steps = [[v(data,"step1"),v(data,"step1Desc")],[v(data,"step2"),v(data,"step2Desc")],[v(data,"step3"),v(data,"step3Desc")],[v(data,"step4"),v(data,"step4Desc")]];
  return (
    <section className="border-t px-5 py-16 lg:px-8" style={{{{ borderColor: "{{line}}" }}}}>
      <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-4">
        {{steps.map(([t,d],i) => (
          <div key={{t}} className="tpl-climb border-t pt-4" style={{{{ borderColor: "{{primary}}", animationDelay: `${{i*0.1}}s` }}}}>
            <span className="text-2xl font-bold" style={{{{ color: "{{primary}}" }}}}>0{{i+1}}</span>
            <h3 className="mt-2 font-bold">{{t}}</h3><p className="mt-1 text-sm" style={{{{ color: "{{muted}}" }}}}>{{d}}</p>
          </div>
        ))}}
      </div>
    </section>
  );
}}

function {prefix}ListingGrid({{ data }}: {{ data: Record<string, any> }}) {{
  const cards = [1,2,3,4].map((i) => ({{ t: v(data,`item${{i}}Title`), m: v(data,`item${{i}}Meta`), p: v(data,`item${{i}}Price`), img: v(data,`item${{i}}Image`) }}));
  return (
    <section className="border-t px-5 py-16 lg:px-8" style={{{{ borderColor: "{{line}}", background: "{{surface}}" }}}}>
      <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-2 lg:grid-cols-4">
        {{cards.map((c) => (
          <article key={{c.t}} className="overflow-hidden border" style={{{{ borderColor: "{{line}}" }}}}>
            <img src={{c.img}} alt="" className="aspect-[4/3] w-full object-cover" />
            <div className="p-4"><p className="text-xs" style={{{{ color: "{{primary}}" }}}}>{{c.m}}</p><h3 className="font-bold">{{c.t}}</h3><p className="mt-2 font-bold" style={{{{ color: "{{primary}}" }}}}>{{c.p}}</p></div>
          </article>
        ))}}
      </div>
    </section>
  );
}}

function {prefix}StatsRow({{ data }}: {{ data: Record<string, any> }}) {{
  const stats = [["stat1Value","stat1Label"],["stat2Value","stat2Label"],["stat3Value","stat3Label"]];
  return (
    <section className="border-t px-5 py-10 lg:px-8" style={{{{ borderColor: "{{line}}" }}}}>
      <div className="mx-auto grid max-w-7xl grid-cols-3 gap-4 text-center">
        {{stats.map(([vk,lk],i) => (
          <div key={{lk}} className="tpl-climb" style={{{{ animationDelay: `${{i*0.1}}s` }}}}>
            <div className="tpl-display text-4xl font-bold" style={{{{ color: "{{primary}}" }}}}>{{v(data,vk)}}</div>
            <p className="text-sm" style={{{{ color: "{{muted}}" }}}}>{{v(data,lk)}}</p>
          </div>
        ))}}
      </div>
    </section>
  );
}}'''


def build_layout_extras(layout: str) -> str:
    prefix, gal, ag, te, st = _LAYOUT[layout]
    return (
        _gallery(prefix, gal)
        + _agents(prefix, ag)
        + _testimonials(prefix, te)
        + _stats(prefix, st)
        + _extras_block(prefix)
    )


LAYOUT_EXTRAS_JSX = {layout: build_layout_extras(layout) for layout in _LAYOUT}

# Per-layout component names for PAGE_SECTION_MAP (unique per template)
LAYOUT_PREFIX = {layout: _LAYOUT[layout][0] for layout in _LAYOUT}

CTA_SECTIONS = frozenset({f"{p}CtaRibbon" for p in LAYOUT_PREFIX.values()})

SHARED_EXTRA_CSS = ""  # removed — effects live in per-layout EXTRA_CSS only
