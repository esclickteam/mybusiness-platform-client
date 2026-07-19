import React, { useState } from "react";
import { Plus, X } from "lucide-react";

const inputClass =
  "h-11 w-full max-w-full rounded-xl border border-slate-200 bg-white px-3 text-right text-sm font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100";

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="block text-xs font-black text-slate-700">{label}</span>
      {children}
      {hint ? (
        <span className="block text-[11px] font-semibold text-slate-400">
          {hint}
        </span>
      ) : null}
    </label>
  );
}

export function TextField({
  label,
  value,
  onChange,
  placeholder,
  hint,
  dir,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  hint?: string;
  dir?: "ltr" | "rtl";
  type?: string;
}) {
  return (
    <Field label={label} hint={hint}>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        dir={dir}
        className={inputClass}
      />
    </Field>
  );
}

export function TextAreaField({
  label,
  value,
  onChange,
  placeholder,
  hint,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  hint?: string;
}) {
  return (
    <Field label={label} hint={hint}>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="min-h-[84px] w-full max-w-full resize-y rounded-xl border border-slate-200 bg-white px-3 py-2 text-right text-sm font-semibold leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
      />
    </Field>
  );
}

export function SelectField({
  label,
  value,
  onChange,
  options,
  hint,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
  hint?: string;
}) {
  return (
    <Field label={label} hint={hint}>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={inputClass}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </Field>
  );
}

export function SwitchField({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2.5">
      <span className="text-sm font-black text-slate-800">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={[
          "relative h-6 w-11 shrink-0 rounded-full transition",
          checked ? "bg-blue-600" : "bg-slate-300",
        ].join(" ")}
      >
        <span
          className={[
            "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition",
            checked ? "right-0.5" : "right-[22px]",
          ].join(" ")}
        />
      </button>
    </div>
  );
}

/** A list of free-text values shown as removable chips (e.g. sameAs, images). */
export function TagsField({
  label,
  values,
  onChange,
  placeholder,
  hint,
  dir = "ltr",
}: {
  label: string;
  values: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  hint?: string;
  dir?: "ltr" | "rtl";
}) {
  const [draft, setDraft] = useState("");
  const list = Array.isArray(values) ? values : [];

  const add = () => {
    const clean = draft.trim();
    if (!clean) return;
    onChange([...list, clean]);
    setDraft("");
  };

  return (
    <Field label={label} hint={hint}>
      <div className="flex items-center gap-2">
        <input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              add();
            }
          }}
          placeholder={placeholder}
          dir={dir}
          className={inputClass}
        />
        <button
          type="button"
          onClick={add}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-blue-600 transition hover:bg-blue-50"
          aria-label="הוספה"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
      {list.length ? (
        <div className="mt-2 flex flex-wrap gap-2">
          {list.map((item, index) => (
            <span
              key={`${item}-${index}`}
              className="flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-700"
              dir={dir}
            >
              <span className="max-w-[180px] truncate">{item}</span>
              <button
                type="button"
                onClick={() => onChange(list.filter((_, i) => i !== index))}
                className="text-slate-400 hover:text-rose-500"
                aria-label="הסרה"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </span>
          ))}
        </div>
      ) : null}
    </Field>
  );
}

export const FIELD_GRID = "grid gap-3 sm:grid-cols-2";
