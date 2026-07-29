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
  Clapperboard,
  Eye,
  Facebook,
  HeartHandshake,
  ImagePlus,
  Instagram,
  Layers3,
  Loader2,
  Megaphone,
  MousePointerClick,
  Pause,
  Play,
  Plus,
  Save,
  ShoppingBag,
  Sparkles,
  Target,
  Trash2,
  Upload,
  Users,
} from "lucide-react";
import {
  createMetaCampaign,
  createMetaLeadForm,
  deleteMetaCampaign,
  getMetaCampaign,
  getMetaCampaignsStatus,
  listMetaLeadForms,
  previewMetaAd,
  setMetaCampaignStatus,
  updateMetaCampaign,
  uploadMetaMedia,
  type MetaAdPreview,
  type MetaAdsConnectionStatus,
  type MetaCampaign,
  type MetaLeadForm,
} from "../../../../api/metaCampaignsApi";
import BizuplyLoader from "../../../../components/ui/BizuplyLoader";
import {
  btnGhost,
  btnPrimary,
  btnSecondary,
  cardBase,
  inputBase,
} from "../../../../styles/bizuplyUi";
import AdPlacementPreview from "./AdPlacementPreview";
import LeadFormQuestionBuilder from "./LeadFormQuestionBuilder";
import {
  buildMetaLeadFormQuestionsPayload,
  defaultSelectedLeadContactTypes,
  formatCurrency,
  formatNumber,
  LEAD_FORM_CONTACT_FIELDS,
  OBJECTIVE_OPTIONS,
  resolveAdAccountId,
  statusTone,
  validateLeadFormBuilder,
  type LeadFormCustomQuestionDraft,
} from "./metaCampaignUtils";

type OutletCtx = { businessId: string | null };
type CreateStep = 1 | 2 | 3 | 4 | 5 | 6 | 7;

type CarouselCard = {
  headline: string;
  description: string;
  link: string;
  imageHash: string;
  imageUrl: string;
};

type FormState = {
  name: string;
  objective: string;
  status: string;
  dailyBudget: string;
  lifetimeBudget: string;
  specialAdCategories: string[];
  startTime: string;
  stopTime: string;
  pageId: string;
  countries: string;
  ageMin: string;
  ageMax: string;
  gender: "all" | "1" | "2";
  advantageAudience: boolean;
  placementMode: "advantage" | "facebook" | "instagram" | "both";
  facebookFeed: boolean;
  facebookStory: boolean;
  instagramFeed: boolean;
  instagramStory: boolean;
  instagramReels: boolean;
  leadFormId: string;
  primaryText: string;
  headline: string;
  description: string;
  link: string;
  displayLink: string;
  imageHash: string;
  imagePreviewUrl: string;
  videoId: string;
  creativeFormat: "single" | "video" | "carousel";
  callToAction: string;
  ctaCustom: string;
  carouselCards: CarouselCard[];
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

const EMPTY_CARD: CarouselCard = {
  headline: "",
  description: "",
  link: "",
  imageHash: "",
  imageUrl: "",
};

const EMPTY_FORM: FormState = {
  name: "",
  objective: "OUTCOME_LEADS",
  status: "PAUSED",
  dailyBudget: "50",
  lifetimeBudget: "",
  specialAdCategories: [],
  startTime: defaultStartLocal(),
  stopTime: defaultStopLocal(),
  pageId: "",
  countries: "IL",
  ageMin: "18",
  ageMax: "65",
  gender: "all",
  advantageAudience: true,
  placementMode: "both",
  facebookFeed: true,
  facebookStory: true,
  instagramFeed: true,
  instagramStory: true,
  instagramReels: true,
  leadFormId: "",
  primaryText: "",
  headline: "",
  description: "",
  link: "",
  displayLink: "",
  imageHash: "",
  imagePreviewUrl: "",
  videoId: "",
  creativeFormat: "single",
  callToAction: "SIGN_UP",
  ctaCustom: "",
  carouselCards: [
    { ...EMPTY_CARD },
    { ...EMPTY_CARD },
  ],
};

const OBJECTIVE_ICONS: Record<string, React.ElementType> = {
  OUTCOME_AWARENESS: Eye,
  OUTCOME_TRAFFIC: MousePointerClick,
  OUTCOME_ENGAGEMENT: HeartHandshake,
  OUTCOME_LEADS: Users,
  OUTCOME_APP_PROMOTION: AppWindow,
  OUTCOME_SALES: ShoppingBag,
};

const ALL_PREVIEW_FORMATS = [
  "MOBILE_FEED_STANDARD",
  "DESKTOP_FEED_STANDARD",
  "FACEBOOK_STORY_MOBILE",
  "INSTAGRAM_STANDARD",
  "INSTAGRAM_STORY",
  "INSTAGRAM_REELS",
];

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
    pageId,
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
  const isHe = i18n.language?.startsWith("he");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusBusy, setStatusBusy] = useState(false);
  const [previewBusy, setPreviewBusy] = useState(false);
  const [uploadBusy, setUploadBusy] = useState(false);
  const [formsBusy, setFormsBusy] = useState(false);
  const [createStep, setCreateStep] = useState<CreateStep>(1);
  const [connection, setConnection] = useState<MetaAdsConnectionStatus | null>(
    null
  );
  const [campaign, setCampaign] = useState<MetaCampaign | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [leadForms, setLeadForms] = useState<MetaLeadForm[]>([]);
  const [previews, setPreviews] = useState<MetaAdPreview[]>([]);
  const [activePreview, setActivePreview] = useState(ALL_PREVIEW_FORMATS[0]);
  const [newFormName, setNewFormName] = useState("");
  const [leadContactTypes, setLeadContactTypes] = useState<string[]>(() =>
    defaultSelectedLeadContactTypes()
  );
  const [leadCustomQuestions, setLeadCustomQuestions] = useState<
    LeadFormCustomQuestionDraft[]
  >([]);

  const currency = connection?.selectedAdAccount?.currency || "ILS";
  const accountIdLabel = resolveAdAccountId(connection?.selectedAdAccount);
  const isLeads = form.objective.includes("LEAD");

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
      { value: "SIGN_UP", label: t("metaCampaigns.cta.signUp") },
      { value: "LEARN_MORE", label: t("metaCampaigns.cta.learnMore") },
      { value: "CONTACT_US", label: t("metaCampaigns.cta.contactUs") },
      { value: "SHOP_NOW", label: t("metaCampaigns.cta.shopNow") },
      { value: "WHATSAPP_MESSAGE", label: t("metaCampaigns.cta.whatsapp") },
    ];
  }, [connection?.callToActions, isHe, t]);

  const previewFormats = useMemo(() => {
    // Prefer the placements users actually care about (feed / story / reels).
    return ALL_PREVIEW_FORMATS.map((value) => {
      const fromApi = (connection?.previewFormats || []).find(
        (item) => item.value === value
      );
      return {
        value,
        label: fromApi
          ? isHe
            ? fromApi.labelHe
            : fromApi.labelEn
          : t(`metaCampaigns.preview.formats.${value}`, { defaultValue: value }),
      };
    });
  }, [connection?.previewFormats, isHe, t]);

  const selectedForm = leadForms.find((item) => item.id === form.leadFormId);
  const selectedPageName =
    connection?.pages?.find((page) => page.id === form.pageId)?.name ||
    connection?.selectedPage?.pageName ||
    "—";

  const visibleSteps = useMemo(() => {
    const steps: CreateStep[] = [1, 2, 3, 4];
    if (isLeads) steps.push(5);
    steps.push(6, 7);
    return steps;
  }, [isLeads]);

  useEffect(() => {
    const boot = async () => {
      if (!businessId) return;
      try {
        setLoading(true);
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
          setForm(
            campaignToForm(
              detail.campaign,
              detail.connection?.selectedPage?.pageId ||
                status.selectedPage?.pageId ||
                ""
            )
          );
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

  const loadLeadForms = async (pageId = form.pageId) => {
    if (!businessId || !pageId) return;
    try {
      setFormsBusy(true);
      const data = await listMetaLeadForms(businessId, pageId);
      setLeadForms(data.forms || []);
      if (!form.leadFormId && data.forms?.[0]?.id) {
        setForm((prev) => ({ ...prev, leadFormId: data.forms[0].id }));
      }
    } catch (error: any) {
      toast.error(
        error?.response?.data?.error ||
          error?.response?.data?.message ||
          t("metaCampaigns.errors.leadForms")
      );
    } finally {
      setFormsBusy(false);
    }
  };

  useEffect(() => {
    if (!isEdit && isLeads && createStep === 5 && form.pageId) {
      loadLeadForms(form.pageId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createStep, isLeads, form.pageId, isEdit]);

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

  /** Meta CTA enum only — free-text Hebrew labels stay display-only. */
  const ctaValue = () => {
    const selected = String(form.callToAction || (isLeads ? "SIGN_UP" : "LEARN_MORE"))
      .replace(/\s+/g, "_")
      .replace(/[^a-zA-Z0-9_]/g, "")
      .toUpperCase();
    if (/^[A-Z][A-Z0-9_]{1,40}$/.test(selected)) return selected;
    return isLeads ? "SIGN_UP" : "LEARN_MORE";
  };

  const ctaDisplayLabel =
    form.ctaCustom.trim() ||
    callToActions.find((item) => item.value === form.callToAction)?.label ||
    form.callToAction ||
    (isLeads ? "Sign up" : "Learn more");

  const buildFullPayload = () => {
    const dailyBudget = form.dailyBudget ? Number(form.dailyBudget) : null;
    const lifetimeBudget = form.lifetimeBudget
      ? Number(form.lifetimeBudget)
      : null;
    const countries = form.countries
      .split(/[,\s]+/)
      .map((item) => item.trim().toUpperCase())
      .filter(Boolean);

    const facebookPositions = [
      form.facebookFeed ? "feed" : "",
      form.facebookStory ? "story" : "",
    ].filter(Boolean);
    const instagramPositions = [
      form.instagramFeed ? "stream" : "",
      form.instagramStory ? "story" : "",
      form.instagramReels ? "reels" : "",
    ].filter(Boolean);

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
      leadFormId: isLeads ? form.leadFormId : undefined,
      countries: countries.length ? countries : ["IL"],
      ageMin: form.ageMin ? Number(form.ageMin) : null,
      ageMax: form.ageMax ? Number(form.ageMax) : null,
      genders: form.gender === "all" ? [] : [Number(form.gender)],
      advantageAudience: form.advantageAudience,
      advantagePlacements: form.placementMode === "advantage",
      placementMode: form.placementMode,
      publisherPlatforms:
        form.placementMode === "facebook"
          ? ["facebook"]
          : form.placementMode === "instagram"
            ? ["instagram"]
            : form.placementMode === "both"
              ? ["facebook", "instagram"]
              : undefined,
      facebookPositions,
      instagramPositions,
      primaryText: form.primaryText.trim(),
      headline: form.headline.trim(),
      description: form.description.trim(),
      displayLink: form.displayLink.trim(),
      link: form.link.trim() || (isLeads ? "https://fb.me/" : ""),
      imageHash: form.imageHash || undefined,
      imageUrl: form.imagePreviewUrl || undefined,
      videoId: form.videoId || undefined,
      creativeFormat: form.creativeFormat,
      carouselCards:
        form.creativeFormat === "carousel"
          ? form.carouselCards.map((card) => ({
              headline: card.headline,
              description: card.description,
              link: card.link || form.link,
              imageHash: card.imageHash,
              imageUrl: card.imageUrl,
            }))
          : undefined,
      callToAction: ctaValue(),
      ctaCustom: form.ctaCustom.trim() || undefined,
    };
  };

  const validateStep = (step: CreateStep) => {
    if (step === 2) {
      if (!form.name.trim()) {
        toast.error(t("metaCampaigns.form.nameRequired"));
        return false;
      }
      if (!form.pageId) {
        toast.error(t("metaCampaigns.form.pageRequired"));
        return false;
      }
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
    if (step === 5 && isLeads && !form.leadFormId) {
      toast.error(t("metaCampaigns.form.leadFormRequired"));
      return false;
    }
    if (step === 6) {
      if (!form.primaryText.trim() || !form.headline.trim()) {
        toast.error(t("metaCampaigns.form.creativeRequired"));
        return false;
      }
      if (!isLeads && !form.link.trim()) {
        toast.error(t("metaCampaigns.form.linkRequired"));
        return false;
      }
      if (form.creativeFormat === "single" && !form.imageHash && !form.imagePreviewUrl) {
        toast.error(t("metaCampaigns.form.mediaRequired"));
        return false;
      }
      if (form.creativeFormat === "video" && !form.videoId) {
        toast.error(t("metaCampaigns.form.videoRequired"));
        return false;
      }
      if (form.creativeFormat === "carousel") {
        const ready = form.carouselCards.filter(
          (card) => card.imageHash || card.imageUrl
        );
        if (ready.length < 2) {
          toast.error(t("metaCampaigns.form.carouselRequired"));
          return false;
        }
      }
    }
    return true;
  };

  const nextStep = () => {
    if (!validateStep(createStep)) return;
    const idx = visibleSteps.indexOf(createStep);
    const next = visibleSteps[Math.min(visibleSteps.length - 1, idx + 1)];
    setCreateStep(next);
  };

  const prevStep = () => {
    const idx = visibleSteps.indexOf(createStep);
    const prev = visibleSteps[Math.max(0, idx - 1)];
    setCreateStep(prev);
  };

  const uploadFile = async (
    file: File,
    kind: "image" | "video",
    onDone: (result: {
      imageHash?: string;
      url?: string;
      videoId?: string;
    }) => void
  ) => {
    if (!businessId) return;
    try {
      setUploadBusy(true);
      const result = await uploadMetaMedia(businessId, file, kind);
      onDone(result);
      toast.success(t("metaCampaigns.toasts.mediaUploaded"));
    } catch (error: any) {
      toast.error(
        error?.response?.data?.error ||
          error?.response?.data?.message ||
          t("metaCampaigns.errors.mediaUpload")
      );
    } finally {
      setUploadBusy(false);
    }
  };

  const loadPreviews = async () => {
    if (!businessId) return;
    if (!form.pageId || !form.primaryText.trim() || !form.headline.trim()) {
      return;
    }
    try {
      setPreviewBusy(true);
      const payload = buildFullPayload();
      const result = await previewMetaAd(businessId, {
        ...payload,
        // Prefer formats that Meta returns reliably; story formats often blank.
        adFormats: [
          activePreview,
          ...ALL_PREVIEW_FORMATS.filter((item) => item !== activePreview),
        ],
      });
      const rows = result.previews?.length
        ? result.previews
        : result.preview
          ? [result.preview]
          : [];
      setPreviews(rows);
      const firstOk = rows.find((row) => row.body)?.adFormat;
      if (firstOk && !rows.find((row) => row.adFormat === activePreview)?.body) {
        setActivePreview(firstOk);
      }
      const errors = rows
        .filter((row) => !row.body && row.error)
        .map((row) => row.error);
      if (!rows.some((row) => row.body) && errors.length) {
        toast.info(t("metaCampaigns.preview.metaUnavailable"));
      }
    } catch (error: any) {
      toast.info(
        error?.response?.data?.error ||
          error?.response?.data?.message ||
          t("metaCampaigns.preview.metaUnavailable")
      );
    } finally {
      setPreviewBusy(false);
    }
  };

  useEffect(() => {
    if (!isEdit && createStep === 7) {
      loadPreviews();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createStep]);

  const createLeadFormQuick = async () => {
    if (!businessId || !form.pageId || !newFormName.trim()) {
      toast.error(t("metaCampaigns.form.leadFormNameRequired"));
      return;
    }
    const validationError = validateLeadFormBuilder({
      contactTypes: leadContactTypes,
      customQuestions: leadCustomQuestions,
    });
    if (validationError) {
      toast.error(t(`metaCampaigns.form.${validationError}`));
      return;
    }
    try {
      setFormsBusy(true);
      const questions = buildMetaLeadFormQuestionsPayload({
        contactTypes: leadContactTypes,
        customQuestions: leadCustomQuestions,
      });
      const result = await createMetaLeadForm(businessId, {
        pageId: form.pageId,
        name: newFormName.trim(),
        questions,
        thankYouUrl: form.link || undefined,
      });
      await loadLeadForms(form.pageId);
      if (result.form?.id) {
        updateField("leadFormId", result.form.id);
      }
      setNewFormName("");
      setLeadContactTypes(defaultSelectedLeadContactTypes());
      setLeadCustomQuestions([]);
      toast.success(t("metaCampaigns.toasts.leadFormCreated"));
    } catch (error: any) {
      toast.error(
        error?.response?.data?.error ||
          error?.response?.data?.message ||
          t("metaCampaigns.errors.createLeadForm")
      );
    } finally {
      setFormsBusy(false);
    }
  };

  const resolveQuestionLabel = (question: {
    type?: string;
    label?: string;
    key?: string;
  }) => {
    const type = String(question.type || "").toUpperCase();
    const contact = LEAD_FORM_CONTACT_FIELDS.find((item) => item.type === type);
    if (contact) return isHe ? contact.labelHe : contact.labelEn;
    return question.label || question.key || type || "—";
  };

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

    if (!validateStep(6)) return;
    try {
      setSaving(true);
      const result = await createMetaCampaign(businessId, buildFullPayload());
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
  const selectedObjective = objectives.find((item) => item.value === form.objective);
  const activePreviewRow = previews.find(
    (item) => item.adFormat === activePreview
  );
  const activePreviewHtml = activePreviewRow?.body || "";
  const carouselPreviewImages = form.carouselCards
    .map((card) => card.imageUrl)
    .filter(Boolean);

  const placementPreview = (
    <AdPlacementPreview
      adFormat={activePreview}
      pageName={selectedPageName}
      primaryText={form.primaryText}
      headline={form.headline}
      description={form.description}
      ctaLabel={ctaDisplayLabel}
      imageUrl={form.imagePreviewUrl}
      displayLink={form.displayLink}
      link={form.link}
      creativeFormat={form.creativeFormat}
      carouselImages={carouselPreviewImages}
    />
  );

  const stepTitle = (step: CreateStep) => {
    const map: Record<CreateStep, string> = {
      1: t("metaCampaigns.form.stepObjective"),
      2: t("metaCampaigns.form.stepDetails"),
      3: t("metaCampaigns.form.stepSchedule"),
      4: t("metaCampaigns.form.stepAudience"),
      5: t("metaCampaigns.form.stepLeadForm"),
      6: t("metaCampaigns.form.stepCreative"),
      7: t("metaCampaigns.form.stepPreview"),
    };
    return map[step];
  };

  const localPreview = placementPreview;

  const navFooter = (
    <div className="flex justify-between gap-2 pt-2">
      <button
        type="button"
        onClick={prevStep}
        disabled={createStep === 1}
        className={btnSecondary}
      >
        {t("metaCampaigns.form.backStep")}
      </button>
      {createStep === 7 ? (
        <button
          type="button"
          onClick={save}
          disabled={saving}
          className={btnPrimary}
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {t("metaCampaigns.form.createFull")}
        </button>
      ) : (
        <button type="button" onClick={nextStep} className={btnPrimary}>
          {t("metaCampaigns.form.continue")}
          <ArrowRight className="h-4 w-4 rotate-180" />
        </button>
      )}
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="relative overflow-hidden rounded-3xl border border-[#1877F2]/15 bg-gradient-to-l from-[#1877F2]/10 via-white to-[#E1306C]/5 p-5">
        <div className="absolute -left-10 -top-10 h-32 w-32 rounded-full bg-[#1877F2]/10 blur-2xl" />
        <div className="relative flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link
              to={`${basePath}/overview`}
              className="inline-flex items-center gap-1 text-xs font-black text-[#1877F2] hover:underline"
            >
              <ArrowRight className="h-3.5 w-3.5 rotate-180" />
              {t("metaCampaigns.form.back")}
            </Link>
            <h2 className="mt-1 text-2xl font-black text-slate-900">
              {isEdit
                ? t("metaCampaigns.form.editTitle")
                : t("metaCampaigns.form.createTitleWow")}
            </h2>
            <p className="mt-1 text-sm font-semibold text-slate-500">
              {isEdit
                ? t("metaCampaigns.form.subtitle")
                : t("metaCampaigns.form.createWowSubtitle")}
            </p>
          </div>
          {!isEdit ? (
            <div className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/80 px-3 py-1.5 text-xs font-black text-slate-600 shadow-sm">
              <Sparkles className="h-3.5 w-3.5 text-[#1877F2]" />
              {t("metaCampaigns.form.simplerThanMeta")}
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-black ${tone.bg} ${tone.text} ${tone.border}`}
              >
                {campaign?.effectiveStatus || form.status}
              </span>
              <button type="button" onClick={toggleStatus} disabled={statusBusy} className={btnSecondary}>
                {statusBusy ? <Loader2 className="h-4 w-4 animate-spin" /> : isActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                {isActive ? t("metaCampaigns.actions.pause") : t("metaCampaigns.actions.activate")}
              </button>
              <button type="button" onClick={remove} disabled={saving} className={btnGhost}>
                <Trash2 className="h-4 w-4" />
                {t("metaCampaigns.actions.delete")}
              </button>
              <button type="button" onClick={save} disabled={saving} className={btnPrimary}>
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                {t("metaCampaigns.form.save")}
              </button>
            </div>
          )}
        </div>
      </div>

      {!isEdit ? (
        <div className="flex flex-wrap gap-2">
          {visibleSteps.map((step, index) => (
            <button
              key={step}
              type="button"
              onClick={() => {
                if (visibleSteps.indexOf(step) <= visibleSteps.indexOf(createStep)) {
                  setCreateStep(step);
                }
              }}
              className={[
                "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-black transition",
                createStep === step
                  ? "border-[#1877F2] bg-[#1877F2] text-white shadow-sm"
                  : visibleSteps.indexOf(step) < visibleSteps.indexOf(createStep)
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : "border-slate-200 bg-white text-slate-500",
              ].join(" ")}
            >
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-black/10 text-[10px]">
                {index + 1}
              </span>
              {stepTitle(step)}
            </button>
          ))}
        </div>
      ) : null}

      {/* STEP 1 */}
      {!isEdit && createStep === 1 ? (
        <div className={`${cardBase} p-5`}>
          <p className="text-lg font-black text-slate-900">
            {t("metaCampaigns.form.chooseObjective")}
          </p>
          <p className="mt-1 text-sm font-semibold text-slate-500">
            {t("metaCampaigns.form.chooseObjectiveHint")}
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {objectives.map((item) => {
              const Icon = OBJECTIVE_ICONS[item.value] || Megaphone;
              const active = form.objective === item.value;
              return (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => updateField("objective", item.value)}
                  className={[
                    "rounded-2xl border p-4 text-start transition",
                    active
                      ? "border-[#1877F2] bg-[#1877F2]/5 ring-2 ring-[#1877F2]/20"
                      : "border-slate-200 bg-white hover:border-slate-300",
                  ].join(" ")}
                >
                  <span
                    className={[
                      "mb-3 flex h-11 w-11 items-center justify-center rounded-2xl",
                      active ? "bg-[#1877F2] text-white" : "bg-slate-100 text-slate-600",
                    ].join(" ")}
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="block text-sm font-black text-slate-900">
                    {item.label}
                  </span>
                  <span className="mt-1 block text-xs font-semibold text-slate-500">
                    {item.description}
                  </span>
                </button>
              );
            })}
          </div>
          {navFooter}
        </div>
      ) : null}

      {/* STEP 2 */}
      {!isEdit && createStep === 2 ? (
        <div className={`${cardBase} space-y-4 p-5`}>
          <p className="text-lg font-black text-slate-900">
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
            <label className="block">
              <span className="mb-1.5 block text-xs font-black text-slate-500">
                {t("metaCampaigns.form.page")}
              </span>
              <select
                className={inputBase}
                value={form.pageId}
                onChange={(e) => updateField("pageId", e.target.value)}
              >
                <option value="">{t("metaCampaigns.form.pagePlaceholder")}</option>
                {(connection?.pages || []).map((page) => (
                  <option key={page.id} value={page.id}>
                    {page.name}
                  </option>
                ))}
              </select>
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
                <option value="PAUSED">{t("metaCampaigns.status.paused")}</option>
                <option value="ACTIVE">{t("metaCampaigns.status.active")}</option>
              </select>
            </label>
          </div>
          <div className="flex flex-wrap gap-2">
            {specialCategories.map((item) => {
              const active = form.specialAdCategories.includes(item.value);
              return (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => toggleCategory(item.value)}
                  className={[
                    "rounded-lg border px-3 py-2 text-xs font-black",
                    active
                      ? "border-[#1877F2]/30 bg-[#1877F2]/10 text-[#1877F2]"
                      : "border-slate-200 bg-white text-slate-600",
                  ].join(" ")}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
          {navFooter}
        </div>
      ) : null}

      {/* STEP 3 schedule */}
      {!isEdit && createStep === 3 ? (
        <div className={`${cardBase} space-y-4 p-5`}>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-50 text-violet-700">
              <CalendarRange className="h-5 w-5" />
            </div>
            <div>
              <p className="text-lg font-black text-slate-900">
                {t("metaCampaigns.form.scheduleTitle")}
              </p>
              <p className="text-sm font-semibold text-slate-500">
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
                className={inputBase}
                value={form.dailyBudget}
                onChange={(e) => updateField("dailyBudget", e.target.value)}
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-black text-slate-500">
                {t("metaCampaigns.form.lifetimeBudget")} ({currency})
              </span>
              <input
                type="number"
                min="1"
                className={inputBase}
                value={form.lifetimeBudget}
                disabled={Boolean(form.dailyBudget)}
                onChange={(e) => updateField("lifetimeBudget", e.target.value)}
              />
            </label>
          </div>
          {navFooter}
        </div>
      ) : null}

      {/* STEP 4 audience + placements */}
      {!isEdit && createStep === 4 ? (
        <div className="grid gap-4 xl:grid-cols-2">
          <div className={`${cardBase} space-y-4 p-5`}>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                <Target className="h-5 w-5" />
              </div>
              <div>
                <p className="text-lg font-black text-slate-900">
                  {t("metaCampaigns.form.audienceTitle")}
                </p>
                <p className="text-sm font-semibold text-slate-500">
                  {t("metaCampaigns.form.audienceHint")}
                </p>
              </div>
            </div>
            <label className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <span>
                <span className="block text-sm font-black text-slate-900">
                  Advantage+ {t("metaCampaigns.form.audience")}
                </span>
                <span className="block text-xs font-semibold text-slate-500">
                  {t("metaCampaigns.form.advantageAudienceHint")}
                </span>
              </span>
              <input
                type="checkbox"
                checked={form.advantageAudience}
                onChange={(e) => updateField("advantageAudience", e.target.checked)}
                className="h-5 w-5"
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
              />
            </label>
            {!form.advantageAudience ? (
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
                <label className="col-span-2 block">
                  <span className="mb-1.5 block text-xs font-black text-slate-500">
                    {t("metaCampaigns.form.gender")}
                  </span>
                  <select
                    className={inputBase}
                    value={form.gender}
                    onChange={(e) =>
                      updateField("gender", e.target.value as FormState["gender"])
                    }
                  >
                    <option value="all">{t("metaCampaigns.form.genderAll")}</option>
                    <option value="1">{t("metaCampaigns.form.genderMale")}</option>
                    <option value="2">{t("metaCampaigns.form.genderFemale")}</option>
                  </select>
                </label>
              </div>
            ) : null}
          </div>

          <div className={`${cardBase} space-y-4 p-5`}>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#E1306C]/10 text-[#E1306C]">
                <Layers3 className="h-5 w-5" />
              </div>
              <div>
                <p className="text-lg font-black text-slate-900">
                  {t("metaCampaigns.form.placementsTitle")}
                </p>
                <p className="text-sm font-semibold text-slate-500">
                  {t("metaCampaigns.form.placementsHint")}
                </p>
              </div>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              {(
                [
                  ["advantage", t("metaCampaigns.form.placementAdvantage")],
                  ["both", t("metaCampaigns.form.placementBoth")],
                  ["facebook", t("metaCampaigns.form.placementFacebook")],
                  ["instagram", t("metaCampaigns.form.placementInstagram")],
                ] as const
              ).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => updateField("placementMode", value)}
                  className={[
                    "rounded-xl border px-3 py-3 text-start text-sm font-black",
                    form.placementMode === value
                      ? "border-[#1877F2] bg-[#1877F2]/5 text-[#1877F2]"
                      : "border-slate-200 bg-white text-slate-700",
                  ].join(" ")}
                >
                  {value === "facebook" ? (
                    <Facebook className="mb-2 h-4 w-4" />
                  ) : value === "instagram" ? (
                    <Instagram className="mb-2 h-4 w-4" />
                  ) : null}
                  {label}
                </button>
              ))}
            </div>
            {form.placementMode !== "advantage" ? (
              <div className="space-y-2 rounded-2xl border border-slate-100 bg-slate-50 p-3 text-sm font-semibold text-slate-700">
                {(form.placementMode === "facebook" ||
                  form.placementMode === "both") && (
                  <>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={form.facebookFeed}
                        onChange={(e) => updateField("facebookFeed", e.target.checked)}
                      />
                      {t("metaCampaigns.form.posFacebookFeed")}
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={form.facebookStory}
                        onChange={(e) => updateField("facebookStory", e.target.checked)}
                      />
                      {t("metaCampaigns.form.posFacebookStory")}
                    </label>
                  </>
                )}
                {(form.placementMode === "instagram" ||
                  form.placementMode === "both") && (
                  <>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={form.instagramFeed}
                        onChange={(e) => updateField("instagramFeed", e.target.checked)}
                      />
                      {t("metaCampaigns.form.posInstagramFeed")}
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={form.instagramStory}
                        onChange={(e) => updateField("instagramStory", e.target.checked)}
                      />
                      {t("metaCampaigns.form.posInstagramStory")}
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={form.instagramReels}
                        onChange={(e) => updateField("instagramReels", e.target.checked)}
                      />
                      {t("metaCampaigns.form.posInstagramReels")}
                    </label>
                  </>
                )}
              </div>
            ) : null}
            {navFooter}
          </div>
        </div>
      ) : null}

      {/* STEP 5 lead form */}
      {!isEdit && createStep === 5 && isLeads ? (
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
          <div className={`${cardBase} space-y-4 p-5`}>
            <p className="text-lg font-black text-slate-900">
              {t("metaCampaigns.form.leadFormTitle")}
            </p>
            <p className="text-sm font-semibold text-slate-500">
              {t("metaCampaigns.form.leadFormHint")}
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                className={btnSecondary}
                disabled={formsBusy}
                onClick={() => loadLeadForms()}
              >
                {formsBusy ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                {t("metaCampaigns.form.refreshLeadForms")}
              </button>
            </div>
            <div className="space-y-2">
              {leadForms.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => updateField("leadFormId", item.id)}
                  className={[
                    "w-full rounded-2xl border p-4 text-start",
                    form.leadFormId === item.id
                      ? "border-[#1877F2] bg-[#1877F2]/5"
                      : "border-slate-200 bg-white",
                  ].join(" ")}
                >
                  <p className="text-sm font-black text-slate-900">{item.name}</p>
                  <p className="mt-1 text-xs font-semibold text-slate-500">
                    {item.status} · {item.leadsCount || 0} leads · {item.id}
                  </p>
                </button>
              ))}
              {!leadForms.length && !formsBusy ? (
                <p className="text-sm font-semibold text-slate-500">
                  {t("metaCampaigns.form.noLeadForms")}
                </p>
              ) : null}
            </div>
            {selectedForm?.questions?.length ? (
              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <p className="text-sm font-black text-slate-900">
                  {t("metaCampaigns.form.formQuestions")}
                </p>
                <ul className="mt-2 space-y-2 text-sm font-semibold text-slate-600">
                  {selectedForm.questions.map((q) => {
                    const optionValues = (q.options || [])
                      .map((o) =>
                        typeof o === "string" ? o : o?.value || o?.key || ""
                      )
                      .filter(Boolean);
                    const isChoice = optionValues.length > 0;
                    return (
                      <li key={q.key || q.id || `${q.type}-${q.label}`}>
                        <span className="text-slate-900">
                          {resolveQuestionLabel(q)}
                        </span>
                        <span className="ms-2 text-xs font-bold text-slate-400">
                          {isChoice
                            ? t("metaCampaigns.form.answerTypeMultiple")
                            : q.type === "CUSTOM"
                              ? t("metaCampaigns.form.answerTypeShort")
                              : t("metaCampaigns.form.answerTypeContact")}
                        </span>
                        {isChoice ? (
                          <p className="mt-1 text-xs font-semibold text-slate-500">
                            {optionValues.join(" · ")}
                          </p>
                        ) : null}
                      </li>
                    );
                  })}
                </ul>
              </div>
            ) : null}
            {navFooter}
          </div>
          <div className={`${cardBase} space-y-4 p-5`}>
            <div>
              <p className="text-sm font-black text-slate-900">
                {t("metaCampaigns.form.createLeadFormTitle")}
              </p>
              <p className="mt-1 text-xs font-semibold text-slate-500">
                {t("metaCampaigns.form.createLeadFormHint")}
              </p>
            </div>
            <input
              className={inputBase}
              value={newFormName}
              onChange={(e) => setNewFormName(e.target.value)}
              placeholder={t("metaCampaigns.form.leadFormNamePlaceholder")}
            />
            <LeadFormQuestionBuilder
              contactTypes={leadContactTypes}
              customQuestions={leadCustomQuestions}
              onContactTypesChange={setLeadContactTypes}
              onCustomQuestionsChange={setLeadCustomQuestions}
              disabled={formsBusy}
            />
            <button
              type="button"
              className={btnPrimary}
              disabled={formsBusy}
              onClick={createLeadFormQuick}
            >
              {formsBusy ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
              {t("metaCampaigns.form.createLeadForm")}
            </button>
          </div>
        </div>
      ) : null}

      {/* STEP 6 creative */}
      {!isEdit && createStep === 6 ? (
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
          <div className={`${cardBase} space-y-4 p-5`}>
            <p className="text-lg font-black text-slate-900">
              {t("metaCampaigns.form.creativeTitle")}
            </p>
            <div className="grid gap-2 sm:grid-cols-3">
              {(
                [
                  ["single", ImagePlus, t("metaCampaigns.form.formatSingle")],
                  ["video", Clapperboard, t("metaCampaigns.form.formatVideo")],
                  ["carousel", Layers3, t("metaCampaigns.form.formatCarousel")],
                ] as const
              ).map(([value, Icon, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => updateField("creativeFormat", value)}
                  className={[
                    "rounded-2xl border px-3 py-3 text-sm font-black",
                    form.creativeFormat === value
                      ? "border-[#1877F2] bg-[#1877F2]/5 text-[#1877F2]"
                      : "border-slate-200 bg-white text-slate-700",
                  ].join(" ")}
                >
                  <Icon className="mb-2 h-4 w-4" />
                  {label}
                </button>
              ))}
            </div>

            <label className="block">
              <span className="mb-1.5 block text-xs font-black text-slate-500">
                {t("metaCampaigns.form.primaryText")}
              </span>
              <textarea
                className={`${inputBase} min-h-[96px]`}
                value={form.primaryText}
                onChange={(e) => updateField("primaryText", e.target.value)}
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
                />
              </label>
              {!isLeads || form.creativeFormat !== "single" ? (
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
              ) : null}
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
              <label className="block">
                <span className="mb-1.5 block text-xs font-black text-slate-500">
                  {t("metaCampaigns.form.ctaCustom")}
                </span>
                <input
                  className={inputBase}
                  value={form.ctaCustom}
                  onChange={(e) => updateField("ctaCustom", e.target.value)}
                  placeholder={t("metaCampaigns.form.ctaCustomPlaceholder")}
                />
              </label>
            </div>

            {form.creativeFormat === "single" ? (
              <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center">
                {uploadBusy ? (
                  <Loader2 className="h-6 w-6 animate-spin text-[#1877F2]" />
                ) : (
                  <Upload className="h-6 w-6 text-[#1877F2]" />
                )}
                <span className="text-sm font-black text-slate-800">
                  {t("metaCampaigns.form.uploadImage")}
                </span>
                <span className="text-xs font-semibold text-slate-500">
                  {form.imageHash
                    ? t("metaCampaigns.form.mediaReady")
                    : t("metaCampaigns.form.uploadImageHint")}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const localUrl = URL.createObjectURL(file);
                    updateField("imagePreviewUrl", localUrl);
                    uploadFile(file, "image", (result) => {
                      updateField("imageHash", result.imageHash || "");
                      if (result.url) updateField("imagePreviewUrl", result.url);
                    });
                  }}
                />
              </label>
            ) : null}

            {form.creativeFormat === "video" ? (
              <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center">
                {uploadBusy ? (
                  <Loader2 className="h-6 w-6 animate-spin text-[#1877F2]" />
                ) : (
                  <Clapperboard className="h-6 w-6 text-[#1877F2]" />
                )}
                <span className="text-sm font-black text-slate-800">
                  {t("metaCampaigns.form.uploadVideo")}
                </span>
                <span className="text-xs font-semibold text-slate-500">
                  {form.videoId || t("metaCampaigns.form.uploadVideoHint")}
                </span>
                <input
                  type="file"
                  accept="video/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    uploadFile(file, "video", (result) => {
                      updateField("videoId", result.videoId || "");
                    });
                  }}
                />
              </label>
            ) : null}

            {form.creativeFormat === "carousel" ? (
              <div className="space-y-3">
                {form.carouselCards.map((card, index) => (
                  <div
                    key={index}
                    className="rounded-2xl border border-slate-200 p-4 space-y-3"
                  >
                    <p className="text-sm font-black text-slate-800">
                      {t("metaCampaigns.form.carouselCard", { n: index + 1 })}
                    </p>
                    <input
                      className={inputBase}
                      placeholder={t("metaCampaigns.form.headline")}
                      value={card.headline}
                      onChange={(e) => {
                        const next = [...form.carouselCards];
                        next[index] = { ...next[index], headline: e.target.value };
                        updateField("carouselCards", next);
                      }}
                    />
                    <input
                      className={inputBase}
                      placeholder={t("metaCampaigns.form.link")}
                      value={card.link}
                      onChange={(e) => {
                        const next = [...form.carouselCards];
                        next[index] = { ...next[index], link: e.target.value };
                        updateField("carouselCards", next);
                      }}
                    />
                    <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-slate-300 px-3 py-3 text-xs font-black text-slate-600">
                      <Upload className="h-4 w-4" />
                      {card.imageHash
                        ? t("metaCampaigns.form.mediaReady")
                        : t("metaCampaigns.form.uploadImage")}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          const localUrl = URL.createObjectURL(file);
                          const next = [...form.carouselCards];
                          next[index] = { ...next[index], imageUrl: localUrl };
                          updateField("carouselCards", next);
                          uploadFile(file, "image", (result) => {
                            const cards = [...form.carouselCards];
                            cards[index] = {
                              ...cards[index],
                              imageHash: result.imageHash || "",
                              imageUrl: result.url || localUrl,
                            };
                            updateField("carouselCards", cards);
                          });
                        }}
                      />
                    </label>
                  </div>
                ))}
                <button
                  type="button"
                  className={btnSecondary}
                  onClick={() =>
                    updateField("carouselCards", [
                      ...form.carouselCards,
                      { ...EMPTY_CARD },
                    ])
                  }
                >
                  <Plus className="h-4 w-4" />
                  {t("metaCampaigns.form.addCarouselCard")}
                </button>
              </div>
            ) : null}

            {navFooter}
          </div>
          <aside className={`${cardBase} p-4`}>
            <p className="mb-3 text-sm font-black text-slate-900">
              {t("metaCampaigns.preview.localTitle")}
            </p>
            {localPreview}
            <p className="mt-3 text-xs font-semibold text-slate-500">
              {t("metaCampaigns.form.accountId", { id: accountIdLabel || "—" })} ·{" "}
              {currency}
            </p>
          </aside>
        </div>
      ) : null}

      {/* STEP 7 preview */}
      {!isEdit && createStep === 7 ? (
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className={`${cardBase} space-y-4 p-5`}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-lg font-black text-slate-900">
                  {t("metaCampaigns.form.previewTitle")}
                </p>
                <p className="text-sm font-semibold text-slate-500">
                  {t("metaCampaigns.preview.postReadyHint")}
                </p>
              </div>
              <button
                type="button"
                className={btnSecondary}
                disabled={previewBusy}
                onClick={loadPreviews}
              >
                {previewBusy ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
                {t("metaCampaigns.preview.refresh")}
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {previewFormats.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setActivePreview(item.value)}
                  className={[
                    "rounded-full border px-3 py-1.5 text-xs font-black",
                    activePreview === item.value
                      ? "border-[#1877F2] bg-[#1877F2] text-white"
                      : "border-slate-200 bg-white text-slate-600",
                  ].join(" ")}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="rounded-2xl border border-slate-200 bg-gradient-to-b from-slate-50 to-white p-4 sm:p-6">
              <p className="mb-4 text-center text-xs font-black uppercase tracking-wide text-slate-400">
                {t("metaCampaigns.preview.yourPost")}
              </p>
              {placementPreview}
            </div>

            {activePreviewHtml ? (
              <div className="space-y-2">
                <p className="text-sm font-black text-slate-900">
                  {t("metaCampaigns.preview.metaOfficial")}
                </p>
                <div
                  className="overflow-auto rounded-2xl border border-slate-200 bg-white p-2"
                  dangerouslySetInnerHTML={{ __html: activePreviewHtml }}
                />
              </div>
            ) : previewBusy ? (
              <div className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-slate-200 bg-slate-50 px-3 py-4 text-sm font-semibold text-slate-500">
                <Loader2 className="h-4 w-4 animate-spin" />
                {t("metaCampaigns.preview.loading")}
              </div>
            ) : (
              <p className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-3 py-3 text-center text-xs font-semibold text-slate-500">
                {t("metaCampaigns.preview.localIsPrimary")}
              </p>
            )}

            <dl className="grid gap-2 rounded-xl border border-slate-100 p-3 text-xs sm:grid-cols-2">
              <div>
                <dt className="text-slate-400">{t("metaCampaigns.form.name")}</dt>
                <dd className="font-black text-slate-800">{form.name}</dd>
              </div>
              <div>
                <dt className="text-slate-400">{t("metaCampaigns.form.objective")}</dt>
                <dd className="font-black text-slate-800">
                  {selectedObjective?.label}
                </dd>
              </div>
              <div>
                <dt className="text-slate-400">{t("metaCampaigns.form.startTime")}</dt>
                <dd className="font-black text-slate-800">
                  {form.startTime
                    ? new Date(form.startTime).toLocaleString(isHe ? "he-IL" : "en-US")
                    : "—"}
                </dd>
              </div>
              <div>
                <dt className="text-slate-400">{t("metaCampaigns.form.dailyBudget")}</dt>
                <dd className="font-black text-slate-800">
                  {form.dailyBudget
                    ? formatCurrency(Number(form.dailyBudget), currency)
                    : "—"}
                </dd>
              </div>
            </dl>
            {navFooter}
          </div>
          <aside className="space-y-4">
            <div className={`${cardBase} p-4`}>
              <p className="mb-3 text-sm font-black text-slate-900">
                {t("metaCampaigns.preview.selectedPlacement")}
              </p>
              <p className="mb-3 text-xs font-semibold text-slate-500">
                {previewFormats.find((item) => item.value === activePreview)
                  ?.label || activePreview}
              </p>
              {placementPreview}
            </div>
          </aside>
        </div>
      ) : null}

      {isEdit ? (
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div className={`${cardBase} space-y-4 p-5`}>
            <label className="block">
              <span className="mb-1.5 block text-xs font-black text-slate-500">
                {t("metaCampaigns.form.name")}
              </span>
              <input
                className={inputBase}
                value={form.name}
                onChange={(e) => updateField("name", e.target.value)}
              />
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
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
                  className={inputBase}
                  value={form.dailyBudget}
                  onChange={(e) => updateField("dailyBudget", e.target.value)}
                />
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
                  <option value="PAUSED">{t("metaCampaigns.status.paused")}</option>
                  <option value="ACTIVE">{t("metaCampaigns.status.active")}</option>
                </select>
              </label>
            </div>
          </div>

          <aside className={`${cardBase} p-4`}>
            <p className="text-sm font-black text-slate-900">
              {t("metaCampaigns.form.metricsTitle")}
            </p>
            <p className="mt-1 text-xs font-semibold text-slate-500">
              {t("metaCampaigns.form.metricsMetaParity")}
            </p>
            <dl className="mt-3 space-y-2 text-sm">
              <div className="flex items-center justify-between gap-3">
                <dt className="font-semibold text-slate-500">
                  {t("metaCampaigns.table.results")}
                </dt>
                <dd className="font-black text-slate-900">
                  {formatNumber(
                    campaign?.metrics?.results ?? campaign?.metrics?.leads ?? 0
                  )}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="font-semibold text-slate-500">
                  {t("metaCampaigns.table.costPerResult")}
                </dt>
                <dd className="font-black text-slate-900">
                  {formatCurrency(
                    campaign?.metrics?.costPerResult ??
                      campaign?.metrics?.costPerLead ??
                      0,
                    currency
                  )}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="font-semibold text-slate-500">
                  {t("metaCampaigns.table.spend")}
                </dt>
                <dd className="font-black text-slate-900">
                  {formatCurrency(campaign?.metrics?.spend || 0, currency)}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="font-semibold text-slate-500">
                  {t("metaCampaigns.table.impressions")}
                </dt>
                <dd className="font-black text-slate-900">
                  {formatNumber(campaign?.metrics?.impressions || 0)}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="font-semibold text-slate-500">
                  {t("metaCampaigns.table.reach")}
                </dt>
                <dd className="font-black text-slate-900">
                  {formatNumber(campaign?.metrics?.reach || 0)}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="font-semibold text-slate-500">
                  {t("metaCampaigns.form.accountCard")}
                </dt>
                <dd className="font-black tabular-nums text-slate-900">
                  {accountIdLabel || "—"}
                </dd>
              </div>
            </dl>
          </aside>
        </div>
      ) : null}
    </div>
  );
}
