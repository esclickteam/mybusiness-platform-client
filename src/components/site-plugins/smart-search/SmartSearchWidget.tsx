import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { GripVertical, Search, X } from "lucide-react";

import {
  buildSiteSearchIndex,
  filterSiteSearchResults,
  mergeSmartSearchSettings,
  scrollToSearchResult,
  type SiteSearchResult,
  type SmartSearchSettings,
} from "./smartSearchUtils";

type SmartSearchWidgetProps = {
  settings?: Partial<SmartSearchSettings> | null;
  pages?: Array<{ id?: string; title?: string; name?: string; slug?: string }>;
  mode?: "live" | "editor";
  onPositionChange?: (pos: { x: number; y: number }) => void;
};

export default function SmartSearchWidget({
  settings: settingsProp,
  pages,
  mode = "live",
  onPositionChange,
}: SmartSearchWidgetProps) {
  const settings = useMemo(
    () => mergeSmartSearchSettings(settingsProp),
    [settingsProp]
  );
  const isEditor = mode === "editor";
  const position = settings.triggerPosition || { x: 6, y: 12 };
  const accent = settings.accentColor || "#2563EB";

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [dragPos, setDragPos] = useState(position);
  const dragRef = useRef<{ startX: number; startY: number; origX: number; origY: number } | null>(
    null
  );
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setDragPos(position);
  }, [position.x, position.y]);

  useEffect(() => {
    if (!open) return;
    const t = window.setTimeout(() => inputRef.current?.focus(), 50);
    return () => window.clearTimeout(t);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        setQuery("");
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const index = useMemo(
    () => buildSiteSearchIndex(pages, { showPages: settings.showPages }),
    [pages, settings.showPages, open]
  );

  const results = useMemo(
    () => filterSiteSearchResults(index, query),
    [index, query]
  );

  const openSearch = useCallback(() => {
    setOpen(true);
  }, []);

  const closeSearch = useCallback(() => {
    setOpen(false);
    setQuery("");
  }, []);

  function onPointerDown(e: React.PointerEvent) {
    if (!isEditor) return;
    e.preventDefault();
    e.stopPropagation();
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      origX: dragPos.x,
      origY: dragPos.y,
    };
  }

  function onPointerMove(e: React.PointerEvent) {
    if (!dragRef.current || !isEditor) return;
    const vw = window.innerWidth || 1;
    const vh = window.innerHeight || 1;
    const dx = ((e.clientX - dragRef.current.startX) / vw) * 100;
    const dy = ((e.clientY - dragRef.current.startY) / vh) * 100;
    const next = {
      x: Math.min(96, Math.max(4, dragRef.current.origX + dx)),
      y: Math.min(96, Math.max(4, dragRef.current.origY + dy)),
    };
    setDragPos(next);
  }

  function onPointerUp() {
    if (!dragRef.current || !isEditor) return;
    dragRef.current = null;
    onPositionChange?.(dragPos);
  }

  function handleSelect(result: SiteSearchResult) {
    if (isEditor) return;
    scrollToSearchResult(result);
    closeSearch();
  }

  if (settings.isActive === false) return null;

  return (
    <div data-bizuply-smart-search="true" dir="rtl">
      <style>{`
        .bizuply-search-highlight {
          outline: 2px solid ${accent} !important;
          outline-offset: 4px;
          transition: outline-color 0.2s ease;
        }
      `}</style>

      {settings.showTrigger !== false ? (
        <div
          className="fixed z-[99980]"
          style={{
            left: `${dragPos.x}%`,
            top: `${dragPos.y}%`,
            transform: "translate(-50%, -50%)",
          }}
        >
          {isEditor ? (
            <span
              className="absolute -left-2 -top-2 flex h-6 w-6 cursor-grab items-center justify-center rounded-full bg-slate-900/80 text-white"
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
            >
              <GripVertical size={12} />
            </span>
          ) : null}

          <button
            type="button"
            onClick={openSearch}
            aria-label="חיפוש באתר"
            className="flex h-12 w-12 items-center justify-center rounded-full shadow-lg transition hover:scale-105"
            style={{ background: accent, color: "#fff" }}
          >
            <Search size={20} />
          </button>
        </div>
      ) : null}

      {open ? (
        <div
          className="fixed inset-0 z-[99990] flex items-start justify-center bg-black/40 p-4 pt-16 backdrop-blur-[2px]"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) closeSearch();
          }}
        >
          <div className="w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center gap-2 border-b border-slate-100 px-4 py-3">
              <Search size={18} className="shrink-0 text-slate-400" />
              <input
                ref={inputRef}
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={settings.placeholder || "חיפוש באתר..."}
                className="min-w-0 flex-1 bg-transparent text-base font-medium text-slate-800 outline-none placeholder:text-slate-400"
              />
              <button
                type="button"
                onClick={closeSearch}
                className="flex h-8 w-8 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100"
                aria-label="סגירה"
              >
                <X size={16} />
              </button>
            </div>

            <div className="max-h-[min(60vh,420px)] overflow-y-auto p-2">
              {!query.trim() ? (
                <p className="px-3 py-6 text-center text-sm text-slate-500">
                  הקלידו מילה או ביטוי לחיפוש בתוכן האתר
                </p>
              ) : results.length === 0 ? (
                <p className="px-3 py-6 text-center text-sm text-slate-500">
                  לא נמצאו תוצאות עבור «{query}»
                </p>
              ) : (
                <ul className="space-y-1">
                  {results.map((result) => (
                    <li key={result.id}>
                      <button
                        type="button"
                        onClick={() => handleSelect(result)}
                        className="flex w-full flex-col gap-0.5 rounded-xl px-3 py-2.5 text-right transition hover:bg-slate-50"
                      >
                        <span className="text-sm font-bold text-slate-800">{result.title}</span>
                        <span className="text-xs text-slate-500">{result.snippet}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
