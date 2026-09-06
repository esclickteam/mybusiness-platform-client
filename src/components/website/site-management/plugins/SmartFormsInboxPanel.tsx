import React from "react";
import { useTranslation } from "react-i18next";
import { FormInput } from "lucide-react";
import { Link } from "react-router-dom";

import API from "../../../../api";
import { useSitePluginSettings } from "./useSitePluginSettings";
import {
  Field,
  PluginPanelProps,
  SitePluginPanelFrame,
  Toggle,
  bool,
} from "./SitePluginPanelFrame";
import { btnSecondary } from "../siteManagementUi";

type Submission = {
  leadId: string;
  formId: string;
  name: string;
  phone: string;
  email: string;
  message: string;
  status: string;
  createdAt?: string;
  attachments?: Array<{ originalName?: string; url?: string; fieldId?: string }>;
  formPdf?: { mediaAssetId?: string; url?: string } | null;
};

export default function SmartFormsInboxPanel(props: PluginPanelProps) {
  const { t } = useTranslation();
  const { settings, loading: settingsLoading, saving, message, save, updateField } =
    useSitePluginSettings(props.siteId, "smart-forms");
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");
  const [submissions, setSubmissions] = React.useState<Submission[]>([]);
  const [counts, setCounts] = React.useState<Record<string, number>>({});

  React.useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError("");
      try {
        const { data } = await API.get(
          `/site-builder/sites/${props.siteId}/form-submissions`,
          { params: { limit: 50 } },
        );
        if (cancelled) return;
        setSubmissions(Array.isArray(data?.submissions) ? data.submissions : []);
        setCounts(data?.counts && typeof data.counts === "object" ? data.counts : {});
      } catch (err: any) {
        if (!cancelled) {
          setError(
            err?.response?.data?.error ||
              t("leftover.smartForms.loadError", "Could not load the inbox")
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [props.siteId, t]);

  return (
    <SitePluginPanelFrame
      {...props}
      icon={FormInput}
      accent="#4F46E5"
      title={t("leftover.smartForms.title", "Smart Forms Pro")}
      description={t(
        "leftover.smartForms.description",
        "Inbox by form, including attached files. Basic forms stay in the builder."
      )}
      loading={loading || settingsLoading}
      saving={saving}
      message={message}
      onSave={() => save()}
    >
      <Toggle
        label={t("leftover.smartForms.active", "Plugin is active")}
        checked={bool(settings.isActive, true)}
        onChange={(v) => updateField("isActive", v)}
      />
      <Field label={t("leftover.smartForms.trackByForm", "Track by form")}>
        <div className="flex flex-wrap gap-2">
          {Object.keys(counts).length ? (
            Object.entries(counts).map(([formId, count]) => (
              <span
                key={formId}
                className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-black text-indigo-700"
              >
                {formId}: {count}
              </span>
            ))
          ) : (
            <span className="text-sm font-bold text-slate-500">
              {t("leftover.smartForms.empty", "No submissions from this site yet")}
            </span>
          )}
        </div>
      </Field>

      {error ? (
        <p className="text-sm font-bold text-rose-600">{error}</p>
      ) : (
        <div className="space-y-3">
          {submissions.map((row) => (
            <div
              key={row.leadId}
              className="rounded-2xl border border-slate-200 bg-white p-4"
            >
              <div className="flex items-center justify-between gap-3">
                <strong className="text-sm text-slate-900">
                  {row.name || t("leftover.smartForms.leadFromSite", "Lead from the site")}
                </strong>
                <span className="text-xs font-bold text-slate-500">
                  {row.formId || "website-form"}
                </span>
              </div>
              <p className="mt-1 text-xs font-bold text-slate-500">
                {[row.phone, row.email].filter(Boolean).join(" · ")}
              </p>
              {row.message ? (
                <p className="mt-2 text-sm text-slate-700">{row.message}</p>
              ) : null}
              {row.formPdf?.mediaAssetId ? (
                <button
                  type="button"
                  data-testid="form-pdf-download"
                  className="mt-2 inline-block text-xs font-bold text-amber-700"
                  onClick={async () => {
                    const { data } = await API.get(
                      `/site-builder/sites/${props.siteId}/media/${row.formPdf?.mediaAssetId}/download`,
                      { responseType: "blob" },
                    );
                    const blob = new Blob([data], { type: "application/pdf" });
                    const href = URL.createObjectURL(blob);
                    const link = document.createElement("a");
                    link.href = href;
                    link.download = "form-submission.pdf";
                    link.click();
                    URL.revokeObjectURL(href);
                  }}
                >
                  Download PDF
                </button>
              ) : null}
              <button
                type="button"
                data-testid="form-pdf-regenerate"
                className="mt-2 block text-xs font-bold text-slate-600"
                onClick={async () => {
                  await API.post(
                    `/site-builder/sites/${props.siteId}/leads/${row.leadId}/form-pdf`,
                  );
                }}
              >
                Regenerate PDF
              </button>
              {row.attachments?.length ? (
                <p className="mt-2 text-xs font-bold text-indigo-700">
                  {t("leftover.smartForms.files", "Files:")}{" "}
                  {row.attachments
                    .map((file) => file.originalName || file.fieldId)
                    .filter(Boolean)
                    .join(", ")}
                </p>
              ) : null}
            </div>
          ))}
        </div>
      )}

      {props.businessId ? (
        <Link
          to={`/business/${props.businessId}/dashboard/crm/leads`}
          className={btnSecondary}
        >
          {t("leftover.smartForms.openCrm", "Open in CRM")}
        </Link>
      ) : null}
    </SitePluginPanelFrame>
  );
}
