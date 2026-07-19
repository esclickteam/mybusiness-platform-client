import React from "react";

import type { ServiceFormData } from "../schemaTypes";
import { PRODUCT_AVAILABILITY } from "../schemaTypes";
import { FIELD_GRID, SelectField, TextAreaField, TextField } from "./fields";

type Props = {
  value: ServiceFormData;
  onChange: (next: ServiceFormData) => void;
};

export default function ServiceSchemaForm({ value, onChange }: Props) {
  const set = <K extends keyof ServiceFormData>(
    key: K,
    val: ServiceFormData[K],
  ) => onChange({ ...value, [key]: val });

  return (
    <div className="space-y-4">
      <div className={FIELD_GRID}>
        <TextField
          label="שם השירות"
          value={value.name || ""}
          onChange={(v) => set("name", v)}
        />
        <TextField
          label="קטגוריית השירות"
          value={value.serviceType || ""}
          onChange={(v) => set("serviceType", v)}
          placeholder="לדוגמה: התקנת מזגנים"
        />
      </div>

      <TextAreaField
        label="תיאור השירות"
        value={value.description || ""}
        onChange={(v) => set("description", v)}
      />

      <div className={FIELD_GRID}>
        <TextField
          label="כתובת עמוד השירות"
          value={value.url || ""}
          onChange={(v) => set("url", v)}
          dir="ltr"
        />
        <TextField
          label="תמונת השירות (URL)"
          value={value.image || ""}
          onChange={(v) => set("image", v)}
          dir="ltr"
        />
        <TextField
          label="ספק השירות"
          value={value.providerName || ""}
          onChange={(v) => set("providerName", v)}
        />
        <SelectField
          label="סוג הספק"
          value={value.providerType || "Organization"}
          onChange={(v) => set("providerType", v)}
          options={[
            { value: "Organization", label: "ארגון" },
            { value: "LocalBusiness", label: "עסק מקומי" },
            { value: "Person", label: "אדם" },
          ]}
        />
        <TextField
          label="אזור שירות"
          value={value.areaServed || ""}
          onChange={(v) => set("areaServed", v)}
        />
        <TextField
          label="קהל יעד"
          value={value.audienceType || ""}
          onChange={(v) => set("audienceType", v)}
        />
        <TextField
          label="מחיר החל מ-"
          value={value.priceFrom || ""}
          onChange={(v) => set("priceFrom", v)}
          dir="ltr"
          type="number"
        />
        <TextField
          label="מחיר עד"
          value={value.priceTo || ""}
          onChange={(v) => set("priceTo", v)}
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
          label="זמינות השירות"
          value={value.availability || "InStock"}
          onChange={(v) => set("availability", v)}
          options={PRODUCT_AVAILABILITY.map((a) => ({ value: a, label: a }))}
        />
        <TextField
          label="טלפון ליצירת קשר"
          value={value.telephone || ""}
          onChange={(v) => set("telephone", v)}
          dir="ltr"
        />
      </div>
    </div>
  );
}
