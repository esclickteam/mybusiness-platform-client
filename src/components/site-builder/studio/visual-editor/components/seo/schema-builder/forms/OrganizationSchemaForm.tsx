import React from "react";

import type { OrganizationFormData } from "../schemaTypes";
import { FIELD_GRID, TagsField, TextAreaField, TextField } from "./fields";

type Props = {
  value: OrganizationFormData;
  onChange: (next: OrganizationFormData) => void;
};

export default function OrganizationSchemaForm({ value, onChange }: Props) {
  const set = <K extends keyof OrganizationFormData>(
    key: K,
    val: OrganizationFormData[K],
  ) => onChange({ ...value, [key]: val });

  return (
    <div className="space-y-4">
      <p className="rounded-xl bg-blue-50 px-3 py-2 text-[11px] font-semibold text-blue-800">
        מומלץ להגדיר Organization פעם אחת (בדף הבית) — הוא מייצג את זהות העסק כולו.
      </p>

      <div className={FIELD_GRID}>
        <TextField label="שם הארגון" value={value.name || ""} onChange={(v) => set("name", v)} />
        <TextField
          label="שם חלופי"
          value={value.alternateName || ""}
          onChange={(v) => set("alternateName", v)}
        />
      </div>

      <TextAreaField
        label="תיאור"
        value={value.description || ""}
        onChange={(v) => set("description", v)}
      />

      <div className={FIELD_GRID}>
        <TextField label="כתובת אתר" value={value.url || ""} onChange={(v) => set("url", v)} dir="ltr" />
        <TextField label="לוגו (URL)" value={value.logo || ""} onChange={(v) => set("logo", v)} dir="ltr" />
        <TextField label="תמונה (URL)" value={value.image || ""} onChange={(v) => set("image", v)} dir="ltr" />
        <TextField label="אימייל" value={value.email || ""} onChange={(v) => set("email", v)} dir="ltr" />
        <TextField label="טלפון" value={value.telephone || ""} onChange={(v) => set("telephone", v)} dir="ltr" />
        <TextField
          label="שנת הקמה"
          value={value.foundingDate || ""}
          onChange={(v) => set("foundingDate", v)}
          dir="ltr"
          placeholder="2019"
        />
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-3">
        <p className="mb-2 text-xs font-black text-slate-700">כתובת</p>
        <div className={FIELD_GRID}>
          <TextField label="רחוב ומספר" value={value.streetAddress || ""} onChange={(v) => set("streetAddress", v)} />
          <TextField label="עיר" value={value.addressLocality || ""} onChange={(v) => set("addressLocality", v)} />
          <TextField label="אזור / מחוז" value={value.addressRegion || ""} onChange={(v) => set("addressRegion", v)} />
          <TextField label="מיקוד" value={value.postalCode || ""} onChange={(v) => set("postalCode", v)} />
          <TextField label="מדינה" value={value.addressCountry || "IL"} onChange={(v) => set("addressCountry", v)} dir="ltr" />
        </div>
      </div>

      <TagsField
        label="רשתות חברתיות (URL)"
        values={value.sameAs || []}
        onChange={(v) => set("sameAs", v)}
        placeholder="https://facebook.com/..."
      />
    </div>
  );
}
