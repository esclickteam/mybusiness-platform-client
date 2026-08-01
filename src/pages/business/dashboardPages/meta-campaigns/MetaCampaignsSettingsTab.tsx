import React, { useEffect, useState } from "react";
import { useOutletContext, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import {
  CheckCircle2,
  Facebook,
  Loader2,
  Plug,
  RefreshCw,
  Unplug,
} from "lucide-react";
import {
  disconnectMetaAds,
  getMetaCampaignsAuthUrl,
  getMetaCampaignsStatus,
  refreshMetaAdAccounts,
  selectMetaAdAccount,
  selectMetaAdsPage,
  type MetaAdsConnectionStatus,
} from "../../../../api/metaCampaignsApi";
import MetaBillingAccountCards from "../../../../components/meta/MetaBillingAccountCards";
import BizuplyLoader from "../../../../components/ui/BizuplyLoader";
import {
  isAdminUser,
  setAdminActiveBusinessId,
} from "../../../../utils/adminTenant";
import { useAuth } from "../../../../context/AuthContext";
import {
  btnPrimary,
  btnSecondary,
  cardBase,
  inputBase,
} from "../../../../styles/bizuplyUi";
import {
  formatAdAccountLabel,
  resolveAdAccountId,
  resolveMetaAccountStatus,
} from "./metaCampaignUtils";

type OutletCtx = { businessId: string | null };

export default function MetaCampaignsSettingsTab() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { businessId } = useOutletContext<OutletCtx>();
  const [searchParams, setSearchParams] = useSearchParams();

  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<MetaAdsConnectionStatus | null>(null);
  const [selectedAccountId, setSelectedAccountId] = useState("");
  const [selectedPageId, setSelectedPageId] = useState("");

  const load = async () => {
    if (!businessId) return;
    setLoading(true);
    try {
      if (isAdminUser(user) && businessId) {
        setAdminActiveBusinessId(businessId);
      }
      const data = await getMetaCampaignsStatus(businessId);
      setStatus(data);
      setSelectedAccountId(data.selectedAdAccount?.id || "");
      setSelectedPageId(data.selectedPage?.pageId || "");
    } catch (error: any) {
      toast.error(
        error?.response?.data?.error ||
          error?.response?.data?.message ||
          t("metaCampaigns.errors.loadSettings")
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [businessId]);

  useEffect(() => {
    const connected = searchParams.get("meta_ads_connected");
    const error = searchParams.get("meta_ads_error");
    if (!connected && !error) return;

    if (connected) {
      toast.success(t("metaCampaigns.toasts.connected"));
    }
    if (error) {
      toast.error(error);
    }

    const next = new URLSearchParams(searchParams);
    next.delete("meta_ads_connected");
    next.delete("meta_ads_error");
    setSearchParams(next, { replace: true });
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const connect = async () => {
    if (!businessId) return;
    try {
      setBusy(true);
      if (isAdminUser(user) && businessId) {
        setAdminActiveBusinessId(businessId);
      }
      const data = await getMetaCampaignsAuthUrl(businessId);
      if (!data?.url) {
        throw new Error(t("metaCampaigns.errors.authUrl"));
      }
      window.location.href = data.url;
    } catch (error: any) {
      toast.error(
        error?.response?.data?.error ||
          error?.response?.data?.message ||
          error?.message ||
          t("metaCampaigns.errors.authUrl")
      );
      setBusy(false);
    }
  };

  const saveAccount = async () => {
    if (!businessId || !selectedAccountId) {
      toast.error(t("metaCampaigns.settings.selectAccountRequired"));
      return;
    }
    try {
      setBusy(true);
      const data = await selectMetaAdAccount(businessId, selectedAccountId);
      setStatus(data);
      toast.success(t("metaCampaigns.toasts.accountSelected"));
    } catch (error: any) {
      toast.error(
        error?.response?.data?.error ||
          error?.response?.data?.message ||
          t("metaCampaigns.errors.selectAccount")
      );
    } finally {
      setBusy(false);
    }
  };

  const savePage = async () => {
    if (!businessId || !selectedPageId) return;
    try {
      setBusy(true);
      const data = await selectMetaAdsPage(businessId, selectedPageId);
      setStatus(data);
      toast.success(t("metaCampaigns.toasts.pageSelected"));
    } catch (error: any) {
      toast.error(
        error?.response?.data?.error ||
          error?.response?.data?.message ||
          t("metaCampaigns.errors.selectPage")
      );
    } finally {
      setBusy(false);
    }
  };


  const refresh = async () => {
    if (!businessId) return;
    try {
      setBusy(true);
      const data = await refreshMetaAdAccounts(businessId);
      setStatus(data);
      toast.success(t("metaCampaigns.toasts.refreshed"));
    } catch (error: any) {
      toast.error(
        error?.response?.data?.error ||
          error?.response?.data?.message ||
          t("metaCampaigns.errors.refresh")
      );
    } finally {
      setBusy(false);
    }
  };

  const disconnect = async () => {
    if (!businessId) return;
    if (!window.confirm(t("metaCampaigns.settings.confirmDisconnect"))) return;
    try {
      setBusy(true);
      const data = await disconnectMetaAds(businessId);
      setStatus(data);
      setSelectedAccountId("");
      setSelectedPageId("");
      toast.success(t("metaCampaigns.toasts.disconnected"));
    } catch (error: any) {
      toast.error(
        error?.response?.data?.error ||
          error?.response?.data?.message ||
          t("metaCampaigns.errors.disconnect")
      );
    } finally {
      setBusy(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <BizuplyLoader />
      </div>
    );
  }

  const isLinked = Boolean(status?.isConnected && status?.hasAccessToken);
  const hasAccount = Boolean(status?.selectedAdAccount?.id);
  const selectedAccountStatus = resolveMetaAccountStatus(
    (status?.adAccounts || []).find(
      (account) => account.id === status?.selectedAdAccount?.id
    )?.accountStatus ?? status?.selectedAdAccount?.accountStatus
  );
  const selectedAccountStatusLabel = t(
    `metaCampaigns.accountStatus.${selectedAccountStatus.key}`,
    { defaultValue: selectedAccountStatus.labelEn }
  );

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <div className={`${cardBase} p-5`}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-violet-700">
              <Facebook className="h-3.5 w-3.5" />
              {t("metaCampaigns.settings.badge")}
            </p>
            <h2 className="mt-2 text-xl font-black text-slate-900">
              {t("metaCampaigns.settings.title")}
            </h2>
            <p className="mt-1 text-sm font-semibold text-slate-500">
              {t("metaCampaigns.settings.subtitle")}
            </p>
          </div>
          {isLinked ? (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-xs font-black text-emerald-700">
              <CheckCircle2 className="h-3.5 w-3.5" />
              {t("metaCampaigns.settings.connected")}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-black text-slate-600">
              <Plug className="h-3.5 w-3.5" />
              {t("metaCampaigns.settings.disconnected")}
            </span>
          )}
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={connect}
            disabled={busy}
            className={btnPrimary}
          >
            {busy ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Facebook className="h-4 w-4" />
            )}
            {isLinked
              ? t("metaCampaigns.settings.reconnect")
              : t("metaCampaigns.settings.connect")}
          </button>
          {isLinked ? (
            <>
              <button
                type="button"
                onClick={refresh}
                disabled={busy}
                className={btnSecondary}
              >
                <RefreshCw className="h-4 w-4" />
                {t("metaCampaigns.settings.refreshAccounts")}
              </button>
              <button
                type="button"
                onClick={disconnect}
                disabled={busy}
                className={btnSecondary}
              >
                <Unplug className="h-4 w-4" />
                {t("metaCampaigns.settings.disconnect")}
              </button>
            </>
          ) : null}
        </div>

        {status?.metaUserName ? (
          <p className="mt-4 text-sm font-bold text-slate-600">
            {t("metaCampaigns.settings.connectedAs", {
              name: status.metaUserName,
            })}
          </p>
        ) : null}
        {status?.lastError ? (
          <p className="mt-2 text-sm font-semibold text-rose-600">
            {status.lastError}
          </p>
        ) : null}
      </div>

      <MetaBillingAccountCards
        adAccountBilling={status?.adAccountBillingHealth || null}
        adsSettingsPath="."
        showWaba={false}
      />

      {isLinked ? (
        <>
          <div className={`${cardBase} p-5`}>
            <p className="text-sm font-black text-slate-900">
              {t("metaCampaigns.settings.adAccountTitle")}
            </p>
            <p className="mt-1 text-xs font-semibold text-slate-500">
              {t("metaCampaigns.settings.adAccountHint")}
            </p>
            <label className="mt-4 block">
              <span className="mb-1.5 block text-xs font-black text-slate-500">
                {t("metaCampaigns.settings.adAccount")}
              </span>
              <select
                className={inputBase}
                value={selectedAccountId}
                onChange={(e) => setSelectedAccountId(e.target.value)}
              >
                <option value="">
                  {t("metaCampaigns.settings.adAccountPlaceholder")}
                </option>
                {(status?.adAccounts || []).map((account) => (
                  <option key={account.id} value={account.id}>
                    {formatAdAccountLabel(account)}
                  </option>
                ))}
              </select>
            </label>
            <button
              type="button"
              onClick={saveAccount}
              disabled={busy || !selectedAccountId}
              className={`${btnPrimary} mt-4`}
            >
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {t("metaCampaigns.settings.saveAccount")}
            </button>
            {hasAccount ? (
              <div className="mt-4 space-y-1.5 rounded-xl border border-emerald-100 bg-emerald-50/60 p-3">
                <p className="text-sm font-black text-slate-900">
                  {status?.selectedAdAccount?.name || "—"}
                  {status?.selectedAdAccount?.currency
                    ? ` (${status.selectedAdAccount.currency})`
                    : ""}
                </p>
                <p className="text-xs font-bold text-slate-600 tabular-nums">
                  {t("metaCampaigns.settings.accountId", {
                    id: resolveAdAccountId(status?.selectedAdAccount) || "—",
                  })}
                </p>
                <p className="text-xs font-bold text-slate-600">
                  {t("metaCampaigns.overview.accountStatusLabel", {
                    status: selectedAccountStatusLabel,
                  })}
                </p>
                <p className="text-xs font-black text-emerald-700">
                  {t("metaCampaigns.overview.connectedThroughMeta")}
                </p>
              </div>
            ) : null}
          </div>

          <div className={`${cardBase} p-5`}>
            <p className="text-sm font-black text-slate-900">
              {t("metaCampaigns.settings.pageTitle")}
            </p>
            <p className="mt-1 text-xs font-semibold text-slate-500">
              {t("metaCampaigns.settings.pageHint")}
            </p>
            <label className="mt-4 block">
              <span className="mb-1.5 block text-xs font-black text-slate-500">
                {t("metaCampaigns.settings.page")}
              </span>
              <select
                className={inputBase}
                value={selectedPageId}
                onChange={(e) => setSelectedPageId(e.target.value)}
              >
                <option value="">
                  {t("metaCampaigns.settings.pagePlaceholder")}
                </option>
                {(status?.pages || []).map((page) => (
                  <option key={page.id} value={page.id}>
                    {page.name}
                  </option>
                ))}
              </select>
            </label>
            <button
              type="button"
              onClick={savePage}
              disabled={busy || !selectedPageId}
              className={`${btnSecondary} mt-4`}
            >
              {t("metaCampaigns.settings.savePage")}
            </button>
          </div>

        </>
      ) : null}
    </div>
  );
}
