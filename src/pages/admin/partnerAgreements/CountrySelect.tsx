import React, { useMemo, useState } from "react";
import type { CountryOption } from "../../../lib/partnerAgreementApi";
import { exclusiveSelectionBlocked } from "../../../lib/partnerAgreementRules";
import { usePartnerAgreementPage } from "./usePartnerAgreementPage";

type Props = {
  id?: string;
  countries: CountryOption[];
  value: string;
  onChange: (code: string) => void;
  territoryType?: string;
  blockExclusive?: boolean;
  placeholder?: string;
  disabled?: boolean;
  initialOpen?: boolean;
  initialQuery?: string;
};

export default function CountrySelect({
  id = "country-select",
  countries,
  value,
  onChange,
  territoryType = "",
  blockExclusive = false,
  placeholder,
  disabled = false,
  initialOpen = false,
  initialQuery = "",
}: Props) {
  const { text, dir } = usePartnerAgreementPage();
  const searchLabel = placeholder || text.country.search;
  const [open, setOpen] = useState(initialOpen);
  const [query, setQuery] = useState(initialQuery);
  const selected = countries.find((row) => row.countryCode === value);
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const rows = q
      ? countries.filter(
          (row) =>
            row.countryName.toLowerCase().includes(q) || row.countryCode.toLowerCase().includes(q)
        )
      : countries;
    return rows.slice(0, 40);
  }, [countries, query]);

  return (
    <div className="relative" data-testid={id} dir={dir}>
      <input
        aria-label={searchLabel}
        value={open ? query : selected ? `${selected.countryName} (${selected.countryCode})` : query}
        placeholder={searchLabel}
        disabled={disabled}
        onFocus={() => {
          if (disabled) return;
          setOpen(true);
          setQuery("");
        }}
        onChange={(event) => {
          setQuery(event.target.value);
          setOpen(true);
        }}
        className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-semibold outline-none focus:border-violet-400"
      />
      {open ? (
        <div className="absolute z-20 mt-1 max-h-72 w-full overflow-auto rounded-2xl border border-slate-200 bg-white shadow-xl">
          {filtered.length === 0 ? (
            <p className="px-3 py-3 text-sm font-bold text-slate-500">{text.country.empty}</p>
          ) : (
            filtered.map((row) => {
              const blocked = blockExclusive && exclusiveSelectionBlocked(territoryType, row);
              return (
                <button
                  key={row.countryCode}
                  type="button"
                  data-testid={`country-option-${row.countryCode}`}
                  disabled={blocked}
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => {
                    if (blocked) return;
                    onChange(row.countryCode);
                    setOpen(false);
                    setQuery("");
                  }}
                  className="block w-full px-3 py-2 text-start hover:bg-violet-50 disabled:cursor-not-allowed disabled:bg-slate-50"
                >
                  <span className="block text-sm font-black text-slate-900">
                    {row.countryName}
                    <span className="ms-2 font-bold text-slate-400">{row.countryCode}</span>
                  </span>
                  {blocked ? (
                    <span className="mt-0.5 block text-xs font-bold text-rose-700">
                      {text.country.exclusiveUnavailable}
                      {row.partnerName ? ` · ${row.partnerName}` : ""}
                      {row.startDate || row.endDate ? ` · ${row.startDate || "—"} ${text.country.to} ${row.endDate || "—"}` : ""}
                    </span>
                  ) : null}
                </button>
              );
            })
          )}
        </div>
      ) : null}
    </div>
  );
}
