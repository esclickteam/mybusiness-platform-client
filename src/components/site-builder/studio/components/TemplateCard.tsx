import React from "react";
import type {
  ReadyWebsiteBlock,
  ReadyWebsiteTemplate,
} from "../data/readyWebsiteTypes";

type TemplateCardProps = {
  template: ReadyWebsiteTemplate;
  onApply: () => void;
};

type PreviewTone =
  | "dark"
  | "beauty"
  | "clinic"
  | "food"
  | "green"
  | "gold"
  | "purple"
  | "sky"
  | "neutral";

const imagePool = [
  "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=900&q=80",
];

export default function TemplateCard({
  template,
  onApply,
}: TemplateCardProps) {
  const tone = getTone(template);

  return (
    <article className="group overflow-hidden rounded-[30px] border border-slate-200 bg-white text-right shadow-[0_20px_60px_rgba(15,23,42,0.08)] transition duration-300 hover:-translate-y-1 hover:border-violet-200 hover:shadow-[0_34px_90px_rgba(15,23,42,0.15)]">
      <TemplateMiniPreview template={template} tone={tone} />

      <div className="p-5">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <Badge tone={tone}>{template.niche}</Badge>
          <Badge tone="neutral">{template.blocks.length} בלוקים</Badge>
          <Badge tone="sky">{template.layout}</Badge>
        </div>

        <h3 className="text-[22px] font-black leading-tight tracking-[-0.04em] text-slate-950">
          {template.name}
        </h3>

        <p className="mt-2 min-h-[48px] text-[14px] font-bold leading-6 text-slate-600">
          {template.description}
        </p>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <InfoPill label="קטגוריה" value={template.category} />
          <InfoPill label="מבנה" value={template.layout} />
        </div>

        <div className="mt-4 flex items-center gap-2">
          <button
            type="button"
            onClick={onApply}
            className="inline-flex h-12 flex-1 items-center justify-center rounded-[20px] bg-gradient-to-r from-slate-950 via-slate-900 to-violet-700 px-4 text-[15px] font-black text-white shadow-[0_16px_38px_rgba(15,23,42,0.20)] transition hover:scale-[1.01] hover:from-violet-700 hover:to-fuchsia-600"
          >
            החל אתר מוכן
          </button>

          <div className="hidden h-12 items-center justify-center rounded-[20px] border border-slate-200 bg-slate-50 px-4 text-[13px] font-black text-slate-700 xl:inline-flex">
            Preview
          </div>
        </div>
      </div>
    </article>
  );
}

function TemplateMiniPreview({
  template,
  tone,
}: {
  template: ReadyWebsiteTemplate;
  tone: PreviewTone;
}) {
  const mode = getPreviewMode(template);
  const shellClass = getShellClass(tone);

  return (
    <div className="overflow-hidden border-b border-slate-200 bg-slate-100">
      <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-rose-400" />
          <span className="h-3 w-3 rounded-full bg-amber-400" />
          <span className="h-3 w-3 rounded-full bg-emerald-400" />
        </div>

        <div className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-black text-slate-700">
          תצוגת תבנית
        </div>
      </div>

      <div className={["relative h-[340px] overflow-hidden p-4", shellClass].join(" ")}>
        <div className="absolute left-4 top-4 z-20 rounded-full bg-white/95 px-3 py-1 text-[11px] font-black text-violet-700 shadow-sm">
          Live Preview
        </div>

        <div className="absolute right-4 top-4 z-20 rounded-full bg-white/95 px-3 py-1 text-[11px] font-black text-slate-800 shadow-sm">
          {template.blocks.length} סקשנים
        </div>

        <div className="absolute inset-x-4 top-[58px] overflow-hidden rounded-[26px] border border-white/70 bg-white shadow-[0_28px_90px_rgba(15,23,42,0.16)]">
          <MiniBrowserHeader />

          {mode === "food" && <FoodPreview template={template} />}
          {mode === "portfolio" && <PortfolioPreview template={template} tone={tone} />}
          {mode === "store" && <StorePreview template={template} tone={tone} />}
          {mode === "clinic" && <ClinicPreview template={template} tone={tone} />}
          {mode === "dark" && <DarkPreview template={template} />}
          {mode === "offer" && <OfferPreview template={template} tone={tone} />}
          {mode === "editorial" && <EditorialPreview template={template} tone={tone} />}
          {mode === "dashboard" && <DashboardPreview template={template} tone={tone} />}
          {mode === "split" && <SplitPreview template={template} tone={tone} />}
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white via-white/75 to-transparent" />
      </div>
    </div>
  );
}

function getPreviewMode(
  template: ReadyWebsiteTemplate
):
  | "food"
  | "portfolio"
  | "store"
  | "clinic"
  | "dark"
  | "offer"
  | "editorial"
  | "dashboard"
  | "split" {
  const key = `${template.category} ${template.layout} ${template.niche}`.toLowerCase();

  if (
    key.includes("restaurant") ||
    key.includes("food") ||
    key.includes("catering") ||
    key.includes("menu")
  ) {
    return "food";
  }

  if (
    key.includes("portfolio") ||
    key.includes("photo") ||
    key.includes("masonry") ||
    key.includes("photographer")
  ) {
    return "portfolio";
  }

  if (
    key.includes("store") ||
    key.includes("catalog") ||
    key.includes("fashion") ||
    key.includes("jewelry")
  ) {
    return "store";
  }

  if (
    key.includes("clinic") ||
    key.includes("dental") ||
    key.includes("calendar")
  ) {
    return "clinic";
  }

  if (
    key.includes("dark") ||
    key.includes("barber") ||
    key.includes("tattoo") ||
    key.includes("auto")
  ) {
    return "dark";
  }

  if (
    key.includes("offer") ||
    key.includes("course") ||
    key.includes("club") ||
    key.includes("saas")
  ) {
    return "offer";
  }

  if (
    key.includes("editorial") ||
    key.includes("magazine") ||
    key.includes("minimal")
  ) {
    return "editorial";
  }

  if (
    key.includes("dashboard") ||
    key.includes("agency") ||
    key.includes("business") ||
    key.includes("tech")
  ) {
    return "dashboard";
  }

  return "split";
}

function getTone(template: ReadyWebsiteTemplate): PreviewTone {
  const key = `${template.category} ${template.layout} ${template.niche}`.toLowerCase();

  if (
    key.includes("dark") ||
    key.includes("barber") ||
    key.includes("tattoo") ||
    key.includes("auto")
  ) {
    return "dark";
  }

  if (
    key.includes("beauty") ||
    key.includes("makeup") ||
    key.includes("spa")
  ) {
    return "beauty";
  }

  if (
    key.includes("clinic") ||
    key.includes("dental") ||
    key.includes("health")
  ) {
    return "clinic";
  }

  if (
    key.includes("food") ||
    key.includes("restaurant") ||
    key.includes("catering")
  ) {
    return "food";
  }

  if (
    key.includes("fitness") ||
    key.includes("garden") ||
    key.includes("organic") ||
    key.includes("yoga")
  ) {
    return "green";
  }

  if (
    key.includes("law") ||
    key.includes("legal") ||
    key.includes("luxury") ||
    key.includes("jewelry") ||
    key.includes("gold") ||
    key.includes("hotel")
  ) {
    return "gold";
  }

  if (
    key.includes("agency") ||
    key.includes("course") ||
    key.includes("club") ||
    key.includes("saas") ||
    key.includes("coaching")
  ) {
    return "purple";
  }

  if (
    key.includes("realestate") ||
    key.includes("service") ||
    key.includes("cleaning") ||
    key.includes("electrician") ||
    key.includes("plumber")
  ) {
    return "sky";
  }

  return "neutral";
}

function getShellClass(tone: PreviewTone) {
  const map: Record<PreviewTone, string> = {
    dark: "bg-gradient-to-br from-slate-950 via-slate-900 to-black",
    beauty: "bg-gradient-to-br from-rose-50 via-white to-pink-100",
    clinic: "bg-gradient-to-br from-teal-50 via-white to-cyan-100",
    food: "bg-gradient-to-br from-orange-50 via-white to-amber-100",
    green: "bg-gradient-to-br from-lime-50 via-white to-green-100",
    gold: "bg-gradient-to-br from-amber-50 via-white to-yellow-100",
    purple: "bg-gradient-to-br from-violet-50 via-white to-fuchsia-100",
    sky: "bg-gradient-to-br from-sky-50 via-white to-blue-100",
    neutral: "bg-gradient-to-br from-slate-50 via-white to-slate-100",
  };

  return map[tone];
}

function getAccentClass(tone: PreviewTone) {
  const map: Record<PreviewTone, string> = {
    dark: "bg-amber-400",
    beauty: "bg-rose-500",
    clinic: "bg-teal-500",
    food: "bg-orange-500",
    green: "bg-lime-500",
    gold: "bg-amber-500",
    purple: "bg-violet-500",
    sky: "bg-sky-500",
    neutral: "bg-slate-950",
  };

  return map[tone];
}

function getButtonClass(tone: PreviewTone) {
  const map: Record<PreviewTone, string> = {
    dark: "bg-amber-400 text-slate-950",
    beauty: "bg-rose-600 text-white",
    clinic: "bg-teal-600 text-white",
    food: "bg-orange-600 text-white",
    green: "bg-lime-600 text-white",
    gold: "bg-slate-950 text-white",
    purple: "bg-violet-600 text-white",
    sky: "bg-sky-600 text-white",
    neutral: "bg-slate-950 text-white",
  };

  return map[tone];
}

function getSoftClass(tone: PreviewTone) {
  const map: Record<PreviewTone, string> = {
    dark: "bg-white/10",
    beauty: "bg-rose-100",
    clinic: "bg-teal-100",
    food: "bg-orange-100",
    green: "bg-lime-100",
    gold: "bg-amber-100",
    purple: "bg-violet-100",
    sky: "bg-sky-100",
    neutral: "bg-slate-100",
  };

  return map[tone];
}

function getImage(template: ReadyWebsiteTemplate, index = 0) {
  return template.image || imagePool[index % imagePool.length];
}

function MiniBrowserHeader() {
  return (
    <div className="flex h-7 items-center justify-between border-b border-slate-200 bg-slate-50 px-3">
      <div className="flex items-center gap-1.5">
        <span className="h-2 w-2 rounded-full bg-rose-300" />
        <span className="h-2 w-2 rounded-full bg-amber-300" />
        <span className="h-2 w-2 rounded-full bg-emerald-300" />
      </div>

      <div className="h-2 w-28 rounded-full bg-slate-200" />
    </div>
  );
}

function MiniNav({
  tone,
  dark = false,
}: {
  tone: PreviewTone;
  dark?: boolean;
}) {
  return (
    <div
      className={[
        "flex items-center justify-between gap-3 px-4 py-3",
        dark ? "bg-slate-950 text-white" : "bg-white text-slate-950",
      ].join(" ")}
    >
      <div
        className={[
          "h-3 w-24 rounded-full",
          dark ? "bg-white" : "bg-slate-950",
        ].join(" ")}
      />

      <div className="flex items-center gap-1.5">
        {[1, 2, 3].map((item) => (
          <span
            key={item}
            className={[
              "h-2 rounded-full",
              item === 1 ? "w-9" : item === 2 ? "w-7" : "w-6",
              dark ? "bg-white/35" : "bg-slate-200",
            ].join(" ")}
          />
        ))}
      </div>

      <div className={["h-5 w-14 rounded-full", getAccentClass(tone)].join(" ")} />
    </div>
  );
}

function FoodPreview({ template }: { template: ReadyWebsiteTemplate }) {
  const tone: PreviewTone = "food";
  const image = getImage(template, 5);

  return (
    <div className="bg-orange-50">
      <MiniNav tone={tone} />

      <div className="grid grid-cols-[1fr_0.82fr] gap-3 p-4">
        <div className="rounded-[24px] bg-orange-950 p-4 text-white">
          <div className="mb-3 h-2 w-16 rounded-full bg-orange-300" />
          <div className="h-6 w-40 rounded-full bg-white" />
          <div className="mt-2 h-5 w-28 rounded-full bg-white/75" />
          <div className="mt-4 flex gap-2">
            <div className="h-7 w-20 rounded-full bg-orange-400" />
            <div className="h-7 w-16 rounded-full bg-white/15" />
          </div>
        </div>

        <div className="grid gap-2">
          <img src={image} alt="" className="h-24 rounded-[22px] object-cover" draggable={false} />

          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-2xl bg-white p-3 shadow-sm">
              <div className="h-2 w-10 rounded-full bg-orange-300" />
              <div className="mt-2 h-5 w-12 rounded-full bg-orange-800" />
            </div>
            <div className="rounded-2xl bg-orange-400 p-3">
              <div className="h-2 w-10 rounded-full bg-orange-100" />
              <div className="mt-2 h-5 w-12 rounded-full bg-orange-950" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 p-3 pt-0">
        {[1, 2, 3].map((item) => (
          <div key={item} className="rounded-2xl bg-white p-2 shadow-sm">
            <div className="h-10 rounded-xl bg-orange-100" />
            <div className="mt-2 h-2 w-12 rounded-full bg-orange-800" />
            <div className="mt-1 h-2 w-8 rounded-full bg-orange-200" />
          </div>
        ))}
      </div>
    </div>
  );
}

function PortfolioPreview({
  template,
  tone,
}: {
  template: ReadyWebsiteTemplate;
  tone: PreviewTone;
}) {
  return (
    <div className="bg-white">
      <MiniNav tone={tone} />

      <div className="p-4">
        <div className="mb-3 flex items-end justify-between gap-3">
          <div>
            <div className="h-6 w-48 rounded-full bg-slate-950" />
            <div className="mt-2 h-4 w-28 rounded-full bg-slate-200" />
          </div>
          <div className={["h-7 w-20 rounded-full", getButtonClass(tone)].join(" ")} />
        </div>

        <div className="grid auto-rows-[42px] grid-cols-4 gap-2">
          {Array.from({ length: 8 }).map((_, index) => (
            <img
              key={index}
              src={index === 0 ? getImage(template, index) : imagePool[(index + 2) % imagePool.length]}
              alt=""
              draggable={false}
              className={[
                "rounded-xl object-cover",
                index === 0 ? "col-span-2 row-span-2 h-full w-full" : "h-full w-full",
              ].join(" ")}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function StorePreview({
  template,
  tone,
}: {
  template: ReadyWebsiteTemplate;
  tone: PreviewTone;
}) {
  return (
    <div className="bg-rose-50">
      <MiniNav tone={tone} />

      <div className="grid grid-cols-[0.82fr_1.18fr] gap-3 p-4">
        <div>
          <div className={["mb-2 h-2 w-16 rounded-full", getAccentClass(tone)].join(" ")} />
          <div className="h-6 w-36 rounded-full bg-slate-950" />
          <div className="mt-2 h-5 w-24 rounded-full bg-slate-300" />
          <div className={["mt-4 h-7 w-20 rounded-full", getButtonClass(tone)].join(" ")} />
        </div>

        <div className="grid gap-2">
          <img src={getImage(template, 9)} alt="" className="h-24 rounded-[22px] object-cover" draggable={false} />
          <div className="grid grid-cols-2 gap-2">
            {[1, 2].map((item) => (
              <div key={item} className="rounded-2xl bg-white p-2 shadow-sm">
                <div className={["h-8 rounded-xl", getSoftClass(tone)].join(" ")} />
                <div className="mt-1 h-2 w-10 rounded-full bg-slate-300" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 p-3 pt-0">
        {[1, 2, 3].map((item) => (
          <div key={item} className="rounded-2xl bg-white p-2 shadow-sm">
            <div className={["h-9 rounded-xl", getSoftClass(tone)].join(" ")} />
            <div className="mt-2 h-2 w-10 rounded-full bg-slate-300" />
            <div className={["mt-1 h-3 w-8 rounded-full", getAccentClass(tone)].join(" ")} />
          </div>
        ))}
      </div>
    </div>
  );
}

function ClinicPreview({
  template,
  tone,
}: {
  template: ReadyWebsiteTemplate;
  tone: PreviewTone;
}) {
  return (
    <div className="bg-teal-50">
      <MiniNav tone={tone} />

      <div className="grid grid-cols-[0.9fr_1.1fr] gap-3 p-4">
        <div className="flex flex-col justify-center">
          <div className={["mb-2 h-2 w-16 rounded-full", getAccentClass(tone)].join(" ")} />
          <div className="h-6 w-40 rounded-full bg-teal-950" />
          <div className="mt-2 h-5 w-28 rounded-full bg-teal-200" />
          <div className={["mt-4 h-7 w-20 rounded-full", getButtonClass(tone)].join(" ")} />
        </div>

        <div className="rounded-[22px] bg-white p-3 shadow-sm ring-1 ring-teal-100">
          <div className="mb-3 flex justify-between">
            <div className="h-3 w-20 rounded-full bg-teal-950" />
            <div className="h-3 w-10 rounded-full bg-teal-200" />
          </div>

          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: 14 }).map((_, index) => (
              <span
                key={index}
                className={[
                  "h-4 rounded-full",
                  [2, 5, 9].includes(index) ? "bg-teal-600" : "bg-teal-100",
                ].join(" ")}
              />
            ))}
          </div>

          <div className="mt-3 grid grid-cols-3 gap-1">
            {[1, 2, 3].map((item) => (
              <span key={item} className="h-5 rounded-full bg-teal-100" />
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 p-3 pt-0">
        {[1, 2, 3].map((item) => (
          <div key={item} className="rounded-2xl bg-white p-2 shadow-sm">
            <div className="h-5 w-5 rounded-lg bg-teal-500" />
            <div className="mt-2 h-2 w-12 rounded-full bg-slate-300" />
          </div>
        ))}
      </div>
    </div>
  );
}

function DarkPreview({ template }: { template: ReadyWebsiteTemplate }) {
  return (
    <div className="bg-slate-950 text-white">
      <MiniNav tone="dark" dark />

      <div className="grid grid-cols-[0.9fr_1.1fr] gap-3 p-4">
        <div className="flex flex-col justify-center">
          <div className="mb-2 h-2 w-16 rounded-full bg-amber-400" />
          <div className="h-6 w-40 rounded-full bg-white" />
          <div className="mt-2 h-5 w-28 rounded-full bg-white/40" />
          <div className="mt-4 flex gap-2">
            <div className="h-7 w-20 rounded-full bg-amber-400" />
            <div className="h-7 w-16 rounded-full bg-white/10" />
          </div>
        </div>

        <img src={getImage(template, 1)} alt="" className="h-32 rounded-[24px] object-cover" draggable={false} />
      </div>

      <div className="grid grid-cols-3 gap-2 p-3 pt-0">
        {[1, 2, 3].map((item) => (
          <div key={item} className="rounded-2xl bg-white/10 p-2 ring-1 ring-white/10">
            <div className="h-5 w-5 rounded-lg bg-amber-400" />
            <div className="mt-2 h-2 w-12 rounded-full bg-white/30" />
            <div className="mt-1 h-2 w-8 rounded-full bg-white/10" />
          </div>
        ))}
      </div>
    </div>
  );
}

function OfferPreview({
  template,
  tone,
}: {
  template: ReadyWebsiteTemplate;
  tone: PreviewTone;
}) {
  return (
    <div className="bg-violet-50">
      <MiniNav tone={tone} />

      <div className="grid grid-cols-[1fr_0.74fr] gap-3 p-4">
        <div>
          <div className={["mb-2 h-2 w-16 rounded-full", getAccentClass(tone)].join(" ")} />
          <div className="h-6 w-40 rounded-full bg-slate-950" />
          <div className="mt-2 h-5 w-28 rounded-full bg-violet-200" />
          <div className={["mt-4 h-7 w-20 rounded-full", getButtonClass(tone)].join(" ")} />
        </div>

        <div className="rounded-[22px] bg-white p-3 shadow-sm">
          <div className="h-2 w-14 rounded-full bg-violet-300" />
          <div className="mt-3 h-8 w-20 rounded-full bg-violet-700" />
          <div className="mt-2 h-2 w-16 rounded-full bg-slate-200" />
          <div className="mt-3 h-6 rounded-full bg-slate-950" />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 p-3 pt-0">
        {[1, 2, 3].map((item) => (
          <div key={item} className="rounded-2xl bg-white p-2 shadow-sm">
            <div className={["h-5 w-5 rounded-lg", getAccentClass(tone)].join(" ")} />
            <div className="mt-2 h-2 w-12 rounded-full bg-slate-300" />
          </div>
        ))}
      </div>
    </div>
  );
}

function EditorialPreview({
  template,
  tone,
}: {
  template: ReadyWebsiteTemplate;
  tone: PreviewTone;
}) {
  return (
    <div className="bg-white">
      <MiniNav tone={tone} />

      <div className="grid grid-cols-[0.9fr_1.1fr] gap-3 p-4">
        <div className="rounded-[24px] bg-white p-4 shadow-sm ring-1 ring-slate-200">
          <div className={["mb-2 h-2 w-16 rounded-full", getAccentClass(tone)].join(" ")} />
          <div className="h-6 w-40 rounded-full bg-slate-950" />
          <div className="mt-2 h-5 w-28 rounded-full bg-slate-200" />
          <div className={["mt-4 h-7 w-20 rounded-full", getButtonClass(tone)].join(" ")} />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <img src={getImage(template, 0)} alt="" className="col-span-2 h-24 rounded-[22px] object-cover" draggable={false} />
          <div className="rounded-2xl bg-slate-950 p-3">
            <div className="h-5 w-8 rounded-full bg-white" />
            <div className="mt-2 h-2 w-12 rounded-full bg-white/30" />
          </div>
          <div className={["rounded-2xl p-3", getSoftClass(tone)].join(" ")}>
            <div className={["h-5 w-8 rounded-full", getAccentClass(tone)].join(" ")} />
            <div className="mt-2 h-2 w-12 rounded-full bg-white/60" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 p-3 pt-0">
        {[1, 2, 3].map((item) => (
          <div key={item} className="rounded-2xl bg-slate-50 p-2">
            <div className="h-2 w-12 rounded-full bg-slate-800" />
            <div className="mt-2 h-8 rounded-xl bg-white shadow-sm" />
          </div>
        ))}
      </div>
    </div>
  );
}

function DashboardPreview({
  template,
  tone,
}: {
  template: ReadyWebsiteTemplate;
  tone: PreviewTone;
}) {
  return (
    <div className="bg-slate-50">
      <MiniNav tone={tone} />

      <div className="grid grid-cols-[1fr_0.9fr] gap-3 p-4">
        <div className="flex flex-col justify-center">
          <div className={["mb-2 h-2 w-16 rounded-full", getAccentClass(tone)].join(" ")} />
          <div className="h-6 w-40 rounded-full bg-slate-950" />
          <div className="mt-2 h-5 w-28 rounded-full bg-slate-300" />
          <div className="mt-4 flex gap-2">
            <div className={["h-7 w-20 rounded-full", getButtonClass(tone)].join(" ")} />
            <div className="h-7 w-16 rounded-full bg-slate-200" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <MetricCard tone={tone} label="24/7" />
          <MetricCard tone={tone} label="98%" />
          <img src={getImage(template, 3)} alt="" className="col-span-2 h-20 rounded-2xl object-cover" draggable={false} />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 p-3 pt-0">
        {[1, 2, 3].map((item) => (
          <div key={item} className="rounded-2xl bg-white p-2 shadow-sm">
            <div className={["h-5 w-5 rounded-lg", getAccentClass(tone)].join(" ")} />
            <div className="mt-2 h-2 w-12 rounded-full bg-slate-300" />
            <div className="mt-1 h-2 w-8 rounded-full bg-slate-100" />
          </div>
        ))}
      </div>
    </div>
  );
}

function SplitPreview({
  template,
  tone,
}: {
  template: ReadyWebsiteTemplate;
  tone: PreviewTone;
}) {
  return (
    <div className="bg-white">
      <MiniNav tone={tone} />

      <div className="grid grid-cols-[1fr_0.92fr] gap-3 p-4">
        <div className="flex flex-col justify-center">
          <div className={["mb-2 h-2 w-16 rounded-full", getAccentClass(tone)].join(" ")} />
          <div className="h-6 w-40 rounded-full bg-slate-950" />
          <div className="mt-2 h-5 w-28 rounded-full bg-slate-300" />
          <div className={["mt-4 h-7 w-20 rounded-full", getButtonClass(tone)].join(" ")} />
        </div>

        <img src={getImage(template, 4)} alt="" draggable={false} className="h-28 rounded-[22px] object-cover shadow-sm" />
      </div>

      <div className="grid gap-2 p-3 pt-0">
        {template.blocks
          .filter((block) => !["header", "hero", "footer"].includes(block.type))
          .slice(0, 4)
          .map((block, index) => (
            <MiniSection
              key={`${block.id}-${block.type}-${index}`}
              block={block}
              index={index}
              tone={tone}
            />
          ))}
      </div>
    </div>
  );
}

function MetricCard({
  tone,
  label,
}: {
  tone: PreviewTone;
  label: string;
}) {
  return (
    <div className="rounded-2xl bg-white p-3 shadow-sm">
      <div className={["h-5 w-10 rounded-full", getButtonClass(tone)].join(" ")} />
      <div className="mt-3 h-2 w-12 rounded-full bg-slate-300" />
      <span className="sr-only">{label}</span>
    </div>
  );
}

function MiniSection({
  block,
  index,
  tone,
}: {
  block: ReadyWebsiteBlock;
  index: number;
  tone: PreviewTone;
}) {
  if (
    block.type === "gallery" ||
    block.type === "projects" ||
    block.type === "results"
  ) {
    return (
      <div className="rounded-[18px] bg-slate-50 p-2">
        <MiniTitle tone={tone} />
        <div className="mt-2 grid grid-cols-3 gap-1.5">
          {[0, 1, 2].map((item) => (
            <img
              key={item}
              src={imagePool[(index + item) % imagePool.length]}
              alt=""
              draggable={false}
              className="h-12 rounded-xl object-cover"
            />
          ))}
        </div>
      </div>
    );
  }

  if (block.type === "booking") {
    return (
      <div className="rounded-[18px] bg-white p-2 shadow-sm ring-1 ring-slate-200">
        <MiniTitle tone={tone} />
        <div className="mt-2 grid grid-cols-7 gap-1">
          {Array.from({ length: 7 }).map((_, item) => (
            <span
              key={item}
              className={[
                "h-4 rounded-full",
                item === 2 || item === 5
                  ? getAccentClass(tone)
                  : "bg-slate-200",
              ].join(" ")}
            />
          ))}
        </div>
      </div>
    );
  }

  if (block.type === "store") {
    return (
      <div className="rounded-[18px] bg-slate-50 p-2">
        <MiniTitle tone={tone} />
        <div className="mt-2 grid grid-cols-3 gap-1.5">
          {[1, 2, 3].map((item) => (
            <div key={item} className="rounded-xl bg-white p-1.5 shadow-sm">
              <div className={["h-8 rounded-lg", getSoftClass(tone)].join(" ")} />
              <div className="mt-1 h-1.5 w-9 rounded-full bg-slate-300" />
              <div className={["mt-1 h-2.5 w-7 rounded-full", getAccentClass(tone)].join(" ")} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (block.type === "lead" || block.type === "contact") {
    return (
      <div className={["grid grid-cols-[1fr_0.8fr] gap-2 rounded-[18px] p-2", getAccentClass(tone)].join(" ")}>
        <div>
          <div className="h-3 w-20 rounded-full bg-white" />
          <div className="mt-2 h-2 w-16 rounded-full bg-white/70" />
        </div>
        <div className="rounded-xl bg-white p-1.5">
          <div className="h-3 rounded-full bg-slate-100" />
          <div className="mt-1 h-3 rounded-full bg-slate-100" />
          <div className="mt-1 h-4 rounded-full bg-slate-950" />
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-[18px] bg-slate-50 p-2">
      <MiniTitle tone={tone} />
      <div className="mt-2 grid grid-cols-3 gap-1.5">
        {[1, 2, 3].map((item) => (
          <div key={item} className="rounded-xl bg-white p-2 shadow-sm">
            <div className={["h-5 w-5 rounded-lg", getAccentClass(tone)].join(" ")} />
            <div className="mt-2 h-2 w-12 rounded-full bg-slate-200" />
            <div className="mt-1 h-2 w-8 rounded-full bg-slate-100" />
          </div>
        ))}
      </div>
    </div>
  );
}

function MiniTitle({ tone }: { tone: PreviewTone }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <div className="h-3 w-24 rounded-full bg-slate-800" />
      <div className={["h-5 w-12 rounded-full", getAccentClass(tone)].join(" ")} />
    </div>
  );
}

function InfoPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[18px] border border-slate-200 bg-slate-50 px-3 py-2">
      <p className="text-[10px] font-black text-slate-500">{label}</p>
      <p className="mt-1 truncate text-[13px] font-black text-slate-900">
        {value}
      </p>
    </div>
  );
}

function Badge({
  children,
  tone,
}: {
  children: React.ReactNode;
  tone: PreviewTone;
}) {
  const toneClass: Record<PreviewTone, string> = {
    dark: "border-slate-700 bg-slate-900 text-white",
    beauty: "border-rose-200 bg-rose-50 text-rose-800",
    clinic: "border-teal-200 bg-teal-50 text-teal-800",
    food: "border-orange-200 bg-orange-50 text-orange-800",
    green: "border-lime-200 bg-lime-50 text-lime-800",
    gold: "border-amber-200 bg-amber-50 text-amber-800",
    purple: "border-violet-200 bg-violet-50 text-violet-800",
    sky: "border-sky-200 bg-sky-50 text-sky-800",
    neutral: "border-slate-200 bg-slate-100 text-slate-800",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-black ${toneClass[tone]}`}
    >
      {children}
    </span>
  );
}
