import React from "react";
import { Search } from "lucide-react";
import type { MetaAdsPage } from "../../../../../../api/metaCampaignsApi";
import type { AdDraft, InstantFormItem } from "../adsManagerTypes";
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
  pages: MetaAdsPage[];
  onChange: (patch: Partial<AdDraft>) => void;
};

export default function AdLevelEditor({ ad, forms, pages, onChange }: Props) {
  const visibleForms = forms.filter((f) => f.status === ad.formTab);

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
        <div className="grid gap-4 sm:grid-cols-2">
          <MetaField label="Instagram profile">
            <select
              className={metaSelectClass}
              value={ad.instagramAccountId}
              onChange={(e) => onChange({ instagramAccountId: e.target.value })}
            >
              <option value="ig_1">@yourbusiness</option>
              <option value="">Don’t use Instagram</option>
            </select>
          </MetaField>
          <MetaField label="Threads profile">
            <select
              className={metaSelectClass}
              value={
                ad.useInstagramForThreads
                  ? "use_ig"
                  : ad.threadsAccountId || ""
              }
              onChange={(e) => {
                if (e.target.value === "use_ig") {
                  onChange({
                    useInstagramForThreads: true,
                    threadsAccountId: "",
                  });
                } else {
                  onChange({
                    useInstagramForThreads: false,
                    threadsAccountId: e.target.value,
                  });
                }
              }}
            >
              <option value="use_ig">Use Instagram account</option>
              <option value="threads_1">@yourbusiness</option>
              <option value="">Don’t use Threads</option>
            </select>
          </MetaField>
        </div>
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
              <MetaLinkButton>Build a URL parameter</MetaLinkButton>
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
              <button type="button" className={metaBtnPrimary}>
                Create form
              </button>
            </div>

            <div className="relative mt-3">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8A8D91]" />
              <input
                className={`${metaInputClass} pl-9`}
                placeholder="Search your forms"
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
              {visibleForms.length === 0 ? (
                <p className="px-2 py-6 text-center text-[13px] text-[#65676B]">
                  No {ad.formTab} forms yet.
                </p>
              ) : (
                visibleForms.map((form) => {
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
                          {form.customQuestions} custom questions · Updated{" "}
                          {form.updatedAt}
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

          <div className="border-t border-[#E4E6EB] pt-5">
            <h3 className="text-[15px] font-bold text-[#050505]">
              Quality filters
            </h3>
            <div className="mt-3 space-y-3">
              <MetaToggle
                checked={ad.requireSmsVerification}
                onChange={(requireSmsVerification) =>
                  onChange({ requireSmsVerification })
                }
                label="Require SMS verification to submit form"
              />
              <MetaToggle
                checked={ad.requireWorkEmail}
                onChange={(requireWorkEmail) =>
                  onChange({ requireWorkEmail })
                }
                label="Require work email"
              />
            </div>
          </div>
        </div>
      </MetaSection>

      <MetaSection title="Ad creative">
        <MetaField label="Media">
          <div className="flex h-28 items-center justify-center rounded-lg border border-dashed border-[#CED0D4] bg-[#F7F8FA] text-[13px] font-semibold text-[#65676B]">
            {ad.mediaLabel}
          </div>
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
        <MetaField label="Call to action">
          <select
            className={metaSelectClass}
            value={ad.callToAction}
            onChange={(e) => onChange({ callToAction: e.target.value })}
          >
            <option value="LEARN_MORE">Learn more</option>
            <option value="SIGN_UP">Sign up</option>
            <option value="GET_QUOTE">Get quote</option>
            <option value="APPLY_NOW">Apply now</option>
          </select>
        </MetaField>
      </MetaSection>
    </div>
  );
}
