"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import ALL_CATEGORIES from "../data/categories";

type CategoryAutocompleteProps = {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
};

const OTHER_CATEGORY_LABEL = "אחר / קטגוריה מותאמת";

function normalizeCategoryValue(value: unknown): string {
  if (value === undefined || value === null) return "";

  if (typeof value === "string") {
    const clean = value.trim();
    return clean === "Uncategorized" ? "" : clean;
  }

  if (typeof value === "object") {
    const item = value as {
      name?: unknown;
      title?: unknown;
      label?: unknown;
      value?: unknown;
      category?: unknown;
    };

    const clean = String(
      item.name || item.title || item.label || item.value || item.category || ""
    ).trim();

    return clean === "Uncategorized" ? "" : clean;
  }

  const clean = String(value).trim();
  return clean === "Uncategorized" ? "" : clean;
}

function uniqueCategories(categories: string[]) {
  const seen = new Set<string>();

  return categories.filter((category) => {
    const clean = normalizeCategoryValue(category);
    if (!clean) return false;

    const key = clean.toLowerCase();
    if (seen.has(key)) return false;

    seen.add(key);
    return true;
  });
}

function isOtherCategory(value: string) {
  return value.trim() === OTHER_CATEGORY_LABEL;
}

export default function CategoryAutocomplete({
  value = "",
  onChange,
  placeholder = "בחר או חפש קטגוריה",
  disabled = false,
  className = "",
}: CategoryAutocompleteProps) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const initialValue = normalizeCategoryValue(value);

  const [query, setQuery] = useState<string>(
    isOtherCategory(initialValue) ? "" : initialValue
  );

  const [customCategory, setCustomCategory] = useState<string>(
    isOtherCategory(initialValue) ? "" : ""
  );

  const [customMode, setCustomMode] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const categories = useMemo(() => {
    const cleaned = (ALL_CATEGORIES || [])
      .map((category) => normalizeCategoryValue(category))
      .filter(Boolean);

    return uniqueCategories([OTHER_CATEGORY_LABEL, ...cleaned]);
  }, []);

  useEffect(() => {
    const cleanValue = normalizeCategoryValue(value);

    if (!cleanValue) {
      setQuery("");
      setCustomCategory("");
      setCustomMode(false);
      return;
    }

    if (isOtherCategory(cleanValue)) {
      setQuery("");
      setCustomCategory("");
      setCustomMode(true);
      return;
    }

    const existsInCategories = categories.some(
      (category) => category.toLowerCase() === cleanValue.toLowerCase()
    );

    setQuery(cleanValue);
    setCustomCategory(existsInCategories ? "" : cleanValue);
    setCustomMode(!existsInCategories);
  }, [categories, value]);

  const suggestions = useMemo(() => {
    const cleanQuery = query.trim().toLowerCase();

    if (!cleanQuery) {
      return categories.slice(0, 18);
    }

    const filtered = categories.filter((category) =>
      category.toLowerCase().includes(cleanQuery)
    );

    const exactMatch = categories.some(
      (category) => category.toLowerCase() === cleanQuery
    );

    if (!exactMatch && query.trim()) {
      return [
        `השתמש בקטגוריה מותאמת: ${query.trim()}`,
        ...filtered,
      ].slice(0, 18);
    }

    return filtered.slice(0, 18);
  }, [categories, query]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!wrapperRef.current) return;

      if (!wrapperRef.current.contains(event.target as Node)) {
        setOpen(false);
        setActiveIndex(-1);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const commitValue = (nextValue: string) => {
    const cleanValue = normalizeCategoryValue(nextValue);

    if (!cleanValue) return;

    if (cleanValue.startsWith("השתמש בקטגוריה מותאמת:")) {
      const custom = cleanValue.replace("השתמש בקטגוריה מותאמת:", "").trim();

      setQuery(custom);
      setCustomCategory(custom);
      setCustomMode(true);
      onChange(custom);
      setOpen(false);
      setActiveIndex(-1);
      return;
    }

    if (isOtherCategory(cleanValue)) {
      setQuery("");
      setCustomCategory("");
      setCustomMode(true);
      onChange("");
      setOpen(false);
      setActiveIndex(-1);
      return;
    }

    setQuery(cleanValue);
    setCustomCategory("");
    setCustomMode(false);
    onChange(cleanValue);
    setOpen(false);
    setActiveIndex(-1);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextValue = normalizeCategoryValue(event.target.value);

    setQuery(nextValue);
    setCustomMode(false);
    onChange(nextValue);
    setOpen(true);
    setActiveIndex(-1);
  };

  const handleCustomChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextValue = normalizeCategoryValue(event.target.value);

    setCustomCategory(nextValue);
    setQuery(nextValue);
    onChange(nextValue);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open && (event.key === "ArrowDown" || event.key === "ArrowUp")) {
      setOpen(true);
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();

      setActiveIndex((prev) => {
        if (!suggestions.length) return -1;
        return prev >= suggestions.length - 1 ? 0 : prev + 1;
      });

      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();

      setActiveIndex((prev) => {
        if (!suggestions.length) return -1;
        return prev <= 0 ? suggestions.length - 1 : prev - 1;
      });

      return;
    }

    if (event.key === "Enter") {
      if (open && activeIndex >= 0 && suggestions[activeIndex]) {
        event.preventDefault();
        commitValue(suggestions[activeIndex]);
        return;
      }

      if (query.trim()) {
        event.preventDefault();
        commitValue(query.trim());
      }

      return;
    }

    if (event.key === "Escape") {
      setOpen(false);
      setActiveIndex(-1);
    }
  };

  return (
    <div ref={wrapperRef} className={`relative w-full ${className}`}>
      <div className="space-y-3">
        <input
          type="text"
          value={customMode ? OTHER_CATEGORY_LABEL : query}
          onChange={handleInputChange}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder={placeholder}
          autoComplete="off"
          className="h-12 w-full rounded-2xl border border-violet-100 bg-white/90 px-4 text-right text-sm font-bold text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-100 disabled:cursor-not-allowed disabled:opacity-60"
        />

        {customMode && (
          <div>
            <label className="mb-2 block text-xs font-black text-slate-500">
              כתוב את הקטגוריה שלך
            </label>

            <input
              type="text"
              value={customCategory}
              onChange={handleCustomChange}
              disabled={disabled}
              placeholder="לדוגמה: מומחית תוכן לעסקים קטנים"
              autoComplete="off"
              className="h-12 w-full rounded-2xl border border-emerald-100 bg-emerald-50/60 px-4 text-right text-sm font-bold text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:opacity-60"
            />

            <p className="mt-2 text-xs font-semibold leading-5 text-slate-400">
              הקטגוריה המותאמת תישמר ותופיע בפרופיל העסק.
            </p>
          </div>
        )}
      </div>

      {open && suggestions.length > 0 && !customMode && (
        <div className="absolute right-0 top-[calc(100%+8px)] z-[9999] w-full overflow-hidden rounded-2xl border border-violet-100 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.16)]">
          <ul className="max-h-80 overflow-y-auto py-2">
            {suggestions.map((category, index) => {
              const active = index === activeIndex;
              const selected = query.trim() === category;
              const customSuggestion = category.startsWith(
                "השתמש בקטגוריה מותאמת:"
              );

              return (
                <li key={`${category}-${index}`}>
                  <button
                    type="button"
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => commitValue(category)}
                    onMouseEnter={() => setActiveIndex(index)}
                    className={[
                      "flex w-full items-center justify-between gap-3 px-4 py-3 text-right text-sm font-bold transition",
                      active
                        ? "bg-violet-50 text-violet-700"
                        : "bg-white text-slate-700 hover:bg-violet-50 hover:text-violet-700",
                      customSuggestion ? "text-emerald-700" : "",
                    ].join(" ")}
                  >
                    <span>{category}</span>

                    {selected && (
                      <span className="text-xs font-black text-violet-600">
                        נבחר
                      </span>
                    )}

                    {customSuggestion && (
                      <span className="text-xs font-black text-emerald-600">
                        מותאם
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {open && query.trim() && suggestions.length === 0 && !customMode && (
        <div className="absolute right-0 top-[calc(100%+8px)] z-[9999] w-full rounded-2xl border border-violet-100 bg-white p-4 text-center shadow-[0_20px_60px_rgba(15,23,42,0.16)]">
          <p className="text-sm font-bold text-slate-500">
            לא נמצאו קטגוריות מתאימות
          </p>

          <button
            type="button"
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => commitValue(query)}
            className="mt-3 rounded-2xl bg-emerald-50 px-4 py-2 text-sm font-black text-emerald-700 transition hover:bg-emerald-100"
          >
            השתמש ב־“{query}”
          </button>
        </div>
      )}
    </div>
  );
}