import React from "react";
import {
  FileText,
  Image as ImageIcon,
  LayoutTemplate,
  Plus,
  Sparkles,
} from "lucide-react";

import type { VisualLibraryEntry } from "./visualLibraryTypes";

type VisualLibraryCardProps = {
  entry: VisualLibraryEntry;
  onAdd: () => void;
};

function getFallbackIcon(entry: VisualLibraryEntry) {
  if (entry.tab === "pages") {
    return <FileText className="h-8 w-8" />;
  }

  if (entry.tab === "sections") {
    return <LayoutTemplate className="h-8 w-8" />;
  }

  if (entry.tab === "media") {
    return <ImageIcon className="h-8 w-8" />;
  }

  return <Sparkles className="h-8 w-8" />;
}

export default function VisualLibraryCard({
  entry,
  onAdd,
}: VisualLibraryCardProps) {
  const thumbnail =
    "thumbnail" in entry ? String(entry.thumbnail || "") : "";

  const previewHtml =
    "previewHtml" in entry
      ? String(entry.previewHtml || "")
      : "";

  return (
    <button
      type="button"
      onClick={onAdd}
      className="group overflow-hidden rounded-3xl border border-slate-200 bg-white text-right shadow-sm transition hover:-translate-y-0.5 hover:border-violet-300 hover:shadow-xl"
    >
      <div className="relative flex h-44 items-center justify-center overflow-hidden bg-slate-50 p-4">
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={entry.title}
            className="h-full w-full rounded-2xl object-cover transition duration-300 group-hover:scale-[1.03]"
          />
        ) : previewHtml ? (
          <div
            className="w-full rounded-2xl bg-white p-4 shadow-sm"
            dangerouslySetInnerHTML={{
              __html: previewHtml,
            }}
          />
        ) : (
          <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-violet-100 text-violet-700">
            {getFallbackIcon(entry)}
          </div>
        )}

        <span className="absolute left-3 top-3 inline-flex h-9 items-center gap-1 rounded-full bg-white/95 px-3 text-xs font-black text-violet-700 opacity-0 shadow-lg transition group-hover:opacity-100">
          <Plus className="h-3.5 w-3.5" />
          הוספה
        </span>
      </div>

      <div className="p-4">
        <h3 className="text-sm font-black text-slate-950">
          {entry.title}
        </h3>
        <p className="mt-1 line-clamp-2 text-xs font-bold leading-5 text-slate-500">
          {entry.description}
        </p>
      </div>
    </button>
  );
}
