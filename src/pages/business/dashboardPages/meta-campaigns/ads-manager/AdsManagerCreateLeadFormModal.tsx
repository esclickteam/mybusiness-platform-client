import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Check, Loader2, MessageCircle, Settings, X } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { createMetaLeadForm } from "../../../../../api/metaCampaignsApi";
import { getWhatsAppStatus } from "../../../../../api/whatsappApi";
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
import { formLocaleToAppLng, isRtlLeadFormLocale } from "./metaLeadFormLocales";
import i18n from "../../../../../i18n/i18n";
import { metaBtnPrimary, metaBtnSecondary, metaInputClass } from "./metaAdsUi";

type AdditionalAction = "website" | "file" | "call" | "whatsapp";

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

type Props = {
  open: boolean;
  businessId: string | null;
  pageId: string;
  pageName: string;
  onClose: () => void;
  onCreated: (formId: string) => void;
};

export default function AdsManagerCreateLeadFormModal({
  open,
  businessId,
  pageId,
  pageName,
  onClose,
  onCreated,
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
  const [whatsappDisplay, setWhatsappDisplay] = useState("");
  const [whatsappConnected, setWhatsappConnected] = useState(false);
  const [whatsappLoading, setWhatsappLoading] = useState(false);
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
  const [locale, setLocale] = useState("he_IL");
  const [sharing, setSharing] = useState<FormSharing>("restricted");
  const [contactFieldKeys, setContactFieldKeys] = useState<
    Record<string, string>
  >({});
  const [trackingParameters, setTrackingParameters] = useState<
    FormTrackingParam[]
  >([]);

  useEffect(() => {
    if (!open || !businessId) return;
    let cancelled = false;
    (async () => {
      try {
        setWhatsappLoading(true);
        const status = await getWhatsAppStatus(businessId);
        if (cancelled) return;
        const connected = Boolean(status.connected || status.readyToSend);
        setWhatsappConnected(connected);
        const display =
          status.displayPhoneNumber || status.verifiedName || "";
        setWhatsappDisplay(display);
        if (connected && status.displayPhoneNumber) {
          setWhatsappPhone((prev) => prev || status.displayPhoneNumber);
        }
      } catch {
        if (!cancelled) {
          setWhatsappConnected(false);
          setWhatsappDisplay("");
        }
      } finally {
        if (!cancelled) setWhatsappLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [open, businessId]);

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

  const handleSave = async () => {
    if (!businessId) {
      toast.error(cc("identifyBusiness"));
      return;
    }
    if (!pageId) {
      toast.error(t("metaCampaigns.adsToasts.selectPageFirst"));
      return;
    }
    if (!name.trim()) {
      toast.error(t("metaCampaigns.adsToasts.formNameRequired"));
      return;
    }
    if (!introTitle.trim()) {
      toast.error(t("metaCampaigns.adsToasts.introRequired"));
      return;
    }
    const validationError = validateLeadFormBuilder({
      contactTypes,
      customQuestions,
    });
    if (validationError) {
      toast.error(t("metaCampaigns.adsToasts.needQuestion"));
      setStep("questions");
      return;
    }
    if (!thankYouTitle.trim()) {
      toast.error(t("metaCampaigns.adsToasts.thankYouRequired"));
      setStep("ending");
      return;
    }
    if (additionalAction === "whatsapp" && !whatsappPhone.replace(/\D/g, "")) {
      toast.error(t("metaCampaigns.adsToasts.needWhatsapp"));
      setStep("ending");
      return;
    }
    if (
      (additionalAction === "website" || additionalAction === "file") &&
      !thankYouLink.trim()
    ) {
      toast.error(t("metaCampaigns.adsToasts.needActionLink"));
      setStep("ending");
      return;
    }
    if (additionalAction === "call" && !callPhone.replace(/\D/g, "")) {
      toast.error(t("metaCampaigns.adsToasts.needCallPhone"));
      setStep("ending");
      return;
    }

    try {
      setBusy(true);
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
      });
      const formId = result.form?.id;
      if (!formId) {
        toast.error(t("metaCampaigns.adsToasts.noFormId"));
        return;
      }
      toast.success(t("metaCampaigns.adsToasts.leadFormCreated"));
      onCreated(formId);
      onClose();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { error?: string } } };
      toast.error(err.response?.data?.error || t("metaCampaigns.adsToasts.leadFormFailed"));
    } finally {
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
            {cc("createFormTitle")}
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
          <div className="min-h-0 overflow-y-auto px-4 py-4 sm:px-6">
            {step === "type" ? (
              <div className="space-y-4">
                <MetaFieldLike label={cc("formName")}>
                  <input
                    className={metaInputClass}
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
                    <p className="text-[15px] font-bold text-[#050505]">
                      {cc("addWhatsappAccount")}
                    </p>
                    <p className="mt-1 text-[12px] text-[#65676B]">
                      {cc("whatsappChatHint")}
                    </p>
                    {whatsappLoading ? (
                      <p className="mt-3 text-[13px] text-[#65676B]">
                        {cc("loadingWhatsapp")}
                      </p>
                    ) : whatsappConnected ? (
                      <div className="mt-3 flex items-center gap-3 rounded-lg border border-[#A6D9B3] bg-[#E7F6EC] px-3 py-2.5">
                        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#25D366] text-white">
                          <MessageCircle className="h-5 w-5" />
                        </span>
                        <span className="min-w-0">
                          <span className="block text-[14px] font-bold text-[#050505]">
                            WhatsApp
                          </span>
                          <span className="block truncate text-[12px] text-[#65676B]" dir="ltr">
                            {whatsappDisplay || whatsappPhone}
                          </span>
                        </span>
                        <Check className="ml-auto h-4 w-4 text-[#31A24C]" />
                      </div>
                    ) : (
                      <div className="mt-3 space-y-2">
                        <div className="rounded-lg border border-[#F5D78E] bg-[#FFF8E5] px-3 py-2 text-[12px] text-[#050505]">
                          {cc("whatsappNotConnected")}
                        </div>
                        <Link
                          to="../whatsapp/settings"
                          className="inline-flex text-[13px] font-semibold text-[#1877F2] hover:underline"
                        >
                          {cc("connectWhatsapp")}
                        </Link>
                      </div>
                    )}
                    <MetaFieldLike label={cc("whatsappNumber")}>
                      <input
                        className={metaInputClass}
                        dir="ltr"
                        value={whatsappPhone}
                        onChange={(e) => setWhatsappPhone(e.target.value)}
                        placeholder="+9725..."
                      />
                    </MetaFieldLike>
                  </div>
                ) : null}

                {additionalAction === "call" ? (
                  <MetaFieldLike label={cc("businessPhone")}>
                    <input
                      className={metaInputClass}
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
          <aside className="hidden overflow-y-auto border-l border-[#E4E6EB] bg-[#F7F8FA] px-3 py-4 md:block">
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

        <footer className="flex items-center justify-between gap-3 border-t border-[#CED0D4] px-4 py-3">
          <button type="button" className={metaBtnSecondary} onClick={onClose}>
            {cc("cancel")}
          </button>
          <div className="flex gap-2">
            {stepIndex > 0 ? (
              <button
                type="button"
                className={metaBtnSecondary}
                onClick={goBack}
                disabled={busy}
              >
                {cc("back")}
              </button>
            ) : null}
            {stepIndex < STEPS.length - 1 ? (
              <button
                type="button"
                className={metaBtnPrimary}
                onClick={goNext}
                disabled={busy}
              >
                {cc("next")}
              </button>
            ) : (
              <button
                type="button"
                className={metaBtnPrimary}
                onClick={() => void handleSave()}
                disabled={busy}
              >
                {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                {busy ? cc("creatingForm") : cc("createFormCta")}
              </button>
            )}
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
