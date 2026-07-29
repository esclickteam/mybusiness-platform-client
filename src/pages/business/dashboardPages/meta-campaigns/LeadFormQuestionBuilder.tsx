import React from "react";
import { useTranslation } from "react-i18next";
import { ListChecks, Plus, Trash2, Type } from "lucide-react";
import { btnGhost, btnSecondary, inputBase } from "../../../../styles/bizuplyUi";
import {
  createLeadFormCustomQuestion,
  LEAD_FORM_CONTACT_FIELDS,
  type LeadFormAnswerType,
  type LeadFormCustomQuestionDraft,
} from "./metaCampaignUtils";

type Props = {
  contactTypes: string[];
  customQuestions: LeadFormCustomQuestionDraft[];
  onContactTypesChange: (types: string[]) => void;
  onCustomQuestionsChange: (questions: LeadFormCustomQuestionDraft[]) => void;
  disabled?: boolean;
};

export default function LeadFormQuestionBuilder({
  contactTypes,
  customQuestions,
  onContactTypesChange,
  onCustomQuestionsChange,
  disabled = false,
}: Props) {
  const { t, i18n } = useTranslation();
  const isHe = (i18n.language || "he").startsWith("he");

  const toggleContact = (type: string) => {
    if (disabled) return;
    const exists = contactTypes.includes(type);
    onContactTypesChange(
      exists
        ? contactTypes.filter((item) => item !== type)
        : [...contactTypes, type]
    );
  };

  const updateCustom = (
    id: string,
    patch: Partial<LeadFormCustomQuestionDraft>
  ) => {
    onCustomQuestionsChange(
      customQuestions.map((item) =>
        item.id === id ? { ...item, ...patch } : item
      )
    );
  };

  const setAnswerType = (id: string, answerType: LeadFormAnswerType) => {
    const question = customQuestions.find((item) => item.id === id);
    if (!question) return;
    if (answerType === "multiple_choice") {
      updateCustom(id, {
        answerType,
        options: question.options?.length ? question.options : ["", ""],
      });
      return;
    }
    updateCustom(id, { answerType, options: [] });
  };

  const updateOption = (id: string, index: number, value: string) => {
    const question = customQuestions.find((item) => item.id === id);
    if (!question) return;
    const options = [...(question.options || [])];
    options[index] = value;
    updateCustom(id, { options });
  };

  const addOption = (id: string) => {
    const question = customQuestions.find((item) => item.id === id);
    if (!question) return;
    updateCustom(id, { options: [...(question.options || []), ""] });
  };

  const removeOption = (id: string, index: number) => {
    const question = customQuestions.find((item) => item.id === id);
    if (!question) return;
    const options = (question.options || []).filter((_, i) => i !== index);
    updateCustom(id, {
      options: options.length >= 2 ? options : [...options, ""].slice(0, 2),
    });
  };

  return (
    <div className="space-y-5">
      <div className="space-y-3">
        <div>
          <p className="text-sm font-black text-slate-900">
            {t("metaCampaigns.form.contactInfoTitle")}
          </p>
          <p className="mt-1 text-xs font-semibold text-slate-500">
            {t("metaCampaigns.form.contactInfoHint")}
          </p>
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          {LEAD_FORM_CONTACT_FIELDS.map((field) => {
            const checked = contactTypes.includes(field.type);
            const label = isHe ? field.labelHe : field.labelEn;
            return (
              <label
                key={field.type}
                className={[
                  "flex cursor-pointer items-center gap-3 rounded-xl border px-3 py-2.5 text-sm font-semibold transition",
                  checked
                    ? "border-[#1877F2] bg-[#1877F2]/5 text-slate-900"
                    : "border-slate-200 bg-white text-slate-700 hover:border-slate-300",
                  disabled ? "pointer-events-none opacity-60" : "",
                ].join(" ")}
              >
                <input
                  type="checkbox"
                  className="h-4 w-4 accent-[#1877F2]"
                  checked={checked}
                  disabled={disabled}
                  onChange={() => toggleContact(field.type)}
                />
                <span>{label}</span>
              </label>
            );
          })}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-black text-slate-900">
              {t("metaCampaigns.form.customQuestionsTitle")}
            </p>
            <p className="mt-1 text-xs font-semibold text-slate-500">
              {t("metaCampaigns.form.customQuestionsHint")}
            </p>
          </div>
          <button
            type="button"
            className={btnSecondary}
            disabled={disabled}
            onClick={() =>
              onCustomQuestionsChange([
                ...customQuestions,
                createLeadFormCustomQuestion({
                  answerType: "multiple_choice",
                }),
              ])
            }
          >
            <Plus className="h-4 w-4" />
            {t("metaCampaigns.form.addCustomQuestion")}
          </button>
        </div>

        {!customQuestions.length ? (
          <p className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-3 py-4 text-sm font-semibold text-slate-500">
            {t("metaCampaigns.form.noCustomQuestionsYet")}
          </p>
        ) : (
          <div className="space-y-3">
            {customQuestions.map((question, index) => (
              <div
                key={question.id}
                className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4"
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-black uppercase tracking-wide text-slate-400">
                    {t("metaCampaigns.form.customQuestionN", { n: index + 1 })}
                  </p>
                  <button
                    type="button"
                    className={btnGhost}
                    disabled={disabled}
                    onClick={() =>
                      onCustomQuestionsChange(
                        customQuestions.filter((item) => item.id !== question.id)
                      )
                    }
                    aria-label={t("metaCampaigns.form.removeQuestion")}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600">
                    {t("metaCampaigns.form.questionLabel")}
                  </label>
                  <input
                    className={inputBase}
                    value={question.label}
                    disabled={disabled}
                    onChange={(e) =>
                      updateCustom(question.id, { label: e.target.value })
                    }
                    placeholder={t(
                      "metaCampaigns.form.questionLabelPlaceholder"
                    )}
                  />
                </div>

                <div className="space-y-1.5">
                  <p className="text-xs font-bold text-slate-600">
                    {t("metaCampaigns.form.answerType")}
                  </p>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {(
                      [
                        [
                          "multiple_choice",
                          ListChecks,
                          t("metaCampaigns.form.answerTypeMultiple"),
                        ],
                        [
                          "short_answer",
                          Type,
                          t("metaCampaigns.form.answerTypeShort"),
                        ],
                      ] as const
                    ).map(([value, Icon, label]) => {
                      const active = question.answerType === value;
                      return (
                        <button
                          key={value}
                          type="button"
                          disabled={disabled}
                          onClick={() => setAnswerType(question.id, value)}
                          className={[
                            "flex items-center gap-2 rounded-xl border px-3 py-2.5 text-start text-sm font-semibold",
                            active
                              ? "border-[#1877F2] bg-[#1877F2]/5 text-slate-900"
                              : "border-slate-200 bg-slate-50 text-slate-600",
                          ].join(" ")}
                        >
                          <Icon className="h-4 w-4 shrink-0" />
                          {label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {question.answerType === "multiple_choice" ? (
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-slate-600">
                      {t("metaCampaigns.form.choiceOptions")}
                    </p>
                    {(question.options || []).map((option, optionIndex) => (
                      <div key={optionIndex} className="flex gap-2">
                        <input
                          className={inputBase}
                          value={option}
                          disabled={disabled}
                          onChange={(e) =>
                            updateOption(
                              question.id,
                              optionIndex,
                              e.target.value
                            )
                          }
                          placeholder={t(
                            "metaCampaigns.form.optionPlaceholder",
                            { n: optionIndex + 1 }
                          )}
                        />
                        <button
                          type="button"
                          className={btnGhost}
                          disabled={disabled || (question.options || []).length <= 2}
                          onClick={() => removeOption(question.id, optionIndex)}
                          aria-label={t("metaCampaigns.form.removeOption")}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      className={btnSecondary}
                      disabled={disabled}
                      onClick={() => addOption(question.id)}
                    >
                      <Plus className="h-4 w-4" />
                      {t("metaCampaigns.form.addOption")}
                    </button>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
