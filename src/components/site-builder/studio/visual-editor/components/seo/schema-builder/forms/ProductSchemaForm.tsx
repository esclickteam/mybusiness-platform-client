import React from "react";

import type { ProductFormData } from "../schemaTypes";
import { PRODUCT_AVAILABILITY, PRODUCT_CONDITION } from "../schemaTypes";
import {
  FIELD_GRID,
  SelectField,
  TagsField,
  TextAreaField,
  TextField,
} from "./fields";

type Props = {
  value: ProductFormData;
  onChange: (next: ProductFormData) => void;
};

export default function ProductSchemaForm({ value, onChange }: Props) {
  const set = <K extends keyof ProductFormData>(
    key: K,
    val: ProductFormData[K],
  ) => onChange({ ...value, [key]: val });

  return (
    <div className="space-y-4">
      <div className={FIELD_GRID}>
        <TextField
          label="שם המוצר"
          value={value.name || ""}
          onChange={(v) => set("name", v)}
        />
        <TextField
          label="מותג"
          value={value.brand || ""}
          onChange={(v) => set("brand", v)}
        />
      </div>

      <TextAreaField
        label="תיאור"
        value={value.description || ""}
        onChange={(v) => set("description", v)}
      />

      <TagsField
        label="תמונות (URL)"
        values={value.images || []}
        onChange={(v) => set("images", v)}
        placeholder="https://..."
      />

      <div className={FIELD_GRID}>
        <TextField
          label="כתובת עמוד המוצר"
          value={value.url || ""}
          onChange={(v) => set("url", v)}
          dir="ltr"
        />
        <TextField label="SKU" value={value.sku || ""} onChange={(v) => set("sku", v)} dir="ltr" />
        <TextField label="GTIN" value={value.gtin || ""} onChange={(v) => set("gtin", v)} dir="ltr" />
        <TextField label="MPN" value={value.mpn || ""} onChange={(v) => set("mpn", v)} dir="ltr" />
        <TextField
          label="מחיר"
          value={value.price || ""}
          onChange={(v) => set("price", v)}
          dir="ltr"
          type="number"
        />
        <TextField
          label="מחיר מבצע"
          value={value.salePrice || ""}
          onChange={(v) => set("salePrice", v)}
          dir="ltr"
          type="number"
        />
        <TextField
          label="מטבע"
          value={value.currency || "ILS"}
          onChange={(v) => set("currency", v)}
          dir="ltr"
        />
        <SelectField
          label="זמינות"
          value={value.availability || "InStock"}
          onChange={(v) => set("availability", v)}
          options={PRODUCT_AVAILABILITY.map((a) => ({ value: a, label: a }))}
        />
        <SelectField
          label="מצב המוצר"
          value={value.condition || "NewCondition"}
          onChange={(v) => set("condition", v)}
          options={PRODUCT_CONDITION.map((c) => ({ value: c, label: c }))}
        />
        <TextField
          label="שם המוכר"
          value={value.sellerName || ""}
          onChange={(v) => set("sellerName", v)}
        />
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-3">
        <p className="mb-2 text-xs font-black text-slate-700">
          דירוג (רק אם קיימות ביקורות אמיתיות)
        </p>
        <div className={FIELD_GRID}>
          <TextField
            label="דירוג ממוצע"
            value={value.ratingValue || ""}
            onChange={(v) => set("ratingValue", v)}
            dir="ltr"
            type="number"
            hint="1 עד 5"
          />
          <TextField
            label="מספר ביקורות"
            value={value.reviewCount || ""}
            onChange={(v) => set("reviewCount", v)}
            dir="ltr"
            type="number"
          />
        </div>
      </div>
    </div>
  );
}
