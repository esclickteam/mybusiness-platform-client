import React from "react";
import type {
  ReadyWebsiteBlock,
  ReadyWebsiteTemplate,
} from "../data/readyWebsiteTypes";

type TemplateCardProps = {
  template: ReadyWebsiteTemplate;
  onApply: () => void;
};

const imagePool = [
  "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80",
];

export default function TemplateCard({
  template,
  onApply,
}: TemplateCardProps) {
  return (
    <article className="group overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.08)] transition duration-300 hover:-translate-y-1 hover:border-violet-200 hover:shadow-[0_30px_90px_rgba(15,23,42,0.15)]">
      <TemplateMiniPreview template={template} />

      <div className="p-4">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <Badge tone="violet">{template.niche}</Badge>
          <Badge tone="emerald">{template.blocks.length} בלוקים</Badge>
          <Badge tone="slate">{template.layout}</Badge>
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

function TemplateMiniPreview({ template }: { template: ReadyWebsiteTemplate }) {
  const layout = template.layout.toLowerCase();
  const hero = template.blocks.find((block) => block.type === "hero");
  const mainBlocks = template.blocks.filter(
    (block) => !["header", "hero", "footer"].includes(block.type)
  );

  const isDark =
    layout.includes("dark") ||
    template.palette.primary === "#020617" ||
    template.palette.primary === "#111827";

  const previewBg = isDark
    ? "from-slate-950 via-slate-900 to-slate-800"
    : "from-slate-50 via-white to-slate-100";

  return (
    <div className="overflow-hidden border-b border-slate-200 bg-slate-100">
      <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-rose-400" />
          <span className="h-3 w-3 rounded-full bg-amber-400" />
          <span className="h-3 w-3 rounded-full bg-emerald-400" />
        </div>

        <div className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-black text-slate-700">
          תצוגת מבנה אמיתית
        </div>
      </div>

      <div
        className={[
          "relative h-[310px] overflow-hidden bg-gradient-to-b p-4",
          previewBg,
        ].join(" ")}
      >
        <div className="absolute left-4 top-4 z-20 rounded-full bg-white/95 px-3 py-1 text-[11px] font-black text-violet-700 shadow-sm">
          Live Preview
        </div>

        <div className="absolute right-4 top-4 z-20 rounded-full bg-white/95 px-3 py-1 text-[11px] font-black text-slate-800 shadow-sm">
          {template.blocks.length} סקשנים
        </div>

        <div className="absolute inset-x-4 top-[58px] overflow-hidden rounded-[24px] border border-white/70 bg-white shadow-[0_28px_90px_rgba(15,23,42,0.16)]">
          <MiniBrowserHeader />

          <div className={isDark ? "bg-slate-950 text-white" : "bg-white text-slate-950"}>
            <MiniHeader template={template} isDark={isDark} />

            <MiniHero
              template={template}
              block={hero}
              isDark={isDark}
              layout={layout}
            />

            <div className="grid gap-2 p-3">
              {mainBlocks.slice(0, 5).map((block, index) => (
                <MiniSection
                  key={`${block.id}-${block.type}-${index}`}
                  block={block}
                  index={index}
                  template={template}
                  isDark={isDark}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white via-white/75 to-transparent" />
      </div>
    </div>
  );
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

function MiniHeader({
  template,
  isDark,
}: {
  template: ReadyWebsiteTemplate;
  isDark: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3 px-4 py-3">
      <div
        className={[
          "h-3 w-24 rounded-full",
          isDark ? "bg-white/80" : "bg-slate-950",
        ].join(" ")}
      />

      <div className="flex items-center gap-1.5">
        {[1, 2, 3].map((item) => (
          <span
            key={item}
            className={[
              "h-2 rounded-full",
              item === 1 ? "w-9" : item === 2 ? "w-7" : "w-6",
              isDark ? "bg-white/35" : "bg-slate-200",
            ].join(" ")}
          />
        ))}
      </div>

      <div
        className="h-5 w-14 rounded-full"
        style={{ backgroundColor: template.palette.accent }}
      />
    </div>
  );
}

function MiniHero({
  template,
  block,
  isDark,
  layout,
}: {
  template: ReadyWebsiteTemplate;
  block?: ReadyWebsiteBlock;
  isDark: boolean;
  layout: string;
}) {
  const variant = block?.variant || "split";
  const image = block?.image || template.image || imagePool[0];

  if (variant.includes("fullscreen") || layout.includes("luxury")) {
    return (
      <div className="relative h-36 overflow-hidden">
        <img
          src={image}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          draggable={false}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/75 via-slate-950/30 to-transparent" />

        <div className="relative z-10 flex h-full flex-col justify-center px-5">
          <div className="mb-2 h-2 w-16 rounded-full bg-white/75" />
          <div className="h-5 w-44 rounded-full bg-white" />
          <div className="mt-2 h-5 w-32 rounded-full bg-white/85" />
          <div className="mt-4 flex gap-2">
            <div
              className="h-7 w-20 rounded-full"
              style={{ backgroundColor: template.palette.accent }}
            />
            <div className="h-7 w-16 rounded-full bg-white/85" />
          </div>
        </div>
      </div>
    );
  }

  if (variant.includes("cards") || layout.includes("dashboard")) {
    return (
      <div
        className={[
          "grid grid-cols-[1fr_0.9fr] gap-3 px-4 py-4",
          isDark ? "bg-slate-950" : "bg-white",
        ].join(" ")}
      >
        <div className="flex flex-col justify-center">
          <div
            className="mb-2 h-2 w-16 rounded-full"
            style={{ backgroundColor: template.palette.accent }}
          />
          <div
            className={[
              "h-5 w-40 rounded-full",
              isDark ? "bg-white" : "bg-slate-950",
            ].join(" ")}
          />
          <div
            className={[
              "mt-2 h-5 w-28 rounded-full",
              isDark ? "bg-white/75" : "bg-slate-300",
            ].join(" ")}
          />
          <div className="mt-4 flex gap-2">
            <div
              className="h-7 w-20 rounded-full"
              style={{ backgroundColor: template.palette.primary }}
            />
            <div
              className={[
                "h-7 w-16 rounded-full",
                isDark ? "bg-white/20" : "bg-slate-100",
              ].join(" ")}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-2xl bg-slate-100 p-3">
            <div
              className="h-5 w-10 rounded-full"
              style={{ backgroundColor: template.palette.primary }}
            />
            <div className="mt-3 h-2 w-12 rounded-full bg-slate-300" />
          </div>

          <div className="rounded-2xl bg-slate-100 p-3">
            <div
              className="h-5 w-10 rounded-full"
              style={{ backgroundColor: template.palette.accent }}
            />
            <div className="mt-3 h-2 w-12 rounded-full bg-slate-300" />
          </div>

          <img
            src={image}
            alt=""
            draggable={false}
            className="col-span-2 h-20 rounded-2xl object-cover"
          />
        </div>
      </div>
    );
  }

  if (variant.includes("offer") || layout.includes("offer")) {
    return (
      <div className="grid grid-cols-[1fr_0.72fr] gap-3 px-4 py-4">
        <div>
          <div
            className="mb-2 h-2 w-16 rounded-full"
            style={{ backgroundColor: template.palette.accent }}
          />
          <div className="h-5 w-40 rounded-full bg-slate-950" />
          <div className="mt-2 h-5 w-28 rounded-full bg-slate-300" />
          <div
            className="mt-4 h-7 w-20 rounded-full"
            style={{ backgroundColor: template.palette.primary }}
          />
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
          <div className="h-2 w-14 rounded-full bg-slate-300" />
          <div
            className="mt-3 h-7 w-20 rounded-full"
            style={{ backgroundColor: template.palette.accent }}
          />
          <div className="mt-2 h-2 w-16 rounded-full bg-slate-200" />
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-[1fr_0.92fr] gap-3 px-4 py-4">
      <div className="flex flex-col justify-center">
        <div
          className="mb-2 h-2 w-16 rounded-full"
          style={{ backgroundColor: template.palette.accent }}
        />
        <div className={["h-5 w-40 rounded-full", isDark ? "bg-white" : "bg-slate-950"].join(" ")} />
        <div className={["mt-2 h-5 w-28 rounded-full", isDark ? "bg-white/70" : "bg-slate-300"].join(" ")} />
        <div
          className="mt-4 h-7 w-20 rounded-full"
          style={{ backgroundColor: template.palette.primary }}
        />
      </div>

      <img
        src={image}
        alt=""
        draggable={false}
        className="h-28 rounded-[22px] object-cover shadow-sm"
      />
    </div>
  );
}

function MiniSection({
  block,
  index,
  template,
  isDark,
}: {
  block: ReadyWebsiteBlock;
  index: number;
  template: ReadyWebsiteTemplate;
  isDark: boolean;
}) {
  const tone =
    index % 4 === 0
      ? template.palette.primary
      : index % 4 === 1
      ? template.palette.accent
      : index % 4 === 2
      ? template.palette.secondary || template.palette.primary
      : "#94A3B8";

  if (block.type === "gallery" || block.type === "projects" || block.type === "results") {
    return (
      <div className="rounded-[18px] bg-slate-50 p-2">
        <MiniTitle color={tone} />
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
        <MiniTitle color={tone} />
        <div className="mt-2 grid grid-cols-7 gap-1">
          {Array.from({ length: 7 }).map((_, item) => (
            <span
              key={item}
              className="h-4 rounded-full"
              style={{
                backgroundColor: item === 2 || item === 5 ? tone : "#E2E8F0",
              }}
            />
          ))}
        </div>
        <div className="mt-2 flex gap-1">
          {[1, 2, 3].map((item) => (
            <span key={item} className="h-4 flex-1 rounded-full bg-slate-100" />
          ))}
        </div>
      </div>
    );
  }

  if (block.type === "store") {
    return (
      <div className="rounded-[18px] bg-slate-50 p-2">
        <MiniTitle color={tone} />
        <div className="mt-2 grid grid-cols-3 gap-1.5">
          {[1, 2, 3].map((item) => (
            <div key={item} className="rounded-xl bg-white p-1.5 shadow-sm">
              <div className="h-8 rounded-lg bg-slate-100" />
              <div className="mt-1 h-1.5 w-9 rounded-full bg-slate-300" />
              <div
                className="mt-1 h-2.5 w-7 rounded-full"
                style={{ backgroundColor: tone }}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (block.type === "lead" || block.type === "contact") {
    return (
      <div
        className="grid grid-cols-[1fr_0.8fr] gap-2 rounded-[18px] p-2"
        style={{ backgroundColor: tone }}
      >
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
    <div
      className={[
        "rounded-[18px] p-2",
        isDark ? "bg-white/10" : "bg-slate-50",
      ].join(" ")}
    >
      <MiniTitle color={tone} />
      <div className="mt-2 grid grid-cols-3 gap-1.5">
        {[1, 2, 3].map((item) => (
          <div key={item} className="rounded-xl bg-white p-2 shadow-sm">
            <div
              className="h-5 w-5 rounded-lg"
              style={{ backgroundColor: tone }}
            />
            <div className="mt-2 h-2 w-12 rounded-full bg-slate-200" />
            <div className="mt-1 h-2 w-8 rounded-full bg-slate-100" />
          </div>
        ))}
      </div>
    </div>
  );
}

function MiniTitle({ color }: { color: string }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <div className="h-3 w-24 rounded-full bg-slate-800" />
      <div
        className="h-5 w-12 rounded-full"
        style={{ backgroundColor: color }}
      />
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
  tone: "violet" | "emerald" | "slate";
}) {
  const toneClass =
    tone === "violet"
      ? "border-violet-200 bg-violet-50 text-violet-800"
      : tone === "emerald"
      ? "border-emerald-200 bg-emerald-50 text-emerald-800"
      : "border-slate-200 bg-slate-100 text-slate-800";

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-black ${toneClass}`}
    >
      {children}
    </span>
  );
}
