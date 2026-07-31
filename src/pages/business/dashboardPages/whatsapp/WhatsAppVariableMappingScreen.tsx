import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Loader2, Save, Eye, ArrowRight } from "lucide-react";
import {
  getWhatsAppTemplateVariableMappings,
  listWhatsAppMappingAppointments,
  previewWhatsAppTemplateMappings,
  saveWhatsAppTemplateVariableMappings,
  type WhatsAppMappingAppointment,
  type WhatsAppMappingCatalog,
  type WhatsAppMappingStatus,
  type WhatsAppTemplate,
  type WhatsAppVariableMapping,
} from "../../../../api/whatsappApi";
import {
  btnPrimary,
  btnSecondary,
  cardBase,
  inputBase,
} from "../../../../styles/bizuplyUi";

type Props = {
  businessId: string;
  template: WhatsAppTemplate;
  onClose: () => void;
  onSaved?: (template: WhatsAppTemplate) => void;
};

function emptyRow(variable: string, template: WhatsAppTemplate): WhatsAppVariableMapping {
  return {
    variable,
    component: String(template.headerText || "").includes(`{{${variable}}}`)
      ? "header"
      : "body",
    exampleValue: template.exampleValues?.[variable] || "",
    friendlyName: "",
    source: "",
    field: "",
    format: "",
    constantValue: "",
    fallbackValue: "",
    prefix: "",
    suffix: "",
    required: true,
  };
}

export default function WhatsAppVariableMappingScreen({
  businessId,
  template,
  onClose,
  onSaved,
}: Props) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [previewing, setPreviewing] = useState(false);
  const [error, setError] = useState("");
  const [catalog, setCatalog] = useState<WhatsAppMappingCatalog | null>(null);
  const [mappings, setMappings] = useState<WhatsAppVariableMapping[]>([]);
  const [mappingStatus, setMappingStatus] =
    useState<WhatsAppMappingStatus>("unmapped");
  const [previewBody, setPreviewBody] = useState("");
  const [previewHeader, setPreviewHeader] = useState("");
  const [missing, setMissing] = useState<string[]>([]);
  const [manualValues, setManualValues] = useState<Record<string, string>>({});
  const [appointments, setAppointments] = useState<WhatsAppMappingAppointment[]>(
    []
  );
  const [appointmentId, setAppointmentId] = useState("");
  const [selectAppointmentMessage, setSelectAppointmentMessage] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError("");
      try {
        const [data, appts] = await Promise.all([
          getWhatsAppTemplateVariableMappings(businessId, template._id),
          listWhatsAppMappingAppointments(businessId).catch(() => []),
        ]);
        if (cancelled) return;
        setCatalog(data.catalog);
        setMappings(
          data.mappings?.length
            ? data.mappings
            : (data.variables || []).map((v) => emptyRow(v, template))
        );
        setMappingStatus(data.mappingStatus);
        setAppointments(appts);
      } catch (err: unknown) {
        if (!cancelled) {
          setError(
            (err as { response?: { data?: { error?: string } } })?.response
              ?.data?.error ||
              (err as Error)?.message ||
              t("whatsapp.mapping.loadFailed")
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [businessId, template, t]);

  const needsAppointmentPicker = useMemo(
    () => mappings.some((row) => row.source === "appointment"),
    [mappings]
  );

  const statusLabel = useMemo(() => {
    if (mappingStatus === "ready") {
      return t("whatsapp.templates.mappingStatus.ready");
    }
    if (mappingStatus === "partial") {
      return t("whatsapp.templates.mappingStatus.partial");
    }
    if (mappingStatus === "unmapped") {
      return t("whatsapp.templates.mappingStatus.unmapped");
    }
    return mappingStatus;
  }, [mappingStatus, t]);

  const componentLabel = (component: string) => {
    if (component === "header") return t("whatsapp.mapping.componentHeader");
    if (component === "button") return t("whatsapp.mapping.componentButton");
    return t("whatsapp.mapping.componentBody");
  };

  const updateRow = (index: number, patch: Partial<WhatsAppVariableMapping>) => {
    setMappings((prev) =>
      prev.map((row, i) => (i === index ? { ...row, ...patch } : row))
    );
  };

  const fieldsForSource = (sourceId: string) => {
    const src = catalog?.sources?.find((s) => s.id === sourceId);
    return src?.fields || [];
  };

  const formatsForRow = (row: WhatsAppVariableMapping) => {
    const field = fieldsForSource(row.source || "").find(
      (f) => f.id === row.field
    );
    const valueType = field?.valueType || "text";
    return catalog?.formats?.[valueType] || catalog?.formats?.text || [];
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      const data = await saveWhatsAppTemplateVariableMappings(
        businessId,
        template._id,
        mappings
      );
      setMappings(data.mappings);
      setMappingStatus(data.mappingStatus);
      onSaved?.(data.template);
    } catch (err: unknown) {
      setError(
        (err as { response?: { data?: { error?: string } } })?.response?.data
          ?.error ||
          (err as Error)?.message ||
          t("whatsapp.mapping.saveFailed")
      );
    } finally {
      setSaving(false);
    }
  };

  const handlePreview = async () => {
    setPreviewing(true);
    setError("");
    setSelectAppointmentMessage("");
    try {
      if (needsAppointmentPicker && !appointmentId) {
        setSelectAppointmentMessage(
          t("whatsapp.mapping.selectAppointmentToTest")
        );
        setPreviewBody("");
        setPreviewHeader("");
        setMissing(
          mappings
            .filter((row) => row.source === "appointment" && row.required !== false)
            .map((row) => row.variable)
        );
        return;
      }
      const data = await previewWhatsAppTemplateMappings(
        businessId,
        template._id,
        {
          mappings,
          manualValues,
          appointmentId: appointmentId || null,
          name: t("whatsapp.mapping.sampleClientName"),
        }
      );
      setPreviewBody(data.previewBody || "");
      setPreviewHeader(data.previewHeader || "");
      setMissing(data.missing || []);
      setMappingStatus(data.mappingStatus);
      if (data.appointmentRequired || data.selectAppointmentMessage) {
        setSelectAppointmentMessage(
          data.selectAppointmentMessage ||
            t("whatsapp.mapping.selectAppointmentToTest")
        );
      }
    } catch (err: unknown) {
      setError(
        (err as { response?: { data?: { error?: string } } })?.response?.data
          ?.error ||
          (err as Error)?.message ||
          t("whatsapp.mapping.previewFailed")
      );
    } finally {
      setPreviewing(false);
    }
  };

  if (loading) {
    return (
      <section className={`${cardBase} flex items-center gap-2 p-6`}>
        <Loader2 className="h-4 w-4 animate-spin text-emerald-600" />
        <span className="text-sm font-semibold text-slate-600">
          {t("whatsapp.mapping.loading")}
        </span>
      </section>
    );
  }

  return (
    <section className={`${cardBase} space-y-4 p-4 sm:p-5`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <button
            type="button"
            className={`${btnSecondary} mb-2`}
            onClick={onClose}
          >
            <ArrowRight className="h-3.5 w-3.5" />
            {t("whatsapp.mapping.backToTemplates")}
          </button>
          <h2 className="text-lg font-black text-slate-900">
            {t("whatsapp.mapping.title", { name: template.name })}
          </h2>
          <p className="mt-1 text-sm font-semibold text-slate-500">
            {t("whatsapp.mapping.metaLine", {
              language: template.language,
              status: statusLabel,
            })}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className={btnSecondary}
            onClick={handlePreview}
            disabled={previewing}
          >
            {previewing ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Eye className="h-3.5 w-3.5" />
            )}
            {t("whatsapp.mapping.previewMapping")}
          </button>
          <button
            type="button"
            className={btnPrimary}
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Save className="h-3.5 w-3.5" />
            )}
            {t("whatsapp.mapping.saveMapping")}
          </button>
        </div>
      </div>

      {error ? (
        <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700">
          {error}
        </div>
      ) : null}

      {needsAppointmentPicker ? (
        <div className="rounded-xl border border-sky-200 bg-sky-50/70 px-3 py-3">
          <label className="block text-xs font-bold text-slate-700">
            {t("whatsapp.mapping.testAppointment")}
            <select
              className={`${inputBase} mt-1 bg-white`}
              value={appointmentId}
              onChange={(e) => setAppointmentId(e.target.value)}
            >
              <option value="">
                {t("whatsapp.mapping.selectAppointment")}
              </option>
              {appointments.map((appt) => (
                <option key={appt.id} value={appt.id}>
                  {appt.label}
                </option>
              ))}
            </select>
          </label>
          {!appointments.length ? (
            <p className="mt-2 text-xs font-semibold text-amber-800">
              {t("whatsapp.mapping.noAppointments")}
            </p>
          ) : null}
          {selectAppointmentMessage ? (
            <p className="mt-2 text-xs font-semibold text-amber-800">
              {selectAppointmentMessage}
            </p>
          ) : null}
        </div>
      ) : null}

      <div className="space-y-4">
        {mappings.map((row, index) => {
          const fields = fieldsForSource(row.source || "");
          const formats = formatsForRow(row);
          return (
            <article
              key={row.variable}
              className="rounded-xl border border-slate-200 bg-slate-50/60 p-3 sm:p-4"
            >
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span
                  dir="ltr"
                  className="rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-black text-emerald-700"
                >
                  {`{{${row.variable}}}`}
                </span>
                <span className="text-xs font-bold text-slate-500">
                  {t("whatsapp.mapping.componentLabel")}{" "}
                  {componentLabel(row.component || "body")}
                </span>
              </div>

              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                <label className="block text-xs font-bold text-slate-600">
                  {t("whatsapp.mapping.friendlyName")}
                  <input
                    className={`${inputBase} mt-1`}
                    value={row.friendlyName || ""}
                    onChange={(e) =>
                      updateRow(index, { friendlyName: e.target.value })
                    }
                    placeholder={t("whatsapp.mapping.friendlyNamePlaceholder")}
                  />
                </label>

                <label className="block text-xs font-bold text-slate-600">
                  {t("whatsapp.mapping.exampleValue")}
                  <input
                    className={`${inputBase} mt-1`}
                    value={row.exampleValue || ""}
                    onChange={(e) =>
                      updateRow(index, { exampleValue: e.target.value })
                    }
                  />
                </label>

                <label className="block text-xs font-bold text-slate-600">
                  {t("whatsapp.mapping.dataSource")}
                  <select
                    className={`${inputBase} mt-1`}
                    value={row.source || ""}
                    onChange={(e) =>
                      updateRow(index, {
                        source: e.target.value,
                        field: "",
                        format: "",
                      })
                    }
                  >
                    <option value="">{t("whatsapp.mapping.selectSource")}</option>
                    {(catalog?.sources || []).map((src) => (
                      <option key={src.id} value={src.id}>
                        {src.label}
                      </option>
                    ))}
                  </select>
                </label>

                {row.source &&
                row.source !== "manual" &&
                row.source !== "constant" ? (
                  <label className="block text-xs font-bold text-slate-600">
                    {t("whatsapp.mapping.dataField")}
                    <select
                      className={`${inputBase} mt-1`}
                      value={row.field || ""}
                      onChange={(e) => {
                        const fieldId = e.target.value;
                        const fieldMeta = fields.find((f) => f.id === fieldId);
                        const nextFormats =
                          catalog?.formats?.[fieldMeta?.valueType || "text"] ||
                          [];
                        const defaultFmt =
                          fieldMeta?.valueType === "datetime"
                            ? nextFormats[0]?.id || "MMMM d, yyyy 'at' h:mm a"
                            : "";
                        updateRow(index, {
                          field: fieldId,
                          format: defaultFmt,
                        });
                      }}
                    >
                      <option value="">{t("whatsapp.mapping.selectField")}</option>
                      {fields.map((field) => (
                        <option key={field.id} value={field.id}>
                          {field.label}
                        </option>
                      ))}
                    </select>
                  </label>
                ) : null}

                {row.source === "constant" ? (
                  <label className="block text-xs font-bold text-slate-600">
                    {t("whatsapp.mapping.constantValue")}
                    <input
                      className={`${inputBase} mt-1`}
                      value={row.constantValue || ""}
                      onChange={(e) =>
                        updateRow(index, { constantValue: e.target.value })
                      }
                    />
                  </label>
                ) : null}

                {row.source === "manual" ? (
                  <label className="block text-xs font-bold text-slate-600">
                    {t("whatsapp.mapping.manualTestValue")}
                    <input
                      className={`${inputBase} mt-1`}
                      value={manualValues[row.variable] || ""}
                      onChange={(e) =>
                        setManualValues((prev) => ({
                          ...prev,
                          [row.variable]: e.target.value,
                        }))
                      }
                      placeholder={t("whatsapp.mapping.manualTestPlaceholder")}
                    />
                  </label>
                ) : null}

                {formats.length ? (
                  <label className="block text-xs font-bold text-slate-600">
                    {t("whatsapp.mapping.format")}
                    <select
                      className={`${inputBase} mt-1`}
                      value={row.format || ""}
                      onChange={(e) =>
                        updateRow(index, { format: e.target.value })
                      }
                    >
                      <option value="">{t("whatsapp.mapping.formatNone")}</option>
                      {formats.map((fmt) => (
                        <option key={fmt.id} value={fmt.id}>
                          {fmt.label}
                        </option>
                      ))}
                    </select>
                  </label>
                ) : null}

                <label className="block text-xs font-bold text-slate-600">
                  {t("whatsapp.mapping.fallbackValue")}
                  <input
                    className={`${inputBase} mt-1`}
                    value={row.fallbackValue || ""}
                    onChange={(e) =>
                      updateRow(index, { fallbackValue: e.target.value })
                    }
                  />
                </label>

                <label className="block text-xs font-bold text-slate-600">
                  {t("whatsapp.mapping.prefix")}
                  <input
                    className={`${inputBase} mt-1`}
                    value={row.prefix || ""}
                    onChange={(e) =>
                      updateRow(index, { prefix: e.target.value })
                    }
                  />
                </label>

                <label className="block text-xs font-bold text-slate-600">
                  {t("whatsapp.mapping.suffix")}
                  <input
                    className={`${inputBase} mt-1`}
                    value={row.suffix || ""}
                    onChange={(e) =>
                      updateRow(index, { suffix: e.target.value })
                    }
                  />
                </label>

                <label className="flex items-center gap-2 pt-6 text-xs font-bold text-slate-700">
                  <input
                    type="checkbox"
                    checked={row.required !== false}
                    onChange={(e) =>
                      updateRow(index, { required: e.target.checked })
                    }
                  />
                  {t("whatsapp.mapping.requiredField")}
                </label>
              </div>
            </article>
          );
        })}
      </div>

      {(previewBody || previewHeader || missing.length > 0) && (
        <div className="rounded-xl border border-emerald-100 bg-emerald-50/40 p-4">
          <h3 className="text-sm font-black text-slate-900">
            {t("whatsapp.mapping.previewTitle")}
          </h3>
          {previewHeader ? (
            <p className="mt-2 text-sm font-bold text-slate-800">
              {previewHeader}
            </p>
          ) : null}
          <p className="mt-2 whitespace-pre-wrap text-sm font-medium text-slate-700">
            {previewBody || "—"}
          </p>
          {missing.length ? (
            <p className="mt-2 text-xs font-bold text-amber-700">
              {t("whatsapp.mapping.missingValues", {
                vars: missing.map((v) => `{{${v}}}`).join(", "),
              })}
            </p>
          ) : (
            <p className="mt-2 text-xs font-bold text-emerald-700">
              {t("whatsapp.mapping.allValuesFilled")}
            </p>
          )}
        </div>
      )}
    </section>
  );
}
