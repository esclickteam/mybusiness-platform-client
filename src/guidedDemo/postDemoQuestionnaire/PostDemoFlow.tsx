import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  saveGuidedDemoQuestionnaire,
  requestGuidedDemoProposal,
} from "../../api/guidedDemoApi";
import {
  AUTOMATION_OPTIONS,
  BLOCKER_OPTIONS,
  EMPTY_ANSWERS,
  mergeAnswers,
  RELEVANT_OPTIONS,
  SERVICE_OPTIONS,
  START_TIMING_OPTIONS,
  STEP_ORDER,
  StepKey,
  TRI_OPTIONS,
  type PostDemoAnswers,
} from "./types";

const BRAND = "#6D28D9";
const QUESTION_STEPS = STEP_ORDER.filter((s) => !["intro", "summary", "success"].includes(s));

type Props = {
  initialQuestionnaire?: any;
  onDefer: () => void;
  onDone: () => void;
};

function ProgressBar({ current }: { current: StepKey }) {
  if (current === "intro" || current === "summary" || current === "success") return null;
  const idx = QUESTION_STEPS.indexOf(current as (typeof QUESTION_STEPS)[number]);
  const pct = ((idx + 1) / QUESTION_STEPS.length) * 100;
  return (
    <div className="mb-6">
      <p className="mb-2 text-sm font-bold text-slate-500">
        שלב {idx + 1} מתוך {QUESTION_STEPS.length}
      </p>
      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
        <motion.div
          className="h-full rounded-full"
          style={{ background: BRAND }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

function Shell({
  children,
  footer,
}: {
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="pointer-events-auto absolute inset-0 z-[2147483007] flex items-end justify-center bg-slate-950/60 p-0 sm:items-center sm:p-4">
      <div className="flex max-h-[100dvh] w-full max-w-2xl flex-col overflow-hidden rounded-t-[28px] bg-white shadow-2xl sm:max-h-[92dvh] sm:rounded-[28px]">
        <div className="flex-1 overflow-y-auto px-5 py-6 sm:px-8 sm:py-8">{children}</div>
        {footer ? (
          <div className="shrink-0 border-t border-slate-100 bg-white px-5 py-4 sm:px-8">{footer}</div>
        ) : null}
      </div>
    </div>
  );
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
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {options.map((opt) => {
        const selected = values.includes(opt.value);
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onToggle(opt.value)}
            className={[
              "flex min-h-[56px] items-center gap-3 rounded-2xl border px-4 py-3 text-right transition",
              selected
                ? "border-[#6D28D9] bg-[#6D28D9]/5 shadow-sm"
                : "border-slate-200 bg-white hover:border-[#6D28D9]/30",
            ].join(" ")}
          >
            {opt.icon ? <span className="text-xl">{opt.icon}</span> : null}
            <span className="text-sm font-black text-slate-900 sm:text-base">{opt.label}</span>
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
}: {
  options: readonly { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={[
            "min-h-[52px] rounded-2xl border px-4 py-3 text-sm font-black transition",
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

function buildSummary(answers: PostDemoAnswers) {
  const rel = answers.relevant.selections
    .map((v) => RELEVANT_OPTIONS.find((o) => o.value === v)?.label || v)
    .concat(answers.relevant.other ? [answers.relevant.other] : []);
  const services = answers.services.selections
    .filter((v) => v !== "not_now")
    .map((v) => SERVICE_OPTIONS.find((o) => o.value === v)?.label || v);
  const timing = START_TIMING_OPTIONS.find((o) => o.value === answers.startTiming)?.label;
  const rows = [];
  if (rel.length) rows.push({ label: "הכי רלוונטי עבורך", value: rel.join(" + ") });
  if (answers.mainGoal.trim()) rows.push({ label: "המטרה המרכזית", value: answers.mainGoal.trim() });
  if (services.length) rows.push({ label: "שירותים שמעניינים אותך", value: services.join(" + ") });
  if (timing) rows.push({ label: "מועד התחלה", value: timing });
  return rows;
}

export default function PostDemoFlow({ initialQuestionnaire, onDefer, onDone }: Props) {
  const initialStep = (initialQuestionnaire?.lastCompletedStep as StepKey) || "intro";
  const [step, setStep] = useState<StepKey>(
    initialQuestionnaire?.status === "proposal_requested"
      ? "success"
      : initialStep === "success"
        ? "summary"
        : initialStep
  );
  const [answers, setAnswers] = useState<PostDemoAnswers>(
    mergeAnswers(initialQuestionnaire?.answers || EMPTY_ANSWERS)
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const summary = useMemo(() => buildSummary(answers), [answers]);

  async function persist(nextStep: StepKey, defer = false) {
    setSaving(true);
    setError("");
    try {
      await saveGuidedDemoQuestionnaire({
        answers,
        lastCompletedStep: nextStep,
        defer,
      });
    } catch (err: any) {
      setError(err?.response?.data?.error || "שמירה נכשלה");
      throw err;
    } finally {
      setSaving(false);
    }
  }

  async function goNext(next: StepKey) {
    try {
      await persist(next);
      setStep(next);
    } catch {
      /* stay */
    }
  }

  function goBack() {
    const idx = STEP_ORDER.indexOf(step);
    if (idx > 0) setStep(STEP_ORDER[idx - 1]);
  }

  async function submitProposal() {
    setSaving(true);
    setError("");
    try {
      await requestGuidedDemoProposal({ answers });
      setStep("success");
    } catch (err: any) {
      setError(err?.response?.data?.error || "שליחת הבקשה נכשלה");
    } finally {
      setSaving(false);
    }
  }

  const navFooter = (next: StepKey, nextLabel = "המשך") => (
    <div className="flex flex-col gap-2 sm:flex-row sm:justify-between">
      <button
        type="button"
        disabled={saving || step === "1"}
        onClick={goBack}
        className="min-h-11 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-black text-slate-700 disabled:opacity-40"
      >
        חזרה
      </button>
      <button
        type="button"
        disabled={saving}
        onClick={() => void goNext(next)}
        className="min-h-11 rounded-2xl px-5 py-3 text-sm font-black text-white disabled:opacity-60"
        style={{ background: BRAND }}
      >
        {saving ? "שומר..." : nextLabel}
      </button>
    </div>
  );

  return (
    <AnimatePresence mode="wait">
      <motion.div key={step} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
        {step === "intro" ? (
          <Shell
            footer={
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => void goNext("1")}
                  className="min-h-12 w-full rounded-2xl px-4 py-3 text-base font-black text-white"
                  style={{ background: BRAND }}
                >
                  בואו נתאים לי את BizUply
                </button>
                <button
                  type="button"
                  onClick={() => {
                    void persist("intro", true).finally(onDefer);
                  }}
                  className="min-h-11 w-full rounded-2xl text-sm font-bold text-slate-500"
                >
                  אעשה את זה אחר כך
                </button>
              </div>
            }
          >
            <h2 className="text-2xl font-black leading-tight text-slate-950 sm:text-3xl">
              ראית איך BizUply יכולה לעבוד. עכשיו נתאים אותה לעסק שלך.
            </h2>
            <p className="mt-4 text-base font-semibold leading-7 text-slate-600">
              ענה/י על כמה שאלות קצרות כדי שנוכל להבין מה הכי רלוונטי עבורך ולהכין את ההמשך בצורה מדויקת יותר.
            </p>
            <p className="mt-4 text-sm font-bold text-[#6D28D9]">כ־2 דקות • אין תשובות חובה</p>
          </Shell>
        ) : null}

        {step === "1" ? (
          <Shell footer={navFooter("2")}>
            <ProgressBar current="1" />
            <h2 className="text-xl font-black text-slate-950 sm:text-2xl">מה מתוך הדמו הכי רלוונטי לעסק שלך?</h2>
            <div className="mt-5">
              <CardGrid
                options={RELEVANT_OPTIONS}
                values={answers.relevant.selections}
                onToggle={(value) =>
                  setAnswers((prev) => ({
                    ...prev,
                    relevant: {
                      ...prev.relevant,
                      selections: prev.relevant.selections.includes(value)
                        ? prev.relevant.selections.filter((v) => v !== value)
                        : [...prev.relevant.selections, value],
                    },
                  }))
                }
              />
            </div>
            {answers.relevant.selections.includes("other") ? (
              <input
                className="mt-4 min-h-11 w-full rounded-2xl border border-slate-200 px-4 text-sm"
                placeholder="מה עוד היה רלוונטי עבורך?"
                value={answers.relevant.other}
                onChange={(e) =>
                  setAnswers((prev) => ({
                    ...prev,
                    relevant: { ...prev.relevant, other: e.target.value },
                  }))
                }
              />
            ) : null}
            <label className="mt-5 block text-sm font-black text-slate-800">
              יש משהו ספציפי שעניין אותך במיוחד?
              <textarea
                className="mt-2 min-h-24 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm"
                value={answers.relevant.note}
                onChange={(e) =>
                  setAnswers((prev) => ({
                    ...prev,
                    relevant: { ...prev.relevant, note: e.target.value },
                  }))
                }
              />
            </label>
          </Shell>
        ) : null}

        {step === "2" ? (
          <Shell footer={navFooter("3")}>
            <ProgressBar current="2" />
            <h2 className="text-xl font-black text-slate-950 sm:text-2xl">
              אם BizUply הייתה משפרת דבר אחד בעסק שלך — מה היית רוצה שזה יהיה?
            </h2>
            <textarea
              className="mt-5 min-h-40 w-full rounded-2xl border border-slate-200 px-4 py-4 text-base"
              placeholder="למשל: לעשות סדר בלידים, לחסוך עבודה ידנית, לא לשכוח מעקבים, לרכז הכול במקום אחד..."
              value={answers.mainGoal}
              onChange={(e) => setAnswers((prev) => ({ ...prev, mainGoal: e.target.value }))}
            />
          </Shell>
        ) : null}

        {step === "3" ? (
          <Shell footer={navFooter("4")}>
            <ProgressBar current="3" />
            <h2 className="text-xl font-black text-slate-950 sm:text-2xl">
              היה משהו שחסר לך או שהיית רוצה לראות במערכת?
            </h2>
            <div className="mt-5">
              <RadioCards
                options={TRI_OPTIONS}
                value={answers.missing.answer}
                onChange={(answer) =>
                  setAnswers((prev) => ({ ...prev, missing: { ...prev.missing, answer: answer as any } }))
                }
              />
            </div>
            {answers.missing.answer === "yes" || answers.missing.answer === "unsure" ? (
              <textarea
                className="mt-4 min-h-28 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm"
                placeholder="ספר/י לנו מה חסר"
                value={answers.missing.detail}
                onChange={(e) =>
                  setAnswers((prev) => ({
                    ...prev,
                    missing: { ...prev.missing, detail: e.target.value },
                  }))
                }
              />
            ) : null}
          </Shell>
        ) : null}

        {step === "4" ? (
          <Shell footer={navFooter("5")}>
            <ProgressBar current="4" />
            <h2 className="text-xl font-black text-slate-950 sm:text-2xl">
              מה היית רוצה שיקרה בעסק בלי שתצטרך לזכור לעשות את זה ידנית?
            </h2>
            <div className="mt-5">
              <CardGrid
                options={AUTOMATION_OPTIONS}
                values={answers.automation.selections}
                onToggle={(value) =>
                  setAnswers((prev) => ({
                    ...prev,
                    automation: {
                      ...prev.automation,
                      selections: prev.automation.selections.includes(value)
                        ? prev.automation.selections.filter((v) => v !== value)
                        : [...prev.automation.selections, value],
                    },
                  }))
                }
              />
            </div>
            {answers.automation.selections.includes("other") ? (
              <input
                className="mt-4 min-h-11 w-full rounded-2xl border border-slate-200 px-4 text-sm"
                value={answers.automation.other}
                onChange={(e) =>
                  setAnswers((prev) => ({
                    ...prev,
                    automation: { ...prev.automation, other: e.target.value },
                  }))
                }
              />
            ) : null}
          </Shell>
        ) : null}

        {step === "5" ? (
          <Shell footer={navFooter("6")}>
            <ProgressBar current="5" />
            <h2 className="text-xl font-black text-slate-950 sm:text-2xl">
              יש משהו שאתם משתמשים בו היום שחשוב לכם לשמור, להעביר או לחבר ל-BizUply?
            </h2>
            <div className="mt-5">
              <RadioCards
                options={TRI_OPTIONS}
                value={answers.migration.answer}
                onChange={(answer) =>
                  setAnswers((prev) => ({
                    ...prev,
                    migration: { ...prev.migration, answer: answer as any },
                  }))
                }
              />
            </div>
            {answers.migration.answer === "yes" || answers.migration.answer === "unsure" ? (
              <textarea
                className="mt-4 min-h-28 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm"
                placeholder="לקוחות, לידים, Excel, CRM, אתר, WhatsApp או מערכת אחרת..."
                value={answers.migration.detail}
                onChange={(e) =>
                  setAnswers((prev) => ({
                    ...prev,
                    migration: { ...prev.migration, detail: e.target.value },
                  }))
                }
              />
            ) : null}
          </Shell>
        ) : null}

        {step === "6" ? (
          <Shell footer={navFooter("7")}>
            <ProgressBar current="6" />
            <h2 className="text-xl font-black text-slate-950 sm:text-2xl">רוצה שגם נעזור לך לעשות את העבודה בפועל?</h2>
            <p className="mt-2 text-sm font-semibold text-slate-600">
              בנוסף למערכת, אפשר לקבל שירותים מקצועיים שיחסכו ממך זמן והתעסקות.
            </p>
            <div className="mt-5">
              <CardGrid
                options={SERVICE_OPTIONS}
                values={answers.services.selections}
                onToggle={(value) =>
                  setAnswers((prev) => ({
                    ...prev,
                    services: {
                      ...prev.services,
                      selections: prev.services.selections.includes(value)
                        ? prev.services.selections.filter((v) => v !== value)
                        : [...prev.services.selections, value],
                    },
                  }))
                }
              />
            </div>
            {answers.services.selections.some((v) => v !== "not_now") ? (
              <textarea
                className="mt-4 min-h-24 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm"
                placeholder="ספר/י לנו בקצרה במה היית רוצה שנעזור"
                value={answers.services.detail}
                onChange={(e) =>
                  setAnswers((prev) => ({
                    ...prev,
                    services: { ...prev.services, detail: e.target.value },
                  }))
                }
              />
            ) : null}
            {answers.services.selections.includes("other") ? (
              <input
                className="mt-3 min-h-11 w-full rounded-2xl border border-slate-200 px-4 text-sm"
                placeholder="איזה שירות נוסף היה מעניין אותך?"
                value={answers.services.other}
                onChange={(e) =>
                  setAnswers((prev) => ({
                    ...prev,
                    services: { ...prev.services, other: e.target.value },
                  }))
                }
              />
            ) : null}
          </Shell>
        ) : null}

        {step === "7" ? (
          <Shell footer={navFooter("8")}>
            <ProgressBar current="7" />
            <h2 className="text-xl font-black text-slate-950 sm:text-2xl">יש משהו שיכול לגרום לך להתלבט לפני התחלה?</h2>
            <div className="mt-5">
              <CardGrid
                options={BLOCKER_OPTIONS}
                values={answers.blockers.selections}
                onToggle={(value) =>
                  setAnswers((prev) => ({
                    ...prev,
                    blockers: {
                      ...prev.blockers,
                      selections: prev.blockers.selections.includes(value)
                        ? prev.blockers.selections.filter((v) => v !== value)
                        : [...prev.blockers.selections, value],
                    },
                  }))
                }
              />
            </div>
            {answers.blockers.selections.includes("other") ? (
              <input
                className="mt-4 min-h-11 w-full rounded-2xl border border-slate-200 px-4 text-sm"
                value={answers.blockers.other}
                onChange={(e) =>
                  setAnswers((prev) => ({
                    ...prev,
                    blockers: { ...prev.blockers, other: e.target.value },
                  }))
                }
              />
            ) : null}
          </Shell>
        ) : null}

        {step === "8" ? (
          <Shell footer={navFooter("9")}>
            <ProgressBar current="8" />
            <h2 className="text-xl font-black text-slate-950 sm:text-2xl">אם הכול מתאים — מתי היית רוצה להתחיל?</h2>
            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {START_TIMING_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setAnswers((prev) => ({ ...prev, startTiming: opt.value }))}
                  className={[
                    "min-h-[52px] rounded-2xl border px-4 py-3 text-sm font-black transition",
                    answers.startTiming === opt.value
                      ? "border-[#6D28D9] bg-[#6D28D9]/5 text-[#6D28D9]"
                      : "border-slate-200 bg-white text-slate-800",
                  ].join(" ")}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </Shell>
        ) : null}

        {step === "9" ? (
          <Shell footer={navFooter("summary")}>
            <ProgressBar current="9" />
            <h2 className="text-xl font-black text-slate-950 sm:text-2xl">יש משהו נוסף שחשוב שנדע?</h2>
            <textarea
              className="mt-5 min-h-36 w-full rounded-2xl border border-slate-200 px-4 py-4 text-base"
              value={answers.extraNotes}
              onChange={(e) => setAnswers((prev) => ({ ...prev, extraNotes: e.target.value }))}
            />
            <p className="mt-2 text-sm font-semibold text-slate-500">
              לא חובה — כל פרט יכול לעזור לנו להתאים לך את ההמשך.
            </p>
          </Shell>
        ) : null}

        {step === "summary" ? (
          <Shell
            footer={
              <div className="flex flex-col gap-2 sm:flex-row sm:justify-between">
                <button
                  type="button"
                  onClick={() => setStep("1")}
                  className="min-h-11 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-black text-slate-700"
                >
                  חזרה לעריכה
                </button>
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => void submitProposal()}
                  className="min-h-12 rounded-2xl px-5 py-3 text-sm font-black text-white disabled:opacity-60"
                  style={{ background: BRAND }}
                >
                  {saving ? "שולח..." : "בקשה להצעה מותאמת"}
                </button>
              </div>
            }
          >
            <h2 className="text-2xl font-black text-slate-950">כמעט סיימנו ✨</h2>
            <p className="mt-2 text-base font-semibold text-slate-600">הנה מה שהבנו שחשוב לעסק שלך</p>
            <div className="mt-5 space-y-3">
              {summary.map((row) => (
                <div key={row.label} className="rounded-2xl border border-purple-100 bg-purple-50/50 p-4">
                  <p className="text-sm font-bold text-slate-500">{row.label}</p>
                  <p className="mt-1 text-base font-black text-slate-900">{row.value}</p>
                </div>
              ))}
              {!summary.length ? (
                <p className="text-sm font-semibold text-slate-500">אפשר להמשיך גם בלי למלא הכול.</p>
              ) : null}
            </div>
            {error ? <p className="mt-3 text-sm font-bold text-rose-600">{error}</p> : null}
          </Shell>
        ) : null}

        {step === "success" ? (
          <Shell
            footer={
              <button
                type="button"
                onClick={onDone}
                className="min-h-12 w-full rounded-2xl px-4 py-3 text-base font-black text-white"
                style={{ background: BRAND }}
              >
                סיום
              </button>
            }
          >
            <div className="text-center">
              <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-emerald-50 text-3xl">🎉</div>
              <h2 className="text-2xl font-black text-slate-950">הבקשה שלך התקבלה</h2>
              <p className="mt-3 text-base font-semibold leading-7 text-slate-600">
                קיבלנו את התשובות שלך ואנחנו כבר יודעים הרבה יותר טוב מה נכון לעסק שלך.
              </p>
              <p className="mt-2 text-base font-semibold leading-7 text-slate-600">
                נעבור על הפרטים ונכין לך הצעה שמתאימה למה שסימנת.
              </p>
              <div className="mt-6 rounded-2xl border border-slate-100 bg-slate-50 p-4 text-right">
                <p className="text-sm font-black text-slate-900">מה קורה עכשיו?</p>
                <ol className="mt-3 list-decimal space-y-2 pr-5 text-sm font-semibold text-slate-700">
                  <li>אנחנו עוברים על התשובות.</li>
                  <li>מתאימים את הפתרון והשירותים הרלוונטיים.</li>
                  <li>חוזרים אליך עם ההמשך וההצעה.</li>
                </ol>
              </div>
            </div>
          </Shell>
        ) : null}
      </motion.div>
    </AnimatePresence>
  );
}
