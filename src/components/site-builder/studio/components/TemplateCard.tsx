import React from "react";
import type { ReadyWebsiteTemplate } from "../data/readyWebsiteTypes";

type TemplateCardProps = {
  template: ReadyWebsiteTemplate;
  onApply: () => void;
};

export default function TemplateCard({ template, onApply }: TemplateCardProps) {
  return (
    <article className="group overflow-hidden rounded-[26px] border border-slate-200 bg-white text-right shadow-sm transition duration-300 hover:-translate-y-1 hover:border-sky-300 hover:shadow-[0_28px_80px_rgba(15,23,42,0.16)]">
      <MiniWebsitePreview template={template} />

      <div className="p-4">
        <div className="mb-3 flex items-center justify-between gap-2">
          <span className="inline-flex h-7 items-center rounded-full bg-sky-50 px-3 text-[11px] font-black text-sky-700">
            {template.niche}
          </span>

          <span className="inline-flex h-7 items-center rounded-full bg-emerald-50 px-3 text-[11px] font-black text-emerald-700">
            {template.blocks.length} בלוקים
          </span>
        </div>

        <h3 className="truncate text-sm font-black text-slate-950">
          {template.name}
        </h3>

        <p className="mt-1 line-clamp-2 min-h-[40px] text-[11px] font-bold leading-5 text-slate-500">
          {template.description}
        </p>

        <div className="mt-3 grid grid-cols-2 gap-2">
          <InfoPill label="קטגוריה" value={template.category} />
          <InfoPill label="מבנה" value={template.layout} />
        </div>

        <button
          type="button"
          onClick={onApply}
          className="mt-4 inline-flex h-11 w-full items-center justify-center rounded-2xl bg-slate-950 px-4 text-xs font-black text-white transition hover:bg-sky-600"
        >
          החל אתר מוכן
        </button>
      </div>
    </article>
  );
}

function MiniWebsitePreview({ template }: { template: ReadyWebsiteTemplate }) {
  return (
    <div className="relative h-[250px] overflow-hidden rounded-t-[26px] border-b border-slate-200 bg-slate-100">
      <div className="absolute left-3 top-3 z-20 rounded-full bg-white/95 px-3 py-1 text-[10px] font-black text-sky-700 shadow-sm">
        תצוגה חיה
      </div>

      <div className="absolute right-3 top-3 z-20 rounded-full bg-white/95 px-3 py-1 text-[10px] font-black text-slate-700 shadow-sm">
        {template.blocks.length} סקשנים
      </div>

      <div className="absolute inset-x-0 bottom-0 z-20 h-16 bg-gradient-to-t from-white to-transparent" />

      <div
        className="pointer-events-none absolute right-0 top-0 origin-top-right"
        style={{
          width: "1120px",
          minHeight: "1600px",
          transform: "scale(0.223)",
        }}
        dangerouslySetInnerHTML={{ __html: template.html }}
      />
    </div>
  );
}

function InfoPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 rounded-2xl bg-slate-50 px-3 py-2">
      <p className="text-[9px] font-black text-slate-400">{label}</p>
      <p className="truncate text-[11px] font-black text-slate-700">{value}</p>
    </div>
  );
}