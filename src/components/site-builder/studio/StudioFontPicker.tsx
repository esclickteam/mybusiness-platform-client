import React, { useEffect, useMemo, useState } from "react";
import {
  Check,
  ChevronDown,
  Globe2,
  Search,
  Type,
  Upload,
} from "lucide-react";

type StudioFontPickerProps = {
  value: string;
  onChange: (fontFamily: string) => void;
};

type StudioFont = {
  label: string;
  family: string;
  category: "Hebrew" | "Sans" | "Serif" | "Display" | "Handwriting";
  hasFamily?: boolean;
};

const GOOGLE_FONTS: StudioFont[] = [
  { label: "Aboreto", family: "Aboreto", category: "Serif" },
  { label: "Adobe Caslon", family: "Libre Caslon Text", category: "Serif" },
  { label: "Aether", family: "Inter", category: "Sans", hasFamily: true },
  { label: "Alfabet", family: "Montserrat", category: "Sans", hasFamily: true },
  { label: "Alliance No.2", family: "Manrope", category: "Sans", hasFamily: true },
  { label: "Almarai", family: "Almarai", category: "Sans", hasFamily: true },
  { label: "Amatic SC", family: "Amatic SC", category: "Handwriting", hasFamily: true },
  { label: "American Typewriter", family: "Special Elite", category: "Serif" },
  { label: "Anton", family: "Anton", category: "Display" },
  { label: "Anybody", family: "Anybody", category: "Display", hasFamily: true },
  { label: "Archivo", family: "Archivo", category: "Sans", hasFamily: true },
  { label: "Arial", family: "Arial", category: "Sans" },
  { label: "Arial Black", family: "Arial Black", category: "Display" },

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

  { label: "Abril Fatface", family: "Abril Fatface", category: "Display" },
  { label: "Bebas Neue", family: "Bebas Neue", category: "Display" },
  { label: "Oswald", family: "Oswald", category: "Display" },
  { label: "Archivo Black", family: "Archivo Black", category: "Display" },
  { label: "Staatliches", family: "Staatliches", category: "Display" },
  { label: "Righteous", family: "Righteous", category: "Display" },
  { label: "Fjalla One", family: "Fjalla One", category: "Display" },
  { label: "Bungee", family: "Bungee", category: "Display" },
  { label: "Bangers", family: "Bangers", category: "Display" },

  { label: "Pacifico", family: "Pacifico", category: "Handwriting" },
  { label: "Dancing Script", family: "Dancing Script", category: "Handwriting" },
  { label: "Great Vibes", family: "Great Vibes", category: "Handwriting" },
  { label: "Caveat", family: "Caveat", category: "Handwriting", hasFamily: true },
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
  if (font === "Arial") return "Arial, sans-serif";
  if (font === "Arial Black") return "'Arial Black', Arial, sans-serif";

  return `"${font}", Arial, sans-serif`;
}

function loadGoogleFont(font: string) {
  if (typeof document === "undefined") return;
  if (!font) return;

  if (font === "Arial" || font === "Arial Black") return;

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
    GOOGLE_FONTS.slice(0, 22).forEach((font) => loadGoogleFont(font.family));
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
            className="fixed inset-0 z-[999990] cursor-default bg-transparent"
            onClick={() => setOpen(false)}
            aria-label="Close fonts"
          />

          <div
            dir="ltr"
            className="
              absolute right-0 top-[calc(100%+10px)] z-[999999]
              flex h-[560px] w-[380px] flex-col overflow-hidden
              rounded-[18px] border border-slate-200 bg-white
              shadow-[0_24px_70px_rgba(15,23,42,0.18)]
            "
          >
            <div className="border-b border-slate-100 px-4 py-4">
              <div
                className="
                  flex h-[50px] items-center gap-3 rounded-[14px]
                  border border-blue-500 bg-white px-4
                  shadow-[0_0_0_3px_rgba(37,99,235,0.07)]
                "
              >
                <Search className="h-5 w-5 text-slate-800" />

                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  autoFocus
                  placeholder="Search fonts..."
                  className="
                    min-w-0 flex-1 bg-transparent text-[18px]
                    font-normal text-slate-900 outline-none
                    placeholder:text-slate-400
                  "
                />
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-4 py-3">
              {filteredFonts.map((font) => {
                const active = currentLabel === font.family;

                return (
                  <button
                    key={`${font.family}-${font.label}`}
                    type="button"
                    onMouseEnter={() => loadGoogleFont(font.family)}
                    onClick={() => chooseFont(font)}
                    className="
                      group flex min-h-[54px] w-full items-center justify-between gap-4
                      rounded-[10px] px-1 py-2 text-left transition hover:bg-slate-50
                    "
                  >
                    <span
                      className="min-w-0 truncate text-[24px] leading-none text-slate-950"
                      style={{ fontFamily: fontCssFamily(font.family) }}
                    >
                      {font.label}
                    </span>

                    <span className="flex h-7 w-7 shrink-0 items-center justify-center">
                      {active ? (
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-white">
                          <Check className="h-4 w-4" />
                        </span>
                      ) : font.hasFamily ? (
                        <ChevronDown className="h-5 w-5 -rotate-90 text-slate-900" />
                      ) : (
                        <Type className="h-4 w-4 text-transparent transition group-hover:text-slate-300" />
                      )}
                    </span>
                  </button>
                );
              })}
            </div>

            <div
              className="
                flex h-[62px] shrink-0 items-center justify-between
                border-t border-slate-100 bg-white px-5
              "
            >
              <button
                type="button"
                className="
                  inline-flex items-center gap-2 text-[15px]
                  font-medium text-blue-600 transition hover:text-blue-700
                "
              >
                <Upload className="h-4 w-4" />
                Upload fonts
              </button>

              <div className="h-8 w-px bg-slate-200" />

              <button
                type="button"
                className="
                  inline-flex items-center gap-2 text-[15px]
                  font-medium text-blue-600 transition hover:text-blue-700
                "
              >
                <Globe2 className="h-5 w-5" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}