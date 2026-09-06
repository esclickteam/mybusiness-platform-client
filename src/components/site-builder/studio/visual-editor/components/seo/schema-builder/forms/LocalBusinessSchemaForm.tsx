import React from "react";
import { Plus, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { getTextDirection } from "../../../../../../../../i18n/localeUtils";

import {
  LOCAL_BUSINESS_TYPES,
  WEEK_DAYS,
  type LocalBusinessFormData,
  type OpeningHoursRow,
} from "../schemaTypes";
import { newLocalId } from "../schemaBuilders";
import {
  FIELD_GRID,
  Field,
  SelectField,
  SwitchField,
  TagsField,
  TextAreaField,
  TextField,
} from "./fields";

type Props = {
  value: LocalBusinessFormData;
  onChange: (next: LocalBusinessFormData) => void;
};

const SEO_DAY_KEYS: Record<string, string> = {
  Sunday: "studio.seo.sunday",
  Monday: "studio.seo.monday",
  Tuesday: "studio.seo.tuesday",
  Wednesday: "studio.seo.wednesday",
  Thursday: "studio.seo.thursday",
  Friday: "studio.seo.friday",
  Saturday: "studio.seo.saturday",
};

export default function LocalBusinessSchemaForm({ value, onChange }: Props) {
  const { t, i18n } = useTranslation();
  const pageDir = getTextDirection(i18n.language);
  const set = <K extends keyof LocalBusinessFormData>(
    key: K,
    val: LocalBusinessFormData[K],
  ) => onChange({ ...value, [key]: val });

  const rows: OpeningHoursRow[] = Array.isArray(value.openingHours)
    ? value.openingHours
    : [];

  const addRow = () =>
    set("openingHours", [
      ...rows,
      {
        id: newLocalId("oh"),
        day: "Sunday",
        closed: false,
        opens: "09:00",
        closes: "17:00",
      },
    ]);

  const updateRow = (id: string, patch: Partial<OpeningHoursRow>) =>
    set(
      "openingHours",
      rows.map((row) => (row.id === id ? { ...row, ...patch } : row)),
    );

  const removeRow = (id: string) =>
    set(
      "openingHours",
      rows.filter((row) => row.id !== id),
    );

  return (
    <div className="space-y-4" dir={pageDir}>
      <div className={FIELD_GRID}>
        <SelectField
          label={t("studio.seo.businessType")}
          value={value.businessType || "LocalBusiness"}
          onChange={(v) => set("businessType", v)}
          options={LOCAL_BUSINESS_TYPES.map((type) => ({ value: type, label: type }))}
        />
        <TextField
          label={t("studio.seo.businessName")}
          value={value.name || ""}
          onChange={(v) => set("name", v)}
          placeholder={t("studio.seo.businessNamePh")}
        />
        <TextField
          label={t("studio.seo.alternateName")}
          value={value.alternateName || ""}
          onChange={(v) => set("alternateName", v)}
        />
        <TextField
          label={t("studio.seo.priceRange")}
          value={value.priceRange || ""}
          onChange={(v) => set("priceRange", v)}
          placeholder={t("studio.seo.priceRangePh")}
        />
      </div>

      <TextAreaField
        label={t("studio.seo.businessDescription")}
        value={value.description || ""}
        onChange={(v) => set("description", v)}
      />

      <div className={FIELD_GRID}>
        <TextField
          label={t("studio.seo.phone")}
          value={value.telephone || ""}
          onChange={(v) => set("telephone", v)}
          dir="ltr"
          placeholder="+972-3-1234567"
        />
        <TextField
          label={t("studio.seo.email")}
          value={value.email || ""}
          onChange={(v) => set("email", v)}
          dir="ltr"
        />
        <TextField
          label={t("studio.seo.websiteUrl")}
          value={value.url || ""}
          onChange={(v) => set("url", v)}
          dir="ltr"
        />
        <TextField
          label={t("studio.seo.logoUrl")}
          value={value.logo || ""}
          onChange={(v) => set("logo", v)}
          dir="ltr"
        />
        <TextField
          label={t("studio.seo.businessImage")}
          value={value.image || ""}
          onChange={(v) => set("image", v)}
          dir="ltr"
        />
        <TextField
          label={t("studio.seo.areaServed")}
          value={value.areaServed || ""}
          onChange={(v) => set("areaServed", v)}
          placeholder={t("studio.seo.areaServedPh")}
        />
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-3">
        <p className="mb-2 text-xs font-black text-slate-700">{t("studio.seo.fullAddress")}</p>
        <div className={FIELD_GRID}>
          <TextField
            label={t("studio.seo.street")}
            value={value.streetAddress || ""}
            onChange={(v) => set("streetAddress", v)}
          />
          <TextField
            label={t("studio.seo.city")}
            value={value.addressLocality || ""}
            onChange={(v) => set("addressLocality", v)}
          />
          <TextField
            label={t("studio.seo.region")}
            value={value.addressRegion || ""}
            onChange={(v) => set("addressRegion", v)}
          />
          <TextField
            label={t("studio.seo.postalCode")}
            value={value.postalCode || ""}
            onChange={(v) => set("postalCode", v)}
          />
          <TextField
            label={t("studio.seo.country")}
            value={value.addressCountry || "IL"}
            onChange={(v) => set("addressCountry", v)}
            dir="ltr"
            hint={t("studio.seo.countryHint")}
          />
        </div>
        <div className={`${FIELD_GRID} mt-3`}>
          <TextField
            label={t("studio.seo.latitude")}
            value={value.latitude || ""}
            onChange={(v) => set("latitude", v)}
            dir="ltr"
          />
          <TextField
            label={t("studio.seo.longitude")}
            value={value.longitude || ""}
            onChange={(v) => set("longitude", v)}
            dir="ltr"
          />
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-3">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-xs font-black text-slate-700">{t("studio.seo.openingHours")}</p>
        </div>
        <SwitchField
          label={t("studio.seo.open24")}
          checked={Boolean(value.openAllHours)}
          onChange={(v) => set("openAllHours", v)}
        />
        {!value.openAllHours ? (
          <div className="mt-3 space-y-2">
            {rows.map((row) => (
              <div
                key={row.id}
                className="flex flex-wrap items-center gap-2 rounded-xl border border-slate-100 bg-slate-50 p-2"
              >
                <select
                  value={row.day}
                  onChange={(event) =>
                    updateRow(row.id, { day: event.target.value })
                  }
                  className="h-9 rounded-lg border border-slate-200 bg-white px-2 text-xs font-bold text-slate-800"
                >
                  {WEEK_DAYS.map((day) => (
                    <option key={day.id} value={day.id}>
                      {t(SEO_DAY_KEYS[day.id] || day.label)}
                    </option>
                  ))}
                </select>
                <input
                  type="time"
                  value={row.opens}
                  disabled={row.closed}
                  onChange={(event) =>
                    updateRow(row.id, { opens: event.target.value })
                  }
                  className="h-9 rounded-lg border border-slate-200 bg-white px-2 text-xs font-bold text-slate-800 disabled:opacity-40"
                  dir="ltr"
                />
                <span className="text-xs font-bold text-slate-400">{t("studio.seo.until")}</span>
                <input
                  type="time"
                  value={row.closes}
                  disabled={row.closed}
                  onChange={(event) =>
                    updateRow(row.id, { closes: event.target.value })
                  }
                  className="h-9 rounded-lg border border-slate-200 bg-white px-2 text-xs font-bold text-slate-800 disabled:opacity-40"
                  dir="ltr"
                />
                <label className="flex items-center gap-1 text-xs font-bold text-slate-600">
                  <input
                    type="checkbox"
                    checked={row.closed}
                    onChange={(event) =>
                      updateRow(row.id, { closed: event.target.checked })
                    }
                  />
                  {t("studio.seo.closed")}
                </label>
                <button
                  type="button"
                  onClick={() => removeRow(row.id)}
                  className="ms-auto flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-rose-500 hover:bg-rose-50"
                  aria-label={t("studio.seo.deleteRow")}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addRow}
              className="flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-xs font-black text-slate-700 transition hover:bg-slate-50"
            >
              <Plus className="h-4 w-4" /> {t("studio.seo.addDayRange")}
            </button>
          </div>
        ) : null}
      </div>

      <TagsField
        label={t("studio.seo.mainServices")}
        values={value.services || []}
        onChange={(v) => set("services", v)}
        placeholder={t("studio.seo.servicesPlaceholder")}
        dir={pageDir}
      />

      <TagsField
        label={t("studio.seo.socialUrls")}
        values={value.sameAs || []}
        onChange={(v) => set("sameAs", v)}
        placeholder="https://facebook.com/..."
      />
    </div>
  );
}
