import React from "react";
import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";

import type { BreadcrumbFormData, BreadcrumbItem } from "../schemaTypes";
import { newLocalId } from "../schemaBuilders";

type Props = {
  value: BreadcrumbFormData;
  onChange: (next: BreadcrumbFormData) => void;
};

export default function BreadcrumbSchemaForm({ value, onChange }: Props) {
  const items: BreadcrumbItem[] = Array.isArray(value.items) ? value.items : [];
  const setItems = (next: BreadcrumbItem[]) => onChange({ ...value, items: next });

  const update = (id: string, patch: Partial<BreadcrumbItem>) =>
    setItems(items.map((item) => (item.id === id ? { ...item, ...patch } : item)));

  const remove = (id: string) => setItems(items.filter((item) => item.id !== id));

  const move = (index: number, dir: -1 | 1) => {
    const target = index + dir;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    setItems(next);
  };

  const add = () =>
    setItems([...items, { id: newLocalId("bc"), name: "", url: "" }]);

  return (
    <div className="space-y-3">
      <p className="rounded-xl bg-blue-50 px-3 py-2 text-[11px] font-semibold text-blue-800">
        השלבים נוצרו אוטומטית לפי מבנה האתר. אפשר לשנות שם, כתובת וסדר.
      </p>

      {items.map((item, index) => (
        <div
          key={item.id}
          className="flex flex-wrap items-center gap-2 rounded-2xl border border-slate-200 bg-white p-2"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-100 text-xs font-black text-blue-700">
            {index + 1}
          </span>
          <input
            value={item.name}
            onChange={(event) => update(item.id, { name: event.target.value })}
            placeholder="שם התצוגה"
            className="h-10 w-[140px] rounded-xl border border-slate-200 bg-white px-3 text-right text-sm font-bold text-slate-900 outline-none focus:border-blue-400"
          />
          <input
            value={item.url}
            onChange={(event) => update(item.id, { url: event.target.value })}
            placeholder="https://..."
            dir="ltr"
            className="h-10 min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-900 outline-none focus:border-blue-400"
          />
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => move(index, -1)}
              disabled={index === 0}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 disabled:opacity-30 hover:bg-slate-50"
              aria-label="למעלה"
            >
              <ChevronUp className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => move(index, 1)}
              disabled={index === items.length - 1}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 disabled:opacity-30 hover:bg-slate-50"
              aria-label="למטה"
            >
              <ChevronDown className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => remove(item.id)}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-rose-500 hover:bg-rose-50"
              aria-label="מחיקה"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={add}
        className="flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-black text-slate-700 transition hover:bg-slate-50"
      >
        <Plus className="h-4 w-4" /> הוספת שלב
      </button>
    </div>
  );
}
