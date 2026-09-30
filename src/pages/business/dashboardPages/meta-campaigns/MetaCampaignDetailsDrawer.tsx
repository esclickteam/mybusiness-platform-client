import React, { useEffect, useMemo, useState } from "react";
import { Loader2, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import {
  duplicateMetaAd,
  duplicateMetaAdSet,
  duplicateMetaCampaign,
  getMetaCampaign,
  previewMetaAd,
  updateMetaAd,
  updateMetaAdSet,
  updateMetaCampaign,
  type MetaAdPreview,
  type MetaCampaign,
  type MetaCampaignAd,
  type MetaCampaignAdSet,
} from "../../../../api/metaCampaignsApi";
import { btnPrimary, btnSecondary } from "../../../../styles/bizuplyUi";
import { getIntlLocale } from "../../../../i18n/localeUtils";
import {
  formatCurrency,
  formatDateHe,
  formatDateTimeHe,
  formatMetricOrDash,
  formatNumber,
  formatPercent,
  metaDeliveryStatusKey,
  statusTone,
} from "./metaCampaignUtils";

type Props = {
  open: boolean;
  businessId: string;
  campaign: MetaCampaign | null;
  currency: string;
  lastSynced?: Date | null;
  canEdit: boolean;
  onClose: () => void;
  onOpenEdit: (campaignId: string) => void;
  onChanged: () => void;
};

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50/70 px-3 py-2">
      <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-semibold text-slate-900">{value || "—"}</p>
    </div>
  );
}

export default function MetaCampaignDetailsDrawer({
  open,
  businessId,
  campaign,
  currency,
  lastSynced,
  canEdit,
  onClose,
  onOpenEdit,
  onChanged,
}: Props) {
  const { t, i18n } = useTranslation();
  const locale = getIntlLocale(i18n.language);
  const [detail, setDetail] = useState<MetaCampaign | null>(campaign);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [selectedAdSet, setSelectedAdSet] = useState<MetaCampaignAdSet | null>(null);
  const [selectedAd, setSelectedAd] = useState<MetaCampaignAd | null>(null);
  const [name, setName] = useState("");
  const [dailyBudget, setDailyBudget] = useState("");
  const [adSetName, setAdSetName] = useState("");
  const [primaryText, setPrimaryText] = useState("");
  const [headline, setHeadline] = useState("");
  const [link, setLink] = useState("");
  const [cta, setCta] = useState("");
  const [previews, setPreviews] = useState<MetaAdPreview[]>([]);
  const [previewing, setPreviewing] = useState(false);

  useEffect(() => {
    if (!open || !campaign?.id) return;
    let cancelled = false;
    setLoading(true);
    getMetaCampaign(businessId, campaign.id)
      .then((res) => {
        if (cancelled) return;
        const next = res.campaign;
        setDetail(next);
        setName(next.name || "");
        setDailyBudget(next.dailyBudget ? String(next.dailyBudget) : "");
        const firstSet = next.adSets?.[0] || null;
        const firstAd = firstSet?.ads?.[0] || next.ads?.[0] || null;
        setSelectedAdSet(firstSet);
        setSelectedAd(firstAd);
        setAdSetName(firstSet?.name || "");
        setPrimaryText(firstAd?.primaryText || next.primaryText || "");
        setHeadline(firstAd?.headline || next.headline || "");
        setLink(firstAd?.link || next.link || "");
        setCta(firstAd?.callToAction || next.callToAction || "");
      })
      .catch((error: any) => {
        toast.error(
          error?.response?.data?.error ||
            error?.response?.data?.message ||
            t("metaCampaigns.errors.loadCampaign")
        );
        setDetail(campaign);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [open, businessId, campaign?.id]);

  const metrics = detail?.metrics;
  const issues = useMemo(
    () =>
      [
        ...(detail?.issues || []),
        ...(detail?.adSets || []).flatMap((row) => row.issues || []),
        ...(detail?.ads || []).flatMap((row) => row.issues || []),
      ].filter((row, index, all) => all.findIndex((item) => item.message === row.message) === index),
    [detail]
  );

  if (!open || !campaign) return null;

  const save = async () => {
    if (!canEdit || !detail) return;
    try {
      setSaving(true);
      await updateMetaCampaign(businessId, detail.id, {
        name,
        dailyBudget: dailyBudget ? Number(dailyBudget) : undefined,
        adSetId: selectedAdSet?.id,
        adSetName: adSetName || undefined,
        adId: selectedAd?.id,
        primaryText,
        headline,
        link,
        callToAction: cta,
        pageId: selectedAd?.pageId || detail.pageId,
        imageHash: selectedAd?.imageHash || detail.imageHash,
      });
      if (selectedAdSet?.id && adSetName) {
        await updateMetaAdSet(businessId, selectedAdSet.id, { name: adSetName });
      }
      if (selectedAd?.id) {
        await updateMetaAd(businessId, selectedAd.id, {
          primaryText,
          headline,
          link,
          callToAction: cta,
          pageId: selectedAd.pageId || detail.pageId,
          imageHash: selectedAd.imageHash || detail.imageHash,
        });
      }
      toast.success(t("metaCampaigns.toasts.saved"));
      onChanged();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.error ||
          error?.response?.data?.message ||
          t("metaCampaigns.errors.updateCampaign")
      );
    } finally {
      setSaving(false);
    }
  };

  const loadPreview = async () => {
    if (!detail) return;
    try {
      setPreviewing(true);
      const formats = selectedAd?.instagramUserId
        ? ["MOBILE_FEED_STANDARD", "INSTAGRAM_STANDARD"]
        : ["MOBILE_FEED_STANDARD"];
      const res = await previewMetaAd(businessId, {
        adId: selectedAd?.id,
        creativeId: detail.creativeId,
        adFormats: formats,
        pageId: selectedAd?.pageId || detail.pageId,
        primaryText,
        headline,
        link,
        callToAction: cta,
        imageHash: selectedAd?.imageHash || detail.imageHash,
      });
      setPreviews(res.previews || (res.preview ? [res.preview] : []));
    } catch (error: any) {
      toast.error(
        error?.response?.data?.error ||
          error?.response?.data?.message ||
          t("metaCampaigns.preview.failed")
      );
    } finally {
      setPreviewing(false);
    }
  };

  const duplicate = async (kind: "campaign" | "adset" | "ad") => {
    if (!canEdit || !detail) return;
    const ok = window.confirm(t("metaCampaigns.manager.duplicateConfirm", { kind }));
    if (!ok) return;
    try {
      setSaving(true);
      if (kind === "campaign") await duplicateMetaCampaign(businessId, detail.id);
      if (kind === "adset" && selectedAdSet?.id) {
        await duplicateMetaAdSet(businessId, selectedAdSet.id, detail.id);
      }
      if (kind === "ad" && selectedAd?.id) {
        await duplicateMetaAd(businessId, selectedAd.id, selectedAdSet?.id);
      }
      toast.success(t("metaCampaigns.manager.duplicatedPaused"));
      onChanged();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.error ||
          error?.response?.data?.message ||
          t("metaCampaigns.errors.duplicate")
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex justify-end bg-slate-950/40" data-testid="campaign-details-drawer">
      <button type="button" className="h-full flex-1" aria-label={t("metaCampaigns.details.close")} onClick={onClose} />
      <aside className="flex h-full w-full max-w-xl flex-col overflow-y-auto bg-white shadow-2xl sm:max-w-2xl">
        <div className="sticky top-0 z-10 flex items-start justify-between gap-3 border-b border-slate-100 bg-white px-4 py-3">
          <div>
            <p className="text-[11px] font-black uppercase tracking-wide text-violet-700">
              {t("metaCampaigns.details.badge")}
            </p>
            <h2 className="text-lg font-black text-slate-900">{detail?.name || campaign.name}</h2>
            <p className="text-xs text-slate-500">
              {t("metaCampaigns.overview.lastSynced", {
                time: lastSynced ? formatDateTimeHe(lastSynced, locale) : "—",
              })}
            </p>
          </div>
          <button type="button" className="rounded-md p-1 text-slate-500 hover:bg-slate-100" onClick={onClose}>
            <X className="h-4 w-4" />
          </button>
        </div>

        {loading ? (
          <div className="flex flex-1 items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-violet-600" />
          </div>
        ) : (
          <div className="space-y-5 px-4 py-4">
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              <Field label={t("metaCampaigns.table.status")} value={
                <span className={statusTone(detail?.effectiveStatus || detail?.status || "")}>
                  {t(`metaCampaigns.status.${metaDeliveryStatusKey(detail?.deliveryStatus || detail?.effectiveStatus || detail?.status)}`)}
                </span>
              } />
              <Field label={t("metaCampaigns.manager.configured")} value={detail?.configuredStatus || detail?.status} />
              <Field label={t("metaCampaigns.table.objective")} value={detail?.objective} />
              <Field
                label={t("metaCampaigns.table.budget")}
                value={
                  detail?.dailyBudget
                    ? `${formatCurrency(detail.dailyBudget, currency)} / ${t("metaCampaigns.table.budgetDaily")}`
                    : detail?.lifetimeBudget
                      ? formatCurrency(detail.lifetimeBudget, currency)
                      : "—"
                }
              />
              <Field label={t("metaCampaigns.table.spend")} value={formatMetricOrDash(metrics?.spend, (n) => formatCurrency(n, currency))} />
              <Field label={t("metaCampaigns.table.results")} value={formatMetricOrDash(metrics?.results || metrics?.leads, formatNumber)} />
              <Field label={t("metaCampaigns.table.costPerResult")} value={formatMetricOrDash(metrics?.costPerResult || metrics?.costPerLead, (n) => formatCurrency(n, currency))} />
              <Field label={t("metaCampaigns.table.reach")} value={formatMetricOrDash(metrics?.reach, formatNumber)} />
              <Field label={t("metaCampaigns.table.impressions")} value={formatMetricOrDash(metrics?.impressions, formatNumber)} />
              <Field label={t("metaCampaigns.table.frequency")} value={formatMetricOrDash(metrics?.frequency, (n) => n.toFixed(2))} />
              <Field label={t("metaCampaigns.table.clicks")} value={formatMetricOrDash(metrics?.clicks, formatNumber)} />
              <Field label={t("metaCampaigns.table.linkClicks")} value={formatMetricOrDash(metrics?.linkClicks, formatNumber)} />
              <Field label={t("metaCampaigns.table.ctr")} value={formatMetricOrDash(metrics?.ctr, (n) => formatPercent(n))} />
              <Field label={t("metaCampaigns.table.cpc")} value={formatMetricOrDash(metrics?.cpc, (n) => formatCurrency(n, currency))} />
              <Field label={t("metaCampaigns.table.cpm")} value={formatMetricOrDash(metrics?.cpm, (n) => formatCurrency(n, currency))} />
              <Field label={t("metaCampaigns.table.start")} value={formatDateHe(detail?.startTime, locale)} />
              <Field label={t("metaCampaigns.table.end")} value={formatDateHe(detail?.stopTime, locale)} />
            </div>

            {issues.length ? (
              <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
                {issues.map((issue) => (
                  <p key={issue.message}>{issue.message}</p>
                ))}
              </div>
            ) : null}

            <section>
              <h3 className="mb-2 text-sm font-black text-slate-900">{t("metaCampaigns.manager.hierarchy")}</h3>
              <div className="space-y-2">
                {(detail?.adSets || []).map((adSet) => (
                  <div key={adSet.id} className="rounded-xl border border-slate-200">
                    <button
                      type="button"
                      className={`flex w-full items-center justify-between px-3 py-2 text-start text-sm font-semibold ${selectedAdSet?.id === adSet.id ? "bg-violet-50" : ""}`}
                      onClick={() => {
                        setSelectedAdSet(adSet);
                        setAdSetName(adSet.name || "");
                      }}
                    >
                      <span>{adSet.name}</span>
                      <span className="text-xs text-slate-500">{adSet.effectiveStatus || adSet.status}</span>
                    </button>
                    <div className="border-t border-slate-100 px-3 py-2">
                      {(adSet.ads || []).map((ad) => (
                        <button
                          key={ad.id}
                          type="button"
                          className={`mb-1 block w-full rounded-lg px-2 py-1.5 text-start text-sm ${selectedAd?.id === ad.id ? "bg-slate-100" : ""}`}
                          onClick={() => {
                            setSelectedAd(ad);
                            setPrimaryText(ad.primaryText || "");
                            setHeadline(ad.headline || "");
                            setLink(ad.link || "");
                            setCta(ad.callToAction || "");
                          }}
                        >
                          {ad.name || ad.headline || ad.id}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {canEdit ? (
              <section className="space-y-3">
                <h3 className="text-sm font-black text-slate-900">{t("metaCampaigns.manager.edit")}</h3>
                <label className="block text-sm">
                  <span className="font-semibold text-slate-600">{t("metaCampaigns.form.name")}</span>
                  <input className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2" value={name} onChange={(e) => setName(e.target.value)} />
                </label>
                <label className="block text-sm">
                  <span className="font-semibold text-slate-600">{t("metaCampaigns.table.budgetDaily")}</span>
                  <input className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2" value={dailyBudget} onChange={(e) => setDailyBudget(e.target.value)} />
                </label>
                <label className="block text-sm">
                  <span className="font-semibold text-slate-600">{t("metaCampaigns.manager.adSetName")}</span>
                  <input className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2" value={adSetName} onChange={(e) => setAdSetName(e.target.value)} />
                </label>
                <label className="block text-sm">
                  <span className="font-semibold text-slate-600">{t("metaCampaigns.form.primaryText")}</span>
                  <textarea className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2" rows={3} value={primaryText} onChange={(e) => setPrimaryText(e.target.value)} />
                </label>
                <label className="block text-sm">
                  <span className="font-semibold text-slate-600">{t("metaCampaigns.form.headline")}</span>
                  <input className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2" value={headline} onChange={(e) => setHeadline(e.target.value)} />
                </label>
                <label className="block text-sm">
                  <span className="font-semibold text-slate-600">{t("metaCampaigns.form.link")}</span>
                  <input className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2" value={link} onChange={(e) => setLink(e.target.value)} />
                </label>
                <label className="block text-sm">
                  <span className="font-semibold text-slate-600">{t("metaCampaigns.form.cta")}</span>
                  <input className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2" value={cta} onChange={(e) => setCta(e.target.value)} />
                </label>
                <div className="flex flex-wrap gap-2">
                  <button type="button" className={btnPrimary} disabled={saving} onClick={() => void save()}>
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : t("metaCampaigns.actions.save")}
                  </button>
                  <button type="button" className={btnSecondary} onClick={() => onOpenEdit(detail?.id || campaign.id)}>
                    {t("metaCampaigns.actions.editFull")}
                  </button>
                  <button type="button" className={btnSecondary} disabled={previewing} onClick={() => void loadPreview()}>
                    {t("metaCampaigns.preview.action")}
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button type="button" className={btnSecondary} onClick={() => void duplicate("campaign")}>
                    {t("metaCampaigns.manager.duplicateCampaign")}
                  </button>
                  <button type="button" className={btnSecondary} onClick={() => void duplicate("adset")}>
                    {t("metaCampaigns.manager.duplicateAdSet")}
                  </button>
                  <button type="button" className={btnSecondary} onClick={() => void duplicate("ad")}>
                    {t("metaCampaigns.manager.duplicateAd")}
                  </button>
                </div>
              </section>
            ) : (
              <p className="text-sm text-slate-500">{t("metaCampaigns.manager.viewOnly")}</p>
            )}

            {previews.length ? (
              <section className="space-y-3">
                <h3 className="text-sm font-black text-slate-900">{t("metaCampaigns.preview.title")}</h3>
                {previews.map((preview, index) => (
                  <div key={`${preview.adFormat || index}`} className="overflow-hidden rounded-xl border border-slate-200">
                    <p className="bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-500">{preview.adFormat}</p>
                    {preview.body ? (
                      <div className="p-2" dangerouslySetInnerHTML={{ __html: preview.body }} />
                    ) : null}
                  </div>
                ))}
              </section>
            ) : selectedAd?.imageUrl || detail?.imageUrl ? (
              <section className="rounded-xl border border-slate-200 p-3">
                <p className="text-sm font-semibold text-slate-900">{headline || detail?.headline}</p>
                <p className="mt-1 text-sm text-slate-600">{primaryText || detail?.primaryText}</p>
                <img
                  src={selectedAd?.imageUrl || detail?.imageUrl}
                  alt=""
                  className="mt-3 max-h-56 w-full rounded-lg object-cover"
                />
                <p className="mt-2 text-xs text-slate-500">{link || detail?.link}</p>
              </section>
            ) : null}
          </div>
        )}
      </aside>
    </div>
  );
}
