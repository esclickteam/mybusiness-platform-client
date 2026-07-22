# Shared premium sections injected into every broker template.
# Palette placeholders: {primary}, {primaryText}, {bg}, {surface}, {text}, {muted}, {line}, {dark}

SHARED_SECTIONS_JSX = '''
function TestimonialsBlock({ data }: { data: Record<string, any> }) {
  const items = [
    { quote: v(data, "quote"), author: v(data, "brandName"), role: "לקוחות מרוצים" },
    { quote: v(data, "testimonial2"), author: v(data, "testimonial2Author"), role: v(data, "testimonial2Role") },
    { quote: v(data, "testimonial3"), author: v(data, "testimonial3Author"), role: v(data, "testimonial3Role") },
  ];
  return (
    <section className="tpl-sweep overflow-hidden border-t py-16 lg:py-20" style={{ borderColor: "{line}", background: "{surface}" }}>
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <p className="tpl-rise text-xs font-semibold tracking-[0.28em]" style={{ color: "{primary}" }}>המלצות</p>
        <h2 className="tpl-display tpl-rise-2 mt-3 text-4xl font-bold md:text-5xl">מה אומרים עלינו</h2>
      </div>
      <div className="tpl-testi-track mt-10 gap-6 px-5">
        {items.concat(items).map((t, i) => (
          <blockquote key={`testi-${i}`} className="tpl-glass min-w-[320px] max-w-[420px] shrink-0 border p-6 md:min-w-[380px]" style={{ borderColor: "{line}" }}>
            <p className="text-lg leading-8" style={{ color: "{text}" }}>&ldquo;{t.quote}&rdquo;</p>
            <footer className="mt-5 flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-full text-xs font-bold" style={{ background: "{primary}", color: "{primaryText}" }}>{String(t.author || "?")[0]}</span>
              <div><p className="font-bold">{t.author}</p><p className="text-xs" style={{ color: "{muted}" }}>{t.role}</p></div>
            </footer>
          </blockquote>
        ))}
      </div>
    </section>
  );
}

function AgentGrid({ data }: { data: Record<string, any> }) {
  const agents = [
    { name: v(data, "agent1Name"), role: v(data, "agent1Role"), deals: v(data, "agent1Deals"), img: v(data, "agent1Image") },
    { name: v(data, "agent2Name"), role: v(data, "agent2Role"), deals: v(data, "agent2Deals"), img: v(data, "agent2Image") },
    { name: v(data, "agent3Name"), role: v(data, "agent3Role"), deals: v(data, "agent3Deals"), img: v(data, "agent3Image") },
    { name: v(data, "agent4Name"), role: v(data, "agent4Role"), deals: v(data, "agent4Deals"), img: v(data, "agent4Image") },
  ];
  return (
    <section className="border-t px-5 py-16 lg:px-8 lg:py-20" style={{ borderColor: "{line}" }}>
      <div className="mx-auto max-w-7xl">
        <p className="tpl-rise text-xs font-semibold tracking-[0.28em]" style={{ color: "{primary}" }}>הצוות</p>
        <h2 className="tpl-display tpl-rise-2 mt-3 text-4xl font-bold md:text-5xl">סוכנים שמכירים כל פינה</h2>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {agents.map((a, i) => (
            <article key={a.name} className="tpl-climb tpl-glass group overflow-hidden border" style={{ borderColor: "{line}", animationDelay: `${i * 0.08}s` }}>
              <div className="relative h-56 overflow-hidden">
                <img src={a.img} alt="" className="h-full w-full object-cover transition duration-700 group-hover:scale-110" />
                <div className="tpl-glow absolute inset-0 opacity-0 transition group-hover:opacity-100" />
              </div>
              <div className="p-5">
                <h3 className="tpl-display text-xl font-bold">{a.name}</h3>
                <p className="mt-1 text-sm" style={{ color: "{primary}" }}>{a.role}</p>
                <p className="mt-3 text-xs font-semibold tracking-wide" style={{ color: "{muted}" }}>{a.deals}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function TrustBadges({ data }: { data: Record<string, any> }) {
  const badges = [
    [v(data, "stat1Value"), v(data, "stat1Label")],
    [v(data, "stat2Value"), v(data, "stat2Label")],
    [v(data, "stat3Value"), v(data, "stat3Label")],
    ["100%", "שקיפות מלאה"],
  ];
  return (
    <section className="border-t px-5 py-14 lg:px-8" style={{ borderColor: "{line}", background: "{dark}" }}>
      <div className="mx-auto grid max-w-7xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {badges.map(([val, label], i) => (
          <div key={label} className="tpl-climb tpl-shimmer border p-6 text-center" style={{ borderColor: "{line}", animationDelay: `${i * 0.1}s` }}>
            <div className="tpl-display text-4xl font-bold md:text-5xl" style={{ color: "{primary}" }}>{val}</div>
            <p className="mt-2 text-sm font-semibold tracking-wide" style={{ color: "{muted}" }}>{label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function MarketInsights({ data }: { data: Record<string, any> }) {
  const posts = [
    { title: v(data, "insight1Title"), text: v(data, "insight1Text"), tag: v(data, "insight1Tag") },
    { title: v(data, "insight2Title"), text: v(data, "insight2Text"), tag: v(data, "insight2Tag") },
    { title: v(data, "insight3Title"), text: v(data, "insight3Text"), tag: v(data, "insight3Tag") },
  ];
  return (
    <section className="border-t px-5 py-16 lg:px-8 lg:py-20" style={{ borderColor: "{line}", background: "{surface}" }}>
      <div className="mx-auto max-w-7xl">
        <p className="tpl-rise text-xs font-semibold tracking-[0.28em]" style={{ color: "{primary}" }}>תובנות שוק</p>
        <h2 className="tpl-display tpl-rise-2 mt-3 text-4xl font-bold md:text-5xl">מה קורה בשוק הנדל״ן</h2>
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {posts.map((p, i) => (
            <article key={p.title} className="tpl-climb group border p-6 transition hover:-translate-y-1" style={{ borderColor: "{line}", background: "{bg}", animationDelay: `${i * 0.12}s` }}>
              <span className="rounded px-2 py-1 text-[10px] font-bold tracking-wider" style={{ background: "{primary}22", color: "{primary}" }}>{p.tag}</span>
              <h3 className="tpl-display mt-4 text-2xl font-bold">{p.title}</h3>
              <p className="mt-3 text-sm leading-7" style={{ color: "{muted}" }}>{p.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function CtaBand({ data, onCta }: { data: Record<string, any>; onCta: () => void }) {
  return (
    <section className="relative overflow-hidden px-5 py-16 lg:px-8 lg:py-20" style={{ background: "{primary}" }}>
      <div className="tpl-parallax absolute inset-0 opacity-20" style={{ background: "radial-gradient(circle at 20% 50%, {primaryText}, transparent 55%)" }} />
      <div className="relative mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 md:flex-row md:items-center">
        <div>
          <p className="text-xs font-bold tracking-[0.3em]" style={{ color: "{primaryText}", opacity: 0.7 }}>{v(data, "brandName")}</p>
          <h2 className="tpl-display mt-3 text-4xl font-bold md:text-5xl" style={{ color: "{primaryText}" }}>{v(data, "ctaTitle")}</h2>
          <p className="mt-4 max-w-xl text-lg" style={{ color: "{primaryText}", opacity: 0.85 }}>{v(data, "ctaText")}</p>
        </div>
        <button type="button" onClick={onCta} className="tpl-magnetic border-2 px-8 py-4 text-lg font-bold transition hover:scale-105" style={{ borderColor: "{primaryText}", color: "{primaryText}", background: "transparent" }}>{v(data, "cta")}</button>
      </div>
    </section>
  );
}

function FaqBlock({ data }: { data: Record<string, any> }) {
  const faqs = [
    [v(data, "faq1Q"), v(data, "faq1A")],
    [v(data, "faq2Q"), v(data, "faq2A")],
    [v(data, "faq3Q"), v(data, "faq3A")],
    [v(data, "faq4Q"), v(data, "faq4A")],
  ];
  return (
    <section className="border-t px-5 py-16 lg:px-8 lg:py-20" style={{ borderColor: "{line}" }}>
      <div className="mx-auto max-w-3xl">
        <p className="tpl-rise text-xs font-semibold tracking-[0.28em]" style={{ color: "{primary}" }}>שאלות נפוצות</p>
        <h2 className="tpl-display tpl-rise-2 mt-3 text-4xl font-bold">כל מה שרציתם לדעת</h2>
        <div className="mt-10 grid gap-3">
          {faqs.map(([q, a], i) => (
            <details key={q} className="tpl-climb group border" style={{ borderColor: "{line}", animationDelay: `${i * 0.08}s` }}>
              <summary className="cursor-pointer list-none px-5 py-4 font-bold marker:content-none">{q}</summary>
              <p className="border-t px-5 py-4 text-sm leading-7" style={{ borderColor: "{line}", color: "{muted}" }}>{a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function OfficeMap({ data }: { data: Record<string, any> }) {
  return (
    <section className="border-t px-5 py-16 lg:px-8 lg:py-20" style={{ borderColor: "{line}", background: "{surface}" }}>
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="text-xs font-semibold tracking-[0.28em]" style={{ color: "{primary}" }}>המשרד</p>
          <h2 className="tpl-display mt-3 text-4xl font-bold">{v(data, "officeTitle")}</h2>
          <p className="mt-4 text-lg leading-8" style={{ color: "{muted}" }}>{v(data, "officeText")}</p>
          <div className="mt-8 space-y-3 text-sm font-semibold">
            <p>{v(data, "address")}</p>
            <p>{v(data, "phone")}</p>
            <p>{v(data, "email")}</p>
          </div>
        </div>
        <div className="tpl-parallax relative min-h-[320px] overflow-hidden border" style={{ borderColor: "{line}" }}>
          <img src={v(data, "aboutImage")} alt="" className="tpl-ken absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0" style={{ background: "{dark}66" }} />
          <div className="tpl-pin absolute left-1/2 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full border-4" style={{ borderColor: "{primary}", background: "{primary}" }} />
        </div>
      </div>
    </section>
  );
}

function ParallaxShowcase({ data }: { data: Record<string, any> }) {
  const items = [1, 2, 3, 4].map((i) => ({
    title: v(data, `item${i}Title`),
    meta: v(data, `item${i}Meta`),
    price: v(data, `item${i}Price`),
    img: v(data, `item${i}Image`),
  }));
  return (
    <section className="border-t px-5 py-16 lg:px-8 lg:py-20" style={{ borderColor: "{line}" }}>
      <div className="mx-auto max-w-7xl">
        <p className="tpl-rise text-xs font-semibold tracking-[0.28em]" style={{ color: "{primary}" }}>גלריה</p>
        <h2 className="tpl-display tpl-rise-2 mt-3 text-4xl font-bold md:text-5xl">נכסים במבט שני</h2>
        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {items.map((c, i) => (
            <article key={c.title} className="tpl-climb tpl-glass group relative overflow-hidden border" style={{ borderColor: "{line}", animationDelay: `${i * 0.1}s`, minHeight: i % 2 ? "280px" : "340px" }}>
              <img src={c.img} alt="" className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
              <div className="absolute inset-0" style={{ background: "linear-gradient(0deg, {dark}ee, transparent 60%)" }} />
              <div className="absolute bottom-0 p-6">
                <p className="text-xs font-bold" style={{ color: "{primary}" }}>{c.meta}</p>
                <h3 className="tpl-display mt-1 text-2xl font-bold text-white">{c.title}</h3>
                <p className="mt-2 text-lg font-bold" style={{ color: "{primary}" }}>{c.price}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function AwardsStrip({ data }: { data: Record<string, any> }) {
  const awards = [v(data, "award1"), v(data, "award2"), v(data, "award3"), v(data, "award4")];
  return (
    <section className="tpl-sweep overflow-hidden border-y py-5" style={{ borderColor: "{line}", background: "{bg}" }}>
      <div className="tpl-marquee-track gap-12 px-6 text-sm font-bold tracking-[0.22em]" style={{ color: "{primary}" }}>
        {awards.concat(awards).map((a, i) => <span key={`award-${i}`} className="whitespace-nowrap">{a} ·</span>)}
      </div>
    </section>
  );
}

function FeaturedListings({ data }: { data: Record<string, any> }) {
  const cards = [1,2,3,4].map((i) => ({
    title: v(data, `item${i}Title`), meta: v(data, `item${i}Meta`), text: v(data, `item${i}Text`),
    price: v(data, `item${i}Price`), img: v(data, `item${i}Image`),
  }));
  return (
    <section className="border-t px-5 py-16 lg:px-8 lg:py-20" style={{ borderColor: "{line}", background: "{surface}" }}>
      <div className="mx-auto max-w-7xl">
        <p className="tpl-rise text-xs font-semibold tracking-[0.28em]" style={{ color: "{primary}" }}>נכסים</p>
        <h2 className="tpl-display tpl-rise-2 mt-3 text-4xl font-bold md:text-5xl">נכסים נבחרים</h2>
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {cards.map((c, i) => (
            <article key={c.title} className="tpl-climb tpl-glass group overflow-hidden border" style={{ borderColor: "{line}", animationDelay: `${i * 0.08}s` }}>
              <div className="relative overflow-hidden">
                <img src={c.img} alt="" className="aspect-[4/3] w-full object-cover transition duration-700 group-hover:scale-110" />
                <div className="tpl-glow absolute inset-0 opacity-0 transition group-hover:opacity-100" />
              </div>
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

function StatsRow({ data }: { data: Record<string, any> }) {
  const stats = [["stat1Value","stat1Label"],["stat2Value","stat2Label"],["stat3Value","stat3Label"]];
  return (
    <section className="border-t px-5 py-14 lg:px-8" style={{ borderColor: "{line}" }}>
      <div className="mx-auto grid max-w-7xl grid-cols-3 gap-6 text-center">
        {stats.map(([vk, lk], i) => (
          <div key={lk} className="tpl-climb tpl-shimmer border p-6" style={{ borderColor: "{line}", animationDelay: `${i * 0.1}s` }}>
            <div className="tpl-display text-4xl font-bold md:text-5xl" style={{ color: "{primary}" }}>{v(data, vk)}</div>
            <p className="mt-2 text-sm font-semibold" style={{ color: "{muted}" }}>{v(data, lk)}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function ProcessTimeline({ data }: { data: Record<string, any> }) {
  const steps = [
    [v(data, "step1"), v(data, "step1Desc")],
    [v(data, "step2"), v(data, "step2Desc")],
    [v(data, "step3"), v(data, "step3Desc")],
    [v(data, "step4"), v(data, "step4Desc")],
  ];
  return (
    <section className="border-t px-5 py-16 lg:px-8 lg:py-20" style={{ borderColor: "{line}", background: "{surface}" }}>
      <div className="mx-auto max-w-7xl">
        <p className="tpl-rise text-xs font-semibold tracking-[0.28em]" style={{ color: "{primary}" }}>תהליך</p>
        <h2 className="tpl-display tpl-rise-2 mt-3 text-4xl font-bold">איך אנחנו עובדים</h2>
        <div className="tpl-line-draw mt-10 h-px w-full" style={{ background: "{primary}" }} />
        <div className="mt-10 grid gap-6 md:grid-cols-4">
          {steps.map(([title, desc], i) => (
            <div key={title} className="tpl-climb border-t pt-5" style={{ borderColor: "{primary}", animationDelay: `${i * 0.1}s` }}>
              <span className="tpl-display text-3xl font-bold" style={{ color: "{primary}" }}>{String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-3 text-lg font-bold">{title}</h3>
              <p className="mt-2 text-sm leading-7" style={{ color: "{muted}" }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
'''

SHARED_EXTRA_CSS = '''
@keyframes {tid}-glow {{ 0%,100% {{ opacity: 0; }} 50% {{ opacity: 1; }} }}
@keyframes {tid}-shimmer {{ 0% {{ background-position: -200% 0; }} 100% {{ background-position: 200% 0; }} }}
@keyframes {tid}-parallax {{ 0%,100% {{ transform: translateY(0); }} 50% {{ transform: translateY(-12px); }} }}

[data-template-id="{tid}"] .tpl-glass, [data-template-id="{tid}-preview"] .tpl-glass {{
  backdrop-filter: blur(12px);
  background: rgba(255,255,255,0.04);
}}
[data-template-id="{tid}"] .tpl-glow, [data-template-id="{tid}-preview"] .tpl-glow {{
  background: radial-gradient(circle, {primary}44, transparent 70%);
  animation: {tid}-glow 3s ease-in-out infinite;
}}
[data-template-id="{tid}"] .tpl-shimmer, [data-template-id="{tid}-preview"] .tpl-shimmer {{
  background: linear-gradient(110deg, transparent 30%, {primary}18 50%, transparent 70%);
  background-size: 200% 100%;
  animation: {tid}-shimmer 4s linear infinite;
}}
[data-template-id="{tid}"] .tpl-parallax, [data-template-id="{tid}-preview"] .tpl-parallax {{
  animation: {tid}-parallax 8s ease-in-out infinite;
}}
[data-template-id="{tid}"] .tpl-magnetic, [data-template-id="{tid}-preview"] .tpl-magnetic {{
  transition: transform 0.25s cubic-bezier(.22,1,.36,1);
}}
[data-template-id="{tid}"] .tpl-magnetic:hover, [data-template-id="{tid}-preview"] .tpl-magnetic:hover {{
  transform: scale(1.04);
}}
[data-template-id="{tid}"] details[open] summary, [data-template-id="{tid}-preview"] details[open] summary {{
  color: {primary};
}}
@keyframes {tid}-testi {{ to {{ transform:translateX(-50%); }} }}
@keyframes {tid}-draw {{ from {{ transform:scaleX(0); }} to {{ transform:scaleX(1); }} }}
[data-template-id="{tid}"] .tpl-testi-track, [data-template-id="{tid}-preview"] .tpl-testi-track {{
  display:flex;width:max-content;animation:{tid}-testi 28s linear infinite;
}}
[data-template-id="{tid}"] .tpl-line-draw, [data-template-id="{tid}-preview"] .tpl-line-draw {{
  transform-origin:right;animation:{tid}-draw 1.2s both;
}}
'''

CTA_SECTIONS = frozenset({
    "CtaBand", "BoldContactBand", "AngledContactPanel", "NewsletterBand",
})
