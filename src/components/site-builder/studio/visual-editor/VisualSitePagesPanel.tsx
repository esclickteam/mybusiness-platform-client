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
  pointerWithin,
  useSensor,
  useSensors,
  type CollisionDetection,
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
  ChevronDown,
  ChevronLeft,
  CornerDownLeft,
  Copy,
  EyeOff,
  FileStack,
  FileText,
  GripVertical,
  Home,
  Layers3,
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
  wouldCreatePageCycle,
  type PageTreeMovePlacement,
  type PageTreeRow,
} from "./utils/pageHierarchyUtils";
import {
  collectSectionItemsFromVisualData,
  type VisualSectionItem,
} from "./utils/visualSectionOrder";

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

type VisualEditorPagesPanelRuntime = {
  getSectionItems?: () => VisualSectionItem[];
  selectByElementId?: (elementId: string) => void;
  applySectionOrder?: (orderedKeys: string[]) => void;
  selectedElement?: { id?: string } | null;
  data?: Record<string, any>;
  activePageId?: string;
};

type VisualSitePagesPanelProps = {
  open: boolean;
  editor?: VisualEditorPagesPanelRuntime | null;
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
      : [
          {
            action: "subpage" as const,
            label: "עמוד משנה",
            hint: "קינון העמוד הקיים תחת עמוד אב בתפריט",
            icon: <CornerDownLeft className="h-4 w-4" />,
            dividerAfter: true,
            disabled: isHome,
          },
        ]),
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
  overRect: { top: number; height: number } | null | undefined,
  pointerY: number,
): PageTreeMovePlacement {
  if (!overRect || !Number.isFinite(pointerY)) return "inside";

  const relativeY = pointerY - overRect.top;
  const ratio = relativeY / Math.max(overRect.height, 1);

  // Narrow edge bands so nesting (center of the row) is easy to hit.
  if (ratio < 0.16) return "before";
  if (ratio > 0.84) return "after";
  return "inside";
}

const pageListCollisionDetection: CollisionDetection = (args) => {
  const pointerHits = pointerWithin(args);
  if (pointerHits.length > 0) return pointerHits;
  return closestCenter(args);
};

const DEPTH_INDENT = 28;

function getDropPlacementLabel(placement: PageTreeMovePlacement | null) {
  if (placement === "before") return "שחררו לפני";
  if (placement === "after") return "שחררו אחרי";
  if (placement === "inside") return "שחררו כעמוד משנה";
  return "";
}

function SectionListItem({
  section,
  isActive,
  onSelect,
}: {
  section: VisualSectionItem;
  isActive: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={[
        "flex w-full items-center gap-2 rounded-xl border px-2.5 py-2 text-right transition",
        isActive
          ? "border-violet-400 bg-violet-50 shadow-sm"
          : "border-slate-200/80 bg-white hover:border-violet-200 hover:bg-violet-50/40",
      ].join(" ")}
    >
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
        <Layers3 className="h-3.5 w-3.5" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-xs font-black text-slate-900">
          {section.label}
        </span>
        <span className="block truncate text-[10px] font-bold text-slate-400">
          {section.pinned ? "קבוע" : section.inserted ? "נוסף" : "בתבנית"}
        </span>
      </span>
    </button>
  );
}

function SortablePageRow({
  page,
  depth,
  parentTitle,
  isActive,
  expanded,
  sections,
  sectionsLoading,
  menuOpen,
  dropHint,
  isDraggingGlobal,
  selectedSectionId,
  onToggleExpand,
  onSelectPage,
  onSelectSection,
  onOpenMenu,
  buttonRef,
}: {
  page: VisualSitePageItem;
  depth: number;
  parentTitle?: string;
  isActive: boolean;
  expanded: boolean;
  sections: VisualSectionItem[];
  sectionsLoading?: boolean;
  menuOpen: boolean;
  dropHint: PageTreeMovePlacement | null;
  isDraggingGlobal: boolean;
  selectedSectionId?: string;
  onToggleExpand: () => void;
  onSelectPage: () => void;
  onSelectSection: (sectionKey: string) => void;
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
            <span className="rounded-full bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 border border-violet-200/70 px-2 py-0.5 text-[10px] font-black text-white">
              {getDropPlacementLabel("before")}
            </span>
          </div>
        ) : null}
        {dropHint === "after" ? (
          <div className="pointer-events-none absolute inset-x-0 -bottom-1 z-10 flex items-center gap-2">
            <div className="h-0.5 flex-1 rounded-full bg-violet-500 shadow-[0_0_0_1px_rgba(255,255,255,0.8)]" />
            <span className="rounded-full bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 border border-violet-200/70 px-2 py-0.5 text-[10px] font-black text-white">
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
              <span className="rounded-full bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 border border-violet-200/70 px-2.5 py-0.5 text-[10px] font-black text-white shadow-sm">
                {getDropPlacementLabel("inside")}
              </span>
            </div>
          ) : null}

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onToggleExpand();
            }}
            className="flex h-9 w-7 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-violet-600"
            aria-label={expanded ? "כיווץ סקשנים" : "הצגת סקשנים"}
          >
            {expanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </button>

          <button
            type="button"
            className={[
              "flex h-9 w-6 shrink-0 items-center justify-center touch-none select-none rounded-lg",
              canDrag
                ? "cursor-grab text-slate-400 opacity-100 hover:bg-slate-100 hover:text-violet-600 active:cursor-grabbing"
                : "cursor-default text-slate-200",
            ].join(" ")}
            title={canDrag ? "גררו לשינוי מיקום והיררכיה" : "דף הבית נשאר בראש"}
            aria-label={canDrag ? "גרירת עמוד" : "דף הבית"}
            {...(canDrag ? { ...attributes, ...listeners } : {})}
          >
            <GripVertical className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() => {
              onSelectPage();
              if (!expanded) onToggleExpand();
            }}
            className="flex min-w-0 flex-1 items-center gap-3 px-1 py-0.5 text-right"
          >
            <span
              className={[
                "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
                isActive
                  ? "bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 border border-violet-200/70 text-slate-800 shadow-sm"
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
                <span className="truncate text-sm font-black text-slate-800">
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
                ? "border-violet-500 bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 border border-violet-200/70 text-slate-800 shadow-sm"
                : "border-transparent text-slate-500 opacity-100 hover:border-slate-200 hover:bg-white",
            ].join(" ")}
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>

        {expanded ? (
          <div className="mr-3 mt-2 border-r border-slate-200 pr-3">
            <div className="mb-2 flex items-center justify-between px-1">
              <span className="text-[11px] font-black text-slate-500">
                סקשנים ({sections.length})
              </span>
              {!isActive ? (
                <span className="text-[10px] font-bold text-violet-500">
                  תצוגה מקדימה
                </span>
              ) : null}
            </div>

            {sectionsLoading ? (
              <div className="rounded-xl border border-dashed border-slate-200 bg-white px-3 py-4 text-center text-[11px] font-bold text-slate-400">
                טוען סקשנים...
              </div>
            ) : sections.length ? (
              <div className="space-y-1.5">
                {sections.map((section) => (
                  <SectionListItem
                    key={section.key}
                    section={section}
                    isActive={
                      isActive &&
                      (selectedSectionId === section.elementId ||
                        selectedSectionId === section.key)
                    }
                    onSelect={() => {
                      if (!isActive) {
                        onSelectPage();
                        return;
                      }
                      onSelectSection(section.elementId || section.key);
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-slate-200 bg-white px-3 py-4 text-center">
                <p className="text-[11px] font-bold text-slate-500">
                  {isActive
                    ? "אין סקשנים בעמוד הזה"
                    : "פתחי את העמוד כדי לראות את הסקשנים"}
                </p>
                {!isActive ? (
                  <button
                    type="button"
                    onClick={onSelectPage}
                    className="mt-2 text-[11px] font-black text-violet-600 hover:underline"
                  >
                    פתיחת העמוד
                  </button>
                ) : null}
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default function VisualSitePagesPanel({
  open,
  editor,
  pages,
  activePageId,
  onClose,
  onSelectPage,
  onAddPage,
  onPageAction,
}: VisualSitePagesPanelProps) {
  const [menuPageId, setMenuPageId] = useState("");
  const [menuAnchor, setMenuAnchor] = useState<MenuAnchor | null>(null);
  const [parentPickerPageId, setParentPickerPageId] = useState("");
  const [draggingPageId, setDraggingPageId] = useState("");
  const [dropTargetId, setDropTargetId] = useState("");
  const [dropPlacement, setDropPlacement] =
    useState<PageTreeMovePlacement | null>(null);
  const [expandedPages, setExpandedPages] = useState<Record<string, boolean>>(
    {},
  );
  const [liveSections, setLiveSections] = useState<VisualSectionItem[]>([]);
  const dropTargetRef = useRef<{ id: string; placement: PageTreeMovePlacement } | null>(
    null,
  );
  const pointerYRef = useRef(0);
  const stopPointerTrackingRef = useRef<(() => void) | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const pageRows = useMemo(() => buildPageTreeRows(pages), [pages]);
  const pageById = useMemo(
    () => new Map(pages.map((page) => [page.id, page])),
    [pages],
  );
  const singlePageMode = pages.length <= 1;
  const selectedSectionId = String(editor?.selectedElement?.id || "").trim();

  const getSectionsForPage = (page: VisualSitePageItem): VisualSectionItem[] => {
    if (page.id === activePageId && liveSections.length) {
      return liveSections;
    }
    if (page.id === activePageId && typeof editor?.getSectionItems === "function") {
      return editor.getSectionItems();
    }
    return collectSectionItemsFromVisualData(page.pageData || {}, page.id);
  };

  useEffect(() => {
    if (!open) return;

    if (singlePageMode && pages[0]?.id) {
      setExpandedPages({ [pages[0].id]: true });
      return;
    }

    if (activePageId) {
      setExpandedPages((current) => ({
        ...current,
        [activePageId]: true,
      }));
    }
  }, [open, activePageId, singlePageMode, pages]);

  useEffect(() => {
    if (!open || !activePageId) return;

    const refresh = () => {
      if (typeof editor?.getSectionItems !== "function") return;
      const next = editor.getSectionItems();
      setLiveSections(Array.isArray(next) ? next : []);
    };

    refresh();
    const timer = window.setInterval(refresh, 1200);
    return () => window.clearInterval(timer);
  }, [open, activePageId, editor?.data, editor?.getSectionItems, editor?.selectedElement?.id]);
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

    stopPointerTrackingRef.current?.();
    const onPointerMove = (pointerEvent: PointerEvent) => {
      pointerYRef.current = pointerEvent.clientY;
    };
    if (event.activatorEvent instanceof PointerEvent) {
      pointerYRef.current = event.activatorEvent.clientY;
    }
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    stopPointerTrackingRef.current = () => {
      window.removeEventListener("pointermove", onPointerMove);
      stopPointerTrackingRef.current = null;
    };
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

    const placement = getDropPlacement(event.over?.rect, pointerYRef.current);
    setDropTargetId(overId);
    setDropPlacement(placement);
    dropTargetRef.current = { id: overId, placement };
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const activeId = String(event.active.id || "");
    const stored = dropTargetRef.current;
    const overId =
      String(event.over?.id || "") || String(stored?.id || "");
    const placement =
      stored?.placement ||
      getDropPlacement(event.over?.rect, pointerYRef.current) ||
      "after";

    stopPointerTrackingRef.current?.();
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
    stopPointerTrackingRef.current?.();
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
      if (!page) return;

      if (resolvePageParentId(page)) {
        onPageAction("subpage", pageId, { parentPageId: "" });
        setMenuPageId("");
        setMenuAnchor(null);
        return;
      }

      setParentPickerPageId(pageId);
      setMenuPageId("");
      setMenuAnchor(null);
      return;
    }

    onPageAction(action, pageId);
    setMenuPageId("");
    setMenuAnchor(null);
  };

  const parentPickerPage =
    pages.find((page) => page.id === parentPickerPageId) || null;
  const parentPickerOptions = parentPickerPage
    ? pages.filter((page) => {
        if (page.id === parentPickerPage.id) return false;
        if (wouldCreatePageCycle(pages, parentPickerPage.id, page.id)) {
          return false;
        }
        return true;
      })
    : [];

  const parentPickerPortal =
    parentPickerPage && typeof document !== "undefined"
      ? createPortal(
          <div
            className="fixed inset-0 z-[2147483647] flex items-center justify-center border border-violet-200/80 bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 text-slate-800/35 p-4"
            dir="rtl"
            onClick={() => setParentPickerPageId("")}
          >
            <div
              className="w-full max-w-sm overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_24px_64px_rgba(15,23,42,0.28)]"
              onClick={(event) => event.stopPropagation()}
              role="dialog"
              aria-label="בחירת עמוד אב"
            >
              <div className="border-b border-slate-100 px-4 py-3">
                <h3 className="text-sm font-black text-slate-800">
                  בחירת עמוד אב
                </h3>
                <p className="mt-1 text-[12px] font-bold leading-5 text-slate-500">
                  "{parentPickerPage.title}" יהיה עמוד משנה תחת העמוד שתבחרו
                </p>
              </div>
              <div className="max-h-[50vh] overflow-y-auto p-2">
                {parentPickerOptions.length ? (
                  parentPickerOptions.map((page) => (
                    <button
                      key={page.id}
                      type="button"
                      onClick={() => {
                        onPageAction?.("subpage", parentPickerPage.id, {
                          parentPageId: page.id,
                        });
                        setParentPickerPageId("");
                      }}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-right text-[13px] font-bold text-slate-800 transition hover:bg-violet-50"
                    >
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                        {page.isHome ? (
                          <Home className="h-4 w-4" />
                        ) : (
                          <FileText className="h-4 w-4" />
                        )}
                      </span>
                      <span className="min-w-0 flex-1 truncate">
                        {page.title || "עמוד"}
                      </span>
                    </button>
                  ))
                ) : (
                  <p className="px-3 py-4 text-center text-[12px] font-bold text-slate-500">
                    אין עמודים זמינים לקינון
                  </p>
                )}
              </div>
              <div className="border-t border-slate-100 p-2">
                <button
                  type="button"
                  onClick={() => setParentPickerPageId("")}
                  className="flex h-10 w-full items-center justify-center rounded-xl bg-slate-50 text-sm font-black text-slate-600 transition hover:bg-slate-100"
                >
                  ביטול
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )
      : null;

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
      {menuPortal}
      {parentPickerPortal}
      <aside
        className="absolute inset-y-0 right-0 z-[2147483000] flex w-[320px] max-w-[92vw] flex-col border-l border-slate-200/80 bg-gradient-to-b from-slate-50 via-white to-white shadow-[-18px_0_50px_rgba(15,23,42,0.12)]"
        dir="rtl"
      >
        <div className="min-h-0 flex-1 overflow-y-auto p-3">
          <div className="mb-3 rounded-2xl border border-slate-200/80 bg-white/95 p-3 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h2 className="text-sm font-black text-slate-800">תפריט האתר</h2>
                <p className="mt-1 text-[11px] font-bold leading-5 text-slate-500">
                  {singlePageMode
                    ? "העמוד והסקשנים שלו"
                    : `${pages.length} עמודים · גרירה למרכז השורה = עמוד משנה`}
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
            collisionDetection={pageListCollisionDetection}
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
                  const expanded = singlePageMode
                    ? true
                    : Boolean(expandedPages[page.id]);
                  const dropHint =
                    dropTargetId === page.id && draggingPageId !== page.id
                      ? dropPlacement
                      : null;
                  const parentId = resolvePageParentId(page);
                  const parentTitle = parentId
                    ? pageById.get(parentId)?.title || "עמוד"
                    : undefined;
                  const sections = expanded ? getSectionsForPage(page) : [];

                  return (
                    <SortablePageRow
                      key={page.id}
                      page={page}
                      depth={depth}
                      parentTitle={parentTitle}
                      isActive={isActive}
                      expanded={expanded}
                      sections={sections}
                      sectionsLoading={isActive && expanded && !sections.length}
                      menuOpen={menuOpen}
                      dropHint={dropHint}
                      isDraggingGlobal={Boolean(draggingPageId)}
                      selectedSectionId={selectedSectionId}
                      onToggleExpand={() => {
                        if (singlePageMode) return;
                        setExpandedPages((current) => ({
                          ...current,
                          [page.id]: !expanded,
                        }));
                      }}
                      onSelectPage={() => onSelectPage(page.id)}
                      onSelectSection={(sectionKey) => {
                        editor?.selectByElementId?.(sectionKey);
                      }}
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
                    <span className="block truncate text-sm font-black text-slate-800">
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
    </>
  );
}
