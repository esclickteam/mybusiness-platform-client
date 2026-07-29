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
  AppWindow,
  ArrowRight,
  CalendarRange,
  Eye,
  HeartHandshake,
  ImageIcon,
  Loader2,
  Megaphone,
  MousePointerClick,
  Pause,
  Play,
  Save,
  ShoppingBag,
  Smartphone,
  Trash2,
  Users,
} from "lucide-react";
import {
  createMetaCampaign,
  deleteMetaCampaign,
  getMetaCampaign,
  getMetaCampaignsStatus,
  previewMetaAd,
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
import {
  formatCurrency,
  OBJECTIVE_OPTIONS,
  resolveAdAccountId,
  statusTone,
} from "./metaCampaignUtils";

type OutletCtx = { businessId: string | null };
type CreateStep = 1 | 2 | 3 | 4 | 5;

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
  pageId: string;
  countries: string;
  ageMin: string;
  ageMax: string;
  primaryText: string;
  headline: string;
  description: string;
  link: string;
  imageUrl: string;
  callToAction: string;
  adFormat: string;
};

function defaultStartLocal() {
  const d = new Date();
  d.setMinutes(0, 0, 0);
  return d.toISOString().slice(0, 16);
}

function defaultStopLocal() {
  const d = new Date();
  d.setDate(d.getDate() + 30);
  d.setMinutes(0, 0, 0);
  return d.toISOString().slice(0, 16);
}

const EMPTY_FORM: FormState = {
  name: "",
  objective: "OUTCOME_LEADS",
  status: "PAUSED",
  dailyBudget: "50",
  lifetimeBudget: "",
  specialAdCategories: [],
  startTime: defaultStartLocal(),
  stopTime: defaultStopLocal(),
  bidStrategy: "",
  pageId: "",
  countries: "IL",
  ageMin: "18",
  ageMax: "65",
  primaryText: "",
  headline: "",
  description: "",
  link: "",
  imageUrl: "",
  callToAction: "LEARN_MORE",
  adFormat: "MOBILE_FEED_STANDARD",
};

const OBJECTIVE_ICONS: Record<string, React.ElementType> = {
  OUTCOME_AWARENESS: Eye,
  OUTCOME_TRAFFIC: MousePointerClick,
  OUTCOME_ENGAGEMENT: HeartHandshake,
  OUTCOME_LEADS: Users,
  OUTCOME_APP_PROMOTION: AppWindow,
  OUTCOME_SALES: ShoppingBag,
};

const CREATE_STEPS: CreateStep[] = [1, 2, 3, 4, 5];

function toInputDate(value?: string | null) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 16);
}

function campaignToForm(campaign: MetaCampaign, pageId = ""): FormState {
  return {
    ...EMPTY_FORM,
    name: campaign.name || "",
    objective: campaign.objective || "OUTCOME_LEADS",
    status: campaign.status || "PAUSED",
    dailyBudget: campaign.dailyBudget ? String(campaign.dailyBudget) : "",
    lifetimeBudget: campaign.lifetimeBudget
      ? String(campaign.lifetimeBudget)
      : "",
    specialAdCategories: campaign.specialAdCategories || [],
    startTime: toInputDate(campaign.startTime) || defaultStartLocal(),
    stopTime: toInputDate(campaign.stopTime) || "",
    bidStrategy: campaign.bidStrategy || "",
    pageId,
  };
}

function MegaphoneFallback(props: { className?: string }) {
  return <Megaphone {...props} />;
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
  const isHe = i18n.language?.startsWith("he");

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [statusBusy, setStatusBusy] = useState(false);
  const [previewBusy, setPreviewBusy] = useState(false);
  const [createStep, setCreateStep] = useState<CreateStep>(1);
  const [connection, setConnection] = useState<MetaAdsConnectionStatus | null>(
    null
  );
  const [campaign, setCampaign] = useState<MetaCampaign | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [previewHtml, setPreviewHtml] = useState("");

  const currency = connection?.selectedAdAccount?.currency || "ILS";
  const accountIdLabel = resolveAdAccountId(connection?.selectedAdAccount);

  const objectives = useMemo(() => {
    const fromApi = connection?.objectives?.length
      ? connection.objectives.map((item) => ({
          value: item.value,
          label: isHe ? item.labelHe : item.labelEn,
        }))
      : OBJECTIVE_OPTIONS.map((item) => ({
          value: item.value,
          label: t(item.labelKey),
        }));

    const order = OBJECTIVE_OPTIONS.map((item) => item.value);
    const descriptionByValue = Object.fromEntries(
      OBJECTIVE_OPTIONS.map((item) => [item.value, t(item.descriptionKey)])
    );

    return [...fromApi]
      .sort((a, b) => order.indexOf(a.value) - order.indexOf(b.value))
      .map((item) => ({
        ...item,
        description:
          descriptionByValue[item.value] ||
          t("metaCampaigns.objectives.fallbackDesc"),
      }));
  }, [connection?.objectives, isHe, t]);

  const specialCategories = useMemo(() => {
    if (connection?.specialAdCategories?.length) {
      return connection.specialAdCategories
        .filter((item) => item.value !== "NONE")
        .map((item) => ({
          value: item.value,
          label: isHe ? item.labelHe : item.labelEn,
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
  }, [connection?.specialAdCategories, isHe, t]);

  const callToActions = useMemo(() => {
    if (connection?.callToActions?.length) {
      return connection.callToActions.map((item) => ({
        value: item.value,
        label: isHe ? item.labelHe : item.labelEn,
      }));
    }
    return [
      { value: "LEARN_MORE", label: t("metaCampaigns.cta.learnMore") },
      { value: "SIGN_UP", label: t("metaCampaigns.cta.signUp") },
      { value: "CONTACT_US", label: t("metaCampaigns.cta.contactUs") },
      { value: "SHOP_NOW", label: t("metaCampaigns.cta.shopNow") },
      { value: "WHATSAPP_MESSAGE", label: t("metaCampaigns.cta.whatsapp") },
    ];
  }, [connection?.callToActions, isHe, t]);

  const previewFormats = useMemo(() => {
    if (connection?.previewFormats?.length) {
      return connection.previewFormats.map((item) => ({
        value: item.value,
        label: isHe ? item.labelHe : item.labelEn,
      }));
    }
    return [
      {
        value: "MOBILE_FEED_STANDARD",
        label: t("metaCampaigns.preview.mobileFeed"),
      },
      {
        value: "DESKTOP_FEED_STANDARD",
        label: t("metaCampaigns.preview.desktopFeed"),
      },
      {
        value: "INSTAGRAM_STANDARD",
        label: t("metaCampaigns.preview.instagram"),
      },
    ];
  }, [connection?.previewFormats, isHe, t]);

  useEffect(() => {
    const boot = async () => {
      if (!businessId) return;
      try {
        if (!isEdit) setLoading(true);
        const status = await getMetaCampaignsStatus(businessId);
        setConnection(status);

        if (!status.connected && !status.isConnected) {
          toast.info(t("metaCampaigns.empty.notConnectedBody"));
          navigate(`${basePath}/settings`, { replace: true });
          return;
        }

        if (!isEdit) {
          setForm((prev) => ({
            ...prev,
            pageId: status.selectedPage?.pageId || status.pages?.[0]?.id || "",
          }));
        }

        if (isEdit && campaignId) {
          const detail = await getMetaCampaign(businessId, campaignId, {
            days: 30,
          });
          setCampaign(detail.campaign);
          const pageId =
            detail.connection?.selectedPage?.pageId ||
            status.selectedPage?.pageId ||
            "";
          setForm(campaignToForm(detail.campaign, pageId));
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

  const buildFullPayload = () => {
    const dailyBudget = form.dailyBudget ? Number(form.dailyBudget) : null;
    const lifetimeBudget = form.lifetimeBudget
      ? Number(form.lifetimeBudget)
      : null;
    const countries = form.countries
      .split(/[,\s]+/)
      .map((item) => item.trim().toUpperCase())
      .filter(Boolean);

    return {
      full: true,
      mode: "full" as const,
      name: form.name.trim(),
      objective: form.objective,
      status: form.status,
      dailyBudget,
      lifetimeBudget: dailyBudget ? null : lifetimeBudget,
      specialAdCategories: form.specialAdCategories,
      startTime: form.startTime
        ? new Date(form.startTime).toISOString()
        : null,
      endTime: form.stopTime ? new Date(form.stopTime).toISOString() : null,
      stopTime: form.stopTime ? new Date(form.stopTime).toISOString() : null,
      pageId: form.pageId,
      countries: countries.length ? countries : ["IL"],
      ageMin: form.ageMin ? Number(form.ageMin) : null,
      ageMax: form.ageMax ? Number(form.ageMax) : null,
      primaryText: form.primaryText.trim(),
      headline: form.headline.trim(),
      description: form.description.trim(),
      link: form.link.trim(),
      imageUrl: form.imageUrl.trim(),
      callToAction: form.callToAction,
      adFormat: form.adFormat,
    };
  };

  const validateCreateStep = (step: CreateStep) => {
    if (step === 2 && !form.name.trim()) {
      toast.error(t("metaCampaigns.form.nameRequired"));
      return false;
    }
    if (step === 2 && !form.pageId) {
      toast.error(t("metaCampaigns.form.pageRequired"));
      return false;
    }
    if (step === 3) {
      if (!form.dailyBudget && !form.lifetimeBudget) {
        toast.error(t("metaCampaigns.form.budgetRequired"));
        return false;
      }
      if (!form.startTime) {
        toast.error(t("metaCampaigns.form.startRequired"));
        return false;
      }
      if (
        form.startTime &&
        form.stopTime &&
        new Date(form.stopTime) <= new Date(form.startTime)
      ) {
        toast.error(t("metaCampaigns.form.endAfterStart"));
        return false;
      }
    }
    if (step === 4) {
      if (!form.primaryText.trim()) {
        toast.error(t("metaCampaigns.form.primaryTextRequired"));
        return false;
      }
      if (!form.headline.trim()) {
        toast.error(t("metaCampaigns.form.headlineRequired"));
        return false;
      }
      if (!form.link.trim()) {
        toast.error(t("metaCampaigns.form.linkRequired"));
        return false;
      }
    }
    return true;
  };

  const goNext = () => {
    if (!validateCreateStep(createStep)) return;
    setCreateStep((prev) => Math.min(5, prev + 1) as CreateStep);
  };

  const goBack = () => {
    setCreateStep((prev) => Math.max(1, prev - 1) as CreateStep);
  };

  const loadPreview = async () => {
    if (!businessId) return;
    if (!validateCreateStep(4)) return;

    try {
      setPreviewBusy(true);
      const result = await previewMetaAd(businessId, {
        pageId: form.pageId,
        primaryText: form.primaryText.trim(),
        headline: form.headline.trim(),
        description: form.description.trim(),
        link: form.link.trim(),
        imageUrl: form.imageUrl.trim(),
        callToAction: form.callToAction,
        adFormat: form.adFormat,
      });
      setPreviewHtml(result.preview?.body || "");
      if (!result.preview?.body) {
        toast.info(t("metaCampaigns.preview.empty"));
      }
    } catch (error: any) {
      setPreviewHtml("");
      toast.error(
        error?.response?.data?.error ||
          error?.response?.data?.message ||
          t("metaCampaigns.errors.preview")
      );
    } finally {
      setPreviewBusy(false);
    }
  };

  useEffect(() => {
    if (!isEdit && createStep === 5 && !previewHtml && !previewBusy) {
      loadPreview();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createStep]);

  const save = async () => {
    if (!businessId) return;

    if (isEdit) {
      if (!form.name.trim()) {
        toast.error(t("metaCampaigns.form.nameRequired"));
        return;
      }
      try {
        setSaving(true);
        const dailyBudget = form.dailyBudget ? Number(form.dailyBudget) : null;
        const lifetimeBudget = form.lifetimeBudget
          ? Number(form.lifetimeBudget)
          : null;
        const result = await updateMetaCampaign(businessId, campaignId!, {
          name: form.name.trim(),
          status: form.status,
          dailyBudget,
          lifetimeBudget: dailyBudget ? null : lifetimeBudget,
          specialAdCategories: form.specialAdCategories,
          startTime: form.startTime
            ? new Date(form.startTime).toISOString()
            : null,
          stopTime: form.stopTime
            ? new Date(form.stopTime).toISOString()
            : null,
        });
        setCampaign(result.campaign);
        setForm(campaignToForm(result.campaign, form.pageId));
        toast.success(t("metaCampaigns.toasts.updated"));
      } catch (error: any) {
        toast.error(
          error?.response?.data?.error ||
            error?.response?.data?.message ||
            t("metaCampaigns.errors.saveCampaign")
        );
      } finally {
        setSaving(false);
      }
      return;
    }

    if (!validateCreateStep(2) || !validateCreateStep(3) || !validateCreateStep(4)) {
      return;
    }

    try {
      setSaving(true);
      const result = await createMetaCampaign(businessId, buildFullPayload());
      if (result.preview?.body) setPreviewHtml(result.preview.body);
      toast.success(t("metaCampaigns.toasts.createdFull"));
      navigate(`${basePath}/edit/${result.campaign.id}`, { replace: true });
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
  const selectedObjective = objectives.find(
    (item) => item.value === form.objective
  );
  const selectedPageName =
    connection?.pages?.find((page) => page.id === form.pageId)?.name ||
    connection?.selectedPage?.pageName ||
    "—";
  const ctaLabel =
    callToActions.find((item) => item.value === form.callToAction)?.label ||
    form.callToAction;

  const stepLabel = (step: CreateStep) => {
    const keys: Record<CreateStep, string> = {
      1: "metaCampaigns.form.stepObjective",
      2: "metaCampaigns.form.stepDetails",
      3: "metaCampaigns.form.stepSchedule",
      4: "metaCampaigns.form.stepCreative",
      5: "metaCampaigns.form.stepPreview",
    };
    return t(keys[step]);
  };

  const accountCard = (
    <div className={`${cardBase} p-4`}>
      <p className="text-sm font-black text-slate-900">
        {t("metaCampaigns.form.accountCard")}
      </p>
      <p className="mt-2 text-sm font-bold text-slate-700">
        {connection?.selectedAdAccount?.name || "—"}
      </p>
      {accountIdLabel ? (
        <p className="mt-1 text-xs font-semibold tabular-nums text-slate-500">
          {t("metaCampaigns.form.accountId", { id: accountIdLabel })}
        </p>
      ) : null}
      <p className="mt-1 text-xs font-semibold text-slate-500">
        {t("metaCampaigns.form.currency", { currency })}
      </p>
      <Link
        to={`${basePath}/settings`}
        className={`${btnSecondary} mt-3 w-full`}
      >
        {t("metaCampaigns.form.manageConnection")}
      </Link>
    </div>
  );

  const localPreviewCard = (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center gap-3 border-b border-slate-100 px-3 py-2.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1877F2] text-xs font-black text-white">
          {(selectedPageName || "P").slice(0, 1)}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-black text-slate-900">
            {selectedPageName}
          </p>
          <p className="text-[11px] font-semibold text-slate-400">
            {t("metaCampaigns.preview.sponsored")}
          </p>
        </div>
      </div>
      <div className="space-y-2 px-3 py-3">
        <p className="whitespace-pre-wrap text-sm font-semibold text-slate-800">
          {form.primaryText || t("metaCampaigns.preview.primaryPlaceholder")}
        </p>
      </div>
      {form.imageUrl ? (
        <img
          src={form.imageUrl}
          alt=""
          className="max-h-64 w-full object-cover"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).style.display = "none";
          }}
        />
      ) : (
        <div className="flex h-40 items-center justify-center bg-slate-100 text-slate-400">
          <ImageIcon className="h-8 w-8" />
        </div>
      )}
      <div className="flex items-center justify-between gap-3 border-t border-slate-100 bg-slate-50 px-3 py-2.5">
        <div className="min-w-0">
          <p className="truncate text-[11px] font-bold uppercase tracking-wide text-slate-400">
            {form.link
              ? form.link.replace(/^https?:\/\//, "").split("/")[0]
              : "example.com"}
          </p>
          <p className="truncate text-sm font-black text-slate-900">
            {form.headline || t("metaCampaigns.preview.headlinePlaceholder")}
          </p>
          <p className="truncate text-xs font-semibold text-slate-500">
            {form.description || t("metaCampaigns.preview.descPlaceholder")}
          </p>
        </div>
        <span className="shrink-0 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-black text-slate-700">
          {ctaLabel}
        </span>
      </div>
    </div>
  );

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
            {isEdit
              ? t("metaCampaigns.form.subtitle")
              : t(`metaCampaigns.form.createStep${createStep}Subtitle`)}
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
                {t("metaCampaigns.form.save")}
              </button>
            </>
          ) : null}
        </div>
      </div>

      {!isEdit ? (
        <div className="flex flex-wrap items-center gap-2">
          {CREATE_STEPS.map((step, index) => (
            <React.Fragment key={step}>
              {index > 0 ? <span className="text-slate-300">—</span> : null}
              <button
                type="button"
                onClick={() => {
                  if (step < createStep) setCreateStep(step);
                }}
                className={[
                  "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-black",
                  createStep === step
                    ? "border-violet-200 bg-violet-50 text-violet-800"
                    : createStep > step
                      ? "border-emerald-100 bg-emerald-50 text-emerald-700"
                      : "border-slate-200 bg-white text-slate-500",
                ].join(" ")}
              >
                <span
                  className={[
                    "flex h-5 w-5 items-center justify-center rounded-full text-[10px] text-white",
                    createStep >= step ? "bg-violet-600" : "bg-slate-300",
                  ].join(" ")}
                >
                  {step}
                </span>
                {stepLabel(step)}
              </button>
            </React.Fragment>
          ))}
        </div>
      ) : null}

      {/* CREATE STEP 1 — Objective */}
      {!isEdit && createStep === 1 ? (
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_300px]">
          <div className={`${cardBase} p-4 sm:p-5`}>
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1877F2]/10 text-[#1877F2]">
                <Megaphone className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-black text-slate-900">
                  {t("metaCampaigns.form.chooseObjective")}
                </p>
                <p className="mt-1 text-xs font-semibold text-slate-500">
                  {t("metaCampaigns.form.chooseObjectiveHint")}
                </p>
              </div>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {objectives.map((item) => {
                const Icon = OBJECTIVE_ICONS[item.value] || MegaphoneFallback;
                const active = form.objective === item.value;
                return (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => updateField("objective", item.value)}
                    className={[
                      "rounded-2xl border p-4 text-start transition",
                      active
                        ? "border-[#1877F2] bg-[#1877F2]/5 shadow-sm ring-2 ring-[#1877F2]/20"
                        : "border-slate-200 bg-white hover:border-slate-300",
                    ].join(" ")}
                  >
                    <div className="flex items-start gap-3">
                      <span
                        className={[
                          "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                          active
                            ? "bg-[#1877F2] text-white"
                            : "bg-slate-100 text-slate-600",
                        ].join(" ")}
                      >
                        <Icon className="h-5 w-5" />
                      </span>
                      <span>
                        <span className="block text-sm font-black text-slate-900">
                          {item.label}
                        </span>
                        <span className="mt-1 block text-xs font-semibold leading-relaxed text-slate-500">
                          {item.description}
                        </span>
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
            <div className="mt-5 flex justify-end">
              <button type="button" onClick={goNext} className={btnPrimary}>
                {t("metaCampaigns.form.continue")}
                <ArrowRight className="h-4 w-4 rotate-180" />
              </button>
            </div>
          </div>
          <aside className="space-y-4">{accountCard}</aside>
        </div>
      ) : null}

      {/* CREATE STEP 2 — Campaign details */}
      {!isEdit && createStep === 2 ? (
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_300px]">
          <div className={`${cardBase} p-4 sm:p-5 space-y-4`}>
            <p className="text-sm font-black text-slate-900">
              {t("metaCampaigns.form.basics")}
            </p>
            <label className="block">
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
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <span className="mb-1.5 block text-xs font-black text-slate-500">
                  {t("metaCampaigns.form.objective")}
                </span>
                <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5">
                  <p className="text-sm font-black text-slate-800">
                    {selectedObjective?.label || form.objective}
                  </p>
                  <button
                    type="button"
                    onClick={() => setCreateStep(1)}
                    className="text-xs font-black text-[#1877F2] hover:underline"
                  >
                    {t("metaCampaigns.form.changeObjective")}
                  </button>
                </div>
              </div>
              <label className="block">
                <span className="mb-1.5 block text-xs font-black text-slate-500">
                  {t("metaCampaigns.form.status")}
                </span>
                <select
                  className={inputBase}
                  value={form.status}
                  onChange={(e) => updateField("status", e.target.value)}
                >
                  <option value="PAUSED">{t("metaCampaigns.status.paused")}</option>
                  <option value="ACTIVE">{t("metaCampaigns.status.active")}</option>
                </select>
              </label>
            </div>
            <label className="block">
              <span className="mb-1.5 block text-xs font-black text-slate-500">
                {t("metaCampaigns.form.page")}
              </span>
              <select
                className={inputBase}
                value={form.pageId}
                onChange={(e) => updateField("pageId", e.target.value)}
              >
                <option value="">
                  {t("metaCampaigns.form.pagePlaceholder")}
                </option>
                {(connection?.pages || []).map((page) => (
                  <option key={page.id} value={page.id}>
                    {page.name}
                  </option>
                ))}
              </select>
            </label>
            <div>
              <p className="text-xs font-black text-slate-500">
                {t("metaCampaigns.form.specialTitle")}
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
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
                          : "border-slate-200 bg-white text-slate-600",
                      ].join(" ")}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="flex justify-between gap-2 pt-2">
              <button type="button" onClick={goBack} className={btnSecondary}>
                {t("metaCampaigns.form.backStep")}
              </button>
              <button type="button" onClick={goNext} className={btnPrimary}>
                {t("metaCampaigns.form.continue")}
              </button>
            </div>
          </div>
          <aside className="space-y-4">{accountCard}</aside>
        </div>
      ) : null}

      {/* CREATE STEP 3 — Budget & schedule */}
      {!isEdit && createStep === 3 ? (
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_300px]">
          <div className={`${cardBase} p-4 sm:p-5 space-y-4`}>
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-700">
                <CalendarRange className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-black text-slate-900">
                  {t("metaCampaigns.form.scheduleTitle")}
                </p>
                <p className="mt-1 text-xs font-semibold text-slate-500">
                  {t("metaCampaigns.form.scheduleHint")}
                </p>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1.5 block text-xs font-black text-slate-500">
                  {t("metaCampaigns.form.startTime")} *
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
              <label className="block">
                <span className="mb-1.5 block text-xs font-black text-slate-500">
                  {t("metaCampaigns.form.dailyBudget")} ({currency})
                </span>
                <input
                  type="number"
                  min="1"
                  step="1"
                  className={inputBase}
                  value={form.dailyBudget}
                  onChange={(e) => updateField("dailyBudget", e.target.value)}
                  placeholder="50"
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-xs font-black text-slate-500">
                  {t("metaCampaigns.form.lifetimeBudget")} ({currency})
                </span>
                <input
                  type="number"
                  min="1"
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
                  {t("metaCampaigns.form.countries")}
                </span>
                <input
                  className={inputBase}
                  value={form.countries}
                  onChange={(e) => updateField("countries", e.target.value)}
                  placeholder="IL"
                />
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="mb-1.5 block text-xs font-black text-slate-500">
                    {t("metaCampaigns.form.ageMin")}
                  </span>
                  <input
                    type="number"
                    min="13"
                    max="65"
                    className={inputBase}
                    value={form.ageMin}
                    onChange={(e) => updateField("ageMin", e.target.value)}
                  />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-xs font-black text-slate-500">
                    {t("metaCampaigns.form.ageMax")}
                  </span>
                  <input
                    type="number"
                    min="13"
                    max="65"
                    className={inputBase}
                    value={form.ageMax}
                    onChange={(e) => updateField("ageMax", e.target.value)}
                  />
                </label>
              </div>
            </div>
            <div className="flex justify-between gap-2 pt-2">
              <button type="button" onClick={goBack} className={btnSecondary}>
                {t("metaCampaigns.form.backStep")}
              </button>
              <button type="button" onClick={goNext} className={btnPrimary}>
                {t("metaCampaigns.form.continue")}
              </button>
            </div>
          </div>
          <aside className="space-y-4">
            {accountCard}
            <div className={`${cardBase} p-4 text-xs font-semibold text-slate-500`}>
              {t("metaCampaigns.form.scheduleAside")}
            </div>
          </aside>
        </div>
      ) : null}

      {/* CREATE STEP 4 — Creative */}
      {!isEdit && createStep === 4 ? (
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
          <div className={`${cardBase} p-4 sm:p-5 space-y-4`}>
            <p className="text-sm font-black text-slate-900">
              {t("metaCampaigns.form.creativeTitle")}
            </p>
            <p className="text-xs font-semibold text-slate-500">
              {t("metaCampaigns.form.creativeHint")}
            </p>
            <label className="block">
              <span className="mb-1.5 block text-xs font-black text-slate-500">
                {t("metaCampaigns.form.primaryText")}
              </span>
              <textarea
                className={`${inputBase} min-h-[96px]`}
                value={form.primaryText}
                onChange={(e) => updateField("primaryText", e.target.value)}
                placeholder={t("metaCampaigns.form.primaryTextPlaceholder")}
              />
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1.5 block text-xs font-black text-slate-500">
                  {t("metaCampaigns.form.headline")}
                </span>
                <input
                  className={inputBase}
                  value={form.headline}
                  onChange={(e) => updateField("headline", e.target.value)}
                  placeholder={t("metaCampaigns.form.headlinePlaceholder")}
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-xs font-black text-slate-500">
                  {t("metaCampaigns.form.description")}
                </span>
                <input
                  className={inputBase}
                  value={form.description}
                  onChange={(e) => updateField("description", e.target.value)}
                  placeholder={t("metaCampaigns.form.descriptionPlaceholder")}
                />
              </label>
              <label className="block sm:col-span-2">
                <span className="mb-1.5 block text-xs font-black text-slate-500">
                  {t("metaCampaigns.form.link")}
                </span>
                <input
                  className={inputBase}
                  value={form.link}
                  onChange={(e) => updateField("link", e.target.value)}
                  placeholder="https://"
                />
              </label>
              <label className="block sm:col-span-2">
                <span className="mb-1.5 block text-xs font-black text-slate-500">
                  {t("metaCampaigns.form.imageUrl")}
                </span>
                <input
                  className={inputBase}
                  value={form.imageUrl}
                  onChange={(e) => updateField("imageUrl", e.target.value)}
                  placeholder="https://"
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-xs font-black text-slate-500">
                  {t("metaCampaigns.form.cta")}
                </span>
                <select
                  className={inputBase}
                  value={form.callToAction}
                  onChange={(e) => updateField("callToAction", e.target.value)}
                >
                  {callToActions.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div className="flex justify-between gap-2 pt-2">
              <button type="button" onClick={goBack} className={btnSecondary}>
                {t("metaCampaigns.form.backStep")}
              </button>
              <button type="button" onClick={goNext} className={btnPrimary}>
                {t("metaCampaigns.form.continueToPreview")}
              </button>
            </div>
          </div>
          <aside className="space-y-4">
            <div className={`${cardBase} p-4`}>
              <p className="mb-3 text-sm font-black text-slate-900">
                {t("metaCampaigns.preview.localTitle")}
              </p>
              {localPreviewCard}
            </div>
          </aside>
        </div>
      ) : null}

      {/* CREATE STEP 5 — Preview + publish */}
      {!isEdit && createStep === 5 ? (
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_380px]">
          <div className={`${cardBase} p-4 sm:p-5 space-y-4`}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-sm font-black text-slate-900">
                  {t("metaCampaigns.form.previewTitle")}
                </p>
                <p className="mt-1 text-xs font-semibold text-slate-500">
                  {t("metaCampaigns.form.previewHint")}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <select
                  className={`${inputBase} !w-auto min-w-[160px]`}
                  value={form.adFormat}
                  onChange={(e) => updateField("adFormat", e.target.value)}
                >
                  {previewFormats.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={loadPreview}
                  disabled={previewBusy}
                  className={btnSecondary}
                >
                  {previewBusy ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Smartphone className="h-4 w-4" />
                  )}
                  {t("metaCampaigns.preview.refresh")}
                </button>
              </div>
            </div>

            <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-3">
              {previewHtml ? (
                <div
                  className="meta-ad-preview overflow-auto"
                  dangerouslySetInnerHTML={{ __html: previewHtml }}
                />
              ) : (
                <div className="py-6 text-center text-sm font-semibold text-slate-500">
                  {previewBusy
                    ? t("metaCampaigns.preview.loading")
                    : t("metaCampaigns.preview.fallbackHint")}
                </div>
              )}
            </div>

            <dl className="grid gap-2 rounded-xl border border-slate-100 bg-white p-3 text-xs sm:grid-cols-2">
              <div>
                <dt className="font-semibold text-slate-400">
                  {t("metaCampaigns.form.name")}
                </dt>
                <dd className="font-black text-slate-800">{form.name}</dd>
              </div>
              <div>
                <dt className="font-semibold text-slate-400">
                  {t("metaCampaigns.form.objective")}
                </dt>
                <dd className="font-black text-slate-800">
                  {selectedObjective?.label}
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-slate-400">
                  {t("metaCampaigns.form.startTime")}
                </dt>
                <dd className="font-black text-slate-800">
                  {form.startTime
                    ? new Date(form.startTime).toLocaleString(
                        isHe ? "he-IL" : "en-US"
                      )
                    : "—"}
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-slate-400">
                  {t("metaCampaigns.form.stopTime")}
                </dt>
                <dd className="font-black text-slate-800">
                  {form.stopTime
                    ? new Date(form.stopTime).toLocaleString(
                        isHe ? "he-IL" : "en-US"
                      )
                    : t("metaCampaigns.form.noEndDate")}
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-slate-400">
                  {t("metaCampaigns.form.dailyBudget")}
                </dt>
                <dd className="font-black text-slate-800">
                  {form.dailyBudget
                    ? formatCurrency(Number(form.dailyBudget), currency)
                    : form.lifetimeBudget
                      ? formatCurrency(Number(form.lifetimeBudget), currency)
                      : "—"}
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-slate-400">
                  {t("metaCampaigns.form.page")}
                </dt>
                <dd className="font-black text-slate-800">{selectedPageName}</dd>
              </div>
            </dl>

            <div className="flex justify-between gap-2 pt-2">
              <button type="button" onClick={goBack} className={btnSecondary}>
                {t("metaCampaigns.form.backStep")}
              </button>
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
                {t("metaCampaigns.form.createFull")}
              </button>
            </div>
          </div>
          <aside className="space-y-4">
            <div className={`${cardBase} p-4`}>
              <p className="mb-3 text-sm font-black text-slate-900">
                {t("metaCampaigns.preview.localTitle")}
              </p>
              {localPreviewCard}
            </div>
            {accountCard}
          </aside>
        </div>
      ) : null}

      {/* EDIT MODE — keep campaign-level editor */}
      {isEdit ? (
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
                  />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-xs font-black text-slate-500">
                    {t("metaCampaigns.form.objective")}
                  </span>
                  <select
                    className={inputBase}
                    value={form.objective}
                    disabled
                  >
                    {objectives.map((item) => (
                      <option key={item.value} value={item.value}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                  <span className="mt-1 block text-[11px] font-semibold text-slate-400">
                    {t("metaCampaigns.form.objectiveLocked")}
                  </span>
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
                {t("metaCampaigns.form.scheduleTitle")}
              </p>
              <p className="mt-1 text-xs font-semibold text-slate-500">
                {t("metaCampaigns.form.budgetHint")}
              </p>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
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
                <label className="block">
                  <span className="mb-1.5 block text-xs font-black text-slate-500">
                    {t("metaCampaigns.form.dailyBudget")}
                  </span>
                  <input
                    type="number"
                    min="0"
                    className={inputBase}
                    value={form.dailyBudget}
                    onChange={(e) => updateField("dailyBudget", e.target.value)}
                  />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-xs font-black text-slate-500">
                    {t("metaCampaigns.form.lifetimeBudget")}
                  </span>
                  <input
                    type="number"
                    min="0"
                    className={inputBase}
                    value={form.lifetimeBudget}
                    onChange={(e) =>
                      updateField("lifetimeBudget", e.target.value)
                    }
                    disabled={Boolean(form.dailyBudget)}
                  />
                </label>
              </div>
            </div>
          </div>
          <aside className="space-y-4">
            {accountCard}
            {campaign ? (
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
                </dl>
              </div>
            ) : null}
          </aside>
        </div>
      ) : null}
    </div>
  );
}
