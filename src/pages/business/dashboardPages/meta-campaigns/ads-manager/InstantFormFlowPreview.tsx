import React, { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Facebook, X } from "lucide-react";
import type {
  MetaLeadForm,
  MetaLeadFormQuestion,
} from "../../../../../api/metaCampaignsApi";
import { LEAD_FORM_CONTACT_FIELDS } from "../metaCampaignUtils";
import {
  isRtlLeadFormLocale,
  leadFormContactLabel,
} from "./metaLeadFormLocales";

type FlowScreen =
  | {
      kind: "intro";
      label: string;
      /** Meta often shows the first custom question under the intro card */
      question?: MetaLeadFormQuestion;
    }
  | { kind: "custom"; label: string; question: MetaLeadFormQuestion }
  | { kind: "contact"; label: string; fields: MetaLeadFormQuestion[] }
  | { kind: "privacy"; label: string }
  | { kind: "thanks"; label: string };

type Props = {
  form: MetaLeadForm | null;
  pageName: string;
  fallbackHeadline?: string;
  className?: string;
};

function optionValue(opt: string | { key?: string; value: string }) {
  if (typeof opt === "string") return opt;
  return String(opt?.value || opt?.key || "").trim();
}

function buildScreens(form: MetaLeadForm | null): FlowScreen[] {
  if (!form) return [];

  const questions = Array.isArray(form.questions) ? form.questions : [];
  const custom = questions.filter(
    (q) => String(q.type || "").toUpperCase() === "CUSTOM"
  );
  const contact = questions.filter(
    (q) => String(q.type || "").toUpperCase() !== "CUSTOM"
  );

  const hasIntro = Boolean(
    form.contextCard?.title?.trim() || form.contextCard?.content?.trim()
  );
  const screens: FlowScreen[] = [];

  if (hasIntro) {
    screens.push({
      kind: "intro",
      label: custom[0] ? "Custom Questions" : "Intro",
      question: custom[0],
    });
    for (const question of custom.slice(1)) {
      screens.push({ kind: "custom", label: "Custom Questions", question });
    }
  } else {
    for (const question of custom) {
      screens.push({ kind: "custom", label: "Custom Questions", question });
    }
  }

  if (contact.length) {
    screens.push({
      kind: "contact",
      label: "Contact information",
      fields: contact,
    });
  }
  screens.push({ kind: "privacy", label: "Privacy" });
  screens.push({ kind: "thanks", label: "Ending" });
  return screens;
}

export default function InstantFormFlowPreview({
  form,
  pageName,
  fallbackHeadline = "",
  className = "",
}: Props) {
  const screens = useMemo(() => buildScreens(form), [form]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setIndex(0);
  }, [form?.id]);

  const locale = form?.locale || "he_IL";
  const dir = isRtlLeadFormLocale(locale) ? "rtl" : "ltr";
  const screen = screens[index] || null;
  const total = Math.max(screens.length, 1);
  const progress = ((index + 1) / total) * 100;
  const he = locale.toLowerCase().startsWith("he");

  const introTitle =
    form?.contextCard?.title?.trim() ||
    fallbackHeadline.trim() ||
    form?.name ||
    "Lead form";
  const introBody = form?.contextCard?.content?.trim() || "";

  const continueLabel = he ? "המשך" : "Continue";
  const submitLabel = he ? "שלח" : "Submit";
  const answerPlaceholder = he ? "הזן את תשובתך" : "Enter your answer";

  if (!form) {
    return (
      <div
        className={[
          "rounded-xl border border-[#E4E6EB] bg-[#F7F8FA] px-3 py-6 text-center text-[12px] font-semibold text-[#65676B]",
          className,
        ].join(" ")}
      >
        Select or create an instant form to preview it here.
      </div>
    );
  }

  return (
    <div className={["space-y-2", className].join(" ")}>
      <div className="flex items-center gap-1.5 text-[12px] font-bold text-[#65676B]">
        <Facebook className="h-3.5 w-3.5 text-[#1877F2]" />
        Facebook Form
      </div>

      <div className="overflow-hidden rounded-xl border border-[#CED0D4] bg-[#E4E6EB] shadow-sm">
        <div
          className="mx-auto max-w-[280px] bg-gradient-to-b from-[#dbeafe] via-[#eef2ff] to-[#f0f2f5] px-2.5 pb-3 pt-2"
          dir={dir}
        >
          <div className="overflow-hidden rounded-2xl bg-white shadow-md">
            <div className="flex items-center justify-between px-3 py-2.5 text-[#050505]">
              <ChevronLeft className="h-4 w-4 opacity-50" />
              <X className="h-4 w-4 opacity-50" />
            </div>

            <div className="min-h-[300px] px-3 pb-3">
              {screen?.kind === "intro" ? (
                <div className="space-y-3">
                  <div className="flex flex-col items-center text-center">
                    <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-[#1877F2] text-[15px] font-black text-white">
                      {(pageName || "P").trim().slice(0, 1).toUpperCase()}
                    </div>
                    <p className="text-[12px] font-semibold text-[#65676B]">
                      {pageName || "Your Page"}
                    </p>
                  </div>
                  <h3 className="text-center text-[18px] font-black leading-snug text-[#050505]">
                    {introTitle}
                  </h3>
                  {introBody ? (
                    <p className="text-center text-[12px] font-semibold leading-relaxed text-[#65676B]">
                      {introBody}
                    </p>
                  ) : null}
                  {screen.question ? (
                    <CustomQuestionBlock
                      question={screen.question}
                      answerPlaceholder={answerPlaceholder}
                    />
                  ) : null}
                </div>
              ) : null}

              {screen?.kind === "custom" ? (
                <CustomQuestionBlock
                  question={screen.question}
                  answerPlaceholder={answerPlaceholder}
                />
              ) : null}

              {screen?.kind === "contact" ? (
                <div className="space-y-3">
                  <p className="text-[14px] font-black text-[#050505]">
                    {he ? "פרטי התקשרות" : "Contact information"}
                  </p>
                  {screen.fields.map((field) => {
                    const label = leadFormContactLabel(
                      String(field.type || "").toUpperCase(),
                      locale,
                      LEAD_FORM_CONTACT_FIELDS as unknown as Array<{
                        type: string;
                        labelHe: string;
                        labelEn: string;
                      }>
                    );
                    return (
                      <label key={field.id || field.type} className="block">
                        <span className="mb-1 block text-[12px] font-bold text-[#050505]">
                          {label}
                        </span>
                        <div className="border-b border-[#CED0D4] py-2 text-[12px] text-[#8A8D91]">
                          {answerPlaceholder}
                        </div>
                      </label>
                    );
                  })}
                </div>
              ) : null}

              {screen?.kind === "privacy" ? (
                <div className="space-y-3">
                  <p className="text-[14px] font-black text-[#050505]">
                    {he ? "מדיניות פרטיות" : "Privacy policy"}
                  </p>
                  <p className="text-[12px] font-semibold leading-relaxed text-[#65676B]">
                    {he
                      ? `הפרטים שתשלחו ישמשו ליצירת קשר עם ${pageName || "העסק"}.`
                      : `By continuing, you agree that ${pageName || "this business"} may contact you.`}
                  </p>
                  <p className="text-[12px] font-bold text-[#1877F2] underline">
                    {he ? "מדיניות פרטיות" : "Privacy policy"}
                  </p>
                </div>
              ) : null}

              {screen?.kind === "thanks" ? (
                <div className="space-y-3 pt-4 text-center">
                  <h3 className="text-[18px] font-black text-[#050505]">
                    {form.thankYouPage?.title?.trim() ||
                      (he ? "תודה!" : "Thanks!")}
                  </h3>
                  <p className="text-[12px] font-semibold text-[#65676B]">
                    {form.thankYouPage?.body?.trim() ||
                      (he
                        ? "ניצור איתכם קשר בהקדם."
                        : "We’ll be in touch soon.")}
                  </p>
                </div>
              ) : null}
            </div>

            <div className="px-3 pb-3">
              <div className="mb-2 h-1 overflow-hidden rounded-full bg-[#E4E6EB]">
                <div
                  className="h-full rounded-full bg-[#31A24C] transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <button
                type="button"
                className="flex h-10 w-full items-center justify-center rounded-md bg-[#1877F2] text-[14px] font-bold text-white"
              >
                {screen?.kind === "thanks"
                  ? form.thankYouPage?.buttonText?.trim() ||
                    (he ? "סיום" : "Done")
                  : screen?.kind === "privacy"
                    ? submitLabel
                    : continueLabel}
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-[#CED0D4] bg-white px-2 py-2">
          <span className="min-w-0 truncate px-1 text-[11px] font-bold text-[#65676B]">
            {screen?.label || "Form"}
          </span>
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-semibold text-[#65676B]">
              {Math.min(index + 1, total)} of {total}
            </span>
            <button
              type="button"
              className="rounded border border-[#CED0D4] p-1 text-[#050505] disabled:opacity-40"
              disabled={index <= 0}
              onClick={() => setIndex((v) => Math.max(0, v - 1))}
              aria-label="Previous form screen"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              className="rounded border border-[#CED0D4] p-1 text-[#050505] disabled:opacity-40"
              disabled={index >= total - 1}
              onClick={() => setIndex((v) => Math.min(total - 1, v + 1))}
              aria-label="Next form screen"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function CustomQuestionBlock({
  question,
  answerPlaceholder,
}: {
  question: MetaLeadFormQuestion;
  answerPlaceholder: string;
}) {
  const options = (question.options || []).map(optionValue).filter(Boolean);

  return (
    <div className="space-y-2.5">
      <p className="text-[15px] font-black leading-snug text-[#050505]">
        {question.label?.trim() || "Question"}
      </p>
      {options.length ? (
        <div className="space-y-2">
          {options.map((opt) => (
            <div
              key={opt}
              className="flex items-center justify-between gap-2 rounded-lg border border-[#CED0D4] bg-white px-3 py-2.5"
            >
              <span className="text-[12px] font-semibold text-[#050505]">
                {opt}
              </span>
              <span className="h-4 w-4 shrink-0 rounded-full border-2 border-[#BEC3C9]" />
            </div>
          ))}
        </div>
      ) : (
        <div className="border-b border-[#CED0D4] py-2 text-[12px] text-[#8A8D91]">
          {answerPlaceholder}
        </div>
      )}
    </div>
  );
}
