import React, { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Check, Loader2, Settings, X } from "lucide-react";
import { toast } from "react-toastify";
import {
  createMetaLeadForm,
  saveMetaLeadFormDraft,
  syncMetaLeadForm,
  type MetaLeadFormWriteResult,
} from "../../../../../api/metaCampaignsApi";
import {
  type LeadFormDuplicateSeed,
} from "./leadFormDuplicateSeed";
import PageWhatsAppNumberPicker from "./PageWhatsAppNumberPicker";
import LeadFormQuestionBuilder from "../LeadFormQuestionBuilder";
import MetaLeadFormLivePreview from "../MetaLeadFormLivePreview";
import {
  buildMetaLeadFormQuestionsPayload,
  createLeadFormCustomQuestion,
  defaultSelectedLeadContactTypes,
  validateLeadFormBuilder,
  type LeadFormCustomQuestionDraft,
} from "../metaCampaignUtils";
import AdsManagerFormSettingsModal, {
  type FormSharing,
  type FormTrackingParam,
} from "./AdsManagerFormSettingsModal";
import { defaultLeadFormLocale, formLocaleToAppLng, isRtlLeadFormLocale } from "./metaLeadFormLocales";
import i18n from "../../../../../i18n/i18n";
import { metaBtnPrimary, metaBtnSecondary, metaInputClass } from "./metaAdsUi";

type AdditionalAction = "website" | "file" | "call" | "whatsapp";

function isLeadFormHttpsUrl(value: string) {
  const raw = value.trim();
  if (!raw) return false;
  try {
    const url = new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function isLeadFormPhone(value: string) {
  const digits = value.replace(/\D/g, "");
  return digits.length >= 8 && digits.length <= 15;
}

const ADDITIONAL_ACTION_IDS: AdditionalAction[] = [
  "website",
  "file",
  "call",
  "whatsapp",
];

const ADDITIONAL_ACTION_KEYS: Record<
  AdditionalAction,
  { title: string; description: string }
> = {
  website: { title: "goToWebsite", description: "goToWebsiteDesc" },
  file: { title: "viewFile", description: "viewFileDesc" },
  call: { title: "callBusiness", description: "callBusinessDesc" },
  whatsapp: { title: "chatWhatsapp", description: "chatWhatsappDesc" },
};

type Step = "type" | "intro" | "questions" | "privacy" | "ending";

const STEP_IDS: Step[] = ["type", "intro", "questions", "privacy", "ending"];

const STEP_KEYS: Record<Step, string> = {
  type: "stepFormType",
  intro: "stepIntro",
  questions: "stepQuestions",
  privacy: "stepPrivacy",
  ending: "stepEnding",
};

type CreatedLeadForm = {
  id: string;
  name: string;
  pageId: string;
};

type FormBanner = {
  tone: "success" | "error" | "progress";
  text: string;
  detail?: string;
  recoverFormId?: string;
  /** A saved local draft stays editable and can still be created. */
  blocksCreate?: boolean;
};

type Props = {
  open: boolean;
  businessId: string | null;
  pageId: string;
  pageName: string;
  publishId?: string;
  adDraftId?: string;
  mode?: "create" | "duplicate";
  initialDraft?: LeadFormDuplicateSeed | null;
  onClose: () => void;
  onCreated: (form: CreatedLeadForm) => void | Promise<void>;
  onDraftSaved?: () => void | Promise<void>;
};

export default function AdsManagerCreateLeadFormModal({
  open,
  businessId,
  pageId,
  pageName,
  publishId,
  adDraftId,
  mode = "create",
  initialDraft = null,
  onClose,
  onCreated,
  onDraftSaved,
}: Props) {
  const { t } = useTranslation();
  const cc = React.useCallback(
    (key: string, opts?: Record<string, unknown>) =>
      t(`metaCampaigns.adsManager.chrome.${key}`, opts as never),
    [t]
  );
  const STEPS = useMemo(
    () => STEP_IDS.map((id) => ({ id, label: cc(STEP_KEYS[id]) })),
    [cc]
  );
  const ADDITIONAL_ACTIONS = useMemo(
    () =>
      ADDITIONAL_ACTION_IDS.map((id) => ({
        id,
        title: cc(ADDITIONAL_ACTION_KEYS[id].title),
        description: cc(ADDITIONAL_ACTION_KEYS[id].description),
      })),
    [cc]
  );
  const [step, setStep] = useState<Step>("type");
  const [busy, setBusy] = useState(false);
  const [banner, setBanner] = useState<FormBanner | null>(null);
  const submitLock = useRef(false);
  const idempotencyKeyRef = useRef("");
  const wasOpenRef = useRef(false);
  const [formType, setFormType] = useState<"volume" | "intent" | "rich">(
    "volume"
  );
  const [requireSms, setRequireSms] = useState(false);
  const [name, setName] = useState(() =>
    t("metaCampaigns.adsManager.chrome.untitledForm", {
      when: new Date().toLocaleString(),
    })
  );
  const [introTitle, setIntroTitle] = useState(() =>
    t("metaCampaigns.adsManager.chrome.defaultIntroTitle")
  );
  const [introDescription, setIntroDescription] = useState(() =>
    t("metaCampaigns.adsManager.chrome.defaultIntroBody")
  );
  const [privacyUrl, setPrivacyUrl] = useState("");
  const [thankYouTitle, setThankYouTitle] = useState(() =>
    t("metaCampaigns.adsManager.chrome.defaultThanksTitle")
  );
  const [thankYouBody, setThankYouBody] = useState(() =>
    t("metaCampaigns.adsManager.chrome.defaultThanksBody")
  );
  const [thankYouButton, setThankYouButton] = useState(() =>
    t("leftover.instantForm.quoteCta", "Send a message to get a quote")
  );
  const [additionalAction, setAdditionalAction] =
    useState<AdditionalAction>("website");
  const [thankYouLink, setThankYouLink] = useState("");
  const [callPhone, setCallPhone] = useState("");
  const [whatsappPhone, setWhatsappPhone] = useState("");
  const [contactTypes, setContactTypes] = useState<string[]>(() =>
    defaultSelectedLeadContactTypes()
  );
  const [customQuestions, setCustomQuestions] = useState<
    LeadFormCustomQuestionDraft[]
  >(() => [createLeadFormCustomQuestion()]);
  const [previewPlatform, setPreviewPlatform] = useState<
    "facebook" | "instagram"
  >("facebook");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [locale, setLocale] = useState(defaultLeadFormLocale);
  const [sharing, setSharing] = useState<FormSharing>("restricted");
  const [contactFieldKeys, setContactFieldKeys] = useState<
    Record<string, string>
  >({});
  const [trackingParameters, setTrackingParameters] = useState<
    FormTrackingParam[]
  >([]);
  const [sourceFormId, setSourceFormId] = useState("");
  const initialDraftRef = useRef(initialDraft);
  initialDraftRef.current = initialDraft;

  const blankName = () =>
    t("metaCampaigns.adsManager.chrome.untitledForm", {
      when: new Date().toLocaleString(),
    });

  const applyDuplicateSeed = (seed: LeadFormDuplicateSeed) => {
    setStep("type");
    setFormType(seed.formType || "volume");
    setRequireSms(Boolean(seed.requireSms));
    setName(seed.name ?? blankName());
    setIntroTitle(seed.introTitle || "");
    setIntroDescription(seed.introDescription || "");
    setPrivacyUrl(seed.privacyUrl || "");
    setThankYouTitle(seed.thankYouTitle || "");
    setThankYouBody(seed.thankYouBody || "");
    setThankYouButton(seed.thankYouButton || "");
    setAdditionalAction(seed.additionalAction || "website");
    setThankYouLink(seed.thankYouLink || "");
    setCallPhone(seed.callPhone || "");
    setWhatsappPhone(seed.whatsappPhone || "");
    setContactTypes(seed.contactTypes?.length ? [...seed.contactTypes] : []);
    setCustomQuestions(
      seed.customQuestions?.length
        ? seed.customQuestions.map((question) => createLeadFormCustomQuestion(question))
        : []
    );
    setLocale(seed.locale || defaultLeadFormLocale());
    setSharing(seed.sharing || "restricted");
    setContactFieldKeys(seed.contactFieldKeys ? { ...seed.contactFieldKeys } : {});
    setTrackingParameters(
      (seed.trackingParameters || []).map((row, index) => ({
        id: row.id || `track_${index + 1}`,
        key: row.key,
        value: row.value,
      }))
    );
    setSourceFormId(seed.sourceFormId || "");
    idempotencyKeyRef.current = seed.idempotencyKey || "";
  };

  const resetBlankForm = () => {
    setStep("type");
    setFormType("volume");
    setRequireSms(false);
    setName(blankName());
    setIntroTitle(t("metaCampaigns.adsManager.chrome.defaultIntroTitle"));
    setIntroDescription(t("metaCampaigns.adsManager.chrome.defaultIntroBody"));
    setPrivacyUrl("");
    setThankYouTitle(t("metaCampaigns.adsManager.chrome.defaultThanksTitle"));
    setThankYouBody(t("metaCampaigns.adsManager.chrome.defaultThanksBody"));
    setThankYouButton(
      t("leftover.instantForm.quoteCta", "Send a message to get a quote")
    );
    setAdditionalAction("website");
    setThankYouLink("");
    setCallPhone("");
    setWhatsappPhone("");
    setContactTypes(defaultSelectedLeadContactTypes());
    setCustomQuestions([createLeadFormCustomQuestion()]);
    setLocale(defaultLeadFormLocale());
    setSharing("restricted");
    setContactFieldKeys({});
    setTrackingParameters([]);
    setSourceFormId("");
    idempotencyKeyRef.current = "";
  };

  useEffect(() => {
    if (open && !wasOpenRef.current) {
      setBanner(null);
      setBusy(false);
      submitLock.current = false;
      if (mode === "duplicate" && initialDraftRef.current) {
        applyDuplicateSeed(initialDraftRef.current);
      } else {
        resetBlankForm();
      }
    }
    wasOpenRef.current = open;
  }, [open, mode]);

  useEffect(() => {
    if (additionalAction === "whatsapp" && !thankYouButton.trim()) {
      setThankYouButton(
        t("leftover.instantForm.quoteCta", "Send a message to get a quote")
      );
    }
  }, [additionalAction, thankYouButton, t]);

  const stepIndex = STEPS.findIndex((s) => s.id === step);

  const previewScreenForStep = useMemo(() => {
    if (step === "intro" || step === "type") return "intro" as const;
    if (step === "questions") return "questions" as const;
    if (step === "privacy") return "privacy" as const;
    return "thanks" as const;
  }, [step]);

  if (!open) return null;

  const goNext = () => {
    const next = STEPS[stepIndex + 1];
    if (next) setStep(next.id);
  };
  const goBack = () => {
    const prev = STEPS[stepIndex - 1];
    if (prev) setStep(prev.id);
  };

  const showBanner = (next: FormBanner) => {
    setBanner(next);
    if (next.tone === "success") toast.success(next.text);
    if (next.tone === "error") toast.error(next.text);
  };

  const requestErrorMessage = (error: unknown) => {
    const err = error as {
      response?: { data?: { error?: string; message?: string } };
      message?: string;
    };
    return (
      err.response?.data?.error ||
      err.response?.data?.message ||
      (err.response ? "" : t("metaCampaigns.adsToasts.leadFormNetwork")) ||
      err.message ||
      t("metaCampaigns.adsToasts.leadFormFailed")
    );
  };

  const metaConfirmed = (result: MetaLeadFormWriteResult) => {
    const formId = result.form?.id;
    if (!formId) return false;
    if (result.demoSafe) return result.savedLocally !== false;
    if (result.confirmedByMeta === false) return false;
    return result.confirmedByMeta === true || result.confirmedByMeta == null;
  };

  const finishCreated = async (result: MetaLeadFormWriteResult) => {
    const formId = result.form?.id || "";
    const formName = result.form?.name || name.trim();
    const savedPageId = result.form?.pageId || pageId;
    if (!metaConfirmed(result) || !formId) {
      showBanner({
        tone: "error",
        text: t("metaCampaigns.adsToasts.noFormId"),
      });
      return false;
    }
    if (!result.demoSafe && result.savedLocally === false) {
      showBanner({
        tone: "error",
        text: t("metaCampaigns.adsToasts.leadFormLocalSaveFailed"),
        recoverFormId: formId,
      });
      return false;
    }
    const text = result.recovered
      ? t("metaCampaigns.adsToasts.leadFormRecovered")
      : t("metaCampaigns.adsToasts.leadFormCreated");
    showBanner({
      tone: "success",
      text,
      detail:
        !result.demoSafe && result.leadIntake && result.leadIntake.active === false
          ? t("metaCampaigns.adsToasts.leadFormIntakeOff")
          : undefined,
    });
    await onCreated({ id: formId, name: formName, pageId: savedPageId });
    return true;
  };

  const handleSync = async (formId: string) => {
    if (!businessId || !formId || submitLock.current) return;
    submitLock.current = true;
    setBusy(true);
    setBanner({
      tone: "progress",
      text: t("metaCampaigns.adsToasts.leadFormSyncing"),
    });
    try {
      const result = await syncMetaLeadForm(businessId, {
        pageId,
        formId,
        name: name.trim(),
        idempotencyKey: idempotencyKeyRef.current || undefined,
        publishId: mode === "duplicate" ? undefined : publishId || undefined,
        adDraftId: mode === "duplicate" ? undefined : adDraftId || undefined,
      });
      await finishCreated(result);
    } catch (error: unknown) {
      showBanner({
        tone: "error",
        text: requestErrorMessage(error),
        recoverFormId: formId,
      });
    } finally {
      submitLock.current = false;
      setBusy(false);
    }
  };

  const ensureIdempotencyKey = () => {
    if (!idempotencyKeyRef.current) {
      idempotencyKeyRef.current =
        typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : `form-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    }
    return idempotencyKeyRef.current;
  };

  const editorSnapshot = (): LeadFormDuplicateSeed => ({
    sourceFormId,
    idempotencyKey: ensureIdempotencyKey(),
    name: name.trim(),
    formType,
    requireSms,
    introTitle,
    introDescription,
    privacyUrl,
    thankYouTitle,
    thankYouBody,
    thankYouButton,
    additionalAction,
    thankYouLink,
    callPhone,
    whatsappPhone,
    locale,
    sharing,
    contactTypes: [...contactTypes],
    customQuestions: customQuestions.map((question) => ({ ...question })),
    contactFieldKeys: { ...contactFieldKeys },
    trackingParameters: trackingParameters.map((row) => ({ ...row })),
  });

  const handleSaveDraft = async () => {
    if (mode !== "duplicate" || submitLock.current) return;
    if (!businessId) {
      showBanner({ tone: "error", text: cc("identifyBusiness") });
      return;
    }
    if (!pageId || !sourceFormId) {
      showBanner({ tone: "error", text: t("metaCampaigns.adsToasts.selectPageFirst") });
      return;
    }
    submitLock.current = true;
    setBusy(true);
    try {
      const editor = editorSnapshot();
      await saveMetaLeadFormDraft(businessId, {
        pageId,
        sourceFormId,
        name: editor.name,
        editor,
      });
      showBanner({
        tone: "success",
        text: cc("formDraftSaved"),
        blocksCreate: false,
      });
      await onDraftSaved?.();
    } catch (error: unknown) {
      showBanner({ tone: "error", text: requestErrorMessage(error) });
    } finally {
      submitLock.current = false;
      setBusy(false);
    }
  };

  const handleSave = async () => {
    if (submitLock.current) return;
    submitLock.current = true;
    const fail = (text: string, nextStep?: Step) => {
      showBanner({ tone: "error", text });
      if (nextStep) setStep(nextStep);
      submitLock.current = false;
    };
    if (!businessId) {
      fail(cc("identifyBusiness"));
      return;
    }
    if (!pageId) {
      fail(t("metaCampaigns.adsToasts.selectPageFirst"));
      return;
    }
    if (!name.trim()) {
      fail(t("metaCampaigns.adsToasts.formNameRequired"));
      return;
    }
    if (!introTitle.trim()) {
      fail(t("metaCampaigns.adsToasts.introRequired"));
      return;
    }
    const validationError = validateLeadFormBuilder({
      contactTypes,
      customQuestions,
    });
    if (validationError) {
      fail(t("metaCampaigns.adsToasts.needQuestion"), "questions");
      return;
    }
    if (!thankYouTitle.trim()) {
      fail(t("metaCampaigns.adsToasts.thankYouRequired"), "ending");
      return;
    }
    if (additionalAction === "whatsapp" && !isLeadFormPhone(whatsappPhone)) {
      fail(t("metaCampaigns.adsToasts.needWhatsapp"), "ending");
      return;
    }
    if (additionalAction === "website" && !isLeadFormHttpsUrl(thankYouLink)) {
      fail(t("metaCampaigns.adsToasts.needWebsiteUrl"), "ending");
      return;
    }
    if (additionalAction === "file" && !isLeadFormHttpsUrl(thankYouLink)) {
      fail(t("metaCampaigns.adsToasts.needFileUrl"), "ending");
      return;
    }
    if (additionalAction === "call" && !isLeadFormPhone(callPhone)) {
      fail(t("metaCampaigns.adsToasts.needCallPhone"), "ending");
      return;
    }

    ensureIdempotencyKey();

    let succeeded = false;
    try {
      setBusy(true);
      setBanner({
        tone: "progress",
        text: t("metaCampaigns.adsManager.chrome.creatingForm"),
      });
      const questions = buildMetaLeadFormQuestionsPayload({
        contactTypes,
        customQuestions,
        contactFieldKeys,
      });
      const result = await createMetaLeadForm(businessId, {
        pageId,
        name: name.trim(),
        locale,
        sharing,
        questions,
        trackingParameters: trackingParameters.map((row) => ({
          key: row.key.trim(),
          value: row.value.trim(),
        })),
        introTitle: introTitle.trim(),
        introDescription: introDescription.trim() || undefined,
        privacyPolicyUrl: privacyUrl.trim() || undefined,
        privacyPolicyLinkText: i18n.t("leftover.instantForm.privacy", {
          lng: formLocaleToAppLng(locale),
          defaultValue: t("metaCampaigns.adsManager.chrome.privacyPolicy"),
        }),
        thankYouTitle: thankYouTitle.trim(),
        thankYouBody: thankYouBody.trim() || undefined,
        thankYouButtonText: thankYouButton.trim() || undefined,
        thankYouUrl: thankYouLink.trim() || undefined,
        additionalAction,
        whatsappPhone: whatsappPhone.trim() || undefined,
        callPhone: callPhone.trim() || undefined,
        idempotencyKey: idempotencyKeyRef.current,
        ...(mode === "duplicate"
          ? {}
          : {
              publishId: publishId || undefined,
              adDraftId: adDraftId || undefined,
            }),
      });
      const createdId = result.form?.id || "";
      if (mode === "duplicate" && sourceFormId && createdId === sourceFormId) {
        showBanner({ tone: "error", text: cc("duplicateNeedsNewName") });
      } else {
        succeeded = await finishCreated(result);
        if (succeeded && mode === "duplicate" && sourceFormId) {
          await saveMetaLeadFormDraft(businessId, {
            pageId,
            sourceFormId,
            discard: true,
          }).catch(() => undefined);
        }
      }
    } catch (error: unknown) {
      showBanner({ tone: "error", text: requestErrorMessage(error) });
    } finally {
      if (!succeeded) submitLock.current = false;
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[2000] flex items-stretch justify-center bg-black/45 p-2 sm:p-4">
      <div
        className="flex h-full max-h-[920px] w-full max-w-[1180px] flex-col overflow-hidden rounded-xl bg-white shadow-2xl"
        dir="ltr"
      >
        <header className="flex items-center justify-between border-b border-[#CED0D4] px-4 py-3">
          <h2 className="text-[17px] font-bold text-[#050505]">
            {mode === "duplicate" ? cc("duplicateFormTitle") : cc("createFormTitle")}
          </h2>
          <div className="flex items-center gap-1">
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[13px] font-semibold text-[#050505] hover:bg-[#F0F2F5]"
              onClick={() => setSettingsOpen(true)}
            >
              <Settings className="h-4 w-4 text-[#65676B]" />
              {cc("settings")}
            </button>
            <button
              type="button"
              className="rounded-md p-1.5 text-[#65676B] hover:bg-[#F0F2F5]"
              onClick={onClose}
              aria-label={cc("close")}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </header>

        <div className="grid min-h-0 flex-1 grid-cols-1 md:grid-cols-[200px_minmax(0,1fr)_300px]">
          {/* Left steps */}
          <nav className="border-r border-[#E4E6EB] bg-[#F7F8FA] px-3 py-4">
            <p className="mb-3 px-2 text-[12px] font-bold uppercase tracking-wide text-[#65676B]">
              {cc("createFormTitle")}
            </p>
            <ol className="space-y-1">
              {STEPS.map((item, index) => {
                const done = index < stepIndex;
                const active = item.id === step;
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      data-testid={`lead-form-step-${item.id}`}
                      onClick={() => setStep(item.id)}
                      className={[
                        "flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-[13px] font-semibold",
                        active
                          ? "bg-[#E7F3FF] text-[#1877F2]"
                          : "text-[#050505] hover:bg-white",
                      ].join(" ")}
                    >
                      <span
                        className={[
                          "flex h-5 w-5 items-center justify-center rounded-full border text-[11px]",
                          done || active
                            ? "border-[#1877F2] bg-[#1877F2] text-white"
                            : "border-[#CED0D4] text-[#65676B]",
                        ].join(" ")}
                      >
                        {done ? <Check className="h-3 w-3" /> : index + 1}
                      </span>
                      {item.label}
                    </button>
                  </li>
                );
              })}
            </ol>
          </nav>

          {/* Center config */}
          <div
            className="min-h-0 overflow-y-auto px-4 py-4 sm:px-6"
            dir={isRtlLeadFormLocale(locale) ? "rtl" : "ltr"}
          >
            {step === "type" ? (
              <div className="space-y-4">
                <MetaFieldLike label={cc("formName")}>
                  <input
                    className={metaInputClass}
                    data-testid="lead-form-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </MetaFieldLike>
                <div>
                  <p className="mb-2 text-[15px] font-bold text-[#050505]">
                    {cc("stepFormType")}
                  </p>
                  {(
                    [
                      [
                        "volume",
                        cc("moreVolume"),
                        cc("moreVolumeDesc"),
                      ],
                      [
                        "intent",
                        cc("higherIntent"),
                        cc("higherIntentDesc"),
                      ],
                      [
                        "rich",
                        cc("richCreative"),
                        cc("richCreativeDesc"),
                      ],
                    ] as const
                  ).map(([id, title, hint]) => (
                    <label
                      key={id}
                      className={[
                        "mb-2 flex cursor-pointer gap-3 rounded-lg border px-3 py-3",
                        formType === id
                          ? "border-[#1877F2] bg-[#E7F3FF]"
                          : "border-[#CED0D4] hover:bg-[#F7F8FA]",
                      ].join(" ")}
                    >
                      <input
                        type="radio"
                        className="mt-1 accent-[#1877F2]"
                        checked={formType === id}
                        onChange={() => setFormType(id)}
                      />
                      <span>
                        <span className="block text-[14px] font-bold text-[#050505]">
                          {title}
                        </span>
                        <span className="mt-0.5 block text-[12px] text-[#65676B]">
                          {hint}
                        </span>
                        {id === "intent" ? (
                          <label className="mt-2 flex items-center gap-2 text-[12px] font-semibold text-[#050505]">
                            <input
                              type="checkbox"
                              className="accent-[#1877F2]"
                              checked={requireSms}
                              onChange={(e) => setRequireSms(e.target.checked)}
                            />
                            {cc("requirePhoneVerification")}
                          </label>
                        ) : null}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            ) : null}

            {step === "intro" ? (
              <div className="space-y-3">
                <p className="text-[15px] font-bold text-[#050505]">
                  {cc("stepIntro")}
                </p>
                <MetaFieldLike label={cc("headline")}>
                  <input
                    className={metaInputClass}
                    data-testid="lead-form-intro-title"
                    value={introTitle}
                    onChange={(e) => setIntroTitle(e.target.value)}
                  />
                </MetaFieldLike>
                <MetaFieldLike label={cc("description")}>
                  <textarea
                    className={`${metaInputClass} h-24 resize-y py-2`}
                    value={introDescription}
                    onChange={(e) => setIntroDescription(e.target.value)}
                  />
                </MetaFieldLike>
              </div>
            ) : null}

            {step === "questions" ? (
              <div className="space-y-3">
                <p className="text-[15px] font-bold text-[#050505]">
                  {cc("stepQuestions")}
                </p>
                <LeadFormQuestionBuilder
                  contactTypes={contactTypes}
                  customQuestions={customQuestions}
                  onContactTypesChange={setContactTypes}
                  onCustomQuestionsChange={setCustomQuestions}
                  disabled={busy}
                />
              </div>
            ) : null}

            {step === "privacy" ? (
              <div className="space-y-3">
                <p className="text-[15px] font-bold text-[#050505]">
                  {cc("privacyPolicy")}
                </p>
                <MetaFieldLike
                  label={cc("privacyUrl")}
                  hint={cc("privacyUrlHint")}
                >
                  <input
                    className={metaInputClass}
                    value={privacyUrl}
                    onChange={(e) => setPrivacyUrl(e.target.value)}
                    placeholder="https://"
                  />
                </MetaFieldLike>
              </div>
            ) : null}

            {step === "ending" ? (
              <div className="space-y-4">
                <p className="text-[15px] font-bold text-[#050505]">
                  {cc("ending")}
                </p>
                <MetaFieldLike label={cc("headline")}>
                  <input
                    className={metaInputClass}
                    value={thankYouTitle}
                    onChange={(e) => setThankYouTitle(e.target.value)}
                  />
                </MetaFieldLike>
                <MetaFieldLike label={cc("description")}>
                  <textarea
                    className={`${metaInputClass} h-24 resize-y py-2`}
                    value={thankYouBody}
                    onChange={(e) => setThankYouBody(e.target.value)}
                  />
                </MetaFieldLike>

                <div>
                  <p className="mb-2 text-[15px] font-bold text-[#050505]">
                    {cc("additionalAction")}
                  </p>
                  <div className="space-y-2">
                    {ADDITIONAL_ACTIONS.map((action) => (
                      <label
                        key={action.id}
                        data-testid={`lead-form-action-${action.id}`}
                        className={[
                          "flex cursor-pointer gap-3 rounded-lg border px-3 py-3",
                          additionalAction === action.id
                            ? "border-[#1877F2] bg-[#E7F3FF]"
                            : "border-[#CED0D4] hover:bg-[#F7F8FA]",
                        ].join(" ")}
                      >
                        <span
                          className={[
                            "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2",
                            additionalAction === action.id
                              ? "border-[#1877F2]"
                              : "border-[#8A8D91]",
                          ].join(" ")}
                        >
                          {additionalAction === action.id ? (
                            <span className="h-2 w-2 rounded-full bg-[#1877F2]" />
                          ) : null}
                        </span>
                        <input
                          type="radio"
                          className="sr-only"
                          checked={additionalAction === action.id}
                          onChange={() => setAdditionalAction(action.id)}
                        />
                        <span>
                          <span className="block text-[14px] font-bold text-[#050505]">
                            {action.title}
                          </span>
                          <span className="mt-0.5 block text-[12px] text-[#65676B]">
                            {action.description}
                          </span>
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {additionalAction === "whatsapp" ? (
                  <div className="rounded-lg border border-[#CED0D4] bg-[#F7F8FA] p-3">
                    <PageWhatsAppNumberPicker
                      businessId={businessId}
                      pageId={pageId}
                      pageName={pageName}
                      selectedPhone={whatsappPhone}
                      onSelect={(number) => {
                        setWhatsappPhone(number.e164 || number.phone);
                      }}
                    />
                    <input
                      className="sr-only"
                      data-testid="lead-form-whatsapp-phone"
                      readOnly
                      value={whatsappPhone}
                    />
                  </div>
                ) : null}

                {additionalAction === "call" ? (
                  <MetaFieldLike label={cc("businessPhone")}>
                    <input
                      className={metaInputClass}
                      data-testid="lead-form-call-phone"
                      dir="ltr"
                      value={callPhone}
                      onChange={(e) => setCallPhone(e.target.value)}
                      placeholder="+9725..."
                    />
                  </MetaFieldLike>
                ) : null}

                {additionalAction === "website" ||
                additionalAction === "file" ? (
                  <MetaFieldLike
                    label={cc("link")}
                    hint={
                      additionalAction === "file"
                        ? cc("fileLinkHint")
                        : cc("websiteAfterSubmit")
                    }
                  >
                    <input
                      className={metaInputClass}
                      data-testid="lead-form-thank-you-url"
                      dir="ltr"
                      value={thankYouLink}
                      onChange={(e) => setThankYouLink(e.target.value)}
                      placeholder="https://"
                    />
                  </MetaFieldLike>
                ) : null}

                <MetaFieldLike label={cc("callToAction")}>
                  <div className="relative">
                    <input
                      className={metaInputClass}
                      value={thankYouButton}
                      maxLength={60}
                      onChange={(e) => setThankYouButton(e.target.value)}
                    />
                    <span className="pointer-events-none absolute bottom-2 right-3 text-[11px] font-semibold text-[#8A8D91]">
                      {thankYouButton.length}/60
                    </span>
                  </div>
                </MetaFieldLike>
              </div>
            ) : null}
          </div>

          {/* Sticky right preview */}
          <aside
            className="overflow-y-auto border-t border-[#E4E6EB] bg-[#F7F8FA] px-3 py-4 md:border-l md:border-t-0"
            dir={isRtlLeadFormLocale(locale) ? "rtl" : "ltr"}
          >
            <p className="mb-3 text-[13px] font-bold text-[#050505]">
              {cc("formPreview")} · {pageName || cc("pageFallback")}
            </p>
            <MetaLeadFormLivePreview
              pageName={pageName || cc("yourPage")}
              introTitle={introTitle}
              introDescription={introDescription}
              contactFields={contactTypes}
              customQuestions={customQuestions}
              privacyLinkText={i18n.t(
                privacyUrl
                  ? "leftover.instantForm.privacy"
                  : "leftover.instantForm.privacyShort",
                {
                  lng: formLocaleToAppLng(locale),
                  defaultValue: privacyUrl
                    ? t("metaCampaigns.adsManager.chrome.privacyPolicy")
                    : t("metaCampaigns.adsManager.chrome.privacy"),
                }
              )}
              thankYouTitle={thankYouTitle}
              thankYouBody={thankYouBody}
              thankYouButton={thankYouButton}
              thankYouActionLabel={
                additionalAction === "call"
                  ? cc("callBusiness")
                  : additionalAction === "file"
                    ? cc("viewFile")
                    : additionalAction === "whatsapp"
                      ? cc("chatWhatsapp")
                      : cc("goToWebsite")
              }
              thankYouDestination={
                additionalAction === "call"
                  ? callPhone
                  : additionalAction === "whatsapp"
                    ? whatsappPhone
                    : thankYouLink
              }
              screen={previewScreenForStep}
              platform={previewPlatform}
              locale={locale}
              onPlatformChange={setPreviewPlatform}
            />
          </aside>
        </div>

        <AdsManagerFormSettingsModal
          open={settingsOpen}
          locale={locale}
          sharing={sharing}
          contactTypes={contactTypes}
          contactFieldKeys={contactFieldKeys}
          customQuestions={customQuestions}
          trackingParameters={trackingParameters}
          onClose={() => setSettingsOpen(false)}
          onDone={(next) => {
            setLocale(next.locale);
            setSharing(next.sharing);
            setContactFieldKeys(next.contactFieldKeys);
            setCustomQuestions(next.customQuestions);
            setTrackingParameters(next.trackingParameters);
            setSettingsOpen(false);
          }}
        />

        <footer className="flex flex-col gap-3 border-t border-[#CED0D4] px-4 py-3">
          {banner ? (
            <div
              role="status"
              data-testid="instant-form-status"
              className={[
                "rounded-lg border px-3 py-2 text-[13px] font-semibold",
                banner.tone === "success"
                  ? "border-[#A6D9B3] bg-[#E7F6EC] text-[#0E7A32]"
                  : banner.tone === "error"
                    ? "border-[#F3C1C1] bg-[#FDECEC] text-[#B42318]"
                    : "border-[#BFD7F5] bg-[#E7F3FF] text-[#1877F2]",
              ].join(" ")}
            >
              <p>{banner.text}</p>
              {banner.detail ? (
                <p className="mt-1 text-[12px] font-medium text-[#65676B]">
                  {banner.detail}
                </p>
              ) : null}
              {banner.recoverFormId ? (
                <button
                  type="button"
                  className="mt-2 text-[13px] font-bold text-[#1877F2] hover:underline"
                  onClick={() => void handleSync(banner.recoverFormId || "")}
                  disabled={busy}
                >
                  {t("metaCampaigns.adsToasts.leadFormSync")}
                </button>
              ) : null}
            </div>
          ) : null}
          <div className="flex items-center justify-between gap-3">
          <button type="button" className={metaBtnSecondary} onClick={onClose} disabled={busy}>
            {banner?.tone === "success" && banner.blocksCreate !== false
              ? cc("close")
              : cc("cancel")}
          </button>
          <div className="flex flex-wrap justify-end gap-2">
            {mode === "duplicate" ? (
              <button
                type="button"
                data-testid="save-lead-form-draft"
                className={metaBtnSecondary}
                onClick={() => void handleSaveDraft()}
                disabled={busy || (banner?.tone === "success" && banner.blocksCreate !== false)}
              >
                {cc("saveDraft")}
              </button>
            ) : null}
            {stepIndex > 0 ? (
              <button
                type="button"
                className={metaBtnSecondary}
                onClick={goBack}
                disabled={busy || (banner?.tone === "success" && banner.blocksCreate !== false)}
              >
                {cc("back")}
              </button>
            ) : null}
            {stepIndex < STEPS.length - 1 ? (
              <button
                type="button"
                className={metaBtnPrimary}
                onClick={goNext}
                disabled={busy || (banner?.tone === "success" && banner.blocksCreate !== false)}
              >
                {cc("next")}
              </button>
            ) : null}
            {mode === "duplicate" || stepIndex === STEPS.length - 1 ? (
              <button
                type="button"
                data-testid="create-instant-form"
                className={metaBtnPrimary}
                onClick={() => void handleSave()}
                disabled={
                  busy ||
                  Boolean(banner?.recoverFormId) ||
                  (banner?.tone === "success" && banner.blocksCreate !== false)
                }
              >
                {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                {busy
                  ? cc("creatingForm")
                  : mode === "duplicate"
                    ? cc("createForm")
                    : cc("createFormCta")}
              </button>
            ) : null}
          </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

function MetaFieldLike({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[13px] font-semibold text-[#65676B]">
        {label}
      </span>
      {children}
      {hint ? (
        <span className="mt-1.5 block text-[12px] text-[#65676B]">{hint}</span>
      ) : null}
    </label>
  );
}
