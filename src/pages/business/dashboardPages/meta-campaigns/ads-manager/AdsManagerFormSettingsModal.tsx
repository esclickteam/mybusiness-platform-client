import React, { useEffect, useMemo, useState } from "react";
import { Info, Plus, Trash2, X } from "lucide-react";
import {
  LEAD_FORM_CONTACT_FIELDS,
  suggestLeadFieldKey,
  type LeadFormCustomQuestionDraft,
} from "../metaCampaignUtils";
import { metaBtnPrimary, metaInputClass } from "./metaAdsUi";
import {
  META_LEAD_FORM_LOCALES,
  leadFormContactLabel,
  metaLeadFormLocaleLabel,
} from "./metaLeadFormLocales";

export type FormSharing = "restricted" | "open";

export type FormTrackingParam = {
  id: string;
  key: string;
  value: string;
};

type SettingsTab = "configuration" | "fieldNames" | "tracking";

type Props = {
  open: boolean;
  locale: string;
  sharing: FormSharing;
  contactTypes: string[];
  contactFieldKeys: Record<string, string>;
  customQuestions: LeadFormCustomQuestionDraft[];
  trackingParameters: FormTrackingParam[];
  onClose: () => void;
  onDone: (next: {
    locale: string;
    sharing: FormSharing;
    contactFieldKeys: Record<string, string>;
    customQuestions: LeadFormCustomQuestionDraft[];
    trackingParameters: FormTrackingParam[];
  }) => void;
};

const TABS: Array<{ id: SettingsTab; label: string }> = [
  { id: "configuration", label: "Form configuration" },
  { id: "fieldNames", label: "Field names" },
  { id: "tracking", label: "Tracking parameters" },
];

function newTrackingRow(): FormTrackingParam {
  return {
    id: `tp_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`,
    key: "",
    value: "",
  };
}

export default function AdsManagerFormSettingsModal({
  open,
  locale,
  sharing,
  contactTypes,
  contactFieldKeys,
  customQuestions,
  trackingParameters,
  onClose,
  onDone,
}: Props) {
  const [tab, setTab] = useState<SettingsTab>("configuration");
  const [draftLocale, setDraftLocale] = useState(locale);
  const [draftSharing, setDraftSharing] = useState<FormSharing>(sharing);
  const [draftContactKeys, setDraftContactKeys] =
    useState<Record<string, string>>(contactFieldKeys);
  const [draftQuestions, setDraftQuestions] =
    useState<LeadFormCustomQuestionDraft[]>(customQuestions);
  const [draftTracking, setDraftTracking] =
    useState<FormTrackingParam[]>(trackingParameters);
  const [localeOpen, setLocaleOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    setTab("configuration");
    setDraftLocale(locale);
    setDraftSharing(sharing);
    setDraftTracking(
      trackingParameters.length ? trackingParameters : []
    );
    setLocaleOpen(false);

    const nextContactKeys: Record<string, string> = { ...contactFieldKeys };
    for (const type of contactTypes) {
      if (!String(nextContactKeys[type] || "").trim()) {
        const label = leadFormContactLabel(
          type,
          locale,
          LEAD_FORM_CONTACT_FIELDS as Array<{
            type: string;
            labelHe: string;
            labelEn: string;
          }>
        );
        nextContactKeys[type] = suggestLeadFieldKey(label, type.toLowerCase());
      }
    }
    setDraftContactKeys(nextContactKeys);

    setDraftQuestions(
      customQuestions.map((question, index) => {
        const label = question.label.trim();
        const key =
          String(question.key || "").trim() ||
          suggestLeadFieldKey(label, `question_${index + 1}`);
        const optionKeys = (question.options || []).map((opt, optIndex) => {
          const existing = String(question.optionKeys?.[optIndex] || "").trim();
          if (existing) return existing;
          const value = String(opt || "").trim();
          return suggestLeadFieldKey(value, `option_${optIndex + 1}`);
        });
        return { ...question, key, optionKeys };
      })
    );
  }, [
    open,
    locale,
    sharing,
    contactTypes,
    contactFieldKeys,
    customQuestions,
    trackingParameters,
  ]);

  const fieldRows = useMemo(() => {
    const rows: Array<{
      id: string;
      label: string;
      value: string;
      onChange: (next: string) => void;
    }> = [];

    for (const type of contactTypes) {
      const label = leadFormContactLabel(
        type,
        draftLocale,
        LEAD_FORM_CONTACT_FIELDS as Array<{
          type: string;
          labelHe: string;
          labelEn: string;
        }>
      );
      rows.push({
        id: `contact:${type}`,
        label,
        value: draftContactKeys[type] || "",
        onChange: (next) =>
          setDraftContactKeys((prev) => ({ ...prev, [type]: next })),
      });
    }

    draftQuestions.forEach((question, qIndex) => {
      const label = question.label.trim() || `Question ${qIndex + 1}`;
      if (!question.label.trim()) return;
      rows.push({
        id: `custom:${question.id}`,
        label,
        value: question.key || "",
        onChange: (next) =>
          setDraftQuestions((prev) =>
            prev.map((item) =>
              item.id === question.id ? { ...item, key: next } : item
            )
          ),
      });
      if (question.answerType === "multiple_choice") {
        (question.options || []).forEach((opt, optIndex) => {
          const value = String(opt || "").trim();
          if (!value) return;
          rows.push({
            id: `option:${question.id}:${optIndex}`,
            label: value,
            value: question.optionKeys?.[optIndex] || "",
            onChange: (next) =>
              setDraftQuestions((prev) =>
                prev.map((item) => {
                  if (item.id !== question.id) return item;
                  const optionKeys = [
                    ...(item.optionKeys ||
                      (item.options || []).map(() => "")),
                  ];
                  while (optionKeys.length < (item.options || []).length) {
                    optionKeys.push("");
                  }
                  optionKeys[optIndex] = next;
                  return { ...item, optionKeys };
                })
              ),
          });
        });
      }
    });

    return rows;
  }, [contactTypes, draftContactKeys, draftLocale, draftQuestions]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[2100] flex items-center justify-center bg-black/40 p-3">
      <div
        className="flex h-[min(640px,90vh)] w-full max-w-[720px] flex-col overflow-hidden rounded-xl bg-white shadow-2xl"
        dir="ltr"
        role="dialog"
        aria-labelledby="form-settings-title"
      >
        <header className="flex items-center justify-between border-b border-[#CED0D4] px-4 py-3">
          <h3
            id="form-settings-title"
            className="text-[17px] font-bold text-[#050505]"
          >
            Form settings
          </h3>
          <button
            type="button"
            className="rounded-md p-1.5 text-[#65676B] hover:bg-[#F0F2F5]"
            onClick={onClose}
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="grid min-h-0 flex-1 grid-cols-[200px_minmax(0,1fr)]">
          <nav className="border-r border-[#E4E6EB] bg-[#F7F8FA] p-2">
            {TABS.map((item) => {
              const active = item.id === tab;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setTab(item.id)}
                  className={[
                    "mb-0.5 w-full rounded-md px-3 py-2.5 text-left text-[13px] font-semibold",
                    active
                      ? "bg-[#E7F3FF] text-[#1877F2]"
                      : "text-[#050505] hover:bg-white",
                  ].join(" ")}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          <div className="min-h-0 overflow-y-auto px-5 py-4">
            {tab === "configuration" ? (
              <div className="space-y-6">
                <div>
                  <div className="mb-1.5 flex items-center gap-1.5">
                    <span className="text-[13px] font-bold text-[#050505]">
                      Language
                    </span>
                    <Info className="h-3.5 w-3.5 text-[#65676B]" />
                  </div>
                  <div className="relative">
                    <button
                      type="button"
                      className={`${metaInputClass} flex w-full items-center justify-between text-left`}
                      onClick={() => setLocaleOpen((v) => !v)}
                    >
                      <span>{metaLeadFormLocaleLabel(draftLocale)}</span>
                      <span className="text-[#65676B]">▾</span>
                    </button>
                    {localeOpen ? (
                      <div className="absolute left-0 right-0 z-20 mt-1 max-h-56 overflow-y-auto rounded-lg border border-[#CED0D4] bg-white py-1 shadow-lg">
                        {META_LEAD_FORM_LOCALES.map((item) => {
                          const selected = item.value === draftLocale;
                          return (
                            <button
                              key={item.value}
                              type="button"
                              onClick={() => {
                                setDraftLocale(item.value);
                                setLocaleOpen(false);
                              }}
                              className={[
                                "flex w-full items-center gap-2 px-3 py-2 text-left text-[13px]",
                                selected
                                  ? "bg-[#E7F3FF] font-semibold text-[#1877F2]"
                                  : "text-[#050505] hover:bg-[#F0F2F5]",
                              ].join(" ")}
                            >
                              <span
                                className={[
                                  "flex h-4 w-4 items-center justify-center rounded-full border",
                                  selected
                                    ? "border-[#1877F2]"
                                    : "border-[#BEC3C9]",
                                ].join(" ")}
                              >
                                {selected ? (
                                  <span className="h-2 w-2 rounded-full bg-[#1877F2]" />
                                ) : null}
                              </span>
                              {item.label}
                            </button>
                          );
                        })}
                      </div>
                    ) : null}
                  </div>
                </div>

                <div>
                  <div className="mb-2 flex items-center gap-1.5">
                    <span className="text-[13px] font-bold text-[#050505]">
                      Sharing
                    </span>
                    <Info className="h-3.5 w-3.5 text-[#65676B]" />
                  </div>
                  <div className="space-y-3">
                    {(
                      [
                        {
                          id: "restricted" as const,
                          title: "Restricted",
                          description:
                            "Only people who are delivered your ad directly can submit this form.",
                        },
                        {
                          id: "open" as const,
                          title: "Open",
                          description:
                            "Your ad can be shared and anyone can submit this form.",
                        },
                      ] as const
                    ).map((option) => {
                      const selected = draftSharing === option.id;
                      return (
                        <label
                          key={option.id}
                          className="flex cursor-pointer items-start gap-2.5"
                        >
                          <input
                            type="radio"
                            className="mt-1"
                            checked={selected}
                            onChange={() => setDraftSharing(option.id)}
                          />
                          <span>
                            <span className="block text-[13px] font-bold text-[#050505]">
                              {option.title}
                            </span>
                            <span className="mt-0.5 block text-[12px] text-[#65676B]">
                              {option.description}
                            </span>
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : null}

            {tab === "fieldNames" ? (
              <div className="space-y-4">
                <p className="text-[13px] text-[#65676B]">
                  Change how your field names appear when you export files.
                </p>
                {fieldRows.length ? (
                  <div className="space-y-4">
                    {fieldRows.map((row) => (
                      <label key={row.id} className="block">
                        <span className="mb-1.5 block text-[13px] font-bold text-[#050505]">
                          {row.label}
                        </span>
                        <input
                          className={metaInputClass}
                          value={row.value}
                          onChange={(e) => row.onChange(e.target.value)}
                          dir="auto"
                        />
                      </label>
                    ))}
                  </div>
                ) : (
                  <p className="text-[13px] text-[#65676B]">
                    Add contact fields or questions first, then set export
                    names here.
                  </p>
                )}
              </div>
            ) : null}

            {tab === "tracking" ? (
              <div className="space-y-4">
                <p className="text-[13px] text-[#65676B]">
                  Add parameters to track where leads come from in your exports.
                </p>
                <div className="space-y-3">
                  {draftTracking.map((row) => (
                    <div key={row.id} className="flex items-start gap-2">
                      <input
                        className={metaInputClass}
                        placeholder="Parameter"
                        value={row.key}
                        onChange={(e) =>
                          setDraftTracking((prev) =>
                            prev.map((item) =>
                              item.id === row.id
                                ? { ...item, key: e.target.value }
                                : item
                            )
                          )
                        }
                      />
                      <input
                        className={metaInputClass}
                        placeholder="Value"
                        value={row.value}
                        onChange={(e) =>
                          setDraftTracking((prev) =>
                            prev.map((item) =>
                              item.id === row.id
                                ? { ...item, value: e.target.value }
                                : item
                            )
                          )
                        }
                      />
                      <button
                        type="button"
                        className="rounded-md p-2 text-[#65676B] hover:bg-[#F0F2F5]"
                        onClick={() =>
                          setDraftTracking((prev) =>
                            prev.filter((item) => item.id !== row.id)
                          )
                        }
                        aria-label="Remove parameter"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#1877F2]"
                  onClick={() =>
                    setDraftTracking((prev) => [...prev, newTrackingRow()])
                  }
                >
                  <Plus className="h-4 w-4" />
                  Add parameter
                </button>
              </div>
            ) : null}
          </div>
        </div>

        <footer className="flex justify-end border-t border-[#CED0D4] px-4 py-3">
          <button
            type="button"
            className={metaBtnPrimary}
            onClick={() =>
              onDone({
                locale: draftLocale,
                sharing: draftSharing,
                contactFieldKeys: draftContactKeys,
                customQuestions: draftQuestions,
                trackingParameters: draftTracking.filter((row) =>
                  row.key.trim()
                ),
              })
            }
          >
            Done
          </button>
        </footer>
      </div>
    </div>
  );
}
