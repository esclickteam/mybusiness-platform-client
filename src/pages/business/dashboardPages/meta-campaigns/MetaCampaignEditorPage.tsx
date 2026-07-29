import React, { useEffect, useMemo, useState } from "react";
import {
  Link,
  useNavigate,
  useOutletContext,
  useParams,
} from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import {
  ArrowRight,
  Loader2,
  Pause,
  Play,
  Save,
  Trash2,
} from "lucide-react";
import {
  createMetaCampaign,
  deleteMetaCampaign,
  getMetaCampaign,
  getMetaCampaignsStatus,
  setMetaCampaignStatus,
  updateMetaCampaign,
  type MetaAdsConnectionStatus,
  type MetaCampaign,
} from "../../../../api/metaCampaignsApi";
import BizuplyLoader from "../../../../components/ui/BizuplyLoader";
import {
  btnGhost,
  btnPrimary,
  btnSecondary,
  cardBase,
  inputBase,
} from "../../../../styles/bizuplyUi";
import { formatCurrency, OBJECTIVE_OPTIONS, statusTone } from "./metaCampaignUtils";

type OutletCtx = { businessId: string | null };

type FormState = {
  name: string;
  objective: string;
  status: string;
  dailyBudget: string;
  lifetimeBudget: string;
  specialAdCategories: string[];
  startTime: string;
  stopTime: string;
  bidStrategy: string;
};

const EMPTY_FORM: FormState = {
  name: "",
  objective: "OUTCOME_LEADS",
  status: "PAUSED",
  dailyBudget: "",
  lifetimeBudget: "",
  specialAdCategories: [],
  startTime: "",
  stopTime: "",
  bidStrategy: "",
};

function toInputDate(value?: string | null) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 16);
}

function campaignToForm(campaign: MetaCampaign): FormState {
  return {
    name: campaign.name || "",
    objective: campaign.objective || "OUTCOME_LEADS",
    status: campaign.status || "PAUSED",
    dailyBudget: campaign.dailyBudget ? String(campaign.dailyBudget) : "",
    lifetimeBudget: campaign.lifetimeBudget
      ? String(campaign.lifetimeBudget)
      : "",
    specialAdCategories: campaign.specialAdCategories || [],
    startTime: toInputDate(campaign.startTime),
    stopTime: toInputDate(campaign.stopTime),
    bidStrategy: campaign.bidStrategy || "",
  };
}

export default function MetaCampaignEditorPage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { businessId } = useOutletContext<OutletCtx>();
  const { businessId: urlBusinessId, campaignId } = useParams<{
    businessId: string;
    campaignId?: string;
  }>();
  const isEdit = Boolean(campaignId);
  const basePath = `/business/${urlBusinessId || businessId}/dashboard/meta-campaigns`;

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [statusBusy, setStatusBusy] = useState(false);
  const [connection, setConnection] = useState<MetaAdsConnectionStatus | null>(
    null
  );
  const [campaign, setCampaign] = useState<MetaCampaign | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);

  const currency =
    connection?.selectedAdAccount?.currency ||
    "ILS";

  const objectives = useMemo(() => {
    if (connection?.objectives?.length) {
      return connection.objectives.map((item) => ({
        value: item.value,
        label:
          i18n.language?.startsWith("he") ? item.labelHe : item.labelEn,
      }));
    }
    return OBJECTIVE_OPTIONS.map((item) => ({
      value: item.value,
      label: t(item.labelKey),
    }));
  }, [connection?.objectives, i18n.language, t]);

  const specialCategories = useMemo(() => {
    if (connection?.specialAdCategories?.length) {
      return connection.specialAdCategories
        .filter((item) => item.value !== "NONE")
        .map((item) => ({
          value: item.value,
          label:
            i18n.language?.startsWith("he") ? item.labelHe : item.labelEn,
        }));
    }
    return [
      { value: "HOUSING", label: t("metaCampaigns.special.housing") },
      { value: "EMPLOYMENT", label: t("metaCampaigns.special.employment") },
      {
        value: "FINANCIAL_PRODUCTS_SERVICES",
        label: t("metaCampaigns.special.financial"),
      },
    ];
  }, [connection?.specialAdCategories, i18n.language, t]);

  useEffect(() => {
    const boot = async () => {
      if (!businessId) return;
      try {
        if (!isEdit) setLoading(true);
        const status = await getMetaCampaignsStatus(businessId);
        setConnection(status);

        if (!status.connected) {
          toast.info(t("metaCampaigns.empty.notConnectedBody"));
          navigate(`${basePath}/settings`, { replace: true });
          return;
        }

        if (isEdit && campaignId) {
          const detail = await getMetaCampaign(businessId, campaignId, {
            days: 30,
          });
          setCampaign(detail.campaign);
          setForm(campaignToForm(detail.campaign));
          if (detail.connection) setConnection(detail.connection);
        }
      } catch (error: any) {
        toast.error(
          error?.response?.data?.error ||
            error?.response?.data?.message ||
            t("metaCampaigns.errors.loadCampaign")
        );
      } finally {
        setLoading(false);
      }
    };
    boot();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [businessId, campaignId, isEdit]);

  const updateField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const toggleCategory = (value: string) => {
    setForm((prev) => {
      const exists = prev.specialAdCategories.includes(value);
      return {
        ...prev,
        specialAdCategories: exists
          ? prev.specialAdCategories.filter((item) => item !== value)
          : [...prev.specialAdCategories, value],
      };
    });
  };

  const buildPayload = () => {
    const dailyBudget = form.dailyBudget
      ? Number(form.dailyBudget)
      : null;
    const lifetimeBudget = form.lifetimeBudget
      ? Number(form.lifetimeBudget)
      : null;

    return {
      name: form.name.trim(),
      objective: form.objective,
      status: form.status,
      dailyBudget,
      lifetimeBudget: dailyBudget ? null : lifetimeBudget,
      specialAdCategories: form.specialAdCategories,
      startTime: form.startTime
        ? new Date(form.startTime).toISOString()
        : null,
      stopTime: form.stopTime ? new Date(form.stopTime).toISOString() : null,
      bidStrategy: form.bidStrategy || undefined,
    };
  };

  const save = async () => {
    if (!businessId) return;
    if (!form.name.trim()) {
      toast.error(t("metaCampaigns.form.nameRequired"));
      return;
    }

    try {
      setSaving(true);
      const payload = buildPayload();
      if (isEdit && campaignId) {
        const result = await updateMetaCampaign(businessId, campaignId, payload);
        setCampaign(result.campaign);
        setForm(campaignToForm(result.campaign));
        toast.success(t("metaCampaigns.toasts.updated"));
      } else {
        const result = await createMetaCampaign(businessId, payload);
        toast.success(t("metaCampaigns.toasts.created"));
        navigate(`${basePath}/edit/${result.campaign.id}`, { replace: true });
      }
    } catch (error: any) {
      toast.error(
        error?.response?.data?.error ||
          error?.response?.data?.message ||
          t("metaCampaigns.errors.saveCampaign")
      );
    } finally {
      setSaving(false);
    }
  };

  const toggleStatus = async () => {
    if (!businessId || !campaignId || !campaign) return;
    const next =
      String(campaign.effectiveStatus || campaign.status).toUpperCase() ===
      "ACTIVE"
        ? "PAUSED"
        : "ACTIVE";
    try {
      setStatusBusy(true);
      const result = await setMetaCampaignStatus(businessId, campaignId, next);
      setCampaign(result.campaign);
      setForm((prev) => ({ ...prev, status: result.campaign.status }));
      toast.success(
        next === "ACTIVE"
          ? t("metaCampaigns.toasts.activated")
          : t("metaCampaigns.toasts.paused")
      );
    } catch (error: any) {
      toast.error(
        error?.response?.data?.error ||
          error?.response?.data?.message ||
          t("metaCampaigns.errors.updateStatus")
      );
    } finally {
      setStatusBusy(false);
    }
  };

  const remove = async () => {
    if (!businessId || !campaignId) return;
    if (!window.confirm(t("metaCampaigns.form.confirmDelete"))) return;
    try {
      setSaving(true);
      await deleteMetaCampaign(businessId, campaignId);
      toast.success(t("metaCampaigns.toasts.deleted"));
      navigate(`${basePath}/overview`);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.error ||
          error?.response?.data?.message ||
          t("metaCampaigns.errors.deleteCampaign")
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <BizuplyLoader />
      </div>
    );
  }

  const tone = statusTone(campaign?.effectiveStatus || form.status);
  const isActive =
    String(campaign?.effectiveStatus || form.status).toUpperCase() === "ACTIVE";

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            to={`${basePath}/overview`}
            className="inline-flex items-center gap-1 text-xs font-black text-violet-700 hover:underline"
          >
            <ArrowRight className="h-3.5 w-3.5 rotate-180" />
            {t("metaCampaigns.form.back")}
          </Link>
          <h2 className="mt-1 text-xl font-black text-slate-900">
            {isEdit
              ? t("metaCampaigns.form.editTitle")
              : t("metaCampaigns.form.createTitle")}
          </h2>
          <p className="mt-0.5 text-sm font-semibold text-slate-500">
            {t("metaCampaigns.form.subtitle")}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {isEdit ? (
            <>
              <span
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-black ${tone.bg} ${tone.text} ${tone.border}`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${tone.dot}`} />
                {campaign?.effectiveStatus || form.status}
              </span>
              <button
                type="button"
                onClick={toggleStatus}
                disabled={statusBusy}
                className={btnSecondary}
              >
                {statusBusy ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : isActive ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
                {isActive
                  ? t("metaCampaigns.actions.pause")
                  : t("metaCampaigns.actions.activate")}
              </button>
              <button
                type="button"
                onClick={remove}
                disabled={saving}
                className={btnGhost}
              >
                <Trash2 className="h-4 w-4" />
                {t("metaCampaigns.actions.delete")}
              </button>
            </>
          ) : null}
          <button
            type="button"
            onClick={save}
            disabled={saving}
            className={btnPrimary}
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {isEdit
              ? t("metaCampaigns.form.save")
              : t("metaCampaigns.form.create")}
          </button>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_300px]">
        <div className="space-y-4">
          <div className={`${cardBase} p-4 sm:p-5`}>
            <p className="text-sm font-black text-slate-900">
              {t("metaCampaigns.form.basics")}
            </p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <label className="sm:col-span-2 block">
                <span className="mb-1.5 block text-xs font-black text-slate-500">
                  {t("metaCampaigns.form.name")}
                </span>
                <input
                  className={inputBase}
                  value={form.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  placeholder={t("metaCampaigns.form.namePlaceholder")}
                />
              </label>

              <label className="block">
                <span className="mb-1.5 block text-xs font-black text-slate-500">
                  {t("metaCampaigns.form.objective")}
                </span>
                <select
                  className={inputBase}
                  value={form.objective}
                  onChange={(e) => updateField("objective", e.target.value)}
                  disabled={isEdit}
                >
                  {objectives.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
                {isEdit ? (
                  <span className="mt-1 block text-[11px] font-semibold text-slate-400">
                    {t("metaCampaigns.form.objectiveLocked")}
                  </span>
                ) : null}
              </label>

              <label className="block">
                <span className="mb-1.5 block text-xs font-black text-slate-500">
                  {t("metaCampaigns.form.status")}
                </span>
                <select
                  className={inputBase}
                  value={form.status}
                  onChange={(e) => updateField("status", e.target.value)}
                >
                  <option value="PAUSED">
                    {t("metaCampaigns.status.paused")}
                  </option>
                  <option value="ACTIVE">
                    {t("metaCampaigns.status.active")}
                  </option>
                </select>
              </label>
            </div>
          </div>

          <div className={`${cardBase} p-4 sm:p-5`}>
            <p className="text-sm font-black text-slate-900">
              {t("metaCampaigns.form.budgetTitle")}
            </p>
            <p className="mt-1 text-xs font-semibold text-slate-500">
              {t("metaCampaigns.form.budgetHint")}
            </p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1.5 block text-xs font-black text-slate-500">
                  {t("metaCampaigns.form.dailyBudget")}
                </span>
                <input
                  type="number"
                  min="0"
                  step="1"
                  className={inputBase}
                  value={form.dailyBudget}
                  onChange={(e) => updateField("dailyBudget", e.target.value)}
                  placeholder="150"
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-xs font-black text-slate-500">
                  {t("metaCampaigns.form.lifetimeBudget")}
                </span>
                <input
                  type="number"
                  min="0"
                  step="1"
                  className={inputBase}
                  value={form.lifetimeBudget}
                  onChange={(e) =>
                    updateField("lifetimeBudget", e.target.value)
                  }
                  placeholder="3000"
                  disabled={Boolean(form.dailyBudget)}
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-xs font-black text-slate-500">
                  {t("metaCampaigns.form.startTime")}
                </span>
                <input
                  type="datetime-local"
                  className={inputBase}
                  value={form.startTime}
                  onChange={(e) => updateField("startTime", e.target.value)}
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-xs font-black text-slate-500">
                  {t("metaCampaigns.form.stopTime")}
                </span>
                <input
                  type="datetime-local"
                  className={inputBase}
                  value={form.stopTime}
                  onChange={(e) => updateField("stopTime", e.target.value)}
                />
              </label>
            </div>
          </div>

          <div className={`${cardBase} p-4 sm:p-5`}>
            <p className="text-sm font-black text-slate-900">
              {t("metaCampaigns.form.specialTitle")}
            </p>
            <p className="mt-1 text-xs font-semibold text-slate-500">
              {t("metaCampaigns.form.specialHint")}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {specialCategories.map((item) => {
                const active = form.specialAdCategories.includes(item.value);
                return (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => toggleCategory(item.value)}
                    className={[
                      "rounded-lg border px-3 py-2 text-xs font-black transition",
                      active
                        ? "border-violet-200 bg-violet-50 text-violet-800"
                        : "border-slate-200 bg-white text-slate-600 hover:border-violet-100",
                    ].join(" ")}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <aside className="space-y-4">
          <div className={`${cardBase} p-4`}>
            <p className="text-sm font-black text-slate-900">
              {t("metaCampaigns.form.accountCard")}
            </p>
            <p className="mt-2 text-sm font-bold text-slate-700">
              {connection?.selectedAdAccount?.name || "—"}
            </p>
            <p className="mt-1 text-xs font-semibold text-slate-500">
              {connection?.metaUserName
                ? t("metaCampaigns.form.connectedAs", {
                    name: connection.metaUserName,
                  })
                : t("metaCampaigns.form.currency", { currency })}
            </p>
            <Link
              to={`${basePath}/settings`}
              className={`${btnSecondary} mt-3 w-full`}
            >
              {t("metaCampaigns.form.manageConnection")}
            </Link>
          </div>

          {isEdit && campaign ? (
            <div className={`${cardBase} p-4`}>
              <p className="text-sm font-black text-slate-900">
                {t("metaCampaigns.form.metricsTitle")}
              </p>
              <dl className="mt-3 space-y-2 text-sm">
                <div className="flex items-center justify-between gap-3">
                  <dt className="font-semibold text-slate-500">
                    {t("metaCampaigns.table.spend")}
                  </dt>
                  <dd className="font-black text-slate-900">
                    {formatCurrency(campaign.metrics?.spend || 0, currency)}
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <dt className="font-semibold text-slate-500">
                    {t("metaCampaigns.table.leads")}
                  </dt>
                  <dd className="font-black text-slate-900">
                    {campaign.metrics?.leads || 0}
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <dt className="font-semibold text-slate-500">
                    {t("metaCampaigns.table.cpl")}
                  </dt>
                  <dd className="font-black text-slate-900">
                    {formatCurrency(
                      campaign.metrics?.costPerLead || 0,
                      currency
                    )}
                  </dd>
                </div>
              </dl>
            </div>
          ) : (
            <div className={`${cardBase} p-4`}>
              <p className="text-sm font-black text-slate-900">
                {t("metaCampaigns.form.tipsTitle")}
              </p>
              <ul className="mt-3 space-y-2 text-xs font-semibold leading-relaxed text-slate-500">
                <li>{t("metaCampaigns.form.tip1")}</li>
                <li>{t("metaCampaigns.form.tip2")}</li>
                <li>{t("metaCampaigns.form.tip3")}</li>
              </ul>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
