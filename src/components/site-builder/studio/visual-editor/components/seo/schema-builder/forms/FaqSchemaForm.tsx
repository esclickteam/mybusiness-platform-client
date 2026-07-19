import React from "react";
import { ChevronDown, ChevronUp, Copy, Plus, Trash2 } from "lucide-react";

import type { FaqFormData, FaqItem } from "../schemaTypes";
import { newLocalId } from "../schemaBuilders";

type Props = {
  value: FaqFormData;
  onChange: (next: FaqFormData) => void;
};

export default function FaqSchemaForm({ value, onChange }: Props) {
  const items: FaqItem[] = Array.isArray(value.items) ? value.items : [];

  const setItems = (next: FaqItem[]) => onChange({ ...value, items: next });

  const update = (id: string, patch: Partial<FaqItem>) =>
    setItems(items.map((item) => (item.id === id ? { ...item, ...patch } : item)));

  const remove = (id: string) =>
    setItems(items.filter((item) => item.id !== id));

  const duplicate = (id: string) => {
    const index = items.findIndex((item) => item.id === id);
    if (index < 0) return;
    const copy = { ...items[index], id: newLocalId("faq") };
    const next = [...items];
    next.splice(index + 1, 0, copy);
    setItems(next);
  };

  const move = (index: number, dir: -1 | 1) => {
    const target = index + dir;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    setItems(next);
  };

  const add = () =>
    setItems([...items, { id: newLocalId("faq"), question: "", answer: "" }]);

  return (
    <div className="space-y-3">
      {items.map((item, index) => {
        const dup = items.some(
          (other) =>
            other.id !== item.id &&
            other.question.trim() &&
            other.question.trim() === item.question.trim(),
        );
        return (
          <div
            key={item.id}
            className="space-y-2 rounded-2xl border border-slate-200 bg-white p-3"
          >
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs font-black text-blue-700">
                {index + 1}
              </span>
              <span className="text-xs font-black text-slate-500">שאלה</span>
              <div className="ms-auto flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => move(index, -1)}
                  disabled={index === 0}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 disabled:opacity-30 hover:bg-slate-50"
                  aria-label="הזזה למעלה"
                >
                  <ChevronUp className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => move(index, 1)}
                  disabled={index === items.length - 1}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 disabled:opacity-30 hover:bg-slate-50"
                  aria-label="הזזה למטה"
                >
                  <ChevronDown className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => duplicate(item.id)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
                  aria-label="שכפול"
                >
                  <Copy className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => remove(item.id)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-rose-500 hover:bg-rose-50"
                  aria-label="מחיקה"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            <input
              value={item.question}
              onChange={(event) => update(item.id, { question: event.target.value })}
              placeholder="השאלה"
              className="h-11 w-full max-w-full rounded-xl border border-slate-200 bg-white px-3 text-right text-sm font-bold text-slate-900 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            />
            <textarea
              value={item.answer}
              onChange={(event) => update(item.id, { answer: event.target.value })}
              placeholder="התשובה"
              className="min-h-[72px] w-full max-w-full resize-y rounded-xl border border-slate-200 bg-white px-3 py-2 text-right text-sm font-semibold leading-6 text-slate-900 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            />
            {dup ? (
              <p className="text-[11px] font-bold text-amber-600">
                שאלה כפולה — שנו או מחקו.
              </p>
            ) : null}
          </div>
        );
      })}

      {items.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-slate-200 bg-white px-4 py-4 text-center text-xs font-semibold text-amber-600">
          הוסיפו לפחות שאלה אחת.
        </p>
      ) : null}

      <button
        type="button"
        onClick={add}
        className="flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-black text-slate-700 transition hover:bg-slate-50"
      >
        <Plus className="h-4 w-4" /> הוספת שאלה
      </button>
    </div>
  );
}
