import React, { useEffect, useRef, useState } from "react";
import {
  Check,
  ChevronDown,
  Copy,
  Folder,
  Image as ImageIcon,
  Info,
  Loader2,
  Search,
  Upload,
  Video,
} from "lucide-react";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import {
  listMetaPagePosts,
  listMetaProductCatalogs,
  listMetaProductSets,
  setMetaLeadFormStatus,
  uploadMetaMedia,
  type MetaAdsPage,
  type MetaLeadFormDraft,
} from "../../../../../../api/metaCampaignsApi";
import type { AdCreativeFormat, AdDraft, InstantFormItem } from "../adsManagerTypes";
import AdsManagerCreateLeadFormModal from "../AdsManagerCreateLeadFormModal";
import {
  leadFormDuplicateSeedFromMeta,
  leadFormDuplicateSeedFromSavedEditor,
  type LeadFormDuplicateSeed,
} from "../leadFormDuplicateSeed";
import {
  inspectCtaForContext,
  metaCtaLabel,
  metaCtaOptionsForContext,
  usesInstantFormDestination,
  usesMessengerDestination,
  usesPhoneDestination,
} from "../metaAdCtas";
import LeadgenTosCard from "../LeadgenTosCard";
import {
  MetaField,
  MetaLinkButton,
  MetaNotice,
  MetaSection,
  MetaToggle,
  metaBtnPrimary,
  metaBtnSecondary,
  metaInputClass,
  metaSelectClass,
} from "../metaAdsUi";
import { displayWhatsAppNumber, isWhatsAppConversionLocation } from "../pageWhatsAppNumber";

type Props = {
  ad: AdDraft;
  forms: InstantFormItem[];
  formDrafts?: MetaLeadFormDraft[];
  formsLoading?: boolean;
  formsError?: string;
  pages: MetaAdsPage[];
  businessId: string | null;
  sessionMode?: "create" | "edit";
  showLeadgenTos?: boolean;
  conversionLocation?: string;
  whatsappPhone?: string;
  whatsappDisplayNumber?: string;
  publishId?: string;
  onChange: (patch: Partial<AdDraft>) => void;
  onFormsRefresh?: () => Promise<void> | void;
  onFormReady?: (form: { id: string; name: string; pageId: string }) => Promise<void> | void;
};

export default function AdLevelEditor({
  ad,
  forms,
  formDrafts = [],
  formsLoading = false,
  formsError = "",
  pages,
  businessId,
  sessionMode = "create",
  showLeadgenTos = false,
  conversionLocation = "",
  whatsappPhone = "",
  whatsappDisplayNumber = "",
  publishId,
  onChange,
  onFormsRefresh,
  onFormReady,
}: Props) {
  const { t } = useTranslation();
  const c = (key: string, opts?: Record<string, unknown>) =>
    t(`metaCampaigns.adsManager.chrome.${key}`, opts);
  const tabLabel = (tab: "active" | "archived") =>
    tab === "active" ? c("formTabActive") : c("formTabArchived");
  const usesWhatsApp = isWhatsAppConversionLocation(conversionLocation);
  const usesInstantForms = usesInstantFormDestination(conversionLocation);
  const usesMessenger = usesMessengerDestination(conversionLocation);
  const usesPhone = usesPhoneDestination(conversionLocation);
  const ctaContext = {
    usesInstantForms,
    usesWhatsApp,
    usesMessenger,
    usesPhone,
  };
  const ctaOptions = metaCtaOptionsForContext(ctaContext, t);
  const ctaStatus = inspectCtaForContext(ad.callToAction, ctaContext);
  const visibleForms = forms.filter((f) => f.status === ad.formTab);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [mediaMenuOpen, setMediaMenuOpen] = useState(false);
  const [ctaOpen, setCtaOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formSearch, setFormSearch] = useState("");
  const [createFormOpen, setCreateFormOpen] = useState(false);
  const [editorMode, setEditorMode] = useState<"create" | "duplicate">("create");
  const [duplicateSeed, setDuplicateSeed] = useState<LeadFormDuplicateSeed | null>(null);
  const [formActionKey, setFormActionKey] = useState("");
  const [catalogs, setCatalogs] = useState<Array<{ id: string; name: string }>>([]);
  const [productSets, setProductSets] = useState<Array<{ id: string; name: string }>>([]);
  const [pagePosts, setPagePosts] = useState<Array<{ id: string; message: string }>>([]);
  const ctaRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!ctaRef.current?.contains(e.target as Node)) setCtaOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  useEffect(() => {
    if (!businessId || ad.creativeFormat !== "catalog") return;
    let cancelled = false;
    listMetaProductCatalogs(businessId)
      .then((data) => {
        if (!cancelled) setCatalogs(data.results || []);
      })
      .catch(() => {
        if (!cancelled) setCatalogs([]);
      });
    return () => {
      cancelled = true;
    };
  }, [businessId, ad.creativeFormat]);

  useEffect(() => {
    if (!businessId || !ad.catalogId || ad.creativeFormat !== "catalog") {
      setProductSets([]);
      return;
    }
    let cancelled = false;
    listMetaProductSets(businessId, ad.catalogId)
      .then((data) => {
        if (!cancelled) setProductSets(data.results || []);
      })
      .catch(() => {
        if (!cancelled) setProductSets([]);
      });
    return () => {
      cancelled = true;
    };
  }, [businessId, ad.catalogId, ad.creativeFormat]);

  useEffect(() => {
    if (!businessId || ad.creativeFormat !== "existing_post") return;
    const pageId = ad.facebookPageId;
    if (!pageId) return;
    let cancelled = false;
    listMetaPagePosts(businessId, pageId)
      .then((data) => {
        if (!cancelled) setPagePosts(data.results || []);
      })
      .catch(() => {
        if (!cancelled) setPagePosts([]);
      });
    return () => {
      cancelled = true;
    };
  }, [businessId, ad.creativeFormat, ad.facebookPageId]);

  const readActionError = (error: unknown) => {
    const response = (error as { response?: { data?: { error?: string; message?: string } } })
      ?.response?.data;
    return response?.error || response?.message || c("formActionFailed");
  };

  const duplicateForm = (form: InstantFormItem) => {
    const fromMeta = leadFormDuplicateSeedFromMeta({
      id: form.id,
      name: form.name,
      locale: form.locale,
      privacyPolicyUrl: form.privacyPolicyUrl,
      questions: form.questions,
      contextCard: form.contextCard,
      thankYouPage: form.thankYouPage,
      followUpActionUrl: form.followUpActionUrl,
    });
    const saved = formDrafts.find((draft) => draft.sourceFormId === form.id);
    const fromDraft = leadFormDuplicateSeedFromSavedEditor(form.id, saved?.editor);
    setEditorMode("duplicate");
    setDuplicateSeed(fromDraft || fromMeta);
    setCreateFormOpen(true);
  };

  const changeFormStatus = async (form: InstantFormItem, status: "ARCHIVED" | "ACTIVE") => {
    if (!businessId || !ad.facebookPageId || formActionKey) return;
    if (status === "ARCHIVED") {
      const confirmed = window.confirm(c("archiveFormConfirm", { name: form.name }));
      if (!confirmed) return;
    }
    const key = `${form.id}:${status}`;
    try {
      setFormActionKey(key);
      await setMetaLeadFormStatus(businessId, {
        pageId: ad.facebookPageId,
        formId: form.id,
        status,
        confirmStatus: true,
      });
      toast.success(status === "ARCHIVED" ? c("archiveFormDone") : c("restoreFormDone"));
      onChange({ formTab: status === "ARCHIVED" ? "archived" : "active" });
      await onFormsRefresh?.();
    } catch (error) {
      toast.error(readActionError(error));
    } finally {
      setFormActionKey("");
    }
  };

  const filteredForms = visibleForms.filter((form) => {
    const q = formSearch.trim().toLowerCase();
    if (!q) return true;
    return form.name.toLowerCase().includes(q);
  });

  const pickMedia = (format: AdCreativeFormat) => {
    onChange({
      creativeFormat: format,
      carouselCards:
        format === "carousel" && !(ad.carouselCards || []).length
          ? [
              { headline: ad.headline, description: ad.description, imageHash: ad.imageHash, imagePreviewUrl: ad.imagePreviewUrl, link: ad.websiteUrl },
              { headline: "", description: "", imageHash: "", imagePreviewUrl: "", link: ad.websiteUrl },
            ]
          : ad.carouselCards,
    });
    setMediaMenuOpen(false);
    if (format === "image" || format === "video") {
      window.setTimeout(() => fileRef.current?.click(), 0);
    }
  };

  const handleUpload = async (file: File | null) => {
    if (!file || !businessId) {
      if (!businessId) toast.error(t("metaCampaigns.adsToasts.connectMetaFirst"));
      return;
    }
    const kind = ad.creativeFormat === "video" ? "video" : "image";
    const isVideo = kind === "video" || file.type.startsWith("video/");
    try {
      setUploading(true);
      const result = await uploadMetaMedia(
        businessId,
        file,
        isVideo ? "video" : "image"
      );
      if (isVideo) {
        onChange({
          creativeFormat: "video",
          videoId: result.videoId || "",
          imageHash: "",
          imagePreviewUrl: "",
          mediaLabel: file.name || c("videoUploadedFallback"),
        });
      } else if (ad.creativeFormat === "carousel") {
        const cards = [...(ad.carouselCards || [])];
        const empty = cards.findIndex((card) => !card.imageHash);
        const idx = empty >= 0 ? empty : Math.max(0, cards.length - 1);
        if (!cards[idx]) {
          cards[idx] = {
            headline: "",
            description: "",
            imageHash: "",
            imagePreviewUrl: "",
            link: ad.websiteUrl,
          };
        }
        cards[idx] = {
          ...cards[idx],
          imageHash: result.imageHash || "",
          imagePreviewUrl: result.url || "",
        };
        onChange({
          creativeFormat: "carousel",
          carouselCards: cards,
          mediaLabel: file.name || c("imageUploadedFallback"),
        });
      } else {
        onChange({
          creativeFormat: "image",
          imageHash: result.imageHash || "",
          imagePreviewUrl: result.url || "",
          videoId: "",
          mediaLabel: file.name || c("imageUploadedFallback"),
        });
      }
      toast.success(isVideo ? t("metaCampaigns.adsToasts.videoUploaded") : t("metaCampaigns.adsToasts.imageUploaded"));
    } catch (error: unknown) {
      const err = error as { response?: { data?: { error?: string } } };
      toast.error(err.response?.data?.error || t("metaCampaigns.adsToasts.mediaUploadFailed"));
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  return (
    <div className="mx-auto max-w-[760px] space-y-4 pb-24">
      <MetaSection
        title={c("adName")}
        action={
          <button type="button" className={metaBtnSecondary}>
            {c("createTemplate")}
          </button>
        }
      >
        <MetaField label={c("adName")}>
          <input
            className={metaInputClass}
            value={ad.name}
            onChange={(e) => onChange({ name: e.target.value })}
          />
        </MetaField>
      </MetaSection>

      <MetaSection title={c("partnershipAd")}>
        <MetaToggle
          checked={ad.partnershipAd}
          onChange={(partnershipAd) => onChange({ partnershipAd })}
          label={c("partnershipAd")}
          description={c("partnershipAdDesc")}
        />
      </MetaSection>

      <MetaSection title={c("identity")}>
        <MetaField label={c("facebookPage")}>
          <select
            className={metaSelectClass}
            value={ad.facebookPageId}
            onChange={(e) => {
              const pageId = e.target.value;
              const page = pages.find((p) => p.id === pageId);
              onChange({
                facebookPageId: pageId,
                facebookPageName: page?.name || "",
              });
            }}
          >
            <option value="">{c("selectFacebookPage")}</option>
            {pages.map((page) => (
              <option key={page.id} value={page.id}>
                {page.name}
              </option>
            ))}
          </select>
        </MetaField>
        {showLeadgenTos ? (
          <LeadgenTosCard
            businessId={businessId}
            pageId={ad.facebookPageId}
            pageName={ad.facebookPageName}
          />
        ) : null}
      </MetaSection>

      <MetaSection
        title={c("destination")}
        status={
          usesWhatsApp
            ? whatsappPhone
              ? "ok"
              : "warn"
            : ad.instantFormId
              ? "ok"
              : "warn"
        }
      >
        <div className="space-y-5">
          {usesWhatsApp ? (
            <div
              data-testid="ad-whatsapp-destination"
              className="rounded-xl border border-[#C6D9F1] bg-[#F0F6FF] px-4 py-3"
            >
              <p className="text-[15px] font-bold text-[#050505]">WhatsApp</p>
              <p className="mt-1 text-[13px] text-[#65676B]" dir="ltr">
                {whatsappDisplayNumber ||
                  displayWhatsAppNumber(whatsappPhone) ||
                  c("pageWaChooseNumber")}
              </p>
            </div>
          ) : (
          <>
          <div>
            <h3 className="text-[15px] font-bold text-[#050505]">
              {c("website")}
            </h3>
            <div className="mt-3 space-y-3">
              <MetaField label={c("websiteUrl")}>
                <input
                  className={metaInputClass}
                  value={ad.websiteUrl}
                  onChange={(e) => onChange({ websiteUrl: e.target.value })}
                  placeholder="https://"
                />
              </MetaField>
              <MetaField
                label={c("displayLink")}
                hint={c("displayLinkHint")}
              >
                <input
                  className={metaInputClass}
                  value={ad.displayLink}
                  onChange={(e) => onChange({ displayLink: e.target.value })}
                />
              </MetaField>
            </div>
          </div>

          <div className="border-t border-[#E4E6EB] pt-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-[15px] font-bold text-[#050505]">
                {c("instantForm")}
              </h3>
              {sessionMode === "create" ? (
              <button
                type="button"
                className={metaBtnPrimary}
                onClick={() => {
                  if (!ad.facebookPageId) {
                    toast.error(t("metaCampaigns.adsToasts.selectPageFirst"));
                    return;
                  }
                  setEditorMode("create");
                  setDuplicateSeed(null);
                  setCreateFormOpen(true);
                }}
              >
                {c("createForm")}
              </button>
              ) : null}
            </div>
            {sessionMode === "edit" ? (
              <div className="mt-3 rounded-lg border border-[#E4E6EB] bg-[#F7F8FA] px-3 py-2 text-[13px] font-semibold text-[#050505]">
                <p className="text-[12px] font-black uppercase tracking-wide text-[#65676B]">
                  {c("currentLeadForm")}
                </p>
                <p className="mt-1">
                  {forms.find((form) => form.id === ad.instantFormId)?.name ||
                    c("notSelected")}
                </p>
                <p className="mt-1 text-[12px] text-[#65676B]">{c("leadFormReadOnly")}</p>
                <p className="mt-2 text-[12px] font-black text-[#1877F2]">{c("chooseOtherForm")}</p>
              </div>
            ) : null}

            <div className="relative mt-3">
              <Search className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8A8D91]" />
              <input
                className={`${metaInputClass} ps-9`}
                placeholder={c("searchForms")}
                value={formSearch}
                onChange={(e) => setFormSearch(e.target.value)}
              />
            </div>

            <div className="mt-3 flex gap-1 border-b border-[#E4E6EB]">
              {(["active", "archived"] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => onChange({ formTab: tab })}
                  className={[
                    "px-3 py-2 text-[13px] font-bold",
                    ad.formTab === tab
                      ? "border-b-2 border-[#1877F2] text-[#1877F2]"
                      : "text-[#65676B]",
                  ].join(" ")}
                >
                  {tabLabel(tab)}
                </button>
              ))}
            </div>

            {ad.instantFormId ? (
              <p className="mt-3 text-[12px] font-semibold text-[#65676B]">
                {ad.formLinkedOnMeta ? c("formLinkedOnMeta") : c("formSavedInDraft")}
              </p>
            ) : null}
            {ad.instantFormId &&
            ad.facebookPageId &&
            !formsLoading &&
            forms.length > 0 &&
            !forms.some((form) => form.id === ad.instantFormId) ? (
              <p className="mt-2 text-[12px] font-semibold text-[#B45309]">
                {c("formPageMismatch")}
              </p>
            ) : null}

            <div className="mt-2 max-h-56 space-y-1 overflow-y-auto">
              {formsLoading ? (
                <p className="inline-flex w-full items-center justify-center gap-2 px-2 py-6 text-[13px] font-semibold text-[#65676B]">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {c("loadingInstantFormsFromMeta")}
                </p>
              ) : formsError ? (
                <div className="space-y-2 px-2 py-4 text-center">
                  <p className="text-[13px] font-semibold text-[#D97706]">
                    {formsError}
                  </p>
                  <p className="text-[12px] text-[#65676B]">
                    {c("formsErrorHint")}
                  </p>
                  {onFormsRefresh ? (
                    <button
                      type="button"
                      className={metaBtnSecondary}
                      onClick={() => onFormsRefresh()}
                    >
                      {c("refreshForms")}
                    </button>
                  ) : null}
                </div>
              ) : filteredForms.length === 0 ? (
                <p className="px-2 py-6 text-center text-[13px] text-[#65676B]">
                  {!ad.facebookPageId
                    ? c("selectPageForForms")
                    : c("noFormsOnPage", { tab: tabLabel(ad.formTab) })}
                </p>
              ) : (
                filteredForms.map((form) => {
                  const selected = ad.instantFormId === form.id;
                  const busy = formActionKey.startsWith(`${form.id}:`);
                  return (
                    <div
                      key={form.id}
                      data-testid={`lead-form-row-${form.id}`}
                      className={[
                        "group flex w-full items-center justify-between gap-2 rounded-md border px-3 py-2.5 text-left transition",
                        selected
                          ? "border-[#1877F2] bg-[#E7F3FF]"
                          : "border-transparent hover:bg-[#F0F2F5]",
                      ].join(" ")}
                    >
                      <button
                        type="button"
                        className="min-w-0 flex-1 text-left"
                        onClick={() =>
                          onChange({
                            instantFormId: form.id,
                            instantFormName: form.name,
                            formPageId: ad.facebookPageId,
                            formLinkedOnMeta: false,
                          })
                        }
                      >
                        <span className="block text-[14px] font-semibold text-[#050505]">
                          {form.name}
                        </span>
                        <span className="block text-[12px] text-[#65676B]">
                          {c("createdOn", { date: form.updatedAt || "—" })}
                          {form.customQuestions
                            ? ` · ${c("customQuestionsCount", {
                                count: form.customQuestions,
                              })}`
                            : ""}
                        </span>
                      </button>
                      <span
                        className={[
                          "flex shrink-0 items-center gap-1",
                          selected ? "opacity-100" : "opacity-0 group-hover:opacity-100 focus-within:opacity-100",
                        ].join(" ")}
                      >
                        <button
                          type="button"
                          data-testid={`lead-form-archive-${form.id}`}
                          title={form.status === "active" ? c("archiveForm") : c("restoreForm")}
                          aria-label={form.status === "active" ? c("archiveForm") : c("restoreForm")}
                          disabled={Boolean(formActionKey)}
                          className="relative flex h-8 w-8 items-center justify-center rounded-md text-[#65676B] hover:bg-white hover:text-[#050505] disabled:opacity-50"
                          onClick={() =>
                            void changeFormStatus(
                              form,
                              form.status === "active" ? "ARCHIVED" : "ACTIVE"
                            )
                          }
                        >
                          {busy && formActionKey.endsWith(form.status === "active" ? ":ARCHIVED" : ":ACTIVE") ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Folder className="h-4 w-4" />
                          )}
                        </button>
                        <button
                          type="button"
                          data-testid={`lead-form-duplicate-${form.id}`}
                          title={c("duplicateForm")}
                          aria-label={c("duplicateForm")}
                          disabled={Boolean(formActionKey)}
                          className="relative flex h-8 w-8 items-center justify-center rounded-md text-[#65676B] hover:bg-white hover:text-[#050505] disabled:opacity-50"
                          onClick={() => duplicateForm(form)}
                        >
                          {busy && formActionKey.endsWith(":duplicate") ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </button>
                      </span>
                      <button
                        type="button"
                        aria-label={form.name}
                        className="shrink-0"
                        onClick={() =>
                          onChange({
                            instantFormId: form.id,
                            instantFormName: form.name,
                            formPageId: ad.facebookPageId,
                            formLinkedOnMeta: false,
                          })
                        }
                      >
                        <span
                          className={[
                            "flex h-4 w-4 items-center justify-center rounded-full border-2",
                            selected ? "border-[#1877F2]" : "border-[#8A8D91]",
                          ].join(" ")}
                        >
                          {selected ? (
                            <span className="h-2 w-2 rounded-full bg-[#1877F2]" />
                          ) : null}
                        </span>
                      </button>
                    </div>
                  );
                })
              )}
            </div>

            {!ad.instantFormId ? (
              <div className="mt-3">
                <MetaNotice tone="warning">
                  {c("instantFormNotice")}
                </MetaNotice>
              </div>
            ) : null}
          </div>
          </>
          )}
        </div>
      </MetaSection>

      <MetaSection title={c("adCreative")}>
        <p className="text-[13px] text-[#65676B]">
          {c("adCreativeSubtitle")}
        </p>

        <div className="relative">
          <p className="mb-1.5 text-[13px] font-semibold text-[#65676B]">
            {c("setUpCreative")}
          </p>
          <button
            type="button"
            className={`${metaInputClass} flex items-center justify-between text-left`}
            onClick={() => setMediaMenuOpen((v) => !v)}
          >
            <span className="font-semibold">
              {ad.creativeFormat === "video"
                ? c("videoAd")
                : ad.creativeFormat === "carousel"
                  ? c("carouselAd")
                  : ad.creativeFormat === "catalog"
                    ? c("catalogAd")
                    : ad.creativeFormat === "existing_post"
                      ? c("existingPostAd")
                      : c("imageAd")}
            </span>
            <Upload className="h-4 w-4 text-[#65676B]" />
          </button>
          {mediaMenuOpen ? (
            <div className="absolute z-30 mt-1 w-full overflow-hidden rounded-lg border border-[#CED0D4] bg-white shadow-lg">
              <button
                type="button"
                className="flex w-full items-center gap-3 px-3 py-3 text-left hover:bg-[#F0F2F5]"
                onClick={() => pickMedia("image")}
              >
                <ImageIcon className="h-5 w-5 text-[#65676B]" />
                <span>
                  <span className="block text-[14px] font-semibold">
                    {c("imageAd")}
                  </span>
                  <span className="block text-[12px] text-[#65676B]">
                    {c("imageAdUploadDesc")}
                  </span>
                </span>
              </button>
              <button
                type="button"
                className="flex w-full items-center gap-3 px-3 py-3 text-left hover:bg-[#F0F2F5]"
                onClick={() => {
                  pickMedia("carousel");
                }}
              >
                <Copy className="h-5 w-5 text-[#65676B]" />
                <span>
                  <span className="block text-[14px] font-semibold">
                    {c("carouselAd")}
                  </span>
                  <span className="block text-[12px] text-[#65676B]">
                    {c("carouselAdUploadDesc")}
                  </span>
                </span>
              </button>
              <button
                type="button"
                className="flex w-full items-center gap-3 px-3 py-3 text-left hover:bg-[#F0F2F5]"
                onClick={() => pickMedia("video")}
              >
                <Video className="h-5 w-5 text-[#65676B]" />
                <span>
                  <span className="block text-[14px] font-semibold">
                    {c("videoAd")}
                  </span>
                  <span className="block text-[12px] text-[#65676B]">
                    {c("videoAdUploadDesc")}
                  </span>
                </span>
              </button>
              <button
                type="button"
                className="flex w-full items-center gap-3 px-3 py-3 text-left hover:bg-[#F0F2F5]"
                onClick={() => pickMedia("catalog")}
              >
                <Folder className="h-5 w-5 text-[#65676B]" />
                <span>
                  <span className="block text-[14px] font-semibold">{c("catalogAd")}</span>
                  <span className="block text-[12px] text-[#65676B]">
                    {c("catalogAdDesc")}
                  </span>
                </span>
              </button>
              <button
                type="button"
                className="flex w-full items-center gap-3 px-3 py-3 text-left hover:bg-[#F0F2F5]"
                onClick={() => pickMedia("existing_post")}
              >
                <Copy className="h-5 w-5 text-[#65676B]" />
                <span>
                  <span className="block text-[14px] font-semibold">{c("existingPostAd")}</span>
                  <span className="block text-[12px] text-[#65676B]">
                    {c("existingPostAdDesc")}
                  </span>
                </span>
              </button>
            </div>
          ) : null}
          <input
            ref={fileRef}
            type="file"
            className="hidden"
            accept={
              ad.creativeFormat === "video"
                ? "video/*"
                : "image/png,image/jpeg,image/jpg,image/webp"
            }
            onChange={(e) => void handleUpload(e.target.files?.[0] || null)}
          />
        </div>

        <MetaField label={c("media")}>
          <div className="overflow-hidden rounded-lg border border-dashed border-[#CED0D4] bg-[#F7F8FA]">
            {ad.imagePreviewUrl ? (
              <img
                src={ad.imagePreviewUrl}
                alt={c("adCreativeAlt")}
                className="max-h-56 w-full object-contain"
              />
            ) : ad.videoId ? (
              <div className="flex h-40 flex-col items-center justify-center gap-2 text-[13px] font-semibold text-[#050505]">
                <Video className="h-8 w-8 text-[#1877F2]" />
                {c("videoUploadedId", { id: ad.videoId })}
              </div>
            ) : (
              <button
                type="button"
                className="flex h-36 w-full flex-col items-center justify-center gap-2 text-[13px] font-semibold text-[#65676B] hover:bg-[#F0F2F5]"
                onClick={() => setMediaMenuOpen(true)}
                disabled={uploading}
              >
                {uploading ? (
                  <Loader2 className="h-6 w-6 animate-spin text-[#1877F2]" />
                ) : (
                  <Upload className="h-6 w-6" />
                )}
                {uploading
                  ? c("uploadingToMeta")
                  : ad.mediaLabel || c("chooseMedia")}
              </button>
            )}
          </div>
          {(ad.imagePreviewUrl || ad.videoId) && (
            <MetaLinkButton onClick={() => setMediaMenuOpen(true)}>
              {c("replaceMedia")}
            </MetaLinkButton>
          )}
        </MetaField>

        {ad.creativeFormat === "catalog" ? (
          <div className="space-y-2">
            <MetaField label={c("catalog")}>
              <select
                className={metaSelectClass}
                value={ad.catalogId}
                onChange={(e) => onChange({ catalogId: e.target.value, productSetId: "" })}
              >
                <option value="">{c("pickCatalog")}</option>
                {catalogs.map((row) => (
                  <option key={row.id} value={row.id}>
                    {row.name}
                  </option>
                ))}
              </select>
            </MetaField>
            <MetaField label={c("productSet")}>
              <select
                className={metaSelectClass}
                value={ad.productSetId}
                onChange={(e) => onChange({ productSetId: e.target.value })}
              >
                <option value="">{c("pickProductSet")}</option>
                {productSets.map((row) => (
                  <option key={row.id} value={row.id}>
                    {row.name}
                  </option>
                ))}
              </select>
            </MetaField>
          </div>
        ) : null}

        {ad.creativeFormat === "existing_post" ? (
          <MetaField label={c("existingPost")}>
            <select
              className={metaSelectClass}
              value={ad.objectStoryId}
              onChange={(e) => onChange({ objectStoryId: e.target.value })}
            >
              <option value="">{c("pickExistingPost")}</option>
              {pagePosts.map((row) => (
                <option key={row.id} value={row.id}>
                  {row.message || row.id}
                </option>
              ))}
            </select>
          </MetaField>
        ) : null}

        {ad.creativeFormat === "carousel" ? (
          <div className="space-y-2">
            <p className="text-[13px] font-semibold">{c("carouselCards")}</p>
            {(ad.carouselCards || []).map((card, index) => (
              <div key={`card-${index}`} className="rounded-md border border-[#E4E6EB] p-3">
                <input
                  className={`${metaInputClass} mb-2`}
                  value={card.headline}
                  placeholder={c("headline")}
                  onChange={(e) => {
                    const cards = [...(ad.carouselCards || [])];
                    cards[index] = { ...cards[index], headline: e.target.value };
                    onChange({ carouselCards: cards });
                  }}
                />
                <input
                  className={metaInputClass}
                  value={card.link}
                  placeholder={c("websiteUrl")}
                  onChange={(e) => {
                    const cards = [...(ad.carouselCards || [])];
                    cards[index] = { ...cards[index], link: e.target.value };
                    onChange({ carouselCards: cards });
                  }}
                />
                {card.imagePreviewUrl ? (
                  <img src={card.imagePreviewUrl} alt="" className="mt-2 max-h-24 object-contain" />
                ) : (
                  <p className="mt-2 text-[12px] text-[#65676B]">{c("carouselNeedImage")}</p>
                )}
              </div>
            ))}
            <button
              type="button"
              className={metaBtnSecondary}
              onClick={() =>
                onChange({
                  carouselCards: [
                    ...(ad.carouselCards || []),
                    {
                      headline: "",
                      description: "",
                      imageHash: "",
                      imagePreviewUrl: "",
                      link: ad.websiteUrl,
                    },
                  ],
                })
              }
            >
              {c("addCarouselCard")}
            </button>
          </div>
        ) : null}

        <div className="space-y-4" data-demo-target="meta-creative">
          <MetaField label={c("primaryText")}>
            <textarea
              className={`${metaInputClass} h-24 resize-y py-2`}
              value={ad.primaryText}
              onChange={(e) => onChange({ primaryText: e.target.value })}
            />
          </MetaField>
          <div className="grid gap-3 sm:grid-cols-2">
            <MetaField label={c("headline")}>
              <input
                className={metaInputClass}
                value={ad.headline}
                onChange={(e) => onChange({ headline: e.target.value })}
              />
            </MetaField>
            <MetaField label={c("description")}>
              <input
                className={metaInputClass}
                value={ad.description}
                onChange={(e) => onChange({ description: e.target.value })}
              />
            </MetaField>
          </div>
        </div>
        <div className="relative" ref={ctaRef}>
          <p className="mb-1.5 flex items-center gap-1 text-[13px] font-semibold text-[#65676B]">
            {t("metaCampaigns.ai.preview.cta")}
            <Info className="h-3.5 w-3.5 text-[#8A8D91]" />
          </p>
          <button
            type="button"
            data-testid="meta-ads-cta-dropdown"
            className={[
              metaInputClass,
              "flex items-center justify-between text-left",
              ctaOpen ? "border-[#1877F2] shadow-[0_0_0_2px_rgba(24,119,242,0.2)]" : "",
            ].join(" ")}
            onClick={() => setCtaOpen((v) => !v)}
          >
            <span className="font-semibold">
              {metaCtaLabel(ad.callToAction, t)}
            </span>
            <ChevronDown className="h-4 w-4 text-[#65676B]" />
          </button>
          {!ctaStatus.compatible ? (
            <p className="mt-1.5 text-[12px] font-semibold text-[#C03221]">
              {c("ctaIncompatibleLeadForm")}
            </p>
          ) : null}
          {ctaOpen ? (
            <div
              data-testid="meta-ads-cta-menu"
              className="absolute z-40 mt-1 max-h-64 w-full overflow-y-auto rounded-lg border border-[#CED0D4] bg-white shadow-xl"
            >
              {ctaOptions.map((cta) => {
                const selected = ad.callToAction === cta.value;
                return (
                  <button
                    key={cta.value}
                    type="button"
                    disabled={!cta.compatible}
                    title={
                      cta.compatible
                        ? undefined
                        : t(`metaCampaigns.adsManager.chrome.${cta.reasonKey || "ctaIncompatibleLeadForm"}`)
                    }
                    className={[
                      "flex w-full items-center gap-3 px-3 py-2.5 text-left text-[14px]",
                      !cta.compatible
                        ? "cursor-not-allowed text-[#8A8D91]"
                        : selected
                          ? "bg-[#E7F3FF] font-semibold text-[#050505]"
                          : "hover:bg-[#F0F2F5]",
                    ].join(" ")}
                    onClick={() => {
                      if (!cta.compatible) return;
                      onChange({ callToAction: cta.value });
                      setCtaOpen(false);
                    }}
                  >
                    <span
                      className={[
                        "flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2",
                        selected ? "border-[#1877F2]" : "border-[#8A8D91]",
                      ].join(" ")}
                    >
                      {selected ? (
                        <span className="h-2 w-2 rounded-full bg-[#1877F2]" />
                      ) : null}
                    </span>
                    {cta.label}
                    {selected ? (
                      <Check className="ms-auto h-3.5 w-3.5 text-[#1877F2]" />
                    ) : null}
                  </button>
                );
              })}
            </div>
          ) : null}
        </div>
      </MetaSection>

      <AdsManagerCreateLeadFormModal
        open={createFormOpen}
        businessId={businessId}
        pageId={ad.facebookPageId}
        pageName={ad.facebookPageName}
        publishId={editorMode === "duplicate" ? undefined : publishId}
        adDraftId={editorMode === "duplicate" ? undefined : ad.id}
        mode={editorMode}
        initialDraft={editorMode === "duplicate" ? duplicateSeed : null}
        onClose={() => setCreateFormOpen(false)}
        onDraftSaved={async () => {
          await onFormsRefresh?.();
        }}
        onCreated={async (form) => {
          if (editorMode === "duplicate") {
            await onFormsRefresh?.();
            return;
          }
          onChange({
            instantFormId: form.id,
            instantFormName: form.name,
            formPageId: form.pageId || ad.facebookPageId,
            formLinkedOnMeta: false,
            formTab: "active",
          });
          await onFormReady?.(form);
          await onFormsRefresh?.();
        }}
      />
    </div>
  );
}
