import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  Loader2,
  Unplug,
} from "lucide-react";

import type {
  SitePaymentCredentials,
  SitePaymentProvider,
} from "../../../../api/sitePaymentsApi";
import { providerHasStoredSecret } from "../../../../api/sitePaymentsApi";
import { getTextDirection } from "../../../../i18n/localeUtils";
import { btnGhost, btnPrimary, btnSecondary, inputBase } from "../siteManagementUi";
import { SitePanelCard } from "../SitePanelShell";
import type { PaymentProviderCatalogItem } from "./paymentProvidersCatalog";

type PaymentProviderConnectViewProps = {
  catalogItem: PaymentProviderCatalogItem;
  existing?: SitePaymentProvider | null;
  saving?: boolean;
  disconnecting?: boolean;
  onCancel: () => void;
  onConnect: (payload: {
    credentials: SitePaymentCredentials;
    installmentsEnabled: boolean;
    mode: "test" | "live";
  }) => void;
  onDisconnect?: () => void;
};

function emptyCredentialsFromFields(
  item: PaymentProviderCatalogItem,
  existing?: SitePaymentProvider | null
): SitePaymentCredentials {
  const next: SitePaymentCredentials = {};
  item.fields.forEach((field) => {
    const current = existing?.credentials?.[field.key];
    if (field.type === "password") {
      next[field.key] = "";
      return;
    }
    next[field.key] = current && current !== "••••••••" ? String(current) : "";
  });
  return next;
}

export default function PaymentProviderConnectView({
  catalogItem,
  existing,
  saving = false,
  disconnecting = false,
  onCancel,
  onConnect,
  onDisconnect,
}: PaymentProviderConnectViewProps) {
  const { t, i18n } = useTranslation();
  const pageDir = getTextDirection(i18n.language);
  const [credentials, setCredentials] = useState<SitePaymentCredentials>(() =>
    emptyCredentialsFromFields(catalogItem, existing)
  );
  const [installmentsEnabled, setInstallmentsEnabled] = useState(
    Boolean(existing?.installmentsEnabled)
  );
  const [mode, setMode] = useState<"test" | "live">(
    existing?.mode === "live" ? "live" : "live"
  );
  const [showPassword, setShowPassword] = useState(false);

  const hasStoredSecret = providerHasStoredSecret(existing);
  const isEditing = Boolean(
    existing &&
      existing.connectionStatus === "connected" &&
      existing.isEnabled !== false
  );

  const canSubmit = useMemo(() => {
    return catalogItem.fields.every((field) => {
      if (!field.required) return true;
      const value = String(credentials[field.key] || "").trim();
      if (field.type === "password" && !value && hasStoredSecret) return true;
      return Boolean(value);
    });
  }, [catalogItem.fields, credentials, hasStoredSecret]);

  function updateField(key: keyof SitePaymentCredentials, value: string) {
    setCredentials((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit || saving) return;
    onConnect({ credentials, installmentsEnabled, mode });
  }

  const description = t(`payments.providers.${catalogItem.key}.description`, {
    defaultValue: catalogItem.description,
  });
  const instructions = [1, 2, 3].map((n) =>
    t(`payments.providers.${catalogItem.key}.step${n}`, {
      defaultValue: catalogItem.instructions[n - 1] || "",
    })
  ).filter(Boolean);

  return (
    <form dir={pageDir} onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-wrap items-start gap-3">
        <div
          className="grid h-12 w-12 shrink-0 place-items-center rounded-xl text-xs font-bold text-white"
          style={{ background: catalogItem.accent }}
        >
          {catalogItem.logoText}
        </div>
        <div className="min-w-0 flex-1">
          <button
            type="button"
            onClick={onCancel}
            className="mb-2 inline-flex items-center gap-1 text-sm font-semibold text-sky-700 hover:text-sky-800"
          >
            <ArrowRight size={16} />
            {t("payments.gallery.back")}
          </button>
          <h2 className="text-xl font-bold text-slate-900">
            {t("payments.gallery.connectTitle", { name: catalogItem.name })}
          </h2>
          <p className="mt-0.5 text-sm text-slate-500">{description}</p>
        </div>
      </div>

      <SitePanelCard>
        <h3 className="text-sm font-bold text-slate-900">
          {t("payments.gallery.instructions")}
        </h3>
        <div className="mt-3 space-y-2 text-sm text-slate-600">
          {instructions.map((step, index) => (
            <div key={step} className="flex items-start gap-2">
              <span className="mt-0.5 w-5 shrink-0 font-semibold text-slate-800">
                {index + 1}.
              </span>
              <p className="min-w-0 flex-1 leading-relaxed">{step}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap justify-start gap-3 text-sm">
          {catalogItem.contactUrl ? (
            <a
              href={catalogItem.contactUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-semibold text-sky-700 hover:text-sky-800"
            >
              {t("payments.gallery.contact", { name: catalogItem.name })}
              <ExternalLink size={13} />
            </a>
          ) : null}
          {catalogItem.createAccountUrl ? (
            <a
              href={catalogItem.createAccountUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-semibold text-sky-700 hover:text-sky-800"
            >
              {t("payments.gallery.createAccount", { name: catalogItem.name })}
              <ExternalLink size={13} />
            </a>
          ) : null}
        </div>

        <div className="mt-4 flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5 text-sm text-amber-900">
          <AlertTriangle size={16} className="mt-0.5 shrink-0" />
          <p className="min-w-0 flex-1">{t("payments.gallery.currencyNote")}</p>
        </div>
      </SitePanelCard>

      <SitePanelCard>
        <h3 className="text-sm font-bold text-slate-900">
          {t("payments.gallery.accountDetails")}
        </h3>
        <div className="mt-4 space-y-3">
          {catalogItem.fields.map((field) => {
            const isPassword = field.type === "password";
            return (
              <label key={field.key} className="block">
                <span className="mb-1.5 block text-xs font-semibold text-slate-600">
                  {t(`payments.fields.${field.key}`, { defaultValue: field.label })}
                  {field.required ? (
                    <span className="text-rose-500"> *</span>
                  ) : null}
                </span>
                <div className="relative">
                  <input
                    type={
                      isPassword
                        ? showPassword
                          ? "text"
                          : "password"
                        : field.type || "text"
                    }
                    dir={pageDir}
                    value={String(credentials[field.key] || "")}
                    onChange={(e) => updateField(field.key, e.target.value)}
                    placeholder={
                      isPassword && hasStoredSecret
                        ? t("payments.fields.keepSecret", {
                            defaultValue: field.keepOnEmptyHint || "••••••••",
                          })
                        : field.placeholder
                    }
                    className={inputBase}
                    autoComplete={isPassword ? "new-password" : "off"}
                  />
                  {isPassword ? (
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute end-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-500"
                    >
                      {showPassword
                        ? t("payments.gallery.hide")
                        : t("payments.gallery.show")}
                    </button>
                  ) : null}
                </div>
              </label>
            );
          })}

          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold text-slate-600">
              {t("payments.gallery.mode")}
            </span>
            <select
              dir={pageDir}
              value={mode}
              onChange={(e) =>
                setMode(e.target.value === "test" ? "test" : "live")
              }
              className={inputBase}
            >
              <option value="live">{t("payments.gallery.liveMode")}</option>
              <option value="test">{t("payments.gallery.testMode")}</option>
            </select>
          </label>
        </div>
      </SitePanelCard>

      {catalogItem.supportsInstallments ? (
        <SitePanelCard>
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                {t("payments.gallery.installments")}
              </h3>
              <p className="mt-0.5 text-sm text-slate-500">
                {t("payments.gallery.installmentsHint")}
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={installmentsEnabled}
              onClick={() => setInstallmentsEnabled((v) => !v)}
              className={`relative h-7 w-12 shrink-0 rounded-full transition ${
                installmentsEnabled ? "bg-emerald-500" : "bg-slate-300"
              }`}
            >
              <span
                className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition ${
                  installmentsEnabled ? "start-0.5" : "start-[1.35rem]"
                }`}
              />
            </button>
          </div>
        </SitePanelCard>
      ) : null}

      <SitePanelCard>
        <h3 className="text-sm font-bold text-slate-900">
          {t("payments.gallery.availableMethods", { name: catalogItem.name })}
        </h3>
        <p className="mt-2 text-sm text-slate-500">
          {t("payments.gallery.availableHint")}
        </p>
      </SitePanelCard>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap gap-2">
          <button
            type="submit"
            disabled={!canSubmit || saving || disconnecting}
            className={btnPrimary}
          >
            {saving ? <Loader2 size={14} className="animate-spin" /> : null}
            {isEditing
              ? t("common.save", { defaultValue: "Save" })
              : t("payments.gallery.connect")}
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={saving || disconnecting}
            className={btnSecondary}
          >
            {t("payments.gallery.cancel")}
          </button>
        </div>
        <div>
          {isEditing && onDisconnect ? (
            <button
              type="button"
              onClick={onDisconnect}
              disabled={disconnecting || saving}
              className={`${btnGhost} text-rose-600 hover:border-rose-200 hover:bg-rose-50`}
            >
              {disconnecting ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Unplug size={14} />
              )}
              {t("payments.gallery.disconnect")}
            </button>
          ) : null}
        </div>
      </div>
    </form>
  );
}
