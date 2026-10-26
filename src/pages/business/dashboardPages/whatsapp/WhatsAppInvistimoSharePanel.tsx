import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import {
  getInvistimoShareReadiness,
  runInvistimoTemplateMigrationDryRun,
} from "../../../../api/whatsappApi";
import { btnSecondary } from "../../../../styles/bizuplyUi";

type Props = {
  businessId: string;
};

export default function WhatsAppInvistimoSharePanel({ businessId }: Props) {
  const { t } = useTranslation();
  const [busy, setBusy] = useState<"templates" | "readiness" | null>(null);
  const [summary, setSummary] = useState("");

  const handleTemplateDryRun = async () => {
    try {
      setBusy("templates");
      const data = await runInvistimoTemplateMigrationDryRun(businessId);
      setSummary(
        t("whatsapp.settings.invistimoShareTemplatesResult", {
          mapped: data.mappedCount ?? 0,
          eligible: data.eligibleCount ?? 0,
          ineligible: data.ineligibleCount ?? 0,
        })
      );
      toast.success(t("whatsapp.settings.invistimoShareTemplatesOk"));
    } catch (error: any) {
      toast.error(
        error?.response?.data?.error ||
          t("whatsapp.settings.invistimoShareTemplatesFailed")
      );
    } finally {
      setBusy(null);
    }
  };

  const handleReadiness = async () => {
    try {
      setBusy("readiness");
      const data = await getInvistimoShareReadiness(businessId);
      const blocked = (data.summary?.BLOCKED || []).join(", ") || "none";
      const unverified = (data.summary?.NOT_VERIFIED || []).join(", ") || "none";
      setSummary(
        t("whatsapp.settings.invistimoShareReadinessResult", {
          blocked,
          unverified,
        })
      );
      toast.success(t("whatsapp.settings.invistimoShareReadinessOk"));
    } catch (error: any) {
      toast.error(
        error?.response?.data?.error ||
          t("whatsapp.settings.invistimoShareReadinessFailed")
      );
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900">
      <p className="font-semibold">
        {t("whatsapp.settings.invistimoShareTitle")}
      </p>
      <p className="mt-1 text-xs font-medium text-slate-600">
        {t("whatsapp.settings.invistimoShareBody")}
      </p>
      <ol className="mt-3 list-decimal space-y-1 ps-5 text-xs font-medium text-slate-700">
        <li>{t("whatsapp.settings.invistimoShareStep1")}</li>
        <li>{t("whatsapp.settings.invistimoShareStep2")}</li>
        <li>{t("whatsapp.settings.invistimoShareStep3")}</li>
        <li>{t("whatsapp.settings.invistimoShareStep4")}</li>
      </ol>
      <p className="mt-2 text-xs font-semibold text-amber-800">
        {t("whatsapp.settings.invistimoShareFrozen")}
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <button type="button" className={btnSecondary} disabled>
          {t("whatsapp.settings.invistimoShareStartBlocked")}
        </button>
        <button
          type="button"
          className={btnSecondary}
          disabled={busy !== null}
          onClick={() => {
            void handleTemplateDryRun();
          }}
        >
          {busy === "templates"
            ? t("whatsapp.settings.invistimoShareTemplatesRunning")
            : t("whatsapp.settings.invistimoShareTemplates")}
        </button>
        <button
          type="button"
          className={btnSecondary}
          disabled={busy !== null}
          onClick={() => {
            void handleReadiness();
          }}
        >
          {busy === "readiness"
            ? t("whatsapp.settings.invistimoShareReadinessRunning")
            : t("whatsapp.settings.invistimoShareReadiness")}
        </button>
      </div>
      {summary ? (
        <p className="mt-2 text-xs font-medium text-slate-600" dir="ltr">
          {summary}
        </p>
      ) : null}
    </div>
  );
}
