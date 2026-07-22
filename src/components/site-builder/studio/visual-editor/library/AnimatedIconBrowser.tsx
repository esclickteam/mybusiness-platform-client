import React, {
  useEffect,
  useMemo,
  useState,
} from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { motion } from "motion/react";
import * as TablerIcons from "@tabler/icons-react";
import BizuplyLoader from "../../../../../components/ui/BizuplyLoader";
import {
  AlertCircle,
  Check,
  ChevronDown,
  Loader2,
  Search,
  Sparkles,
} from "lucide-react";

type AnimationPreset =
  | ""
  | "fade-up"
  | "zoom-in"
  | "slide-right"
  | "slide-left"
  | "blur-reveal"
  | "float-soft"
  | "pulse-soft";

type IconCategory =
  | "all"
  | "business"
  | "contact"
  | "commerce"
  | "social"
  | "interface";

type AnimatedIconBrowserProps = {
  editor: any;
  onInserted?: (elementId: string) => void;
};

type TablerIconComponent = React.ComponentType<{
  size?: number | string;
  color?: string;
  stroke?: number | string;
  width?: number | string;
  height?: number | string;
  className?: string;
  "aria-hidden"?: boolean | "true" | "false";
  focusable?: boolean | "true" | "false";
}>;

type IconEntry = {
  id: string;
  exportName: string;
  title: string;
  searchableText: string;
  Component: TablerIconComponent;
};

type AnimationOption = {
  value: AnimationPreset;
  label: string;
  description: string;
};

const CATEGORY_OPTIONS: Array<{
  id: IconCategory;
  label: string;
  keywords: string[];
}> = [
  {
    id: "all",
    label: "הכול",
    keywords: [],
  },
  {
    id: "business",
    label: "עסקים",
    keywords: [
      "briefcase",
      "building",
      "business",
      "chart",
      "presentation",
      "report",
      "calendar",
      "users",
      "user",
      "id",
      "certificate",
      "award",
      "target",
      "rocket",
      "bulb",
      "database",
      "folder",
      "file",
      "notes",
      "clipboard",
      "cash",
      "coin",
      "wallet",
    ],
  },
  {
    id: "contact",
    label: "יצירת קשר",
    keywords: [
      "phone",
      "mail",
      "message",
      "send",
      "map",
      "location",
      "pin",
      "address",
      "at",
      "contact",
      "headset",
      "bell",
      "notification",
      "brand-whatsapp",
    ],
  },
  {
    id: "commerce",
    label: "חנות",
    keywords: [
      "shopping",
      "cart",
      "basket",
      "bag",
      "credit",
      "receipt",
      "ticket",
      "gift",
      "package",
      "truck",
      "delivery",
      "discount",
      "percentage",
      "barcode",
      "cash",
      "currency",
      "coin",
      "wallet",
      "store",
    ],
  },
  {
    id: "social",
    label: "רשתות",
    keywords: [
      "brand",
      "share",
      "heart",
      "thumb",
      "message",
      "photo",
      "video",
      "music",
      "camera",
      "instagram",
      "facebook",
      "tiktok",
      "youtube",
      "linkedin",
      "twitter",
      "pinterest",
      "whatsapp",
    ],
  },
  {
    id: "interface",
    label: "ממשק",
    keywords: [
      "arrow",
      "chevron",
      "menu",
      "x",
      "plus",
      "minus",
      "check",
      "search",
      "settings",
      "adjustments",
      "home",
      "eye",
      "lock",
      "edit",
      "trash",
      "download",
      "upload",
      "player",
      "circle",
      "square",
      "dots",
      "layout",
    ],
  },
];

const ANIMATION_OPTIONS: AnimationOption[] = [
  {
    value: "",
    label: "ללא אנימציה",
    description: "אייקון רגיל",
  },
  {
    value: "float-soft",
    label: "ריחוף עדין",
    description: "תנועה קבועה למעלה ולמטה",
  },
  {
    value: "pulse-soft",
    label: "פעימה",
    description: "הגדלה והקטנה עדינות בלולאה",
  },
  {
    value: "fade-up",
    label: "כניסה מלמטה",
    description: "הופעה עם שקיפות ותנועה",
  },
  {
    value: "zoom-in",
    label: "כניסת זום",
    description: "הופעה בהגדלה עדינה",
  },
  {
    value: "slide-right",
    label: "כניסה מימין",
    description: "החלקה מצד ימין",
  },
  {
    value: "slide-left",
    label: "כניסה משמאל",
    description: "החלקה מצד שמאל",
  },
  {
    value: "blur-reveal",
    label: "חשיפה מטושטשת",
    description: "מעבר מטשטוש לתמונה חדה",
  },
];

const HEBREW_ALIASES: Record<string, string> = {
  בית: "home house",
  טלפון: "phone call",
  מייל: "mail email",
  הודעה: "message chat",
  וואטסאפ: "whatsapp brand-whatsapp",
  פייסבוק: "facebook brand-facebook",
  אינסטגרם: "instagram brand-instagram",
  טיקטוק: "tiktok brand-tiktok",
  יוטיוב: "youtube brand-youtube",
  לינקדאין: "linkedin brand-linkedin",
  חנות: "store shopping shop",
  עגלה: "cart shopping-cart",
  סל: "basket shopping-bag",
  מתנה: "gift present",
  כסף: "cash coin wallet currency",
  כרטיס: "credit-card card",
  משלוח: "truck delivery package",
  מיקום: "map pin location",
  כתובת: "map address location",
  משתמש: "user account",
  לקוחות: "users user-group",
  עסק: "briefcase building chart",
  גרף: "chart graph",
  יומן: "calendar",
  שעון: "clock time",
  חיפוש: "search",
  תפריט: "menu",
  הגדרות: "settings adjustments",
  לב: "heart",
  כוכב: "star",
  מצלמה: "camera",
  וידאו: "video player",
  תמונה: "photo image",
  מוזיקה: "music",
  פעמון: "bell notification",
  מנעול: "lock",
  עין: "eye",
  מחיקה: "trash delete",
  עריכה: "edit pencil",
  הורדה: "download",
  העלאה: "upload",
  חץ: "arrow chevron",
  פלוס: "plus add",
  מינוס: "minus",
  וי: "check circle-check",
};

function isTablerIconComponent(
  value: unknown,
): value is TablerIconComponent {
  if (typeof value === "function") {
    return true;
  }

  if (!value || typeof value !== "object") {
    return false;
  }

  return "$$typeof" in value;
}

function humanizeIconName(name: string) {
  return name
    .replace(/^Icon/, "")
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/([A-Z])([A-Z][a-z])/g, "$1 $2")
    .replace(/(\d+)/g, " $1 ")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeSearch(value: string) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ");
}

function expandHebrewSearch(value: string) {
  const normalized = normalizeSearch(value);
  if (!normalized) return "";

  const additions = normalized
    .split(" ")
    .map((word) => HEBREW_ALIASES[word] || "")
    .filter(Boolean)
    .join(" ");

  return normalizeSearch(`${normalized} ${additions}`);
}

function makeSvgDataUrl(svgMarkup: string) {
  const withXmlNamespace = svgMarkup.includes("xmlns=")
    ? svgMarkup
    : svgMarkup.replace(
        "<svg",
        '<svg xmlns="http://www.w3.org/2000/svg"',
      );

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
    withXmlNamespace,
  )}`;
}

function getPreviewMotion(animation: AnimationPreset) {
  if (animation === "float-soft") {
    return {
      initial: { y: 0 },
      animate: { y: [0, -10, 0] },
      transition: {
        duration: 2.2,
        repeat: Infinity,
        ease: "easeInOut" as const,
      },
    };
  }

  if (animation === "pulse-soft") {
    return {
      initial: { scale: 1, opacity: 1 },
      animate: {
        scale: [1, 1.08, 1],
        opacity: [1, 0.78, 1],
      },
      transition: {
        duration: 1.8,
        repeat: Infinity,
        ease: "easeInOut" as const,
      },
    };
  }

  if (animation === "fade-up") {
    return {
      initial: { opacity: 0, y: 18 },
      animate: {
        opacity: [0, 1, 1, 0],
        y: [18, 0, 0, 18],
      },
      transition: {
        duration: 2.8,
        repeat: Infinity,
        repeatDelay: 0.35,
      },
    };
  }

  if (animation === "zoom-in") {
    return {
      initial: { opacity: 0, scale: 0.82 },
      animate: {
        opacity: [0, 1, 1, 0],
        scale: [0.82, 1, 1, 0.82],
      },
      transition: {
        duration: 2.8,
        repeat: Infinity,
        repeatDelay: 0.35,
      },
    };
  }

  if (animation === "slide-right") {
    return {
      initial: { opacity: 0, x: 20 },
      animate: {
        opacity: [0, 1, 1, 0],
        x: [20, 0, 0, 20],
      },
      transition: {
        duration: 2.8,
        repeat: Infinity,
        repeatDelay: 0.35,
      },
    };
  }

  if (animation === "slide-left") {
    return {
      initial: { opacity: 0, x: -20 },
      animate: {
        opacity: [0, 1, 1, 0],
        x: [-20, 0, 0, -20],
      },
      transition: {
        duration: 2.8,
        repeat: Infinity,
        repeatDelay: 0.35,
      },
    };
  }

  if (animation === "blur-reveal") {
    return {
      initial: {
        opacity: 0,
        filter: "blur(8px)",
        y: 10,
      },
      animate: {
        opacity: [0, 1, 1, 0],
        filter: [
          "blur(8px)",
          "blur(0px)",
          "blur(0px)",
          "blur(8px)",
        ],
        y: [10, 0, 0, 10],
      },
      transition: {
        duration: 3,
        repeat: Infinity,
        repeatDelay: 0.35,
      },
    };
  }

  return {
    initial: {},
    animate: {},
    transition: {},
  };
}

const TABLER_EXPORTS = TablerIcons as unknown as Record<
  string,
  unknown
>;

const TABLER_ICON_LIBRARY = Object.keys(TABLER_EXPORTS)
  .reduce<IconEntry[]>((icons, exportName) => {
    if (!/^Icon[A-Z0-9]/.test(exportName)) {
      return icons;
    }

    if (exportName.endsWith("Filled")) {
      return icons;
    }

    const exportedValue = TABLER_EXPORTS[exportName];

    if (!isTablerIconComponent(exportedValue)) {
      return icons;
    }

    const title = humanizeIconName(exportName);

    icons.push({
      id: exportName,
      exportName,
      title,
      searchableText: normalizeSearch(
        `${exportName} ${title}`,
      ),
      Component: exportedValue,
    });

    return icons;
  }, [])
  .sort((a, b) =>
    a.title.localeCompare(b.title, "en"),
  );

export default function AnimatedIconBrowser({
  editor,
  onInserted,
}: AnimatedIconBrowserProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] =
    useState<IconCategory>("all");
  const [animation, setAnimation] =
    useState<AnimationPreset>("float-soft");
  const [iconColor, setIconColor] = useState("#111827");
  const [iconSize, setIconSize] = useState(96);
  const [strokeWidth, setStrokeWidth] = useState(1.8);
  const [visibleLimit, setVisibleLimit] = useState(120);
  const [addingIconId, setAddingIconId] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const normalizedQuery = useMemo(
    () => expandHebrewSearch(searchQuery),
    [searchQuery],
  );

  const filteredIcons = useMemo(() => {
    const categoryConfig = CATEGORY_OPTIONS.find(
      (item) => item.id === category,
    );

    return TABLER_ICON_LIBRARY.filter((icon) => {
      const matchesSearch =
        !normalizedQuery ||
        normalizedQuery
          .split(" ")
          .filter(Boolean)
          .every((word) =>
            icon.searchableText.includes(word),
          );

      if (!matchesSearch) return false;
      if (!categoryConfig || category === "all") {
        return true;
      }

      return categoryConfig.keywords.some((keyword) =>
        icon.searchableText.includes(
          normalizeSearch(keyword),
        ),
      );
    });
  }, [category, normalizedQuery]);

  const visibleIcons = useMemo(
    () => filteredIcons.slice(0, visibleLimit),
    [filteredIcons, visibleLimit],
  );

  useEffect(() => {
    setVisibleLimit(120);
  }, [category, normalizedQuery]);

  useEffect(() => {
    if (!success) return;

    const timer = window.setTimeout(() => {
      setSuccess("");
    }, 2200);

    return () => window.clearTimeout(timer);
  }, [success]);

  const selectedAnimation =
    ANIMATION_OPTIONS.find(
      (item) => item.value === animation,
    ) || ANIMATION_OPTIONS[0];

  const previewMotion = getPreviewMotion(animation);

  const addIconToCanvas = async (icon: IconEntry) => {
    setError("");
    setSuccess("");
    setAddingIconId(icon.id);

    try {
      if (typeof editor?.addElement !== "function") {
        throw new Error(
          "הפונקציה addElement לא קיימת בעורך. ודאי שהקובץ useVisualEditorState המעודכן מחובר.",
        );
      }

      if (typeof editor?.updateImage !== "function") {
        throw new Error(
          "הפונקציה updateImage לא קיימת בעורך.",
        );
      }

      const svgMarkup = renderToStaticMarkup(
        React.createElement(icon.Component, {
          size: iconSize,
          color: iconColor,
          stroke: strokeWidth,
          width: iconSize,
          height: iconSize,
          "aria-hidden": "true",
          focusable: "false",
        }),
      );

      const dataUrl = makeSvgDataUrl(svgMarkup);
      const elementId = await editor.addElement("image");

      if (!elementId) {
        throw new Error(
          "לא ניתן היה ליצור את האייקון בקנבס.",
        );
      }

      editor.updateImage(elementId, {
        src: dataUrl,
        url: dataUrl,
        secureUrl: dataUrl,
        secure_url: dataUrl,
        originalUrl: dataUrl,
        alt: icon.title,
        title: icon.title,
        mediaType: "image",
        resourceType: "image",
        resource_type: "image",
        mimeType: "image/svg+xml",
        format: "svg",
        width: iconSize,
        height: iconSize,
        provider: "tabler",
        iconLibrary: "tabler",
        iconName: icon.exportName,
        iconColor,
        iconStroke: strokeWidth,
        uploadState: "uploaded",
      });

      editor.applyStyle?.(elementId, {
        display: "block",
        objectFit: "contain",
        objectPosition: "center",
        backgroundColor: "transparent",
        overflow: "visible",
        border: "0",
        boxShadow: "none",
      });

      editor.applyLayout?.(elementId, {
        width: `${iconSize}px`,
        height: `${iconSize}px`,
        minWidth: `${Math.max(24, iconSize)}px`,
        minHeight: `${Math.max(24, iconSize)}px`,
      });

      editor.updateAttributes?.(elementId, {
        "data-bizuply-icon": "true",
        "data-bizuply-icon-library": "tabler",
        "data-bizuply-icon-name": icon.exportName,
        "aria-label": icon.title,
      });

      if (animation) {
        editor.setAnimation?.(elementId, animation);
      } else {
        editor.clearAnimation?.(elementId);
      }

      editor.applyDataToDom?.();

      window.setTimeout(() => {
        editor.previewAnimation?.(elementId);
      }, 120);

      onInserted?.(elementId);
      setSuccess(`האייקון ${icon.title} נוסף לעמוד`);
    } catch (caughtError) {
      console.error(
        "[Bizuply Animated Icons] add failed",
        caughtError,
      );

      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "הוספת האייקון נכשלה",
      );
    } finally {
      setAddingIconId("");
    }
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-[#f7f8fb]">
      <div className="shrink-0 border-b border-slate-200 bg-white px-6 py-4">
        <div className="grid grid-cols-[minmax(0,1fr)_220px] gap-3">
          <label className="flex h-12 items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 transition focus-within:border-violet-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-violet-100">
            <Search className="h-5 w-5 shrink-0 text-slate-400" />

            <input
              type="search"
              value={searchQuery}
              onChange={(event) =>
                setSearchQuery(event.target.value)
              }
              placeholder="חיפוש אייקון בעברית או באנגלית..."
              className="min-w-0 flex-1 bg-transparent text-sm font-bold text-slate-800 outline-none placeholder:text-slate-400"
            />
          </label>

          <label className="relative">
            <select
              value={animation}
              onChange={(event) =>
                setAnimation(
                  event.target.value as AnimationPreset,
                )
              }
              className="h-12 w-full appearance-none rounded-2xl border border-slate-200 bg-white px-4 pl-10 text-sm font-black text-slate-800 outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
            >
              {ANIMATION_OPTIONS.map((item) => (
                <option
                  key={item.value || "none"}
                  value={item.value}
                >
                  {item.label}
                </option>
              ))}
            </select>

            <ChevronDown className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          </label>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3">
          <label className="flex items-center gap-2">
            <span className="text-xs font-black text-slate-600">
              צבע
            </span>
            <span className="relative h-9 w-12 overflow-hidden rounded-xl border border-slate-200 bg-white">
              <input
                type="color"
                value={iconColor}
                onChange={(event) =>
                  setIconColor(event.target.value)
                }
                className="absolute -inset-2 h-14 w-16 cursor-pointer border-0 bg-transparent"
                aria-label="צבע אייקון"
              />
            </span>
            <input
              dir="ltr"
              value={iconColor}
              onChange={(event) => {
                const value = event.target.value;
                setIconColor(value);
              }}
              className="h-9 w-24 rounded-xl border border-slate-200 bg-white px-2 font-mono text-xs font-bold text-slate-700 outline-none focus:border-violet-400"
            />
          </label>

          <div className="h-8 w-px bg-slate-200" />

          <label className="flex min-w-[190px] flex-1 items-center gap-3">
            <span className="whitespace-nowrap text-xs font-black text-slate-600">
              גודל: {iconSize}px
            </span>
            <input
              type="range"
              min={32}
              max={180}
              step={4}
              value={iconSize}
              onChange={(event) =>
                setIconSize(Number(event.target.value))
              }
              className="min-w-0 flex-1 accent-violet-600"
            />
          </label>

          <div className="h-8 w-px bg-slate-200" />

          <label className="flex min-w-[185px] flex-1 items-center gap-3">
            <span className="whitespace-nowrap text-xs font-black text-slate-600">
              עובי: {strokeWidth.toFixed(1)}
            </span>
            <input
              type="range"
              min={1}
              max={3}
              step={0.1}
              value={strokeWidth}
              onChange={(event) =>
                setStrokeWidth(Number(event.target.value))
              }
              className="min-w-0 flex-1 accent-violet-600"
            />
          </label>
        </div>

        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {CATEGORY_OPTIONS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setCategory(item.id)}
              className={[
                "whitespace-nowrap rounded-full px-4 py-2 text-xs font-black transition",
                category === item.id
                  ? "bg-slate-950 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200",
              ].join(" ")}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="mt-3 flex items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-2">
            <Sparkles className="h-4 w-4 shrink-0 text-violet-600" />
            <p className="truncate text-xs font-bold text-slate-500">
              {selectedAnimation.label} —{" "}
              {selectedAnimation.description}
            </p>
          </div>

          <span className="shrink-0 rounded-full bg-violet-50 px-3 py-1.5 text-xs font-black text-violet-700">
            {filteredIcons.length.toLocaleString("he-IL")} אייקונים
          </span>
        </div>

        {error ? (
          <div className="mt-3 flex items-start gap-2 rounded-2xl border border-rose-200 bg-rose-50 p-3 text-xs font-bold leading-5 text-rose-700">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            {error}
          </div>
        ) : null}

        {success ? (
          <div className="mt-3 flex items-start gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-bold leading-5 text-emerald-700">
            <Check className="mt-0.5 h-4 w-4 shrink-0" />
            {success}
          </div>
        ) : null}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-6">
        {visibleIcons.length ? (
          <>
            <div className="grid grid-cols-4 gap-4">
              {visibleIcons.map((icon) => {
                const IconComponent = icon.Component;
                const isAdding =
                  addingIconId === icon.id;

                return (
                  <button
                    key={icon.id}
                    type="button"
                    disabled={Boolean(addingIconId)}
                    onClick={() =>
                      void addIconToCanvas(icon)
                    }
                    title={`הוספת ${icon.title}`}
                    className="group overflow-hidden rounded-[22px] border border-slate-200 bg-white text-right shadow-sm transition duration-200 hover:-translate-y-1 hover:border-violet-300 hover:shadow-[0_18px_40px_rgba(91,33,182,0.12)] disabled:cursor-wait disabled:opacity-70"
                  >
                    <div className="flex h-[128px] items-center justify-center overflow-hidden border-b border-slate-100 bg-gradient-to-br from-white to-slate-50">
                      {isAdding ? (
                        <BizuplyLoader size="lg" />
                      ) : (
                        <motion.div
                          {...previewMotion}
                          className="flex h-20 w-20 items-center justify-center"
                        >
                          <IconComponent
                            size={Math.min(68, iconSize)}
                            color={iconColor}
                            stroke={strokeWidth}
                          />
                        </motion.div>
                      )}
                    </div>

                    <div className="flex items-start justify-between gap-2 p-3">
                      <div className="min-w-0">
                        <h4
                          dir="ltr"
                          className="truncate text-left text-xs font-black text-slate-950"
                        >
                          {icon.title}
                        </h4>
                        <p className="mt-1 truncate text-[10px] font-bold text-slate-400">
                          Tabler + Bizuply Motion
                        </p>
                      </div>

                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-700 transition group-hover:bg-violet-600 group-hover:text-white">
                        <Sparkles className="h-4 w-4" />
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {visibleIcons.length < filteredIcons.length ? (
              <div className="mt-6 flex justify-center">
                <button
                  type="button"
                  onClick={() =>
                    setVisibleLimit((current) =>
                      current + 120,
                    )
                  }
                  className="inline-flex h-11 items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 text-sm font-black text-slate-700 shadow-sm transition hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700"
                >
                  הצגת עוד 120 אייקונים
                </button>
              </div>
            ) : null}
          </>
        ) : (
          <div className="flex h-full min-h-[320px] flex-col items-center justify-center rounded-[28px] border-2 border-dashed border-slate-200 bg-white px-8 text-center">
            <Search className="h-10 w-10 text-slate-300" />
            <h3 className="mt-4 text-base font-black text-slate-900">
              לא נמצאו אייקונים
            </h3>
            <p className="mt-2 text-sm font-bold text-slate-400">
              נסו מילה אחרת או עברו לקטגוריית הכול
            </p>
          </div>
        )}
      </div>
    </div>
  );
}