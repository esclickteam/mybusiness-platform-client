import React from "react";
import { useTranslation } from "react-i18next";
import { getTextDirection } from "../../../../../../../../i18n/localeUtils";

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
  const { t, i18n } = useTranslation();
  const pageDir = getTextDirection(i18n.language);
  const set = <K extends keyof ProductFormData>(
    key: K,
    val: ProductFormData[K],
  ) => onChange({ ...value, [key]: val });

  return (
    <div className="space-y-4" dir={pageDir}>
      <div className={FIELD_GRID}>
        <TextField
          label={t("studio.seo.productName")}
          value={value.name || ""}
          onChange={(v) => set("name", v)}
        />
        <TextField
          label={t("studio.seo.brand")}
          value={value.brand || ""}
          onChange={(v) => set("brand", v)}
        />
      </div>

      <TextAreaField
        label={t("studio.seo.description")}
        value={value.description || ""}
        onChange={(v) => set("description", v)}
      />

      <TagsField
        label={t("studio.seo.images")}
        values={value.images || []}
        onChange={(v) => set("images", v)}
        placeholder="https://..."
      />

      <div className={FIELD_GRID}>
        <TextField
          label={t("studio.seo.productPageUrl")}
          value={value.url || ""}
          onChange={(v) => set("url", v)}
          dir="ltr"
        />
        <TextField label="SKU" value={value.sku || ""} onChange={(v) => set("sku", v)} dir="ltr" />
        <TextField label="GTIN" value={value.gtin || ""} onChange={(v) => set("gtin", v)} dir="ltr" />
        <TextField label="MPN" value={value.mpn || ""} onChange={(v) => set("mpn", v)} dir="ltr" />
        <TextField
          label={t("studio.seo.price")}
          value={value.price || ""}
          onChange={(v) => set("price", v)}
          dir="ltr"
          type="number"
        />
        <TextField
          label={t("studio.seo.salePrice")}
          value={value.salePrice || ""}
          onChange={(v) => set("salePrice", v)}
          dir="ltr"
          type="number"
        />
        <TextField
          label={t("studio.seo.currency")}
          value={value.currency || "ILS"}
          onChange={(v) => set("currency", v)}
          dir="ltr"
        />
        <SelectField
          label={t("studio.seo.availability")}
          value={value.availability || "InStock"}
          onChange={(v) => set("availability", v)}
          options={PRODUCT_AVAILABILITY.map((a) => ({ value: a, label: a }))}
        />
        <SelectField
          label={t("studio.seo.condition")}
          value={value.condition || "NewCondition"}
          onChange={(v) => set("condition", v)}
          options={PRODUCT_CONDITION.map((c) => ({ value: c, label: c }))}
        />
        <TextField
          label={t("studio.seo.sellerName")}
          value={value.sellerName || ""}
          onChange={(v) => set("sellerName", v)}
        />
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-3">
        <p className="mb-2 text-xs font-black text-slate-700">
          {t("studio.seo.ratingTitle")}
        </p>
        <div className={FIELD_GRID}>
          <TextField
            label={t("studio.seo.averageRating")}
            value={value.ratingValue || ""}
            onChange={(v) => set("ratingValue", v)}
            dir="ltr"
            type="number"
            hint={t("studio.seo.ratingHint")}
          />
          <TextField
            label={t("studio.seo.reviewCount")}
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
