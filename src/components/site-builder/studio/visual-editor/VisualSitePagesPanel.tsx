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
  TouchSensor,
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
  applyDragToDisplayRows,
  buildPageTreeRows,
  resolvePageParentId,
  type PageTreeMovePlacement,
  type PageTreeRow,
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
      orderedIds?: string[];
      rowSnapshots?: Array<{ id: string; depth: number }>;
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
  const isSubpage = Boolean(resolvePageParentId(page));

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
      hint: `יצירת עמוד חדש תחת "${page.title || "עמוד"}"`,
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

  if (ratio < 0.22) return "before";
  if (ratio > 0.78) return "after";
  return "inside";
}

const DEPTH_INDENT = 28;

function getDropPlacementLabel(placement: PageTreeMovePlacement | null) {
  if (placement === "before") return "שחררו לפני";
  if (placement === "after") return "שחררו אחרי";
  if (placement === "inside") return "שחררו כעמוד משנה";
  return "";
}

function SortablePageRow({
  page,
  depth,
  parentTitle,
  isActive,
  menuOpen,
  dropHint,
  isDraggingGlobal,
  onSelectPage,
  onOpenMenu,
  buttonRef,
}: {
  page: VisualSitePageItem;
  depth: number;
  parentTitle?: string;
  isActive: boolean;
  menuOpen: boolean;
  dropHint: PageTreeMovePlacement | null;
  isDraggingGlobal: boolean;
  onSelectPage: () => void;
  onOpenMenu: (event: React.MouseEvent) => void;
  buttonRef: (node: HTMLButtonElement | null) => void;
}) {
  const canDrag = !page.isHome;
  const isSubpage = depth > 0 || Boolean(resolvePageParentId(page));

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: page.id,
    disabled: !canDrag,
    animateLayoutChanges: () => false,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: isDragging ? undefined : transition,
    zIndex: isDragging ? 30 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={[
        "relative pl-1",
        isDragging ? "opacity-40" : "",
      ].join(" ")}
    >
      <div
        className="relative"
        style={{ marginInlineStart: depth * DEPTH_INDENT }}
      >
        {depth > 0 ? (
          <div
            className="pointer-events-none absolute bottom-2 top-2 w-px bg-violet-200"
            style={{ insetInlineStart: -14 }}
          />
        ) : null}

        {dropHint === "before" ? (
          <div className="pointer-events-none absolute inset-x-0 -top-1 z-10 flex items-center gap-2">
            <div className="h-0.5 flex-1 rounded-full bg-violet-500 shadow-[0_0_0_1px_rgba(255,255,255,0.8)]" />
            <span className="rounded-full bg-violet-600 px-2 py-0.5 text-[10px] font-black text-white">
              {getDropPlacementLabel("before")}
            </span>
          </div>
        ) : null}
        {dropHint === "after" ? (
          <div className="pointer-events-none absolute inset-x-0 -bottom-1 z-10 flex items-center gap-2">
            <div className="h-0.5 flex-1 rounded-full bg-violet-500 shadow-[0_0_0_1px_rgba(255,255,255,0.8)]" />
            <span className="rounded-full bg-violet-600 px-2 py-0.5 text-[10px] font-black text-white">
              {getDropPlacementLabel("after")}
            </span>
          </div>
        ) : null}

        <div
          className={[
            "group relative flex items-center gap-1.5 rounded-2xl border px-2 py-2 transition-all duration-150",
            isActive
              ? "border-violet-300 bg-violet-50 shadow-sm"
              : isSubpage
                ? "border-violet-100 bg-violet-50/40 hover:border-violet-200 hover:bg-violet-50/70"
                : "border-slate-200/80 bg-white hover:border-slate-300 hover:shadow-sm",
            dropHint === "inside"
              ? "border-violet-400 bg-violet-50 ring-2 ring-violet-300/70"
              : "",
            isDraggingGlobal && !isDragging ? "opacity-80" : "",
          ].join(" ")}
        >
          {dropHint === "inside" ? (
            <div className="pointer-events-none absolute inset-x-3 top-2 flex justify-center">
              <span className="rounded-full bg-violet-600 px-2.5 py-0.5 text-[10px] font-black text-white shadow-sm">
                {getDropPlacementLabel("inside")}
              </span>
            </div>
          ) : null}

          <button
            type="button"
            className={[
              "flex h-9 w-6 shrink-0 items-center justify-center touch-none select-none rounded-lg",
              canDrag
                ? "cursor-grab text-slate-400 opacity-100 hover:bg-slate-100 hover:text-violet-600 active:cursor-grabbing"
                : "cursor-default text-slate-200",
            ].join(" ")}
            title={canDrag ? "גררו לשינוי סדר והיררכיה" : "דף הבית נשאר בראש"}
            aria-label={canDrag ? "גרירת עמוד" : "דף הבית"}
            {...(canDrag ? { ...attributes, ...listeners } : {})}
          >
            <GripVertical className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={onSelectPage}
            className="flex min-w-0 flex-1 items-center gap-3 px-1 py-0.5 text-right"
          >
            <span
              className={[
                "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
                isActive
                  ? "bg-violet-600 text-white shadow-sm"
                  : isSubpage
                    ? "bg-violet-100 text-violet-700"
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
                {isSubpage ? (
                  <span className="shrink-0 rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-black text-violet-700">
                    משנה
                  </span>
                ) : null}
              </span>
              {isSubpage && parentTitle ? (
                <span className="mt-0.5 block truncate text-[11px] font-bold text-violet-500/90">
                  תחת: {parentTitle}
                </span>
              ) : null}
            </span>
          </button>

          <button
            ref={buttonRef}
            type="button"
            aria-label={`פעולות עבור ${page.title || "עמוד"}`}
            aria-expanded={menuOpen}
            onClick={onOpenMenu}
            className={[
              "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border transition",
              menuOpen
                ? "border-violet-500 bg-violet-600 text-white shadow-sm"
                : "border-transparent text-slate-500 opacity-100 hover:border-slate-200 hover:bg-white",
            ].join(" ")}
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>
      </div>
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
  const dropTargetRef = useRef<{ id: string; placement: PageTreeMovePlacement } | null>(
    null,
  );
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const pageRows = useMemo(() => buildPageTreeRows(pages), [pages]);
  const pageById = useMemo(
    () => new Map(pages.map((page) => [page.id, page])),
    [pages],
  );
  const [displayRows, setDisplayRows] = useState<PageTreeRow[]>([]);
  const isDraggingRef = useRef(false);
  const displayRowsRef = useRef<PageTreeRow[]>([]);
  displayRowsRef.current = displayRows;

  useEffect(() => {
    if (!isDraggingRef.current) {
      setDisplayRows(pageRows);
    }
  }, [pageRows]);

  const sortableIds = useMemo(
    () => displayRows.map((row) => row.page.id),
    [displayRows],
  );

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 4 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 120, tolerance: 6 },
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
      dropTargetRef.current = null;
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
    isDraggingRef.current = true;
    setDraggingPageId(String(event.active.id || ""));
    dropTargetRef.current = null;
  };

  const handleDragOver = (event: DragOverEvent) => {
    const activeId = String(event.active.id || "");
    const overId = String(event.over?.id || "");

    if (!activeId || !overId || activeId === overId) {
      setDropTargetId("");
      setDropPlacement(null);
      dropTargetRef.current = null;
      return;
    }

    const activeRow = pageRows.find((row) => row.page.id === activeId);
    if (activeRow?.page.isHome) return;

    const placement = getDropPlacement(event);
    setDropTargetId(overId);
    setDropPlacement(placement);
    dropTargetRef.current = { id: overId, placement };
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const activeId = String(event.active.id || "");
    const stored = dropTargetRef.current;
    const overId =
      String(event.over?.id || "") || String(stored?.id || "");
    const placement = stored?.placement || "after";

    isDraggingRef.current = false;
    setDraggingPageId("");
    setDropTargetId("");
    setDropPlacement(null);
    dropTargetRef.current = null;

    if (!activeId || !overId || activeId === overId) {
      setDisplayRows(pageRows);
      return;
    }

    const nextRows = applyDragToDisplayRows(
      pageRows,
      activeId,
      overId,
      placement,
    );
    const rowSnapshots = nextRows.map((row) => ({
      id: row.page.id,
      depth: row.depth,
    }));

    setDisplayRows(nextRows);

    onPageAction?.("reorder", activeId, {
      targetPageId: overId,
      placement,
      rowSnapshots,
    });
  };

  const handleDragCancel = () => {
    isDraggingRef.current = false;
    setDraggingPageId("");
    setDropTargetId("");
    setDropPlacement(null);
    dropTargetRef.current = null;
    setDisplayRows(pageRows);
  };

  const draggingRow =
    pageRows.find((row) => row.page.id === draggingPageId) || null;

  const dragPreviewDepth = useMemo(() => {
    if (!draggingPageId || !dropTargetId || !dropPlacement) {
      return draggingRow?.depth ?? 0;
    }

    const targetRow = pageRows.find((row) => row.page.id === dropTargetId);
    if (!targetRow) return draggingRow?.depth ?? 0;

    if (dropPlacement === "inside") return targetRow.depth + 1;
    return targetRow.depth;
  }, [draggingPageId, dropTargetId, dropPlacement, draggingRow, pageRows]);

  if (!open) return null;

  const menuPosition =
    menuAnchor && menuPage ? getMenuPosition(menuAnchor) : null;

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
        className="absolute inset-y-0 right-0 z-[2147483000] flex w-[320px] max-w-[92vw] flex-col border-l border-slate-200/80 bg-gradient-to-b from-slate-50 via-white to-white shadow-[-18px_0_50px_rgba(15,23,42,0.12)]"
        dir="rtl"
      >
        <div className="min-h-0 flex-1 overflow-y-auto p-3">
          <div className="mb-3 rounded-2xl border border-slate-200/80 bg-white/95 p-3 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h2 className="text-sm font-black text-slate-950">תפריט האתר</h2>
                <p className="mt-1 text-[11px] font-bold leading-5 text-slate-500">
                  {pages.length} עמודים · גררו לסידור · אמצע השורה = עמוד משנה
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-500 transition hover:bg-white"
                aria-label="סגירה"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <button
              type="button"
              onClick={onAddPage}
              className="mt-3 flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-violet-200 bg-violet-50 text-sm font-black text-violet-700 transition hover:border-violet-300 hover:bg-violet-100"
            >
              <Plus className="h-4 w-4" />
              הוספת עמוד ראשי
            </button>
          </div>

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
              <div className="space-y-2">
                {displayRows.map(({ page, depth }) => {
                  const isActive = page.id === activePageId;
                  const menuOpen = menuPageId === page.id;
                  const dropHint =
                    dropTargetId === page.id && draggingPageId !== page.id
                      ? dropPlacement
                      : null;
                  const parentId = resolvePageParentId(page);
                  const parentTitle = parentId
                    ? pageById.get(parentId)?.title || "עמוד"
                    : undefined;

                  return (
                    <SortablePageRow
                      key={page.id}
                      page={page}
                      depth={depth}
                      parentTitle={parentTitle}
                      isActive={isActive}
                      menuOpen={menuOpen}
                      dropHint={dropHint}
                      isDraggingGlobal={Boolean(draggingPageId)}
                      onSelectPage={() => onSelectPage(page.id)}
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

            <DragOverlay dropAnimation={{ duration: 160, easing: "ease-out" }}>
              {draggingRow ? (
                <div
                  className="flex items-center gap-2 rounded-2xl border border-violet-300 bg-white px-3 py-2.5 shadow-2xl"
                  style={{
                    marginInlineStart: dragPreviewDepth * DEPTH_INDENT,
                    width: 280,
                  }}
                >
                  <GripVertical className="h-4 w-4 text-violet-500" />
                  <div className="min-w-0">
                    <span className="block truncate text-sm font-black text-slate-950">
                      {draggingRow.page.title || "עמוד"}
                    </span>
                    {dropPlacement ? (
                      <span className="mt-0.5 block text-[10px] font-bold text-violet-600">
                        {getDropPlacementLabel(dropPlacement)}
                      </span>
                    ) : null}
                  </div>
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>

          {displayRows.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-10 text-center">
              <p className="text-sm font-black text-slate-700">אין עמודים עדיין</p>
              <p className="mt-1 text-xs font-bold text-slate-400">
                הוסיפו עמוד חדש מהספרייה
              </p>
            </div>
          ) : null}
        </div>
      </aside>

      {menuPortal}
    </>
  );
}
