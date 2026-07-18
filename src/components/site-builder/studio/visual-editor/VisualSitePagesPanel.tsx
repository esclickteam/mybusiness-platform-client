import React, { useMemo, type ComponentType } from "react";
import { Home, Plus, X } from "lucide-react";

import SitePageCardPreview, {
  type VisualSitePageItem,
} from "./SitePageCardPreview";

export type { VisualSitePageItem };

type VisualSitePagesPanelProps = {
  open: boolean;
  pages: VisualSitePageItem[];
  activePageId: string;
  onClose: () => void;
  onSelectPage: (pageId: string) => void;
  onAddPage?: () => void;
  PageComponent?: ComponentType<any> | null;
  pageData?: Record<string, any> | null;
  editorCss?: string;
};

export default function VisualSitePagesPanel({
  open,
  pages,
  activePageId,
  onClose,
  onSelectPage,
  onAddPage,
  PageComponent = null,
  pageData = null,
  editorCss = "",
}: VisualSitePagesPanelProps) {
  const sortedPages = useMemo(() => {
    return [...pages].sort((a, b) => {
      if (a.isHome && !b.isHome) return -1;
      if (!a.isHome && b.isHome) return 1;
      return String(a.title || "").localeCompare(String(b.title || ""), "he");
    });
  }, [pages]);

  if (!open) return null;

  return (
    <aside
      className="absolute inset-y-0 right-0 z-[2147483000] flex w-[320px] max-w-[92vw] flex-col border-l border-slate-200 bg-[#f4f5f7] shadow-[-18px_0_50px_rgba(15,23,42,0.12)]"
      dir="rtl"
    >
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4">
        <div>
          <h2 className="text-sm font-black text-slate-950">
            עמודי האתר ({sortedPages.length})
          </h2>
          <p className="text-[11px] font-bold text-slate-400">
            לחצו על עמוד כדי לעבור אליו
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50"
          aria-label="סגירה"
        >
          <X className="h-4 w-4" />
        </button>
      </header>

      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-3">
        <p className="px-1 text-[11px] font-black uppercase tracking-wide text-slate-400">
          עמודים ראשיים
        </p>

        {sortedPages.map((page) => {
          const isActive = page.id === activePageId;
          const slugLabel = page.isHome
            ? "/"
            : `/${String(page.slug || page.id || "").replace(/^\//, "")}`;

          return (
            <button
              key={page.id}
              type="button"
              onClick={() => onSelectPage(page.id)}
              className={[
                "group w-full overflow-hidden rounded-2xl border bg-white text-right shadow-sm transition",
                isActive
                  ? "border-blue-500 ring-2 ring-blue-200"
                  : "border-slate-200 hover:-translate-y-0.5 hover:border-slate-400 hover:shadow-md",
              ].join(" ")}
            >
              <div className="relative h-[168px] overflow-hidden border-b border-slate-100 bg-[#e8eaee]">
                <SitePageCardPreview
                  page={page}
                  PageComponent={
                    page.libraryPageTemplateId ? null : PageComponent
                  }
                  pageData={pageData}
                  editorCss={editorCss}
                />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-white/80 to-transparent" />
              </div>

              <div className="flex items-center justify-between gap-2 px-3 py-2.5">
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    {page.isHome ? (
                      <Home className="h-3.5 w-3.5 shrink-0 text-blue-600" />
                    ) : null}
                    <span className="truncate text-sm font-black text-slate-950">
                      {page.title || "עמוד"}
                    </span>
                  </div>
                  <p className="mt-0.5 truncate text-[11px] font-bold text-slate-400">
                    {slugLabel}
                  </p>
                </div>
                {isActive ? (
                  <span className="shrink-0 rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-black text-blue-700">
                    פעיל
                  </span>
                ) : null}
              </div>
            </button>
          );
        })}

        {sortedPages.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-10 text-center">
            <p className="text-sm font-black text-slate-700">אין עמודים עדיין</p>
            <p className="mt-1 text-xs font-bold text-slate-400">
              הוסיפו עמוד חדש מהספרייה
            </p>
          </div>
        ) : null}
      </div>

      <div className="shrink-0 space-y-2 border-t border-slate-200 bg-white p-3">
        <button
          type="button"
          onClick={onAddPage}
          className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 text-sm font-black text-white shadow-sm transition hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          הוספת עמוד
        </button>
      </div>
    </aside>
  );
}
