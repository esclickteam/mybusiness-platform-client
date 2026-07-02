import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Check, ChevronDown, Loader2, RefreshCw, Search } from "lucide-react";

type StudioFontPickerProps = {
  value: string;
  onChange: (fontFamily: string) => void;
};

type ServerGoogleFont = {
  family: string;
  category?: string;
  variants?: string[];
  subsets?: string[];
  files?: Record<string, string>;
  version?: string;
  lastModified?: string;
};

type StudioFont = {
  label: string;
  family: string;
  category: string;
  variants: string[];
  subsets: string[];
};

type GoogleFontsResponse = {
  ok?: boolean;
  source?: "google" | "cache" | "fallback" | string;
  count?: number;
  fonts?: ServerGoogleFont[];
  warning?: string;
};

const RAW_API_BASE =
  import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || "";

const API_BASE = RAW_API_BASE.replace(/\/api\/?$/, "").replace(/\/$/, "");

const DROPDOWN_WIDTH = 300;
const DROPDOWN_MAX_HEIGHT = 390;

const FALLBACK_FONTS: StudioFont[] = [
  {
    label: "Assistant",
    family: "Assistant",
    category: "sans-serif",
    variants: ["regular", "500", "600", "700", "800"],
    subsets: ["hebrew", "latin"],
  },
  {
    label: "Heebo",
    family: "Heebo",
    category: "sans-serif",
    variants: ["regular", "500", "600", "700", "800"],
    subsets: ["hebrew", "latin"],
  },
  {
    label: "Rubik",
    family: "Rubik",
    category: "sans-serif",
    variants: ["regular", "500", "600", "700", "800"],
    subsets: ["hebrew", "latin"],
  },
  {
    label: "Inter",
    family: "Inter",
    category: "sans-serif",
    variants: ["regular", "500", "600", "700", "800", "900"],
    subsets: ["latin"],
  },
  {
    label: "Roboto",
    family: "Roboto",
    category: "sans-serif",
    variants: ["regular", "500", "700", "900"],
    subsets: ["latin"],
  },
  {
    label: "Open Sans",
    family: "Open Sans",
    category: "sans-serif",
    variants: ["regular", "500", "600", "700", "800"],
    subsets: ["latin"],
  },
  {
    label: "Montserrat",
    family: "Montserrat",
    category: "sans-serif",
    variants: ["regular", "500", "600", "700", "800", "900"],
    subsets: ["latin"],
  },
  {
    label: "Poppins",
    family: "Poppins",
    category: "sans-serif",
    variants: ["regular", "500", "600", "700", "800", "900"],
    subsets: ["latin"],
  },
  {
    label: "Playfair Display",
    family: "Playfair Display",
    category: "serif",
    variants: ["regular", "500", "600", "700", "800", "900"],
    subsets: ["latin"],
  },
  {
    label: "Anton",
    family: "Anton",
    category: "sans-serif",
    variants: ["regular"],
    subsets: ["latin"],
  },
];

function getToken() {
  if (typeof window === "undefined") return "";

  return localStorage.getItem("token") || "";
}

async function apiRequest<T>(url: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();

  const res = await fetch(`${API_BASE}${url}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(data?.message || data?.error || "Request failed");
  }

  return data as T;
}

function normalizeServerFont(font: ServerGoogleFont): StudioFont | null {
  const family = String(font?.family || "").trim();

  if (!family) return null;

  return {
    label: family,
    family,
    category: String(font?.category || "sans-serif").trim(),
    variants: Array.isArray(font?.variants) ? font.variants : [],
    subsets: Array.isArray(font?.subsets) ? font.subsets : [],
  };
}

function sortFonts(fonts: StudioFont[]) {
  return [...fonts].sort((a, b) =>
    a.family.localeCompare(b.family, "en", {
      sensitivity: "base",
    }),
  );
}

function getFontLabel(value: string) {
  const clean = String(value || "")
    .replace(/['"]/g, "")
    .split(",")[0]
    .trim();

  return clean || "גופן";
}

function fontCssFamily(font: string) {
  if (font === "Arial") return "Arial, sans-serif";
  if (font === "Arial Black") return "'Arial Black', Arial, sans-serif";

  return `"${font}", Arial, sans-serif`;
}

function normalizeGoogleFontWeight(variant: string) {
  const clean = String(variant || "").trim();

  if (!clean) return "";
  if (clean === "regular") return "400";
  if (clean === "italic") return "400";

  if (clean.endsWith("italic")) {
    return clean.replace("italic", "") || "400";
  }

  return clean;
}

function getUsefulWeights(variants: string[]) {
  const weights = new Set<string>();

  variants.forEach((variant) => {
    const weight = normalizeGoogleFontWeight(variant);

    if (/^\d+$/.test(weight)) {
      weights.add(weight);
    }
  });

  if (weights.size === 0) {
    weights.add("400");
  }

  return Array.from(weights).sort((a, b) => Number(a) - Number(b)).join(";");
}

function loadGoogleFont(font: StudioFont | string) {
  if (typeof document === "undefined") return;

  const family = typeof font === "string" ? font : font.family;
  const variants = typeof font === "string" ? [] : font.variants;

  if (!family) return;
  if (family === "Arial" || family === "Arial Black") return;

  const id = `bizuply-google-font-${family
    .replace(/[^a-z0-9]/gi, "-")
    .toLowerCase()}`;

  if (document.getElementById(id)) return;

  const weights = getUsefulWeights(variants);

  const link = document.createElement("link");
  link.id = id;
  link.rel = "stylesheet";
  link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(
    family,
  ).replace(/%20/g, "+")}:wght@${weights}&display=swap`;

  document.head.appendChild(link);
}

export default function StudioFontPicker({
  value,
  onChange,
}: StudioFontPickerProps) {
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [fonts, setFonts] = useState<StudioFont[]>(FALLBACK_FONTS);
  const [loadingFonts, setLoadingFonts] = useState(false);
  const [source, setSource] = useState<string>("fallback");
  const [position, setPosition] = useState({
    top: 0,
    left: 0,
  });

  const currentLabel = getFontLabel(value);

  const filteredFonts = useMemo(() => {
    const clean = query.trim().toLowerCase();

    if (!clean) return fonts;

    return fonts.filter((font) =>
      `${font.label} ${font.family} ${font.category} ${font.subsets.join(" ")}`
        .toLowerCase()
        .includes(clean),
    );
  }, [fonts, query]);

  async function loadFontsFromServer(refresh = false) {
    try {
      setLoadingFonts(true);

      const data = await apiRequest<GoogleFontsResponse>(
        refresh ? "/api/google-fonts?refresh=true" : "/api/google-fonts",
      );

      const serverFonts = Array.isArray(data?.fonts)
        ? data.fonts
            .map(normalizeServerFont)
            .filter((font): font is StudioFont => Boolean(font))
        : [];

      if (serverFonts.length > 0) {
        const sortedFonts = sortFonts(serverFonts);

        setFonts(sortedFonts);
        setSource(data?.source || "google");

        sortedFonts.slice(0, 20).forEach((font) => loadGoogleFont(font));

        return;
      }

      setFonts(FALLBACK_FONTS);
      setSource("fallback");
    } catch (error) {
      console.error("Failed to load Google Fonts from server:", error);

      setFonts(FALLBACK_FONTS);
      setSource("fallback");
    } finally {
      setLoadingFonts(false);
    }
  }

  useEffect(() => {
    loadFontsFromServer(false);
  }, []);

  useEffect(() => {
    FALLBACK_FONTS.forEach((font) => loadGoogleFont(font));
  }, []);

  useEffect(() => {
    if (!open) return;

    function updatePosition() {
      const rect = buttonRef.current?.getBoundingClientRect();

      if (!rect) return;

      const margin = 12;

      let left = rect.left + rect.width - DROPDOWN_WIDTH;

      if (left < margin) {
        left = margin;
      }

      if (left + DROPDOWN_WIDTH > window.innerWidth - margin) {
        left = window.innerWidth - DROPDOWN_WIDTH - margin;
      }

      setPosition({
        top: rect.bottom + 6,
        left,
      });
    }

    updatePosition();

    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [open]);

  function chooseFont(font: StudioFont) {
    loadGoogleFont(font);
    onChange(fontCssFamily(font.family));
    setOpen(false);
    setQuery("");
  }

  const dropdown =
    open && typeof document !== "undefined"
      ? createPortal(
          <>
            <button
              type="button"
              className="fixed inset-0 z-[999990] cursor-default bg-transparent"
              onClick={() => setOpen(false)}
              aria-label="Close fonts"
            />

            <div
              dir="ltr"
              className="
                fixed z-[999999]
                flex flex-col overflow-hidden
                border border-slate-300 bg-white text-slate-950
                shadow-[0_18px_45px_rgba(15,23,42,0.16)]
              "
              style={{
                top: position.top,
                left: position.left,
                width: DROPDOWN_WIDTH,
                maxHeight: DROPDOWN_MAX_HEIGHT,
              }}
            >
              <div className="border-b border-slate-200 bg-white p-2">
                <div
                  className="
                    flex h-10 items-center gap-2 rounded-md border border-blue-500
                    bg-white px-3
                  "
                >
                  <Search className="h-4 w-4 text-slate-700" />

                  <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    autoFocus
                    placeholder="Search fonts..."
                    className="
                      min-w-0 flex-1 bg-transparent text-sm font-medium
                      text-slate-900 outline-none placeholder:text-slate-400
                    "
                  />

                  {loadingFonts && (
                    <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                  )}
                </div>
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto py-1">
                {filteredFonts.map((font) => {
                  const active = currentLabel === font.family;

                  return (
                    <button
                      key={`${font.family}-${font.category}`}
                      type="button"
                      onMouseEnter={() => loadGoogleFont(font)}
                      onClick={() => chooseFont(font)}
                      className="
                        flex h-10 w-full items-center justify-between gap-3
                        px-3 text-left text-[15px] text-slate-900
                        transition hover:bg-blue-50
                      "
                    >
                      <span
                        className="min-w-0 truncate"
                        style={{ fontFamily: fontCssFamily(font.family) }}
                      >
                        {font.label}
                      </span>

                      {active && (
                        <Check className="h-4 w-4 shrink-0 text-blue-600" />
                      )}
                    </button>
                  );
                })}

                {!loadingFonts && filteredFonts.length === 0 && (
                  <div className="px-4 py-6 text-center text-sm font-semibold text-slate-500">
                    No fonts found
                  </div>
                )}
              </div>

              <div className="flex h-10 shrink-0 items-center justify-between border-t border-slate-200 bg-white px-3">
                <span className="text-[11px] font-semibold text-slate-400">
                  {source === "google" || source === "cache"
                    ? `${fonts.length} Google Fonts`
                    : "Fallback fonts"}
                </span>

                <button
                  type="button"
                  onClick={() => loadFontsFromServer(true)}
                  disabled={loadingFonts}
                  className="
                    inline-flex items-center gap-1 text-[11px] font-bold
                    text-blue-600 hover:text-blue-700 disabled:opacity-50
                  "
                >
                  <RefreshCw
                    className={[
                      "h-3 w-3",
                      loadingFonts ? "animate-spin" : "",
                    ].join(" ")}
                  />
                  Refresh
                </button>
              </div>
            </div>
          </>,
          document.body,
        )
      : null;

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((current) => !current)}
        title="גופן"
        className="
          inline-flex h-9 w-[132px] shrink-0 items-center justify-between gap-2
          rounded-lg px-2 text-sm font-bold text-slate-900
          transition hover:bg-slate-100
        "
      >
        <span className="min-w-0 truncate" style={{ fontFamily: value }}>
          {currentLabel}
        </span>

        <ChevronDown className="h-4 w-4 shrink-0 text-slate-500" />
      </button>

      {dropdown}
    </>
  );
}