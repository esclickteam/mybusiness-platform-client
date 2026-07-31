import React, { useCallback, useEffect, useMemo, useState } from "react";
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
  type MetaInterestTarget,
  type MetaLeadForm,
  type MetaLocationTarget,
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
import MetaAudienceHealthBanner from "./MetaAudienceHealthBanner";
import MetaAudienceTargetingPanel, {
  DEFAULT_ISRAEL_LOCATION,
} from "./MetaAudienceTargetingPanel";
import MetaLeadFormLivePreview from "./MetaLeadFormLivePreview";
import MetaPlacementCropPreview from "./MetaPlacementCropPreview";
import MetaSavedAudiences, {
  type SavedAudienceSnapshot,
} from "./MetaSavedAudiences";
import MetaWizardNav from "./MetaWizardNav";
import {
  findWizardIndex,
  flattenWizardSteps,
  getWizardDefinition,
  type WizardMainStep,
} from "./metaWizardConfig";
import {
  buildMetaLeadFormQuestionsPayload,
  defaultSelectedLeadContactTypes,
  formatCurrency,
  formatNumber,
  LEAD_FORM_CONTACT_FIELDS,
  META_PREVIEW_FORMATS,
  OBJECTIVE_OPTIONS,
  resolveAdAccountId,
  resolvePreviewFormatsForPlacements,
  statusTone,
  validateLeadFormBuilder,
  type LeadFormCustomQuestionDraft,
  type MetaPreviewFormat,
} from "./metaCampaignUtils";

type OutletCtx = { businessId: string | null };

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
  locations: MetaLocationTarget[];
  locationMode: "places" | "radius";
  interests: MetaInterestTarget[];
  ageMin: string;
  ageMax: string;
  gender: "all" | "1" | "2";
  advantageAudience: boolean;
  placementMode: "advantage" | "facebook" | "instagram" | "both";
  facebookFeed: boolean;
  facebookStory: boolean;
  facebookReels: boolean;
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
  locations: [{ ...DEFAULT_ISRAEL_LOCATION }],
  locationMode: "places",
  interests: [],
  ageMin: "18",
  ageMax: "65",
  gender: "all",
  advantageAudience: true,
  placementMode: "both",
  facebookFeed: true,
  facebookStory: true,
  facebookReels: true,
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

const ALL_PREVIEW_FORMATS: MetaPreviewFormat[] = [...META_PREVIEW_FORMATS];

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
  const [mainStep, setMainStep] = useState<WizardMainStep>(1);
  const [subStep, setSubStep] = useState(0);
  const [leadFormMode, setLeadFormMode] = useState<"existing" | "create">("existing");
  const [formType, setFormType] = useState<"volume" | "intent">("volume");
  const [introTitle, setIntroTitle] = useState("");
  const [introDescription, setIntroDescription] = useState("");
  const [privacyPolicyUrl, setPrivacyPolicyUrl] = useState("");
  const [thankYouTitle, setThankYouTitle] = useState("תודה!");
  const [thankYouBody, setThankYouBody] = useState("ניצור איתכם קשר בהקדם.");
  const [thankYouButton, setThankYouButton] = useState("לאתר");
  const [formPreviewScreen, setFormPreviewScreen] = useState<
    "intro" | "questions" | "privacy" | "thanks"
  >("intro");
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

  const flatSteps = useMemo(() => flattenWizardSteps(isLeads), [isLeads]);
  const currentFlatIndex = useMemo(
    () => findWizardIndex(mainStep, subStep, isLeads),
    [mainStep, subStep, isLeads]
  );
  const currentFlat =
    flatSteps.find((s) => s.main === mainStep && s.subIndex === subStep) ||
    flatSteps[0];
  const currentSubId = currentFlat?.id || "objective";
  const wizardDefinition = useMemo(() => getWizardDefinition(isLeads), [isLeads]);
  const currentMainDef = wizardDefinition.find((item) => item.main === mainStep);
  const currentSubDef = currentMainDef?.subs[subStep];

  const audienceSnapshot = useMemo<SavedAudienceSnapshot>(
    () => ({
      advantageAudience: form.advantageAudience,
      locations: form.locations,
      locationMode: form.locationMode,
      interests: form.interests,
      ageMin: form.ageMin,
      ageMax: form.ageMax,
      gender: form.gender,
    }),
    [
      form.advantageAudience,
      form.locations,
      form.locationMode,
      form.interests,
      form.ageMin,
      form.ageMax,
      form.gender,
    ]
  );

  const leadFormContactLabels = useMemo(
    () =>
      leadContactTypes.map((type) => {
        const contact = LEAD_FORM_CONTACT_FIELDS.find((item) => item.type === type);
        return contact ? (isHe ? contact.labelHe : contact.labelEn) : type;
      }),
    [leadContactTypes, isHe]
  );

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

  const selectedPreviewFormats = useMemo(
    () =>
      resolvePreviewFormatsForPlacements({
        placementMode: form.placementMode,
        facebookFeed: form.facebookFeed,
        facebookStory: form.facebookStory,
        facebookReels: form.facebookReels,
        instagramFeed: form.instagramFeed,
        instagramStory: form.instagramStory,
        instagramReels: form.instagramReels,
      }),
    [
      form.placementMode,
      form.facebookFeed,
      form.facebookStory,
      form.facebookReels,
      form.instagramFeed,
      form.instagramStory,
      form.instagramReels,
    ]
  );

  const previewFormats = useMemo(() => {
    return selectedPreviewFormats.map((value) => {
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
  }, [connection?.previewFormats, isHe, selectedPreviewFormats, t]);

  useEffect(() => {
    if (!selectedPreviewFormats.includes(activePreview as MetaPreviewFormat)) {
      setActivePreview(selectedPreviewFormats[0] || ALL_PREVIEW_FORMATS[0]);
    }
  }, [selectedPreviewFormats, activePreview]);

  const selectedForm = leadForms.find((item) => item.id === form.leadFormId);
  const selectedPageName =
    connection?.pages?.find((page) => page.id === form.pageId)?.name ||
    connection?.selectedPage?.pageName ||
    "—";

  const goToFlatIndex = useCallback(
    (index: number) => {
      const step = flatSteps[index];
      if (step) {
        setMainStep(step.main);
        setSubStep(step.subIndex);
      }
    },
    [flatSteps]
  );

  const applyAudienceSnapshot = useCallback((snapshot: SavedAudienceSnapshot) => {
    setForm((prev) => ({
      ...prev,
      advantageAudience: snapshot.advantageAudience,
      locations: snapshot.locations,
      locationMode: snapshot.locationMode,
      interests: snapshot.interests,
      ageMin: snapshot.ageMin,
      ageMax: snapshot.ageMax,
      gender: snapshot.gender,
    }));
  }, []);

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
    if (!isEdit && currentSubId === "lead-form-select" && isLeads && form.pageId) {
      loadLeadForms(form.pageId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSubId, isLeads, form.pageId, isEdit]);

  useEffect(() => {
    if (currentFlatIndex < 0 && flatSteps.length > 0) {
      const fallback =
        flatSteps.find((s) => s.id === "identity") ||
        flatSteps.find((s) => s.id === "creative-media") ||
        flatSteps[0];
      if (fallback) {
        setMainStep(fallback.main);
        setSubStep(fallback.subIndex);
      }
    }
  }, [currentFlatIndex, flatSteps]);

  useEffect(() => {
    if (currentSubId === "lead-form-intro") setFormPreviewScreen("intro");
    else if (currentSubId === "lead-form-questions") setFormPreviewScreen("questions");
    else if (currentSubId === "lead-form-privacy") setFormPreviewScreen("privacy");
  }, [currentSubId]);

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
    const locations =
      form.locations?.length > 0
        ? form.locations
        : [{ ...DEFAULT_ISRAEL_LOCATION }];
    const countries = locations
      .filter((item) => item.type === "country")
      .map((item) => String(item.key || item.countryCode || "").toUpperCase())
      .filter(Boolean);

    const facebookPositions = [
      form.facebookFeed ? "feed" : "",
      form.facebookStory ? "story" : "",
      form.facebookReels ? "facebook_reels" : "",
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
      locations,
      interests: form.interests,
      countries: countries.length ? countries : undefined,
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

  const validateCreative = () => {
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
    return true;
  };

  const validateCurrentSub = () => {
    switch (currentSubId) {
      case "details":
        if (!form.name.trim()) {
          toast.error(t("metaCampaigns.form.nameRequired"));
          return false;
        }
        if (!form.pageId) {
          toast.error(t("metaCampaigns.form.pageRequired"));
          return false;
        }
        return true;
      case "budget":
        if (!form.dailyBudget && !form.lifetimeBudget) {
          toast.error(t("metaCampaigns.form.budgetRequired"));
          return false;
        }
        return true;
      case "schedule":
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
        return true;
      case "locations":
        if (!form.locations?.length) {
          toast.error(t("metaCampaigns.form.locationsRequired"));
          return false;
        }
        return true;
      case "lead-form-select":
        if (leadFormMode === "existing" && !form.leadFormId) {
          toast.error(t("metaCampaigns.form.leadFormRequired"));
          return false;
        }
        return true;
      case "lead-form-setup":
        if (leadFormMode === "create" && !newFormName.trim()) {
          toast.error(t("metaCampaigns.form.leadFormNameRequired"));
          return false;
        }
        return true;
      case "lead-form-questions":
        if (leadFormMode === "create") {
          const validationError = validateLeadFormBuilder({
            contactTypes: leadContactTypes,
            customQuestions: leadCustomQuestions,
          });
          if (validationError) {
            toast.error(t(`metaCampaigns.form.${validationError}`));
            return false;
          }
        }
        return true;
      case "lead-form-privacy":
        if (leadFormMode === "create" && !privacyPolicyUrl.trim()) {
          toast.error(t("metaCampaigns.wizard.formPreview.privacyRequired"));
          return false;
        }
        return true;
      case "creative-text":
      case "preview-publish":
        return validateCreative();
      default:
        return true;
    }
  };

  const nextStep = async () => {
    if (!validateCurrentSub()) return;

    if (currentSubId === "lead-form-privacy" && leadFormMode === "create") {
      const ok = await createLeadFormQuick();
      if (!ok) return;
    }

    let nextIndex = Math.min(flatSteps.length - 1, currentFlatIndex + 1);

    if (
      currentSubId === "lead-form-select" &&
      leadFormMode === "existing" &&
      form.leadFormId
    ) {
      const creativeIdx = flatSteps.findIndex((s) => s.id === "creative-media");
      if (creativeIdx >= 0) nextIndex = creativeIdx;
    }

    if (nextIndex > currentFlatIndex) {
      goToFlatIndex(nextIndex);
    }
  };

  const prevStep = () => {
    if (currentFlatIndex <= 0) return;
    goToFlatIndex(currentFlatIndex - 1);
  };

  const jumpMain = (main: WizardMainStep) => {
    if (main >= mainStep) return;
    goToFlatIndex(findWizardIndex(main, 0, isLeads));
  };

  const jumpSub = (sub: number) => {
    if (sub > subStep) return;
    goToFlatIndex(findWizardIndex(mainStep, sub, isLeads));
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

  const loadPreviews = async (formats?: string[]) => {
    if (!businessId) return;
    if (!form.pageId || !form.primaryText.trim() || !form.headline.trim()) {
      return;
    }
    const requested = (formats?.length ? formats : selectedPreviewFormats).filter(
      Boolean
    );
    if (!requested.length) return;

    try {
      setPreviewBusy(true);
      const payload = buildFullPayload();
      // Active placement first so Meta's iframe for the selected spot loads ASAP.
      const ordered = [
        activePreview,
        ...requested.filter((item) => item !== activePreview),
      ];
      const result = await previewMetaAd(businessId, {
        ...payload,
        adFormats: ordered,
      });
      const rows = result.previews?.length
        ? result.previews
        : result.preview
          ? [result.preview]
          : [];
      setPreviews(rows);
      const activeOk = rows.find((row) => row.adFormat === activePreview)?.body;
      const firstOk = rows.find((row) => row.body)?.adFormat;
      if (!activeOk && firstOk) {
        setActivePreview(firstOk);
      }
      if (!rows.some((row) => row.body)) {
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
    if (isEdit) return;
    if (currentSubId !== "creative-text" && currentSubId !== "preview-publish") {
      return;
    }
    const timer = window.setTimeout(() => {
      if (form.pageId && form.primaryText.trim() && form.headline.trim()) {
        void loadPreviews(selectedPreviewFormats);
      }
    }, 800);
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isEdit,
    currentSubId,
    form.primaryText,
    form.headline,
    form.pageId,
    form.imageHash,
    activePreview,
    selectedPreviewFormats.join("|"),
  ]);

  const createLeadFormQuick = async (): Promise<boolean> => {
    if (!businessId || !form.pageId || !newFormName.trim()) {
      toast.error(t("metaCampaigns.form.leadFormNameRequired"));
      return false;
    }
    const validationError = validateLeadFormBuilder({
      contactTypes: leadContactTypes,
      customQuestions: leadCustomQuestions,
    });
    if (validationError) {
      toast.error(t(`metaCampaigns.form.${validationError}`));
      return false;
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
        privacyPolicyUrl: privacyPolicyUrl.trim() || undefined,
        thankYouTitle: thankYouTitle.trim() || undefined,
        thankYouBody: thankYouBody.trim() || undefined,
        thankYouUrl: form.link || undefined,
        thankYouButtonText: thankYouButton.trim() || undefined,
      });
      await loadLeadForms(form.pageId);
      if (result.form?.id) {
        updateField("leadFormId", result.form.id);
      }
      setNewFormName("");
      setLeadContactTypes(defaultSelectedLeadContactTypes());
      setLeadCustomQuestions([]);
      setLeadFormMode("existing");
      toast.success(t("metaCampaigns.toasts.leadFormCreated"));
      return true;
    } catch (error: any) {
      toast.error(
        error?.response?.data?.error ||
          error?.response?.data?.message ||
          t("metaCampaigns.errors.createLeadForm")
      );
      return false;
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

    if (!validateCreative()) return;
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

  const isLastFlatStep = currentFlatIndex >= flatSteps.length - 1;

  const navFooter = (
    <div className="flex justify-between gap-2 pt-2">
      <button
        type="button"
        onClick={prevStep}
        disabled={currentFlatIndex <= 0}
        className={btnSecondary}
      >
        {t("metaCampaigns.form.backStep")}
      </button>
      {isLastFlatStep ? (
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
        <button type="button" onClick={() => void nextStep()} className={btnPrimary}>
          {t("metaCampaigns.form.continue")}
          <ArrowRight className="h-4 w-4 rotate-180" />
        </button>
      )}
    </div>
  );

  const audiencePanelProps = {
    businessId,
    advantageAudience: form.advantageAudience,
    onAdvantageAudienceChange: (value: boolean) =>
      updateField("advantageAudience", value),
    locations: form.locations,
    onLocationsChange: (value: MetaLocationTarget[]) =>
      updateField("locations", value),
    locationMode: form.locationMode,
    onLocationModeChange: (value: "places" | "radius") =>
      updateField("locationMode", value),
    interests: form.interests,
    onInterestsChange: (value: MetaInterestTarget[]) =>
      updateField("interests", value),
    ageMin: form.ageMin,
    ageMax: form.ageMax,
    gender: form.gender,
    onAgeMinChange: (value: string) => updateField("ageMin", value),
    onAgeMaxChange: (value: string) => updateField("ageMax", value),
    onGenderChange: (value: "all" | "1" | "2") => updateField("gender", value),
  };

  const placementsBlock = (
    <>
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
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.facebookReels}
                  onChange={(e) => updateField("facebookReels", e.target.checked)}
                />
                {t("metaCampaigns.form.posFacebookReels")}
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
      {(form.imagePreviewUrl || form.primaryText) && (
        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3">
          <p className="mb-2 text-xs font-black text-slate-500">
            {t("metaCampaigns.preview.localTitle")}
          </p>
          <div className="max-w-[280px]">{placementPreview}</div>
        </div>
      )}
    </>
  );

  const leadFormPreviewAside = (
    <aside className={`${cardBase} p-4`}>
      <div className="mb-3 flex flex-wrap gap-1.5">
        {(["intro", "questions", "privacy", "thanks"] as const).map((screen) => (
          <button
            key={screen}
            type="button"
            onClick={() => setFormPreviewScreen(screen)}
            className={[
              "rounded-full border px-2.5 py-1 text-[10px] font-black",
              formPreviewScreen === screen
                ? "border-[#1877F2] bg-[#1877F2] text-white"
                : "border-slate-200 bg-white text-slate-500",
            ].join(" ")}
          >
            {t(`metaCampaigns.wizard.formPreview.screen.${screen}`)}
          </button>
        ))}
      </div>
      <MetaLeadFormLivePreview
        pageName={selectedPageName}
        introTitle={introTitle}
        introDescription={introDescription}
        contactFields={leadFormContactLabels}
        customQuestions={leadCustomQuestions}
        privacyLinkText={t("metaCampaigns.wizard.formPreview.privacyLinkPlaceholder")}
        thankYouTitle={thankYouTitle}
        thankYouBody={thankYouBody}
        thankYouButton={thankYouButton}
        screen={formPreviewScreen}
        platform={
          form.placementMode === "instagram"
            ? "instagram"
            : "facebook"
        }
      />
    </aside>
  );

  const renderCreateSubContent = () => {
    switch (currentSubId) {
      case "objective":
        return (
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
        );

      case "details":
        return (
          <div className="space-y-4">
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
          </div>
        );

      case "budget":
        return (
          <div className="grid gap-4 sm:grid-cols-2">
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
        );

      case "schedule":
        return (
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
          </div>
        );

      case "review-campaign":
        return (
          <div className="space-y-4">
            <dl className="grid gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-xs font-bold text-slate-400">
                  {t("metaCampaigns.form.objective")}
                </dt>
                <dd className="font-black text-slate-900">{selectedObjective?.label}</dd>
              </div>
              <div>
                <dt className="text-xs font-bold text-slate-400">
                  {t("metaCampaigns.form.name")}
                </dt>
                <dd className="font-black text-slate-900">{form.name || "—"}</dd>
              </div>
              <div>
                <dt className="text-xs font-bold text-slate-400">
                  {t("metaCampaigns.form.page")}
                </dt>
                <dd className="font-black text-slate-900">{selectedPageName}</dd>
              </div>
              <div>
                <dt className="text-xs font-bold text-slate-400">
                  {t("metaCampaigns.form.dailyBudget")}
                </dt>
                <dd className="font-black text-slate-900">
                  {form.dailyBudget
                    ? formatCurrency(Number(form.dailyBudget), currency)
                    : form.lifetimeBudget
                      ? formatCurrency(Number(form.lifetimeBudget), currency)
                      : "—"}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-bold text-slate-400">
                  {t("metaCampaigns.form.startTime")}
                </dt>
                <dd className="font-black text-slate-900">
                  {form.startTime
                    ? new Date(form.startTime).toLocaleString(isHe ? "he-IL" : "en-US")
                    : "—"}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-bold text-slate-400">
                  {t("metaCampaigns.form.stopTime")}
                </dt>
                <dd className="font-black text-slate-900">
                  {form.stopTime
                    ? new Date(form.stopTime).toLocaleString(isHe ? "he-IL" : "en-US")
                    : "—"}
                </dd>
              </div>
            </dl>
            <ul className="space-y-2 text-sm font-semibold text-slate-600">
              <li className="flex items-center gap-2">
                <span className={form.name.trim() && form.pageId ? "text-emerald-600" : "text-amber-600"}>●</span>
                {t("metaCampaigns.wizard.review.checkDetails")}
              </li>
              <li className="flex items-center gap-2">
                <span className={form.dailyBudget || form.lifetimeBudget ? "text-emerald-600" : "text-amber-600"}>●</span>
                {t("metaCampaigns.wizard.review.checkBudget")}
              </li>
              <li className="flex items-center gap-2">
                <span className={form.startTime ? "text-emerald-600" : "text-amber-600"}>●</span>
                {t("metaCampaigns.wizard.review.checkSchedule")}
              </li>
            </ul>
          </div>
        );

      case "audience-mode":
        return (
          <MetaAudienceTargetingPanel section="mode" {...audiencePanelProps} />
        );

      case "locations":
        return (
          <MetaAudienceTargetingPanel section="locations" {...audiencePanelProps} />
        );

      case "demographics":
        return (
          <MetaAudienceTargetingPanel section="demographics" {...audiencePanelProps} />
        );

      case "interests":
        return (
          <MetaAudienceTargetingPanel section="interests" {...audiencePanelProps} />
        );

      case "placements":
        return placementsBlock;

      case "saved-audiences":
        return businessId ? (
          <MetaSavedAudiences
            businessId={businessId}
            current={audienceSnapshot}
            onLoad={applyAudienceSnapshot}
          />
        ) : null;

      case "identity":
        return (
          <div className="space-y-3 rounded-2xl border border-slate-100 bg-slate-50 p-4">
            <p className="text-sm font-black text-slate-900">
              {t("metaCampaigns.form.page")}: {selectedPageName}
            </p>
            <p className="text-xs font-semibold text-slate-500">
              {t("metaCampaigns.wizard.identity.formsNote")}
            </p>
            <p className="text-xs font-semibold text-slate-500">
              {t("metaCampaigns.form.status")}: {form.status}
            </p>
          </div>
        );

      case "lead-form-select":
        return (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setLeadFormMode("existing")}
                className={[
                  "rounded-xl border px-4 py-2 text-sm font-black",
                  leadFormMode === "existing"
                    ? "border-[#1877F2] bg-[#1877F2]/5 text-[#1877F2]"
                    : "border-slate-200 bg-white text-slate-700",
                ].join(" ")}
              >
                {t("metaCampaigns.wizard.leadForm.useExisting")}
              </button>
              <button
                type="button"
                onClick={() => setLeadFormMode("create")}
                className={[
                  "rounded-xl border px-4 py-2 text-sm font-black",
                  leadFormMode === "create"
                    ? "border-[#1877F2] bg-[#1877F2]/5 text-[#1877F2]"
                    : "border-slate-200 bg-white text-slate-700",
                ].join(" ")}
              >
                {t("metaCampaigns.wizard.leadForm.createNew")}
              </button>
            </div>
            {leadFormMode === "existing" ? (
              <>
                <button
                  type="button"
                  className={btnSecondary}
                  disabled={formsBusy}
                  onClick={() => loadLeadForms()}
                >
                  {formsBusy ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  {t("metaCampaigns.form.refreshLeadForms")}
                </button>
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
                      {selectedForm.questions.map((q) => (
                        <li key={q.key || q.id || `${q.type}-${q.label}`}>
                          {resolveQuestionLabel(q)}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </>
            ) : (
              <p className="text-sm font-semibold text-slate-500">
                {t("metaCampaigns.wizard.leadForm.createHint")}
              </p>
            )}
          </div>
        );

      case "lead-form-setup":
        return (
          <div className="space-y-4">
            <label className="block">
              <span className="mb-1.5 block text-xs font-black text-slate-500">
                {t("metaCampaigns.form.leadFormNamePlaceholder")}
              </span>
              <input
                className={inputBase}
                value={newFormName}
                onChange={(e) => setNewFormName(e.target.value)}
                placeholder={t("metaCampaigns.form.leadFormNamePlaceholder")}
              />
            </label>
            <div className="space-y-2">
              <p className="text-xs font-black text-slate-500">
                {t("metaCampaigns.wizard.leadForm.formType")}
              </p>
              <label className="flex items-center gap-2 text-sm font-semibold">
                <input
                  type="radio"
                  checked={formType === "volume"}
                  onChange={() => setFormType("volume")}
                />
                {t("metaCampaigns.wizard.leadForm.typeVolume")}
              </label>
              <label className="flex items-center gap-2 text-sm font-semibold">
                <input
                  type="radio"
                  checked={formType === "intent"}
                  onChange={() => setFormType("intent")}
                />
                {t("metaCampaigns.wizard.leadForm.typeIntent")}
              </label>
              {formType === "intent" ? (
                <p className="text-xs font-semibold text-slate-500">
                  {t("metaCampaigns.wizard.leadForm.intentNote")}
                </p>
              ) : null}
            </div>
          </div>
        );

      case "lead-form-intro":
        return (
          <div className="space-y-4">
            <label className="block">
              <span className="mb-1.5 block text-xs font-black text-slate-500">
                {t("metaCampaigns.wizard.leadForm.introTitle")}
              </span>
              <input
                className={inputBase}
                value={introTitle}
                onChange={(e) => setIntroTitle(e.target.value)}
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-black text-slate-500">
                {t("metaCampaigns.wizard.leadForm.introDescription")}
              </span>
              <textarea
                className={`${inputBase} min-h-[96px]`}
                value={introDescription}
                onChange={(e) => setIntroDescription(e.target.value)}
              />
            </label>
          </div>
        );

      case "lead-form-questions":
        return (
          <LeadFormQuestionBuilder
            contactTypes={leadContactTypes}
            customQuestions={leadCustomQuestions}
            onContactTypesChange={setLeadContactTypes}
            onCustomQuestionsChange={setLeadCustomQuestions}
            disabled={formsBusy}
          />
        );

      case "lead-form-privacy":
        return (
          <div className="space-y-4">
            <label className="block">
              <span className="mb-1.5 block text-xs font-black text-slate-500">
                {t("metaCampaigns.wizard.leadForm.privacyUrl")}
              </span>
              <input
                className={inputBase}
                value={privacyPolicyUrl}
                onChange={(e) => setPrivacyPolicyUrl(e.target.value)}
                placeholder="https://"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-black text-slate-500">
                {t("metaCampaigns.wizard.leadForm.thankYouTitle")}
              </span>
              <input
                className={inputBase}
                value={thankYouTitle}
                onChange={(e) => setThankYouTitle(e.target.value)}
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-black text-slate-500">
                {t("metaCampaigns.wizard.leadForm.thankYouBody")}
              </span>
              <textarea
                className={`${inputBase} min-h-[72px]`}
                value={thankYouBody}
                onChange={(e) => setThankYouBody(e.target.value)}
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-black text-slate-500">
                {t("metaCampaigns.wizard.leadForm.thankYouButton")}
              </span>
              <input
                className={inputBase}
                value={thankYouButton}
                onChange={(e) => setThankYouButton(e.target.value)}
              />
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setFormPreviewScreen("privacy")}
                className={btnSecondary}
              >
                {t("metaCampaigns.wizard.formPreview.screen.privacy")}
              </button>
              <button
                type="button"
                onClick={() => setFormPreviewScreen("thanks")}
                className={btnSecondary}
              >
                {t("metaCampaigns.wizard.formPreview.screen.thanks")}
              </button>
            </div>
          </div>
        );

      case "creative-media":
        return (
          <div className="space-y-4">
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
                    className="space-y-3 rounded-2xl border border-slate-200 p-4"
                  >
                    <p className="text-sm font-black text-slate-800">
                      {t("metaCampaigns.form.carouselCard", { n: index + 1 })}
                    </p>
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
          </div>
        );

      case "creative-crop":
        return (
          <div className="space-y-3">
            <MetaPlacementCropPreview
              imageUrl={form.imagePreviewUrl}
              selectedFormats={selectedPreviewFormats}
            />
            <p className="text-xs font-semibold text-slate-500">
              {t("metaCampaigns.wizard.crop.autoFitNote")}
            </p>
          </div>
        );

      case "creative-text":
        return (
          <div className="space-y-4">
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
          </div>
        );

      case "preview-publish":
        return (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-slate-500">
                  {t("metaCampaigns.preview.postReadyHint")}
                </p>
              </div>
              <button
                type="button"
                className={btnSecondary}
                disabled={previewBusy}
                onClick={() => loadPreviews()}
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
                  onClick={() => {
                    setActivePreview(item.value);
                    const existing = previews.find(
                      (row) => row.adFormat === item.value && row.body
                    );
                    if (!existing) {
                      void loadPreviews([
                        item.value,
                        ...selectedPreviewFormats.filter((f) => f !== item.value),
                      ]);
                    }
                  }}
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
              <p className="mb-2 text-center text-xs font-black uppercase tracking-wide text-[#1877F2]">
                {t("metaCampaigns.preview.metaOfficial")}
              </p>
              <p className="mb-4 text-center text-xs font-semibold text-slate-500">
                {previewFormats.find((item) => item.value === activePreview)?.label ||
                  activePreview}
              </p>
              {activePreviewHtml ? (
                <div
                  className="mx-auto max-w-[420px] overflow-auto rounded-2xl border border-slate-200 bg-white p-2 shadow-sm"
                  dangerouslySetInnerHTML={{ __html: activePreviewHtml }}
                />
              ) : previewBusy ? (
                <div className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-slate-200 bg-slate-50 px-3 py-10 text-sm font-semibold text-slate-500">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {t("metaCampaigns.preview.loading")}
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-3 py-3 text-center text-xs font-semibold text-slate-500">
                    {t("metaCampaigns.preview.localIsPrimary")}
                  </p>
                  {placementPreview}
                </div>
              )}
            </div>

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
          </div>
        );

      default:
        return null;
    }
  };

  const isLeadFormSub =
    currentSubId.startsWith("lead-form-") && currentSubId !== "lead-form-select";
  const useLeadFormLayout =
    isLeadFormSub ||
    (currentSubId === "lead-form-select" && leadFormMode === "create");
  const useCreativeTextLayout = currentSubId === "creative-text";
  const usePreviewLayout = currentSubId === "preview-publish";

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
        <>
          <MetaWizardNav
            mainStep={mainStep}
            subStep={subStep}
            isLeads={isLeads}
            onJumpMain={jumpMain}
            onJumpSub={jumpSub}
          />

          <div
            className={
              useLeadFormLayout || useCreativeTextLayout || usePreviewLayout
                ? `grid gap-4 ${
                    usePreviewLayout
                      ? "xl:grid-cols-[minmax(0,1fr)_360px]"
                      : "xl:grid-cols-[1fr_340px]"
                  }`
                : ""
            }
          >
            <div className={`${cardBase} space-y-4 p-5`}>
              {currentSubDef ? (
                <div>
                  <p className="text-lg font-black text-slate-900">
                    {t(currentSubDef.titleKey)}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-slate-500">
                    {t(currentSubDef.hintKey)}
                  </p>
                </div>
              ) : null}
              {mainStep === 2 ? (
                <MetaAudienceHealthBanner
                  locations={form.locations}
                  interests={form.interests}
                  ageMin={form.ageMin}
                  ageMax={form.ageMax}
                  gender={form.gender}
                  advantageAudience={form.advantageAudience}
                  placementMode={form.placementMode}
                />
              ) : null}
              {renderCreateSubContent()}
              {navFooter}
            </div>

            {useLeadFormLayout ? leadFormPreviewAside : null}

            {useCreativeTextLayout ? (
              <aside className={`${cardBase} sticky top-4 self-start p-4`}>
                <p className="mb-3 text-sm font-black text-slate-900">
                  {t("metaCampaigns.preview.localTitle")}
                </p>
                {placementPreview}
                <p className="mt-3 text-xs font-semibold text-slate-500">
                  {t("metaCampaigns.form.accountId", { id: accountIdLabel || "—" })} ·{" "}
                  {currency}
                </p>
              </aside>
            ) : null}

            {usePreviewLayout ? (
              <aside className="space-y-4">
                <div className={`${cardBase} p-4`}>
                  <p className="mb-3 text-sm font-black text-slate-900">
                    {t("metaCampaigns.preview.selectedPlacement")}
                  </p>
                  <p className="mb-3 text-xs font-semibold text-slate-500">
                    {previewFormats.find((item) => item.value === activePreview)
                      ?.label || activePreview}
                  </p>
                  {activePreviewHtml ? (
                    <div
                      className="overflow-auto rounded-xl border border-slate-200 bg-white p-1"
                      dangerouslySetInnerHTML={{ __html: activePreviewHtml }}
                    />
                  ) : (
                    placementPreview
                  )}
                </div>
              </aside>
            ) : null}
          </div>
        </>
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
