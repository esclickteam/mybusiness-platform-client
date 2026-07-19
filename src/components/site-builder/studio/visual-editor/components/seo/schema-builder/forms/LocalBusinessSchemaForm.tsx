import React from "react";
import { Plus, Trash2 } from "lucide-react";

import {
  LOCAL_BUSINESS_TYPES,
  WEEK_DAYS,
  type LocalBusinessFormData,
  type OpeningHoursRow,
} from "../schemaTypes";
import { newLocalId } from "../schemaBuilders";
import {
  FIELD_GRID,
  Field,
  SelectField,
  SwitchField,
  TagsField,
  TextAreaField,
  TextField,
} from "./fields";

type Props = {
  value: LocalBusinessFormData;
  onChange: (next: LocalBusinessFormData) => void;
};

export default function LocalBusinessSchemaForm({ value, onChange }: Props) {
  const set = <K extends keyof LocalBusinessFormData>(
    key: K,
    val: LocalBusinessFormData[K],
  ) => onChange({ ...value, [key]: val });

  const rows: OpeningHoursRow[] = Array.isArray(value.openingHours)
    ? value.openingHours
    : [];

  const addRow = () =>
    set("openingHours", [
      ...rows,
      {
        id: newLocalId("oh"),
        day: "Sunday",
        closed: false,
        opens: "09:00",
        closes: "17:00",
      },
    ]);

  const updateRow = (id: string, patch: Partial<OpeningHoursRow>) =>
    set(
      "openingHours",
      rows.map((row) => (row.id === id ? { ...row, ...patch } : row)),
    );

  const removeRow = (id: string) =>
    set(
      "openingHours",
      rows.filter((row) => row.id !== id),
    );

  return (
    <div className="space-y-4">
      <div className={FIELD_GRID}>
        <SelectField
          label="סוג העסק"
          value={value.businessType || "LocalBusiness"}
          onChange={(v) => set("businessType", v)}
          options={LOCAL_BUSINESS_TYPES.map((t) => ({ value: t, label: t }))}
        />
        <TextField
          label="שם העסק"
          value={value.name || ""}
          onChange={(v) => set("name", v)}
          placeholder="לדוגמה: חשמלאי מוסמך תל אביב"
        />
        <TextField
          label="שם חלופי"
          value={value.alternateName || ""}
          onChange={(v) => set("alternateName", v)}
        />
        <TextField
          label="טווח מחירים"
          value={value.priceRange || ""}
          onChange={(v) => set("priceRange", v)}
          placeholder="₪₪ או ₪100-₪500"
        />
      </div>

      <TextAreaField
        label="תיאור העסק"
        value={value.description || ""}
        onChange={(v) => set("description", v)}
      />

      <div className={FIELD_GRID}>
        <TextField
          label="טלפון"
          value={value.telephone || ""}
          onChange={(v) => set("telephone", v)}
          dir="ltr"
          placeholder="+972-3-1234567"
        />
        <TextField
          label="אימייל"
          value={value.email || ""}
          onChange={(v) => set("email", v)}
          dir="ltr"
        />
        <TextField
          label="כתובת אתר"
          value={value.url || ""}
          onChange={(v) => set("url", v)}
          dir="ltr"
        />
        <TextField
          label="לוגו (URL)"
          value={value.logo || ""}
          onChange={(v) => set("logo", v)}
          dir="ltr"
        />
        <TextField
          label="תמונת העסק (URL)"
          value={value.image || ""}
          onChange={(v) => set("image", v)}
          dir="ltr"
        />
        <TextField
          label="אזור שירות"
          value={value.areaServed || ""}
          onChange={(v) => set("areaServed", v)}
          placeholder="לדוגמה: גוש דן"
        />
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-3">
        <p className="mb-2 text-xs font-black text-slate-700">כתובת מלאה</p>
        <div className={FIELD_GRID}>
          <TextField
            label="רחוב ומספר"
            value={value.streetAddress || ""}
            onChange={(v) => set("streetAddress", v)}
          />
          <TextField
            label="עיר"
            value={value.addressLocality || ""}
            onChange={(v) => set("addressLocality", v)}
          />
          <TextField
            label="אזור / מחוז"
            value={value.addressRegion || ""}
            onChange={(v) => set("addressRegion", v)}
          />
          <TextField
            label="מיקוד"
            value={value.postalCode || ""}
            onChange={(v) => set("postalCode", v)}
          />
          <TextField
            label="מדינה"
            value={value.addressCountry || "IL"}
            onChange={(v) => set("addressCountry", v)}
            dir="ltr"
            hint="קוד מדינה, למשל IL"
          />
        </div>
        <div className={`${FIELD_GRID} mt-3`}>
          <TextField
            label="קו רוחב (latitude)"
            value={value.latitude || ""}
            onChange={(v) => set("latitude", v)}
            dir="ltr"
          />
          <TextField
            label="קו אורך (longitude)"
            value={value.longitude || ""}
            onChange={(v) => set("longitude", v)}
            dir="ltr"
          />
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-3">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-xs font-black text-slate-700">שעות פתיחה</p>
        </div>
        <SwitchField
          label="פתוח 24 שעות בכל הימים"
          checked={Boolean(value.openAllHours)}
          onChange={(v) => set("openAllHours", v)}
        />
        {!value.openAllHours ? (
          <div className="mt-3 space-y-2">
            {rows.map((row) => (
              <div
                key={row.id}
                className="flex flex-wrap items-center gap-2 rounded-xl border border-slate-100 bg-slate-50 p-2"
              >
                <select
                  value={row.day}
                  onChange={(event) =>
                    updateRow(row.id, { day: event.target.value })
                  }
                  className="h-9 rounded-lg border border-slate-200 bg-white px-2 text-xs font-bold text-slate-800"
                >
                  {WEEK_DAYS.map((day) => (
                    <option key={day.id} value={day.id}>
                      {day.label}
                    </option>
                  ))}
                </select>
                <input
                  type="time"
                  value={row.opens}
                  disabled={row.closed}
                  onChange={(event) =>
                    updateRow(row.id, { opens: event.target.value })
                  }
                  className="h-9 rounded-lg border border-slate-200 bg-white px-2 text-xs font-bold text-slate-800 disabled:opacity-40"
                  dir="ltr"
                />
                <span className="text-xs font-bold text-slate-400">עד</span>
                <input
                  type="time"
                  value={row.closes}
                  disabled={row.closed}
                  onChange={(event) =>
                    updateRow(row.id, { closes: event.target.value })
                  }
                  className="h-9 rounded-lg border border-slate-200 bg-white px-2 text-xs font-bold text-slate-800 disabled:opacity-40"
                  dir="ltr"
                />
                <label className="flex items-center gap-1 text-xs font-bold text-slate-600">
                  <input
                    type="checkbox"
                    checked={row.closed}
                    onChange={(event) =>
                      updateRow(row.id, { closed: event.target.checked })
                    }
                  />
                  סגור
                </label>
                <button
                  type="button"
                  onClick={() => removeRow(row.id)}
                  className="ms-auto flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-rose-500 hover:bg-rose-50"
                  aria-label="מחיקת שורה"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addRow}
              className="flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-xs font-black text-slate-700 transition hover:bg-slate-50"
            >
              <Plus className="h-4 w-4" /> הוספת יום/טווח
            </button>
          </div>
        ) : null}
      </div>

      <TagsField
        label="שירותים עיקריים"
        values={value.services || []}
        onChange={(v) => set("services", v)}
        placeholder="הקלידו שירות ולחצו +"
        dir="rtl"
      />

      <TagsField
        label="רשתות חברתיות (URL)"
        values={value.sameAs || []}
        onChange={(v) => set("sameAs", v)}
        placeholder="https://facebook.com/..."
      />
    </div>
  );
}
