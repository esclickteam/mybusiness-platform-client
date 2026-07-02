import React, { useEffect, useMemo, useState } from "react";
import { Check, ChevronDown, Search, Type, Upload, Globe2, X } from "lucide-react";

type StudioFontPickerProps = {
  value: string;
  onChange: (fontFamily: string) => void;
};

type StudioFont = {
  label: string;
  family: string;
  category: "Hebrew" | "Sans" | "Serif" | "Display" | "Handwriting";
};

const GOOGLE_FONTS: StudioFont[] = [
  { label: "Assistant", family: "Assistant", category: "Hebrew" },
  { label: "Heebo", family: "Heebo", category: "Hebrew" },
  { label: "Rubik", family: "Rubik", category: "Hebrew" },
  { label: "Alef", family: "Alef", category: "Hebrew" },
  { label: "Arimo", family: "Arimo", category: "Hebrew" },
  { label: "Secular One", family: "Secular One", category: "Hebrew" },
  { label: "Frank Ruhl Libre", family: "Frank Ruhl Libre", category: "Hebrew" },
  { label: "Noto Sans Hebrew", family: "Noto Sans Hebrew", category: "Hebrew" },
  { label: "Noto Serif Hebrew", family: "Noto Serif Hebrew", category: "Hebrew" },

  { label: "Inter", family: "Inter", category: "Sans" },
  { label: "Roboto", family: "Roboto", category: "Sans" },
  { label: "Open Sans", family: "Open Sans", category: "Sans" },
  { label: "Lato", family: "Lato", category: "Sans" },
  { label: "Montserrat", family: "Montserrat", category: "Sans" },
  { label: "Poppins", family: "Poppins", category: "Sans" },
  { label: "Nunito", family: "Nunito", category: "Sans" },
  { label: "Raleway", family: "Raleway", category: "Sans" },
  { label: "Work Sans", family: "Work Sans", category: "Sans" },
  { label: "DM Sans", family: "DM Sans", category: "Sans" },
  { label: "Manrope", family: "Manrope", category: "Sans" },
  { label: "Plus Jakarta Sans", family: "Plus Jakarta Sans", category: "Sans" },
  { label: "Urbanist", family: "Urbanist", category: "Sans" },
  { label: "Outfit", family: "Outfit", category: "Sans" },
  { label: "Quicksand", family: "Quicksand", category: "Sans" },
  { label: "Barlow", family: "Barlow", category: "Sans" },
  { label: "Mulish", family: "Mulish", category: "Sans" },
  { label: "Jost", family: "Jost", category: "Sans" },

  { label: "Playfair Display", family: "Playfair Display", category: "Serif" },
  { label: "Cormorant Garamond", family: "Cormorant Garamond", category: "Serif" },
  { label: "Libre Baskerville", family: "Libre Baskerville", category: "Serif" },
  { label: "Lora", family: "Lora", category: "Serif" },
  { label: "Merriweather", family: "Merriweather", category: "Serif" },
  { label: "Bodoni Moda", family: "Bodoni Moda", category: "Serif" },
  { label: "Cinzel", family: "Cinzel", category: "Serif" },
  { label: "Prata", family: "Prata", category: "Serif" },
  { label: "Caudex", family: "Caudex", category: "Serif" },
  { label: "Clarendon LT", family: "Clarendon LT", category: "Serif" },

  { label: "Abril Fatface", family: "Abril Fatface", category: "Display" },
  { label: "Bebas Neue", family: "Bebas Neue", category: "Display" },
  { label: "Oswald", family: "Oswald", category: "Display" },
  { label: "Anton", family: "Anton", category: "Display" },
  { label: "Archivo Black", family: "Archivo Black", category: "Display" },
  { label: "Staatliches", family: "Staatliches", category: "Display" },
  { label: "Righteous", family: "Righteous", category: "Display" },
  { label: "Fjalla One", family: "Fjalla One", category: "Display" },
  { label: "Bungee", family: "Bungee", category: "Display" },
  { label: "Bangers", family: "Bangers", category: "Display" },

  { label: "Pacifico", family: "Pacifico", category: "Handwriting" },
  { label: "Dancing Script", family: "Dancing Script", category: "Handwriting" },
  { label: "Great Vibes", family: "Great Vibes", category: "Handwriting" },
  { label: "Caveat", family: "Caveat", category: "Handwriting" },
  { label: "Satisfy", family: "Satisfy", category: "Handwriting" },
  { label: "Shadows Into Light", family: "Shadows Into Light", category: "Handwriting" },
  { label: "Chelsea Market", family: "Chelsea Market", category: "Handwriting" },
];

function getFontLabel(value: string) {
  const clean = String(value || "")
    .replace(/['"]/g, "")
    .split(",")[0]
    .trim();

  return clean || "גופן";
}

function fontCssFamily(font: string) {
  return `"${font}", Arial, sans-serif`;
}

function loadGoogleFont(font: string) {
  if (typeof document === "undefined") return;
  if (!font) return;

  const id = `bizuply-google-font-${font
    .replace(/[^a-z0-9]/gi, "-")
    .toLowerCase()}`;

  if (document.getElementById(id)) return;

  const link = document.createElement("link");
  link.id = id;
  link.rel = "stylesheet";
  link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(
    font,
  ).replace(/%20/g, "+")}:wght@300;400;500;600;700;800;900&display=swap`;

  document.head.appendChild(link);
}

export default function StudioFontPicker({
  value,
  onChange,
}: StudioFontPickerProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const currentLabel = getFontLabel(value);

  const filteredFonts = useMemo(() => {
    const clean = query.trim().toLowerCase();

    if (!clean) return GOOGLE_FONTS;

    return GOOGLE_FONTS.filter((font) =>
      `${font.label} ${font.family} ${font.category}`
        .toLowerCase()
        .includes(clean),
    );
  }, [query]);

  useEffect(() => {
    GOOGLE_FONTS.slice(0, 18).forEach((font) => loadGoogleFont(font.family));
  }, []);

  function chooseFont(font: StudioFont) {
    loadGoogleFont(font.family);
    onChange(fontCssFamily(font.family));
    setOpen(false);
    setQuery("");
  }

  return (
    <div className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        title="גופן"
        className="
          inline-flex h-9 w-[132px] items-center justify-between gap-2
          rounded-lg px-2 text-sm font-bold text-slate-900
          transition hover:bg-slate-100
        "
      >
        <span className="min-w-0 truncate" style={{ fontFamily: value }}>
          {currentLabel}
        </span>

        <ChevronDown className="h-4 w-4 shrink-0 text-slate-500" />
      </button>

      {open && (
        <>
          <button
            type="button"
            className="fixed inset-0 z-[999998] cursor-default bg-transparent"
            onClick={() => setOpen(false)}
            aria-label="Close fonts"
          />

          <div
            dir="ltr"
            className="
              fixed left-1/2 top-[132px] z-[999999]
              flex h-[min(760px,calc(100vh-160px))] w-[520px]
              -translate-x-1/2 flex-col overflow-hidden rounded-[24px]
              border border-slate-200 bg-white shadow-[0_28px_90px_rgba(15,23,42,0.22)]
            "
          >
            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
              <div className="text-sm font-black text-slate-900">Fonts</div>

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="border-b border-slate-100 p-4">
              <div
                className="
                  flex h-12 items-center gap-3 rounded-2xl border border-blue-500
                  bg-white px-4 shadow-[0_0_0_3px_rgba(37,99,235,0.08)]
                "
              >
                <Search className="h-5 w-5 text-slate-500" />

                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  autoFocus
                  placeholder="Search fonts..."
                  className="min-w-0 flex-1 bg-transparent text-lg font-medium text-slate-900 outline-none"
                />
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto p-3">
              {filteredFonts.map((font) => {
                const active = currentLabel === font.family;

                return (
                  <button
                    key={font.family}
                    type="button"
                    onMouseEnter={() => loadGoogleFont(font.family)}
                    onClick={() => chooseFont(font)}
                    className="
                      group flex w-full items-center justify-between gap-4
                      rounded-2xl px-4 py-3 text-left transition hover:bg-slate-50
                    "
                  >
                    <span className="min-w-0">
                      <span
                        className="block truncate text-[27px] leading-tight text-slate-950"
                        style={{ fontFamily: fontCssFamily(font.family) }}
                      >
                        {font.label}
                      </span>

                      <span className="mt-1 block text-xs font-bold uppercase tracking-[0.12em] text-slate-400">
                        {font.category}
                      </span>
                    </span>

                    {active ? (
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white">
                        <Check className="h-4 w-4" />
                      </span>
                    ) : (
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-slate-300 opacity-0 transition group-hover:opacity-100">
                        <Type className="h-4 w-4" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between border-t border-slate-100 px-5 py-4">
              <button
                type="button"
                className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700"
              >
                <Upload className="h-4 w-4" />
                Upload fonts
              </button>

              <div className="h-6 w-px bg-slate-200" />

              <button
                type="button"
                className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700"
              >
                <Globe2 className="h-4 w-4" />
                Add language
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}