import React from "react";
import { useTranslation } from "react-i18next";
import { getTextDirection } from "../../../../../../../../i18n/localeUtils";

import type { ServiceFormData } from "../schemaTypes";
import { PRODUCT_AVAILABILITY } from "../schemaTypes";
import { FIELD_GRID, SelectField, TextAreaField, TextField } from "./fields";

type Props = {
  value: ServiceFormData;
  onChange: (next: ServiceFormData) => void;
};

export default function ServiceSchemaForm({ value, onChange }: Props) {
  const { t, i18n } = useTranslation();
  const pageDir = getTextDirection(i18n.language);
  const set = <K extends keyof ServiceFormData>(
    key: K,
    val: ServiceFormData[K],
  ) => onChange({ ...value, [key]: val });

  return (
    <div className="space-y-4" dir={pageDir}>
      <div className={FIELD_GRID}>
        <TextField
          label={t("studio.seo.serviceName")}
          value={value.name || ""}
          onChange={(v) => set("name", v)}
        />
        <TextField
          label={t("studio.seo.serviceCategory")}
          value={value.serviceType || ""}
          onChange={(v) => set("serviceType", v)}
          placeholder={t("studio.seo.serviceCategoryPh")}
        />
      </div>

      <TextAreaField
        label={t("studio.seo.serviceDescription")}
        value={value.description || ""}
        onChange={(v) => set("description", v)}
      />

      <div className={FIELD_GRID}>
        <TextField
          label={t("studio.seo.servicePageUrl")}
          value={value.url || ""}
          onChange={(v) => set("url", v)}
          dir="ltr"
        />
        <TextField
          label={t("studio.seo.serviceImage")}
          value={value.image || ""}
          onChange={(v) => set("image", v)}
          dir="ltr"
        />
        <TextField
          label={t("studio.seo.serviceProvider")}
          value={value.providerName || ""}
          onChange={(v) => set("providerName", v)}
        />
        <SelectField
          label={t("studio.seo.providerType")}
          value={value.providerType || "Organization"}
          onChange={(v) => set("providerType", v)}
          options={[
            { value: "Organization", label: t("studio.seo.organization") },
            { value: "LocalBusiness", label: t("studio.seo.localBusiness") },
            { value: "Person", label: t("studio.seo.person") },
          ]}
        />
        <TextField
          label={t("studio.seo.areaServed")}
          value={value.areaServed || ""}
          onChange={(v) => set("areaServed", v)}
        />
        <TextField
          label={t("studio.seo.audience")}
          value={value.audienceType || ""}
          onChange={(v) => set("audienceType", v)}
        />
        <TextField
          label={t("studio.seo.priceFrom")}
          value={value.priceFrom || ""}
          onChange={(v) => set("priceFrom", v)}
          dir="ltr"
          type="number"
        />
        <TextField
          label={t("studio.seo.priceTo")}
          value={value.priceTo || ""}
          onChange={(v) => set("priceTo", v)}
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
          label={t("studio.seo.serviceAvailability")}
          value={value.availability || "InStock"}
          onChange={(v) => set("availability", v)}
          options={PRODUCT_AVAILABILITY.map((a) => ({ value: a, label: a }))}
        />
        <TextField
          label={t("studio.seo.contactPhone")}
          value={value.telephone || ""}
          onChange={(v) => set("telephone", v)}
          dir="ltr"
        />
      </div>
    </div>
  );
}
