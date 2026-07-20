import React from "react";
import { Plus } from "lucide-react";

import { SCHEMA_TYPE_DEFS, type SchemaTypeDef } from "./schemaTypes";

export default function SchemaTypePicker({
  onPick,
}: {
  onPick: (def: SchemaTypeDef) => void;
}) {
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {SCHEMA_TYPE_DEFS.map((def) => (
        <button
          key={def.id}
          type="button"
          onClick={() => onPick(def)}
          className="flex items-start gap-3 rounded-2xl border border-slate-200/80 bg-gradient-to-l from-white to-slate-50/80 px-3 py-2.5 text-right transition hover:border-blue-300 hover:bg-blue-50/40 hover:shadow-sm"
        >
          <Plus className="mt-0.5 h-4 w-4 shrink-0 text-blue-500" />
          <span className="min-w-0">
            <span className="flex items-center gap-1.5">
              <span className="text-sm font-black text-slate-900">
                {def.label}
              </span>
              {def.siteLevel ? (
                <span className="rounded-full bg-slate-100 px-1.5 py-0.5 text-[10px] font-black text-slate-500">
                  רמת אתר
                </span>
              ) : null}
            </span>
            <span className="mt-0.5 block text-[11px] font-semibold leading-4 text-slate-500">
              {def.description}
            </span>
          </span>
        </button>
      ))}
    </div>
  );
}
