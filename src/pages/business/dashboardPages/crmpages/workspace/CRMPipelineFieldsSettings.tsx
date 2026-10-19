import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  fetchWorkspaceSettings,
  saveLeadCustomFields,
  savePipelineStages,
  type LeadCustomField,
  type PipelineStage,
} from "./crmWorkspaceApi";

export default function CRMPipelineFieldsSettings() {
  const { t } = useTranslation();
  const [stages, setStages] = useState<PipelineStage[]>([]);
  const [fields, setFields] = useState<LeadCustomField[]>([]);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    void fetchWorkspaceSettings().then((data) => {
      setStages(data.pipelineStages || []);
      setFields(data.leadCustomFields || []);
    });
  }, []);

  return (
    <div className="space-y-6" dir="rtl">
      {notice && <p className="rounded-xl bg-emerald-50 p-3 text-sm font-bold text-emerald-700">{notice}</p>}
      <section className="rounded-2xl border bg-white p-4">
        <h3 className="text-base font-black">{t("crm.workspace.pipelineSettings")}</h3>
        <div className="mt-3 space-y-2">
          {stages.map((stage, index) => (
            <div key={stage.key} className="grid gap-2 sm:grid-cols-3">
              <input
                className="h-10 rounded-xl border px-3 text-sm"
                value={stage.label}
                onChange={(event) =>
                  setStages((prev) =>
                    prev.map((item, i) => (i === index ? { ...item, label: event.target.value } : item))
                  )
                }
              />
              <input
                className="h-10 rounded-xl border px-3 text-sm"
                type="number"
                value={stage.order}
                onChange={(event) =>
                  setStages((prev) =>
                    prev.map((item, i) => (i === index ? { ...item, order: Number(event.target.value) } : item))
                  )
                }
              />
              <label className="text-xs font-bold">
                <input
                  type="checkbox"
                  checked={Boolean(stage.hidden)}
                  onChange={(event) =>
                    setStages((prev) =>
                      prev.map((item, i) => (i === index ? { ...item, hidden: event.target.checked } : item))
                    )
                  }
                />{" "}
                {t("crm.workspace.hideStage")}
              </label>
            </div>
          ))}
        </div>
        <button
          type="button"
          className="mt-3 rounded-xl bg-[#6D28D9] px-4 py-2 text-xs font-black text-white"
          onClick={() => void savePipelineStages(stages).then(() => setNotice(t("crm.workspace.saved")))}
        >
          {t("crm.common.save")}
        </button>
      </section>

      <section className="rounded-2xl border bg-white p-4">
        <h3 className="text-base font-black">{t("crm.workspace.customFields")}</h3>
        <button
          type="button"
          className="mt-2 rounded-xl border px-3 py-2 text-xs font-black"
          onClick={() =>
            setFields((prev) => [
              ...prev,
              {
                id: `field_${Date.now()}`,
                key: `field_${prev.length + 1}`,
                label: t("crm.workspace.newField"),
                type: "text",
                options: [],
                required: false,
                showInTable: false,
                showInFilter: false,
                active: true,
                order: prev.length + 1,
              },
            ])
          }
        >
          {t("crm.workspace.addField")}
        </button>
        <div className="mt-3 space-y-3">
          {fields.map((field, index) => (
            <div key={field.id} className="grid gap-2 rounded-xl border p-3 sm:grid-cols-2">
              <input
                className="h-10 rounded-xl border px-3 text-sm"
                value={field.label}
                onChange={(event) =>
                  setFields((prev) =>
                    prev.map((item, i) => (i === index ? { ...item, label: event.target.value } : item))
                  )
                }
              />
              <select
                className="h-10 rounded-xl border px-3 text-sm"
                value={field.type}
                onChange={(event) =>
                  setFields((prev) =>
                    prev.map((item, i) =>
                      i === index ? { ...item, type: event.target.value as LeadCustomField["type"] } : item
                    )
                  )
                }
              >
                {["text", "number", "date", "time", "select", "multiselect", "boolean", "url", "money"].map((type) => (
                  <option key={type} value={type}>
                    {t(`crm.workspace.fieldTypes.${type}`)}
                  </option>
                ))}
              </select>
              <label className="text-xs font-bold">
                <input
                  type="checkbox"
                  checked={field.required}
                  onChange={(event) =>
                    setFields((prev) =>
                      prev.map((item, i) => (i === index ? { ...item, required: event.target.checked } : item))
                    )
                  }
                />{" "}
                {t("crm.common.required")}
              </label>
              <label className="text-xs font-bold">
                <input
                  type="checkbox"
                  checked={field.showInTable}
                  onChange={(event) =>
                    setFields((prev) =>
                      prev.map((item, i) => (i === index ? { ...item, showInTable: event.target.checked } : item))
                    )
                  }
                />{" "}
                {t("crm.workspace.showInTable")}
              </label>
              <label className="text-xs font-bold">
                <input
                  type="checkbox"
                  checked={field.showInFilter}
                  onChange={(event) =>
                    setFields((prev) =>
                      prev.map((item, i) => (i === index ? { ...item, showInFilter: event.target.checked } : item))
                    )
                  }
                />{" "}
                {t("crm.workspace.showInFilter")}
              </label>
            </div>
          ))}
        </div>
        <button
          type="button"
          className="mt-3 rounded-xl bg-[#6D28D9] px-4 py-2 text-xs font-black text-white"
          onClick={() => void saveLeadCustomFields(fields).then(() => setNotice(t("crm.workspace.saved")))}
        >
          {t("crm.common.save")}
        </button>
      </section>
    </div>
  );
}
