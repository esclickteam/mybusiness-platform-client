import React from "react";
import { useTranslation } from "react-i18next";
import type { LeadFormCustomQuestionDraft } from "./metaCampaignUtils";

type Props = {
  pageName: string;
  introTitle: string;
  introDescription: string;
  contactFields: string[];
  customQuestions: LeadFormCustomQuestionDraft[];
  privacyLinkText: string;
  thankYouTitle: string;
  thankYouBody: string;
  thankYouButton: string;
  screen: "intro" | "questions" | "privacy" | "thanks";
  platform: "facebook" | "instagram";
};

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
}: Props) {
  const { t } = useTranslation();
  const pageInitial = (pageName || "P").trim().slice(0, 1).toUpperCase() || "P";
  const isInstagram = platform === "instagram";

  const ctaLabel =
    screen === "thanks"
      ? thankYouButton || t("metaCampaigns.wizard.formPreview.done")
      : screen === "privacy"
        ? t("metaCampaigns.wizard.formPreview.submit")
        : t("metaCampaigns.wizard.formPreview.continue");

  return (
    <div className="mx-auto w-full max-w-[300px]" dir="rtl">
      <div className="overflow-hidden rounded-[2rem] border-[5px] border-slate-900 bg-slate-900 shadow-2xl">
        <div className="bg-slate-100 px-3 py-2 text-center">
          <p className="text-[10px] font-bold text-slate-500">
            {isInstagram
              ? t("metaCampaigns.wizard.formPreview.platformInstagram")
              : t("metaCampaigns.wizard.formPreview.platformFacebook")}
          </p>
        </div>

        <div className="bg-white px-4 pb-5 pt-4">
          <div className="mb-4 flex items-center gap-2.5">
            <div
              className={[
                "flex h-9 w-9 items-center justify-center text-sm font-black text-white",
                isInstagram
                  ? "rounded-full bg-gradient-to-br from-fuchsia-500 via-rose-500 to-amber-400"
                  : "rounded-full bg-[#1877F2]",
              ].join(" ")}
            >
              {pageInitial}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-black text-slate-900">
                {pageName || t("metaCampaigns.wizard.formPreview.pagePlaceholder")}
              </p>
              <p className="text-[10px] font-semibold text-slate-400">
                {t("metaCampaigns.wizard.formPreview.sponsored")}
              </p>
            </div>
          </div>

          {screen === "intro" ? (
            <div className="space-y-3">
              <h3 className="text-lg font-black leading-snug text-slate-900">
                {introTitle || t("metaCampaigns.wizard.formPreview.introTitlePlaceholder")}
              </h3>
              <p className="text-sm font-semibold leading-relaxed text-slate-600">
                {introDescription ||
                  t("metaCampaigns.wizard.formPreview.introDescriptionPlaceholder")}
              </p>
            </div>
          ) : null}

          {screen === "questions" ? (
            <div className="space-y-3">
              {contactFields.length ? (
                contactFields.map((label, index) => (
                  <label key={`contact-${index}`} className="block">
                    <span className="mb-1 block text-xs font-black text-slate-600">
                      {label}
                    </span>
                    <div className="h-10 rounded-xl border border-slate-200 bg-slate-50" />
                  </label>
                ))
              ) : (
                <p className="text-xs font-semibold text-slate-400">
                  {t("metaCampaigns.wizard.formPreview.noContactFields")}
                </p>
              )}
              {customQuestions.map((question) => (
                <label key={question.id} className="block">
                  <span className="mb-1 block text-xs font-black text-slate-600">
                    {question.label ||
                      t("metaCampaigns.wizard.formPreview.questionPlaceholder")}
                  </span>
                  {question.answerType === "multiple_choice" ? (
                    <div className="space-y-1.5">
                      {(question.options || []).filter(Boolean).map((opt, index) => (
                        <div
                          key={`${question.id}-opt-${index}`}
                          className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700"
                        >
                          <span className="h-3.5 w-3.5 rounded-full border-2 border-slate-300" />
                          {opt}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="h-10 rounded-xl border border-slate-200 bg-slate-50" />
                  )}
                </label>
              ))}
            </div>
          ) : null}

          {screen === "privacy" ? (
            <div className="space-y-3">
              <p className="text-sm font-semibold text-slate-600">
                {t("metaCampaigns.wizard.formPreview.privacyIntro")}
              </p>
              <p className="text-sm font-black text-[#1877F2] underline">
                {privacyLinkText ||
                  t("metaCampaigns.wizard.formPreview.privacyLinkPlaceholder")}
              </p>
            </div>
          ) : null}

          {screen === "thanks" ? (
            <div className="space-y-3 text-center">
              <h3 className="text-lg font-black text-slate-900">
                {thankYouTitle ||
                  t("metaCampaigns.wizard.formPreview.thankYouTitlePlaceholder")}
              </h3>
              <p className="text-sm font-semibold text-slate-600">
                {thankYouBody ||
                  t("metaCampaigns.wizard.formPreview.thankYouBodyPlaceholder")}
              </p>
            </div>
          ) : null}

          <button
            type="button"
            className="mt-5 w-full rounded-xl bg-[#1877F2] px-4 py-3 text-sm font-black text-white shadow-sm"
          >
            {ctaLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
