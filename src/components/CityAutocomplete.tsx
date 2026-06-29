import React, { useEffect, useRef, useState } from "react";
import axios from "axios";

type CityItem = {
  id: number | string;
  city: string;
  region?: string;
  country?: string;
};

type CityAutocompleteProps = {
  value: string;
  onChange: React.Dispatch<React.SetStateAction<string>> | ((value: string) => void);
  placeholder?: string;
  disabled?: boolean;
};

const RAPID_API_KEY = import.meta.env.VITE_RAPIDAPI_KEY as string | undefined;

export default function CityAutocomplete({
  value,
  onChange,
  placeholder = "",
  disabled = false,
}: CityAutocompleteProps) {
  const [query, setQuery] = useState<string>(value || "");
  const [suggestions, setSuggestions] = useState<CityItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);

  const wrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setQuery(value || "");
  }, [value]);

  useEffect(() => {
    if (disabled) return;

    if (query.trim().length < 2) {
      setSuggestions([]);
      setLoading(false);
      return;
    }

    const timeout = window.setTimeout(async () => {
      try {
        setLoading(true);

        const res = await axios.get(
          "https://wft-geo-db.p.rapidapi.com/v1/geo/cities",
          {
            params: {
              namePrefix: query.trim(),
              countryIds: "US",
              limit: 8,
            },
            headers: {
              "X-RapidAPI-Key": RAPID_API_KEY || "",
              "X-RapidAPI-Host": "wft-geo-db.p.rapidapi.com",
            },
          }
        );

        setSuggestions(Array.isArray(res.data?.data) ? res.data.data : []);
      } catch (err) {
        console.error("❌ שגיאה בטעינת ערים:", err);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [query, disabled]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleInputChange = (nextValue: string) => {
    setQuery(nextValue);
    onChange(nextValue);
    setOpen(true);
  };

  const handleSelectCity = (city: CityItem) => {
    const selectedCity = city.city;

    setQuery(selectedCity);
    onChange(selectedCity);
    setSuggestions([]);
    setOpen(false);
  };

  return (
    <div ref={wrapperRef} dir="rtl" className="relative w-full">
      <input
        type="text"
        value={query}
        placeholder={placeholder}
        disabled={disabled}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          handleInputChange(e.target.value)
        }
        onFocus={() => {
          if (!disabled) setOpen(true);
        }}
        className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-right text-sm font-semibold text-slate-900 outline-none transition placeholder:text-transparent focus:border-violet-400 focus:ring-4 focus:ring-violet-100 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
      />

      {open && suggestions.length > 0 && !disabled && (
        <ul className="absolute left-0 right-0 top-full z-50 mt-2 max-h-64 overflow-y-auto rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_18px_50px_rgba(15,23,42,0.14)]">
          {suggestions.map((city) => (
            <li key={city.id}>
              <button
                type="button"
                onClick={() => handleSelectCity(city)}
                className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-right text-sm font-bold text-slate-700 transition hover:bg-violet-50 hover:text-violet-700"
              >
                <span>{city.city}</span>

                {city.region && (
                  <span className="text-xs font-semibold text-slate-400">
                    {city.region}
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}

      {loading && !disabled && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-200 border-t-violet-600" />
        </div>
      )}
    </div>
  );
}