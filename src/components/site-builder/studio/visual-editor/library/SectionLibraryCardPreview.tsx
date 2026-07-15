import type { VisualLibrarySectionTemplate } from "./visualLibraryTypes";

type PreviewLayout =
  | "hero-split"
  | "hero-center"
  | "about-split"
  | "cards-3"
  | "cards-4"
  | "list"
  | "contact"
  | "products"
  | "pricing"
  | "cta"
  | "reviews"
  | "events"
  | "blog"
  | "resume"
  | "stats"
  | "promote"
  | "features"
  | "generic";

function inferLayout(section: VisualLibrarySectionTemplate): PreviewLayout {
  const id = section.id;
  if (id.includes("center") || id.includes("warm") && id.includes("hero")) {
    return "hero-center";
  }
  if (section.category === "hero") return "hero-split";
  if (section.category === "about" || section.category === "resume") {
    return id.includes("skills") ? "list" : "about-split";
  }
  if (section.category === "contact") return "contact";
  if (section.category === "commerce") return "products";
  if (section.category === "pricing") return "pricing";
  if (section.category === "cta") return "cta";
  if (section.category === "testimonials") return "reviews";
  if (section.category === "events") return "events";
  if (section.category === "blog") return "blog";
  if (section.category === "promote") return "promote";
  if (section.category === "features") {
    return id.includes("expertise") || id.includes("split")
      ? "about-split"
      : "features";
  }
  if (section.category === "stats") return "stats";
  if (section.category === "services") {
    if (id.includes("list")) return "list";
    if (id.includes("four")) return "cards-4";
    return "cards-3";
  }
  if (
    section.category === "portfolio" ||
    section.category === "gallery" ||
    section.category === "team"
  ) {
    return "cards-3";
  }
  if (section.category === "faq" || section.category === "footer") return "list";
  return "generic";
}

function MiniLines({
  count = 3,
  tone = "dark",
}: {
  count?: number;
  tone?: "dark" | "muted" | "light";
}) {
  const color =
    tone === "light"
      ? "bg-white/70"
      : tone === "muted"
        ? "bg-slate-300"
        : "bg-slate-900";
  return (
    <div className="space-y-1.5">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={[
            "h-1.5 rounded-full",
            color,
            index === 0 ? "w-4/5" : index === 1 ? "w-full" : "w-3/5",
          ].join(" ")}
        />
      ))}
    </div>
  );
}

function MediaBlock({
  src,
  className = "",
}: {
  src?: string;
  className?: string;
}) {
  if (src) {
    return (
      <div className={`overflow-hidden ${className}`}>
        <img src={src} alt="" className="h-full w-full object-cover" />
      </div>
    );
  }
  return (
    <div
      className={`bg-gradient-to-br from-violet-200 via-sky-100 to-emerald-100 ${className}`}
    />
  );
}

/**
 * Wix-like miniature section preview for the Add Section library grid.
 */
export default function SectionLibraryCardPreview({
  section,
}: {
  section: VisualLibrarySectionTemplate;
}) {
  const layout = inferLayout(section);
  const bg = section.backgroundColor || "#ffffff";
  const thumb = section.thumbnail;

  if (layout === "hero-split") {
    return (
      <div
        className="grid h-full grid-cols-[1.05fr_0.95fr] gap-3 p-3"
        style={{ backgroundColor: bg }}
      >
        <div className="flex flex-col justify-center gap-2 pr-1">
          <div className="h-2 w-16 rounded-full bg-violet-200" />
          <div className="h-2.5 w-11/12 rounded-full bg-slate-950" />
          <div className="h-2.5 w-8/12 rounded-full bg-slate-950" />
          <MiniLines count={2} tone="muted" />
          <div className="mt-1 flex gap-1.5">
            <div className="h-5 w-12 rounded-full bg-violet-600" />
            <div className="h-5 w-12 rounded-full border border-slate-200 bg-white" />
          </div>
        </div>
        <MediaBlock src={thumb} className="h-full rounded-xl" />
      </div>
    );
  }

  if (layout === "hero-center") {
    return (
      <div
        className="relative flex h-full flex-col items-center justify-center gap-2 overflow-hidden p-4"
        style={{ backgroundColor: bg === "#ffffff" ? "#0f172a" : bg }}
      >
        {thumb ? (
          <img
            src={thumb}
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-35"
          />
        ) : null}
        <div className="relative z-[1] flex w-full flex-col items-center gap-2">
          <div className="h-2 w-20 rounded-full bg-violet-300/80" />
          <div className="h-2.5 w-2/3 rounded-full bg-white" />
          <div className="h-2 w-1/2 rounded-full bg-white/60" />
          <div className="mt-1 h-5 w-16 rounded-full bg-violet-500" />
        </div>
      </div>
    );
  }

  if (layout === "about-split") {
    return (
      <div
        className="grid h-full grid-cols-2 gap-3 p-3"
        style={{ backgroundColor: bg }}
      >
        <MediaBlock src={thumb} className="h-full rounded-xl" />
        <div className="flex flex-col justify-center gap-2">
          <div className="h-2 w-14 rounded-full bg-violet-300" />
          <div className="h-2.5 w-11/12 rounded-full bg-slate-950" />
          <MiniLines count={3} tone="muted" />
          <div className="mt-1 h-5 w-14 rounded-lg bg-slate-900" />
        </div>
      </div>
    );
  }

  if (layout === "cards-3" || layout === "cards-4") {
    const cols = layout === "cards-4" ? 4 : 3;
    return (
      <div className="flex h-full flex-col gap-2 p-3" style={{ backgroundColor: bg }}>
        <div className="mx-auto h-2.5 w-1/2 rounded-full bg-slate-950" />
        <div
          className="grid min-h-0 flex-1 gap-2"
          style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
        >
          {Array.from({ length: cols }).map((_, index) => (
            <div
              key={index}
              className="flex flex-col overflow-hidden rounded-lg border border-slate-200 bg-white"
            >
              <MediaBlock
                src={thumb}
                className="h-10 w-full"
              />
              <div className="space-y-1 p-1.5">
                <div className="h-1.5 w-4/5 rounded-full bg-slate-900" />
                <div className="h-1 w-full rounded-full bg-slate-200" />
                <div className="h-1 w-3/5 rounded-full bg-slate-200" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (layout === "list") {
    return (
      <div
        className="grid h-full grid-cols-[0.8fr_1.2fr] gap-3 p-3"
        style={{ backgroundColor: bg }}
      >
        <div className="flex flex-col justify-center">
          <div className="h-2.5 w-4/5 rounded-full bg-slate-950" />
        </div>
        <div className="flex flex-col justify-center gap-2">
          {[0, 1, 2].map((item) => (
            <div key={item} className="border-b border-slate-200 pb-1.5">
              <div className="h-1.5 w-1/2 rounded-full bg-slate-900" />
              <div className="mt-1 h-1 w-full rounded-full bg-slate-200" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (layout === "contact") {
    return (
      <div
        className="grid h-full grid-cols-2 gap-3 p-3"
        style={{ backgroundColor: bg }}
      >
        <div className="flex flex-col justify-center gap-2 rounded-xl border border-slate-200 bg-white p-2">
          <div className="h-2.5 w-3/4 rounded-full bg-slate-950" />
          <div className="h-4 rounded-md bg-slate-100" />
          <div className="h-4 rounded-md bg-slate-100" />
          <div className="h-8 rounded-md bg-slate-100" />
          <div className="h-5 w-16 rounded-full bg-violet-600" />
        </div>
        <MediaBlock src={thumb} className="h-full rounded-xl" />
      </div>
    );
  }

  if (layout === "products") {
    return (
      <div className="flex h-full flex-col gap-2 p-3" style={{ backgroundColor: bg }}>
        <div className="mx-auto h-2.5 w-2/5 rounded-full bg-slate-950" />
        <div className="grid min-h-0 flex-1 grid-cols-4 gap-1.5">
          {[0, 1, 2, 3].map((item) => (
            <div key={item} className="overflow-hidden rounded-lg bg-white shadow-sm">
              <MediaBlock src={thumb} className="h-12 w-full" />
              <div className="space-y-1 p-1">
                <div className="h-1.5 w-full rounded-full bg-slate-800" />
                <div className="h-1.5 w-1/2 rounded-full bg-violet-400" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (layout === "pricing") {
    return (
      <div className="flex h-full flex-col gap-2 p-3" style={{ backgroundColor: bg }}>
        <div className="mx-auto h-2.5 w-1/2 rounded-full bg-slate-950" />
        <div className="grid min-h-0 flex-1 grid-cols-3 gap-2">
          {[0, 1, 2].map((item) => (
            <div
              key={item}
              className={[
                "rounded-xl border p-2",
                item === 1
                  ? "border-transparent bg-slate-900"
                  : "border-slate-200 bg-white",
              ].join(" ")}
            >
              <div
                className={[
                  "h-1.5 w-1/2 rounded-full",
                  item === 1 ? "bg-violet-300" : "bg-slate-400",
                ].join(" ")}
              />
              <div
                className={[
                  "mt-2 h-3 w-2/3 rounded-full",
                  item === 1 ? "bg-white" : "bg-slate-900",
                ].join(" ")}
              />
              <div className="mt-2 space-y-1">
                <div
                  className={[
                    "h-1 w-full rounded-full",
                    item === 1 ? "bg-slate-600" : "bg-slate-200",
                  ].join(" ")}
                />
                <div
                  className={[
                    "h-1 w-4/5 rounded-full",
                    item === 1 ? "bg-slate-600" : "bg-slate-200",
                  ].join(" ")}
                />
              </div>
              <div
                className={[
                  "mt-2 h-4 w-full rounded-full",
                  item === 1 ? "bg-violet-500" : "bg-slate-900",
                ].join(" ")}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (layout === "cta") {
    return (
      <div
        className="flex h-full flex-col items-center justify-center gap-2 p-4"
        style={{ backgroundColor: bg === "#ffffff" ? "#0f172a" : bg }}
      >
        <div className="h-2.5 w-2/3 rounded-full bg-white" />
        <div className="h-1.5 w-1/2 rounded-full bg-white/50" />
        <div className="mt-1 h-5 w-20 rounded-full bg-violet-500" />
      </div>
    );
  }

  if (layout === "reviews") {
    return (
      <div className="flex h-full flex-col gap-2 p-3" style={{ backgroundColor: bg }}>
        <div className="mx-auto h-2.5 w-1/2 rounded-full bg-slate-950" />
        <div className="grid min-h-0 flex-1 grid-cols-3 gap-2">
          {[0, 1, 2].map((item) => (
            <div
              key={item}
              className="rounded-xl border border-slate-200 bg-white p-2"
            >
              <div className="h-1.5 w-12 rounded-full bg-amber-400" />
              <div className="mt-2 space-y-1">
                <div className="h-1 w-full rounded-full bg-slate-200" />
                <div className="h-1 w-4/5 rounded-full bg-slate-200" />
              </div>
              <div className="mt-2 h-1.5 w-1/2 rounded-full bg-slate-800" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (layout === "events" || layout === "blog") {
    return (
      <div className="flex h-full flex-col gap-2 p-3" style={{ backgroundColor: bg }}>
        <div className="h-2.5 w-2/5 rounded-full bg-slate-950" />
        <div className="grid min-h-0 flex-1 grid-cols-3 gap-2">
          {[0, 1, 2].map((item) => (
            <div key={item} className="overflow-hidden rounded-xl bg-white shadow-sm">
              <MediaBlock src={thumb} className="h-14 w-full" />
              <div className="space-y-1 p-1.5">
                <div className="h-1.5 w-full rounded-full bg-slate-900" />
                <div className="h-1 w-3/5 rounded-full bg-slate-300" />
                <div className="h-3.5 w-10 rounded-full bg-violet-600" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (layout === "promote") {
    return (
      <div
        className="grid h-full grid-cols-2 gap-3 p-3"
        style={{ backgroundColor: bg }}
      >
        <MediaBlock src={thumb} className="h-full rounded-xl" />
        <div className="flex flex-col justify-center gap-2">
          <div className="h-2.5 w-11/12 rounded-full bg-slate-950" />
          <MiniLines count={2} tone="muted" />
          <div className="mt-1 flex items-center gap-1">
            <div className="h-5 flex-1 rounded-full border border-slate-200 bg-white" />
            <div className="h-5 w-10 rounded-full bg-violet-600" />
          </div>
        </div>
      </div>
    );
  }

  if (layout === "features") {
    return (
      <div className="flex h-full flex-col gap-2 p-3" style={{ backgroundColor: bg }}>
        <div className="mx-auto h-2.5 w-1/2 rounded-full bg-slate-950" />
        <div className="grid min-h-0 flex-1 grid-cols-3 gap-2">
          {[0, 1, 2].map((item) => (
            <div key={item} className="rounded-xl bg-white p-2 shadow-sm">
              <div className="h-3 w-3 rounded-md bg-violet-200" />
              <div className="mt-2 h-1.5 w-4/5 rounded-full bg-slate-900" />
              <div className="mt-1 h-1 w-full rounded-full bg-slate-200" />
              <div className="mt-1 h-1 w-3/5 rounded-full bg-slate-200" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (layout === "stats") {
    return (
      <div
        className="grid h-full grid-cols-4 gap-2 p-4"
        style={{ backgroundColor: bg === "#ffffff" ? "#0f172a" : bg }}
      >
        {[0, 1, 2, 3].map((item) => (
          <div key={item} className="flex flex-col items-center justify-center gap-1">
            <div className="h-3 w-10 rounded-full bg-white" />
            <div className="h-1.5 w-12 rounded-full bg-white/40" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col gap-2 p-3" style={{ backgroundColor: bg }}>
      <div className="h-2.5 w-1/2 rounded-full bg-slate-950" />
      <MiniLines count={2} tone="muted" />
      <div className="grid min-h-0 flex-1 grid-cols-3 gap-2">
        <MediaBlock src={thumb} className="rounded-xl" />
        <MediaBlock className="rounded-xl" />
        <MediaBlock className="rounded-xl" />
      </div>
    </div>
  );
}
