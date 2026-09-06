import React from "react";
import { useTranslation } from "react-i18next";

import type { WebsiteFormData } from "../schemaTypes";
import { FIELD_GRID, SwitchField, TextField } from "./fields";

type Props = {
  value: WebsiteFormData;
  onChange: (next: WebsiteFormData) => void;
};

export default function WebsiteSchemaForm({ value, onChange }: Props) {
  const { t } = useTranslation();
  const set = <K extends keyof WebsiteFormData>(
    key: K,
    val: WebsiteFormData[K],
  ) => onChange({ ...value, [key]: val });

  return (
    <div className="space-y-4">
      <p className="rounded-xl bg-blue-50 px-3 py-2 text-[11px] font-semibold text-blue-800">
        {t("studio.schema.websiteHint")}
      </p>

      <div className={FIELD_GRID}>
        <TextField label={t("studio.schema.siteName")} value={value.name || ""} onChange={(v) => set("name", v)} />
        <TextField
          label={t("studio.seo.alternateName")}
          value={value.alternateName || ""}
          onChange={(v) => set("alternateName", v)}
        />
        <TextField label={t("studio.schema.siteUrl")} value={value.url || ""} onChange={(v) => set("url", v)} dir="ltr" />
        <TextField
          label={t("studio.schema.siteLanguage")}
          value={value.inLanguage || "he-IL"}
          onChange={(v) => set("inLanguage", v)}
          dir="ltr"
        />
        <TextField
          label={t("studio.schema.siteOwner")}
          value={value.publisher || ""}
          onChange={(v) => set("publisher", v)}
        />
      </div>

      <SwitchField
        label={t("studio.schema.enableSearch")}
        checked={Boolean(value.enableSearch)}
        onChange={(v) => set("enableSearch", v)}
      />

      {value.enableSearch ? (
        <TextField
          label={t("studio.schema.searchUrlTemplate")}
          value={value.searchUrlTemplate || ""}
          onChange={(v) => set("searchUrlTemplate", v)}
          dir="ltr"
          hint={t("studio.schema.searchTermHint")}
        />
      ) : null}
    </div>
  );
}
