import React, { useMemo, useState } from "react";
import {
  Boxes,
  FileText,
  Image as ImageIcon,
  LayoutTemplate,
  Search,
  Upload,
  X,
} from "lucide-react";

import VisualLibraryCard from "./VisualLibraryCard";
import {
  CATEGORY_LABELS,
  TAB_LABELS,
  getLibraryCategories,
  searchVisualLibrary,
} from "./libraryRegistry";
import type {
  VisualLibraryCategory,
  VisualLibraryEntry,
  VisualLibraryTab,
} from "./visualLibraryTypes";

type VisualLibraryPanelProps = {
  editor: any;
  open: boolean;
  onClose: () => void;
};

const TAB_ICONS: Record<VisualLibraryTab, React.ReactNode> = {
  elements: <Boxes className="h-4 w-4" />,
  sections: <LayoutTemplate className="h-4 w-4" />,
  pages: <FileText className="h-4 w-4" />,
  media: <ImageIcon className="h-4 w-4" />,
};

function addEntry(editor: any, entry: VisualLibraryEntry) {
  if (entry.tab === "elements") {
    return editor?.addLibraryItem?.(entry);
  }

  if (entry.tab === "sections") {
    return editor?.addLibrarySection?.(entry);
  }

  if (entry.tab === "pages") {
    return editor?.addLibraryPage?.(entry);
  }

  return editor?.addLibraryMedia?.(entry);
}

export default function VisualLibraryPanel({
  editor,
  open,
  onClose,
}: VisualLibraryPanelProps) {
  const [tab, setTab] =
    useState<VisualLibraryTab>("elements");
  const [category, setCategory] = useState<
    VisualLibraryCategory | "all"
  >("all");
  const [query, setQuery] = useState("");

  const categories = useMemo(
    () => getLibraryCategories(tab),
    [tab],
  );

  const entries = useMemo(
    () =>
      searchVisualLibrary({
        tab,
        category,
        query,
      }),
    [tab, category, query],
  );

  if (!open) return null;

  const handleTabChange = (nextTab: VisualLibraryTab) => {
    setTab(nextTab);
    setCategory("all");
    setQuery("");
  };

  const handleAdd = async (entry: VisualLibraryEntry) => {
    await addEntry(editor, entry);

    /*
      באלמנטים ומדיה משאירים את הפאנל פתוח כדי להוסיף כמה
      פריטים ברצף. בעמודים סוגרים כדי לעבור לעמוד החדש.
    */
    if (entry.tab === "pages") {
      onClose();
    }
  };

  return (
    <div
      data-editor-only="true"
      data-bizuply-editor-only="true"
      className="fixed inset-x-4 bottom-4 top-[88px] z-[2147483250] overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-[0_35px_110px_rgba(15,23,42,.28)]"
      dir="rtl"
    >
      <div className="flex h-full min-h-0 flex-col">
        <header className="flex h-20 shrink-0 items-center justify-between border-b border-slate-200 px-5">
          <div>
            <h2 className="text-xl font-black text-slate-950">
              ספריית העיצוב
            </h2>
            <p className="mt-1 text-xs font-bold text-slate-500">
              אלמנטים, סקשנים, עמודים ומדיה מוכנים לעריכה
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => editor?.addImage?.()}
              className="inline-flex h-11 items-center gap-2 rounded-2xl border border-violet-200 bg-violet-50 px-4 text-sm font-black text-violet-700 transition hover:bg-violet-100"
            >
              <Upload className="h-4 w-4" />
              העלאת מדיה
            </button>

            <button
              type="button"
              onClick={onClose}
              className="flex h-11 w-11 items-center justify-center rounded-2xl text-slate-500 transition hover:bg-slate-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </header>

        <div className="flex h-16 shrink-0 items-center gap-2 border-b border-slate-200 px-5">
          {(Object.keys(TAB_LABELS) as VisualLibraryTab[]).map(
            (item) => (
              <button
                key={item}
                type="button"
                onClick={() => handleTabChange(item)}
                className={[
                  "inline-flex h-11 items-center gap-2 rounded-2xl px-4 text-sm font-black transition",
                  tab === item
                    ? "bg-slate-950 text-white shadow-lg"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200",
                ].join(" ")}
              >
                {TAB_ICONS[item]}
                {TAB_LABELS[item]}
              </button>
            ),
          )}

          <label className="mr-auto flex h-11 w-[360px] max-w-[35vw] items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4">
            <Search className="h-4 w-4 shrink-0 text-slate-400" />
            <input
              value={query}
              onChange={(event) =>
                setQuery(event.target.value)
              }
              placeholder="חיפוש בספרייה..."
              className="min-w-0 flex-1 bg-transparent text-sm font-bold text-slate-800 outline-none placeholder:text-slate-400"
            />
          </label>
        </div>

        <div className="flex min-h-0 flex-1">
          <aside className="w-56 shrink-0 overflow-y-auto border-l border-slate-200 bg-slate-50 p-3">
            <button
              type="button"
              onClick={() => setCategory("all")}
              className={[
                "mb-1 flex w-full items-center rounded-2xl px-4 py-3 text-right text-sm font-black transition",
                category === "all"
                  ? "bg-white text-violet-700 shadow-sm"
                  : "text-slate-600 hover:bg-white",
              ].join(" ")}
            >
              הכול
            </button>

            {categories.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setCategory(item)}
                className={[
                  "mb-1 flex w-full items-center rounded-2xl px-4 py-3 text-right text-sm font-black transition",
                  category === item
                    ? "bg-white text-violet-700 shadow-sm"
                    : "text-slate-600 hover:bg-white",
                ].join(" ")}
              >
                {CATEGORY_LABELS[item]}
              </button>
            ))}
          </aside>

          <section className="min-h-0 flex-1 overflow-y-auto bg-[#f8fafc] p-5">
            <div className="mb-4 flex items-end justify-between">
              <div>
                <h3 className="text-lg font-black text-slate-950">
                  {category === "all"
                    ? TAB_LABELS[tab]
                    : CATEGORY_LABELS[category]}
                </h3>
                <p className="mt-1 text-xs font-bold text-slate-500">
                  {entries.length} פריטים זמינים
                </p>
              </div>
            </div>

            {entries.length ? (
              <div className="grid grid-cols-2 gap-4 xl:grid-cols-3 2xl:grid-cols-4">
                {entries.map((entry) => (
                  <VisualLibraryCard
                    key={entry.id}
                    entry={entry}
                    onAdd={() => void handleAdd(entry)}
                  />
                ))}
              </div>
            ) : (
              <div className="flex min-h-[320px] items-center justify-center">
                <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-10 py-12 text-center">
                  <Search className="mx-auto h-8 w-8 text-slate-300" />
                  <p className="mt-4 text-sm font-black text-slate-700">
                    לא נמצאו תוצאות
                  </p>
                  <p className="mt-1 text-xs font-bold text-slate-400">
                    נסו מילת חיפוש אחרת או קטגוריה אחרת
                  </p>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
