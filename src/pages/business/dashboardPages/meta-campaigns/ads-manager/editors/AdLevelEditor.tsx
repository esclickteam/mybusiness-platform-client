import React, { useEffect, useRef, useState } from "react";
import {
  Check,
  ChevronDown,
  Image as ImageIcon,
  Info,
  Loader2,
  Search,
  Upload,
  Video,
} from "lucide-react";
import { toast } from "react-toastify";
import {
  uploadMetaMedia,
  type MetaAdsPage,
} from "../../../../../../api/metaCampaignsApi";
import type { AdDraft, InstantFormItem } from "../adsManagerTypes";
import AdsManagerCreateLeadFormModal from "../AdsManagerCreateLeadFormModal";
import { META_AD_CTAS, metaCtaLabel } from "../metaAdCtas";
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

type Props = {
  ad: AdDraft;
  forms: InstantFormItem[];
  formsLoading?: boolean;
  formsError?: string;
  pages: MetaAdsPage[];
  businessId: string | null;
  onChange: (patch: Partial<AdDraft>) => void;
  onFormsRefresh?: () => Promise<void> | void;
};

export default function AdLevelEditor({
  ad,
  forms,
  formsLoading = false,
  formsError = "",
  pages,
  businessId,
  onChange,
  onFormsRefresh,
}: Props) {
  const visibleForms = forms.filter((f) => f.status === ad.formTab);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [mediaMenuOpen, setMediaMenuOpen] = useState(false);
  const [ctaOpen, setCtaOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formSearch, setFormSearch] = useState("");
  const [createFormOpen, setCreateFormOpen] = useState(false);
  const ctaRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!ctaRef.current?.contains(e.target as Node)) setCtaOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const filteredForms = visibleForms.filter((form) => {
    const q = formSearch.trim().toLowerCase();
    if (!q) return true;
    return form.name.toLowerCase().includes(q);
  });

  const pickMedia = (format: "image" | "video") => {
    onChange({ creativeFormat: format });
    setMediaMenuOpen(false);
    window.setTimeout(() => fileRef.current?.click(), 0);
  };

  const handleUpload = async (file: File | null) => {
    if (!file || !businessId) {
      if (!businessId) toast.error("Connect Meta Ads first");
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
          mediaLabel: file.name || "Video uploaded",
        });
      } else {
        onChange({
          creativeFormat: "image",
          imageHash: result.imageHash || "",
          imagePreviewUrl: result.url || "",
          videoId: "",
          mediaLabel: file.name || "Image uploaded",
        });
      }
      toast.success(isVideo ? "Video uploaded to Meta" : "Image uploaded to Meta");
    } catch (error: unknown) {
      const err = error as { response?: { data?: { error?: string } } };
      toast.error(err.response?.data?.error || "Media upload failed");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  return (
    <div className="mx-auto max-w-[760px] space-y-4 pb-24">
      <MetaSection
        title="Ad name"
        action={
          <button type="button" className={metaBtnSecondary}>
            Create template
          </button>
        }
      >
        <MetaField label="Ad name">
          <input
            className={metaInputClass}
            value={ad.name}
            onChange={(e) => onChange({ name: e.target.value })}
          />
        </MetaField>
      </MetaSection>

      <MetaSection title="Partnership ad">
        <MetaToggle
          checked={ad.partnershipAd}
          onChange={(partnershipAd) => onChange({ partnershipAd })}
          label="Partnership ad"
          description="Run ads from a partner’s identity with your account."
        />
      </MetaSection>

      <MetaSection title="Identity">
        <MetaField label="Facebook Page">
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
            <option value="">Select a Facebook Page</option>
            {pages.map((page) => (
              <option key={page.id} value={page.id}>
                {page.name}
              </option>
            ))}
          </select>
        </MetaField>
        <MetaNotice tone="success">
          You’ve accepted Meta’s Lead Ads Terms for this Page.
        </MetaNotice>
      </MetaSection>

      <MetaSection
        title="Destination"
        status={ad.instantFormId ? "ok" : "warn"}
      >
        <div className="space-y-5">
          <div>
            <h3 className="text-[15px] font-bold text-[#050505]">Website</h3>
            <div className="mt-3 space-y-3">
              <MetaField label="Website URL">
                <input
                  className={metaInputClass}
                  value={ad.websiteUrl}
                  onChange={(e) => onChange({ websiteUrl: e.target.value })}
                  placeholder="https://"
                />
              </MetaField>
              <MetaField
                label="Display link"
                hint="Shown on your ad instead of the full website URL."
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
                Instant form
              </h3>
              <button
                type="button"
                className={metaBtnPrimary}
                onClick={() => {
                  if (!ad.facebookPageId) {
                    toast.error("Select a Facebook Page first");
                    return;
                  }
                  setCreateFormOpen(true);
                }}
              >
                Create form
              </button>
            </div>

            <div className="relative mt-3">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8A8D91]" />
              <input
                className={`${metaInputClass} pl-9`}
                placeholder="Search your forms"
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
                    "px-3 py-2 text-[13px] font-bold capitalize",
                    ad.formTab === tab
                      ? "border-b-2 border-[#1877F2] text-[#1877F2]"
                      : "text-[#65676B]",
                  ].join(" ")}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="mt-2 max-h-56 space-y-1 overflow-y-auto">
              {formsLoading ? (
                <p className="inline-flex w-full items-center justify-center gap-2 px-2 py-6 text-[13px] font-semibold text-[#65676B]">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Loading Instant Forms from Meta…
                </p>
              ) : formsError ? (
                <div className="space-y-2 px-2 py-4 text-center">
                  <p className="text-[13px] font-semibold text-[#D97706]">
                    {formsError}
                  </p>
                  <p className="text-[12px] text-[#65676B]">
                    Select the same Facebook Page as in Meta Ads Manager, then
                    refresh.
                  </p>
                  {onFormsRefresh ? (
                    <button
                      type="button"
                      className={metaBtnSecondary}
                      onClick={() => onFormsRefresh()}
                    >
                      Refresh forms
                    </button>
                  ) : null}
                </div>
              ) : filteredForms.length === 0 ? (
                <p className="px-2 py-6 text-center text-[13px] text-[#65676B]">
                  {!ad.facebookPageId
                    ? "Select a Facebook Page in the Ad set to load Instant Forms from Meta."
                    : `No ${ad.formTab} Instant Forms on this Page in Meta. Create one or check the Archived tab.`}
                </p>
              ) : (
                filteredForms.map((form) => {
                  const selected = ad.instantFormId === form.id;
                  return (
                    <button
                      key={form.id}
                      type="button"
                      onClick={() => onChange({ instantFormId: form.id })}
                      className={[
                        "flex w-full items-center justify-between rounded-md border px-3 py-2.5 text-left transition",
                        selected
                          ? "border-[#1877F2] bg-[#E7F3FF]"
                          : "border-transparent hover:bg-[#F0F2F5]",
                      ].join(" ")}
                    >
                      <span>
                        <span className="block text-[14px] font-semibold text-[#050505]">
                          {form.name}
                        </span>
                        <span className="block text-[12px] text-[#65676B]">
                          Created on {form.updatedAt || "—"}
                          {form.customQuestions
                            ? ` · ${form.customQuestions} custom questions`
                            : ""}
                        </span>
                      </span>
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
                  );
                })
              )}
            </div>

            {!ad.instantFormId ? (
              <div className="mt-3">
                <MetaNotice tone="warning">
                  Create or select an instant form to publish this campaign.
                </MetaNotice>
              </div>
            ) : null}
          </div>
        </div>
      </MetaSection>

      <MetaSection title="Ad creative">
        <p className="text-[13px] text-[#65676B]">
          Select and optimize your ad text, media and enhancements.
        </p>

        <div className="relative">
          <p className="mb-1.5 text-[13px] font-semibold text-[#65676B]">
            Set up creative
          </p>
          <button
            type="button"
            className={`${metaInputClass} flex items-center justify-between text-left`}
            onClick={() => setMediaMenuOpen((v) => !v)}
          >
            <span className="font-semibold">
              {ad.creativeFormat === "video" ? "Video ad" : "Image ad"}
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
                  <span className="block text-[14px] font-semibold">Image ad</span>
                  <span className="block text-[12px] text-[#65676B]">
                    Upload a still image from your computer
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
                  <span className="block text-[14px] font-semibold">Video ad</span>
                  <span className="block text-[12px] text-[#65676B]">
                    Upload a video from your computer
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

        <MetaField label="Media">
          <div className="overflow-hidden rounded-lg border border-dashed border-[#CED0D4] bg-[#F7F8FA]">
            {ad.imagePreviewUrl ? (
              <img
                src={ad.imagePreviewUrl}
                alt="Ad creative"
                className="max-h-56 w-full object-contain"
              />
            ) : ad.videoId ? (
              <div className="flex h-40 flex-col items-center justify-center gap-2 text-[13px] font-semibold text-[#050505]">
                <Video className="h-8 w-8 text-[#1877F2]" />
                Video uploaded · ID {ad.videoId}
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
                  ? "Uploading to Meta…"
                  : ad.mediaLabel || "Choose the media to run with this ad."}
              </button>
            )}
          </div>
          {(ad.imagePreviewUrl || ad.videoId) && (
            <MetaLinkButton onClick={() => setMediaMenuOpen(true)}>
              Replace media
            </MetaLinkButton>
          )}
        </MetaField>

        <MetaField label="Primary text">
          <textarea
            className={`${metaInputClass} h-24 resize-y py-2`}
            value={ad.primaryText}
            onChange={(e) => onChange({ primaryText: e.target.value })}
          />
        </MetaField>
        <div className="grid gap-3 sm:grid-cols-2">
          <MetaField label="Headline">
            <input
              className={metaInputClass}
              value={ad.headline}
              onChange={(e) => onChange({ headline: e.target.value })}
            />
          </MetaField>
          <MetaField label="Description">
            <input
              className={metaInputClass}
              value={ad.description}
              onChange={(e) => onChange({ description: e.target.value })}
            />
          </MetaField>
        </div>
        <div className="relative" ref={ctaRef}>
          <p className="mb-1.5 flex items-center gap-1 text-[13px] font-semibold text-[#65676B]">
            Call to action
            <Info className="h-3.5 w-3.5 text-[#8A8D91]" />
          </p>
          <button
            type="button"
            className={[
              metaInputClass,
              "flex items-center justify-between text-left",
              ctaOpen ? "border-[#1877F2] shadow-[0_0_0_2px_rgba(24,119,242,0.2)]" : "",
            ].join(" ")}
            onClick={() => setCtaOpen((v) => !v)}
          >
            <span className="font-semibold">
              {metaCtaLabel(ad.callToAction)}
            </span>
            <ChevronDown className="h-4 w-4 text-[#65676B]" />
          </button>
          {ctaOpen ? (
            <div className="absolute z-40 mt-1 max-h-64 w-full overflow-y-auto rounded-lg border border-[#CED0D4] bg-white shadow-xl">
              {META_AD_CTAS.map((cta) => {
                const selected = ad.callToAction === cta.value;
                return (
                  <button
                    key={cta.value}
                    type="button"
                    className={[
                      "flex w-full items-center gap-3 px-3 py-2.5 text-left text-[14px]",
                      selected
                        ? "bg-[#E7F3FF] font-semibold text-[#050505]"
                        : "hover:bg-[#F0F2F5]",
                    ].join(" ")}
                    onClick={() => {
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
                      <Check className="ml-auto h-3.5 w-3.5 text-[#1877F2]" />
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
        onClose={() => setCreateFormOpen(false)}
        onCreated={async (formId) => {
          onChange({ instantFormId: formId, formTab: "active" });
          await onFormsRefresh?.();
        }}
      />
    </div>
  );
}
