import React from "react";
import { useTranslation } from "react-i18next";
import { getTextDirection } from "../../../../../../../../i18n/localeUtils";

import type { OrganizationFormData } from "../schemaTypes";
import { FIELD_GRID, TagsField, TextAreaField, TextField } from "./fields";

type Props = {
  value: OrganizationFormData;
  onChange: (next: OrganizationFormData) => void;
};

export default function OrganizationSchemaForm({ value, onChange }: Props) {
  const { t, i18n } = useTranslation();
  const pageDir = getTextDirection(i18n.language);
  const set = <K extends keyof OrganizationFormData>(
    key: K,
    val: OrganizationFormData[K],
  ) => onChange({ ...value, [key]: val });

  return (
    <div className="space-y-4" dir={pageDir}>
      <p className="rounded-xl bg-blue-50 px-3 py-2 text-[11px] font-semibold text-blue-800">
        {t("studio.seo.organizationHint")}
      </p>

      <div className={FIELD_GRID}>
        <TextField label={t("studio.seo.organizationName")} value={value.name || ""} onChange={(v) => set("name", v)} />
        <TextField
          label={t("studio.seo.alternateName")}
          value={value.alternateName || ""}
          onChange={(v) => set("alternateName", v)}
        />
      </div>

      <TextAreaField
        label={t("studio.seo.description")}
        value={value.description || ""}
        onChange={(v) => set("description", v)}
      />

      <div className={FIELD_GRID}>
        <TextField label={t("studio.seo.websiteUrl")} value={value.url || ""} onChange={(v) => set("url", v)} dir="ltr" />
        <TextField label={t("studio.seo.logoUrl")} value={value.logo || ""} onChange={(v) => set("logo", v)} dir="ltr" />
        <TextField label={t("studio.seo.businessImage")} value={value.image || ""} onChange={(v) => set("image", v)} dir="ltr" />
        <TextField label={t("studio.seo.email")} value={value.email || ""} onChange={(v) => set("email", v)} dir="ltr" />
        <TextField label={t("studio.seo.phone")} value={value.telephone || ""} onChange={(v) => set("telephone", v)} dir="ltr" />
        <TextField
          label={t("studio.seo.foundingYear")}
          value={value.foundingDate || ""}
          onChange={(v) => set("foundingDate", v)}
          dir="ltr"
          placeholder="2019"
        />
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-3">
        <p className="mb-2 text-xs font-black text-slate-700">{t("studio.seo.address")}</p>
        <div className={FIELD_GRID}>
          <TextField label={t("studio.seo.street")} value={value.streetAddress || ""} onChange={(v) => set("streetAddress", v)} />
          <TextField label={t("studio.seo.city")} value={value.addressLocality || ""} onChange={(v) => set("addressLocality", v)} />
          <TextField label={t("studio.seo.region")} value={value.addressRegion || ""} onChange={(v) => set("addressRegion", v)} />
          <TextField label={t("studio.seo.postalCode")} value={value.postalCode || ""} onChange={(v) => set("postalCode", v)} />
          <TextField label={t("studio.seo.country")} value={value.addressCountry || "IL"} onChange={(v) => set("addressCountry", v)} dir="ltr" />
        </div>
      </div>

      <TagsField
        label={t("studio.seo.socialUrls")}
        values={value.sameAs || []}
        onChange={(v) => set("sameAs", v)}
        placeholder="https://facebook.com/..."
      />
    </div>
  );
}
