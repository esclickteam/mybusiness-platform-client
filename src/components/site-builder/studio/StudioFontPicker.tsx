import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Check, ChevronDown, Search } from "lucide-react";

type StudioFontPickerProps = {
  value: string;
  onChange: (fontFamily: string) => void;
};

type StudioFont = {
  label: string;
  family: string;
  category: "Hebrew" | "Sans" | "Serif" | "Display" | "Handwriting";
};

const DROPDOWN_WIDTH = 300;
const DROPDOWN_MAX_HEIGHT = 390;

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
  { label: "Almarai", family: "Almarai", category: "Sans" },
  { label: "Archivo", family: "Archivo", category: "Sans" },
  { label: "Anybody", family: "Anybody", category: "Sans" },

  { label: "Arial", family: "Arial", category: "Sans" },
  { label: "Arial Black", family: "Arial Black", category: "Display" },

  { label: "Aboreto", family: "Aboreto", category: "Serif" },
  { label: "Adobe Caslon", family: "Libre Caslon Text", category: "Serif" },
  { label: "Playfair Display", family: "Playfair Display", category: "Serif" },
  { label: "Cormorant Garamond", family: "Cormorant Garamond", category: "Serif" },
  { label: "Libre Baskerville", family: "Libre Baskerville", category: "Serif" },
  { label: "Lora", family: "Lora", category: "Serif" },
  { label: "Merriweather", family: "Merriweather", category: "Serif" },
  { label: "Bodoni Moda", family: "Bodoni Moda", category: "Serif" },
  { label: "Cinzel", family: "Cinzel", category: "Serif" },
  { label: "Prata", family: "Prata", category: "Serif" },
  { label: "Caudex", family: "Caudex", category: "Serif" },

  { label: "Anton", family: "Anton", category: "Display" },
  { label: "Abril Fatface", family: "Abril Fatface", category: "Display" },
  { label: "Bebas Neue", family: "Bebas Neue", category: "Display" },
  { label: "Oswald", family: "Oswald", category: "Display" },
  { label: "Archivo Black", family: "Archivo Black", category: "Display" },
  { label: "Staatliches", family: "Staatliches", category: "Display" },
  { label: "Righteous", family: "Righteous", category: "Display" },
  { label: "Fjalla One", family: "Fjalla One", category: "Display" },
  { label: "Bungee", family: "Bungee", category: "Display" },
  { label: "Bangers", family: "Bangers", category: "Display" },

  { label: "Amatic SC", family: "Amatic SC", category: "Handwriting" },
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
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [position, setPosition] = useState({
    top: 0,
    left: 0,
  });

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
    GOOGLE_FONTS.slice(0, 20).forEach((font) => loadGoogleFont(font.family));
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
    loadGoogleFont(font.family);
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
                </div>
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto py-1">
                {filteredFonts.map((font) => {
                  const active = currentLabel === font.family;

                  return (
                    <button
                      key={`${font.family}-${font.label}`}
                      type="button"
                      onMouseEnter={() => loadGoogleFont(font.family)}
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
              </div>

              <div className="flex h-10 shrink-0 items-center justify-between border-t border-slate-200 bg-white px-3">
                <button
                  type="button"
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700"
                >
                  Upload fonts
                </button>

                <button
                  type="button"
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700"
                >
                  Language
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