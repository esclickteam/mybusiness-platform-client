#!/usr/bin/env node
/**
 * Polish all 10 agency templates:
 * - Remove marquee strip everywhere
 * - Add real team/case/gallery images
 * - Enrich inner pages with multiple visual sections
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const base = path.join(root, "src/components/site-builder/studio/data/templates");

const keys = [
  "growthly",
  "insureva",
  "closora",
  "adspire",
  "talentix",
  "narrativa",
  "brandforge",
  "mediavault",
  "summitops",
  "eventide",
];

// Unique image sets per template (portraits + case + gallery)
const images = {
  growthly: {
    team: [
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=85",
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=85",
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=800&q=85",
    ],
    cases: [
      "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=85",
    ],
    gallery: [
      "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=1200&q=85",
    ],
  },
  insureva: {
    team: [
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=85",
      "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=800&q=85",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=85",
    ],
    cases: [
      "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1551836022-4bc5d81a0f03?auto=format&fit=crop&w=1200&q=85",
    ],
    gallery: [
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1497215842964-222b430dc094?auto=format&fit=crop&w=1200&q=85",
    ],
  },
  closora: {
    team: [
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=85",
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=85",
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=800&q=85",
    ],
    cases: [
      "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1200&q=85",
    ],
    gallery: [
      "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=85",
    ],
  },
  adspire: {
    team: [
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=800&q=85",
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=85",
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=85",
    ],
    cases: [
      "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=85",
    ],
    gallery: [
      "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=85",
    ],
  },
  talentix: {
    team: [
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=85",
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=85",
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=800&q=85",
    ],
    cases: [
      "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=85",
    ],
    gallery: [
      "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=85",
    ],
  },
  narrativa: {
    team: [
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=85",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=85",
      "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=800&q=85",
    ],
    cases: [
      "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1551836022-4bc5d81a0f03?auto=format&fit=crop&w=1200&q=85",
    ],
    gallery: [
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=1200&q=85",
    ],
  },
  brandforge: {
    team: [
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=85",
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=85",
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=800&q=85",
    ],
    cases: [
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1634942537034-2531766767d1?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=1200&q=85",
    ],
    gallery: [
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1558655146-9f40138edfeb?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1626785774573-4b7993141ae0?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?auto=format&fit=crop&w=1200&q=85",
    ],
  },
  mediavault: {
    team: [
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=85",
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=85",
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=800&q=85",
    ],
    cases: [
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1200&q=85",
    ],
    gallery: [
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1200&q=85",
    ],
  },
  summitops: {
    team: [
      "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=800&q=85",
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=85",
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=85",
    ],
    cases: [
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1200&q=85",
    ],
    gallery: [
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1497215842964-222b430dc094?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=85",
    ],
  },
  eventide: {
    team: [
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=85",
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=800&q=85",
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=85",
    ],
    cases: [
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=1200&q=85",
    ],
    gallery: [
      "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=1200&q=85",
    ],
  },
};

const NEW_TEAM = `function Team({ data }: { data: Record<string, any> }) {
  const items = [
    [getValue(data, "teamOneName"), getValue(data, "teamOneRole"), getValue(data, "teamOneImage")],
    [getValue(data, "teamTwoName"), getValue(data, "teamTwoRole"), getValue(data, "teamTwoImage")],
    [getValue(data, "teamThreeName"), getValue(data, "teamThreeRole"), getValue(data, "teamThreeImage")],
  ];
  return (
    <section className="bg-[var(--surface)] px-5 py-20 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-[var(--p)]">{getValue(data, "teamEyebrow")}</p>
          <h2 className="ag-display mt-4 text-3xl font-extrabold md:text-5xl">{getValue(data, "teamTitle")}</h2>
        </Reveal>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {items.map(([name, role, image], i) => (
            <Reveal key={name} delayMs={i * 90} variant="scale">
              <article className="ag-card overflow-hidden border border-black/10 bg-[var(--bg)] text-center">
                <div className="relative aspect-[4/5] overflow-hidden">
                  <img src={image} alt="" className="h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold">{name}</h3>
                  <p className="mt-2 text-sm font-semibold text-[var(--muted)]">{role}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}`;

const NEW_CASES = `function Cases({ data }: { data: Record<string, any> }) {
  const items = [
    [getValue(data, "caseOneTitle"), getValue(data, "caseOneText"), getValue(data, "caseOneImage")],
    [getValue(data, "caseTwoTitle"), getValue(data, "caseTwoText"), getValue(data, "caseTwoImage")],
    [getValue(data, "caseThreeTitle"), getValue(data, "caseThreeText"), getValue(data, "caseThreeImage")],
  ];
  return (
    <section className="px-5 py-20 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-[var(--p)]">{getValue(data, "casesEyebrow")}</p>
          <h2 className="ag-display mt-4 text-3xl font-extrabold md:text-5xl">{getValue(data, "casesTitle")}</h2>
        </Reveal>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {items.map(([title, text, image], i) => (
            <Reveal key={title} delayMs={i * 90} variant="up">
              <article className="ag-card overflow-hidden border border-black/10 bg-[var(--surface)] text-right">
                <div className="relative aspect-[16/11] overflow-hidden">
                  <img src={image} alt="" className="h-full w-full object-cover transition duration-700 hover:scale-105" />
                  <span className="absolute right-4 top-4 bg-[var(--p)] px-3 py-1 text-xs font-black text-white">0{i + 1}</span>
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold">{title}</h3>
                  <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{text}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}`;

const GALLERY_FN = `function GalleryStrip({ data }: { data: Record<string, any> }) {
  const images = [
    getValue(data, "galleryOneImage"),
    getValue(data, "galleryTwoImage"),
    getValue(data, "galleryThreeImage"),
    getValue(data, "galleryFourImage"),
  ];
  return (
    <section className="px-5 py-16 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-7xl">
        <Reveal className="mb-8 text-center">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-[var(--p)]">גלריה</p>
          <h2 className="ag-display mt-3 text-3xl font-extrabold md:text-5xl">רגעים מהעבודה</h2>
        </Reveal>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {images.map((src, i) => (
            <Reveal key={src} delayMs={i * 70} variant="scale">
              <div className="overflow-hidden border border-black/10">
                <img src={src} alt="" className={\`w-full object-cover \${i % 2 === 0 ? "aspect-[3/4]" : "aspect-square"}\`} />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}`;

const NEW_PAGE_HERO = `function PageHero({ data, title }: { data: Record<string, any>; title: string }) {
  return (
    <section className="relative overflow-hidden border-b border-black/10">
      <img src={getValue(data, "heroImage")} alt="" className="absolute inset-0 h-full w-full object-cover opacity-35" />
      <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg)] via-[var(--bg)]/85 to-[var(--bg)]/55" />
      <Reveal className="relative z-10 mx-auto max-w-7xl px-5 py-16 text-right lg:px-8 lg:py-24">
        <p className="text-xs font-black uppercase tracking-[0.28em] text-[var(--p)]">{getValue(data, "brandName")} · {getValue(data, "nicheLabel")}</p>
        <h1 className="ag-display mt-4 max-w-4xl text-4xl font-extrabold md:text-6xl">{title}</h1>
        <p className="mt-5 max-w-2xl text-base leading-8 text-[var(--muted)]">{getValue(data, "heroSubtitle")}</p>
      </Reveal>
    </section>
  );
}`;

function patchPages(key, text) {
  // Remove Marquee function block
  text = text.replace(
    /function Marquee\(\{ data \}: \{ data: Record<string, any> \}\) \{[\s\S]*?\n\}\n\n/,
    "",
  );

  // Remove Marquee usages
  text = text.replace(/\s*<Marquee data=\{data\} \/>\n/g, "\n");

  // Replace Team
  text = text.replace(
    /function Team\(\{ data \}: \{ data: Record<string, any> \}\) \{[\s\S]*?\n\}\n\nfunction Insights/,
    `${NEW_TEAM}\n\n${GALLERY_FN}\n\nfunction Insights`,
  );

  // Replace Cases - need to match before Team which we already replaced
  text = text.replace(
    /function Cases\(\{ data \}: \{ data: Record<string, any> \}\) \{[\s\S]*?\n\}\n\nfunction Team/,
    `${NEW_CASES}\n\nfunction Team`,
  );

  // Replace PageHero
  text = text.replace(
    /function PageHero\(\{ data, title \}: \{ data: Record<string, any>; title: string \}\) \{[\s\S]*?\n\}\n\nfunction Hero/,
    `${NEW_PAGE_HERO}\n\nfunction Hero`,
  );

  // Also try if Hero comes before PageHero order differs - check if PageHero still old
  if (text.includes("PageHero") && !text.includes("from-[var(--bg)] via-[var(--bg)]/85")) {
    text = text.replace(
      /function PageHero\(\{ data, title \}: \{ data: Record<string, any>; title: string \}\) \{[\s\S]*?\n\}/,
      NEW_PAGE_HERO,
    );
  }

  // Enrich InnerPage map
  const richInner = `function InnerPage({ data, type, goTo }: { data: Record<string, any>; type: string; goTo: (id: string) => void }) {
  const titles: Record<string, string> = {
    about: getValue(data, "navAbout"),
    services: getValue(data, "navServices"),
    cases: getValue(data, "navCases"),
    team: getValue(data, "navTeam"),
    insights: getValue(data, "navInsights"),
    process: getValue(data, "navProcess"),
    contact: getValue(data, "navContact"),
  };
  const map: Record<string, React.ReactNode> = {
    about: (<><About data={data} /><GalleryStrip data={data} /><Team data={data} /><Process data={data} /></>),
    services: (<><Services data={data} goTo={goTo} /><Cases data={data} /><Process data={data} /><Contact data={data} /></>),
    cases: (<><Cases data={data} /><GalleryStrip data={data} /><Insights data={data} goTo={goTo} /><Contact data={data} /></>),
    team: (<><Team data={data} /><About data={data} /><GalleryStrip data={data} /><Contact data={data} /></>),
    insights: (<><Insights data={data} goTo={goTo} /><Cases data={data} /><Process data={data} /><Contact data={data} /></>),
    process: (<><Process data={data} /><Services data={data} goTo={goTo} /><Team data={data} /><Contact data={data} /></>),
    contact: (<><Contact data={data} /><About data={data} /><GalleryStrip data={data} /></>),
  };
  return (
    <>
      <PageHero data={data} title={titles[type] || getValue(data, "brandName")} />
      {map[type] ?? null}
      <Footer data={data} goTo={goTo} />
    </>
  );
}`;

  text = text.replace(
    /function InnerPage\(\{ data, type, goTo \}: \{ data: Record<string, any>; type: string; goTo: \(id: string\) => void \}\) \{[\s\S]*?\n\}\n\nexport default/,
    `${richInner}\n\nexport default`,
  );

  // Enrich HomePage - add gallery, remove marquee already done
  text = text.replace(
    /function HomePage\(\{ data, goTo \}: \{ data: Record<string, any>; goTo: \(id: string\) => void \}\) \{\n  return \(\n    <>\n      <Hero data=\{data\} goTo=\{goTo\} \/>\n([\s\S]*?)      <Footer data=\{data\} goTo=\{goTo\} \/>\n    <\/>\n  \);\n\}/,
    `function HomePage({ data, goTo }: { data: Record<string, any>; goTo: (id: string) => void }) {
  return (
    <>
      <Hero data={data} goTo={goTo} />
      <About data={data} />
      <Services data={data} goTo={goTo} />
      <Cases data={data} />
      <GalleryStrip data={data} />
      <Team data={data} />
      <Insights data={data} goTo={goTo} />
      <Process data={data} />
      <Contact data={data} />
      <Footer data={data} goTo={goTo} />
    </>
  );
}`,
  );

  // Remove kinetic hero marquee strip in adspire specifically
  if (key === "adspire") {
    text = text.replace(
      /\s*<div className="ag-marquee flex gap-10 whitespace-nowrap py-3 text-6xl font-black uppercase opacity-20 md:text-8xl">[\s\S]*?<\/div>\n/,
      "\n",
    );
  }

  // Fix border classes that used border-black/10 in dark themes - keep as is for now

  return text;
}

function patchDefaultData(key, text) {
  const img = images[key];
  // Remove marquee fields
  text = text.replace(/\n  marqueeOne:[\s\S]*?marqueeFive: "[^"]*",\n/, "\n");

  // Insert images after teamThreeRole
  if (!text.includes("teamOneImage")) {
    text = text.replace(
      /(teamThreeRole: "[^"]*",)/,
      `$1
  teamOneImage: "${img.team[0]}",
  teamTwoImage: "${img.team[1]}",
  teamThreeImage: "${img.team[2]}",
  caseOneImage: "${img.cases[0]}",
  caseTwoImage: "${img.cases[1]}",
  caseThreeImage: "${img.cases[2]}",
  galleryOneImage: "${img.gallery[0]}",
  galleryTwoImage: "${img.gallery[1]}",
  galleryThreeImage: "${img.gallery[2]}",
  galleryFourImage: "${img.gallery[3]}",`,
    );
  }
  return text;
}

function patchEditorCss(key, text) {
  // Remove marquee CSS blocks
  text = text.replace(
    new RegExp(
      `\\[data-template-id="${key}"\\] \\.ag-marquee,[\\s\\S]*?width: max-content;\\n\\}\\n`,
    ),
    "",
  );
  text = text.replace(
    new RegExp(`@keyframes ${key}Marquee \\{[\\s\\S]*?\\}\\n`),
    "",
  );
  text = text.replace(
    new RegExp(
      `\\s*\\[data-template-id="${key}"\\] \\.ag-marquee,\\n\\s*\\[data-template-id="${key}-preview"\\] \\.ag-marquee,\\n`,
    ),
    "\n  ",
  );
  // Clean leftover marquee in reduced-motion if any
  text = text.replace(
    new RegExp(
      `\\[data-template-id="${key}"\\] \\.ag-marquee,\\n\\s*\\[data-template-id="${key}-preview"\\] \\.ag-marquee,\\n\\s*`,
      "g",
    ),
    "",
  );
  return text;
}

for (const key of keys) {
  const dir = path.join(base, key);
  const pagesPath = path.join(dir, "pages.tsx");
  const dataPath = path.join(dir, "defaultData.ts");
  const cssPath = path.join(dir, "editorCss.ts");

  let pages = fs.readFileSync(pagesPath, "utf8");
  let data = fs.readFileSync(dataPath, "utf8");
  let css = fs.readFileSync(cssPath, "utf8");

  pages = patchPages(key, pages);
  data = patchDefaultData(key, data);
  css = patchEditorCss(key, css);

  // Dark theme borders: replace border-black/10 with a CSS var friendly approach in team/cases for dark templates
  // Already using border-black/10 hardcoded from NEW_* - for dark themes use border-white/15
  const darkKeys = new Set(["growthly", "closora", "adspire", "mediavault", "eventide"]);
  if (darkKeys.has(key)) {
    pages = pages.replaceAll("border-black/10", "border-white/15");
  }

  fs.writeFileSync(pagesPath, pages);
  fs.writeFileSync(dataPath, data);
  fs.writeFileSync(cssPath, css);
  console.log("polished", key, {
    marqueeGone: !pages.includes("function Marquee"),
    hasTeamImg: data.includes("teamOneImage"),
    hasGallery: pages.includes("GalleryStrip"),
    richInner: pages.includes("GalleryStrip data={data}"),
  });
}

console.log("done");
