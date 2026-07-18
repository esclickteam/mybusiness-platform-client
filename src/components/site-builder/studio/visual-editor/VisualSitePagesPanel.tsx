import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ComponentType,
} from "react";
import { createPortal } from "react-dom";
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
import { sortSitePagesByHeaderNavOrder } from "./utils/syncNavWithSitePages";

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
  templatePages?: Array<{ id?: string; slug?: string }> | null;
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

type MenuAnchor = {
  top: number;
  left: number;
  right: number;
  bottom: number;
  width: number;
  height: number;
};

const MENU_WIDTH = 240;
const MENU_GAP = 10;

function buildMenuItems(page: VisualSitePageItem): MenuItem[] {
  const isHome = Boolean(page.isHome);
  const hidden = Boolean(page.hiddenFromMenu);

  return [
    {
      action: "settings",
      label: "הגדרות",
      hint: "שם העמוד, כתובת URL והגדרות בסיס",
      icon: <Settings2 className="h-4 w-4" />,
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

function getMenuPosition(anchor: MenuAnchor) {
  if (typeof window === "undefined") {
    return { top: 0, left: 0 };
  }

  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const estimatedHeight = 420;

  // Open to the side of the dots (into the canvas), like Wix.
  let left = anchor.left - MENU_WIDTH - MENU_GAP;
  if (left < 12) {
    left = Math.min(anchor.right + MENU_GAP, viewportWidth - MENU_WIDTH - 12);
  }

  let top = anchor.top;
  if (top + estimatedHeight > viewportHeight - 12) {
    top = Math.max(12, viewportHeight - estimatedHeight - 12);
  }

  return { top, left };
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
  templatePages = null,
  editorCss = "",
}: VisualSitePagesPanelProps) {
  const [menuPageId, setMenuPageId] = useState("");
  const [menuAnchor, setMenuAnchor] = useState<MenuAnchor | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const sortedPages = useMemo(() => {
    const data = pageData && typeof pageData === "object" ? pageData : {};
    return sortSitePagesByHeaderNavOrder(pages, {
      nav: Array.isArray(data.nav) ? data.nav : null,
      navigation: Array.isArray(data.navigation) ? data.navigation : null,
      templatePages: Array.isArray(templatePages)
        ? templatePages
        : Array.isArray((data as any).__templatePages)
          ? (data as any).__templatePages
          : null,
    });
  }, [pages, pageData, templatePages]);

  const menuPage = sortedPages.find((page) => page.id === menuPageId) || null;

  const syncMenuAnchor = () => {
    if (!menuPageId) {
      setMenuAnchor(null);
      return;
    }

    const button = buttonRefs.current[menuPageId];
    if (!button) {
      setMenuAnchor(null);
      return;
    }

    const rect = button.getBoundingClientRect();
    setMenuAnchor({
      top: rect.top,
      left: rect.left,
      right: rect.right,
      bottom: rect.bottom,
      width: rect.width,
      height: rect.height,
    });
  };

  useEffect(() => {
    if (!open) {
      setMenuPageId("");
      setMenuAnchor(null);
    }
  }, [open]);

  useLayoutEffect(() => {
    syncMenuAnchor();
  }, [menuPageId, open, sortedPages.length]);

  useEffect(() => {
    if (!menuPageId) return;

    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as Node | null;
      if (menuRef.current?.contains(target)) return;
      const button = buttonRefs.current[menuPageId];
      if (button?.contains(target)) return;
      setMenuPageId("");
      setMenuAnchor(null);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuPageId("");
        setMenuAnchor(null);
      }
    };

    const onReposition = () => syncMenuAnchor();

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", onReposition);
    window.addEventListener("scroll", onReposition, true);

    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", onReposition);
      window.removeEventListener("scroll", onReposition, true);
    };
  }, [menuPageId]);

  if (!open) return null;

  const menuPosition =
    menuAnchor && menuPage ? getMenuPosition(menuAnchor) : null;

  const menuPortal =
    menuPage && menuPosition && typeof document !== "undefined"
      ? createPortal(
          <div
            ref={menuRef}
            dir="rtl"
            className="fixed z-[2147483646] max-h-[min(70vh,480px)] w-[240px] overflow-y-auto rounded-xl border border-slate-200 bg-white py-1.5 shadow-[0_16px_48px_rgba(15,23,42,0.22)]"
            style={{
              top: menuPosition.top,
              left: menuPosition.left,
            }}
            role="menu"
            aria-label={`פעולות עבור ${menuPage.title || "עמוד"}`}
          >
            {buildMenuItems(menuPage).map((item) => (
              <React.Fragment key={item.action}>
                <button
                  type="button"
                  role="menuitem"
                  disabled={item.disabled || !onPageAction}
                  title={item.hint}
                  onClick={() => {
                    if (item.disabled || !onPageAction) return;
                    onPageAction(item.action, menuPage.id);
                    setMenuPageId("");
                    setMenuAnchor(null);
                  }}
                  className={[
                    "flex w-full items-center gap-3 px-3.5 py-2.5 text-right text-[13px] font-bold transition",
                    item.danger
                      ? "text-rose-600 hover:bg-rose-50"
                      : "text-slate-800 hover:bg-slate-50",
                    item.disabled
                      ? "cursor-not-allowed opacity-40 hover:bg-transparent"
                      : "",
                  ].join(" ")}
                >
                  <span
                    className={
                      item.danger ? "text-rose-500" : "text-slate-500"
                    }
                  >
                    {item.icon}
                  </span>
                  <span className="min-w-0 flex-1 truncate">{item.label}</span>
                </button>
                {item.dividerAfter ? (
                  <div className="my-1 border-t border-slate-100" />
                ) : null}
              </React.Fragment>
            ))}
          </div>,
          document.body,
        )
      : null;

  return (
    <>
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
                      {isActive ? (
                        <span className="shrink-0 rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-black text-blue-700">
                          פעיל
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-0.5 truncate text-[11px] font-bold text-slate-400">
                      {slugLabel}
                    </p>
                  </button>

                  <button
                    ref={(node) => {
                      buttonRefs.current[page.id] = node;
                    }}
                    type="button"
                    aria-label={`פעולות עבור ${page.title || "עמוד"}`}
                    aria-expanded={menuOpen}
                    onClick={(event) => {
                      event.stopPropagation();
                      setMenuPageId((current) => {
                        if (current === page.id) {
                          setMenuAnchor(null);
                          return "";
                        }
                        return page.id;
                      });
                    }}
                    className={[
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition",
                      menuOpen
                        ? "border-blue-500 bg-blue-600 text-white shadow-sm"
                        : "border-slate-200 bg-white text-slate-600 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700",
                    ].join(" ")}
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </div>
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

      {menuPortal}
    </>
  );
}
