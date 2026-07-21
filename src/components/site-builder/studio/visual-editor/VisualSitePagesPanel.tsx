import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  ArrowRightLeft,
  CornerDownLeft,
  Copy,
  EyeOff,
  FileStack,
  FileText,
  GripVertical,
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

import type { VisualSitePageItem } from "./SitePageCardPreview";
import {
  buildPageTreeRows,
  type PageTreeMovePlacement,
} from "./utils/pageHierarchyUtils";

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
  | "addSubpage"
  | "reorder"
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
    meta?: {
      parentPageId?: string;
      targetPageId?: string;
      placement?: PageTreeMovePlacement;
    },
  ) => void;
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
  const isSubpage = Boolean(page.parentPageId);

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
      action: "addSubpage",
      label: "הוספת עמוד משנה",
      hint: "יצירת עמוד חדש שיופיע תחת העמוד הזה",
      icon: <Plus className="h-4 w-4" />,
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
    ...(isSubpage
      ? [
          {
            action: "subpage" as const,
            label: "הפוך לעמוד ראשי",
            hint: "הסרת הקינון והחזרה לרשימת העמודים הראשיים",
            icon: <CornerDownLeft className="h-4 w-4" />,
            dividerAfter: true,
          },
        ]
      : []),
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

function getDropPlacement(
  event: DragOverEvent | DragEndEvent,
): PageTreeMovePlacement {
  const overRect = event.over?.rect;
  const activeRect =
    event.active.rect.current.translated || event.active.rect.current.initial;

  if (!overRect || !activeRect) return "after";

  const pointerY = activeRect.top + activeRect.height / 2;
  const relativeY = pointerY - overRect.top;
  const ratio = relativeY / Math.max(overRect.height, 1);

  if (ratio < 0.28) return "before";
  if (ratio > 0.72) return "after";
  return "inside";
}

function SortablePageRow({
  page,
  depth,
  isActive,
  menuOpen,
  dropHint,
  isDragging,
  onSelectPage,
  onOpenMenu,
  onAddSubpage,
  buttonRef,
}: {
  page: VisualSitePageItem;
  depth: number;
  isActive: boolean;
  menuOpen: boolean;
  dropHint: PageTreeMovePlacement | null;
  isDragging: boolean;
  onSelectPage: () => void;
  onOpenMenu: (event: React.MouseEvent) => void;
  onAddSubpage: () => void;
  buttonRef: (node: HTMLButtonElement | null) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({
    id: page.id,
    disabled: Boolean(page.isHome),
    animateLayoutChanges: () => false,
  });

  const dragging = isDragging || isSortableDragging;

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition: dragging ? undefined : transition,
        opacity: dragging ? 0.35 : 1,
        zIndex: dragging ? 20 : 1,
        marginInlineStart: depth * 18,
      }}
      className={[
        "group relative flex items-center gap-1 rounded-xl border px-1.5 py-1.5 transition",
        isActive
          ? "border-blue-300 bg-blue-50"
          : "border-transparent bg-white hover:border-slate-200 hover:bg-slate-50",
        dropHint === "inside" ? "ring-2 ring-blue-300 ring-offset-1" : "",
        dragging ? "shadow-lg" : "",
      ].join(" ")}
    >
      {dropHint === "before" ? (
        <div className="pointer-events-none absolute inset-x-3 -top-1 h-0.5 rounded-full bg-blue-500" />
      ) : null}
      {dropHint === "after" ? (
        <div className="pointer-events-none absolute inset-x-3 -bottom-1 h-0.5 rounded-full bg-blue-500" />
      ) : null}

      <button
        type="button"
        className={[
          "flex h-8 w-5 shrink-0 items-center justify-center touch-none",
          page.isHome
            ? "cursor-default text-slate-200"
            : "cursor-grab text-slate-300 opacity-0 transition group-hover:opacity-100 hover:text-slate-500 active:cursor-grabbing",
        ].join(" ")}
        title={page.isHome ? "דף הבית קבוע בראש" : "גרור לשינוי סדר או קינון"}
        aria-label="גרירת עמוד"
        {...(page.isHome ? {} : { ...attributes, ...listeners })}
      >
        <GripVertical className="h-3.5 w-3.5" />
      </button>

      <button
        type="button"
        onClick={onSelectPage}
        className="flex min-w-0 flex-1 items-center gap-2.5 px-1 py-1 text-right"
      >
        <span
          className={[
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
            isActive
              ? "bg-blue-600 text-white"
              : "bg-slate-100 text-slate-600",
          ].join(" ")}
        >
          {page.isHome ? (
            <Home className="h-4 w-4" />
          ) : (
            <FileText className="h-4 w-4" />
          )}
        </span>

        <span className="min-w-0 flex-1">
          <span className="flex items-center gap-1.5">
            <span className="truncate text-sm font-black text-slate-950">
              {page.title || "עמוד"}
            </span>
            {page.hiddenFromMenu ? (
              <EyeOff className="h-3.5 w-3.5 shrink-0 text-slate-400" />
            ) : null}
            {depth > 0 ? (
              <span className="shrink-0 rounded-full bg-slate-100 px-1.5 py-0.5 text-[10px] font-black text-slate-500">
                משנה
              </span>
            ) : null}
          </span>
        </span>
      </button>

      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          onAddSubpage();
        }}
        className={[
          "flex shrink-0 items-center gap-1 rounded-lg px-2 py-1.5 text-[11px] font-black transition",
          page.isHome || isActive
            ? "bg-blue-600 text-white hover:bg-blue-700"
            : "border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100",
        ].join(" ")}
        title={`הוספת עמוד משנה תחת ${page.title || "עמוד"}`}
        aria-label={`הוספת עמוד משנה תחת ${page.title || "עמוד"}`}
      >
        <Plus className="h-3 w-3" />
        עמוד משנה
      </button>

      <button
        ref={buttonRef}
        type="button"
        aria-label={`פעולות עבור ${page.title || "עמוד"}`}
        aria-expanded={menuOpen}
        onClick={onOpenMenu}
        className={[
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition",
          menuOpen
            ? "border-blue-500 bg-blue-600 text-white shadow-sm"
            : "border-transparent text-slate-500 opacity-0 group-hover:opacity-100 hover:border-slate-200 hover:bg-white",
          isActive ? "opacity-100" : "",
        ].join(" ")}
      >
        <MoreHorizontal className="h-4 w-4" />
      </button>
    </div>
  );
}

function PageRowPreview({
  page,
  depth,
  isActive,
}: {
  page: VisualSitePageItem;
  depth: number;
  isActive: boolean;
}) {
  return (
    <div
      className={[
        "flex items-center gap-2 rounded-xl border px-3 py-2 shadow-xl",
        isActive
          ? "border-blue-300 bg-blue-50"
          : "border-slate-200 bg-white",
      ].join(" ")}
      style={{ marginInlineStart: depth * 18 }}
    >
      <GripVertical className="h-4 w-4 text-slate-400" />
      <span
        className={[
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
          isActive ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600",
        ].join(" ")}
      >
        {page.isHome ? (
          <Home className="h-4 w-4" />
        ) : (
          <FileText className="h-4 w-4" />
        )}
      </span>
      <span className="truncate text-sm font-black text-slate-950">
        {page.title || "עמוד"}
      </span>
    </div>
  );
}

export default function VisualSitePagesPanel({
  open,
  pages,
  activePageId,
  onClose,
  onSelectPage,
  onAddPage,
  onPageAction,
}: VisualSitePagesPanelProps) {
  const [menuPageId, setMenuPageId] = useState("");
  const [menuAnchor, setMenuAnchor] = useState<MenuAnchor | null>(null);
  const [draggingPageId, setDraggingPageId] = useState("");
  const [dropTargetId, setDropTargetId] = useState("");
  const [dropPlacement, setDropPlacement] =
    useState<PageTreeMovePlacement | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const pageRows = useMemo(() => buildPageTreeRows(pages), [pages]);
  const sortableIds = useMemo(
    () => pageRows.map((row) => row.page.id),
    [pageRows],
  );

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    }),
  );

  const menuPage = pages.find((page) => page.id === menuPageId) || null;

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
      setDraggingPageId("");
      setDropTargetId("");
      setDropPlacement(null);
    }
  }, [open]);

  useLayoutEffect(() => {
    syncMenuAnchor();
  }, [menuPageId, open, pageRows.length]);

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

  const handleDragStart = (event: DragStartEvent) => {
    setDraggingPageId(String(event.active.id || ""));
    setDropTargetId("");
    setDropPlacement(null);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const overId = String(event.over?.id || "");
    if (!overId || overId === draggingPageId) {
      setDropTargetId("");
      setDropPlacement(null);
      return;
    }

    setDropTargetId(overId);
    setDropPlacement(getDropPlacement(event));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const activeId = String(event.active.id || "");
    const overId = String(event.over?.id || "");
    const placement = overId ? getDropPlacement(event) : null;

    setDraggingPageId("");
    setDropTargetId("");
    setDropPlacement(null);

    if (!activeId || !overId || activeId === overId || !placement) return;

    onPageAction?.("reorder", activeId, {
      targetPageId: overId,
      placement,
    });
  };

  const handleDragCancel = () => {
    setDraggingPageId("");
    setDropTargetId("");
    setDropPlacement(null);
  };

  if (!open) return null;

  const menuPosition =
    menuAnchor && menuPage ? getMenuPosition(menuAnchor) : null;

  const draggingRow =
    pageRows.find((row) => row.page.id === draggingPageId) || null;

  const handleMenuAction = (
    action: VisualSitePageMenuAction,
    pageId: string,
  ) => {
    if (!onPageAction) return;

    if (action === "addSubpage") {
      onPageAction("addSubpage", pageId, { parentPageId: pageId });
      setMenuPageId("");
      setMenuAnchor(null);
      return;
    }

    if (action === "subpage") {
      const page = pages.find((item) => item.id === pageId);
      if (!page?.parentPageId) return;

      onPageAction("subpage", pageId, { parentPageId: "" });
      setMenuPageId("");
      setMenuAnchor(null);
      return;
    }

    onPageAction(action, pageId);
    setMenuPageId("");
    setMenuAnchor(null);
  };

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
                    handleMenuAction(item.action, menuPage.id);
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
        className="absolute inset-y-0 right-0 z-[2147483000] flex w-[320px] max-w-[92vw] flex-col border-l border-slate-200 bg-white shadow-[-18px_0_50px_rgba(15,23,42,0.12)]"
        dir="rtl"
      >
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-slate-200 px-4">
          <div>
            <h2 className="text-sm font-black text-slate-950">תפריט האתר</h2>
            <p className="text-[11px] font-bold text-slate-400">
              {pages.length} עמודים · + עמוד משנה · גרירה לסידור
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onAddPage}
              className="rounded-lg px-2.5 py-1.5 text-xs font-black text-blue-600 transition hover:bg-blue-50"
            >
              + הוספת עמוד
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50"
              aria-label="סגירה"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto p-3">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
            onDragCancel={handleDragCancel}
          >
            <SortableContext
              items={sortableIds}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-1.5">
                {pageRows.map(({ page, depth }) => {
                  const isActive = page.id === activePageId;
                  const menuOpen = menuPageId === page.id;
                  const dropHint =
                    dropTargetId === page.id && draggingPageId !== page.id
                      ? dropPlacement
                      : null;

                  return (
                    <SortablePageRow
                      key={page.id}
                      page={page}
                      depth={depth}
                      isActive={isActive}
                      menuOpen={menuOpen}
                      dropHint={dropHint}
                      isDragging={draggingPageId === page.id}
                      onSelectPage={() => onSelectPage(page.id)}
                      onAddSubpage={() =>
                        onPageAction?.("addSubpage", page.id, {
                          parentPageId: page.id,
                        })
                      }
                      onOpenMenu={(event) => {
                        event.stopPropagation();
                        setMenuPageId((current) => {
                          if (current === page.id) {
                            setMenuAnchor(null);
                            return "";
                          }
                          return page.id;
                        });
                      }}
                      buttonRef={(node) => {
                        buttonRefs.current[page.id] = node;
                      }}
                    />
                  );
                })}
              </div>
            </SortableContext>

            <DragOverlay dropAnimation={{ duration: 180, easing: "ease-out" }}>
              {draggingRow ? (
                <PageRowPreview
                  page={draggingRow.page}
                  depth={draggingRow.depth}
                  isActive={draggingRow.page.id === activePageId}
                />
              ) : null}
            </DragOverlay>
          </DndContext>

          {pageRows.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-10 text-center">
              <p className="text-sm font-black text-slate-700">
                אין עמודים עדיין
              </p>
              <p className="mt-1 text-xs font-bold text-slate-400">
                הוסיפו עמוד חדש מהספרייה
              </p>
            </div>
          ) : null}
        </div>

        <div className="shrink-0 border-t border-slate-200 p-3">
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