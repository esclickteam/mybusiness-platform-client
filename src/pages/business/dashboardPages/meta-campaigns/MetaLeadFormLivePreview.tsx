import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { CheckCircle2, Facebook, Instagram } from "lucide-react";
import {
  LEAD_FORM_CONTACT_FIELDS,
  type LeadFormCustomQuestionDraft,
} from "./metaCampaignUtils";
import {
  isRtlLeadFormLocale,
  leadFormContactLabel,
} from "./ads-manager/metaLeadFormLocales";

type Props = {
  pageName: string;
  introTitle: string;
  introDescription: string;
  /** Contact field types (FULL_NAME, PHONE, …) or pre-resolved labels */
  contactFields: string[];
  customQuestions: LeadFormCustomQuestionDraft[];
  privacyLinkText: string;
  thankYouTitle: string;
  thankYouBody: string;
  thankYouButton: string;
  screen: "intro" | "questions" | "privacy" | "thanks";
  platform: "facebook" | "instagram";
  /** Meta form locale — drives RTL and contact field labels */
  locale?: string;
  onScreenChange?: (screen: "intro" | "questions" | "privacy" | "thanks") => void;
  onPlatformChange?: (platform: "facebook" | "instagram") => void;
};

const SCREENS: Array<"intro" | "questions" | "privacy" | "thanks"> = [
  "intro",
  "questions",
  "privacy",
  "thanks",
];

export default function MetaLeadFormLivePreview({
  pageName,
  introTitle,
  introDescription,
  contactFields,
  customQuestions,
  privacyLinkText,
  thankYouTitle,
  thankYouBody,
  thankYouButton,
  screen,
  platform,
  locale = "he_IL",
  onScreenChange,
  onPlatformChange,
}: Props) {
  const { t } = useTranslation();
  const pageInitial = (pageName || "P").trim().slice(0, 1).toUpperCase() || "P";
  const isInstagram = platform === "instagram";
  const screenIndex = Math.max(0, SCREENS.indexOf(screen));
  const previewDir = isRtlLeadFormLocale(locale) ? "rtl" : "ltr";

  const resolvedContactLabels = useMemo(() => {
    return (contactFields || []).map((field) => {
      const upper = String(field || "").trim().toUpperCase();
      const known = LEAD_FORM_CONTACT_FIELDS.some((item) => item.type === upper);
      if (!known) return field;
      return leadFormContactLabel(
        upper,
        locale,
        LEAD_FORM_CONTACT_FIELDS as unknown as Array<{
          type: string;
          labelHe: string;
          labelEn: string;
        }>
      );
    });
  }, [contactFields, locale]);

  const ctaLabel = useMemo(() => {
    if (screen === "thanks") {
      return thankYouButton.trim() || t("metaCampaigns.wizard.formPreview.done");
    }
    if (screen === "privacy") {
      return t("metaCampaigns.wizard.formPreview.submit");
    }
    return t("metaCampaigns.wizard.formPreview.continue");
  }, [screen, t, thankYouButton]);

  return (
    <div className="mx-auto w-full max-w-[320px]" dir={previewDir}>
      <div className="mb-3 flex gap-2">
        <button
          type="button"
          onClick={() => onPlatformChange?.("facebook")}
          className={[
            "inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl border px-2 py-2 text-xs font-black",
            !isInstagram
              ? "border-[#1877F2] bg-[#1877F2]/10 text-[#1877F2]"
              : "border-slate-200 bg-white text-slate-500",
          ].join(" ")}
        >
          <Facebook className="h-3.5 w-3.5" />
          Facebook
        </button>
        <button
          type="button"
          onClick={() => onPlatformChange?.("instagram")}
          className={[
            "inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl border px-2 py-2 text-xs font-black",
            isInstagram
              ? "border-[#E1306C] bg-[#E1306C]/10 text-[#E1306C]"
              : "border-slate-200 bg-white text-slate-500",
          ].join(" ")}
        >
          <Instagram className="h-3.5 w-3.5" />
          Instagram
        </button>
      </div>

      <div
        className={[
          "rounded-[1.75rem] p-3 shadow-xl",
          isInstagram
            ? "bg-gradient-to-b from-[#f8e7f0] via-[#f3f4f6] to-[#e8eefc]"
            : "bg-gradient-to-b from-[#dbeafe] via-[#eef2ff] to-[#f8fafc]",
        ].join(" ")}
      >
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
          <div className="flex items-center gap-2.5 border-b border-slate-100 px-4 py-3">
            <div
              className={[
                "flex h-10 w-10 items-center justify-center text-sm font-black text-white",
                isInstagram
                  ? "rounded-full bg-gradient-to-br from-fuchsia-500 via-rose-500 to-amber-400"
                  : "rounded-full bg-[#1877F2]",
              ].join(" ")}
            >
              {pageInitial}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-black text-slate-900">
                {pageName || t("metaCampaigns.wizard.formPreview.pagePlaceholder")}
              </p>
              <p className="text-[11px] font-semibold text-slate-400">
                {t("metaCampaigns.wizard.formPreview.sponsored")}
              </p>
            </div>
          </div>

          <div className="min-h-[280px] px-4 py-4">
            {screen === "intro" ? (
              <div className="space-y-3">
                <h3 className="whitespace-pre-wrap text-[22px] font-black leading-snug text-slate-900">
                  {introTitle.trim() || (
                    <span className="text-slate-300">
                      {t("metaCampaigns.wizard.formPreview.introTitlePlaceholder")}
                    </span>
                  )}
                </h3>
                <p className="whitespace-pre-wrap text-sm font-semibold leading-relaxed text-slate-600">
                  {introDescription.trim() || (
                    <span className="text-slate-300">
                      {t("metaCampaigns.wizard.formPreview.introDescriptionPlaceholder")}
                    </span>
                  )}
                </p>
              </div>
            ) : null}

            {screen === "questions" ? (
              <div className="space-y-3">
                <p className="text-sm font-black text-slate-900">
                  {t("metaCampaigns.wizard.formPreview.contactTitle")}
                </p>
                {(resolvedContactLabels.length
                  ? resolvedContactLabels
                  : [t("metaCampaigns.wizard.formPreview.noContactFields")]
                ).map((label, index) => (
                  <label key={`contact-${index}`} className="block">
                    <span className="mb-1 block text-xs font-black text-slate-700">
                      {label}
                    </span>
                    <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-semibold text-slate-400">
                      {t("metaCampaigns.wizard.formPreview.answerPlaceholder")}
                    </div>
                  </label>
                ))}
                {customQuestions.map((question) => (
                  <label key={question.id} className="block">
                    <span className="mb-1 block text-xs font-black text-slate-700">
                      {question.label.trim() || (
                        <span className="text-slate-300">
                          {t("metaCampaigns.wizard.formPreview.questionPlaceholder")}
                        </span>
                      )}
                    </span>
                    {question.answerType === "multiple_choice" ? (
                      <div className="space-y-1.5">
                        {(question.options || []).filter(Boolean).map((opt, index) => (
                          <div
                            key={`${question.id}-opt-${index}`}
                            className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700"
                          >
                            <span className="h-3.5 w-3.5 rounded-full border-2 border-slate-300" />
                            {opt}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-semibold text-slate-400">
                        {t("metaCampaigns.wizard.formPreview.answerPlaceholder")}
                      </div>
                    )}
                  </label>
                ))}
              </div>
            ) : null}

            {screen === "privacy" ? (
              <div className="space-y-3">
                <p className="text-base font-black text-slate-900">
                  {t("metaCampaigns.wizard.formPreview.privacyCheckTitle")}
                </p>
                <p className="text-sm font-semibold leading-relaxed text-slate-600">
                  {t("metaCampaigns.wizard.formPreview.privacyIntro", {
                    page: pageName || t("metaCampaigns.wizard.formPreview.pagePlaceholder"),
                  })}
                </p>
                <p className="text-sm font-black text-[#1877F2] underline">
                  {privacyLinkText.trim() ||
                    t("metaCampaigns.wizard.formPreview.privacyLinkPlaceholder")}
                </p>
              </div>
            ) : null}

            {screen === "thanks" ? (
              <div className="space-y-3 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#1877F2]/10 text-[#1877F2]">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h3 className="whitespace-pre-wrap text-xl font-black text-slate-900">
                  {thankYouTitle.trim() || (
                    <span className="text-slate-300">
                      {t("metaCampaigns.wizard.formPreview.thankYouTitlePlaceholder")}
                    </span>
                  )}
                </h3>
                <p className="whitespace-pre-wrap text-sm font-semibold text-slate-600">
                  {thankYouBody.trim() || (
                    <span className="text-slate-300">
                      {t("metaCampaigns.wizard.formPreview.thankYouBodyPlaceholder")}
                    </span>
                  )}
                </p>
              </div>
            ) : null}
          </div>

          <div className="border-t border-slate-100 px-4 py-3">
            <button
              type="button"
              className="w-full rounded-lg bg-[#1877F2] px-4 py-3 text-sm font-black text-white"
            >
              {ctaLabel}
              {screen !== "thanks" && screen !== "privacy" ? " →" : ""}
            </button>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between px-1">
          <button
            type="button"
            className="text-xs font-black text-slate-500"
            onClick={() =>
              onScreenChange?.(SCREENS[Math.max(0, screenIndex - 1)])
            }
          >
            ‹
          </button>
          <p className="text-[11px] font-black text-slate-600">
            {screenIndex + 1} {t("metaCampaigns.wizard.formPreview.of")} {SCREENS.length} ·{" "}
            {t(`metaCampaigns.wizard.formPreview.screen.${screen}`)}
          </p>
          <button
            type="button"
            className="text-xs font-black text-slate-500"
            onClick={() =>
              onScreenChange?.(
                SCREENS[Math.min(SCREENS.length - 1, screenIndex + 1)]
              )
            }
          >
            ›
          </button>
        </div>
      </div>
    </div>
  );
}
