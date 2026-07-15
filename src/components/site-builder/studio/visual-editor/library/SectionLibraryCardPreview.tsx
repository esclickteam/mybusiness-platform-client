import type { VisualLibrarySectionTemplate } from "./visualLibraryTypes";
import { VISUAL_LIBRARY_IMAGES } from "./libraryAssets";

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
  keys: string[] = ["image", "img1", "featured-img", "portrait"],
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
    VISUAL_LIBRARY_IMAGES.realestate,
  ].filter(Boolean);

  return Array.from({ length: count }, (_, i) => pool[i % pool.length]);
}

function Btn({
  label,
  soft,
  dark,
}: {
  label: string;
  soft?: boolean;
  dark?: boolean;
}) {
  return (
    <span
      className={[
        "inline-flex items-center justify-center rounded-full px-2 py-0.5 text-[8px] font-black",
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

function Field({ label }: { label: string }) {
  return (
    <div className="rounded-md bg-slate-100 px-1.5 py-1 text-[7px] font-bold text-slate-400">
      {label}
    </div>
  );
}

function MapBox({ square }: { square?: boolean }) {
  return (
    <div className={`relative h-full w-full overflow-hidden bg-[#dbeafe] ${square ? "rounded-none" : "rounded-lg"}`}>
      <div className={`absolute inset-3 border border-sky-300/60 bg-sky-100/80 ${square ? "rounded-none" : "rounded-md"}`} />
      <div className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-rose-500 shadow" />
      <p className="absolute bottom-1 right-1 rounded bg-white/90 px-1 text-[7px] font-black text-slate-600">
        מפה
      </p>
    </div>
  );
}

/**
 * Preview equals structure: uses previewLayout (or id hints) so each card
 * reflects the real section that will be inserted.
 */
export default function SectionLibraryCardPreview({
  section,
}: {
  section: VisualLibrarySectionTemplate;
}) {
  const layout = String(section.previewLayout || section.id || "").toLowerCase();
  const bg = section.backgroundColor || "#ffffff";
  const title = nodeText(section, ["title", "headline"], section.title);
  const copy = nodeText(
    section,
    ["copy", "subtitle", "description"],
    section.description,
  );
  const badge = nodeText(section, ["badge", "eyebrow"], "");
  const cta = nodeText(section, ["primary", "button", "cta"], "לפרטים");
  const img = nodeImage(section);
  const images = collectImages(section, 4);

  // —— Contact: one distinct preview per layout key ——
  if (layout.includes("contact") || section.category === "contact") {
    if (layout.includes("details-icons") || layout.includes("details-grid")) {
      return (
        <div className="grid h-full grid-cols-2 gap-1.5 p-2.5" style={{ backgroundColor: bg }} dir="rtl">
          <p className="col-span-2 text-[11px] font-black text-slate-950">{title}</p>
          {["כתובת", "טלפון", "אימייל", "שעות"].map((label) => (
            <div key={label} className="border-2 border-slate-900 bg-white p-1.5 text-right">
              <p className="text-[8px] font-black text-violet-600">{label}</p>
              <p className="mt-0.5 truncate text-[7px] font-bold text-slate-500">פרטים לעריכה</p>
            </div>
          ))}
        </div>
      );
    }
    if (layout.includes("map-strip")) {
      return (
        <div className="flex h-full flex-col gap-1.5 p-2" style={{ backgroundColor: bg }} dir="rtl">
          <div className="min-h-0 flex-1"><MapBox square /></div>
          <div className="flex items-center justify-between bg-white px-2 py-1.5 shadow-sm">
            <Btn label="ניווט" />
            <p className="text-[9px] font-black text-slate-900">רחוב הדוגמה 12, ת״א</p>
          </div>
        </div>
      );
    }
    if (layout.includes("split-map") || layout.includes("map-form")) {
      return (
        <div className="grid h-full grid-cols-2 overflow-hidden" style={{ backgroundColor: bg }} dir="rtl">
          <div className="flex flex-col gap-1 p-2 text-right">
            <p className="text-[10px] font-black">{title}</p>
            <Field label="שם" />
            <Field label="אימייל" />
            <Btn label="שליחה" />
          </div>
          <div className="p-1"><MapBox square /></div>
        </div>
      );
    }
    if (layout.includes("big-title") || layout.includes("portrait")) {
      return (
        <div className="grid h-full grid-cols-[1.1fr_0.9fr] overflow-hidden" style={{ backgroundColor: bg }} dir="rtl">
          <div className="flex flex-col justify-center gap-1 p-2 text-right">
            <p className="text-[16px] font-black tracking-wide text-slate-950">צור קשר</p>
            <p className="text-[8px] font-bold text-slate-500">{copy}</p>
            <Field label="הודעה" />
            <Btn label="שליחה" dark />
          </div>
          <img src={img} alt="" className="h-full w-full rounded-full object-cover" />
        </div>
      );
    }
    if (layout.includes("centered-minimal")) {
      return (
        <div className="flex h-full flex-col items-center justify-center gap-1.5 px-6" style={{ backgroundColor: bg }} dir="rtl">
          <p className="text-[12px] font-black text-slate-950">{title}</p>
          <div className="w-full max-w-[70%] space-y-1 border-2 border-slate-900 bg-white p-2">
            <Field label="שם" />
            <Field label="אימייל" />
            <span className="inline-flex rounded-none bg-slate-950 px-2 py-0.5 text-[8px] font-black text-white">שליחה</span>
          </div>
        </div>
      );
    }
    if (layout.includes("dark-overlay")) {
      return (
        <div className="relative flex h-full items-center justify-center overflow-hidden" dir="rtl">
          <img src={img} alt="" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-slate-950/60" />
          <div className="relative z-[1] w-[55%] rounded-[20px] bg-white/95 p-2 text-right shadow-lg">
            <p className="text-[10px] font-black">{title}</p>
            <Field label="אימייל" />
            <div className="mt-1"><Btn label="שליחה" /></div>
          </div>
        </div>
      );
    }
    if (layout.includes("three-contact") || layout.includes("contact-cards")) {
      const cardStyles = ["rounded-none", "rounded-lg", "rounded-full"];
      return (
        <div className="flex h-full flex-col gap-1.5 p-2" style={{ backgroundColor: bg }} dir="rtl">
          <p className="text-center text-[11px] font-black">{title}</p>
          <div className="grid min-h-0 flex-1 grid-cols-3 gap-1">
            {["טלפון", "אימייל", "כתובת"].map((label, i) => (
              <div key={label} className={`flex flex-col items-center justify-center bg-white p-1 text-center shadow-sm ${cardStyles[i]}`}>
                <div className="mb-1 h-5 w-5 rounded-full bg-violet-100" />
                <p className="text-[8px] font-black">{label}</p>
              </div>
            ))}
          </div>
        </div>
      );
    }
    if (layout.includes("image-top") || layout.includes("form-bottom")) {
      return (
        <div className="flex h-full flex-col overflow-hidden" style={{ backgroundColor: bg }} dir="rtl">
          <img src={img} alt="" className="h-[45%] w-full object-cover" />
          <div className="flex flex-1 flex-col justify-center gap-1 p-2 text-right">
            <p className="text-[10px] font-black">{title}</p>
            <div className="grid grid-cols-2 gap-1">
              <Field label="שם" />
              <Field label="אימייל" />
            </div>
            <Btn label="שליחה" />
          </div>
        </div>
      );
    }
    if (layout.includes("social")) {
      return (
        <div className="grid h-full grid-cols-2 gap-2 p-2.5" style={{ backgroundColor: bg }} dir="rtl">
          <div className="flex flex-col justify-center gap-1 text-right">
            <p className="text-[11px] font-black">{title}</p>
            <p className="text-[8px] font-bold text-slate-500">עקבו אחרינו</p>
            <div className="mt-1 flex gap-1">
              {["IG", "FB", "TK", "YT"].map((s) => (
                <span key={s} className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 text-[7px] font-black text-white">
                  {s}
                </span>
              ))}
            </div>
          </div>
          <img src={img} alt="" className="h-full rounded-lg object-cover" />
        </div>
      );
    }
    if (layout.includes("hours")) {
      return (
        <div className="grid h-full grid-cols-2 gap-2 p-2.5" style={{ backgroundColor: bg }} dir="rtl">
          <div className="bg-violet-600 p-2 text-right text-white shadow-[4px_4px_0_#4c1d95]">
            <p className="text-[10px] font-black">שעות פעילות</p>
            <p className="mt-1 text-[8px] font-bold leading-relaxed opacity-90">
              א׳–ה׳ 09:00–18:00
              <br />
              ו׳ 09:00–13:00
            </p>
          </div>
          <div className="flex flex-col justify-center gap-1 text-right">
            <p className="text-[10px] font-black">{title}</p>
            <p className="text-[8px] font-bold text-slate-500">03-555-5555</p>
            <Btn label="התקשרו" />
          </div>
        </div>
      );
    }
    if (layout.includes("newsletter")) {
      return (
        <div className="grid h-full grid-cols-2 overflow-hidden" style={{ backgroundColor: bg }} dir="rtl">
          <div className="flex flex-col justify-center gap-1 p-2 text-right">
            <p className="text-[11px] font-black">{title}</p>
            <div className="flex gap-1">
              <div className="h-5 flex-1 rounded-full border border-slate-200 bg-white px-2 text-[7px] leading-5 text-slate-400">
                אימייל
              </div>
              <Btn label="שליחה" />
            </div>
          </div>
          <img src={img} alt="" className="h-full w-full object-cover" />
        </div>
      );
    }
    // form left / form right / boutique / corporate / default split
    const formFirst =
      layout.includes("form-left") ||
      layout.includes("boutique") ||
      layout.includes("corporate") ||
      (!layout.includes("form-right") && !layout.includes("image-left"));
    const formClass = layout.includes("corporate")
      ? "border border-slate-400 bg-transparent"
      : layout.includes("form-right")
        ? "bg-white shadow-[3px_3px_0_#0f172a]"
        : "bg-white shadow-sm";
    const formRadius = layout.includes("corporate") || layout.includes("form-left")
      ? "rounded-none"
      : layout.includes("form-right")
        ? "rounded-sm"
        : "rounded-2xl";
    const imgRadius = layout.includes("boutique")
      ? "rounded-full"
      : layout.includes("form-right")
        ? "rounded-2xl"
        : layout.includes("corporate") || layout.includes("form-left")
          ? "rounded-none"
          : "rounded-lg";
    const formCol = (
      <div className={`flex flex-col justify-center gap-1 p-2 text-right ${formClass} ${formRadius}`}>
        <p className="text-[10px] font-black text-slate-950">{title}</p>
        <Field label="שם מלא" />
        <Field label="אימייל" />
        <Btn label="שליחה" />
      </div>
    );
    const imgCol = <img src={img} alt="" className={`h-full w-full object-cover ${imgRadius}`} />;
    return (
      <div className="grid h-full grid-cols-2 overflow-hidden" style={{ backgroundColor: bg }} dir="rtl">
        {formFirst ? (
          <>
            {formCol}
            {imgCol}
          </>
        ) : (
          <>
            {imgCol}
            {formCol}
          </>
        )}
      </div>
    );
  }

  // —— Hero ——
  if (section.category === "hero" || layout.includes("hero") || layout.includes("welcome")) {
    if (layout.includes("center") || layout.includes("overlay") || layout.includes("warm")) {
      const light = layout.includes("warm") || layout.includes("light");
      return (
        <div className="relative flex h-full items-center justify-center overflow-hidden" dir="rtl">
          <img src={img} alt="" className="absolute inset-0 h-full w-full object-cover" />
          <div className={`absolute inset-0 ${light ? "bg-white/45" : "bg-slate-950/55"}`} />
          <div className="relative z-[1] flex max-w-[82%] flex-col items-center gap-1 px-2 text-center">
            {badge ? (
              <span className={`text-[8px] font-black ${light ? "text-orange-700" : "text-violet-200"}`}>
                {badge}
              </span>
            ) : null}
            <p className={`line-clamp-2 text-[12px] font-black ${light ? "text-slate-950" : "text-white"}`}>
              {title}
            </p>
            <Btn label={cta} />
          </div>
        </div>
      );
    }
    return (
      <div className="grid h-full grid-cols-2 overflow-hidden" style={{ backgroundColor: bg }} dir="rtl">
        <div className="flex flex-col justify-center gap-1 p-2.5 text-right">
          {badge ? (
            <span className="w-fit rounded-full bg-violet-100 px-1.5 py-0.5 text-[7px] font-black text-violet-700">
              {badge}
            </span>
          ) : null}
          <p className="line-clamp-2 text-[11px] font-black leading-tight text-slate-950">{title}</p>
          <p className="line-clamp-2 text-[7px] font-bold text-slate-500">{copy}</p>
          <div className="flex gap-1">
            <Btn label={cta} />
            <Btn label="עוד" soft />
          </div>
        </div>
        <img src={img} alt="" className="h-full w-full object-cover" />
      </div>
    );
  }

  // —— Pricing ——
  if (section.category === "pricing" || layout.includes("pricing")) {
    if (layout.includes("row")) {
      return (
        <div className="flex h-full flex-col justify-center gap-1.5 p-2.5" style={{ backgroundColor: bg }} dir="rtl">
          <p className="text-[11px] font-black">{title}</p>
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex items-center justify-between rounded-lg border border-slate-100 bg-white px-2 py-1">
              <Btn label="בחירה" soft />
              <p className="text-[9px] font-black">חבילה {i + 1}</p>
            </div>
          ))}
        </div>
      );
    }
    return (
      <div className="flex h-full flex-col gap-1 p-2" style={{ backgroundColor: bg }} dir="rtl">
        <p className="text-center text-[11px] font-black">{title}</p>
        <div className="grid min-h-0 flex-1 grid-cols-3 gap-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`rounded-lg p-1.5 text-right ${i === 1 ? "bg-slate-950 text-white" : "border border-slate-200 bg-white"}`}
            >
              <p className="text-[8px] font-black opacity-70">תוכנית</p>
              <p className="text-[12px] font-black">₪{99 + i * 100}</p>
              <div className={`mt-1 h-3 rounded-full ${i === 1 ? "bg-violet-500" : "bg-slate-900"}`} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // —— Products ——
  if (section.category === "commerce" || layout.includes("commerce") || layout.includes("product")) {
    if (layout.includes("spotlight")) {
      return (
        <div className="grid h-full grid-cols-2 overflow-hidden" style={{ backgroundColor: bg === "#ffffff" ? "#0f172a" : bg }} dir="rtl">
          <div className="flex flex-col justify-center gap-1 p-2 text-right text-white">
            <p className="line-clamp-2 text-[11px] font-black">{title}</p>
            <p className="text-[10px] font-black text-violet-300">
              {nodeText(section, ["price"], "₪249")}
            </p>
            <Btn label={cta} />
          </div>
          <img src={img} alt="" className="h-full w-full object-cover" />
        </div>
      );
    }
    return (
      <div className="flex h-full flex-col gap-1 p-2" style={{ backgroundColor: bg }} dir="rtl">
        <p className="text-center text-[11px] font-black">{title}</p>
        <div className="grid min-h-0 flex-1 grid-cols-4 gap-1">
          {images.map((src, i) => (
            <div key={i} className="overflow-hidden rounded-md bg-white shadow-sm">
              <img src={src} alt="" className="h-11 w-full object-cover" />
              <p className="truncate p-0.5 text-right text-[7px] font-black">מוצר</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // —— Services / Portfolio / Team / Features ——
  if (
    ["services", "portfolio", "gallery", "team", "features"].includes(section.category) ||
    layout.includes("services") ||
    layout.includes("portfolio") ||
    layout.includes("features")
  ) {
    if (layout.includes("list") || layout.includes("clean-list")) {
      return (
        <div className="grid h-full grid-cols-[0.8fr_1.2fr] gap-2 p-2.5" style={{ backgroundColor: bg }} dir="rtl">
          <p className="text-[11px] font-black">{title}</p>
          <div className="flex flex-col justify-center gap-1">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border-b border-slate-200 pb-1 text-right">
                <p className="text-[9px] font-black">שירות {i}</p>
                <p className="text-[7px] font-bold text-slate-400">תיאור קצר</p>
              </div>
            ))}
          </div>
        </div>
      );
    }
    if (layout.includes("split") || layout.includes("expertise")) {
      return (
        <div className="grid h-full grid-cols-2 overflow-hidden" style={{ backgroundColor: bg }} dir="rtl">
          <div className="flex flex-col justify-center gap-1 p-2 text-right">
            <p className="text-[11px] font-black">{title}</p>
            {[1, 2, 3].map((i) => (
              <p key={i} className="text-[8px] font-bold text-slate-500">
                ✦ יתרון {i}
              </p>
            ))}
          </div>
          <img src={img} alt="" className="h-full w-full object-cover" />
        </div>
      );
    }
    const withPhotos = !layout.includes("icon") || layout.includes("image");
    return (
      <div className="flex h-full flex-col gap-1 p-2" style={{ backgroundColor: bg }} dir="rtl">
        <p className="text-center text-[11px] font-black">{title}</p>
        <div className="grid min-h-0 flex-1 grid-cols-3 gap-1">
          {images.slice(0, 3).map((src, i) => (
            <div key={i} className="overflow-hidden rounded-lg bg-white shadow-sm">
              {withPhotos && section.category !== "features" ? (
                <img src={src} alt="" className="h-12 w-full object-cover" />
              ) : (
                <div className="flex h-8 items-center justify-center bg-violet-50 text-violet-600">✦</div>
              )}
              <p className="truncate p-1 text-right text-[8px] font-black">פריט {i + 1}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // —— CTA ——
  if (section.category === "cta" || layout.includes("cta")) {
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

  // —— Reviews ——
  if (section.category === "testimonials" || layout.includes("review") || layout.includes("testimonial")) {
    if (layout.includes("logo")) {
      return (
        <div className="flex h-full flex-col items-center justify-center gap-3 p-3" style={{ backgroundColor: bg }} dir="rtl">
          <p className="text-[11px] font-black">{title}</p>
          <div className="flex gap-3 text-[10px] font-black tracking-wider text-slate-400">
            {["BRAND", "STUDIO", "LOCAL", "CRAFT"].map((b) => (
              <span key={b}>{b}</span>
            ))}
          </div>
        </div>
      );
    }
    return (
      <div className="flex h-full flex-col gap-1 p-2" style={{ backgroundColor: bg }} dir="rtl">
        <p className="text-center text-[11px] font-black">{title}</p>
        <div className="grid min-h-0 flex-1 grid-cols-3 gap-1">
          {[0, 1, 2].map((i) => (
            <div key={i} className="rounded-lg border border-slate-100 bg-white p-1.5 text-right">
              <p className="text-[8px] text-amber-500">★★★★★</p>
              <p className="mt-1 line-clamp-3 text-[7px] font-bold text-slate-600">
                חוויה מעולה ומומלץ בחום.
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // —— Events ——
  if (section.category === "events" || layout.includes("event")) {
    return (
      <div className="flex h-full flex-col gap-1 p-2" style={{ backgroundColor: bg }} dir="rtl">
        <p className="text-[11px] font-black">{title}</p>
        <div className="grid min-h-0 flex-1 grid-cols-3 gap-1">
          {images.slice(0, 3).map((src, i) => (
            <div key={i} className="overflow-hidden rounded-lg bg-white shadow-sm">
              <img src={src} alt="" className="h-12 w-full object-cover" />
              <div className="p-1 text-right">
                <p className="truncate text-[8px] font-black">כותרת {i + 1}</p>
                <Btn label="פרטים" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // —— Blog ——
  if (section.category === "blog" || layout.includes("blog")) {
    if (layout.includes("featured")) {
      return (
        <div className="grid h-full grid-cols-2 overflow-hidden" style={{ backgroundColor: bg }} dir="rtl">
          <img src={images[0]} alt="" className="h-full w-full rounded-xl object-cover" />
          <div className="flex flex-col justify-center gap-1 p-2 text-right">
            <p className="text-[10px] font-black">{title}</p>
            <p className="line-clamp-3 text-[7px] font-bold text-slate-500">כתבה מומלצת עם תקציר קצר.</p>
            <Btn label="קראו" />
          </div>
        </div>
      );
    }
    if (layout.includes("list")) {
      return (
        <div className="flex h-full flex-col gap-1 p-2" style={{ backgroundColor: bg }} dir="rtl">
          <p className="text-[11px] font-black">{title}</p>
          <div className="flex min-h-0 flex-1 flex-col gap-1">
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex items-center gap-1.5 text-right">
                <img src={images[i]} alt="" className="h-8 w-8 shrink-0 object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[8px] font-black">כותרת {i + 1}</p>
                  <p className="text-[7px] font-bold text-slate-400">מרץ 2026</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }
    if (layout.includes("magazine")) {
      return (
        <div className="grid h-full grid-cols-[1.2fr_0.8fr] gap-1 overflow-hidden p-2" style={{ backgroundColor: bg }} dir="rtl">
          <img src={images[0]} alt="" className="h-full w-full object-cover" />
          <div className="flex flex-col gap-1">
            <p className="text-[9px] font-black">{title}</p>
            {[1, 2].map((i) => (
              <div key={i} className="flex gap-1 text-right">
                <img src={images[i]} alt="" className="h-7 w-9 shrink-0 object-cover" />
                <div className="min-w-0">
                  <p className="truncate text-[7px] font-black">פוסט {i}</p>
                  <p className="text-[6px] text-slate-400">מרץ</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }
    if (layout.includes("overlay")) {
      return (
        <div className="flex h-full flex-col gap-1 p-2" style={{ backgroundColor: bg }} dir="rtl">
          <p className="text-[11px] font-black">{title}</p>
          <div className="grid min-h-0 flex-1 grid-cols-3 gap-1">
            {images.slice(0, 3).map((src, i) => (
              <div key={i} className="relative overflow-hidden rounded-lg">
                <img src={src} alt="" className="h-full w-full object-cover" />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/80 to-transparent p-1 text-right">
                  <p className="truncate text-[7px] font-black text-white">כותרת {i + 1}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }
    if (layout.includes("square")) {
      return (
        <div className="flex h-full flex-col gap-1 p-2" style={{ backgroundColor: bg }} dir="rtl">
          <p className="text-[11px] font-black">{title}</p>
          <div className="grid min-h-0 flex-1 grid-cols-2 gap-1">
            {images.slice(0, 4).map((src, i) => (
              <div key={i} className="overflow-hidden bg-white">
                <img src={src} alt="" className="h-10 w-full object-cover" />
                <p className="truncate p-0.5 text-right text-[7px] font-black">פוסט {i + 1}</p>
              </div>
            ))}
          </div>
        </div>
      );
    }
    const squareCards = layout.includes("cards") && parseInt(layout.match(/blog-cards-(\d+)/)?.[1] || "0", 10) % 2 === 1;
    return (
      <div className="flex h-full flex-col gap-1 p-2" style={{ backgroundColor: bg }} dir="rtl">
        <p className="text-[11px] font-black">{title}</p>
        <div className="grid min-h-0 flex-1 grid-cols-3 gap-1">
          {images.slice(0, 3).map((src, i) => (
            <div key={i} className={`overflow-hidden bg-white shadow-sm ${squareCards ? "" : "rounded-lg"}`}>
              <img src={src} alt="" className="h-12 w-full object-cover" />
              <div className="p-1 text-right">
                <p className="truncate text-[8px] font-black">כותרת {i + 1}</p>
                <Btn label="קראו" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // —— About / Resume default split ——
  if (
    section.category === "about" ||
    section.category === "resume" ||
    layout.includes("about") ||
    layout.includes("resume")
  ) {
    if (layout.includes("skills")) {
      return (
        <div className="flex h-full flex-col gap-1 p-2.5" style={{ backgroundColor: bg }} dir="rtl">
          <p className="text-[11px] font-black">{title}</p>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="border-b border-slate-200 py-1 text-right text-[9px] font-bold">
              מיומנות {i}
            </div>
          ))}
        </div>
      );
    }
    return (
      <div className="grid h-full grid-cols-2 overflow-hidden" style={{ backgroundColor: bg }} dir="rtl">
        <div className="flex flex-col justify-center gap-1 p-2.5 text-right">
          {badge ? <span className="text-[8px] font-black text-violet-600">{badge}</span> : null}
          <p className="line-clamp-2 text-[11px] font-black">{title}</p>
          <p className="line-clamp-3 text-[7px] font-bold text-slate-500">{copy}</p>
          <Btn label={cta} dark />
        </div>
        <img src={img} alt="" className="h-full w-full object-cover" />
      </div>
    );
  }

  // —— Promote ——
  if (section.category === "promote" || layout.includes("promote")) {
    return (
      <div className="grid h-full grid-cols-2 overflow-hidden" style={{ backgroundColor: bg }} dir="rtl">
        <div className="flex flex-col justify-center gap-1 p-2 text-right">
          <p className="line-clamp-2 text-[11px] font-black">{title}</p>
          <div className="flex gap-1">
            <div className="h-5 flex-1 rounded-full border border-slate-200 bg-white" />
            <Btn label={cta} />
          </div>
        </div>
        <img src={img} alt="" className="h-full w-full object-cover" />
      </div>
    );
  }

  // —— Stats / FAQ / Footer ——
  if (section.category === "stats" || layout.includes("stats")) {
    return (
      <div
        className="grid h-full grid-cols-4 gap-1 p-3"
        style={{ backgroundColor: bg === "#ffffff" ? "#0f172a" : bg }}
        dir="rtl"
      >
        {["120+", "98%", "8ש׳", "5★"].map((v) => (
          <div key={v} className="text-center">
            <p className="text-[12px] font-black text-white">{v}</p>
          </div>
        ))}
      </div>
    );
  }

  if (section.category === "faq" || layout.includes("faq")) {
    return (
      <div className="flex h-full flex-col gap-1 p-2.5" style={{ backgroundColor: bg }} dir="rtl">
        <p className="text-[11px] font-black">{title}</p>
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-lg border border-slate-100 bg-white px-2 py-1.5 text-right">
            <p className="text-[9px] font-black">שאלה {i}?</p>
            <p className="text-[7px] font-bold text-slate-400">תשובה קצרה לעריכה</p>
          </div>
        ))}
      </div>
    );
  }

  if (section.category === "footer" || layout.includes("footer")) {
    return (
      <div
        className="grid h-full grid-cols-3 gap-2 p-3 text-right"
        style={{ backgroundColor: bg === "#ffffff" ? "#0f172a" : bg }}
        dir="rtl"
      >
        <p className="text-[10px] font-black text-white">העסק</p>
        <p className="text-[8px] font-bold text-white/60">קישורים</p>
        <p className="text-[8px] font-bold text-white/60">יצירת קשר</p>
      </div>
    );
  }

  // Fallback: show real thumbnail composition
  return (
    <div className="grid h-full grid-cols-2 overflow-hidden" style={{ backgroundColor: bg }} dir="rtl">
      <div className="flex flex-col justify-center gap-1 p-2.5 text-right">
        <p className="line-clamp-2 text-[11px] font-black text-slate-950">{title}</p>
        <p className="line-clamp-2 text-[7px] font-bold text-slate-500">{copy}</p>
        <Btn label={cta} />
      </div>
      <img src={img} alt="" className="h-full w-full object-cover" />
    </div>
  );
}
