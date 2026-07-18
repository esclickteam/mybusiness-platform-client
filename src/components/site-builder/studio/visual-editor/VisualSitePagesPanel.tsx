import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ComponentType,
} from "react";
import {
  ArrowRightLeft,
  Copy,
  EyeOff,
  FileStack,
  Home,
  MoreHorizontal,
  Plus,
  Search,
  Settings2,
  Share2,
  SquareDashed,
  Trash2,
  Type,
  X,
} from "lucide-react";

import SitePageCardPreview, {
  type VisualSitePageItem,
} from "./SitePageCardPreview";

export type { VisualSitePageItem };

export type VisualSitePageMenuAction =
  | "settings"
  | "seo"
  | "social"
  | "background"
  | "dynamic"
  | "rename"
  | "duplicate"
  | "copy"
  | "setHome"
  | "hideMenu"
  | "subpage"
  | "delete";

type VisualSitePagesPanelProps = {
  open: boolean;
  pages: VisualSitePageItem[];
  activePageId: string;
  onClose: () => void;
  onSelectPage: (pageId: string) => void;
  onAddPage?: () => void;
  onPageAction?: (
    action: VisualSitePageMenuAction,
    pageId: string,
  ) => void;
  PageComponent?: ComponentType<any> | null;
  pageData?: Record<string, any> | null;
  editorCss?: string;
};

type MenuItem = {
  action: VisualSitePageMenuAction;
  label: string;
  hint: string;
  icon: React.ReactNode;
  danger?: boolean;
  disabled?: boolean;
  dividerAfter?: boolean;
};

function buildMenuItems(page: VisualSitePageItem): MenuItem[] {
  const isHome = Boolean(page.isHome);
  const hidden = Boolean(page.hiddenFromMenu);

  return [
    {
      action: "settings",
      label: "הגדרות",
      hint: "שם העמוד, כתובת URL והגדרות בסיס",
      icon: <Settings2 className="h-4 w-4" />,
      dividerAfter: false,
    },
    {
      action: "seo",
      label: "יסודות SEO",
      hint: "כותרת ותיאור שמופיעים בגוגל",
      icon: <Search className="h-4 w-4" />,
    },
    {
      action: "social",
      label: "שיתוף ברשתות",
      hint: "תצוגה כשמשתפים את הקישור",
      icon: <Share2 className="h-4 w-4" />,
      dividerAfter: true,
    },
    {
      action: "background",
      label: "רקע העמוד",
      hint: "צבע, תמונה או וידאו ברקע העמוד",
      icon: <SquareDashed className="h-4 w-4" />,
      dividerAfter: true,
    },
    {
      action: "dynamic",
      label: "המרה לעמוד דינמי",
      hint: "עמוד שנבנה ממאגר נתונים (בקרוב)",
      icon: <ArrowRightLeft className="h-4 w-4" />,
      disabled: true,
      dividerAfter: true,
    },
    {
      action: "rename",
      label: "שינוי שם",
      hint: "שינוי שם התצוגה של העמוד",
      icon: <Type className="h-4 w-4" />,
    },
    {
      action: "duplicate",
      label: "שכפול",
      hint: "יצירת עותק מלא של העמוד",
      icon: <FileStack className="h-4 w-4" />,
    },
    {
      action: "copy",
      label: "העתקה",
      hint: "העתקה להדבקה באתר/פרויקט אחר (בקרוב)",
      icon: <Copy className="h-4 w-4" />,
      disabled: true,
    },
    {
      action: "setHome",
      label: "הגדרה כדף הבית",
      hint: "העמוד יהיה העמוד הראשי של האתר",
      icon: <Home className="h-4 w-4" />,
      disabled: isHome,
    },
    {
      action: "hideMenu",
      label: hidden ? "הצגה בתפריט" : "הסתרה מהתפריט",
      hint: hidden
        ? "החזרת העמוד לתפריט הניווט"
        : "העמוד נשאר באתר אבל לא מופיע בתפריט",
      icon: <EyeOff className="h-4 w-4" />,
      disabled: isHome,
    },
    {
      action: "subpage",
      label: "עמוד משנה",
      hint: "קינון תחת עמוד אחר בתפריט (בקרוב)",
      icon: <ArrowRightLeft className="h-4 w-4 rotate-90" />,
      disabled: true,
      dividerAfter: true,
    },
    {
      action: "delete",
      label: "מחיקה",
      hint: "מחיקת העמוד מהאתר",
      icon: <Trash2 className="h-4 w-4" />,
      danger: true,
      disabled: isHome,
    },
  ];
}

export default function VisualSitePagesPanel({
  open,
  pages,
  activePageId,
  onClose,
  onSelectPage,
  onAddPage,
  onPageAction,
  PageComponent = null,
  pageData = null,
  editorCss = "",
}: VisualSitePagesPanelProps) {
  const [menuPageId, setMenuPageId] = useState("");
  const menuRef = useRef<HTMLDivElement>(null);

  const sortedPages = useMemo(() => {
    return [...pages].sort((a, b) => {
      if (a.isHome && !b.isHome) return -1;
      if (!a.isHome && b.isHome) return 1;
      return String(a.title || "").localeCompare(String(b.title || ""), "he");
    });
  }, [pages]);

  const menuPage = sortedPages.find((page) => page.id === menuPageId) || null;

  useEffect(() => {
    if (!open) setMenuPageId("");
  }, [open]);

  useEffect(() => {
    if (!menuPageId) return;

    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as Node | null;
      if (menuRef.current?.contains(target)) return;
      setMenuPageId("");
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuPageId("");
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [menuPageId]);

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
            לחצו על עמוד כדי לעבור אליו · ⋯ לפעולות
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
          const menuOpen = menuPageId === page.id;

          return (
            <div
              key={page.id}
              className={[
                "relative overflow-hidden rounded-2xl border bg-white shadow-sm transition",
                isActive
                  ? "border-blue-500 ring-2 ring-blue-200"
                  : "border-slate-200 hover:border-slate-400 hover:shadow-md",
              ].join(" ")}
            >
              <button
                type="button"
                onClick={() => onSelectPage(page.id)}
                className="group w-full text-right"
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
              </button>

              <div className="flex items-center justify-between gap-2 px-3 py-2.5">
                <button
                  type="button"
                  onClick={() => onSelectPage(page.id)}
                  className="min-w-0 flex-1 text-right"
                >
                  <div className="flex items-center gap-1.5">
                    {page.isHome ? (
                      <Home className="h-3.5 w-3.5 shrink-0 text-blue-600" />
                    ) : null}
                    {page.hiddenFromMenu ? (
                      <EyeOff className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                    ) : null}
                    <span className="truncate text-sm font-black text-slate-950">
                      {page.title || "עמוד"}
                    </span>
                  </div>
                  <p className="mt-0.5 truncate text-[11px] font-bold text-slate-400">
                    {slugLabel}
                  </p>
                </button>

                <div className="relative flex shrink-0 items-center gap-1">
                  {isActive ? (
                    <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-black text-blue-700">
                      פעיל
                    </span>
                  ) : null}

                  <button
                    type="button"
                    aria-label={`פעולות עבור ${page.title || "עמוד"}`}
                    aria-expanded={menuOpen}
                    onClick={(event) => {
                      event.stopPropagation();
                      setMenuPageId((current) =>
                        current === page.id ? "" : page.id,
                      );
                    }}
                    className={[
                      "flex h-8 w-8 items-center justify-center rounded-full border transition",
                      menuOpen
                        ? "border-blue-500 bg-blue-600 text-white"
                        : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50",
                    ].join(" ")}
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {menuOpen && menuPage ? (
                <div
                  ref={menuRef}
                  className="absolute left-2 right-2 top-[210px] z-20 overflow-hidden rounded-2xl border border-slate-200 bg-white py-1 shadow-[0_18px_50px_rgba(15,23,42,0.18)]"
                >
                  {buildMenuItems(menuPage).map((item) => (
                    <React.Fragment key={item.action}>
                      <button
                        type="button"
                        disabled={item.disabled || !onPageAction}
                        title={item.hint}
                        onClick={() => {
                          if (item.disabled || !onPageAction) return;
                          onPageAction(item.action, menuPage.id);
                          setMenuPageId("");
                        }}
                        className={[
                          "flex w-full items-center gap-3 px-3 py-2.5 text-right text-sm font-bold transition",
                          item.danger
                            ? "text-rose-600 hover:bg-rose-50"
                            : "text-slate-800 hover:bg-slate-50",
                          item.disabled
                            ? "cursor-not-allowed opacity-40 hover:bg-transparent"
                            : "",
                        ].join(" ")}
                      >
                        <span className="text-slate-500">{item.icon}</span>
                        <span className="min-w-0 flex-1">
                          <span className="block">{item.label}</span>
                          <span className="mt-0.5 block text-[10px] font-semibold text-slate-400">
                            {item.hint}
                          </span>
                        </span>
                      </button>
                      {item.dividerAfter ? (
                        <div className="my-1 border-t border-slate-100" />
                      ) : null}
                    </React.Fragment>
                  ))}
                </div>
              ) : null}
            </div>
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
