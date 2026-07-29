#!/usr/bin/env python3
"""Generate scripts/_food_batch2_sections.py with unique LAYOUT_SECTIONS for 13 layouts."""
from __future__ import annotations

from pathlib import Path
from textwrap import dedent

OUT = Path("scripts/_food_batch2_sections.py")

# Each layout: (prefix, featured_jsx_body_fn_key, css_hooks used in classNames)
# We'll build full function strings per layout with unique structures.


def fn(name: str, props: str, body: str) -> str:
    return f"\nfunction {name}({props}) {{\n{body}\n}}\n"


DATA = "{ data }: { data: Record<string, any> }"
DATA_GOTO = "{ data, goTo }: { data: Record<string, any>; goTo: (id: string) => void }"
DATA_CTA = "{ data, onCta }: { data: Record<string, any>; onCta: () => void }"


def items3():
    return "  const cards = [1, 2, 3].map((i) => ({ title: v(data, `item${i}Title`), meta: v(data, `item${i}Meta`), text: v(data, `item${i}Text`), img: v(data, `item${i}Image`) }));\n"


def items6():
    return "  const items = [1, 2, 3, 4, 5, 6].map((i) => [v(data, `item${i}Title`), v(data, `item${i}Meta`), v(data, `item${i}Text`), v(data, `item${i}Image`)]);\n"


def steps3(key="process"):
    return f"  const steps = [[v(data, \"{key}1Title\"), v(data, \"{key}1Text\")], [v(data, \"{key}2Title\"), v(data, \"{key}2Text\")], [v(data, \"{key}3Title\"), v(data, \"{key}3Text\")]];\n"


def revs():
    return "  const revs = [1, 2, 3].map((i) => [v(data, `review${i}Text`), v(data, `review${i}Name`), v(data, `review${i}Role`)]);\n"


def stats():
    return "  const stats = [[v(data, \"stat1\"), v(data, \"stat1Label\")], [v(data, \"stat2\"), v(data, \"stat2Label\")], [v(data, \"stat3\"), v(data, \"stat3Label\")]];\n"


def gallery():
    return "  const imgs = [v(data, \"galleryImage1\"), v(data, \"galleryImage2\"), v(data, \"galleryImage3\"), v(data, \"galleryImage4\")];\n"


# ---- Unique featured sections (home) ----

FEATURED = {
"laminateLayers": '''  const cards = [1, 2, 3].map((i) => ({ title: v(data, `item${i}Title`), meta: v(data, `item${i}Meta`), text: v(data, `item${i}Text`), img: v(data, `item${i}Image`) }));
  return (
    <section className="border-t px-5 py-16 lg:px-8 lg:py-20" style={{ borderColor: "@line", background: "@surface" }}>
      <div className="mx-auto max-w-5xl">
        <Reveal><h2 className="tpl-display text-4xl font-bold md:text-5xl">{v(data, "featuredTitle")}</h2></Reveal>
        <div className="mt-10 space-y-3">
          {cards.map((c, i) => (
            <Reveal key={c.title} delayMs={i * 90} variant="up">
              <article className="tpl-lam-layer grid gap-4 border p-3 md:grid-cols-[160px_1fr] md:items-center" style={{ borderColor: "@line", background: "@bg", transform: `translateX(${(i - 1) * 12}px)` }}>
                <img src={c.img} alt="" className="aspect-[5/4] w-full object-cover" />
                <div className="pr-2">
                  <p className="text-xs font-semibold tracking-[0.2em]" style={{ color: "@primary" }}>{c.meta}</p>
                  <h3 className="tpl-display mt-1 text-2xl font-bold">{c.title}</h3>
                  <p className="mt-2 text-sm leading-7" style={{ color: "@muted" }}>{c.text}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );''',
"papelFlutter": '''  const cards = [1, 2, 3].map((i) => ({ title: v(data, `item${i}Title`), meta: v(data, `item${i}Meta`), text: v(data, `item${i}Text`), img: v(data, `item${i}Image`) }));
  return (
    <section className="border-t px-5 py-16 lg:px-8 lg:py-20" style={{ borderColor: "@line" }}>
      <div className="mx-auto max-w-7xl">
        <Reveal><h2 className="tpl-display text-4xl font-bold md:text-5xl">{v(data, "featuredTitle")}</h2></Reveal>
        <div className="mt-12 flex flex-wrap justify-center gap-6">
          {cards.map((c, i) => (
            <Reveal key={c.title} delayMs={i * 100} variant="scale">
              <article className={"tpl-papel w-64 border-2 p-3 " + (i === 1 ? "rotate-2" : i === 0 ? "-rotate-3" : "rotate-1")} style={{ borderColor: "@primary", background: "@surface", animationDelay: `${i * 0.2}s` }}>
                <img src={c.img} alt="" className="aspect-square w-full object-cover" />
                <p className="mt-3 text-xs font-bold" style={{ color: "@primary" }}>{c.meta}</p>
                <h3 className="tpl-display mt-1 text-xl font-bold">{c.title}</h3>
                <p className="mt-2 text-sm" style={{ color: "@muted" }}>{c.text}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );''',
"meltDrip": '''  const cards = [1, 2, 3].map((i) => ({ title: v(data, `item${i}Title`), meta: v(data, `item${i}Meta`), text: v(data, `item${i}Text`), img: v(data, `item${i}Image`) }));
  return (
    <section className="relative border-t px-5 py-16 lg:px-8 lg:py-20 overflow-hidden" style={{ borderColor: "@line", background: "@surface" }}>
      <div className="tpl-drip pointer-events-none absolute left-1/4 top-0 h-24 w-8 rounded-b-full opacity-40" style={{ background: "@primary" }} />
      <div className="tpl-drip pointer-events-none absolute right-1/3 top-0 h-16 w-6 rounded-b-full opacity-30" style={{ background: "@primary", animationDelay: ".8s" }} />
      <div className="relative mx-auto max-w-7xl text-center">
        <Reveal><h2 className="tpl-display text-4xl font-bold md:text-5xl">{v(data, "featuredTitle")}</h2></Reveal>
        <div className="mt-14 flex flex-wrap items-end justify-center gap-8">
          {cards.map((c, i) => (
            <Reveal key={c.title} delayMs={i * 100} variant="up">
              <article className="w-40 md:w-48">
                <div className="tpl-scoop mx-auto aspect-square overflow-hidden rounded-full border-4" style={{ borderColor: "@primary" }}>
                  <img src={c.img} alt="" className="h-full w-full object-cover" />
                </div>
                <p className="mt-4 text-xs" style={{ color: "@primary" }}>{c.meta}</p>
                <h3 className="tpl-display mt-1 text-xl font-bold">{c.title}</h3>
                <p className="mt-2 text-sm" style={{ color: "@muted" }}>{c.text}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );''',
"spitRotate": '''  const cards = [1, 2, 3].map((i) => ({ title: v(data, `item${i}Title`), meta: v(data, `item${i}Meta`), text: v(data, `item${i}Text`), img: v(data, `item${i}Image`) }));
  return (
    <section className="border-t px-5 py-16 lg:px-8 lg:py-20" style={{ borderColor: "@line", background: "@surface" }}>
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[200px_1fr] lg:items-center">
        <div className="relative mx-auto h-72 w-24">
          <div className="absolute inset-x-1/2 top-0 bottom-0 w-1 -translate-x-1/2" style={{ background: "@line" }} />
          <div className="tpl-spit absolute inset-x-0 top-8 space-y-3">
            {cards.map((c, i) => (
              <img key={c.title} src={c.img} alt="" className="mx-auto h-16 w-16 rounded-full object-cover border-2" style={{ borderColor: "@primary", animationDelay: `${i * 0.3}s` }} />
            ))}
          </div>
        </div>
        <div>
          <Reveal><h2 className="tpl-display text-4xl font-bold md:text-5xl">{v(data, "featuredTitle")}</h2></Reveal>
          <div className="mt-8 grid gap-5">
            {cards.map((c, i) => (
              <Reveal key={c.title} delayMs={i * 80} variant="right">
                <article className="flex gap-4 border-b pb-4" style={{ borderColor: "@line" }}>
                  <div>
                    <p className="text-xs font-bold" style={{ color: "@primary" }}>{c.meta}</p>
                    <h3 className="tpl-display text-2xl font-bold">{c.title}</h3>
                    <p className="mt-1 text-sm" style={{ color: "@muted" }}>{c.text}</p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );''',
"bowlOrbit": '''  const cards = [1, 2, 3].map((i) => ({ title: v(data, `item${i}Title`), meta: v(data, `item${i}Meta`), text: v(data, `item${i}Text`), img: v(data, `item${i}Image`) }));
  return (
    <section className="border-t px-5 py-16 lg:px-8 lg:py-20" style={{ borderColor: "@line" }}>
      <div className="mx-auto max-w-7xl text-center">
        <Reveal><h2 className="tpl-display text-4xl font-bold md:text-5xl">{v(data, "featuredTitle")}</h2></Reveal>
        <div className="relative mx-auto mt-16 flex h-[340px] max-w-xl items-center justify-center">
          <div className="tpl-orbit absolute inset-8 rounded-full border border-dashed opacity-40" style={{ borderColor: "@primary" }} />
          <div className="relative z-10 h-36 w-36 overflow-hidden rounded-full border-4" style={{ borderColor: "@primary" }}>
            <img src={v(data, "item1Image")} alt="" className="h-full w-full object-cover" />
          </div>
          {cards.map((c, i) => (
            <article key={c.title} className="absolute w-28 text-center" style={{ top: `${20 + i * 28}%`, right: i === 1 ? "0%" : "8%", left: i === 0 ? "0%" : "auto" }}>
              <img src={c.img} alt="" className="mx-auto h-14 w-14 rounded-full object-cover" />
              <h3 className="tpl-display mt-2 text-sm font-bold">{c.title}</h3>
            </article>
          ))}
        </div>
      </div>
    </section>
  );''',
"basketSteam": '''  const cards = [1, 2, 3].map((i) => ({ title: v(data, `item${i}Title`), meta: v(data, `item${i}Meta`), text: v(data, `item${i}Text`), img: v(data, `item${i}Image`) }));
  return (
    <section className="relative border-t px-5 py-16 lg:px-8 lg:py-20 overflow-hidden" style={{ borderColor: "@line", background: "@surface" }}>
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="tpl-steam pointer-events-none absolute bottom-10 rounded-full bg-white/20" style={{ left: `${10 + i * 10}%`, width: `${8 + (i % 3) * 4}px`, height: `${20 + (i % 4) * 8}px`, animationDelay: `${i * 0.4}s`, ["--steam-dur" as string]: `${5 + (i % 3)}s` }} />
      ))}
      <div className="relative mx-auto max-w-4xl">
        <Reveal><h2 className="tpl-display text-center text-4xl font-bold md:text-5xl">{v(data, "featuredTitle")}</h2></Reveal>
        <div className="mt-12 mx-auto max-w-md space-y-3">
          {cards.map((c, i) => (
            <Reveal key={c.title} delayMs={i * 100} variant="up">
              <article className="tpl-basket flex items-center gap-4 border-2 px-4 py-3" style={{ borderColor: "@primary", background: "@bg", borderRadius: "999px 999px 40% 40%" }}>
                <img src={c.img} alt="" className="h-16 w-16 rounded-full object-cover" />
                <div>
                  <p className="text-xs" style={{ color: "@primary" }}>{c.meta}</p>
                  <h3 className="tpl-display text-lg font-bold">{c.title}</h3>
                  <p className="text-sm" style={{ color: "@muted" }}>{c.text}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );''',
"smashStack": '''  const cards = [1, 2, 3].map((i) => ({ title: v(data, `item${i}Title`), meta: v(data, `item${i}Meta`), text: v(data, `item${i}Text`), img: v(data, `item${i}Image`) }));
  return (
    <section className="border-t px-5 py-16 lg:px-8 lg:py-20" style={{ borderColor: "@line" }}>
      <div className="mx-auto max-w-lg">
        <Reveal><h2 className="tpl-display text-center text-4xl font-black md:text-5xl">{v(data, "featuredTitle")}</h2></Reveal>
        <div className="relative mt-12 space-y-[-12px]">
          {cards.map((c, i) => (
            <Reveal key={c.title} delayMs={i * 110} variant="up">
              <article className="tpl-smash relative z-[3] flex gap-4 border-4 p-4" style={{ borderColor: "@primary", background: "@surface", transform: `rotate(${(i - 1) * 2}deg)`, zIndex: 3 - i }}>
                <img src={c.img} alt="" className="h-20 w-20 object-cover" />
                <div>
                  <p className="text-xs font-black uppercase" style={{ color: "@primary" }}>{c.meta}</p>
                  <h3 className="tpl-display text-2xl font-black">{c.title}</h3>
                  <p className="mt-1 text-sm" style={{ color: "@muted" }}>{c.text}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );''',
"foamWave": '''  const cards = [1, 2, 3].map((i) => ({ title: v(data, `item${i}Title`), meta: v(data, `item${i}Meta`), text: v(data, `item${i}Text`), img: v(data, `item${i}Image`) }));
  return (
    <section className="relative border-t px-5 py-16 lg:px-8 lg:py-20 overflow-hidden" style={{ borderColor: "@line", background: "@surface" }}>
      <svg className="tpl-wave pointer-events-none absolute bottom-0 left-0 w-[200%] text-[@primary] opacity-20" viewBox="0 0 1200 120" preserveAspectRatio="none"><path fill="currentColor" d="M0,60 C150,120 350,0 600,60 C850,120 1050,0 1200,60 L1200,120 L0,120 Z" /></svg>
      <div className="relative mx-auto max-w-7xl">
        <Reveal><h2 className="tpl-display text-4xl font-bold md:text-5xl">{v(data, "featuredTitle")}</h2></Reveal>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {cards.map((c, i) => (
            <Reveal key={c.title} delayMs={i * 90} variant="up">
              <article className="overflow-hidden border" style={{ borderColor: "@line", background: "@bg", borderRadius: "40% 40% 8px 8px" }}>
                <img src={c.img} alt="" className="aspect-[4/3] w-full object-cover" />
                <div className="p-4">
                  <p className="text-xs tracking-wider" style={{ color: "@primary" }}>{c.meta}</p>
                  <h3 className="tpl-display mt-1 text-xl font-bold">{c.title}</h3>
                  <p className="mt-2 text-sm" style={{ color: "@muted" }}>{c.text}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );''',
"rootGrow": '''  const cards = [1, 2, 3].map((i) => ({ title: v(data, `item${i}Title`), meta: v(data, `item${i}Meta`), text: v(data, `item${i}Text`), img: v(data, `item${i}Image`) }));
  return (
    <section className="border-t px-5 py-16 lg:px-8 lg:py-20" style={{ borderColor: "@line" }}>
      <div className="mx-auto max-w-3xl">
        <Reveal><h2 className="tpl-display text-4xl font-bold md:text-5xl">{v(data, "featuredTitle")}</h2></Reveal>
        <div className="relative mt-12 pr-10">
          <div className="tpl-root absolute right-3 top-0 bottom-0 w-0.5" style={{ background: "linear-gradient(180deg, @primary, transparent)" }} />
          {cards.map((c, i) => (
            <Reveal key={c.title} delayMs={i * 100} variant="right">
              <article className="relative mb-10 grid gap-4 md:grid-cols-[1fr_120px] md:items-center">
                <div className="absolute right-1.5 top-2 h-3 w-3 rounded-full" style={{ background: "@primary" }} />
                <div className="pr-8">
                  <p className="text-xs" style={{ color: "@primary" }}>{c.meta}</p>
                  <h3 className="tpl-display text-2xl font-bold">{c.title}</h3>
                  <p className="mt-2 text-sm leading-7" style={{ color: "@muted" }}>{c.text}</p>
                </div>
                <img src={c.img} alt="" className="aspect-square w-full object-cover" style={{ borderRadius: "50% 50% 40% 60%" }} />
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );''',
"smokePlume": '''  const cards = [1, 2, 3].map((i) => ({ title: v(data, `item${i}Title`), meta: v(data, `item${i}Meta`), text: v(data, `item${i}Text`), img: v(data, `item${i}Image`) }));
  return (
    <section className="relative border-t px-5 py-16 lg:px-8 lg:py-20 overflow-hidden" style={{ borderColor: "@line", background: "@surface" }}>
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} className="tpl-smoke pointer-events-none absolute bottom-0 rounded-full bg-white/10 blur-md" style={{ left: `${5 + i * 9}%`, width: `${30 + (i % 4) * 10}px`, height: `${40 + (i % 3) * 20}px`, animationDelay: `${i * 0.5}s` }} />
      ))}
      <div className="relative mx-auto max-w-7xl">
        <Reveal><h2 className="tpl-display text-4xl font-bold md:text-5xl">{v(data, "featuredTitle")}</h2></Reveal>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {cards.map((c, i) => (
            <Reveal key={c.title} delayMs={i * 90} variant="up">
              <article className="border p-2" style={{ borderColor: "@line", background: "@bg" }}>
                <img src={c.img} alt="" className="aspect-[4/3] w-full object-cover" />
                <div className="p-3">
                  <p className="text-xs tracking-[0.2em]" style={{ color: "@primary" }}>{c.meta}</p>
                  <h3 className="tpl-display mt-1 text-2xl font-bold">{c.title}</h3>
                  <p className="mt-2 text-sm" style={{ color: "@muted" }}>{c.text}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );''',
"noodleSwirl": '''  const cards = [1, 2, 3].map((i) => ({ title: v(data, `item${i}Title`), meta: v(data, `item${i}Meta`), text: v(data, `item${i}Text`), img: v(data, `item${i}Image`) }));
  return (
    <section className="border-t px-5 py-16 lg:px-8 lg:py-20" style={{ borderColor: "@line", background: "@surface" }}>
      <div className="mx-auto max-w-7xl">
        <Reveal><h2 className="tpl-display text-4xl font-bold md:text-5xl">{v(data, "featuredTitle")}</h2></Reveal>
        <div className="mt-12 grid items-center gap-10 lg:grid-cols-[240px_1fr]">
          <div className="tpl-swirl relative mx-auto h-52 w-52 rounded-full border-4" style={{ borderColor: "@primary", background: "conic-gradient(from 0deg, @primary33, transparent, @primary66, transparent)" }}>
            <div className="absolute inset-8 overflow-hidden rounded-full">
              <img src={v(data, "item2Image")} alt="" className="h-full w-full object-cover" />
            </div>
          </div>
          <div className="grid gap-4">
            {cards.map((c, i) => (
              <Reveal key={c.title} delayMs={i * 80} variant="left">
                <article className="grid gap-3 border-b pb-4 md:grid-cols-[80px_1fr]" style={{ borderColor: "@line" }}>
                  <img src={c.img} alt="" className="aspect-square w-full object-cover" style={{ borderRadius: "30%" }} />
                  <div>
                    <p className="text-xs" style={{ color: "@primary" }}>{c.meta}</p>
                    <h3 className="tpl-display text-xl font-bold">{c.title}</h3>
                    <p className="mt-1 text-sm" style={{ color: "@muted" }}>{c.text}</p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );''',
"sugarCrystal": '''  const cards = [1, 2, 3].map((i) => ({ title: v(data, `item${i}Title`), meta: v(data, `item${i}Meta`), text: v(data, `item${i}Text`), img: v(data, `item${i}Image`) }));
  return (
    <section className="border-t px-5 py-16 lg:px-8 lg:py-20" style={{ borderColor: "@line" }}>
      <div className="mx-auto max-w-7xl">
        <Reveal><h2 className="tpl-display text-4xl font-bold md:text-5xl">{v(data, "featuredTitle")}</h2></Reveal>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {cards.map((c, i) => (
            <Reveal key={c.title} delayMs={i * 100} variant="scale">
              <article className="tpl-crystal overflow-hidden border p-3" style={{ borderColor: "@primary", background: "@surface", clipPath: i === 1 ? "polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)" : "polygon(10% 0%, 100% 0%, 90% 100%, 0% 100%)" }}>
                <img src={c.img} alt="" className="aspect-square w-full object-cover" />
                <div className="p-3 text-center">
                  <p className="text-xs tracking-[0.24em]" style={{ color: "@primary" }}>{c.meta}</p>
                  <h3 className="tpl-display mt-2 text-2xl font-bold">{c.title}</h3>
                  <p className="mt-2 text-sm" style={{ color: "@muted" }}>{c.text}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );''',
"citrusBurst": '''  const cards = [1, 2, 3].map((i) => ({ title: v(data, `item${i}Title`), meta: v(data, `item${i}Meta`), text: v(data, `item${i}Text`), img: v(data, `item${i}Image`) }));
  return (
    <section className="relative border-t px-5 py-16 lg:px-8 lg:py-20 overflow-hidden" style={{ borderColor: "@line", background: "@surface" }}>
      <div className="tpl-burst pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full opacity-30" style={{ background: `conic-gradient(from 0deg, @primary, transparent, @primary)` }} />
      <div className="relative mx-auto max-w-7xl">
        <Reveal><h2 className="tpl-display text-4xl font-bold md:text-5xl">{v(data, "featuredTitle")}</h2></Reveal>
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {cards.map((c, i) => (
            <Reveal key={c.title} delayMs={i * 80} variant="up">
              <article className="text-center">
                <div className="mx-auto aspect-square max-w-[180px] overflow-hidden rounded-full border-4" style={{ borderColor: "@primary" }}>
                  <img src={c.img} alt="" className="h-full w-full object-cover" />
                </div>
                <p className="mt-4 text-xs font-bold uppercase tracking-wider" style={{ color: "@primary" }}>{c.meta}</p>
                <h3 className="tpl-display mt-1 text-xl font-bold">{c.title}</h3>
                <p className="mt-2 text-sm" style={{ color: "@muted" }}>{c.text}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );''',
}


def process_section(prefix: str, variant: int) -> str:
    layouts = [
        # 0 numbered top border
        f'''  const steps = [[v(data, "process1Title"), v(data, "process1Text")], [v(data, "process2Title"), v(data, "process2Text")], [v(data, "process3Title"), v(data, "process3Text")]];
  return (
    <section className="border-t px-5 py-14 lg:px-8" style={{{{ borderColor: "@line" }}}}>
      <div className="mx-auto max-w-7xl">
        <Reveal><h2 className="tpl-display text-center text-3xl font-bold md:text-4xl">{{v(data, "processTitle")}}</h2></Reveal>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {{steps.map(([t, x], i) => (
            <Reveal key={{t}} delayMs={{i * 90}} variant="up">
              <div className="border-t-2 pt-4" style={{{{ borderColor: "@primary" }}}}>
                <div className="text-xs font-bold tracking-[0.2em]" style={{{{ color: "@primary" }}}}>0{{i + 1}}</div>
                <h3 className="tpl-display mt-2 text-xl font-bold">{{t}}</h3>
                <p className="mt-2 text-sm leading-7" style={{{{ color: "@muted" }}}}>{{x}}</p>
              </div>
            </Reveal>
          ))}}
        </div>
      </div>
    </section>
  );''',
        # 1 horizontal timeline circles
        f'''  const steps = [[v(data, "process1Title"), v(data, "process1Text")], [v(data, "process2Title"), v(data, "process2Text")], [v(data, "process3Title"), v(data, "process3Text")]];
  return (
    <section className="border-t px-5 py-14 lg:px-8" style={{{{ borderColor: "@line", background: "@surface" }}}}>
      <div className="mx-auto max-w-5xl">
        <Reveal><h2 className="tpl-display text-3xl font-bold md:text-4xl">{{v(data, "processTitle")}}</h2></Reveal>
        <div className="mt-10 flex flex-col gap-6 md:flex-row md:items-stretch">
          {{steps.map(([t, x], i) => (
            <Reveal key={{t}} delayMs={{i * 80}} variant="left" className="flex-1">
              <div className="flex h-full flex-col items-start gap-3 border p-5" style={{{{ borderColor: "@line", background: "@bg" }}}}>
                <span className="grid h-10 w-10 place-items-center rounded-full text-sm font-bold" style={{{{ background: "@primary", color: "@primaryText" }}}}>{{i + 1}}</span>
                <h3 className="tpl-display text-xl font-bold">{{t}}</h3>
                <p className="text-sm leading-7" style={{{{ color: "@muted" }}}}>{{x}}</p>
              </div>
            </Reveal>
          ))}}
        </div>
      </div>
    </section>
  );''',
        # 2 vertical ladder
        f'''  const steps = [[v(data, "process1Title"), v(data, "process1Text")], [v(data, "process2Title"), v(data, "process2Text")], [v(data, "process3Title"), v(data, "process3Text")]];
  return (
    <section className="border-t px-5 py-14 lg:px-8" style={{{{ borderColor: "@line" }}}}>
      <div className="mx-auto max-w-2xl">
        <Reveal><h2 className="tpl-display text-3xl font-bold">{{v(data, "processTitle")}}</h2></Reveal>
        <ol className="mt-10 space-y-0">
          {{steps.map(([t, x], i) => (
            <Reveal key={{t}} delayMs={{i * 70}} variant="right">
              <li className="grid grid-cols-[48px_1fr] gap-4 border-r-2 pr-4 pb-8" style={{{{ borderColor: i < 2 ? "@primary" : "transparent" }}}}>
                <span className="tpl-display text-3xl font-bold" style={{{{ color: "@primary" }}}}>{{i + 1}}</span>
                <div>
                  <h3 className="tpl-display text-xl font-bold">{{t}}</h3>
                  <p className="mt-2 text-sm leading-7" style={{{{ color: "@muted" }}}}>{{x}}</p>
                </div>
              </li>
            </Reveal>
          ))}}
        </ol>
      </div>
    </section>
  );''',
    ]
    return layouts[variant % 3]


def gallery_section(variant: int) -> str:
    layouts = [
        f'''  const imgs = [v(data, "galleryImage1"), v(data, "galleryImage2"), v(data, "galleryImage3"), v(data, "galleryImage4")];
  return (
    <section className="border-t px-5 py-16 lg:px-8 lg:py-20" style={{{{ borderColor: "@line", background: "@surface" }}}}>
      <div className="mx-auto max-w-7xl">
        <Reveal><h2 className="tpl-display text-4xl font-bold">{{v(data, "galleryTitle")}}</h2></Reveal>
        <div className="mt-10 grid grid-cols-2 gap-2 md:grid-cols-4">
          {{imgs.map((src, i) => (
            <Reveal key={{i}} delayMs={{i * 70}} variant="scale">
              <img src={{src}} alt="" className={{"w-full object-cover " + (i % 2 ? "aspect-[3/4]" : "aspect-square")}} />
            </Reveal>
          ))}}
        </div>
      </div>
    </section>
  );''',
        f'''  const imgs = [v(data, "galleryImage1"), v(data, "galleryImage2"), v(data, "galleryImage3"), v(data, "galleryImage4")];
  return (
    <section className="border-t px-5 py-16 lg:px-8" style={{{{ borderColor: "@line" }}}}>
      <div className="mx-auto max-w-7xl">
        <Reveal><h2 className="tpl-display text-4xl font-bold">{{v(data, "galleryTitle")}}</h2></Reveal>
        <div className="mt-10 flex gap-3 overflow-x-auto pb-2">
          {{imgs.map((src, i) => (
            <Reveal key={{i}} delayMs={{i * 60}} variant="left">
              <img src={{src}} alt="" className="h-48 w-64 flex-shrink-0 object-cover md:h-56 md:w-72" />
            </Reveal>
          ))}}
        </div>
      </div>
    </section>
  );''',
        f'''  const imgs = [v(data, "galleryImage1"), v(data, "galleryImage2"), v(data, "galleryImage3"), v(data, "galleryImage4")];
  return (
    <section className="border-t px-5 py-16 lg:px-8" style={{{{ borderColor: "@line", background: "@surface" }}}}>
      <div className="mx-auto max-w-5xl">
        <Reveal><h2 className="tpl-display text-center text-4xl font-bold">{{v(data, "galleryTitle")}}</h2></Reveal>
        <div className="mt-10 grid grid-cols-2 gap-3">
          {{imgs.map((src, i) => (
            <Reveal key={{i}} delayMs={{i * 70}} variant="up">
              <img src={{src}} alt="" className="aspect-[4/3] w-full object-cover" style={{{{ borderRadius: i % 2 ? "2rem 0.5rem" : "0.5rem 2rem" }}}} />
            </Reveal>
          ))}}
        </div>
      </div>
    </section>
  );''',
    ]
    return layouts[variant % 3]


def reviews_section(variant: int) -> str:
    layouts = [
        f'''  const revs = [1, 2, 3].map((i) => [v(data, `review${{i}}Text`), v(data, `review${{i}}Name`), v(data, `review${{i}}Role`)]);
  return (
    <section className="border-t px-5 py-16 lg:px-8" style={{{{ borderColor: "@line" }}}}>
      <div className="mx-auto max-w-7xl">
        <Reveal><h2 className="tpl-display text-4xl font-bold">{{v(data, "reviewsTitle")}}</h2></Reveal>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {{revs.map(([text, name, role], i) => (
            <Reveal key={{name}} delayMs={{i * 80}} variant="up">
              <blockquote className="border p-5" style={{{{ borderColor: "@line", background: "@surface" }}}}>
                <p className="text-sm leading-7" style={{{{ color: "@muted" }}}}>״{{text}}״</p>
                <footer className="mt-4 text-sm font-bold">{{name}} <span className="font-normal" style={{{{ color: "@muted" }}}}>· {{role}}</span></footer>
              </blockquote>
            </Reveal>
          ))}}
        </div>
      </div>
    </section>
  );''',
        f'''  const revs = [1, 2, 3].map((i) => [v(data, `review${{i}}Text`), v(data, `review${{i}}Name`), v(data, `review${{i}}Role`)]);
  return (
    <section className="border-t px-5 py-16 lg:px-8" style={{{{ borderColor: "@line", background: "@surface" }}}}>
      <div className="mx-auto max-w-3xl">
        <Reveal><h2 className="tpl-display text-4xl font-bold">{{v(data, "reviewsTitle")}}</h2></Reveal>
        <div className="mt-10 space-y-6">
          {{revs.map(([text, name, role], i) => (
            <Reveal key={{name}} delayMs={{i * 70}} variant="right">
              <blockquote className="border-r-4 pr-5" style={{{{ borderColor: "@primary" }}}}>
                <p className="text-lg leading-8">״{{text}}״</p>
                <footer className="mt-3 text-sm font-bold" style={{{{ color: "@muted" }}}}>{{name}} · {{role}}</footer>
              </blockquote>
            </Reveal>
          ))}}
        </div>
      </div>
    </section>
  );''',
        f'''  const revs = [1, 2, 3].map((i) => [v(data, `review${{i}}Text`), v(data, `review${{i}}Name`), v(data, `review${{i}}Role`)]);
  return (
    <section className="border-t px-5 py-16 lg:px-8" style={{{{ borderColor: "@line" }}}}>
      <div className="mx-auto max-w-7xl">
        <Reveal><h2 className="tpl-display text-center text-4xl font-bold">{{v(data, "reviewsTitle")}}</h2></Reveal>
        <div className="mt-10 flex gap-4 overflow-x-auto pb-2">
          {{revs.map(([text, name, role], i) => (
            <blockquote key={{name}} className="min-w-[260px] flex-shrink-0 border p-5" style={{{{ borderColor: "@primary", background: "@surface" }}}}>
              <p className="text-sm leading-7" style={{{{ color: "@muted" }}}}>״{{text}}״</p>
              <footer className="mt-4 text-sm font-bold">{{name}}</footer>
            </blockquote>
          ))}}
        </div>
      </div>
    </section>
  );''',
    ]
    return layouts[variant % 3]


def stats_section(variant: int) -> str:
    layouts = [
        f'''  const stats = [[v(data, "stat1"), v(data, "stat1Label")], [v(data, "stat2"), v(data, "stat2Label")], [v(data, "stat3"), v(data, "stat3Label")]];
  return (
    <section className="border-t px-5 py-12 lg:px-8" style={{{{ borderColor: "@line", background: "@surface" }}}}>
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 md:flex-row md:justify-between">
        <div className="grid grid-cols-3 gap-4 text-center">
          {{stats.map(([n, l], i) => (
            <Reveal key={{l}} delayMs={{i * 70}} variant="scale">
              <div className="border px-4 py-3" style={{{{ borderColor: "@primary" }}}}>
                <div className="tpl-display text-3xl font-bold" style={{{{ color: "@primary" }}}}>{{n}}</div>
                <p className="mt-1 text-xs" style={{{{ color: "@muted" }}}}>{{l}}</p>
              </div>
            </Reveal>
          ))}}
        </div>
        <p className="max-w-md text-center text-sm leading-7 md:text-right" style={{{{ color: "@muted" }}}}>{{v(data, "hours")}}</p>
      </div>
    </section>
  );''',
        f'''  const stats = [[v(data, "stat1"), v(data, "stat1Label")], [v(data, "stat2"), v(data, "stat2Label")], [v(data, "stat3"), v(data, "stat3Label")]];
  return (
    <section className="border-t px-5 py-14 lg:px-8" style={{{{ borderColor: "@line" }}}}>
      <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-4">
        {{stats.map(([n, l], i) => (
          <Reveal key={{l}} delayMs={{i * 70}} variant="up">
            <div className="text-center md:text-right">
              <div className="tpl-display text-5xl font-bold" style={{{{ color: "@primary" }}}}>{{n}}</div>
              <p className="mt-2 text-sm" style={{{{ color: "@muted" }}}}>{{l}}</p>
            </div>
          </Reveal>
        ))}}
        <div className="border p-4 md:col-span-1" style={{{{ borderColor: "@line", background: "@surface" }}}}>
          <p className="text-xs font-bold tracking-wider" style={{{{ color: "@primary" }}}}>{{v(data, "hoursTitle")}}</p>
          <p className="mt-2 text-sm leading-7" style={{{{ color: "@muted" }}}}>{{v(data, "hours")}}</p>
        </div>
      </div>
    </section>
  );''',
        f'''  const stats = [[v(data, "stat1"), v(data, "stat1Label")], [v(data, "stat2"), v(data, "stat2Label")], [v(data, "stat3"), v(data, "stat3Label")]];
  return (
    <section className="border-t px-5 py-12 lg:px-8" style={{{{ borderColor: "@line", background: "@dark", color: "@text" }}}}>
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-8">
        {{stats.map(([n, l], i) => (
          <Reveal key={{l}} delayMs={{i * 60}} variant="scale">
            <div className="text-center">
              <div className="tpl-display text-4xl font-bold" style={{{{ color: "@primary" }}}}>{{n}}</div>
              <p className="mt-1 text-xs tracking-wider" style={{{{ color: "@muted" }}}}>{{l}}</p>
            </div>
          </Reveal>
        ))}}
        <p className="w-full text-center text-sm" style={{{{ color: "@muted" }}}}>{{v(data, "hours")}}</p>
      </div>
    </section>
  );''',
    ]
    return layouts[variant % 3]


def cta_section() -> str:
    return '''  return (
    <section className="border-t px-5 py-16 lg:px-8" style={{ borderColor: "@line" }}>
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 border p-8 md:flex-row md:items-center" style={{ borderColor: "@primary", background: "@surface" }}>
        <div>
          <h2 className="tpl-display text-3xl font-bold md:text-4xl">{v(data, "ctaBandTitle")}</h2>
          <p className="mt-3 max-w-xl text-sm leading-7" style={{ color: "@muted" }}>{v(data, "ctaBandText")}</p>
        </div>
        <button type="button" onClick={() => goTo("contact")} className="px-7 py-3.5 text-sm font-bold" style={{ background: "@primary", color: "@primaryText" }}>{v(data, "heroPrimary")}</button>
      </div>
    </section>
  );'''


# Page1 / page2 / about / contact — unique-ish per layout via structural variants

def page1_defs(prefix: str, v: int) -> str:
    banners = [
        f'''function {prefix}SpecialtyBanner({{ data }}: {{ data: Record<string, any> }}) {{
  return (
    <section className="relative overflow-hidden border-b px-5 py-20 lg:px-8" style={{{{ borderColor: "@line" }}}}>
      <img src={{v(data, "item4Image")}} alt="" className="absolute inset-0 h-full w-full object-cover opacity-30" />
      <div className="absolute inset-0" style={{{{ background: "linear-gradient(90deg, @bg, transparent)" }}}} />
      <div className="relative z-10 mx-auto max-w-7xl">
        <p className="text-xs font-semibold tracking-[0.28em]" style={{{{ color: "@primary" }}}}>{{v(data, "brandName")}}</p>
        <h1 className="tpl-display mt-4 text-5xl font-bold md:text-7xl">{{v(data, "page1Title")}}</h1>
        <p className="mt-4 max-w-xl text-lg" style={{{{ color: "@muted" }}}}>{{v(data, "page1Subtitle")}}</p>
      </div>
    </section>
  );
}}''',
        f'''function {prefix}SpecialtyBanner({{ data }}: {{ data: Record<string, any> }}) {{
  return (
    <section className="border-b px-5 py-16 lg:px-8" style={{{{ borderColor: "@line", background: "@surface" }}}}>
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-2 lg:items-end">
        <div>
          <p className="text-xs tracking-[0.28em]" style={{{{ color: "@primary" }}}}>{{v(data, "brandName")}}</p>
          <h1 className="tpl-display mt-4 text-5xl font-bold md:text-6xl">{{v(data, "page1Title")}}</h1>
          <p className="mt-4 text-lg" style={{{{ color: "@muted" }}}}>{{v(data, "page1Subtitle")}}</p>
        </div>
        <img src={{v(data, "item4Image")}} alt="" className="aspect-[16/10] w-full object-cover" />
      </div>
    </section>
  );
}}''',
        f'''function {prefix}SpecialtyBanner({{ data }}: {{ data: Record<string, any> }}) {{
  return (
    <section className="px-5 py-20 text-center lg:px-8" style={{{{ background: "@dark", color: "@text" }}}}>
      <p className="text-xs tracking-[0.3em]" style={{{{ color: "@primary" }}}}>{{v(data, "brandName")}}</p>
      <h1 className="tpl-display mt-4 text-5xl font-bold md:text-7xl">{{v(data, "page1Title")}}</h1>
      <p className="mx-auto mt-4 max-w-xl text-lg" style={{{{ color: "@muted" }}}}>{{v(data, "page1Subtitle")}}</p>
    </section>
  );
}}''',
    ]
    menus = [
        f'''function {prefix}FullMenuBoard({{ data }}: {{ data: Record<string, any> }}) {{
  const items = [1, 2, 3, 4, 5, 6].map((i) => [v(data, `item${{i}}Title`), v(data, `item${{i}}Meta`), v(data, `item${{i}}Text`), v(data, `item${{i}}Image`)]);
  return (
    <section className="border-t px-5 py-16 lg:px-8" style={{{{ borderColor: "@line", background: "@surface" }}}}>
      <div className="mx-auto max-w-4xl space-y-6">
        <Reveal><h2 className="tpl-display text-3xl font-bold">{{v(data, "menuListTitle")}}</h2></Reveal>
        {{items.map(([title, meta, text, img], i) => (
          <Reveal key={{title}} delayMs={{i * 60}} variant="right">
            <article className="grid gap-4 border-b pb-6 md:grid-cols-[100px_1fr_auto]" style={{{{ borderColor: "@line" }}}}>
              <img src={{img}} alt="" className="aspect-square w-full object-cover" />
              <div>
                <h3 className="tpl-display text-2xl font-bold">{{title}}</h3>
                <p className="mt-1 text-sm leading-7" style={{{{ color: "@muted" }}}}>{{text}}</p>
              </div>
              <p className="text-sm font-bold" style={{{{ color: "@primary" }}}}>{{meta}}</p>
            </article>
          </Reveal>
        ))}}
      </div>
    </section>
  );
}}''',
        f'''function {prefix}FullMenuBoard({{ data }}: {{ data: Record<string, any> }}) {{
  const items = [1, 2, 3, 4, 5, 6].map((i) => [v(data, `item${{i}}Title`), v(data, `item${{i}}Meta`), v(data, `item${{i}}Text`), v(data, `item${{i}}Image`)]);
  return (
    <section className="border-t px-5 py-16 lg:px-8" style={{{{ borderColor: "@line" }}}}>
      <div className="mx-auto max-w-7xl">
        <Reveal><h2 className="tpl-display text-3xl font-bold">{{v(data, "menuListTitle")}}</h2></Reveal>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {{items.map(([title, meta, text, img], i) => (
            <Reveal key={{title}} delayMs={{i * 50}} variant="up">
              <article className="overflow-hidden border" style={{{{ borderColor: "@line", background: "@surface" }}}}>
                <img src={{img}} alt="" className="aspect-[5/4] w-full object-cover" />
                <div className="p-4">
                  <div className="flex items-baseline justify-between gap-2">
                    <h3 className="tpl-display text-xl font-bold">{{title}}</h3>
                    <span className="text-xs font-bold" style={{{{ color: "@primary" }}}}>{{meta}}</span>
                  </div>
                  <p className="mt-2 text-sm" style={{{{ color: "@muted" }}}}>{{text}}</p>
                </div>
              </article>
            </Reveal>
          ))}}
        </div>
      </div>
    </section>
  );
}}''',
        f'''function {prefix}FullMenuBoard({{ data }}: {{ data: Record<string, any> }}) {{
  const items = [1, 2, 3, 4, 5, 6].map((i) => [v(data, `item${{i}}Title`), v(data, `item${{i}}Meta`), v(data, `item${{i}}Text`), v(data, `item${{i}}Image`)]);
  return (
    <section className="border-t px-5 py-16 lg:px-8" style={{{{ borderColor: "@line", background: "@surface" }}}}>
      <div className="mx-auto max-w-3xl">
        <Reveal><h2 className="tpl-display text-center text-3xl font-bold">{{v(data, "menuListTitle")}}</h2></Reveal>
        <div className="mt-10 divide-y" style={{{{ borderColor: "@line" }}}}>
          {{items.map(([title, meta, text], i) => (
            <div key={{title}} className="flex items-start justify-between gap-4 py-5">
              <div>
                <h3 className="tpl-display text-xl font-bold">{{title}}</h3>
                <p className="mt-1 text-sm" style={{{{ color: "@muted" }}}}>{{text}}</p>
              </div>
              <span className="whitespace-nowrap text-sm font-bold" style={{{{ color: "@primary" }}}}>{{meta}}</span>
            </div>
          ))}}
        </div>
      </div>
    </section>
  );
}}''',
    ]
    cats = f'''function {prefix}CategoryGrid({{ data }}: {{ data: Record<string, any> }}) {{
  const cats = [[v(data, "cat1Title"), v(data, "cat1Text")], [v(data, "cat2Title"), v(data, "cat2Text")], [v(data, "cat3Title"), v(data, "cat3Text")], [v(data, "cat4Title"), v(data, "cat4Text")]];
  return (
    <section className="border-t px-5 py-14 lg:px-8" style={{{{ borderColor: "@line" }}}}>
      <div className="mx-auto grid max-w-7xl gap-3 md:grid-cols-4">
        {{cats.map(([t, x], i) => (
          <Reveal key={{t}} delayMs={{i * 70}} variant="up">
            <div className="border p-5" style={{{{ borderColor: "@line", background: i % 2 ? "@surface" : "@bg" }}}}>
              <h3 className="tpl-display text-xl font-bold" style={{{{ color: "@primary" }}}}>{{t}}</h3>
              <p className="mt-2 text-sm" style={{{{ color: "@muted" }}}}>{{x}}</p>
            </div>
          </Reveal>
        ))}}
      </div>
    </section>
  );
}}'''
    pairs = f'''function {prefix}PairingNotes({{ data }}: {{ data: Record<string, any> }}) {{
  const pairs = [[v(data, "pair1Title"), v(data, "pair1Text")], [v(data, "pair2Title"), v(data, "pair2Text")], [v(data, "pair3Title"), v(data, "pair3Text")]];
  return (
    <section className="border-t px-5 py-16 lg:px-8" style={{{{ borderColor: "@line", background: "@surface" }}}}>
      <div className="mx-auto max-w-7xl">
        <Reveal><h2 className="tpl-display text-3xl font-bold">{{v(data, "pairingTitle")}}</h2></Reveal>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {{pairs.map(([t, x], i) => (
            <Reveal key={{t}} delayMs={{i * 80}} variant="up">
              <div className="border-r pr-4" style={{{{ borderColor: "@primary" }}}}>
                <h3 className="font-bold">{{t}}</h3>
                <p className="mt-2 text-sm leading-7" style={{{{ color: "@muted" }}}}>{{x}}</p>
              </div>
            </Reveal>
          ))}}
        </div>
      </div>
    </section>
  );
}}'''
    chef = f'''function {prefix}ChefPicks({{ data }}: {{ data: Record<string, any> }}) {{
  return (
    <section className="border-t px-5 py-16 lg:px-8" style={{{{ borderColor: "@line" }}}}>
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        <div>
          <p className="text-xs tracking-[0.24em]" style={{{{ color: "@primary" }}}}>{{v(data, "chefPickEyebrow")}}</p>
          <h2 className="tpl-display mt-3 text-3xl font-bold">{{v(data, "chefPickTitle")}}</h2>
          <p className="mt-4 text-lg leading-8" style={{{{ color: "@muted" }}}}>{{v(data, "chefPickText")}}</p>
        </div>
        <img src={{v(data, "item5Image")}} alt="" className="aspect-[4/3] w-full object-cover" />
      </div>
    </section>
  );
}}'''
    order = [
        [banners[0], menus[0], cats, pairs, chef],
        [banners[1], cats, menus[1], chef, pairs],
        [banners[2], menus[2], chef, cats, pairs],
    ][v % 3]
    return "\n".join(order)


def page2_defs(prefix: str, v: int) -> str:
    return "\n".join([
        f'''function {prefix}StoryBanner({{ data }}: {{ data: Record<string, any> }}) {{
  return (
    <section className="relative overflow-hidden px-5 py-20 lg:px-8" style={{{{ background: "@surface" }}}}>
      <div className="mx-auto max-w-7xl">
        <p className="text-xs tracking-[0.28em]" style={{{{ color: "@primary" }}}}>{{v(data, "brandName")}}</p>
        <h1 className="tpl-display mt-4 max-w-3xl text-5xl font-bold md:text-6xl">{{v(data, "page2Title")}}</h1>
        <p className="mt-4 max-w-xl text-lg" style={{{{ color: "@muted" }}}}>{{v(data, "page2Subtitle")}}</p>
      </div>
    </section>
  );
}}''',
        f'''function {prefix}TechniqueLadder({{ data }}: {{ data: Record<string, any> }}) {{
  const steps = [[v(data, "tech1Title"), v(data, "tech1Text")], [v(data, "tech2Title"), v(data, "tech2Text")], [v(data, "tech3Title"), v(data, "tech3Text")], [v(data, "tech4Title"), v(data, "tech4Text")]];
  return (
    <section className="border-t px-5 py-16 lg:px-8" style={{{{ borderColor: "@line" }}}}>
      <div className="mx-auto max-w-3xl">
        <Reveal><h2 className="tpl-display text-3xl font-bold">{{v(data, "techTitle")}}</h2></Reveal>
        <div className="mt-10 space-y-6">
          {{steps.map(([t, x], i) => (
            <Reveal key={{t}} delayMs={{i * 70}} variant="{'up' if v % 2 == 0 else 'right'}">
              <div className="grid gap-2 border p-5 md:grid-cols-[60px_1fr]" style={{{{ borderColor: "@line", background: i % 2 ? "@surface" : "@bg" }}}}>
                <span className="tpl-display text-3xl font-bold" style={{{{ color: "@primary" }}}}>0{{i + 1}}</span>
                <div>
                  <h3 className="tpl-display text-xl font-bold">{{t}}</h3>
                  <p className="mt-2 text-sm leading-7" style={{{{ color: "@muted" }}}}>{{x}}</p>
                </div>
              </div>
            </Reveal>
          ))}}
        </div>
      </div>
    </section>
  );
}}''',
        f'''function {prefix}MaterialCards({{ data }}: {{ data: Record<string, any> }}) {{
  const mats = [[v(data, "mat1Title"), v(data, "mat1Text")], [v(data, "mat2Title"), v(data, "mat2Text")], [v(data, "mat3Title"), v(data, "mat3Text")]];
  return (
    <section className="border-t px-5 py-14 lg:px-8" style={{{{ borderColor: "@line", background: "@surface" }}}}>
      <div className="mx-auto max-w-7xl">
        <Reveal><h2 className="tpl-display text-3xl font-bold">{{v(data, "matTitle")}}</h2></Reveal>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {{mats.map(([t, x], i) => (
            <Reveal key={{t}} delayMs={{i * 70}} variant="up">
              <div className="border p-6" style={{{{ borderColor: "@primary" }}}}>
                <h3 className="tpl-display text-xl font-bold">{{t}}</h3>
                <p className="mt-3 text-sm" style={{{{ color: "@muted" }}}}>{{x}}</p>
              </div>
            </Reveal>
          ))}}
        </div>
      </div>
    </section>
  );
}}''',
        f'''function {prefix}EventsBand({{ data }}: {{ data: Record<string, any> }}) {{
  return (
    <section className="border-t px-5 py-16 lg:px-8" style={{{{ borderColor: "@line" }}}}>
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-2 lg:items-center">
        <img src={{v(data, "galleryImage2")}} alt="" className="aspect-[16/10] w-full object-cover" />
        <div>
          <h2 className="tpl-display text-3xl font-bold">{{v(data, "eventsTitle")}}</h2>
          <p className="mt-4 text-lg leading-8" style={{{{ color: "@muted" }}}}>{{v(data, "eventsText")}}</p>
          <p className="mt-4 text-sm font-semibold" style={{{{ color: "@primary" }}}}>{{v(data, "eventsMeta")}}</p>
        </div>
      </div>
    </section>
  );
}}''',
    ])


def about_defs(prefix: str) -> str:
    return "\n".join([
        f'''function {prefix}AboutBanner({{ data }}: {{ data: Record<string, any> }}) {{
  return (
    <section className="border-b px-5 py-16 lg:px-8" style={{{{ borderColor: "@line" }}}}>
      <div className="mx-auto max-w-7xl">
        <p className="text-xs tracking-[0.28em]" style={{{{ color: "@primary" }}}}>{{v(data, "aboutEyebrow")}}</p>
        <h1 className="tpl-display mt-4 text-5xl font-bold md:text-6xl">{{v(data, "aboutPageTitle")}}</h1>
        <p className="mt-4 max-w-2xl text-lg leading-8" style={{{{ color: "@muted" }}}}>{{v(data, "aboutPageLead")}}</p>
      </div>
    </section>
  );
}}''',
        f'''function {prefix}AboutTimeline({{ data }}: {{ data: Record<string, any> }}) {{
  const items = [[v(data, "timeline1Year"), v(data, "timeline1Text")], [v(data, "timeline2Year"), v(data, "timeline2Text")], [v(data, "timeline3Year"), v(data, "timeline3Text")]];
  return (
    <section className="border-t px-5 py-16 lg:px-8" style={{{{ borderColor: "@line", background: "@surface" }}}}>
      <div className="mx-auto max-w-3xl">
        <Reveal><h2 className="tpl-display text-3xl font-bold">{{v(data, "timelineTitle")}}</h2></Reveal>
        <div className="relative mt-10">
          <div className="absolute right-3 top-0 bottom-0 w-px" style={{{{ background: "@line" }}}} />
          {{items.map(([year, text], i) => (
            <Reveal key={{year}} delayMs={{i * 80}} variant="right">
              <div className="relative grid gap-2 pb-10 pr-12">
                <div className="absolute right-1.5 top-1 h-3 w-3 rounded-full border-2" style={{{{ borderColor: "@primary", background: "@bg" }}}} />
                <p className="text-xs tracking-[0.2em]" style={{{{ color: "@primary" }}}}>{{year}}</p>
                <p className="text-sm leading-7">{{text}}</p>
              </div>
            </Reveal>
          ))}}
        </div>
      </div>
    </section>
  );
}}''',
        f'''function {prefix}ChefPortrait({{ data }}: {{ data: Record<string, any> }}) {{
  return (
    <section className="border-t px-5 py-16 lg:px-8" style={{{{ borderColor: "@line" }}}}>
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2 lg:items-center">
        <img src={{v(data, "chefImage")}} alt="" className="aspect-[4/5] w-full object-cover" />
        <div>
          <p className="text-xs tracking-[0.24em]" style={{{{ color: "@primary" }}}}>{{v(data, "chefLabel")}}</p>
          <h2 className="tpl-display mt-3 text-4xl font-bold">{{v(data, "chefName")}}</h2>
          <p className="mt-4 leading-8" style={{{{ color: "@muted" }}}}>{{v(data, "chefBio")}}</p>
          <blockquote className="mt-8 border-r-4 pr-4 text-xl" style={{{{ borderColor: "@primary" }}}}>״{{v(data, "chefQuote")}}״</blockquote>
        </div>
      </div>
    </section>
  );
}}''',
        f'''function {prefix}ValuesRow({{ data }}: {{ data: Record<string, any> }}) {{
  const vals = [[v(data, "value1Title"), v(data, "value1Text")], [v(data, "value2Title"), v(data, "value2Text")], [v(data, "value3Title"), v(data, "value3Text")]];
  return (
    <section className="border-t px-5 py-14 lg:px-8" style={{{{ borderColor: "@line", background: "@surface" }}}}>
      <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-3">
        {{vals.map(([t, x], i) => (
          <Reveal key={{t}} delayMs={{i * 70}} variant="up">
            <div className="p-5">
              <h3 className="tpl-display text-2xl font-bold" style={{{{ color: "@primary" }}}}>{{t}}</h3>
              <p className="mt-3 text-sm leading-7" style={{{{ color: "@muted" }}}}>{{x}}</p>
            </div>
          </Reveal>
        ))}}
      </div>
    </section>
  );
}}''',
    ])


def contact_defs(prefix: str, v: int) -> str:
    forms = [
        # classic 2-col
        f'''function {prefix}ReserveForm({{ data, onCta }}: {{ data: Record<string, any>; onCta: () => void }}) {{
  return (
    <section className="border-t px-5 py-16 lg:px-8" style={{{{ borderColor: "@line", background: "@surface" }}}}>
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2">
        <div>
          <h2 className="tpl-display text-3xl font-bold">{{v(data, "contactTitle")}}</h2>
          <p className="mt-4 leading-8" style={{{{ color: "@muted" }}}}>{{v(data, "contactText")}}</p>
          <div className="mt-8 space-y-2 text-sm" style={{{{ color: "@muted" }}}}><p>{{v(data, "phone")}}</p><p>{{v(data, "email")}}</p><p>{{v(data, "address")}}</p></div>
        </div>
        <form className="grid gap-3 border p-6" style={{{{ borderColor: "@primary" }}}} onSubmit={{(e) => e.preventDefault()}}>
          <input className="w-full border bg-transparent px-4 py-3.5 text-right outline-none" style={{{{ borderColor: "@line", color: "@text" }}}} placeholder="שם מלא" />
          <input className="w-full border bg-transparent px-4 py-3.5 text-right outline-none" style={{{{ borderColor: "@line", color: "@text" }}}} placeholder="טלפון" />
          <input className="w-full border bg-transparent px-4 py-3.5 text-right outline-none" style={{{{ borderColor: "@line", color: "@text" }}}} placeholder="תאריך" />
          <input className="w-full border bg-transparent px-4 py-3.5 text-right outline-none" style={{{{ borderColor: "@line", color: "@text" }}}} placeholder="מספר סועדים" />
          <button type="button" onClick={{onCta}} className="px-6 py-4 text-sm font-bold" style={{{{ background: "@primary", color: "@primaryText" }}}}>{{v(data, "cta")}}</button>
        </form>
      </div>
    </section>
  );
}}''',
        # circular / centered
        f'''function {prefix}ReserveForm({{ data, onCta }}: {{ data: Record<string, any>; onCta: () => void }}) {{
  return (
    <section className="border-t px-5 py-16 lg:px-8" style={{{{ borderColor: "@line" }}}}>
      <div className="mx-auto max-w-xl text-center">
        <h2 className="tpl-display text-3xl font-bold">{{v(data, "contactTitle")}}</h2>
        <p className="mt-4 leading-8" style={{{{ color: "@muted" }}}}>{{v(data, "contactText")}}</p>
        <form className="mt-8 grid gap-3 rounded-[2rem] border p-6 text-right" style={{{{ borderColor: "@primary", background: "@surface" }}}} onSubmit={{(e) => e.preventDefault()}}>
          <input className="w-full rounded-full border bg-transparent px-4 py-3.5 outline-none" style={{{{ borderColor: "@line", color: "@text" }}}} placeholder="שם מלא" />
          <input className="w-full rounded-full border bg-transparent px-4 py-3.5 outline-none" style={{{{ borderColor: "@line", color: "@text" }}}} placeholder="טלפון" />
          <input className="w-full rounded-full border bg-transparent px-4 py-3.5 outline-none" style={{{{ borderColor: "@line", color: "@text" }}}} placeholder="תאריך" />
          <button type="button" onClick={{onCta}} className="rounded-full px-6 py-4 text-sm font-bold" style={{{{ background: "@primary", color: "@primaryText" }}}}>{{v(data, "cta")}}</button>
        </form>
        <p className="mt-6 text-sm" style={{{{ color: "@muted" }}}}>{{v(data, "phone")}} · {{v(data, "email")}}</p>
      </div>
    </section>
  );
}}''',
        # chat-style
        f'''function {prefix}ReserveForm({{ data, onCta }}: {{ data: Record<string, any>; onCta: () => void }}) {{
  return (
    <section className="border-t px-5 py-16 lg:px-8" style={{{{ borderColor: "@line", background: "@surface" }}}}>
      <div className="mx-auto max-w-lg">
        <h2 className="tpl-display text-3xl font-bold">{{v(data, "contactTitle")}}</h2>
        <p className="mt-3 text-sm" style={{{{ color: "@muted" }}}}>{{v(data, "contactText")}}</p>
        <div className="mt-8 space-y-3">
          <div className="mr-8 border p-3 text-sm" style={{{{ borderColor: "@line", background: "@bg" }}}}>היי! מתי נוח לכם?</div>
          <form className="ml-8 grid gap-2 border p-3" style={{{{ borderColor: "@primary" }}}} onSubmit={{(e) => e.preventDefault()}}>
            <input className="w-full border bg-transparent px-3 py-2.5 text-right text-sm outline-none" style={{{{ borderColor: "@line", color: "@text" }}}} placeholder="שם + טלפון" />
            <input className="w-full border bg-transparent px-3 py-2.5 text-right text-sm outline-none" style={{{{ borderColor: "@line", color: "@text" }}}} placeholder="תאריך ושעה" />
            <button type="button" onClick={{onCta}} className="px-4 py-3 text-sm font-bold" style={{{{ background: "@primary", color: "@primaryText" }}}}>{{v(data, "cta")}}</button>
          </form>
        </div>
      </div>
    </section>
  );
}}''',
    ]
    return "\n".join([
        f'''function {prefix}ContactBanner({{ data }}: {{ data: Record<string, any> }}) {{
  return (
    <section className="border-b px-5 py-16 lg:px-8" style={{{{ borderColor: "@line" }}}}>
      <div className="mx-auto max-w-7xl">
        <p className="text-xs tracking-[0.28em]" style={{{{ color: "@primary" }}}}>{{v(data, "contactEyebrow")}}</p>
        <h1 className="tpl-display mt-4 text-5xl font-bold md:text-6xl">{{v(data, "contactPageTitle")}}</h1>
        <p className="mt-4 max-w-xl text-lg" style={{{{ color: "@muted" }}}}>{{v(data, "contactPageText")}}</p>
      </div>
    </section>
  );
}}''',
        forms[v % 3],
        f'''function {prefix}HoursMap({{ data }}: {{ data: Record<string, any> }}) {{
  return (
    <section className="border-t px-5 py-14 lg:px-8" style={{{{ borderColor: "@line" }}}}>
      <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-2">
        <div className="border p-6" style={{{{ borderColor: "@line", background: "@surface" }}}}>
          <h3 className="tpl-display text-2xl font-bold">{{v(data, "hoursTitle")}}</h3>
          <p className="mt-4 text-sm leading-7" style={{{{ color: "@muted" }}}}>{{v(data, "hours")}}</p>
          <p className="mt-4 text-sm">{{v(data, "address")}}</p>
        </div>
        <div className="relative min-h-[220px] overflow-hidden border" style={{{{ borderColor: "@line" }}}}>
          <img src={{v(data, "galleryImage1")}} alt="" className="absolute inset-0 h-full w-full object-cover opacity-60" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="border px-4 py-2 text-xs font-bold tracking-wider" style={{{{ borderColor: "@primary", background: "@bg", color: "@primary" }}}}>{{v(data, "mapLabel")}}</span>
          </div>
        </div>
      </div>
    </section>
  );
}}''',
        f'''function {prefix}FaqBlock({{ data }}: {{ data: Record<string, any> }}) {{
  const faqs = [[v(data, "faq1Q"), v(data, "faq1A")], [v(data, "faq2Q"), v(data, "faq2A")], [v(data, "faq3Q"), v(data, "faq3A")]];
  return (
    <section className="border-t px-5 py-16 lg:px-8" style={{{{ borderColor: "@line", background: "@surface" }}}}>
      <div className="mx-auto max-w-3xl space-y-4">
        <Reveal><h2 className="tpl-display text-3xl font-bold">{{v(data, "faqTitle")}}</h2></Reveal>
        {{faqs.map(([q, a], i) => (
          <Reveal key={{q}} delayMs={{i * 70}} variant="up">
            <details className="border p-4" style={{{{ borderColor: "@line" }}}}>
              <summary className="cursor-pointer font-bold">{{q}}</summary>
              <p className="mt-3 text-sm leading-7" style={{{{ color: "@muted" }}}}>{{a}}</p>
            </details>
          </Reveal>
        ))}}
      </div>
    </section>
  );
}}''',
    ])


LAYOUTS = [
    ("laminateLayers", "Lam", 0),
    ("papelFlutter", "Papel", 1),
    ("meltDrip", "Melt", 2),
    ("spitRotate", "Spit", 0),
    ("bowlOrbit", "Orbit", 1),
    ("basketSteam", "Basket", 2),
    ("smashStack", "Smash", 0),
    ("foamWave", "Foam", 1),
    ("rootGrow", "Root", 2),
    ("smokePlume", "Smoke", 0),
    ("noodleSwirl", "Noodle", 1),
    ("sugarCrystal", "Sugar", 2),
    ("citrusBurst", "Citrus", 0),
]

FEATURED_NAMES = {
    "laminateLayers": "LamLayerShelf",
    "papelFlutter": "PapelFlutterCards",
    "meltDrip": "MeltScoopRing",
    "spitRotate": "SpitVerticalRail",
    "bowlOrbit": "OrbitBowlMap",
    "basketSteam": "BasketSteamStack",
    "smashStack": "SmashBurgerPile",
    "foamWave": "FoamWaveCatch",
    "rootGrow": "RootGrowTrail",
    "smokePlume": "SmokeMeatGrid",
    "noodleSwirl": "NoodleSwirlBoard",
    "sugarCrystal": "SugarCrystalFacet",
    "citrusBurst": "CitrusBurstCircles",
}


def build_layout(layout: str, prefix: str, variant: int) -> dict:
    feat_name = FEATURED_NAMES[layout]
    home_defs = "".join([
        fn(feat_name, DATA, FEATURED[layout]),
        fn(f"{prefix}ProcessSteps", DATA, process_section(prefix, variant)),
        fn(f"{prefix}HomeGallery", DATA, gallery_section(variant)),
        fn(f"{prefix}HomeReviews", DATA, reviews_section(variant)),
        fn(f"{prefix}HomeStats", DATA, stats_section(variant)),
        fn(f"{prefix}HomeCtaTeaser", DATA_GOTO, cta_section()),
    ])
    return {
        "home_defs": home_defs,
        "home_uses": [
            f"<{feat_name} data={{data}} />",
            f"<{prefix}ProcessSteps data={{data}} />",
            f"<{prefix}HomeGallery data={{data}} />",
            f"<{prefix}HomeReviews data={{data}} />",
            f"<{prefix}HomeStats data={{data}} />",
            f"<{prefix}HomeCtaTeaser data={{data}} goTo={{goTo}} />",
        ],
        "page1_defs": "\n" + page1_defs(prefix, variant),
        "page1_uses": [
            f"<{prefix}SpecialtyBanner data={{data}} />",
            f"<{prefix}FullMenuBoard data={{data}} />",
            f"<{prefix}CategoryGrid data={{data}} />",
            f"<{prefix}PairingNotes data={{data}} />",
            f"<{prefix}ChefPicks data={{data}} />",
        ] if variant % 3 != 1 else [
            f"<{prefix}SpecialtyBanner data={{data}} />",
            f"<{prefix}CategoryGrid data={{data}} />",
            f"<{prefix}FullMenuBoard data={{data}} />",
            f"<{prefix}ChefPicks data={{data}} />",
            f"<{prefix}PairingNotes data={{data}} />",
        ] if True else [],
        "page2_defs": "\n" + page2_defs(prefix, variant),
        "page2_uses": [
            f"<{prefix}StoryBanner data={{data}} />",
            f"<{prefix}TechniqueLadder data={{data}} />",
            f"<{prefix}MaterialCards data={{data}} />",
            f"<{prefix}EventsBand data={{data}} />",
        ],
        "about_defs": "\n" + about_defs(prefix),
        "about_uses": [
            f"<{prefix}AboutBanner data={{data}} />",
            f"<{prefix}AboutTimeline data={{data}} />",
            f"<{prefix}ChefPortrait data={{data}} />",
            f"<{prefix}ValuesRow data={{data}} />",
        ],
        "contact_defs": "\n" + contact_defs(prefix, variant),
        "contact_uses": [
            f"<{prefix}ContactBanner data={{data}} />",
            f"<{prefix}ReserveForm data={{data}} onCta={{onCta}} />",
            f"<{prefix}HoursMap data={{data}} />",
            f"<{prefix}FaqBlock data={{data}} />",
        ],
    }


def py_str(s: str) -> str:
    return repr(s)


def main():
    # Fix page1_uses for variant 1 and 2 properly
    sections = {}
    for layout, prefix, variant in LAYOUTS:
        sec = build_layout(layout, prefix, variant)
        if variant % 3 == 1:
            sec["page1_uses"] = [
                f"<{prefix}SpecialtyBanner data={{data}} />",
                f"<{prefix}CategoryGrid data={{data}} />",
                f"<{prefix}FullMenuBoard data={{data}} />",
                f"<{prefix}ChefPicks data={{data}} />",
                f"<{prefix}PairingNotes data={{data}} />",
            ]
        elif variant % 3 == 2:
            sec["page1_uses"] = [
                f"<{prefix}SpecialtyBanner data={{data}} />",
                f"<{prefix}FullMenuBoard data={{data}} />",
                f"<{prefix}ChefPicks data={{data}} />",
                f"<{prefix}CategoryGrid data={{data}} />",
                f"<{prefix}PairingNotes data={{data}} />",
            ]
        else:
            sec["page1_uses"] = [
                f"<{prefix}SpecialtyBanner data={{data}} />",
                f"<{prefix}FullMenuBoard data={{data}} />",
                f"<{prefix}CategoryGrid data={{data}} />",
                f"<{prefix}PairingNotes data={{data}} />",
                f"<{prefix}ChefPicks data={{data}} />",
            ]
        sections[layout] = sec

    lines = [
        '"""Auto-built unique food batch2 page sections. Tokens: @primary @primaryText @muted @bg @surface @text @dark @line"""',
        "from __future__ import annotations",
        "",
        "def paint(s: str, p: dict) -> str:",
        "    out = s",
        "    # Longer keys first so @primaryText is not mangled by @primary.",
        "    for k in sorted(p.keys(), key=len, reverse=True):",
        '        out = out.replace("@" + k, str(p[k]))',
        "    return out",
        "",
        "LAYOUT_SECTIONS = {",
    ]
    for layout, sec in sections.items():
        lines.append(f'  "{layout}": {{')
        for key in ["home_defs", "page1_defs", "page2_defs", "about_defs", "contact_defs"]:
            lines.append(f"    {py_str(key)}: {py_str(sec[key])},")
        for key in ["home_uses", "page1_uses", "page2_uses", "about_uses", "contact_uses"]:
            lines.append(f"    {py_str(key)}: {py_str(sec[key])},")
        lines.append("  },")
    lines.append("}")
    lines.append("")
    OUT.write_text("\n".join(lines), encoding="utf-8")
    print("wrote", OUT, "layouts", len(sections))
    # sanity
    from importlib.util import spec_from_loader, module_from_spec
    import importlib.machinery
    spec = importlib.util.spec_from_file_location("food_b2", OUT)
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    for layout, sec in mod.LAYOUT_SECTIONS.items():
        assert len(sec["home_uses"]) >= 6, layout
        total = sum(len(sec[k]) for k in ["home_defs", "page1_defs", "page2_defs", "about_defs", "contact_defs"])
        print(layout, "chars", total, "home_funcs", sec["home_defs"].count("function "))


if __name__ == "__main__":
    main()
