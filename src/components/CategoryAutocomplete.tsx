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

function normalizeCategoryValue(value: unknown): string {
  if (value === undefined || value === null) return "";

  if (typeof value === "string") {
    return value.trim();
  }

  if (typeof value === "object") {
    const item = value as {
      name?: unknown;
      title?: unknown;
      label?: unknown;
      value?: unknown;
      category?: unknown;
    };

    return String(
      item.name || item.title || item.label || item.value || item.category || ""
    ).trim();
  }

  return String(value).trim();
}

export default function CategoryAutocomplete({
  value = "",
  onChange,
  placeholder = "בחר או חפש קטגוריה",
  disabled = false,
  className = "",
}: CategoryAutocompleteProps) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const [query, setQuery] = useState<string>(normalizeCategoryValue(value));
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  useEffect(() => {
    setQuery(normalizeCategoryValue(value));
  }, [value]);

  const categories = useMemo(() => {
    return (ALL_CATEGORIES || [])
      .map((category) => normalizeCategoryValue(category))
      .filter(Boolean);
  }, []);

  const suggestions = useMemo(() => {
    const cleanQuery = query.trim().toLowerCase();

    if (!cleanQuery) return [];

    return categories
      .filter((category) => category.toLowerCase().includes(cleanQuery))
      .slice(0, 10);
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

    setQuery(cleanValue);
    onChange(cleanValue);
    setOpen(false);
    setActiveIndex(-1);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextValue = normalizeCategoryValue(event.target.value);

    setQuery(nextValue);
    onChange(nextValue);
    setOpen(true);
    setActiveIndex(-1);
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
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        onFocus={() => setOpen(true)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        placeholder={placeholder}
        autoComplete="off"
        className="h-12 w-full rounded-2xl border border-violet-100 bg-white/90 px-4 text-right text-sm font-bold text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-100 disabled:cursor-not-allowed disabled:opacity-60"
      />

      {open && suggestions.length > 0 && (
        <div className="absolute right-0 top-[calc(100%+8px)] z-[9999] w-full overflow-hidden rounded-2xl border border-violet-100 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.16)]">
          <ul className="max-h-64 overflow-y-auto py-2">
            {suggestions.map((category, index) => {
              const active = index === activeIndex;

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
                    ].join(" ")}
                  >
                    <span>{category}</span>

                    {query.trim() === category && (
                      <span className="text-xs font-black text-violet-600">
                        נבחר
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {open && query.trim() && suggestions.length === 0 && (
        <div className="absolute right-0 top-[calc(100%+8px)] z-[9999] w-full rounded-2xl border border-violet-100 bg-white p-4 text-center text-sm font-bold text-slate-500 shadow-[0_20px_60px_rgba(15,23,42,0.16)]">
          לא נמצאו קטגוריות מתאימות
        </div>
      )}
    </div>
  );
}