import type { VisualLibrarySectionTemplate } from "./visualLibraryTypes";
import { VISUAL_LIBRARY_IMAGES } from "./libraryAssets";

type PreviewKind =
  | "hero-split"
  | "hero-center"
  | "about"
  | "services-cards"
  | "services-list"
  | "contact"
  | "products"
  | "pricing"
  | "cta"
  | "reviews"
  | "events"
  | "blog"
  | "features"
  | "promote"
  | "resume"
  | "team"
  | "stats"
  | "portfolio"
  | "faq";

function nodeText(
  section: VisualLibrarySectionTemplate,
  keys: string[],
  fallback = "",
) {
  for (const key of keys) {
    const found = section.nodes.find((n) => n.key === key);
    const text = found?.content?.text;
    if (typeof text === "string" && text.trim()) return text.trim();
  }
  return fallback;
}

function nodeImage(
  section: VisualLibrarySectionTemplate,
  keys: string[] = ["image", "img1", "featured-img"],
) {
  for (const key of keys) {
    const found = section.nodes.find((n) => n.key === key);
    const src =
      found?.content?.src ||
      found?.content?.secureUrl ||
      found?.content?.url;
    if (typeof src === "string" && src) return src;
  }
  return section.thumbnail || VISUAL_LIBRARY_IMAGES.office;
}

function collectImages(section: VisualLibrarySectionTemplate, count: number) {
  const fromNodes = section.nodes
    .filter((n) => n.type === "image")
    .map((n) => n.content?.src || n.content?.secureUrl || n.content?.url)
    .filter(Boolean) as string[];

  const pool = [
    ...fromNodes,
    section.thumbnail || "",
    VISUAL_LIBRARY_IMAGES.beauty,
    VISUAL_LIBRARY_IMAGES.food,
    VISUAL_LIBRARY_IMAGES.wellness,
    VISUAL_LIBRARY_IMAGES.fashion,
    VISUAL_LIBRARY_IMAGES.tech,
    VISUAL_LIBRARY_IMAGES.travel,
  ].filter(Boolean);

  const out: string[] = [];
  for (let i = 0; i < count; i += 1) {
    out.push(pool[i % pool.length]);
  }
  return out;
}

function inferKind(section: VisualLibrarySectionTemplate): PreviewKind {
  const { id, category } = section;
  if (category === "hero") {
    if (id.includes("center") || id.includes("warm")) return "hero-center";
    return "hero-split";
  }
  if (category === "about") return "about";
  if (category === "contact") return "contact";
  if (category === "commerce") {
    if (id.includes("spotlight")) return "hero-split";
    return "products";
  }
  if (category === "pricing") return "pricing";
  if (category === "cta") return "cta";
  if (category === "testimonials") return "reviews";
  if (category === "events") return "events";
  if (category === "blog") return "blog";
  if (category === "features") return "features";
  if (category === "promote") return "promote";
  if (category === "resume") return "resume";
  if (category === "team") return "team";
  if (category === "stats") return "stats";
  if (category === "portfolio" || category === "gallery") return "portfolio";
  if (category === "faq") return "faq";
  if (category === "services") {
    if (id.includes("list")) return "services-list";
    return "services-cards";
  }
  return "about";
}

function Btn({
  label,
  dark = false,
  soft = false,
}: {
  label: string;
  dark?: boolean;
  soft?: boolean;
}) {
  return (
    <span
      className={[
        "inline-flex items-center justify-center rounded-full px-2.5 py-1 text-[9px] font-black",
        soft
          ? "border border-slate-200 bg-white text-slate-800"
          : dark
            ? "bg-slate-950 text-white"
            : "bg-violet-600 text-white",
      ].join(" ")}
    >
      {label}
    </span>
  );
}

/**
 * Photorealistic mini section thumbnails (Wix-style), with real images + Hebrew copy.
 */
export default function SectionLibraryCardPreview({
  section,
}: {
  section: VisualLibrarySectionTemplate;
}) {
  const kind = inferKind(section);
  const bg = section.backgroundColor || "#ffffff";
  const title = nodeText(section, ["title", "headline"], section.title);
  const copy = nodeText(section, ["copy", "subtitle", "description"], section.description);
  const badge = nodeText(section, ["badge", "eyebrow"], "");
  const cta = nodeText(section, ["primary", "button", "cta"], "לפרטים");
  const heroImg = nodeImage(section);
  const images = collectImages(section, 4);

  if (kind === "hero-split") {
    return (
      <div
        className="grid h-full grid-cols-2 overflow-hidden"
        style={{ backgroundColor: bg }}
        dir="rtl"
      >
        <div className="flex flex-col justify-center gap-1.5 p-3 text-right">
          {badge ? (
            <span className="w-fit rounded-full bg-violet-100 px-2 py-0.5 text-[8px] font-black text-violet-700">
              {badge}
            </span>
          ) : null}
          <p className="line-clamp-2 text-[11px] font-black leading-tight text-slate-950">
            {title}
          </p>
          <p className="line-clamp-2 text-[8px] font-bold leading-snug text-slate-500">
            {copy}
          </p>
          <div className="mt-1 flex gap-1">
            <Btn label={cta} />
            <Btn label="עוד" soft />
          </div>
        </div>
        <img src={heroImg} alt="" className="h-full w-full object-cover" />
      </div>
    );
  }

  if (kind === "hero-center") {
    return (
      <div className="relative flex h-full items-center justify-center overflow-hidden" dir="rtl">
        <img src={heroImg} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-slate-950/55" />
        <div className="relative z-[1] flex max-w-[80%] flex-col items-center gap-1.5 px-3 text-center">
          {badge ? (
            <span className="text-[8px] font-black text-violet-200">{badge}</span>
          ) : null}
          <p className="line-clamp-2 text-[12px] font-black leading-tight text-white">
            {title}
          </p>
          <p className="line-clamp-2 text-[8px] font-bold text-white/75">{copy}</p>
          <Btn label={cta} />
        </div>
      </div>
    );
  }

  if (kind === "about") {
    return (
      <div
        className="grid h-full grid-cols-2 overflow-hidden"
        style={{ backgroundColor: bg }}
        dir="rtl"
      >
        <div className="flex flex-col justify-center gap-1.5 p-3 text-right">
          {badge ? (
            <span className="text-[8px] font-black text-violet-600">{badge}</span>
          ) : null}
          <p className="line-clamp-2 text-[11px] font-black leading-tight text-slate-950">
            {title}
          </p>
          <p className="line-clamp-3 text-[8px] font-bold leading-snug text-slate-500">
            {copy}
          </p>
          <Btn label={cta} dark />
        </div>
        <img src={heroImg} alt="" className="h-full w-full object-cover" />
      </div>
    );
  }

  if (kind === "services-cards" || kind === "features" || kind === "portfolio" || kind === "team") {
    const cards = collectImages(section, kind === "features" ? 3 : 3);
    const labels = [1, 2, 3].map((i) =>
      nodeText(section, [`title${i}`], `${section.category === "team" ? "חבר צוות" : "פריט"} ${i}`),
    );
    return (
      <div className="flex h-full flex-col gap-2 p-2.5" style={{ backgroundColor: bg }} dir="rtl">
        <p className="text-center text-[11px] font-black text-slate-950">{title}</p>
        <div className="grid min-h-0 flex-1 grid-cols-3 gap-1.5">
          {cards.map((src, i) => (
            <div key={i} className="overflow-hidden rounded-lg bg-white shadow-sm">
              {kind === "features" ? (
                <div className="flex h-full flex-col gap-1 p-1.5">
                  <div className="flex h-6 w-6 items-center justify-center rounded-md bg-violet-100 text-[10px] text-violet-700">
                    ✦
                  </div>
                  <p className="line-clamp-2 text-[8px] font-black text-slate-900">
                    {labels[i]}
                  </p>
                  <p className="line-clamp-2 text-[7px] font-bold text-slate-400">
                    {nodeText(section, [`copy${i + 1}`], "תיאור קצר של היתרון")}
                  </p>
                </div>
              ) : (
                <>
                  <img src={src} alt="" className="h-12 w-full object-cover" />
                  <div className="p-1">
                    <p className="truncate text-[8px] font-black text-slate-900">
                      {labels[i]}
                    </p>
                    {(kind === "services-cards" || kind === "portfolio") && (
                      <span className="mt-0.5 inline-block text-[7px] font-black text-violet-600">
                        {cta}
                      </span>
                    )}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (kind === "services-list" || kind === "faq" || kind === "resume") {
    const rows = [1, 2, 3].map((i) => ({
      t: nodeText(
        section,
        [`title${i}`, `q${i}`, `role${i}`, `skill${i}`],
        `שורה ${i}`,
      ),
      c: nodeText(section, [`copy${i}`, `a${i}`, `place${i}`], "תיאור קצר"),
    }));
    return (
      <div
        className="grid h-full grid-cols-[0.85fr_1.15fr] gap-2 p-2.5"
        style={{ backgroundColor: bg }}
        dir="rtl"
      >
        <div className="flex items-start justify-end pt-1">
          <p className="text-right text-[11px] font-black leading-tight text-slate-950">
            {title}
          </p>
        </div>
        <div className="flex flex-col justify-center gap-1.5">
          {rows.map((row, i) => (
            <div key={i} className="border-b border-slate-200 pb-1 text-right">
              <p className="text-[9px] font-black text-slate-900">{row.t}</p>
              <p className="truncate text-[7px] font-bold text-slate-400">{row.c}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (kind === "contact") {
    return (
      <div
        className="grid h-full grid-cols-2 overflow-hidden"
        style={{ backgroundColor: bg }}
        dir="rtl"
      >
        <div className="flex flex-col justify-center gap-1.5 bg-white p-2.5 text-right shadow-sm">
          <p className="text-[11px] font-black text-slate-950">{title}</p>
          <p className="line-clamp-2 text-[7px] font-bold text-slate-400">{copy}</p>
          <div className="rounded-md bg-slate-100 px-2 py-1 text-[7px] font-bold text-slate-400">
            שם מלא
          </div>
          <div className="rounded-md bg-slate-100 px-2 py-1 text-[7px] font-bold text-slate-400">
            אימייל
          </div>
          <div className="h-8 rounded-md bg-slate-100" />
          <Btn label="שליחה" />
        </div>
        <img src={heroImg} alt="" className="h-full w-full object-cover" />
      </div>
    );
  }

  if (kind === "products") {
    return (
      <div className="flex h-full flex-col gap-1.5 p-2.5" style={{ backgroundColor: bg }} dir="rtl">
        <p className="text-center text-[11px] font-black text-slate-950">{title}</p>
        <div className="grid min-h-0 flex-1 grid-cols-4 gap-1">
          {images.map((src, i) => (
            <div key={i} className="overflow-hidden rounded-md bg-white shadow-sm">
              <img src={src} alt="" className="h-12 w-full object-cover" />
              <div className="p-1 text-right">
                <p className="truncate text-[7px] font-black text-slate-900">
                  {nodeText(section, [`title${i + 1}`], `מוצר ${i + 1}`)}
                </p>
                <p className="text-[7px] font-black text-violet-600">
                  {nodeText(section, [`price${i + 1}`], "₪99")}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (kind === "pricing") {
    const plans = [1, 2, 3].map((i) => ({
      name: nodeText(section, [`name${i}`], ["התחלה", "צמיחה", "מקצועי"][i - 1]),
      price: nodeText(section, [`price${i}`], ["₪149", "₪299", "₪499"][i - 1]),
    }));
    return (
      <div className="flex h-full flex-col gap-1.5 p-2.5" style={{ backgroundColor: bg }} dir="rtl">
        <p className="text-center text-[11px] font-black text-slate-950">{title}</p>
        <div className="grid min-h-0 flex-1 grid-cols-3 gap-1.5">
          {plans.map((plan, i) => (
            <div
              key={i}
              className={[
                "flex flex-col rounded-lg p-1.5 text-right",
                i === 1 ? "bg-slate-950 text-white" : "border border-slate-200 bg-white",
              ].join(" ")}
            >
              <p className={`text-[8px] font-black ${i === 1 ? "text-violet-300" : "text-slate-500"}`}>
                {plan.name}
              </p>
              <p className="mt-1 text-[12px] font-black">{plan.price}</p>
              <div className={`mt-auto h-4 rounded-full ${i === 1 ? "bg-violet-500" : "bg-slate-900"}`} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (kind === "cta") {
    return (
      <div
        className="flex h-full flex-col items-center justify-center gap-1.5 px-4 text-center"
        style={{ backgroundColor: bg === "#ffffff" ? "#0f172a" : bg }}
        dir="rtl"
      >
        <p className="line-clamp-2 text-[12px] font-black text-white">{title}</p>
        <p className="line-clamp-2 text-[8px] font-bold text-white/70">{copy}</p>
        <Btn label={cta} />
      </div>
    );
  }

  if (kind === "reviews") {
    return (
      <div className="flex h-full flex-col gap-1.5 p-2.5" style={{ backgroundColor: bg }} dir="rtl">
        <p className="text-center text-[11px] font-black text-slate-950">{title}</p>
        <div className="grid min-h-0 flex-1 grid-cols-3 gap-1.5">
          {[0, 1, 2].map((i) => (
            <div key={i} className="rounded-lg border border-slate-100 bg-white p-1.5 text-right shadow-sm">
              <p className="text-[8px] text-amber-500">★★★★★</p>
              <p className="mt-1 line-clamp-3 text-[7px] font-bold leading-snug text-slate-600">
                {nodeText(section, [`quote${i + 1}`], "שירות מקצועי ותוצאות מעולות.")}
              </p>
              <p className="mt-1 text-[8px] font-black text-slate-900">
                {nodeText(section, [`name${i + 1}`], "לקוח/ה")}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (kind === "events" || kind === "blog") {
    return (
      <div className="flex h-full flex-col gap-1.5 p-2.5" style={{ backgroundColor: bg }} dir="rtl">
        <p className="text-[11px] font-black text-slate-950">{title}</p>
        <div className="grid min-h-0 flex-1 grid-cols-3 gap-1.5">
          {images.slice(0, 3).map((src, i) => (
            <div key={i} className="overflow-hidden rounded-lg bg-white shadow-sm">
              <img src={src} alt="" className="h-14 w-full object-cover" />
              <div className="p-1 text-right">
                <p className="line-clamp-2 text-[8px] font-black text-slate-900">
                  {nodeText(section, [`title${i + 1}`, "featured-title"], `אירוע ${i + 1}`)}
                </p>
                <Btn label={kind === "blog" ? "קראו עוד" : "פרטים"} />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (kind === "promote") {
    return (
      <div
        className="grid h-full grid-cols-2 overflow-hidden"
        style={{ backgroundColor: bg }}
        dir="rtl"
      >
        <div className="flex flex-col justify-center gap-1.5 p-2.5 text-right">
          <p className="line-clamp-2 text-[11px] font-black text-slate-950">{title}</p>
          <p className="line-clamp-2 text-[8px] font-bold text-slate-500">{copy}</p>
          <div className="mt-1 flex items-center gap-1">
            <div className="h-5 flex-1 rounded-full border border-slate-200 bg-white px-2 text-[7px] font-bold leading-5 text-slate-400">
              האימייל שלכם
            </div>
            <Btn label={cta} />
          </div>
        </div>
        <img src={heroImg} alt="" className="h-full w-full object-cover" />
      </div>
    );
  }

  if (kind === "stats") {
    const values = [1, 2, 3, 4].map((i) => ({
      v: nodeText(section, [`value${i}`], ["120+", "98%", "8ש׳", "5★"][i - 1]),
      l: nodeText(section, [`label${i}`], ["פרויקטים", "שביעות רצון", "תגובה", "דירוג"][i - 1]),
    }));
    return (
      <div
        className="grid h-full grid-cols-4 gap-1 p-3"
        style={{ backgroundColor: bg === "#ffffff" ? "#0f172a" : bg }}
        dir="rtl"
      >
        {values.map((item, i) => (
          <div key={i} className="flex flex-col items-center justify-center text-center">
            <p className="text-[13px] font-black text-white">{item.v}</p>
            <p className="text-[7px] font-bold text-white/55">{item.l}</p>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid h-full grid-cols-2 overflow-hidden" style={{ backgroundColor: bg }} dir="rtl">
      <div className="flex flex-col justify-center gap-1.5 p-3 text-right">
        <p className="line-clamp-2 text-[11px] font-black text-slate-950">{title}</p>
        <p className="line-clamp-2 text-[8px] font-bold text-slate-500">{copy}</p>
        <Btn label={cta} />
      </div>
      <img src={heroImg} alt="" className="h-full w-full object-cover" />
    </div>
  );
}
