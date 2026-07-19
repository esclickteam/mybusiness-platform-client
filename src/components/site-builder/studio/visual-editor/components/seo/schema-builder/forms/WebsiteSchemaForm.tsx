import React from "react";

import type { WebsiteFormData } from "../schemaTypes";
import { FIELD_GRID, SwitchField, TextField } from "./fields";

type Props = {
  value: WebsiteFormData;
  onChange: (next: WebsiteFormData) => void;
};

export default function WebsiteSchemaForm({ value, onChange }: Props) {
  const set = <K extends keyof WebsiteFormData>(
    key: K,
    val: WebsiteFormData[K],
  ) => onChange({ ...value, [key]: val });

  return (
    <div className="space-y-4">
      <p className="rounded-xl bg-blue-50 px-3 py-2 text-[11px] font-semibold text-blue-800">
        מומלץ להגדיר WebSite פעם אחת (בדף הבית). האתר כרגע חד‑לשוני (he‑IL).
      </p>

      <div className={FIELD_GRID}>
        <TextField label="שם האתר" value={value.name || ""} onChange={(v) => set("name", v)} />
        <TextField
          label="שם חלופי"
          value={value.alternateName || ""}
          onChange={(v) => set("alternateName", v)}
        />
        <TextField label="כתובת האתר" value={value.url || ""} onChange={(v) => set("url", v)} dir="ltr" />
        <TextField
          label="שפת האתר"
          value={value.inLanguage || "he-IL"}
          onChange={(v) => set("inLanguage", v)}
          dir="ltr"
        />
        <TextField
          label="בעל האתר"
          value={value.publisher || ""}
          onChange={(v) => set("publisher", v)}
        />
      </div>

      <SwitchField
        label="לאפשר תיבת חיפוש באתר בתוצאות גוגל"
        checked={Boolean(value.enableSearch)}
        onChange={(v) => set("enableSearch", v)}
      />

      {value.enableSearch ? (
        <TextField
          label="תבנית כתובת חיפוש"
          value={value.searchUrlTemplate || ""}
          onChange={(v) => set("searchUrlTemplate", v)}
          dir="ltr"
          hint="חייב להכיל {search_term_string}"
        />
      ) : null}
    </div>
  );
}
