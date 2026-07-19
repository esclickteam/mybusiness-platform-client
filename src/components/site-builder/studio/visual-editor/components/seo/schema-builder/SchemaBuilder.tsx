import React, { useState } from "react";

import type { SeoStructuredDataEntry } from "../../../../types";
import { createSeoId } from "../../../../utils/pageSeoUtils";
import {
  getSchemaTypeDef,
  type SchemaBuilderContext,
  type SchemaTypeDef,
} from "./schemaTypes";
import { buildSchemaJson, defaultFormData } from "./schemaBuilders";
import SchemaTypePicker from "./SchemaTypePicker";
import SchemaEditorCard from "./SchemaEditorCard";

type Props = {
  entries: SeoStructuredDataEntry[];
  context: SchemaBuilderContext;
  onChange: (entries: SeoStructuredDataEntry[]) => void;
};

const MAX_SCHEMAS = 20;

export default function SchemaBuilder({ entries, context, onChange }: Props) {
  const list = Array.isArray(entries) ? entries : [];
  const [lastAddedId, setLastAddedId] = useState<string>("");

  const commitEntry = (updated: SeoStructuredDataEntry) => {
    onChange(list.map((item) => (item.id === updated.id ? updated : item)));
  };

  const removeEntry = (id: string) => {
    const target = list.find((item) => item.id === id);
    const ok = window.confirm(
      `למחוק את ה‑Schema "${target?.name || ""}"?`,
    );
    if (!ok) return;
    onChange(list.filter((item) => item.id !== id));
  };

  const duplicateEntry = (id: string) => {
    const index = list.findIndex((item) => item.id === id);
    if (index < 0) return;
    const source = list[index];
    const copy: SeoStructuredDataEntry = {
      ...source,
      id: createSeoId("ld"),
      name: `${source.name || ""} (עותק)`.trim(),
    };
    const next = [...list];
    next.splice(index + 1, 0, copy);
    onChange(next);
    setLastAddedId(copy.id);
  };

  const addSchema = (def: SchemaTypeDef) => {
    if (list.length >= MAX_SCHEMAS) {
      window.alert("הגעת למספר המרבי של סכימות לעמוד.");
      return;
    }

    if (def.singletonPerPage) {
      const existing = list.some((item) => item.schemaType === def.id);
      if (existing) {
        const ok = window.confirm(
          `כבר קיים Schema מסוג "${def.label}" בעמוד. מומלץ אחד בלבד. להוסיף בכל זאת?`,
        );
        if (!ok) return;
      }
    }

    const formData = defaultFormData(def.id, context);
    const json = buildSchemaJson(def.id, formData);
    const entry: SeoStructuredDataEntry = {
      id: createSeoId("ld"),
      name: def.label,
      schemaType: def.id,
      mode: "form",
      json,
      formData,
      manuallyEdited: false,
      lastGeneratedAt: new Date().toISOString(),
    };
    onChange([...list, entry]);
    setLastAddedId(entry.id);
  };

  return (
    <div className="space-y-4">
      <div>
        <p className="mb-2 text-xs font-black text-slate-700">
          בחרו סוג Schema להוספה
        </p>
        <SchemaTypePicker onPick={addSchema} />
      </div>

      {list.length ? (
        <div className="space-y-2">
          <p className="text-xs font-black text-slate-700">
            הסכימות בעמוד ({list.length})
          </p>
          {list.map((entry) => {
            const isKnown = Boolean(
              entry.schemaType && getSchemaTypeDef(entry.schemaType),
            );
            return (
              <SchemaEditorCard
                key={entry.id}
                entry={entry}
                context={context}
                defaultOpen={entry.id === lastAddedId || !isKnown}
                onCommit={commitEntry}
                onDuplicate={() => duplicateEntry(entry.id)}
                onDelete={() => removeEntry(entry.id)}
              />
            );
          })}
        </div>
      ) : (
        <p className="rounded-2xl border border-dashed border-slate-200 bg-white px-4 py-4 text-center text-xs font-semibold text-slate-400">
          אין עדיין סכימות. בחרו סוג למעלה — נבנה עבורכם טופס וקוד JSON-LD מוכן.
        </p>
      )}
    </div>
  );
}
