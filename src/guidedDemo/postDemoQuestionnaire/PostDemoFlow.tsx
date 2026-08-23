import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  saveGuidedDemoQuestionnaire,
  requestGuidedDemoProposal,
} from "../../api/guidedDemoApi";
import {
  AUTOMATION_OPTIONS,
  BLOCKER_OPTIONS,
  EMPTY_ANSWERS,
  isStepKey,
  mergeAnswers,
  QUESTION_STEPS,
  RELEVANT_OPTIONS,
  SERVICE_OPTIONS,
  START_TIMING_OPTIONS,
  STEP_ORDER,
  StepKey,
  TRI_OPTIONS,
  type PostDemoAnswers,
} from "./types";

const BRAND = "#6D28D9";
const SAVE_DEBOUNCE_MS = 450;

type Props = {
  initialQuestionnaire?: any;
  onDefer: () => void;
  onDone: () => void;
};

function labelOf(
  options: readonly { value: string; label: string }[],
  value: string
) {
  return options.find((o) => o.value === value)?.label || value;
}

function toggleValue(list: string[], value: string) {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

function resolveInitialStep(q: any): StepKey {
  if (q?.status === "proposal_requested") return "success";
  const raw = q?.lastCompletedStep || q?.currentStep || "intro";
  if (isStepKey(raw) && raw !== "success") return raw;
  return "intro";
}

function buildSummary(answers: PostDemoAnswers) {
  const rows: { label: string; value: string }[] = [];
  const rel = answers.relevant.selections
    .map((v) => labelOf(RELEVANT_OPTIONS, v))
    .concat(answers.relevant.other ? [answers.relevant.other] : []);
  if (rel.length) rows.push({ label: "מה הכי רלוונטי", value: rel.join(" + ") });
  if (answers.relevant.note.trim()) {
    rows.push({ label: "מה עניין במיוחד", value: answers.relevant.note.trim() });
  }
  if (answers.missing.answer === "yes" || answers.missing.answer === "unsure") {
    rows.push({
      label: "מה חסר",
      value: answers.missing.detail.trim() || labelOf(TRI_OPTIONS, answers.missing.answer),
    });
  } else if (answers.missing.answer === "no") {
    rows.push({ label: "מה חסר", value: "לא" });
  }
  if (answers.unclear.trim()) {
    rows.push({ label: "לא היה ברור / לפרט יותר", value: answers.unclear.trim() });
  }
  const auto = answers.automation.selections
    .map((v) => labelOf(AUTOMATION_OPTIONS, v))
    .concat(answers.automation.other ? [answers.automation.other] : []);
  if (auto.length) {
    rows.push({ label: "אוטומציות שמעניינות אותך", value: auto.join(" + ") });
  }
  if (answers.automation.detail.trim()) {
    rows.push({ label: "פירוט אוטומציות", value: answers.automation.detail.trim() });
  }
  if (answers.migration.answer === "yes" || answers.migration.answer === "unsure") {
    rows.push({
      label: "לשמור / להעביר",
      value: answers.migration.detail.trim() || labelOf(TRI_OPTIONS, answers.migration.answer),
    });
  }
  if (answers.integrations.answer === "yes" || answers.integrations.answer === "unsure") {
    rows.push({
      label: "חיבור למערכת",
      value:
        answers.integrations.detail.trim() ||
        labelOf(TRI_OPTIONS, answers.integrations.answer),
    });
  }
  if (answers.workflowFit.trim()) {
    rows.push({ label: "התאמה לתהליך העבודה", value: answers.workflowFit.trim() });
  }
  const services = answers.services.selections
    .filter((v) => v !== "not_now")
    .map((v) => labelOf(SERVICE_OPTIONS, v))
    .concat(answers.services.other ? [answers.services.other] : []);
  if (services.length) {
    rows.push({ label: "שירותים נוספים", value: services.join(" + ") });
  }
  if (answers.services.detail.trim()) {
    rows.push({ label: "פירוט שירותים", value: answers.services.detail.trim() });
  }
  const blockers = answers.blockers.selections
    .map((v) => labelOf(BLOCKER_OPTIONS, v))
    .concat(answers.blockers.other ? [answers.blockers.other] : []);
  if (blockers.length) {
    rows.push({ label: "מה יכול לעכב", value: blockers.join(" + ") });
  }
  if (answers.startTiming) {
    const timing =
      answers.startTiming === "other" && answers.startTimingOther.trim()
        ? answers.startTimingOther.trim()
        : labelOf(START_TIMING_OPTIONS, answers.startTiming);
    rows.push({ label: "מועד רצוי להתחלה", value: timing });
  }
  if (answers.extraNotes.trim()) {
    rows.push({ label: "הערות נוספות", value: answers.extraNotes.trim() });
  }
  if ((answers.mainGoal || "").trim()) {
    rows.push({ label: "מטרה מרכזית", value: String(answers.mainGoal).trim() });
  }
  return rows;
}

function CardGrid({
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

function RadioCards({
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
        columns === 2 ? "grid grid-cols-1 gap-2.5 sm:grid-cols-2" : "grid grid-cols-1 gap-2.5 sm:grid-cols-3"
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

  const summary = useMemo(() => buildSummary(answers), [answers]);
  const questionIdx = QUESTION_STEPS.indexOf(step as (typeof QUESTION_STEPS)[number]);
  const showProgress = questionIdx >= 0;
  const progressPct = showProgress ? ((questionIdx + 1) / QUESTION_STEPS.length) * 100 : 0;

  const persistSilent = useCallback(async (nextStep: StepKey, defer = false) => {
    try {
      await saveGuidedDemoQuestionnaire({
        answers: answersRef.current as unknown as Record<string, unknown>,
        lastCompletedStep: nextStep,
        defer,
      });
    } catch {
      /* background save — keep UI responsive */
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

  const navFooter =
    showProgress ? (
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

  let footer: React.ReactNode = navFooter;

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
      {/* Fixed shell — size never changes between steps */}
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

        <div ref={contentRef} className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-5 sm:px-8 sm:py-6">
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
                  כמה שאלות קצרות יעזרו לנו להתאים את ההמשך בצורה מדויקת יותר.
                </p>
                <p className="mt-5 text-sm font-bold text-[#6D28D9]">כ־2 דקות • אין שאלות חובה</p>
              </div>
            ) : null}

            {step === "1" ? (
              <div>
                <h2 className="text-xl font-black text-slate-950 sm:text-2xl">
                  מה מתוך הדמו הכי רלוונטי לעסק שלך?
                </h2>
                <div className="mt-5">
                  <CardGrid
                    options={RELEVANT_OPTIONS}
                    values={answers.relevant.selections}
                    onToggle={(value) =>
                      patchAnswers((prev) => ({
                        ...prev,
                        relevant: {
                          ...prev.relevant,
                          selections: toggleValue(prev.relevant.selections, value),
                        },
                      }))
                    }
                  />
                </div>
                {answers.relevant.selections.includes("other") ? (
                  <label className="mt-4 block text-sm font-black text-slate-800">
                    מה עוד היה רלוונטי עבורך?
                    <input
                      className={fieldClass}
                      value={answers.relevant.other}
                      onChange={(e) =>
                        patchAnswers((prev) => ({
                          ...prev,
                          relevant: { ...prev.relevant, other: e.target.value },
                        }))
                      }
                    />
                  </label>
                ) : null}
                <label className="mt-5 block text-sm font-black text-slate-800">
                  יש משהו ספציפי מתוך מה שראית שעניין אותך במיוחד?
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
              </div>
            ) : null}

            {step === "2" ? (
              <div>
                <h2 className="text-xl font-black text-slate-950 sm:text-2xl">
                  האם היה משהו שחסר לך או שהיית רוצה שיהיה במערכת?
                </h2>
                <div className="mt-5">
                  <RadioCards
                    options={TRI_OPTIONS}
                    value={answers.missing.answer}
                    onChange={(answer) =>
                      patchAnswers((prev) => ({
                        ...prev,
                        missing: { ...prev.missing, answer: answer as any },
                      }))
                    }
                  />
                </div>
                {answers.missing.answer === "yes" || answers.missing.answer === "unsure" ? (
                  <label className="mt-4 block text-sm font-black text-slate-800">
                    מה היה חסר לך?
                    <textarea
                      className={areaClass}
                      value={answers.missing.detail}
                      onChange={(e) =>
                        patchAnswers((prev) => ({
                          ...prev,
                          missing: { ...prev.missing, detail: e.target.value },
                        }))
                      }
                    />
                  </label>
                ) : null}
              </div>
            ) : null}

            {step === "3" ? (
              <div>
                <h2 className="text-xl font-black text-slate-950 sm:text-2xl">
                  האם היה משהו שלא היה ברור או שהיית רוצה לראות בצורה מפורטת יותר?
                </h2>
                <textarea
                  className={`${areaClass} mt-5 min-h-40`}
                  placeholder="אפשר לרשום כאן משהו שתרצה/י שנראה שוב או נסביר בצורה יותר מפורטת."
                  value={answers.unclear}
                  onChange={(e) =>
                    patchAnswers((prev) => ({ ...prev, unclear: e.target.value }))
                  }
                />
              </div>
            ) : null}

            {step === "4" ? (
              <div>
                <h2 className="text-xl font-black text-slate-950 sm:text-2xl">
                  מה היית רוצה שיקרה בעסק באופן אוטומטי?
                </h2>
                <div className="mt-5">
                  <CardGrid
                    options={AUTOMATION_OPTIONS}
                    values={answers.automation.selections}
                    onToggle={(value) =>
                      patchAnswers((prev) => ({
                        ...prev,
                        automation: {
                          ...prev.automation,
                          selections: toggleValue(prev.automation.selections, value),
                        },
                      }))
                    }
                  />
                </div>
                {answers.automation.selections.includes("other") ? (
                  <label className="mt-4 block text-sm font-black text-slate-800">
                    מה עוד היית רוצה להפוך לאוטומטי?
                    <input
                      className={fieldClass}
                      value={answers.automation.other}
                      onChange={(e) =>
                        patchAnswers((prev) => ({
                          ...prev,
                          automation: { ...prev.automation, other: e.target.value },
                        }))
                      }
                    />
                  </label>
                ) : null}
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
              </div>
            ) : null}

            {step === "5" ? (
              <div>
                <h2 className="text-xl font-black text-slate-950 sm:text-2xl">
                  יש משהו שאתם משתמשים בו היום שחשוב לכם לשמור, להעביר או לחבר ל־BizUply?
                </h2>
                <div className="mt-5">
                  <RadioCards
                    options={TRI_OPTIONS}
                    value={answers.migration.answer}
                    onChange={(answer) =>
                      patchAnswers((prev) => ({
                        ...prev,
                        migration: { ...prev.migration, answer: answer as any },
                      }))
                    }
                  />
                </div>
                {answers.migration.answer === "yes" || answers.migration.answer === "unsure" ? (
                  <label className="mt-4 block text-sm font-black text-slate-800">
                    מה חשוב לכם לשמור, להעביר או לחבר?
                    <textarea
                      className={areaClass}
                      placeholder="לדוגמה: לקוחות, לידים, Excel, CRM קיים, אתר, WhatsApp או מערכת אחרת."
                      value={answers.migration.detail}
                      onChange={(e) =>
                        patchAnswers((prev) => ({
                          ...prev,
                          migration: { ...prev.migration, detail: e.target.value },
                        }))
                      }
                    />
                  </label>
                ) : null}
              </div>
            ) : null}

            {step === "6" ? (
              <div>
                <h2 className="text-xl font-black text-slate-950 sm:text-2xl">
                  האם יש חיבור למערכת מסוימת שחשוב לכם שיהיה?
                </h2>
                <div className="mt-5">
                  <RadioCards
                    options={TRI_OPTIONS}
                    value={answers.integrations.answer}
                    onChange={(answer) =>
                      patchAnswers((prev) => ({
                        ...prev,
                        integrations: { ...prev.integrations, answer: answer as any },
                      }))
                    }
                  />
                </div>
                {answers.integrations.answer === "yes" ||
                answers.integrations.answer === "unsure" ? (
                  <label className="mt-4 block text-sm font-black text-slate-800">
                    לאיזו מערכת חשוב לכם להתחבר?
                    <textarea
                      className={areaClass}
                      placeholder="לדוגמה: יומן, מערכת קיימת, טופס, אתר, מערכת שיווק או שירות אחר."
                      value={answers.integrations.detail}
                      onChange={(e) =>
                        patchAnswers((prev) => ({
                          ...prev,
                          integrations: { ...prev.integrations, detail: e.target.value },
                        }))
                      }
                    />
                  </label>
                ) : null}
              </div>
            ) : null}

            {step === "7" ? (
              <div>
                <h2 className="text-xl font-black text-slate-950 sm:text-2xl">
                  האם יש משהו בתהליך העבודה שלכם שחשוב שהמערכת תתאים אליו?
                </h2>
                <textarea
                  className={`${areaClass} mt-5 min-h-40`}
                  placeholder="לדוגמה: תהליך מיוחד לטיפול בלידים, אישורים פנימיים, חלוקת עבודה בין נציגים או שלבים קבועים בתהליך."
                  value={answers.workflowFit}
                  onChange={(e) =>
                    patchAnswers((prev) => ({ ...prev, workflowFit: e.target.value }))
                  }
                />
              </div>
            ) : null}

            {step === "8" ? (
              <div>
                <h2 className="text-xl font-black text-slate-950 sm:text-2xl">
                  האם היה מעניין אותך לקבל בנוסף למערכת גם שירותים מנציגים אנושיים?
                </h2>
                <div className="mt-5">
                  <CardGrid
                    options={SERVICE_OPTIONS}
                    values={answers.services.selections}
                    onToggle={(value) =>
                      patchAnswers((prev) => ({
                        ...prev,
                        services: {
                          ...prev.services,
                          selections: toggleValue(prev.services.selections, value),
                        },
                      }))
                    }
                  />
                </div>
                {answers.services.selections.includes("other") ? (
                  <label className="mt-4 block text-sm font-black text-slate-800">
                    איזה שירות נוסף היה מעניין אותך?
                    <input
                      className={fieldClass}
                      value={answers.services.other}
                      onChange={(e) =>
                        patchAnswers((prev) => ({
                          ...prev,
                          services: { ...prev.services, other: e.target.value },
                        }))
                      }
                    />
                  </label>
                ) : null}
                {answers.services.selections.some((v) => v !== "not_now") ? (
                  <label className="mt-4 block text-sm font-black text-slate-800">
                    ספר/י לנו בקצרה במה היית רוצה שנעזור
                    <textarea
                      className={areaClass}
                      value={answers.services.detail}
                      onChange={(e) =>
                        patchAnswers((prev) => ({
                          ...prev,
                          services: { ...prev.services, detail: e.target.value },
                        }))
                      }
                    />
                  </label>
                ) : null}
              </div>
            ) : null}

            {step === "9" ? (
              <div>
                <h2 className="text-xl font-black text-slate-950 sm:text-2xl">
                  יש משהו שיכול לגרום לך להתלבט לפני התחלה?
                </h2>
                <div className="mt-5">
                  <CardGrid
                    options={BLOCKER_OPTIONS}
                    values={answers.blockers.selections}
                    onToggle={(value) =>
                      patchAnswers((prev) => ({
                        ...prev,
                        blockers: {
                          ...prev.blockers,
                          selections: toggleValue(prev.blockers.selections, value),
                        },
                      }))
                    }
                  />
                </div>
                {answers.blockers.selections.includes("other") ? (
                  <label className="mt-4 block text-sm font-black text-slate-800">
                    מה ההתלבטות?
                    <input
                      className={fieldClass}
                      value={answers.blockers.other}
                      onChange={(e) =>
                        patchAnswers((prev) => ({
                          ...prev,
                          blockers: { ...prev.blockers, other: e.target.value },
                        }))
                      }
                    />
                  </label>
                ) : null}
              </div>
            ) : null}

            {step === "10" ? (
              <div>
                <h2 className="text-xl font-black text-slate-950 sm:text-2xl">
                  אם הכול מתאים — מתי היית רוצה להתחיל?
                </h2>
                <div className="mt-5">
                  <RadioCards
                    columns={2}
                    options={START_TIMING_OPTIONS}
                    value={answers.startTiming}
                    onChange={(startTiming) =>
                      patchAnswers((prev) => ({ ...prev, startTiming }))
                    }
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

            {step === "11" ? (
              <div>
                <h2 className="text-xl font-black text-slate-950 sm:text-2xl">
                  יש משהו נוסף שחשוב שנדע לפני שנכין לך הצעה?
                </h2>
                <textarea
                  className={`${areaClass} mt-5 min-h-40`}
                  placeholder="כל פרט נוסף שיכול לעזור לנו להתאים את ההמשך לעסק שלך."
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

        <div className="shrink-0 border-t border-slate-100 bg-white px-5 py-4 sm:px-8">
          {footer}
        </div>
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
