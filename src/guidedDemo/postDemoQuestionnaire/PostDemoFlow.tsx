import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  saveGuidedDemoQuestionnaire,
  requestGuidedDemoProposal,
} from "../../api/guidedDemoApi";
import {
  AUTOMATION_OPTIONS,
  BLOCKER_OPTIONS,
  EMPTY_ANSWERS,
  FILE_OPTIONS,
  GOAL_OPTIONS,
  isStepKey,
  mergeAnswers,
  QUESTION_STEPS,
  RELEVANT_OPTIONS,
  SERVICE_OPTIONS,
  START_TIMING_OPTIONS,
  STEP_ORDER,
  TRANSFER_OPTIONS,
  TRI_OPTIONS,
  toggleExclusive,
  wantsCrmOrLeads,
  type PostDemoAnswers,
  type StepKey,
} from "./types";
import { formatPostDemoAnswers } from "./displayUtils";

const BRAND = "#6D28D9";
const SAVE_DEBOUNCE_MS = 450;

type Props = {
  initialQuestionnaire?: any;
  onDefer: () => void;
  onDone: () => void;
};

function toggleValue(list: string[], value: string) {
  return list.includes(value) ? list.filter((item) => item !== value) : [...list, value];
}

function resolveInitialStep(q: any): StepKey {
  if (q?.status === "proposal_requested") return "success";
  const raw = String(q?.lastCompletedStep || q?.currentStep || "intro");
  if (raw === "11") return "10";
  if (isStepKey(raw) && raw !== "success") return raw;
  return "intro";
}

function OptionGrid({
  options,
  values,
  onToggle,
}: {
  options: readonly { value: string; label: string; icon?: string }[];
  values: string[];
  onToggle: (value: string) => void;
}) {
  return (
    <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
      {options.map((opt) => {
        const selected = values.includes(opt.value);
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onToggle(opt.value)}
            className={[
              "flex min-h-[48px] items-center gap-3 rounded-2xl border px-4 py-3 text-right transition-colors",
              selected
                ? "border-[#6D28D9] bg-[#6D28D9]/5 shadow-sm"
                : "border-slate-200 bg-white hover:border-[#6D28D9]/30 active:bg-slate-50",
            ].join(" ")}
          >
            {opt.icon ? <span className="text-lg leading-none">{opt.icon}</span> : null}
            <span className="text-sm font-black text-slate-900">{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}

function RadioGrid({
  options,
  value,
  onChange,
  columns = 3,
}: {
  options: readonly { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  columns?: 2 | 3;
}) {
  return (
    <div
      className={
        columns === 2
          ? "grid grid-cols-1 gap-2.5 sm:grid-cols-2"
          : "grid grid-cols-1 gap-2.5 sm:grid-cols-3"
      }
    >
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={[
            "min-h-[48px] rounded-2xl border px-4 py-3 text-sm font-black transition-colors",
            value === opt.value
              ? "border-[#6D28D9] bg-[#6D28D9]/5 text-[#6D28D9]"
              : "border-slate-200 bg-white text-slate-800 hover:border-[#6D28D9]/30",
          ].join(" ")}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

const fieldClass =
  "mt-2 min-h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-[#6D28D9]/50";
const areaClass =
  "mt-2 min-h-28 w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-[#6D28D9]/50";

export default function PostDemoFlow({ initialQuestionnaire, onDefer, onDone }: Props) {
  const [step, setStep] = useState<StepKey>(() => resolveInitialStep(initialQuestionnaire));
  const [answers, setAnswers] = useState<PostDemoAnswers>(() =>
    mergeAnswers(initialQuestionnaire?.answers || EMPTY_ANSWERS)
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const answersRef = useRef(answers);
  const stepRef = useRef(step);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  answersRef.current = answers;
  stepRef.current = step;

  const summary = useMemo(() => formatPostDemoAnswers(answers), [answers]);
  const questionIdx = QUESTION_STEPS.indexOf(step as (typeof QUESTION_STEPS)[number]);
  const showProgress = questionIdx >= 0;
  const progressPct = showProgress ? ((questionIdx + 1) / QUESTION_STEPS.length) * 100 : 0;
  const showFileFollowup =
    wantsCrmOrLeads(answers) && !answers.transfer.selections.includes("none");
  const showAutomationDetail =
    answers.automation.selections.includes("other") ||
    answers.automation.selections.some((value) => value !== "not_needed");

  const persistSilent = useCallback(async (nextStep: StepKey, defer = false) => {
    try {
      await saveGuidedDemoQuestionnaire({
        answers: answersRef.current as unknown as Record<string, unknown>,
        lastCompletedStep: nextStep,
        defer,
      });
    } catch {
      /* keep the UI responsive */
    }
  }, []);

  const schedulePersist = useCallback(
    (nextStep: StepKey) => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      saveTimerRef.current = setTimeout(() => {
        void persistSilent(nextStep);
      }, SAVE_DEBOUNCE_MS);
    },
    [persistSilent]
  );

  useEffect(() => {
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, []);

  useEffect(() => {
    contentRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  function patchAnswers(updater: (prev: PostDemoAnswers) => PostDemoAnswers) {
    setAnswers((prev) => {
      const next = updater(prev);
      answersRef.current = next;
      return next;
    });
    schedulePersist(stepRef.current);
  }

  function goTo(next: StepKey) {
    setError("");
    setStep(next);
    stepRef.current = next;
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    void persistSilent(next);
  }

  function goBack() {
    const idx = STEP_ORDER.indexOf(step);
    if (idx > 0) goTo(STEP_ORDER[idx - 1]);
  }

  function goNext() {
    const idx = STEP_ORDER.indexOf(step);
    if (idx >= 0 && idx < STEP_ORDER.length - 1) goTo(STEP_ORDER[idx + 1]);
  }

  async function submitProposal() {
    setSubmitting(true);
    setError("");
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    try {
      await requestGuidedDemoProposal({
        answers: answersRef.current as unknown as Record<string, unknown>,
      });
      setStep("success");
      stepRef.current = "success";
    } catch (err: any) {
      setError(err?.response?.data?.error || "שליחת הבקשה נכשלה");
    } finally {
      setSubmitting(false);
    }
  }

  let footer: React.ReactNode = showProgress ? (
    <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-between">
      <button
        type="button"
        onClick={goBack}
        className="min-h-11 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-black text-slate-700"
      >
        חזרה
      </button>
      <button
        type="button"
        onClick={goNext}
        className="min-h-11 rounded-2xl px-5 py-3 text-sm font-black text-white"
        style={{ background: BRAND }}
      >
        המשך
      </button>
    </div>
  ) : null;

  if (step === "intro") {
    footer = (
      <div className="space-y-2">
        <button
          type="button"
          onClick={() => goTo("1")}
          className="min-h-12 w-full rounded-2xl px-4 py-3 text-base font-black text-white"
          style={{ background: BRAND }}
        >
          מתחילים
        </button>
        <button
          type="button"
          onClick={() => {
            void persistSilent("intro", true).finally(onDefer);
          }}
          className="min-h-11 w-full rounded-2xl text-sm font-bold text-slate-500"
        >
          אעשה את זה אחר כך
        </button>
      </div>
    );
  } else if (step === "summary") {
    footer = (
      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-between">
        <button
          type="button"
          onClick={() => goTo("1")}
          className="min-h-11 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-black text-slate-700"
        >
          חזרה לעריכה
        </button>
        <button
          type="button"
          disabled={submitting}
          onClick={() => void submitProposal()}
          className="min-h-12 rounded-2xl px-5 py-3 text-sm font-black text-white disabled:opacity-60"
          style={{ background: BRAND }}
        >
          {submitting ? "שולח..." : "בקשה להצעה מותאמת"}
        </button>
      </div>
    );
  } else if (step === "success") {
    footer = (
      <button
        type="button"
        onClick={onDone}
        className="min-h-12 w-full rounded-2xl px-4 py-3 text-base font-black text-white"
        style={{ background: BRAND }}
      >
        סיום
      </button>
    );
  }

  return (
    <div
      className="pointer-events-auto absolute inset-0 z-[2147483007] flex items-end justify-center bg-slate-950/55 p-0 sm:items-center sm:p-4"
      dir="rtl"
    >
      <div
        role="dialog"
        aria-modal="true"
        className="flex h-[min(720px,100dvh)] w-full max-w-2xl flex-col overflow-hidden rounded-t-[28px] bg-white shadow-2xl sm:h-[min(720px,92dvh)] sm:rounded-[28px]"
      >
        <div className="shrink-0 border-b border-slate-100 px-5 pb-3 pt-5 sm:px-8 sm:pt-6">
          {showProgress ? (
            <>
              <p className="text-sm font-bold text-slate-500">
                שלב {questionIdx + 1} מתוך {QUESTION_STEPS.length}
              </p>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full transition-[width] duration-300 ease-out"
                  style={{ width: `${progressPct}%`, background: BRAND }}
                />
              </div>
            </>
          ) : (
            <p className="text-sm font-bold text-[#6D28D9]">BizUply</p>
          )}
        </div>

        <div
          ref={contentRef}
          className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-5 sm:px-8 sm:py-6"
        >
          <div key={step} className="animate-[postDemoFade_220ms_ease-out]">
            {step === "intro" ? (
              <div>
                <h2 className="text-2xl font-black leading-tight text-slate-950 sm:text-3xl">
                  כמעט סיימנו ✨
                </h2>
                <p className="mt-4 text-base font-semibold leading-7 text-slate-600">
                  נשמח להבין מה מתוך הדמו הכי מתאים לעסק שלך ומה חשוב לך לפני שנמשיך להצעה.
                </p>
                <p className="mt-3 text-base font-semibold leading-7 text-slate-600">
                  עשר שאלות קצרות יעזרו לנו להתאים את ההמשך בצורה מדויקת יותר.
                </p>
                <p className="mt-5 text-sm font-bold text-[#6D28D9]">כ־2 דקות • אין שאלות חובה</p>
              </div>
            ) : null}

            {step === "1" ? (
              <QuestionBlock
                title="מה הכי רלוונטי לך מתוך BizUply?"
                options={RELEVANT_OPTIONS}
                values={answers.relevant.selections}
                other={answers.relevant.other}
                otherLabel="מה עוד רלוונטי עבורך?"
                onToggle={(value) =>
                  patchAnswers((prev) => ({
                    ...prev,
                    relevant: {
                      ...prev.relevant,
                      selections: toggleValue(prev.relevant.selections, value),
                    },
                  }))
                }
                onOther={(other) =>
                  patchAnswers((prev) => ({
                    ...prev,
                    relevant: { ...prev.relevant, other },
                  }))
                }
              >
                <label className="mt-5 block text-sm font-black text-slate-800">
                  יש משהו ספציפי מתוך מה שבחרת שחשוב לך במיוחד?
                  <textarea
                    className={areaClass}
                    value={answers.relevant.note}
                    onChange={(e) =>
                      patchAnswers((prev) => ({
                        ...prev,
                        relevant: { ...prev.relevant, note: e.target.value },
                      }))
                    }
                  />
                </label>
              </QuestionBlock>
            ) : null}

            {step === "2" ? (
              <QuestionBlock
                title="מה הכי חשוב לך לשפר בעסק כרגע?"
                options={GOAL_OPTIONS}
                values={answers.goals.selections}
                other={answers.goals.other}
                otherLabel="מה עוד חשוב לשפר?"
                onToggle={(value) =>
                  patchAnswers((prev) => ({
                    ...prev,
                    goals: {
                      ...prev.goals,
                      selections: toggleValue(prev.goals.selections, value),
                    },
                  }))
                }
                onOther={(other) =>
                  patchAnswers((prev) => ({
                    ...prev,
                    goals: { ...prev.goals, other },
                  }))
                }
              />
            ) : null}

            {step === "3" ? (
              <div>
                <h2 className="text-xl font-black text-slate-950 sm:text-2xl">
                  האם אתם משתמשים היום במערכת או כלי שתרצו להחליף ב־BizUply?
                </h2>
                <div className="mt-5">
                  <RadioGrid
                    options={TRI_OPTIONS}
                    value={answers.currentTool.answer}
                    onChange={(answer) =>
                      patchAnswers((prev) => ({
                        ...prev,
                        currentTool: {
                          answer: answer as PostDemoAnswers["currentTool"]["answer"],
                          detail: answer === "yes" ? prev.currentTool.detail : "",
                        },
                      }))
                    }
                  />
                </div>
                {answers.currentTool.answer === "yes" ? (
                  <label className="mt-4 block text-sm font-black text-slate-800">
                    באיזו מערכת או כלי אתם משתמשים היום?
                    <textarea
                      className={areaClass}
                      placeholder="לדוגמה: Excel, יומן, WhatsApp, מערכת לניהול לקוחות או כלי אחר."
                      value={answers.currentTool.detail}
                      onChange={(e) =>
                        patchAnswers((prev) => ({
                          ...prev,
                          currentTool: { ...prev.currentTool, detail: e.target.value },
                        }))
                      }
                    />
                  </label>
                ) : null}
              </div>
            ) : null}

            {step === "4" ? (
              <QuestionBlock
                title="האם יש מידע או תוכן שחשוב לכם להעביר ל־BizUply?"
                options={TRANSFER_OPTIONS}
                values={answers.transfer.selections}
                other={answers.transfer.other}
                otherLabel="איזה מידע נוסף חשוב להעביר?"
                onToggle={(value) =>
                  patchAnswers((prev) => {
                    const selections = toggleExclusive(prev.transfer.selections, value, "none");
                    return {
                      ...prev,
                      transfer: {
                        ...prev.transfer,
                        selections,
                        hasFile: selections.includes("none") ? "" : prev.transfer.hasFile,
                      },
                    };
                  })
                }
                onOther={(other) =>
                  patchAnswers((prev) => ({
                    ...prev,
                    transfer: { ...prev.transfer, other },
                  }))
                }
              >
                {showFileFollowup ? (
                  <div className="mt-5">
                    <p className="text-sm font-black text-slate-800">
                      האם יש לכם קובץ Excel/CSV עם הנתונים?
                    </p>
                    <div className="mt-3">
                      <RadioGrid
                        options={FILE_OPTIONS}
                        value={answers.transfer.hasFile}
                        onChange={(hasFile) =>
                          patchAnswers((prev) => ({
                            ...prev,
                            transfer: {
                              ...prev.transfer,
                              hasFile: hasFile as PostDemoAnswers["transfer"]["hasFile"],
                            },
                          }))
                        }
                      />
                    </div>
                  </div>
                ) : null}
              </QuestionBlock>
            ) : null}

            {step === "5" ? (
              <QuestionBlock
                title="מה היית רוצה שיקרה אצלך באופן אוטומטי?"
                options={AUTOMATION_OPTIONS}
                values={answers.automation.selections}
                other={answers.automation.other}
                otherLabel="מה עוד היית רוצה להפוך לאוטומטי?"
                hideOtherInput
                onToggle={(value) =>
                  patchAnswers((prev) => ({
                    ...prev,
                    automation: {
                      ...prev.automation,
                      selections: toggleExclusive(
                        prev.automation.selections,
                        value,
                        "not_needed"
                      ),
                      detail: value === "not_needed" ? "" : prev.automation.detail,
                      other: value === "not_needed" ? "" : prev.automation.other,
                    },
                  }))
                }
                onOther={(other) =>
                  patchAnswers((prev) => ({
                    ...prev,
                    automation: { ...prev.automation, other },
                  }))
                }
              >
                {showAutomationDetail ? (
                  <label className="mt-5 block text-sm font-black text-slate-800">
                    פירוט נוסף
                    <textarea
                      className={areaClass}
                      value={answers.automation.detail}
                      onChange={(e) =>
                        patchAnswers((prev) => ({
                          ...prev,
                          automation: { ...prev.automation, detail: e.target.value },
                        }))
                      }
                    />
                  </label>
                ) : null}
              </QuestionBlock>
            ) : null}

            {step === "6" ? (
              <div>
                <h2 className="text-xl font-black text-slate-950 sm:text-2xl">
                  האם יש תהליך מיוחד בעסק שחשוב שניקח בחשבון?
                </h2>
                <textarea
                  className={`${areaClass} mt-5 min-h-40`}
                  placeholder="לדוגמה: שלבי טיפול בליד, חלוקת עבודה בין עובדים, אישורים פנימיים, תהליך מכירה ייחודי או שלבים קבועים בעבודה."
                  value={answers.specialProcess}
                  onChange={(e) =>
                    patchAnswers((prev) => ({ ...prev, specialProcess: e.target.value }))
                  }
                />
              </div>
            ) : null}

            {step === "7" ? (
              <QuestionBlock
                title="האם תרצו גם שירות מקצועי מעבר למערכת?"
                options={SERVICE_OPTIONS}
                values={answers.services.selections}
                other={answers.services.other}
                otherLabel="איזה שירות נוסף היה מעניין אותך?"
                onToggle={(value) =>
                  patchAnswers((prev) => ({
                    ...prev,
                    services: {
                      ...prev.services,
                      selections: toggleExclusive(prev.services.selections, value, "not_now"),
                    },
                  }))
                }
                onOther={(other) =>
                  patchAnswers((prev) => ({
                    ...prev,
                    services: { ...prev.services, other },
                  }))
                }
              />
            ) : null}

            {step === "8" ? (
              <QuestionBlock
                title="מה הדבר העיקרי שעלול לעכב אתכם מלהתחיל?"
                options={BLOCKER_OPTIONS}
                values={answers.blockers.selections}
                other={answers.blockers.other}
                otherLabel="מה עלול לעכב?"
                onToggle={(value) =>
                  patchAnswers((prev) => ({
                    ...prev,
                    blockers: {
                      ...prev.blockers,
                      selections: toggleExclusive(
                        prev.blockers.selections,
                        value,
                        "nothing_blocking"
                      ),
                    },
                  }))
                }
                onOther={(other) =>
                  patchAnswers((prev) => ({
                    ...prev,
                    blockers: { ...prev.blockers, other },
                  }))
                }
              />
            ) : null}

            {step === "9" ? (
              <div>
                <h2 className="text-xl font-black text-slate-950 sm:text-2xl">
                  אם הכול מתאים, מתי הייתם רוצים להתחיל?
                </h2>
                <div className="mt-5">
                  <RadioGrid
                    columns={2}
                    options={START_TIMING_OPTIONS}
                    value={answers.startTiming}
                    onChange={(startTiming) => patchAnswers((prev) => ({ ...prev, startTiming }))}
                  />
                </div>
                {answers.startTiming === "other" ? (
                  <input
                    className={`${fieldClass} mt-4`}
                    placeholder="מתי?"
                    value={answers.startTimingOther}
                    onChange={(e) =>
                      patchAnswers((prev) => ({
                        ...prev,
                        startTimingOther: e.target.value,
                      }))
                    }
                  />
                ) : null}
              </div>
            ) : null}

            {step === "10" ? (
              <div>
                <h2 className="text-xl font-black text-slate-950 sm:text-2xl">
                  יש משהו נוסף שחשוב שנדע לפני שנכין לכם התאמה והצעה?
                </h2>
                <textarea
                  className={`${areaClass} mt-5 min-h-40`}
                  placeholder="כל פרט נוסף שיעזור לנו להבין את העסק ואת הצרכים שלכם."
                  value={answers.extraNotes}
                  onChange={(e) =>
                    patchAnswers((prev) => ({ ...prev, extraNotes: e.target.value }))
                  }
                />
              </div>
            ) : null}

            {step === "summary" ? (
              <div>
                <h2 className="text-2xl font-black text-slate-950">זהו, סיימנו ✨</h2>
                <p className="mt-2 text-base font-semibold text-slate-600">
                  הנה הדברים המרכזיים שסימנת לפני שנמשיך.
                </p>
                <div className="mt-5 space-y-3">
                  {summary.map((row) => (
                    <div
                      key={row.label}
                      className="rounded-2xl border border-violet-100 bg-violet-50/40 p-4"
                    >
                      <p className="text-sm font-bold text-slate-500">{row.label}</p>
                      <p className="mt-1 text-base font-black text-slate-900">{row.value}</p>
                    </div>
                  ))}
                  {!summary.length ? (
                    <p className="text-sm font-semibold text-slate-500">
                      אפשר להמשיך גם בלי למלא הכול.
                    </p>
                  ) : null}
                </div>
                {error ? <p className="mt-3 text-sm font-bold text-rose-600">{error}</p> : null}
              </div>
            ) : null}

            {step === "success" ? (
              <div className="text-center">
                <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-emerald-50 text-3xl">
                  🎉
                </div>
                <h2 className="text-2xl font-black text-slate-950">הבקשה שלך התקבלה 🎉</h2>
                <p className="mt-3 text-base font-semibold leading-7 text-slate-600">
                  תודה! קיבלנו את כל הפרטים ונעבור עליהם כדי להתאים לך את ההמשך וההצעה בצורה
                  מדויקת.
                </p>
                <div className="mt-6 rounded-2xl border border-slate-100 bg-slate-50 p-4 text-right">
                  <p className="text-sm font-black text-slate-900">מה קורה עכשיו?</p>
                  <ol className="mt-3 list-decimal space-y-2 pr-5 text-sm font-semibold text-slate-700">
                    <li>נעבור על התשובות שלך.</li>
                    <li>נבדוק מה הכי מתאים לצרכים שסימנת.</li>
                    <li>נחזור אליך עם ההמשך והצעה מותאמת.</li>
                  </ol>
                </div>
              </div>
            ) : null}
          </div>
        </div>

        <div className="shrink-0 border-t border-slate-100 bg-white px-5 py-4 sm:px-8">{footer}</div>
      </div>

      <style>{`
        @keyframes postDemoFade {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

function QuestionBlock({
  title,
  options,
  values,
  other,
  otherLabel,
  hideOtherInput = false,
  onToggle,
  onOther,
  children,
}: {
  title: string;
  options: readonly { value: string; label: string; icon?: string }[];
  values: string[];
  other: string;
  otherLabel: string;
  hideOtherInput?: boolean;
  onToggle: (value: string) => void;
  onOther: (value: string) => void;
  children?: React.ReactNode;
}) {
  return (
    <div>
      <h2 className="text-xl font-black text-slate-950 sm:text-2xl">{title}</h2>
      <div className="mt-5">
        <OptionGrid options={options} values={values} onToggle={onToggle} />
      </div>
      {!hideOtherInput && values.includes("other") ? (
        <label className="mt-4 block text-sm font-black text-slate-800">
          {otherLabel}
          <input className={fieldClass} value={other} onChange={(e) => onOther(e.target.value)} />
        </label>
      ) : null}
      {children}
    </div>
  );
}
