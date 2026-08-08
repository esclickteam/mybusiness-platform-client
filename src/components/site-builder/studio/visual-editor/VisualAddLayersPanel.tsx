import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
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
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  ArrowDownToLine,
  ArrowUpToLine,
  Code2,
  Eye,
  EyeOff,
  FileText,
  GripVertical,
  Grid3X3,
  Heart,
  ImagePlus,
  Layers3,
  Lock,
  Monitor,
  MousePointer2,
  PanelTop,
  Plus,
  Puzzle,
  RefreshCw,
  Save,
  Search,
  Smartphone,
  Sparkles,
  Trash2,
  Undo2,
  Upload,
  WandSparkles,
  Video,
  X,
} from "lucide-react";

import ProfessionalMediaBrowser from "./library/ProfessionalMediaBrowser";
import AnimatedIconBrowser from "./library/AnimatedIconBrowser";
import LottieAnimationBrowser from "./library/LottieAnimationBrowser";
import {
  SECTION_LIBRARY,
  getSectionsByCategory,
} from "./library/sectionLibrary";
import {
  PORTAL_SECTION_KIND_NAV,
  SECTION_LIBRARY_NAV,
  type SectionLibraryNavId,
} from "./library/sectionCategories";
import SectionTemplateCanvasPreview from "./library/SectionTemplateCanvasPreview";
import PageLibraryCardPreview from "./library/PageLibraryCardPreview";
import {
  resolveVisualSectionTheme,
  shouldLockLibraryPalette,
} from "./library/sectionTheme";
import {
  PAGE_LIBRARY,
  PAGE_LIBRARY_NAV,
  PORTAL_PAGE_KIND_NAV,
  getPagesByCategory,
} from "./library/pageLibrary";
import type {
  VisualLibraryPageTemplate,
  VisualLibrarySectionTemplate,
} from "./library/visualLibraryTypes";
import { ELEMENT_LIBRARY } from "./library/elementLibrary";

import VisualPluginsAddPanel from "./VisualPluginsAddPanel";
import {
  createExampleClientFields,
  fetchConfiguredClientFields,
  type ConfiguredClientField,
} from "../../../../pages/business/dashboardPages/crmpages/clientCustomFieldsApi";

type PanelMode = "add" | "layers" | "code" | null;
type AddPanelTab =
  | "elements"
  | "sections"
  | "pages"
  | "plugins"
  | "icons"
  | "animations"
  | "media";

type ElementCategory =
  | "all"
  | "text"
  | "buttons"
  | "media"
  | "shapes"
  | "crm"
  | "cards"
  | "tables"
  | "forms"
  | "lists"
  | "more";

function sampleCrmFieldValue(field: ConfiguredClientField) {
  // Editor samples must look like placeholders — not real shared client values.
  if (field.type === "table") return "[טבלה מהתיק]";
  if (field.type === "summary") return "[סיכום מהתיק]";
  if (field.type === "number") return "[מספר]";
  return `[${field.label || "ערך מהתיק"}]`;
}

function mapLibraryCategoryToPanel(
  category: string,
): Exclude<ElementCategory, "all"> {
  if (category === "text") return "text";
  if (category === "buttons") return "buttons";
  if (category === "images" || category === "video" || category === "gallery") {
    return "media";
  }
  if (category === "shapes" || category === "graphics") return "shapes";
  if (category === "dynamic" || category === "crm") return "crm";
  if (category === "cards") return "cards";
  if (category === "tables") return "tables";
  if (category === "forms") return "forms";
  if (category === "lists") return "lists";
  if (
    category === "embed" ||
    category === "contact" ||
    category === "apps" ||
    category === "social" ||
    category === "menu"
  ) {
    return "more";
  }
  return "more";
}

type SectionQuickFilter = "all" | "recommended" | "recent" | "favorites";

function readStoredSectionIds(key: string) {
  try {
    const value = JSON.parse(localStorage.getItem(key) || "[]");
    return Array.isArray(value) ? value.map(String).slice(0, 24) : [];
  } catch {
    return [];
  }
}

function storeSectionIds(key: string, ids: string[]) {
  try {
    localStorage.setItem(key, JSON.stringify(ids));
  } catch {
    // Favorites and recent items are optional enhancements.
  }
}

type VisualAddLayersPanelProps = {
  editor: any;
  mode: PanelMode;
  onClose: () => void;
  onAddHtml?: (
    html: string,
  ) => string | void | Promise<string | void>;
  onAddLibraryPage?: (page: VisualLibraryPageTemplate) => void;
  preferredAddTab?: AddPanelTab;
  siteId?: string;
  /** Show אזור אישי pages/sections only when the plugin is installed. */
  clientPortalPluginEnabled?: boolean;
  onOverlayInstalled?: () => void;
};

type LayerItem = {
  id: string;
  label: string;
  type: string;
  zIndex: number;
  hidden?: boolean;
  locked?: boolean;
  inserted?: boolean;
};

type SectionItem = {
  id: string;
  key: string;
  label: string;
  pinned: boolean;
  inserted: boolean;
  elementId: string;
};

function SortableSectionRow({
  item,
  active,
  onSelect,
}: {
  item: SectionItem;
  active: boolean;
  onSelect: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: item.key,
    disabled: item.pinned,
    animateLayoutChanges: () => false,
  });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition: isDragging ? undefined : transition,
        opacity: isDragging ? 0.25 : 1,
        zIndex: isDragging ? 20 : 1,
        willChange: isDragging ? "transform" : undefined,
      }}
      className={[
        "flex items-center gap-2 rounded-2xl border px-2 py-2",
        active
          ? "border-violet-400 bg-violet-50 shadow-sm"
          : "border-slate-200 bg-white",
        item.pinned ? "opacity-80" : "",
        isDragging ? "shadow-lg ring-2 ring-violet-300" : "",
      ].join(" ")}
    >
      <button
        type="button"
        className={[
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl touch-none",
          item.pinned
            ? "cursor-default text-slate-300"
            : "cursor-grab text-slate-400 hover:bg-slate-100 hover:text-violet-600 active:cursor-grabbing",
        ].join(" ")}
        title={
          item.pinned
            ? "בלוק קבוע"
            : "גרור לשינוי סדר"
        }
        aria-label={
          item.pinned
            ? "בלוק קבוע"
            : "גרירת בלוק"
        }
        {...(item.pinned ? {} : { ...attributes, ...listeners })}
      >
        {item.pinned ? (
          <Lock className="h-4 w-4" />
        ) : (
          <GripVertical className="h-4 w-4" />
        )}
      </button>

      <button
        type="button"
        onClick={onSelect}
        className="min-w-0 flex-1 rounded-xl px-1 py-1 text-right"
      >
        <span className="block truncate text-sm font-black text-slate-900">
          {item.label}
        </span>
        <span className="block truncate text-[11px] font-bold text-slate-400">
          {item.pinned
            ? "קבוע"
            : item.inserted
              ? "סקשן לעריכה"
              : "תבנית · ניתן לעריכה"}
        </span>
      </button>
    </div>
  );
}

type LibraryElement = {
  id: string;
  title: string;
  description: string;
  category: Exclude<ElementCategory, "all">;
  preview:
    | "heading"
    | "paragraph"
    | "button"
    | "image"
    | "video"
    | "box"
    | "divider"
    | "crm"
    | "raw"
    | "html";
  previewHtml?: string;
  thumbnail?: string;
  barePreview?: boolean;
  action: () => void | Promise<any>;
};

const ELEMENT_CATEGORY_LABELS: Array<{
  id: ElementCategory;
  label: string;
}> = [
  { id: "all", label: "הכול" },
  { id: "text", label: "טקסט" },
  { id: "buttons", label: "כפתורים" },
  { id: "media", label: "מדיה" },
  { id: "shapes", label: "קופסאות וצורות" },
  { id: "crm", label: "נתונים משתנים" },
  { id: "cards", label: "כרטיסיות" },
  { id: "tables", label: "טבלאות" },
  { id: "forms", label: "טפסים" },
  { id: "lists", label: "רשימות" },
  { id: "more", label: "עוד" },
];

function CodeField({
  label,
  value,
  onChange,
  placeholder,
  rows = 7,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  rows?: number;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-black text-slate-800">
        {label}
      </span>

      <textarea
        dir="ltr"
        rows={rows}
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder={placeholder}
        spellCheck={false}
        className="w-full resize-y rounded-2xl border border-slate-200 border border-violet-200/80 bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 text-slate-800 p-3 font-mono text-xs leading-6 text-emerald-300 outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
      />
    </label>
  );
}

function ElementPreview({
  kind,
  previewHtml,
  thumbnail,
  barePreview,
}: {
  kind: LibraryElement["preview"];
  previewHtml?: string;
  thumbnail?: string;
  barePreview?: boolean;
}) {
  if (barePreview || kind === "raw") {
    return (
      <div className="flex h-full items-center justify-center bg-transparent px-4">
        {previewHtml ? (
          <div
            className="w-full"
            dangerouslySetInnerHTML={{ __html: previewHtml }}
          />
        ) : (
          <span className="text-3xl font-black tracking-tight text-slate-900">
            72
          </span>
        )}
      </div>
    );
  }

  if (thumbnail) {
    return (
      <div className="h-full w-full overflow-hidden bg-slate-100">
        <img
          src={thumbnail}
          alt=""
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </div>
    );
  }

  if (previewHtml || kind === "html") {
    return (
      <div className="flex h-full items-center justify-center bg-[#f8fafc] px-3 py-2">
        <div
          className="w-full max-h-full overflow-hidden"
          dangerouslySetInnerHTML={{
            __html: previewHtml || "",
          }}
        />
      </div>
    );
  }

  if (kind === "heading") {
    return (
      <div className="flex h-full items-center justify-center bg-white px-6">
        <div className="w-full text-center">
          <div className="mx-auto h-3 w-24 rounded-full bg-gradient-to-l from-violet-50 via-sky-50 to-cyan-50 border border-violet-100/80 text-slate-800" />
          <div className="mx-auto mt-3 h-2 w-40 rounded-full bg-slate-300" />
        </div>
      </div>
    );
  }

  if (kind === "paragraph") {
    return (
      <div className="flex h-full items-center justify-center bg-white px-7">
        <div className="w-full space-y-2">
          <div className="h-2 w-full rounded-full bg-slate-500" />
          <div className="h-2 w-5/6 rounded-full bg-slate-300" />
          <div className="h-2 w-2/3 rounded-full bg-slate-300" />
        </div>
      </div>
    );
  }

  if (kind === "button") {
    return (
      <div className="flex h-full items-center justify-center bg-white">
        <div className="rounded-full bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 border border-violet-200/70 px-8 py-3 text-xs font-black text-black shadow-lg shadow-violet-200">
          לחצו כאן
        </div>
      </div>
    );
  }

  if (kind === "image") {
    return (
      <div className="relative h-full overflow-hidden bg-gradient-to-br from-sky-100 via-indigo-100 to-violet-200">
        <div className="absolute bottom-0 left-0 h-16 w-24 rounded-tr-[70px] bg-emerald-300/80" />
        <div className="absolute right-7 top-5 h-10 w-10 rounded-full bg-amber-300" />
        <div className="absolute bottom-5 right-6 h-11 w-28 rounded-2xl bg-white/75 backdrop-blur" />
      </div>
    );
  }

  if (kind === "video") {
    return (
      <div className="relative flex h-full items-center justify-center overflow-hidden bg-gradient-to-l from-violet-50 via-sky-50 to-cyan-50 border border-violet-100/80 text-slate-800">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-700/70 to-sky-500/30" />
        <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-xl">
          <Video className="h-5 w-5 text-slate-800" />
        </div>
      </div>
    );
  }

  if (kind === "box") {
    return (
      <div className="flex h-full items-center justify-center bg-slate-50 p-5">
        <div className="h-full w-full rounded-[28px] border border-slate-300 bg-white shadow-[0_14px_30px_rgba(15,23,42,0.08)]" />
      </div>
    );
  }

  if (kind === "crm") {
    // Raw data preview only — no card chrome behind the CRM value.
    return (
      <div className="flex h-full flex-col items-center justify-center bg-transparent px-3">
        {previewHtml ? (
          <div
            className="w-full text-center"
            dangerouslySetInnerHTML={{ __html: previewHtml }}
          />
        ) : (
          <span className="text-3xl font-black tracking-tight text-slate-900">
            4
          </span>
        )}
        <span className="mt-2 text-[10px] font-bold text-slate-400">
          מתעדכן מה-CRM
        </span>
      </div>
    );
  }

  return (
    <div className="flex h-full items-center justify-center bg-white px-8">
      <div className="h-1 w-full rounded-full bg-gradient-to-l from-violet-50 via-sky-50 to-cyan-50 border border-violet-100/80 text-slate-800" />
    </div>
  );
}

function NavigationButton({
  active,
  icon,
  label,
  onClick,
}: {
  active: boolean;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "group flex w-full flex-col items-center gap-2 rounded-xl px-2 py-3 text-[11px] font-bold transition",
        active
          ? "bg-slate-100 text-slate-800"
          : "text-slate-500 hover:bg-slate-50 hover:text-slate-800",
      ].join(" ")}
    >
      <span
        className={[
          "flex h-9 w-9 items-center justify-center rounded-lg border transition",
          active
            ? "border-slate-200 bg-white text-slate-800 shadow-sm"
            : "border-transparent bg-slate-50 text-slate-500 group-hover:border-slate-200 group-hover:bg-white",
        ].join(" ")}
      >
        {icon}
      </span>
      {label}
    </button>
  );
}

export default function VisualAddLayersPanel({
  editor,
  mode,
  onClose,
  onAddHtml,
  onAddLibraryPage,
  preferredAddTab = "sections",
  siteId,
  clientPortalPluginEnabled = false,
  onOverlayInstalled,
}: VisualAddLayersPanelProps) {
  const [layers, setLayers] =
    useState<LayerItem[]>([]);
  const [sections, setSections] = useState<SectionItem[]>([]);
  const [activeSectionId, setActiveSectionId] = useState<string | null>(
    null,
  );
  const [addTab, setAddTab] = useState<AddPanelTab>("sections");
  const sectionSensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 3 },
    }),
  );
  const isSectionDraggingRef = useRef(false);
  const sectionsRef = useRef<SectionItem[]>([]);
  sectionsRef.current = sections;
  const [elementCategory, setElementCategory] =
    useState<ElementCategory>("all");
  const [tableRows, setTableRows] = useState(3);
  const [tableCols, setTableCols] = useState(3);
  const [crmFields, setCrmFields] = useState<ConfiguredClientField[]>([]);
  const [sectionCategory, setSectionCategory] =
    useState<SectionLibraryNavId>("all");
  const businessId = String((editor as any)?.businessId || "").trim();
  const [sectionQuickFilter, setSectionQuickFilter] =
    useState<SectionQuickFilter>("recommended");
  /** Regular site library vs post-login personal-area library. */
  const [pageLibraryMode, setPageLibraryMode] = useState<"site" | "portal">(
    "site",
  );
  const [sectionLibraryMode, setSectionLibraryMode] = useState<
    "site" | "portal"
  >("site");
  const [portalPageKind, setPortalPageKind] = useState("all");
  const [portalSectionKind, setPortalSectionKind] = useState("all");
  const [favoriteSectionIds, setFavoriteSectionIds] = useState<string[]>(() =>
    readStoredSectionIds("bizuply-favorite-sections"),
  );
  const [recentSectionIds, setRecentSectionIds] = useState<string[]>(() =>
    readStoredSectionIds("bizuply-recent-sections"),
  );
  const [previewSection, setPreviewSection] =
    useState<VisualLibrarySectionTemplate | null>(null);
  const [previewDevice, setPreviewDevice] =
    useState<"desktop" | "mobile">("desktop");
  const [lastAddedTitle, setLastAddedTitle] = useState("");
  const sectionScrollerRef = useRef<HTMLDivElement>(null);
  const [sectionViewport, setSectionViewport] = useState({
    width: 900,
    height: 600,
    scrollTop: 0,
  });
  const [pageCategory, setPageCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [mediaQuery, setMediaQuery] = useState("");

  const [codeScope, setCodeScope] = useState<"site" | "page">("site");
  const [codeDraft, setCodeDraft] = useState({
    enabled: true,
    css: "",
    headHtml: "",
    bodyStartHtml: "",
    bodyEndHtml: "",
    javascript: "",
  });

  const selectedElementId = String(
    editor?.selectedElement?.id || "",
  );
  const selectedInsertedElement =
    editor?.insertedElements?.[selectedElementId];
  const selectedInsertedSectionId =
    String(selectedInsertedElement?.sectionId || "").trim() ||
    (editor?.insertedSections?.[selectedElementId] ? selectedElementId : "");
  const canReplaceSelectedSection = Boolean(
    selectedInsertedSectionId &&
      typeof editor?.replaceSelectedSectionWithLibrary === "function",
  );
  const sectionTheme = useMemo(
    () =>
      resolveVisualSectionTheme(
        editor?.renderer?.key,
        editor?.canvasRef?.current,
      ),
    [editor?.renderer?.key, mode],
  );

  const refreshLayers = () => {
    const next =
      typeof editor?.getLayerItems === "function"
        ? editor.getLayerItems()
        : [];

    setLayers(Array.isArray(next) ? next : []);

    const nextSections =
      typeof editor?.getSectionItems === "function"
        ? editor.getSectionItems()
        : [];

    setSections(Array.isArray(nextSections) ? nextSections : []);
  };

  useEffect(() => {
    if (mode !== "layers") return;

    refreshLayers();

    const timer = window.setInterval(() => {
      if (isSectionDraggingRef.current) return;
      refreshLayers();
    }, 1200);

    return () => window.clearInterval(timer);
  }, [
    mode,
    editor?.data,
    editor?.selectedElement?.id,
    editor?.activePageId,
  ]);

  const sortableSectionIds = useMemo(
    () => sections.map((item) => item.key),
    [sections],
  );

  const activeSection = useMemo(
    () =>
      sections.find((item) => item.key === activeSectionId) ||
      null,
    [activeSectionId, sections],
  );

  const handleSectionDragStart = (event: DragStartEvent) => {
    isSectionDraggingRef.current = true;
    setActiveSectionId(String(event.active.id || ""));
  };

  const handleSectionDragOver = (event: DragOverEvent) => {
    const activeId = String(event.active.id || "");
    const overId = String(event.over?.id || "");
    if (!activeId || !overId || activeId === overId) return;

    setSections((current) => {
      const from = current.findIndex((item) => item.key === activeId);
      const to = current.findIndex((item) => item.key === overId);

      if (
        from < 0 ||
        to < 0 ||
        current[from]?.pinned ||
        current[to]?.pinned
      ) {
        return current;
      }

      if (from === to) return current;
      return arrayMove(current, from, to);
    });
  };

  const handleSectionDragEnd = (_event: DragEndEvent) => {
    isSectionDraggingRef.current = false;
    setActiveSectionId(null);

    const orderedKeys = sectionsRef.current
      .filter((item) => !item.pinned)
      .map((item) => item.key);

    if (orderedKeys.length) {
      editor?.applySectionOrder?.(orderedKeys);
    }

    window.setTimeout(() => {
      if (!isSectionDraggingRef.current) refreshLayers();
    }, 80);
  };

  useEffect(() => {
    if (mode !== "code") return;

    const source =
      codeScope === "site"
        ? editor?.siteCustomCode
        : editor?.pageCustomCode || editor?.customCode;

    setCodeDraft({
      enabled: source?.enabled !== false,
      css: String(source?.css || ""),
      headHtml: String(source?.headHtml || ""),
      bodyStartHtml: String(source?.bodyStartHtml || ""),
      bodyEndHtml: String(source?.bodyEndHtml || ""),
      javascript: String(source?.javascript || ""),
    });
  }, [
    mode,
    codeScope,
    editor?.siteCustomCode,
    editor?.pageCustomCode,
    editor?.customCode,
  ]);

  useEffect(() => {
    if (mode !== "add") return;

    setAddTab(preferredAddTab || "sections");
    setElementCategory("all");
    setSectionQuickFilter("recommended");
    setPreviewSection(null);
    setSearchQuery("");
    setMediaQuery("");
  }, [mode, preferredAddTab]);

  useEffect(() => {
    let cancelled = false;
    if (!clientPortalPluginEnabled) {
      setCrmFields([]);
      return;
    }
    if (!businessId) {
      setCrmFields(createExampleClientFields());
      return;
    }

    void fetchConfiguredClientFields(businessId)
      .then((fields) => {
        if (cancelled) return;
        const active = fields.filter((field) => field.active !== false);
        setCrmFields(active.length ? active : createExampleClientFields());
      })
      .catch(() => {
        if (!cancelled) setCrmFields(createExampleClientFields());
      });

    return () => {
      cancelled = true;
    };
  }, [businessId, clientPortalPluginEnabled]);

  useEffect(() => {
    if (!clientPortalPluginEnabled && elementCategory === "crm") {
      setElementCategory("all");
    }
  }, [clientPortalPluginEnabled, elementCategory]);

  useEffect(() => {
    if (mode !== "add") return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (previewSection) {
        setPreviewSection(null);
        return;
      }
      onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mode, onClose, previewSection]);

  const closeAfter = (
    action: () => void | Promise<any>,
  ) => {
    // סוגרים את פאנל ההוספה מיד אחרי שהוספנו סקשן / אלמנט
    void Promise.resolve(action()).finally(() => {
      onClose();
    });
  };

  const elements = useMemo<LibraryElement[]>(() => {
    const quickPrimitives: LibraryElement[] = [
      {
        id: "heading",
        title: "כותרת",
        description: "כותרת גדולה ומודגשת",
        category: "text",
        preview: "heading",
        action: () => editor?.addText?.(),
      },
      {
        id: "paragraph",
        title: "פסקת טקסט",
        description: "טקסט חופשי לתוכן והסברים",
        category: "text",
        preview: "paragraph",
        action: () => editor?.addText?.(),
      },
      {
        id: "button",
        title: "כפתור מעוצב",
        description: "כפתור עצמאי עם קישור",
        category: "buttons",
        preview: "button",
        action: () => editor?.addButton?.(),
      },
      {
        id: "image",
        title: "תמונה",
        description: "העלאה מהמחשב והחלפה חופשית",
        category: "media",
        preview: "image",
        action: () => editor?.addImage?.(),
      },
      {
        id: "video",
        title: "סרטון",
        description: "וידאו אוטומטי, מושתק ובלולאה",
        category: "media",
        preview: "video",
        action: () => editor?.addVideo?.(),
      },
      {
        id: "box",
        title: "קופסה מעוצבת",
        description: "רקע, מסגרת או שכבת תוכן",
        category: "shapes",
        preview: "box",
        action: () => editor?.addBox?.(),
      },
      {
        id: "divider",
        title: "קו מפריד",
        description: "קו עצמאי לגרירה וצביעה",
        category: "shapes",
        preview: "divider",
        action: () => editor?.addDivider?.(),
      },
    ];

    // Personal-area only: CRM dynamic fields require the client-portal plugin.
    // Each field inserts TWO nodes (name + value) so they can be positioned separately.
    const liveCrmItems: LibraryElement[] = !clientPortalPluginEnabled
      ? []
      : [
          {
            id: "crm-field-greeting",
            title: "שלום, שם לקוח",
            description:
              "ברכה אישית — אחרי התחברות מוצג שם הלקוח מהאזור האישי / CRM",
            category: "crm",
            preview: "crm",
            barePreview: true,
            previewHtml:
              '<div style="font-size:20px;font-weight:800;color:#0f172a;white-space:nowrap">שלום, [שם לקוח]</div>',
            action: () =>
              editor?.addCrmField?.({
                fieldKey: "client_name",
                label: "שם לקוח",
                sampleValue: "[שם לקוח]",
                format: "greeting",
                asPair: false,
              }),
          },
          {
            id: "crm-field-client-name",
            title: "שם לקוח",
            description:
              "שני שדות נפרדים: שם + ערך · הערך משתנה לפי הלקוח המחובר",
            category: "crm",
            preview: "crm",
            barePreview: true,
            previewHtml:
              '<div style="font-size:14px;font-weight:800;color:#64748b">שם לקוח</div><div style="font-size:22px;font-weight:800;color:#0f172a">[שם לקוח]</div>',
            action: () =>
              editor?.addCrmField?.({
                fieldKey: "client_name",
                label: "שם לקוח",
                sampleValue: "[שם לקוח]",
                asPair: true,
              }),
          },
          {
            id: "crm-field-generic",
            title: "נתון משתנה מה-CRM",
            description:
              "מוסיף שני שדות נפרדים (שם + ערך) — השם זהה לכל הלקוחות, הערך אישי מהתיק",
            category: "crm",
            preview: "crm",
            barePreview: true,
            previewHtml:
              '<div style="font-size:14px;font-weight:800;color:#64748b">שם הנתון</div><div style="font-size:22px;font-weight:800;color:#0f172a">[ערך מהתיק]</div>',
            action: () =>
              editor?.addCrmField?.({
                label: "שם הנתון",
                sampleValue: "[ערך מהתיק]",
                asPair: true,
              }),
          },
          ...crmFields
            .filter((field) => {
              const key = String(field.key || "").trim();
              // Built-in greeting / name entries cover these portal member fields.
              return key !== "client_name" && key !== "fullName";
            })
            .map((field) => {
              const sampleValue = sampleCrmFieldValue(field);
              const label = field.label || field.key;
              return {
                id: `crm-field-${field.key}`,
                title: label,
                description: `שני שדות: ${label} + ערך אישי מהתיק`,
                category: "crm" as const,
                preview: "crm" as const,
                barePreview: true,
                previewHtml: `<div style="font-size:14px;font-weight:800;color:#64748b;text-align:right">${label}</div><div style="font-size:22px;font-weight:800;color:#0f172a;text-align:right">${sampleValue}</div>`,
                action: () =>
                  editor?.addCrmField?.({
                    fieldKey: field.key,
                    label,
                    sampleValue,
                    asPair: true,
                  }),
              };
            }),
        ];

    // Prefer curated library entries (skip the huge generated button/lottie dumps
    // in the main grid — those remain available via Icons / Animations tabs).
    // Skip static CRM duplicates — live CRM fields from the business take priority.
    const libraryItems: LibraryElement[] = ELEMENT_LIBRARY.filter((item) => {
      const id = String(item.id || "");
      if (id.startsWith("button-lib-") || id.startsWith("lottie-")) return false;
      if (
        id.startsWith("crm-raw-") ||
        id.startsWith("crm-label-") ||
        id.startsWith("crm-generic") ||
        id.startsWith("crm-field-")
      ) {
        return false;
      }
      const category = mapLibraryCategoryToPanel(item.category);
      if (category === "crm" && !clientPortalPluginEnabled) return false;
      return true;
    }).map((item) => {
      const category = mapLibraryCategoryToPanel(item.category);
      const isCrm = category === "crm";
      return {
        id: item.id,
        title: item.title,
        description: item.description,
        category,
        preview: isCrm
          ? ("crm" as const)
          : item.previewHtml
            ? ("html" as const)
            : item.thumbnail
              ? ("image" as const)
              : ("box" as const),
        previewHtml: item.previewHtml,
        thumbnail: item.thumbnail,
        barePreview: isCrm,
        action: () => editor?.addLibraryElement?.(item.id),
      };
    });

    const seen = new Set<string>();
    const merged: LibraryElement[] = [];
    [...quickPrimitives, ...liveCrmItems, ...libraryItems].forEach((item) => {
      if (seen.has(item.id)) return;
      seen.add(item.id);
      merged.push(item);
    });
    return merged;
  }, [clientPortalPluginEnabled, crmFields, editor]);

  const visibleElementCategories = useMemo(
    () =>
      ELEMENT_CATEGORY_LABELS.filter(
        (item) => item.id !== "crm" || clientPortalPluginEnabled,
      ),
    [clientPortalPluginEnabled],
  );

  const filteredElements = useMemo(() => {
    const normalizedSearch = searchQuery
      .trim()
      .toLowerCase();

    return elements.filter((item) => {
      const matchesCategory =
        elementCategory === "all" ||
        item.category === elementCategory;

      const matchesSearch =
        !normalizedSearch ||
        `${item.title} ${item.description}`
          .toLowerCase()
          .includes(normalizedSearch);

      return matchesCategory && matchesSearch;
    });
  }, [
    elementCategory,
    elements,
    searchQuery,
  ]);

  const visibleSectionNav = SECTION_LIBRARY_NAV;
  const visiblePageNav = PAGE_LIBRARY_NAV;

  const filteredSections = useMemo(() => {
    const normalizedSearch = searchQuery.trim().toLowerCase();

    if (sectionLibraryMode === "portal") {
      if (!clientPortalPluginEnabled) return [];
      let base = SECTION_LIBRARY.filter((item) => item.category === "portal");
      if (portalSectionKind !== "all") {
        const nav = PORTAL_SECTION_KIND_NAV.find(
          (item) => item.id === portalSectionKind,
        );
        if (nav?.prefix) {
          base = base.filter((item) => item.id.startsWith(nav.prefix));
        }
      }
      return base.filter((item) => {
        if (!normalizedSearch) return true;
        return `${item.title} ${item.description} ${(item.keywords || []).join(" ")}`
          .toLowerCase()
          .includes(normalizedSearch);
      });
    }

    let base =
      sectionCategory === "blank"
        ? []
        : sectionCategory === "all"
          ? SECTION_LIBRARY.filter((item) => item.category !== "portal")
          : getSectionsByCategory(sectionCategory).filter(
              (item) => item.category !== "portal",
            );

    if (sectionQuickFilter === "favorites") {
      base = base.filter((item) => favoriteSectionIds.includes(item.id));
    } else if (sectionQuickFilter === "recent") {
      base = recentSectionIds
        .map((id) => base.find((item) => item.id === id))
        .filter(Boolean) as VisualLibrarySectionTemplate[];
    } else if (sectionQuickFilter === "recommended") {
      base = base
        .filter(
          (item, index) =>
            item.category === "hero" ||
            item.category === "about" ||
            item.category === "services" ||
            item.category === "contact" ||
            index < 18,
        )
        .slice(0, 36);
    }

    return base.filter((item) => {
      if (!normalizedSearch) return true;
      return `${item.title} ${item.description} ${(item.keywords || []).join(" ")}`
        .toLowerCase()
        .includes(normalizedSearch);
    });
  }, [
    clientPortalPluginEnabled,
    favoriteSectionIds,
    recentSectionIds,
    searchQuery,
    sectionCategory,
    sectionLibraryMode,
    sectionQuickFilter,
    portalSectionKind,
  ]);

  const filteredPages = useMemo(() => {
    const normalizedSearch = searchQuery.trim().toLowerCase();

    if (pageLibraryMode === "portal") {
      if (!clientPortalPluginEnabled) return [];
      let base = getPagesByCategory("portal");
      if (portalPageKind !== "all") {
        const nav = PORTAL_PAGE_KIND_NAV.find(
          (item) => item.id === portalPageKind,
        );
        if (nav?.keyword) {
          base = base.filter((item) =>
            (item.keywords || []).includes(nav.keyword),
          );
        }
      }
      return base.filter((item) => {
        if (!normalizedSearch) return true;
        return `${item.title} ${item.description} ${(item.keywords || []).join(" ")}`
          .toLowerCase()
          .includes(normalizedSearch);
      });
    }

    const base = getPagesByCategory(pageCategory).filter(
      (item) => item.category !== "portal",
    );

    return base.filter((item) => {
      if (!normalizedSearch) return true;
      return `${item.title} ${item.description} ${(item.keywords || []).join(" ")}`
        .toLowerCase()
        .includes(normalizedSearch);
    });
  }, [
    clientPortalPluginEnabled,
    searchQuery,
    pageCategory,
    pageLibraryMode,
    portalPageKind,
  ]);

  useEffect(() => {
    if (!clientPortalPluginEnabled && pageLibraryMode === "portal") {
      setPageLibraryMode("site");
    }
    if (!clientPortalPluginEnabled && sectionLibraryMode === "portal") {
      setSectionLibraryMode("site");
    }
  }, [clientPortalPluginEnabled, pageLibraryMode, sectionLibraryMode]);

  useEffect(() => {
    const node = sectionScrollerRef.current;
    if (!node || mode !== "add" || addTab !== "sections") return;

    const updateSize = () => {
      setSectionViewport((current) => ({
        ...current,
        width: node.clientWidth,
        height: node.clientHeight,
      }));
    };
    updateSize();

    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(updateSize);
    observer.observe(node);
    return () => observer.disconnect();
  }, [addTab, mode]);

  useEffect(() => {
    const node = sectionScrollerRef.current;
    if (node) node.scrollTop = 0;
    setSectionViewport((current) => ({ ...current, scrollTop: 0 }));
  }, [searchQuery, sectionCategory, sectionQuickFilter]);

  const virtualSectionGrid = useMemo(() => {
    const gap = 16;
    const cardHeight = 286;
    const columns = sectionViewport.width >= 900 ? 3 : 2;
    const contentWidth = Math.max(1, sectionViewport.width - 40);
    const columnWidth =
      (contentWidth - gap * (columns - 1)) / columns;
    const rowHeight = cardHeight + gap;
    const rowCount = Math.ceil(filteredSections.length / columns);
    const adjustedScrollTop = Math.max(0, sectionViewport.scrollTop - 76);
    const startRow = Math.max(
      0,
      Math.floor(adjustedScrollTop / rowHeight) - 2,
    );
    const endRow = Math.min(
      rowCount,
      Math.ceil(
        (adjustedScrollTop + sectionViewport.height) / rowHeight,
      ) + 2,
    );
    const startIndex = startRow * columns;
    const endIndex = Math.min(filteredSections.length, endRow * columns);

    return {
      height: rowCount * rowHeight,
      items: filteredSections
        .slice(startIndex, endIndex)
        .map((item, offset) => {
          const index = startIndex + offset;
          const row = Math.floor(index / columns);
          const column = index % columns;
          return {
            item,
            top: row * rowHeight,
            right: column * (columnWidth + gap),
            width: columnWidth,
            height: cardHeight,
          };
        }),
    };
  }, [filteredSections, sectionViewport]);

  const activeSectionCategoryLabel =
    sectionLibraryMode === "portal"
      ? PORTAL_SECTION_KIND_NAV.find((item) => item.id === portalSectionKind)
          ?.label || "עמודים אחרי התחברות"
      : SECTION_LIBRARY_NAV.find((item) => item.id === sectionCategory)
          ?.label || "הכול";

  const activePageCategoryLabel =
    pageLibraryMode === "portal"
      ? PORTAL_PAGE_KIND_NAV.find((item) => item.id === portalPageKind)?.label ||
        "עמודים אחרי התחברות"
      : PAGE_LIBRARY_NAV.find((item) => item.id === pageCategory)?.label ||
        "הכול";

  const handleAddLibraryPage = (page: VisualLibraryPageTemplate) => {
    closeAfter(() => {
      if (typeof onAddLibraryPage === "function") {
        onAddLibraryPage(page);
        return;
      }

      if (typeof editor?.addLibraryPage === "function") {
        editor.addLibraryPage(page.id);
      }
    });
  };

  const toggleFavoriteSection = (sectionId: string) => {
    setFavoriteSectionIds((current) => {
      const next = current.includes(sectionId)
        ? current.filter((id) => id !== sectionId)
        : [sectionId, ...current].slice(0, 48);
      storeSectionIds("bizuply-favorite-sections", next);
      return next;
    });
  };

  const handleAddLibrarySection = (item: VisualLibrarySectionTemplate) => {
    if (typeof editor?.addLibrarySection === "function") {
      editor.addLibrarySection(item.id);
    } else {
      editor?.addSection?.("after", undefined, item.id);
    }

    setRecentSectionIds((current) => {
      const next = [item.id, ...current.filter((id) => id !== item.id)].slice(
        0,
        16,
      );
      storeSectionIds("bizuply-recent-sections", next);
      return next;
    });
    setLastAddedTitle(
      item.category === "booking"
        ? `״${item.title}״ נוסף ומחובר ליומן ה-CRM`
        : `״${item.title}״ נוסף לעמוד`,
    );
    setPreviewSection(null);
  };

  const handleReplaceLibrarySection = (
    item: VisualLibrarySectionTemplate,
  ) => {
    if (!canReplaceSelectedSection) return;
    editor.replaceSelectedSectionWithLibrary(item.id);
    setLastAddedTitle(`״${item.title}״ הוחלף תוך שמירת התוכן`);
    setPreviewSection(null);
  };

  useEffect(() => {
    if (!lastAddedTitle) return;
    const timer = window.setTimeout(() => setLastAddedTitle(""), 5000);
    return () => window.clearTimeout(timer);
  }, [lastAddedTitle]);

  const selectedLayer = useMemo(
    () =>
      layers.find(
        (item) => item.id === selectedElementId,
      ) || null,
    [layers, selectedElementId],
  );

  if (!mode) return null;

  const panelClassName =
    mode === "add"
      ? "relative flex h-[min(88vh,900px)] w-[min(1420px,calc(100vw-40px))] max-h-[calc(100vh-40px)] overflow-hidden rounded-[20px] border border-slate-200 bg-white shadow-[0_32px_100px_rgba(15,23,42,0.28)]"
      : "fixed bottom-4 right-[80px] top-[64px] z-[2147483200] flex w-[480px] max-w-[calc(100vw-112px)] overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-[0_32px_100px_rgba(15,23,42,0.24)]";

  const title =
    mode === "add"
      ? addTab === "sections"
        ? "הוספת סקשן"
        : addTab === "pages"
          ? "הוספת עמוד"
          : addTab === "plugins"
            ? "תוספים"
            : "הוספת אלמנטים"
      : mode === "layers"
        ? "שכבות"
        : "קוד מותאם";

  return (
    <div
      className={
        mode === "add"
          ? "fixed inset-0 z-[2147483200] flex items-center justify-center border border-slate-200/80 bg-gradient-to-l from-slate-200/90 via-slate-100 to-sky-50 text-slate-800/45 p-5 backdrop-blur-[2px]"
          : "contents"
      }
      onMouseDown={(event) => {
        if (mode === "add" && event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <aside
        data-editor-only="true"
        data-bizuply-editor-only="true"
        className={panelClassName}
        dir="rtl"
        role={mode === "add" ? "dialog" : undefined}
        aria-modal={mode === "add" ? "true" : undefined}
        aria-label={mode === "add" ? title : undefined}
      >
      {mode === "add" ? (
        <>
          <nav className="flex w-[96px] shrink-0 flex-col border-l border-slate-200 bg-white p-3">
            <div className="mb-3 flex h-11 items-center justify-center">
              <Sparkles className="h-5 w-5 text-slate-700" />
            </div>

            <div className="space-y-2">
              <NavigationButton
                active={addTab === "elements"}
                icon={
                  <Grid3X3 className="h-5 w-5" />
                }
                label="אלמנטים"
                onClick={() =>
                  setAddTab("elements")
                }
              />

              <NavigationButton
                active={addTab === "sections"}
                icon={
                  <PanelTop className="h-5 w-5" />
                }
                label="סקשנים"
                onClick={() =>
                  setAddTab("sections")
                }
              />

              <NavigationButton
                active={addTab === "pages"}
                icon={
                  <FileText className="h-5 w-5" />
                }
                label="עמודים"
                onClick={() => setAddTab("pages")}
              />

              <NavigationButton
                active={addTab === "plugins"}
                icon={<Puzzle className="h-5 w-5" />}
                label="תוספים"
                onClick={() => setAddTab("plugins")}
              />

              <NavigationButton
                active={addTab === "icons"}
                icon={
                  <Grid3X3 className="h-5 w-5" />
                }
                label="אייקונים"
                onClick={() =>
                  setAddTab("icons")
                }
              />

              <NavigationButton
                active={addTab === "animations"}
                icon={
                  <WandSparkles className="h-5 w-5" />
                }
                label="אנימציות"
                onClick={() =>
                  setAddTab("animations")
                }
              />

              <NavigationButton
                active={addTab === "media"}
                icon={
                  <ImagePlus className="h-5 w-5" />
                }
                label="מדיה"
                onClick={() => setAddTab("media")}
              />
            </div>

            <div className="mt-auto">
              <button
                type="button"
                onClick={() =>
                  closeAfter(() =>
                    editor?.addImage?.(),
                  )
                }
                className="flex w-full flex-col items-center gap-2 rounded-2xl px-2 py-3 text-[11px] font-black text-slate-500 transition hover:bg-slate-50 hover:text-violet-700"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                  <Upload className="h-5 w-5" />
                </span>
                העלאה
              </button>
            </div>
          </nav>

          <div className="flex min-w-0 flex-1 flex-col">
            <header className="flex h-[74px] shrink-0 items-center justify-between border-b border-slate-200 px-6">
              <div>
                <h2 className="text-xl font-black text-slate-800">
                  {title}
                </h2>
                <p className="mt-1 text-xs font-bold text-slate-400">
                  {addTab === "icons"
                    ? "בחרו אייקון, צבע ואפקט והוסיפו לעמוד"
                    : addTab === "animations"
                      ? "בחרו אנימציית Lottie מקצועית והוסיפו לעמוד"
                      : addTab === "sections"
                        ? `${SECTION_LIBRARY.length} סקשנים · כל אחד נפתח לעריכה מלאה אחרי ההוספה`
                        : addTab === "pages"
                          ? `${PAGE_LIBRARY.length} תבניות עמוד · כל עמוד ניתן לעריכה חופשית`
                          : "בחרו אלמנט, סקשן או מדיה והוסיפו לעמוד"}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    closeAfter(() =>
                      editor?.addImage?.(),
                    )
                  }
                  className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-black text-violet-700 transition hover:border-violet-300 hover:bg-violet-50"
                >
                  <Upload className="h-4 w-4" />
                  העלאה
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition hover:bg-slate-200"
                  aria-label="סגירה"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </header>

            {addTab === "media" ? (
              <ProfessionalMediaBrowser
                editor={editor}
                query={mediaQuery}
                onQueryChange={setMediaQuery}
              />
            ) : addTab === "icons" ? (
              <AnimatedIconBrowser
                editor={editor}
                onInserted={() => {
                  window.setTimeout(
                    refreshLayers,
                    50,
                  );
                  onClose();
                }}
              />
            ) : addTab === "animations" ? (
              <LottieAnimationBrowser
                editor={editor}
                onAddHtml={onAddHtml}
                onInserted={() => {
                  window.setTimeout(
                    refreshLayers,
                    50,
                  );
                  onClose();
                }}
              />
            ) : addTab === "plugins" ? (
              <VisualPluginsAddPanel
                siteId={siteId}
                editor={editor}
                onAddLibraryPage={onAddLibraryPage}
                onAddHtml={onAddHtml}
                onAdded={(title) => setLastAddedTitle(title)}
                onOverlayInstalled={onOverlayInstalled}
              />
            ) : addTab === "pages" ? (
              <div className="flex min-h-0 flex-1 flex-col">
                <div className="shrink-0 border-b border-slate-200 bg-white px-6 py-4">
                  {clientPortalPluginEnabled ? (
                    <div className="mb-3 inline-flex rounded-xl border border-slate-200 bg-slate-50 p-1">
                      <button
                        type="button"
                        onClick={() => setPageLibraryMode("site")}
                        className={[
                          "rounded-lg px-3 py-1.5 text-xs font-black transition",
                          pageLibraryMode === "site"
                            ? "bg-white text-slate-900 shadow-sm"
                            : "text-slate-500 hover:text-slate-700",
                        ].join(" ")}
                      >
                        עמודי האתר
                      </button>
                      <button
                        type="button"
                        onClick={() => setPageLibraryMode("portal")}
                        className={[
                          "rounded-lg px-3 py-1.5 text-xs font-black transition",
                          pageLibraryMode === "portal"
                            ? "bg-white text-slate-900 shadow-sm"
                            : "text-slate-500 hover:text-slate-700",
                        ].join(" ")}
                      >
                        עמודים אחרי התחברות
                      </button>
                    </div>
                  ) : null}
                  <label className="flex h-12 items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 transition focus-within:border-slate-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-slate-100">
                    <Search className="h-5 w-5 shrink-0 text-slate-400" />

                    <input
                      type="search"
                      value={searchQuery}
                      onChange={(event) =>
                        setSearchQuery(event.target.value)
                      }
                      placeholder="חיפוש עמודים..."
                      className="min-w-0 flex-1 bg-transparent text-sm font-bold text-slate-800 outline-none placeholder:text-slate-400"
                    />
                  </label>
                </div>

                <div className="flex min-h-0 flex-1 overflow-hidden">
                  <aside className="w-[220px] shrink-0 overflow-y-auto border-l border-slate-200 bg-white p-3">
                    <p className="mb-3 px-2 text-[11px] font-black uppercase tracking-wide text-slate-400">
                      {pageLibraryMode === "portal"
                        ? "סוג עמוד"
                        : "קטגוריות"}
                    </p>
                    {(pageLibraryMode === "portal"
                      ? PORTAL_PAGE_KIND_NAV
                      : visiblePageNav
                    ).map((categoryItem) => (
                      <button
                        key={categoryItem.id}
                        type="button"
                        onClick={() => {
                          if (pageLibraryMode === "portal") {
                            setPortalPageKind(categoryItem.id);
                          } else {
                            setPageCategory(categoryItem.id);
                          }
                        }}
                        className={[
                          "mb-1 flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-right text-xs font-black transition",
                          (pageLibraryMode === "portal"
                            ? portalPageKind
                            : pageCategory) === categoryItem.id
                            ? "bg-slate-100 text-slate-800"
                            : "text-slate-600 hover:bg-slate-50",
                        ].join(" ")}
                      >
                        <span>{categoryItem.label}</span>
                        <span className="rounded-full bg-slate-200/70 px-1.5 py-0.5 text-[10px] font-black text-slate-500">
                          {pageLibraryMode === "portal"
                            ? categoryItem.id === "all"
                              ? getPagesByCategory("portal").length
                              : getPagesByCategory("portal").filter((page) =>
                                  (page.keywords || []).includes(
                                    (categoryItem as any).keyword || "",
                                  ),
                                ).length
                            : categoryItem.id === "all"
                              ? PAGE_LIBRARY.filter(
                                  (page) => page.category !== "portal",
                                ).length
                              : getPagesByCategory(categoryItem.id).filter(
                                  (page) => page.category !== "portal",
                                ).length}
                        </span>
                      </button>
                    ))}
                  </aside>

                  <div className="min-h-0 flex-1 overflow-y-auto bg-[#f7f8fb] p-5">
                    <div className="mb-4 flex items-center justify-between gap-3">
                      <div>
                        <h3 className="text-base font-black text-slate-800">
                          ספריית עמודים · {activePageCategoryLabel}
                        </h3>
                        <p className="mt-1 text-xs font-bold text-slate-400">
                          תבנית מקצועית שתיפתח לעריכה מלאה — כל סקשן ואלמנט ניתנים לשינוי
                        </p>
                      </div>

                      <span className="rounded-full bg-white px-3 py-1.5 text-xs font-black text-slate-500 shadow-sm">
                        {filteredPages.length} עמודים
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        const title =
                          window.prompt("שם העמוד החדש", "עמוד חדש") ||
                          "עמוד חדש";
                        handleAddLibraryPage({
                          id: "blank-editable-page",
                          kind: "page",
                          tab: "pages",
                          category: "hero",
                          title,
                          description: "עמוד ריק לעריכה מלאה",
                          slugSuggestion: "new-page",
                          keywords: ["ריק", "עריכה", "blank"],
                          sectionIds: [],
                        });
                      }}
                      className="mb-5 flex w-full items-center justify-between gap-4 overflow-hidden rounded-[22px] border border-dashed border-slate-300 bg-white px-5 py-4 text-right shadow-sm transition hover:-translate-y-0.5 hover:border-slate-500 hover:shadow-md"
                    >
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">
                          Start blank
                        </p>
                        <h4 className="mt-1 text-base font-black text-slate-900">
                          עמוד ריק לעריכה מלאה
                        </h4>
                        <p className="mt-1 text-xs font-bold text-slate-500">
                          בלי טבלה מובנית — מוסיפים סקשנים ואלמנטים כמו שרוצים
                        </p>
                      </div>
                      <span className="inline-flex h-11 items-center gap-2 rounded-2xl bg-slate-900 px-4 text-xs font-black text-white">
                        <Plus className="h-4 w-4" />
                        יצירה
                      </span>
                    </button>

                    <div className="grid grid-cols-2 gap-5 xl:grid-cols-3">
                      {filteredPages.map((page) => (
                        <button
                          key={page.id}
                          type="button"
                          onClick={() => handleAddLibraryPage(page)}
                          className="group overflow-hidden rounded-[18px] border border-slate-200 bg-white text-right shadow-[0_2px_12px_rgba(15,23,42,0.06)] transition duration-200 hover:-translate-y-1 hover:border-slate-400 hover:shadow-[0_18px_40px_rgba(15,23,42,0.14)]"
                        >
                          <div className="relative h-[340px] overflow-hidden border-b border-slate-100 bg-[#eef0f3]">
                            <PageLibraryCardPreview
                              page={page}
                              theme={sectionTheme}
                            />
                            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white/90 to-transparent" />
                            <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-black text-slate-700 shadow-sm backdrop-blur">
                              <Plus className="h-3 w-3" />
                              הוספה
                            </span>
                          </div>

                          <div className="flex items-start justify-between gap-3 p-4">
                            <div className="min-w-0">
                              <h4 className="truncate text-sm font-black text-slate-800">
                                {page.title}
                              </h4>
                              <p className="mt-1 line-clamp-2 text-xs font-bold leading-5 text-slate-400">
                                {page.description}
                              </p>
                              <p className="mt-2 text-[11px] font-black text-slate-500">
                                {page.sectionIds.length} סקשנים
                              </p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>

                    {filteredPages.length === 0 ? (
                      <div className="mt-10 rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
                        <p className="text-sm font-black text-slate-700">
                          לא נמצאו עמודים
                        </p>
                        <p className="mt-2 text-xs font-bold text-slate-400">
                          נסו חיפוש אחר או עברו לקטגוריה אחרת
                        </p>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex min-h-0 flex-1 flex-col">
                <div className="shrink-0 border-b border-slate-200 bg-white px-6 py-4">
                  {addTab === "sections" && clientPortalPluginEnabled ? (
                    <div className="mb-3 inline-flex rounded-xl border border-slate-200 bg-slate-50 p-1">
                      <button
                        type="button"
                        onClick={() => setSectionLibraryMode("site")}
                        className={[
                          "rounded-lg px-3 py-1.5 text-xs font-black transition",
                          sectionLibraryMode === "site"
                            ? "bg-white text-slate-900 shadow-sm"
                            : "text-slate-500 hover:text-slate-700",
                        ].join(" ")}
                      >
                        סקשני האתר
                      </button>
                      <button
                        type="button"
                        onClick={() => setSectionLibraryMode("portal")}
                        className={[
                          "rounded-lg px-3 py-1.5 text-xs font-black transition",
                          sectionLibraryMode === "portal"
                            ? "bg-white text-slate-900 shadow-sm"
                            : "text-slate-500 hover:text-slate-700",
                        ].join(" ")}
                      >
                        סקשנים אחרי התחברות
                      </button>
                    </div>
                  ) : null}
                  <label className="flex h-12 items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 transition focus-within:border-slate-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-slate-100">
                    <Search className="h-5 w-5 shrink-0 text-slate-400" />

                    <input
                      type="search"
                      value={searchQuery}
                      onChange={(event) =>
                        setSearchQuery(
                          event.target.value,
                        )
                      }
                      placeholder={
                        addTab === "sections"
                          ? "חיפוש סקשנים..."
                          : "חיפוש אלמנטים..."
                      }
                      className="min-w-0 flex-1 bg-transparent text-sm font-bold text-slate-800 outline-none placeholder:text-slate-400"
                    />
                  </label>

                  {addTab === "elements" ? (
                    <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
                      {visibleElementCategories.map(
                        (categoryItem) => (
                          <button
                            key={categoryItem.id}
                            type="button"
                            onClick={() =>
                              setElementCategory(
                                categoryItem.id,
                              )
                            }
                            className={[
                              "whitespace-nowrap rounded-full px-4 py-2 text-xs font-black transition",
                              elementCategory ===
                              categoryItem.id
                                ? "border border-violet-200/80 bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 text-slate-800"
                                : "bg-slate-100 text-slate-600 hover:bg-slate-200",
                            ].join(" ")}
                          >
                            {categoryItem.label}
                          </button>
                        ),
                      )}
                    </div>
                  ) : null}
                </div>

                <div
                  className={
                    addTab === "sections"
                      ? "flex min-h-0 flex-1 overflow-hidden"
                      : "min-h-0 flex-1 overflow-y-auto bg-[#f7f8fb] p-6"
                  }
                >
                  {addTab === "elements" ? (
                    <>
                      <div className="mb-4 flex items-center justify-between gap-3">
                        <div>
                          <h3 className="text-base font-black text-slate-800">
                            {elementCategory === "crm"
                              ? "נתונים משתנים מה-CRM"
                              : "אלמנטים לאתר"}
                          </h3>
                          <p className="mt-1 text-xs font-bold text-slate-400">
                            {elementCategory === "crm"
                              ? "כל נתון מוסיף שני שדות נפרדים (שם + ערך) שאפשר למקם בנפרד. השם זהה לכל לקוחות העסק — הערך משתנה לפי תיק הלקוח המחובר."
                              : elementCategory === "tables"
                                ? "בחרו כמה שורות ועמודות ואז הוסיפו טבלה לעמוד"
                              : "לחיצה מוסיפה אלמנט לעריכה חופשית על הקנבס"}
                          </p>
                        </div>

                        <span className="rounded-full bg-white px-3 py-1.5 text-xs font-black text-slate-500 shadow-sm">
                          {filteredElements.length}{" "}
                          פריטים
                        </span>
                      </div>

                      {elementCategory === "tables" ? (
                        <div className="mb-5 flex flex-wrap items-end gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                          <label className="min-w-[120px]">
                            <span className="mb-1 block text-[11px] font-black text-slate-500">
                              שורות
                            </span>
                            <input
                              type="number"
                              min={1}
                              max={20}
                              value={tableRows}
                              onChange={(event) =>
                                setTableRows(
                                  Math.max(
                                    1,
                                    Math.min(20, Number(event.target.value) || 1),
                                  ),
                                )
                              }
                              className="h-10 w-full rounded-xl border border-slate-200 px-3 text-sm font-black text-slate-800 outline-none focus:border-violet-400"
                            />
                          </label>
                          <label className="min-w-[120px]">
                            <span className="mb-1 block text-[11px] font-black text-slate-500">
                              עמודות
                            </span>
                            <input
                              type="number"
                              min={1}
                              max={12}
                              value={tableCols}
                              onChange={(event) =>
                                setTableCols(
                                  Math.max(
                                    1,
                                    Math.min(12, Number(event.target.value) || 1),
                                  ),
                                )
                              }
                              className="h-10 w-full rounded-xl border border-slate-200 px-3 text-sm font-black text-slate-800 outline-none focus:border-violet-400"
                            />
                          </label>
                          <button
                            type="button"
                            onClick={() =>
                              closeAfter(() =>
                                editor?.addTable?.({
                                  rows: tableRows,
                                  cols: tableCols,
                                  withHeader: true,
                                  variant: "dark-header",
                                }),
                              )
                            }
                            className="inline-flex h-10 items-center justify-center rounded-xl bg-slate-900 px-4 text-sm font-black text-white transition hover:bg-slate-800"
                          >
                            הוספת טבלה {tableRows}×{tableCols}
                          </button>
                          <p className="w-full text-[11px] font-bold text-slate-400">
                            אפשר גם לבחור תבנית מוכנה מהרשימה למטה
                          </p>
                        </div>
                      ) : null}

                      <div className="grid grid-cols-3 gap-4">
                        {filteredElements.map(
                          (item) => (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() =>
                                closeAfter(
                                  item.action,
                                )
                              }
                              className={[
                                "group overflow-hidden text-right transition duration-200 hover:-translate-y-1",
                                item.barePreview
                                  ? "rounded-2xl border border-transparent bg-transparent shadow-none hover:border-slate-200 hover:bg-white/70"
                                  : "rounded-[22px] border border-slate-200 bg-white shadow-sm hover:border-violet-300 hover:shadow-[0_18px_40px_rgba(91,33,182,0.12)]",
                              ].join(" ")}
                            >
                              <div
                                className={[
                                  "h-[132px] overflow-hidden",
                                  item.barePreview
                                    ? "bg-transparent"
                                    : "border-b border-slate-100 bg-white",
                                ].join(" ")}
                              >
                                <ElementPreview
                                  kind={item.preview}
                                  previewHtml={item.previewHtml}
                                  thumbnail={item.thumbnail}
                                  barePreview={item.barePreview}
                                />
                              </div>

                              <div
                                className={
                                  item.barePreview ? "px-1 pb-2 pt-1" : "p-4"
                                }
                              >
                                <h4 className="text-sm font-black text-slate-800">
                                  {item.title}
                                </h4>
                                <p className="mt-1 text-xs font-bold leading-5 text-slate-400">
                                  {item.description}
                                </p>
                              </div>
                            </button>
                          ),
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="flex min-h-0 flex-1 gap-0">
                      <aside className="w-[220px] shrink-0 overflow-y-auto border-l border-slate-200 bg-white p-3">
                        <p className="mb-3 px-2 text-[11px] font-black uppercase tracking-wide text-slate-400">
                          {sectionLibraryMode === "portal"
                            ? "סוג סקשן"
                            : "קטגוריות"}
                        </p>
                        {sectionLibraryMode === "portal" ? (
                          PORTAL_SECTION_KIND_NAV.map((kindItem) => (
                            <button
                              key={kindItem.id}
                              type="button"
                              onClick={() => setPortalSectionKind(kindItem.id)}
                              className={[
                                "mb-1 flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-right text-xs font-black transition",
                                portalSectionKind === kindItem.id
                                  ? "bg-slate-100 text-slate-800"
                                  : "text-slate-600 hover:bg-slate-50",
                              ].join(" ")}
                            >
                              <span>{kindItem.label}</span>
                              <span className="rounded-full bg-slate-200/70 px-1.5 py-0.5 text-[10px] font-black text-slate-500">
                                {
                                  SECTION_LIBRARY.filter((item) => {
                                    if (item.category !== "portal") return false;
                                    if (kindItem.id === "all") {
                                      return item.id.startsWith("section-portal-");
                                    }
                                    return item.id.startsWith(kindItem.prefix);
                                  }).length
                                }
                              </span>
                            </button>
                          ))
                        ) : (
                          <>
                            <div className="mb-3 space-y-1 border-b border-slate-100 pb-3">
                              {(
                                [
                                  ["recommended", "מומלצים"],
                                  ["recent", "נוספו לאחרונה"],
                                  ["favorites", "מועדפים"],
                                  ["all", "כל העיצובים"],
                                ] as Array<[SectionQuickFilter, string]>
                              ).map(([id, label]) => (
                                <button
                                  key={id}
                                  type="button"
                                  onClick={() => {
                                    setSectionQuickFilter(id);
                                    setSectionCategory("all");
                                  }}
                                  className={[
                                    "flex w-full items-center justify-between rounded-lg px-3 py-2 text-right text-xs font-bold transition",
                                    sectionQuickFilter === id
                                      ? "border border-slate-200 bg-slate-100 text-slate-800"
                                      : "text-slate-600 hover:bg-slate-50",
                                  ].join(" ")}
                                >
                                  <span>{label}</span>
                                  {id === "favorites" ? (
                                    <span>{favoriteSectionIds.length}</span>
                                  ) : id === "recent" ? (
                                    <span>{recentSectionIds.length}</span>
                                  ) : null}
                                </button>
                              ))}
                            </div>
                            {visibleSectionNav.map((categoryItem) => (
                              <button
                                key={categoryItem.id}
                                type="button"
                                onClick={() => {
                                  if (categoryItem.id === "blank") {
                                    editor?.addSection?.(
                                      "after",
                                      undefined,
                                      "blank",
                                    );
                                    setLastAddedTitle("סקשן ריק נוסף לעמוד");
                                    return;
                                  }
                                  setSectionQuickFilter("all");
                                  setSectionCategory(categoryItem.id);
                                }}
                                className={[
                                  "mb-1 flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-right text-xs font-black transition",
                                  sectionCategory === categoryItem.id
                                    ? "bg-slate-100 text-slate-800"
                                    : "text-slate-600 hover:bg-slate-50",
                                  categoryItem.id === "blank"
                                    ? "text-slate-700"
                                    : "",
                                ].join(" ")}
                              >
                                <span>{categoryItem.label}</span>
                                {categoryItem.id === "all" ? (
                                  <span className="rounded-full bg-slate-200 px-1.5 py-0.5 text-[10px] font-black text-slate-700">
                                    {
                                      SECTION_LIBRARY.filter(
                                        (item) => item.category !== "portal",
                                      ).length
                                    }
                                  </span>
                                ) : null}
                                {categoryItem.id !== "blank" &&
                                categoryItem.id !== "all" ? (
                                  <span className="rounded-full bg-slate-200/70 px-1.5 py-0.5 text-[10px] font-black text-slate-500">
                                    {
                                      getSectionsByCategory(categoryItem.id)
                                        .filter(
                                          (item) => item.category !== "portal",
                                        ).length
                                    }
                                  </span>
                                ) : null}
                              </button>
                            ))}
                          </>
                        )}
                      </aside>

                      <div
                        ref={sectionScrollerRef}
                        onScroll={(event) => {
                          const scrollTop = event.currentTarget.scrollTop;
                          setSectionViewport((current) =>
                            current.scrollTop === scrollTop
                              ? current
                              : { ...current, scrollTop },
                          );
                        }}
                        className="min-h-0 flex-1 overflow-y-auto bg-[#f7f8fb] p-5"
                      >
                        <div className="mb-4 flex items-center justify-between gap-3">
                          <div>
                            <h3 className="text-base font-black text-slate-800">
                              ספריית סקשנים · {activeSectionCategoryLabel}
                            </h3>
                            <p className="mt-1 text-xs font-bold text-slate-400">
                              תבנית לפתיחה — אחרי ההוספה כל טקסט, תמונה ואלמנט ניתנים לעריכה
                            </p>
                          </div>

                          <span className="rounded-full bg-white px-3 py-1.5 text-xs font-black text-slate-500 shadow-sm">
                            {filteredSections.length} סקשנים
                          </span>
                        </div>

                        <div
                          className="relative"
                          style={{ height: virtualSectionGrid.height }}
                        >
                          {virtualSectionGrid.items.map(
                            ({ item, top, right, width, height }) => (
                            <article
                              key={item.id}
                              className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white text-right shadow-[0_2px_10px_rgba(15,23,42,0.06)] transition duration-200 hover:-translate-y-0.5 hover:border-slate-400 hover:shadow-[0_16px_38px_rgba(15,23,42,0.14)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2"
                              style={{
                                position: "absolute",
                                top,
                                right,
                                width,
                                height,
                              }}
                            >
                              <button
                                type="button"
                                onClick={() => {
                                  setPreviewDevice("desktop");
                                  setPreviewSection(item);
                                }}
                                className="block w-full text-right"
                                aria-label={`תצוגה מקדימה: ${item.title}`}
                              >
                              <div className="relative h-[220px] overflow-hidden bg-[#f5f5f3] p-3">
                                <div className="h-full overflow-hidden border border-black/5 bg-white shadow-[0_2px_8px_rgba(15,23,42,0.08)]">
                                  <SectionTemplateCanvasPreview
                                    section={item}
                                    theme={
                                      shouldLockLibraryPalette(item)
                                        ? undefined
                                        : sectionTheme
                                    }
                                  />
                                </div>

                                <div className="absolute inset-0 flex items-center justify-center border border-violet-200/80 bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 text-slate-800/0 opacity-0 transition duration-200 group-hover:border border-violet-200/80 bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 text-slate-800/10 group-hover:opacity-100">
                                  <span className="inline-flex items-center gap-2 rounded-md bg-white px-4 py-2.5 text-xs font-black text-slate-800 shadow-xl">
                                    <Eye className="h-4 w-4" />
                                    תצוגה מקדימה
                                  </span>
                                </div>
                              </div>

                              <div className="flex items-center justify-between gap-3 border-t border-slate-100 px-4 py-3">
                                <div className="min-w-0">
                                  <h4 className="truncate text-sm font-black text-slate-800">
                                    {item.title}
                                  </h4>
                                  <p className="mt-0.5 truncate text-[11px] font-bold text-slate-400">
                                    {item.description}
                                  </p>
                                </div>

                                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition group-hover:border-slate-950 group-hover:border border-violet-200/80 bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 text-slate-800 group-hover:text-white">
                                  <Eye className="h-4 w-4" />
                                </span>
                              </div>
                              </button>

                              <button
                                type="button"
                                onClick={() => toggleFavoriteSection(item.id)}
                                className={[
                                  "absolute left-5 top-5 z-20 flex h-9 w-9 items-center justify-center rounded-full border bg-white/95 shadow-md backdrop-blur transition",
                                  favoriteSectionIds.includes(item.id)
                                    ? "border-rose-200 text-rose-600"
                                    : "border-white text-slate-500 hover:text-rose-600",
                                ].join(" ")}
                                aria-label={
                                  favoriteSectionIds.includes(item.id)
                                    ? "הסרה מהמועדפים"
                                    : "הוספה למועדפים"
                                }
                              >
                                <Heart
                                  className="h-4 w-4"
                                  fill={
                                    favoriteSectionIds.includes(item.id)
                                      ? "currentColor"
                                      : "none"
                                  }
                                />
                              </button>
                            </article>
                          ))}
                        </div>

                        {filteredSections.length === 0 ? (
                          <div className="mt-10 rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
                            <p className="text-sm font-black text-slate-700">
                              לא נמצאו סקשנים בקטגוריה זו
                            </p>
                            <p className="mt-2 text-xs font-bold text-slate-400">
                              נסו חיפוש אחר או עברו לקטגוריה אחרת
                            </p>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 px-4">
            <div className="flex items-center gap-2">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
                {mode === "layers" ? (
                  <Layers3 className="h-5 w-5" />
                ) : (
                  <Code2 className="h-5 w-5" />
                )}
              </span>

              <h2 className="text-base font-black text-slate-800">
                {title}
              </h2>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100"
              aria-label="סגירה"
            >
              <X className="h-5 w-5" />
            </button>
          </header>

          {mode === "layers" ? (
            <div className="flex min-h-0 flex-1 flex-col">
              <div className="flex shrink-0 items-center justify-between border-b border-slate-100 px-4 py-3">
                <span className="text-xs font-black text-slate-500">
                  {sections.length} בלוקים · {layers.length} שכבות
                </span>

                <button
                  type="button"
                  onClick={refreshLayers}
                  className="inline-flex h-9 items-center gap-2 rounded-xl border border-slate-200 px-3 text-xs font-black text-slate-600"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  רענון
                </button>
              </div>

              <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-3">
                {sections.length ? (
                  <div className="space-y-2">
                    <div className="px-1">
                      <div className="text-sm font-black text-slate-900">
                        סדר הבלוקים
                      </div>
                      <div className="mt-1 text-[11px] font-bold leading-5 text-slate-400">
                        גררו את הידית כדי לשנות את סדר הבלוקים בעמוד — חלק ומיידי.
                      </div>
                    </div>

                    <DndContext
                      sensors={sectionSensors}
                      collisionDetection={closestCenter}
                      onDragStart={handleSectionDragStart}
                      onDragOver={handleSectionDragOver}
                      onDragEnd={handleSectionDragEnd}
                      onDragCancel={() => {
                        isSectionDraggingRef.current = false;
                        setActiveSectionId(null);
                        refreshLayers();
                      }}
                    >
                      <SortableContext
                        items={sortableSectionIds}
                        strategy={verticalListSortingStrategy}
                      >
                        <div className="space-y-1.5">
                          {sections.map((item) => {
                            const active =
                              item.elementId ===
                                selectedElementId ||
                              item.key === selectedElementId;

                            return (
                              <SortableSectionRow
                                key={item.key}
                                item={item}
                                active={active}
                                onSelect={() =>
                                  editor?.selectByElementId?.(
                                    item.elementId || item.key,
                                  )
                                }
                              />
                            );
                          })}
                        </div>
                      </SortableContext>

                      <DragOverlay
                        dropAnimation={{
                          duration: 120,
                          easing: "cubic-bezier(0.2, 0, 0, 1)",
                        }}
                      >
                        {activeSection ? (
                          <div className="flex items-center gap-2 rounded-2xl border border-violet-400 bg-white px-3 py-2.5 shadow-2xl scale-[1.03]">
                            <GripVertical className="h-4 w-4 text-violet-600" />
                            <span className="text-sm font-black text-slate-900">
                              {activeSection.label}
                            </span>
                          </div>
                        ) : null}
                      </DragOverlay>
                    </DndContext>
                  </div>
                ) : null}

                <div className="space-y-2">
                  {sections.length ? (
                    <div className="px-1 pt-1 text-sm font-black text-slate-900">
                      שכבות אלמנטים
                    </div>
                  ) : null}

                {layers.map((item) => {
                  const active =
                    item.id === selectedElementId;

                  return (
                    <div
                      key={item.id}
                      className={[
                        "rounded-2xl border p-2",
                        active
                          ? "border-violet-400 bg-violet-50"
                          : "border-slate-200 bg-white",
                      ].join(" ")}
                    >
                      <button
                        type="button"
                        onClick={() =>
                          editor?.selectByElementId?.(
                            item.id,
                          )
                        }
                        className="flex w-full items-center gap-2 rounded-xl p-2 text-right"
                      >
                        <MousePointer2 className="h-4 w-4 shrink-0 text-violet-600" />

                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-black text-slate-900">
                            {item.label ||
                              item.type}
                          </span>

                          <span className="block truncate text-[11px] font-bold text-slate-400">
                            {item.type} · שכבה{" "}
                            {item.zIndex}
                          </span>
                        </span>
                      </button>

                      {active ? (
                        <div className="grid grid-cols-4 gap-1 border-t border-violet-100 pt-2">
                          <button
                            type="button"
                            title="לחזית"
                            onClick={() =>
                              editor?.bringToFront?.(
                                item.id,
                              )
                            }
                            className="flex h-9 items-center justify-center rounded-lg bg-white text-slate-600"
                          >
                            <ArrowUpToLine className="h-4 w-4" />
                          </button>

                          <button
                            type="button"
                            title="לרקע"
                            onClick={() =>
                              editor?.sendToBack?.(
                                item.id,
                              )
                            }
                            className="flex h-9 items-center justify-center rounded-lg bg-white text-slate-600"
                          >
                            <ArrowDownToLine className="h-4 w-4" />
                          </button>

                          <button
                            type="button"
                            title={
                              item.hidden
                                ? "הצגה"
                                : "הסתרה"
                            }
                            onClick={() =>
                              editor?.toggleElementHidden?.(
                                item.id,
                              )
                            }
                            className="flex h-9 items-center justify-center rounded-lg bg-white text-slate-600"
                          >
                            {item.hidden ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>

                          <button
                            type="button"
                            title="מחיקה"
                            onClick={() =>
                              editor?.deleteElement?.(
                                item.id,
                              )
                            }
                            className="flex h-9 items-center justify-center rounded-lg bg-rose-50 text-rose-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ) : null}
                    </div>
                  );
                })}
                </div>
              </div>

              {selectedLayer ? (
                <div className="shrink-0 border-t border-slate-200 bg-slate-50 p-3 text-xs font-bold text-slate-500">
                  מסומן: {selectedLayer.label}
                </div>
              ) : null}
            </div>
          ) : (
            <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-4">
              <div className="grid grid-cols-2 gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-1">
                <button
                  type="button"
                  onClick={() => setCodeScope("site")}
                  className={[
                    "rounded-xl px-3 py-2.5 text-xs font-black transition",
                    codeScope === "site"
                      ? "bg-white text-violet-700 shadow-sm"
                      : "text-slate-500 hover:text-slate-800",
                  ].join(" ")}
                >
                  כל האתר
                </button>
                <button
                  type="button"
                  onClick={() => setCodeScope("page")}
                  className={[
                    "rounded-xl px-3 py-2.5 text-xs font-black transition",
                    codeScope === "page"
                      ? "bg-white text-violet-700 shadow-sm"
                      : "text-slate-500 hover:text-slate-800",
                  ].join(" ")}
                >
                  עמוד זה בלבד
                </button>
              </div>

              <div className="rounded-2xl bg-slate-50 p-3 text-xs font-bold leading-6 text-slate-600">
                {codeScope === "site"
                  ? "קוד ברמת האתר רץ בכל העמודים — מתאים לפיקסל, Analytics, CSS גלובלי."
                  : "קוד ברמת העמוד רץ רק בעמוד הנוכחי — בנוסף לקוד של כל האתר."}
              </div>

              <label className="flex items-center justify-between rounded-2xl border border-slate-200 p-3">
                <span className="text-sm font-black text-slate-800">
                  הפעלת קוד מותאם
                </span>

                <input
                  type="checkbox"
                  checked={codeDraft.enabled}
                  onChange={(event) =>
                    setCodeDraft((current) => ({
                      ...current,
                      enabled:
                        event.target.checked,
                    }))
                  }
                />
              </label>

              <CodeField
                label="Custom CSS"
                value={codeDraft.css}
                onChange={(css) =>
                  setCodeDraft((current) => ({
                    ...current,
                    css,
                  }))
                }
                placeholder=".my-class { color: red; }"
              />

              <CodeField
                label="Head HTML"
                value={codeDraft.headHtml}
                onChange={(headHtml) =>
                  setCodeDraft((current) => ({
                    ...current,
                    headHtml,
                  }))
                }
                placeholder='<meta name="..." content="..." />'
                rows={5}
              />

              <CodeField
                label="HTML בתחילת ה־Body"
                value={codeDraft.bodyStartHtml}
                onChange={(bodyStartHtml) =>
                  setCodeDraft((current) => ({
                    ...current,
                    bodyStartHtml,
                  }))
                }
                placeholder="<!-- קוד שיופיע לפני האתר -->"
                rows={4}
              />

              <CodeField
                label="HTML בסוף ה־Body"
                value={codeDraft.bodyEndHtml}
                onChange={(bodyEndHtml) =>
                  setCodeDraft((current) => ({
                    ...current,
                    bodyEndHtml,
                  }))
                }
                placeholder="<!-- קוד שיופיע אחרי האתר -->"
                rows={4}
              />

              <CodeField
                label="Custom JavaScript"
                value={codeDraft.javascript}
                onChange={(javascript) =>
                  setCodeDraft((current) => ({
                    ...current,
                    javascript,
                  }))
                }
                placeholder="console.log('Bizuply custom code');"
              />

              <div className="rounded-2xl bg-amber-50 p-3 text-xs font-bold leading-6 text-amber-800">
                CSS מתעדכן מיד בעורך. Head HTML מופיע בעריכה (בלי
                סקריפטים). JavaScript רץ בתצוגה מקדימה ובאתר המפורסם בלבד.
                שמרו גם טיוטה/פרסום כדי שהקוד יישמר בשרת.
              </div>

              <button
                type="button"
                onClick={() => {
                  if (codeScope === "site") {
                    if (
                      typeof editor?.updateSiteCustomCode !==
                      "function"
                    ) {
                      window.alert(
                        "שמירת קוד ברמת האתר לא זמינה. רעננו את הדף ונסו שוב.",
                      );
                      return;
                    }
                    editor.updateSiteCustomCode(codeDraft);
                  } else {
                    if (
                      typeof editor?.updateCustomCode !== "function"
                    ) {
                      window.alert(
                        "שמירת קוד מותאם לא זמינה כרגע. רעננו את הדף ונסו שוב.",
                      );
                      return;
                    }
                    editor.updateCustomCode(codeDraft);
                  }
                  onClose();
                }}
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 border border-violet-200/70 text-sm font-black text-black"
              >
                <Save className="h-4 w-4" />
                {codeScope === "site"
                  ? "שמירת קוד לכל האתר"
                  : "שמירת קוד לעמוד זה"}
              </button>
            </div>
          )}
        </div>
      )}

      {mode === "add" && previewSection ? (
        <div className="absolute inset-0 z-[100] flex flex-col bg-white" dir="rtl">
          <header className="flex h-[74px] shrink-0 items-center justify-between border-b border-slate-200 px-6">
            <div className="min-w-0">
              <p className="text-[11px] font-bold text-slate-400">
                תצוגה מקדימה
              </p>
              <h3 className="truncate text-lg font-black text-slate-800">
                {previewSection.title}
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex rounded-lg bg-slate-100 p-1">
                <button
                  type="button"
                  onClick={() => setPreviewDevice("desktop")}
                  className={[
                    "flex h-9 items-center gap-2 rounded-md px-3 text-xs font-bold transition",
                    previewDevice === "desktop"
                      ? "bg-white text-slate-800 shadow-sm"
                      : "text-slate-500",
                  ].join(" ")}
                >
                  <Monitor className="h-4 w-4" />
                  דסקטופ
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewDevice("mobile")}
                  className={[
                    "flex h-9 items-center gap-2 rounded-md px-3 text-xs font-bold transition",
                    previewDevice === "mobile"
                      ? "bg-white text-slate-800 shadow-sm"
                      : "text-slate-500",
                  ].join(" ")}
                >
                  <Smartphone className="h-4 w-4" />
                  מובייל
                </button>
              </div>

              <button
                type="button"
                onClick={() => toggleFavoriteSection(previewSection.id)}
                className={[
                  "flex h-10 w-10 items-center justify-center rounded-full border transition",
                  favoriteSectionIds.includes(previewSection.id)
                    ? "border-rose-200 bg-rose-50 text-rose-600"
                    : "border-slate-200 text-slate-500 hover:text-rose-600",
                ].join(" ")}
                aria-label="מועדפים"
              >
                <Heart
                  className="h-4 w-4"
                  fill={
                    favoriteSectionIds.includes(previewSection.id)
                      ? "currentColor"
                      : "none"
                  }
                />
              </button>

              <button
                type="button"
                onClick={() => setPreviewSection(null)}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200"
                aria-label="חזרה לספרייה"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </header>

          <div className="flex min-h-0 flex-1 items-center justify-center overflow-auto bg-[#ececea] p-8">
            <div
              className={[
                "h-[min(68vh,680px)] overflow-hidden bg-white shadow-[0_24px_80px_rgba(15,23,42,0.18)] transition-all duration-300",
                previewDevice === "mobile"
                  ? "w-[390px] max-w-full rounded-[24px] border-[8px] border-slate-900"
                  : "w-full max-w-[1120px] rounded-md border border-slate-200",
              ].join(" ")}
            >
              <SectionTemplateCanvasPreview
                section={previewSection}
                theme={
                  shouldLockLibraryPalette(previewSection)
                    ? undefined
                    : sectionTheme
                }
              />
            </div>
          </div>

          <footer className="flex min-h-[76px] shrink-0 items-center justify-between gap-4 border-t border-slate-200 bg-white px-6 py-3">
            <p className="text-xs font-bold text-slate-500">
              הסקשן יותאם אוטומטית לצבעים ולפונט של האתר.
            </p>
            <div className="flex items-center gap-2">
              {canReplaceSelectedSection ? (
                <button
                  type="button"
                  onClick={() => handleReplaceLibrarySection(previewSection)}
                  className="inline-flex h-11 items-center gap-2 rounded-md border border-slate-300 bg-white px-5 text-sm font-black text-slate-800 transition hover:border-slate-950"
                >
                  <RefreshCw className="h-4 w-4" />
                  החלפת הסקשן הנבחר
                </button>
              ) : null}
              <button
                type="button"
                onClick={() => handleAddLibrarySection(previewSection)}
                className="inline-flex h-11 items-center gap-2 rounded-md border border-violet-200/80 bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 text-slate-800 transition hover:from-violet-200/70 hover:via-sky-100 hover:to-cyan-50"
              >
                <Plus className="h-4 w-4" />
                הוספה לעמוד
              </button>
            </div>
          </footer>
        </div>
      ) : null}

      {mode === "add" && lastAddedTitle ? (
        <div className="absolute bottom-5 left-1/2 z-[110] flex -translate-x-1/2 items-center gap-4 rounded-xl border border-violet-200/80 bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 text-slate-800 shadow-2xl">
          <span>{lastAddedTitle}</span>
          <button
            type="button"
            onClick={() => {
              editor?.undo?.();
              setLastAddedTitle("");
            }}
            className="inline-flex items-center gap-1.5 rounded-md bg-white/10 px-3 py-1.5 text-xs font-black hover:bg-white/20"
          >
            <Undo2 className="h-4 w-4" />
            ביטול
          </button>
        </div>
      ) : null}
      </aside>
    </div>
  );
}
