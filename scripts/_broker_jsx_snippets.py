# Layout JSX snippets — use .format(primary=..., bg=..., secondary=..., etc.)
# Double braces { } become single braces in output.

BTNS = '''
          <div className="tpl-rise-3 mt-8 flex flex-wrap gap-3">
            <button type="button" onClick={onCta} className="px-7 py-3.5 text-sm font-bold" style={{ background: "{primary}", color: "{primaryText}" }}>{v(data, "heroPrimary")}</button>
            <button type="button" onClick={() => goTo("{secondary}")} className="border px-7 py-3.5 text-sm font-semibold" style={{ borderColor: "{line}" }}>{v(data, "heroSecondary")}</button>
          </div>'''

TEXT = '''
          <p className="tpl-rise text-xs font-semibold tracking-[0.28em]" style={{ color: "{primary}" }}>{v(data, "heroEyebrow")}</p>
          <h1 className="tpl-display tpl-rise-2 mt-4 max-w-4xl text-6xl font-bold leading-[0.92] md:text-8xl">{v(data, "heroTitle")}</h1>
          <p className="tpl-rise-3 mt-6 max-w-xl text-lg leading-8" style={{ color: "{muted}" }}>{v(data, "heroSubtitle")}</p>''' + BTNS

HERO_JSX = {
"propertyTicker": '''
      <section className="relative isolate min-h-[100vh] overflow-hidden">
        <img src={v(data, "heroImage")} alt="" className="tpl-ken absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, {dark}55, {bg}ee 80%)" }} />
        <div className="relative z-10 mx-auto flex min-h-[100vh] max-w-7xl flex-col justify-center px-5 pt-28 lg:px-8">''' + TEXT + '''
        </div>
        <div className="absolute inset-x-0 bottom-0 z-20 border-t py-3" style={{ borderColor: "{line}", background: "{surface}ee" }}>
          <div className="tpl-prop-ticker gap-10 px-4 text-sm font-bold" style={{ color: "{primary}" }}>
            {[1,2,3,4,1,2,3,4].map((i, idx) => (<span key={`ticker-${idx}`} className="whitespace-nowrap">{v(data, `item${i}Title`)} · {v(data, `item${i}Price`)} ·</span>))}
          </div>
        </div>
      </section>''',
"bentoGrid": '''
      <section className="px-5 py-16 lg:px-8 lg:py-20" style={{ background: "{bg}" }}>
        <div className="mx-auto max-w-7xl tpl-bento">
          <div className="col-span-4 overflow-hidden border p-6 md:col-span-3 md:row-span-2" style={{ borderColor: "{line}", background: "{surface}" }}>''' + TEXT + '''
          </div>
          <div className="col-span-2 overflow-hidden md:col-span-3"><img src={v(data, "heroImage")} alt="" className="tpl-ken h-full min-h-[280px] w-full object-cover" /></div>
          <div className="col-span-2 border p-4 md:col-span-2" style={{ borderColor: "{line}" }}><img src={v(data, "item1Image")} alt="" className="aspect-video w-full object-cover" /></div>
          <div className="col-span-2 border p-4 md:col-span-1" style={{ borderColor: "{line}", background: "{primary}", color: "{primaryText}" }}>
            <p className="text-xs font-bold">STAT</p><p className="tpl-display text-3xl font-bold">{v(data, "stat1Value")}</p><p className="text-sm">{v(data, "stat1Label")}</p>
          </div>
        </div>
      </section>''',
"floorPlan": '''
      <section className="grid min-h-[88vh] lg:grid-cols-2">
        <div className="flex flex-col justify-center px-5 py-16 lg:px-12">''' + TEXT + '''</div>
        <div className="relative min-h-[44vh] overflow-hidden lg:min-h-[88vh]">
          <img src={v(data, "heroImage")} alt="" className="absolute inset-0 h-full w-full object-cover opacity-40" />
          <svg className="absolute inset-0 h-full w-full p-8" viewBox="0 0 400 400" aria-hidden="true">
            <rect x="40" y="40" width="320" height="320" fill="none" stroke="{primary}" strokeWidth="2" className="tpl-plan-line" />
            <rect x="40" y="40" width="160" height="160" fill="{primary}22" stroke="{primary}" />
            <rect x="200" y="40" width="160" height="160" fill="{primary}11" stroke="{primary}" />
            <rect x="40" y="200" width="320" height="160" fill="{primary}18" stroke="{primary}" />
            <circle cx="120" cy="120" r="8" fill="{primary}" className="tpl-hotspot" />
            <circle cx="280" cy="120" r="8" fill="{primary}" className="tpl-hotspot" style={{ animationDelay: ".5s" }} />
            <circle cx="200" cy="280" r="8" fill="{primary}" className="tpl-hotspot" style={{ animationDelay: "1s" }} />
          </svg>
        </div>
      </section>''',
"curtainReveal": '''
      <section className="relative isolate min-h-[92vh] overflow-hidden" style={{ background: "{dark}" }}>
        <div className="tpl-curtain absolute inset-0"><img src={v(data, "heroImage")} alt="" className="tpl-ken h-full w-full object-cover" /></div>
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, {dark}cc, transparent 55%)" }} />
        <div className="relative z-10 mx-auto flex min-h-[92vh] max-w-7xl flex-col justify-end px-5 pb-20 pt-28 lg:px-8">''' + TEXT + '''</div>
      </section>''',
"stackingBlocks": '''
      <section className="relative overflow-hidden px-5 py-20 lg:px-8" style={{ background: "{bg}" }}>
        <div className="relative z-10 mx-auto max-w-7xl space-y-3 pt-32">
          <div className="tpl-block border-4 p-2" style={{ borderColor: "{line}", background: "{primary}", height: "1rem", animationDelay: "0s" }} />
          <div className="tpl-block border-4 p-2" style={{ borderColor: "{line}", background: "{text}", height: "1rem", animationDelay: ".15s" }} />
          <div className="tpl-block border-4 p-8" style={{ borderColor: "{line}", background: "{surface}", animationDelay: ".3s" }}>''' + TEXT + '''</div>
        </div>
      </section>''',
"elevatorTower": '''
      <section className="grid min-h-[90vh] lg:grid-cols-[1fr_2fr]">
        <div className="flex flex-col items-center justify-center border-l px-8 py-16" style={{ borderColor: "{line}", background: "{surface}" }}>
          <p className="text-xs tracking-[0.3em]" style={{ color: "{primary}" }}>קומה</p>
          <div className="tpl-elevator-digits tpl-display mt-4 overflow-hidden text-7xl font-bold" style={{ height: "1.2em", color: "{primary}" }}>
            <div>42</div><div>28</div><div>15</div><div>03</div>
          </div>
        </div>
        <div className="relative min-h-[50vh] lg:min-h-[90vh]">
          <img src={v(data, "heroImage")} alt="" className="tpl-ken absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0" style={{ background: "{dark}88" }} />
          <div className="relative z-10 flex h-full flex-col justify-end p-8 lg:p-12">''' + TEXT + '''</div>
        </div>
      </section>''',
"cityPins": '''
      <section className="relative min-h-[88vh] overflow-hidden" style={{ background: "{bg}" }}>
        <div className="absolute inset-x-0 bottom-0 h-48 opacity-30" style={{ background: "{dark}", clipPath: "polygon(0 100%, 0 40%, 15% 55%, 30% 35%, 45% 50%, 60% 25%, 75% 45%, 90% 30%, 100% 50%, 100% 100%)" }} />
        {[["20%","35%"],["45%","28%"],["70%","40%"],["85%","32%"]].map(([l,t], i) => (
          <div key={i} className="tpl-pin absolute h-4 w-4 rounded-full" style={{ left: l, top: t, background: "{primary}", animationDelay: `${i * 0.4}s` } />
        ))}
        <div className="relative z-10 mx-auto flex min-h-[88vh] max-w-7xl flex-col justify-center px-5 pt-24 lg:px-8">''' + TEXT + '''</div>
      </section>''',
"rotatingPanels": '''
      <section className="relative min-h-[88vh] overflow-hidden px-5 py-16 lg:px-8">
        <div className="tpl-rotate-stage mx-auto grid max-w-7xl gap-10 lg:grid-cols-2 lg:items-center">
          <div>''' + TEXT + '''</div>
          <div className="relative h-[420px]">
            <div className="tpl-rotate-track absolute inset-0">
              {[v(data,"heroImage"), v(data,"item1Image"), v(data,"item2Image")].map((src,i) => (
                <div key={i} className="absolute inset-0 overflow-hidden border" style={{ borderColor: "{line}", transform: `rotateY(${i * 120}deg) translateZ(220px)` }>
                  <img src={src} alt="" className="h-full w-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>''',
"compareSlider": '''
      <section className="relative min-h-[88vh] overflow-hidden">
        <div className="absolute inset-0 grid grid-cols-2">
          <img src={v(data, "item3Image")} alt="" className="h-full w-full object-cover" />
          <img src={v(data, "heroImage")} alt="" className="h-full w-full object-cover" />
        </div>
        <div className="tpl-compare-handle absolute inset-y-0 z-10 w-1" style={{ background: "{primary}" }}>
          <div className="absolute top-1/2 -mr-4 h-10 w-10 -translate-y-1/2 rounded-full border-4" style={{ borderColor: "{primary}", background: "{bg}" }} />
        </div>
        <div className="relative z-20 mx-auto flex min-h-[88vh] max-w-7xl flex-col justify-end px-5 pb-16 pt-28 lg:px-8">''' + TEXT + '''</div>
      </section>''',
"liveCounters": '''
      <section className="px-5 py-20 lg:px-8 lg:py-28" style={{ background: "{bg}" }}>
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-6 md:grid-cols-3">
            {[["stat1Value","stat1Label"],["stat2Value","stat2Label"],["stat3Value","stat3Label"]].map(([vk, lk], i) => (
              <div key={vk} className="tpl-counter border p-6 text-center" style={{ borderColor: "{line}", animationDelay: `${i * 0.12}s` }>
                <div className="tpl-display text-5xl font-bold" style={{ color: "{primary}" }}>{v(data, vk)}</div>
                <p className="mt-2 text-sm" style={{ color: "{muted}" }}>{v(data, lk)}</p>
              </div>
            ))}
          </div>
          <div className="mt-16 text-center">
            <p className="tpl-rise text-xs font-semibold tracking-[0.28em]" style={{ color: "{primary}" }}>{v(data, "heroEyebrow")}</p>
            <h1 className="tpl-display tpl-rise-2 mt-4 text-5xl font-bold md:text-7xl">{v(data, "heroTitle")}</h1>
            <p className="tpl-rise-3 mx-auto mt-6 max-w-2xl text-lg leading-8" style={{ color: "{muted}" }}>{v(data, "heroSubtitle")}</p>
            <div className="tpl-rise-3 mt-8 flex flex-wrap justify-center gap-3">
              <button type="button" onClick={onCta} className="px-7 py-3.5 text-sm font-bold" style={{ background: "{primary}", color: "{primaryText}" }}>{v(data, "heroPrimary")}</button>
              <button type="button" onClick={() => goTo("{secondary}")} className="border px-7 py-3.5 text-sm font-semibold" style={{ borderColor: "{line}" }}>{v(data, "heroSecondary")}</button>
            </div>
          </div>
        </div>
      </section>''',
"stampProcess": '''
      <section className="relative min-h-[88vh] overflow-hidden">
        <img src={v(data, "heroImage")} alt="" className="tpl-ken absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0" style={{ background: "{dark}bb" }} />
        <div className="tpl-stamp absolute left-1/2 top-1/2 z-10 grid h-36 w-36 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-4 text-center text-xs font-bold" style={{ borderColor: "{primary}", color: "{primary}" }}>חתום<br/>איכות</div>
        <div className="relative z-20 mx-auto flex min-h-[88vh] max-w-7xl flex-col justify-end px-5 pb-16 pt-28 lg:px-8">''' + TEXT + '''</div>
      </section>''',
"diagonalAxis": '''
      <section className="relative min-h-[88vh] overflow-hidden">
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, {bg} 45%, {surface} 45%)" }} />
        <div className="tpl-axis-line absolute inset-0 m-auto h-px w-[140%] -rotate-12" style={{ background: "{primary}" }} />
        <div className="tpl-axis-line absolute inset-0 m-auto h-px w-[140%] rotate-12" style={{ background: "{line}", animationDelay: ".3s" }} />
        <div className="relative z-10 mx-auto grid min-h-[88vh] max-w-7xl items-center gap-10 px-5 py-24 lg:grid-cols-2 lg:px-8">
          <div>''' + TEXT + '''</div>
          <div className="overflow-hidden border" style={{ borderColor: "{line}" }}><img src={v(data, "heroImage")} alt="" className="tpl-ken aspect-[4/3] w-full object-cover" /></div>
        </div>
      </section>''',
}

CARD_SEC = '''
function FeaturedCards({ data }: { data: Record<string, any> }) {
  const cards = [1,2,3,4].map((i) => ({
    title: v(data, `item${i}Title`), meta: v(data, `item${i}Meta`), text: v(data, `item${i}Text`),
    price: v(data, `item${i}Price`), img: v(data, `item${i}Image`),
  }));
  return (
    <section className="border-t px-5 py-16 lg:px-8 lg:py-20" style={{ borderColor: "{line}", background: "{surface}" }}>
      <div className="mx-auto max-w-7xl">
        <h2 className="tpl-display text-4xl font-bold md:text-5xl">נכסים נבחרים</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {cards.map((c) => (
            <article key={c.title} className="tpl-zoom-card group overflow-hidden border" style={{ borderColor: "{line}", background: "{bg}" }}>
              <img src={c.img} alt="" className="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="p-4">
                <p className="text-xs font-semibold" style={{ color: "{primary}" }}>{c.meta}</p>
                <h3 className="tpl-display mt-1 text-xl font-bold">{c.title}</h3>
                <p className="mt-2 text-sm leading-6" style={{ color: "{muted}" }}>{c.text}</p>
                <p className="mt-3 text-lg font-bold" style={{ color: "{primary}" }}>{c.price}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
function AgentStrip({ data }: { data: Record<string, any> }) {
  const agents = ["דנה כהן · מכירות", "יוסי לevi · השקעות", "מיכal רוז · יוקרה", "עמית שר · השכרה"];
  return (
    <section className="tpl-sweep overflow-hidden border-y py-4" style={{ borderColor: "{line}" }}>
      <div className="tpl-marquee-track gap-10 px-4 text-sm font-bold" style={{ color: "{text}" }}>
        {agents.concat(agents).map((a, i) => <span key={`agent-${i}`} className="whitespace-nowrap">{a} ·</span>)}
      </div>
    </section>
  );
}
function AnimatedStats({ data }: { data: Record<string, any> }) {
  const stats = [["stat1Value","stat1Label"],["stat2Value","stat2Label"],["stat3Value","stat3Label"]];
  return (
    <section className="border-t px-5 py-12 lg:px-8" style={{ borderColor: "{line}" }}>
      <div className="mx-auto grid max-w-7xl grid-cols-3 gap-6 text-center">
        {stats.map(([vk, lk], i) => (
          <div key={lk} className="tpl-climb" style={{ animationDelay: `${i * 0.1}s` }}>
            <div className="tpl-display text-4xl font-bold md:text-5xl" style={{ color: "{primary}" }}>{v(data, vk)}</div>
            <p className="mt-2 text-sm" style={{ color: "{muted}" }}>{v(data, lk)}</p>
          </div>
        ))}
      </div>
    </section>
  );
}'''

SECTIONS_JSX = {
"propertyTicker": CARD_SEC,
"bentoGrid": '''
function BentoShowcase({ data }: { data: Record<string, any> }) {
  const items = [1,2,3,4].map((i) => [v(data,`item${i}Title`), v(data,`item${i}Price`), v(data,`item${i}Image`)]);
  return (
    <section className="border-t px-5 py-16 lg:px-8" style={{ borderColor: "{line}" }}>
      <div className="mx-auto max-w-7xl tpl-bento">
        {items.map(([title, price, img], i) => (
          <article key={title} className="overflow-hidden border p-3" style={{ borderColor:"{line}", gridColumn: i===0?"span 3":"span 2", background:"{surface}" }}>
            <img src={img} alt="" className="aspect-video w-full object-cover" />
            <h3 className="tpl-display mt-3 text-xl font-bold">{title}</h3><p style={{ color:"{primary}" }}>{price}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
function NeighborhoodMarquee({ data }: { data: Record<string, any> }) {
  const tags = ["נווה צדק","פlorian","רamat aviv","יפו","שרona"];
  return (
    <section className="tpl-sweep overflow-hidden border-y py-3" style={{ borderColor:"{line}", background:"{surface}" }}>
      <div className="tpl-marquee-track gap-8 px-4 text-sm font-bold tracking-[0.2em]" style={{ color:"{primary}" }}>
        {tags.concat(tags).map((t,i)=><span key={`tag-${i}`} className="whitespace-nowrap">{t} ·</span>)}
      </div>
    </section>
  );
}
function ProcessSteps({ data }: { data: Record<string, any> }) {
  const steps = ["מיפוי דרישות","סינון נכסים","סיורים ממוקדים","סגירת עסקה"];
  return (
    <section className="border-t px-5 py-14 lg:px-8" style={{ borderColor:"{line}" }}>
      <div className="mx-auto max-w-7xl">
        <div className="tpl-line-draw mb-8 h-px w-full" style={{ background:"{primary}" }} />
        <div className="grid gap-6 md:grid-cols-4">
          {steps.map((s,i)=>(<div key={s} className="tpl-climb border-t pt-4" style={{ borderColor:"{primary}", animationDelay:`${`${i*0.1}s` })[2:-4]}s` }}><span className="text-2xl font-bold" style={{ color:"{primary}" }}>0{i+1}</span><p className="mt-2 font-semibold">{s}</p></div>))}
        </div>
      </div>
    </section>
  );
}''',
"floorPlan": '''
function HotspotCards({ data }: { data: Record<string, any> }) {
  const rooms = [["סalון","45 מ״ר · אור"],["מטבח","18 מ״ר · שף"],["master","22 מ״ר · ensuite"]];
  return (
    <section className="border-t px-5 py-16 lg:px-8" style={{ borderColor:"{line}", background:"{surface}" }}>
      <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-3">
        {rooms.map(([t,m])=>(<div key={t} className="tpl-hotspot border p-5" style={{ borderColor:"{line}" }}><h3 className="tpl-display text-xl font-bold">{t}</h3><p className="text-sm" style={{ color:"{muted}" }}>{m}</p></div>))}
      </div>
    </section>
  );
}
function CompareStrip({ data }: { data: Record<string, any> }) {
  return (
    <section className="border-t px-5 py-12 lg:px-8" style={{ borderColor:"{line}" }}>
      <div className="mx-auto flex max-w-7xl gap-4 overflow-x-auto">
        {[1,2,3].map((i)=>(<div key={i} className="min-w-[240px] flex-shrink-0 border p-4" style={{ borderColor:"{line}" }}>
          <img src={v(data,`item${i}Image`)} alt="" className="mb-3 aspect-video w-full object-cover" />
          <p className="font-bold">{v(data,`item${i}Title`)}</p><p className="text-sm" style={{ color:"{muted}" }}>{v(data,`item${i}Meta`)}</p>
        </div>))}
      </div>
    </section>
  );
}
function MortgageVisual({ data }: { data: Record<string, any> }) {
  return (
    <section className="border-t px-5 py-14 lg:px-8" style={{ borderColor:"{line}", background:"{surface}" }}>
      <div className="mx-auto max-w-md grid gap-3">
        <p className="tpl-display text-2xl font-bold">מחשבון משכנתא (הדגמה)</p>
        <input readOnly className="border bg-transparent px-4 py-3" style={{ borderColor:"{line}" }} defaultValue="סכום: ₪2,400,000" />
        <input readOnly className="border bg-transparent px-4 py-3" style={{ borderColor:"{line}" }} defaultValue="ריבית: 4.8%" />
        <div className="border p-4 text-center font-bold" style={{ borderColor:"{primary}", color:"{primary}" }}>החזר חודשי: ₪12,640</div>
      </div>
    </section>
  );
}''',
"curtainReveal": '''
function VaultCards({ data }: { data: Record<string, any> }) {
  const cards = [1,2,3,4].map((i)=>[v(data,`item${i}Title`),v(data,`item${i}Price`),v(data,`item${i}Image`)]);
  return (
    <section className="border-t px-5 py-16 lg:px-8" style={{ borderColor:"{line}" }}>
      <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-2">
        {cards.map(([title,price,img])=>(<article key={title} className="group overflow-hidden border" style={{ borderColor:"{primary}44", background:"{surface}" }}>
          <div className="relative h-56 overflow-hidden"><img src={img} alt="" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" /></div>
          <div className="p-5"><h3 className="tpl-display text-2xl font-bold">{title}</h3><p className="mt-2 text-lg" style={{ color:"{primary}" }}>{price}</p></div>
        </article>))}
      </div>
    </section>
  );
}
function TestimonialStrip({ data }: { data: Record<string, any> }) {
  const quotes = [v(data,"quote"),"ליווי מקצועי מהרגע הראשון.","שקיפות מלאה בכל שלב."];
  return (
    <section className="overflow-hidden border-t py-6" style={{ borderColor:"{line}" }}>
      <div className="tpl-testi-track gap-8 px-4">
        {quotes.concat(quotes).map((q,i)=>(<blockquote key={`quote-${i}`} className="whitespace-nowrap border px-6 py-3 text-lg" style={{ borderColor:"{line}", color:"{muted}" }}>{q}</blockquote>))}
      </div>
    </section>
  );
}''',
"stackingBlocks": '''
function NumberedIndex({ data }: { data: Record<string, any> }) {
  return (
    <section className="border-t px-5 py-16 lg:px-8" style={{ borderColor:"{line}" }}>
      <div className="mx-auto max-w-7xl">
        {[1,2,3,4].map((i)=>(<div key={i} className="tpl-block flex items-center gap-6 border-b py-6" style={{ borderColor:"{line}", animationDelay:`${i*0.08}s` }}>
          <span className="tpl-display text-6xl font-black" style={{ color:"{primary}" }}>{String(i).padStart(2,"0")}</span>
          <div><h3 className="tpl-display text-3xl font-bold">{v(data,`item${i}Title`)}</h3><p style={{ color:"{muted}" }}>{v(data,`item${i}Meta`)} · {v(data,`item${i}Price`)}</p></div>
        </div>))}
      </div>
    </section>
  );
}
function BoldContactBand({ data, onCta }: { data: Record<string, any>; onCta: () => void }) {
  return (
    <section className="px-5 py-16 lg:px-8" style={{ background:"{primary}", color:"{primaryText}" }}>
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 md:flex-row md:items-center">
        <h2 className="tpl-display text-5xl font-black md:text-7xl">{v(data,"contactTitle")}</h2>
        <button type="button" onClick={onCta} className="border-4 px-8 py-4 text-lg font-bold" style={{ borderColor:"{primaryText}" }}>{v(data,"cta")}</button>
      </div>
    </section>
  );
}''',
"elevatorTower": '''
function PenthouseStack({ data }: { data: Record<string, any> }) {
  return (
    <section className="border-t px-5 py-16 lg:px-8" style={{ borderColor:"{line}", background:"{surface}" }}>
      <div className="mx-auto flex max-w-7xl flex-col gap-4">
        {[1,2,3].map((i)=>(<article key={i} className="tpl-climb flex flex-col overflow-hidden border md:flex-row" style={{ borderColor:"{line}", animationDelay:`${i*0.12}s`, marginRight:`${i*12}px` }}>
          <img src={v(data,`item${i}Image`)} alt="" className="h-48 w-full object-cover md:h-auto md:w-72" />
          <div className="p-6"><h3 className="tpl-display text-2xl font-bold">{v(data,`item${i}Title`)}</h3><p className="mt-2" style={{ color:"{primary}" }}>{v(data,`item${i}Price`)}</p></div>
        </article>))}
      </div>
    </section>
  );
}
function SkylineStats({ data }: { data: Record<string, any> }) {
  const stats = [["stat1Value","stat1Label"],["stat2Value","stat2Label"],["stat3Value","stat3Label"]];
  return (
    <section className="border-t px-5 py-12 lg:px-8" style={{ borderColor:"{line}" }}>
      <div className="mx-auto grid max-w-7xl grid-cols-3 gap-6 text-center">
        {stats.map(([vk, lk], i) => (
          <div key={lk} className="tpl-climb" style={{ animationDelay:`${i*0.1}s` }}>
            <div className="tpl-display text-4xl font-bold" style={{ color:"{primary}" }}>{v(data, vk)}</div>
            <p className="mt-2 text-sm" style={{ color:"{muted}" }}>{v(data, lk)}</p>
          </div>
        ))}
      </div>
    </section>
  );
}''',
"cityPins": '''
function AreaGuides({ data }: { data: Record<string, any> }) {
  const areas = [1,2,3].map((i)=>[v(data,`item${i}Title`),v(data,`item${i}Text`)]);
  return (
    <section className="border-t px-5 py-16 lg:px-8" style={{ borderColor:"{line}" }}>
      <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-3">
        {areas.map(([t,x])=>(<div key={t} className="border p-5" style={{ borderColor:"{line}", background:"{surface}" }}>
          <div className="tpl-pin mb-3 h-3 w-3 rounded-full" style={{ background:"{primary}" }} /><h3 className="tpl-display text-xl font-bold">{t}</h3><p className="mt-2 text-sm" style={{ color:"{muted}" }}>{x}</p>
        </div>))}
      </div>
    </section>
  );
}
function LocationRows({ data }: { data: Record<string, any> }) {
  return (
    <section className="border-t px-5 py-12 lg:px-8" style={{ borderColor:"{line}", background:"{surface}" }}>
      <div className="mx-auto max-w-7xl divide-y" style={{ borderColor:"{line}" }}>
        {[1,2,3,4].map((i)=>(<div key={i} className="flex flex-wrap items-center justify-between gap-4 py-5">
          <div><span className="rounded px-2 py-1 text-xs font-bold" style={{ background:"{primary}22", color:"{primary}" }}>{v(data,`item${i}Meta`)}</span><h3 className="tpl-display mt-2 text-2xl font-bold">{v(data,`item${i}Title`)}</h3></div>
          <p className="text-xl font-bold" style={{ color:"{primary}" }}>{v(data,`item${i}Price`)}</p>
        </div>))}
      </div>
    </section>
  );
}''',
"rotatingPanels": '''
function OpenHouseTimeline({ data }: { data: Record<string, any> }) {
  const events = [1,2,3,4].map((i)=>[v(data,`item${i}Title`),v(data,`item${i}Meta`)]);
  return (
    <section className="border-t px-5 py-16 lg:px-8" style={{ borderColor:"{line}" }}>
      <div className="mx-auto max-w-7xl">
        {events.map(([t,m],i)=>(<div key={t} className="tpl-climb relative border-r-2 pr-8 pb-8" style={{ borderColor:"{primary}", animationDelay:`${i*0.1}s` }}>
          <span className="text-sm font-bold" style={{ color:"{primary}" }}>{m}</span><h3 className="tpl-display text-2xl font-bold">{t}</h3>
        </div>))}
      </div>
    </section>
  );
}
function MasonryGallery({ data }: { data: Record<string, any> }) {
  return (
    <section className="border-t px-5 py-16 lg:px-8" style={{ borderColor:"{line}", background:"{surface}" }}>
      <div className="mx-auto max-w-7xl tpl-masonry">
        {[1,2,3,4].map((i)=>(<figure key={i} className="mb-4 break-inside-avoid overflow-hidden border" style={{ borderColor:"{line}" }}>
          <img src={v(data,`item${i}Image`)} alt="" className="w-full object-cover" style={{ height: i%2?"220px":"280px" }} />
        </figure>))}
      </div>
    </section>
  );
}''',
"compareSlider": '''
function BeforeAfterShowcase({ data }: { data: Record<string, any> }) {
  return (
    <section className="border-t px-5 py-16 lg:px-8" style={{ borderColor:"{line}" }}>
      <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-2">
        {[1,2].map((i)=>(<div key={i} className="overflow-hidden border" style={{ borderColor:"{line}" }}>
          <img src={v(data,`item${i}Image`)} alt="" className="aspect-video w-full object-cover" />
          <div className="p-4"><h3 className="tpl-display text-xl font-bold">{v(data,`item${i}Title`)}</h3><p style={{ color:"{primary}" }}>{v(data,`item${i}Price`)}</p></div>
        </div>))}
      </div>
    </section>
  );
}
function ValueBands({ data }: { data: Record<string, any> }) {
  const bands = [["שקיפות","מחירים אמיתיים"],["פוטנציאל","ראו מה אפשר"],["ליווי","עד סגירה"]];
  return (
    <section className="grid md:grid-cols-3">
      {bands.map(([t,x])=>(<div key={t} className="border-t px-6 py-10 text-center md:border-l" style={{ borderColor:"{line}", background:"{surface}" }}>
        <h3 className="tpl-display text-2xl font-bold">{t}</h3><p className="mt-2 text-sm" style={{ color:"{muted}" }}>{x}</p>
      </div>))}
    </section>
  );
}''',
"liveCounters": '''
function BadgeCards({ data }: { data: Record<string, any> }) {
  const badges = ["נוף","חניה","ממ״ד","משופץ"];
  return (
    <section className="border-t px-5 py-16 lg:px-8" style={{ borderColor:"{line}", background:"{surface}" }}>
      <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-2 lg:grid-cols-4">
        {[1,2,3,4].map((i)=>(<article key={i} className="border p-4" style={{ borderColor:"{line}" }}>
          <div className="mb-3 flex flex-wrap gap-1">{badges.slice(0,2).map((b)=><span key={b} className="rounded px-2 py-0.5 text-[10px] font-bold" style={{ background:"{primary}22", color:"{primary}" }}>{b}</span>)}</div>
          <h3 className="tpl-display text-lg font-bold">{v(data,`item${i}Title`)}</h3>
          <p className="mt-2 text-sm" style={{ color:"{primary}" }}>{v(data,`item${i}Price`)}</p>
        </article>))}
      </div>
    </section>
  );
}
function FaqVisual({ data }: { data: Record<string, any> }) {
  const faqs = [["איך מתחילים?","משאירים פרטים ומקבלים התאמות."],["מה העמלה?","שקוף ומוסכם מראש."],["כמה זמן?","בממוצע 42 ימים."]];
  return (
    <section className="border-t px-5 py-14 lg:px-8" style={{ borderColor:"{line}" }}>
      <div className="mx-auto max-w-3xl grid gap-3">
        {faqs.map(([q,a])=>(<div key={q} className="border p-4" style={{ borderColor:"{line}" }}><p className="font-bold">{q}</p><p className="mt-2 text-sm" style={{ color:"{muted}" }}>{a}</p></div>))}
      </div>
    </section>
  );
}''',
"stampProcess": '''
function StampSteps({ data }: { data: Record<string, any> }) {
  const steps = ["אפיון","סינון","סיור","חתימה"];
  return (
    <section className="border-t px-5 py-16 lg:px-8" style={{ borderColor:"{line}" }}>
      <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-4">
        {steps.map((s,i)=>(<div key={s} className="tpl-stamp border p-6 text-center" style={{ borderColor:"{primary}", animationDelay:`${i*0.2}s` }}>
          <div className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-full border-2 text-xs font-bold" style={{ borderColor:"{primary}", color:"{primary}" }}>חתום</div>
          <p className="font-bold">{s}</p>
        </div>))}
      </div>
    </section>
  );
}
function ListingSpotlight({ data }: { data: Record<string, any> }) {
  return (
    <section className="border-t px-5 py-16 lg:px-8" style={{ borderColor:"{line}", background:"{surface}" }}>
      <div className="mx-auto grid max-w-7xl overflow-hidden border lg:grid-cols-2" style={{ borderColor:"{line}" }}>
        <img src={v(data,"item1Image")} alt="" className="min-h-[320px] w-full object-cover" />
        <div className="flex flex-col justify-center p-8">
          <p className="text-xs font-bold tracking-[0.24em]" style={{ color:"{primary}" }}>נכס השבוע</p>
          <h3 className="tpl-display mt-3 text-4xl font-bold">{v(data,"item1Title")}</h3>
          <p className="mt-4 text-lg" style={{ color:"{muted}" }}>{v(data,"item1Text")}</p>
          <p className="mt-6 text-3xl font-bold" style={{ color:"{primary}" }}>{v(data,"item1Price")}</p>
        </div>
      </div>
    </section>
  );
}''',
"diagonalAxis": '''
function SkewedGrid({ data }: { data: Record<string, any> }) {
  return (
    <section className="border-t px-5 py-16 lg:px-8" style={{ borderColor:"{line}" }}>
      <div className="mx-auto max-w-7xl tpl-skew-grid grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1,2,3,4].map((i)=>(<article key={i} className="overflow-hidden border" style={{ borderColor:"{line}", background:"{surface}" }}>
          <img src={v(data,`item${i}Image`)} alt="" className="aspect-[4/3] w-full object-cover" />
          <div className="p-4"><h3 className="tpl-display font-bold">{v(data,`item${i}Title`)}</h3><p style={{ color:"{primary}" }}>{v(data,`item${i}Price`)}</p></div>
        </article>))}
      </div>
    </section>
  );
}
function AngledContactPanel({ data, onCta }: { data: Record<string, any>; onCta: () => void }) {
  return (
    <section className="relative overflow-hidden px-5 py-16 lg:px-8" style={{ background:"{surface}" }}>
      <div className="absolute inset-0 -skew-y-3" style={{ background:"{primary}18" }} />
      <div className="relative mx-auto max-w-xl grid gap-3">
        <h2 className="tpl-display text-3xl font-bold">{v(data,"contactTitle")}</h2>
        <input className="border bg-transparent px-4 py-3" style={{ borderColor:"{line}" } placeholder="שם" />
        <input className="border bg-transparent px-4 py-3" style={{ borderColor:"{line}" } placeholder="טלפון" />
        <button type="button" onClick={onCta} className="px-6 py-4 font-bold" style={{ background:"{primary}", color:"{primaryText}" }}>{v(data,"cta")}</button>
      </div>
    </section>
  );
}''',
}

THUMBNAIL_JSX = {
"propertyTicker": '''<div className="absolute inset-0"><div className="absolute inset-0" style={{ backgroundImage:"url({hero})", backgroundSize:"cover" }} /><div className="absolute inset-x-0 bottom-0 h-8 overflow-hidden border-t" style={{ borderColor:"{primary}" }/><div className="absolute bottom-10 right-4"><p className="text-[10px]" style={{ color:"{primary}" }}>{niche}</p><h3 className="text-3xl font-bold" style={{ fontFamily:'{fonts}', color:"{text}" }}>{name}</h3></div></div>''',
"bentoGrid": '''<div className="grid h-full min-h-[260px] grid-cols-3 gap-1 p-2" style={{ background:"{bg}" }}><div className="col-span-2 p-2"><p className="text-[10px]" style={{ color:"{primary}" }}>{niche}</p><h3 className="text-2xl font-bold" style={{ fontFamily:'{fonts}' }}>{name}</h3></div><div style={{ backgroundImage:"url({hero})", backgroundSize:"cover" }} /><div className="col-span-3 h-6" style={{ background:"{primary}" }} /></div>''',
"compareSlider": '''<div className="relative h-full min-h-[260px]"><div className="absolute inset-0 grid grid-cols-2"><div style={{ backgroundImage:"url({a})", backgroundSize:"cover" }} /><div style={{ backgroundImage:"url({hero})", backgroundSize:"cover" }} /></div><div className="absolute inset-y-0 left-1/2 w-0.5" style={{ background:"{primary}" }} /><div className="absolute bottom-4 right-4"><h3 className="text-2xl font-bold" style={{ fontFamily:'{fonts}', color:"#fff" }}>{name}</h3></div></div>''',
"diagonalAxis": '''<div className="relative h-full min-h-[260px] overflow-hidden" style={{ background:"linear-gradient(135deg,{bg} 50%,{surface} 50%)" }}> <div className="absolute inset-x-0 top-1/2 h-0.5 -rotate-12" style={{ background:"{primary}" }} /><div className="relative p-4"><h3 className="text-3xl font-bold" style={{ fontFamily:'{fonts}', color:"{text}" }}>{name}</h3></div></div>''',
}
DEFAULT_THUMB = '''<div className="relative h-full min-h-[260px] overflow-hidden"><div className="absolute inset-0" style={{ backgroundImage:"url({hero})", backgroundSize:"cover" }} /><div className="absolute inset-0" style={{ background:"{dark}88" }} /><div className="absolute bottom-4 right-4 left-4"><p className="text-[10px]" style={{ color:"{primary}" }}>{niche}</p><h3 className="text-3xl font-bold" style={{ fontFamily:'{fonts}', color:"{text}" }}>{name}</h3></div></div>'''
for k in HERO_JSX:
    THUMBNAIL_JSX.setdefault(k, DEFAULT_THUMB)
