import {
  AUTOMATION_OPTIONS,
  BLOCKER_OPTIONS,
  RELEVANT_OPTIONS,
  SERVICE_OPTIONS,
  START_TIMING_OPTIONS,
  type PostDemoAnswers,
} from "./types";

const TRI_LABELS: Record<string, string> = {
  no: "לא",
  yes: "כן",
  unsure: "לא בטוח/ה",
};

function labelFor(
  options: readonly { value: string; label: string }[],
  value: string
) {
  return options.find((o) => o.value === value)?.label || value;
}

function labelsFor(
  options: readonly { value: string; label: string }[],
  values: string[]
) {
  return values.map((v) => labelFor(options, v)).filter(Boolean);
}

const UNANSWERED = "לא צוין";

function joined(parts: Array<string | undefined | null>) {
  return parts.map((p) => String(p || "").trim()).filter(Boolean).join(" · ");
}

function triValue(answer: string, detail = "") {
  if (!answer) return "";
  const label = TRI_LABELS[answer] || answer;
  return detail.trim() ? `${label} — ${detail.trim()}` : label;
}

export function formatPostDemoAnswers(answers: PostDemoAnswers) {
  return formatFullPostDemoSummary(answers).filter((row) => row.value !== UNANSWERED);
}

export function formatFullPostDemoSummary(answers: PostDemoAnswers) {
  const rel = labelsFor(RELEVANT_OPTIONS, answers.relevant.selections);
  if (answers.relevant.other) rel.push(answers.relevant.other);
  const auto = labelsFor(AUTOMATION_OPTIONS, answers.automation.selections);
  if (answers.automation.other) auto.push(answers.automation.other);
  const services = labelsFor(SERVICE_OPTIONS, answers.services.selections);
  if (answers.services.other) services.push(answers.services.other);
  const blockers = labelsFor(BLOCKER_OPTIONS, answers.blockers.selections);
  if (answers.blockers.other) blockers.push(answers.blockers.other);

  const rows: { label: string; value: string }[] = [
    {
      label: "מה מתוך הדמו הכי רלוונטי לעסק שלך?",
      value: rel.length ? rel.join(" · ") : UNANSWERED,
    },
    {
      label: "יש משהו ספציפי שעניין אותך במיוחד?",
      value: answers.relevant.note.trim() || UNANSWERED,
    },
    {
      label: "היה משהו שחסר לך או שהיית רוצה לראות במערכת?",
      value: triValue(answers.missing.answer, answers.missing.detail) || UNANSWERED,
    },
    {
      label: "מה היית רוצה שיקרה בעסק בלי שתצטרך לזכור לעשות את זה ידנית?",
      value: auto.length ? auto.join(" · ") : UNANSWERED,
    },
    {
      label: "יש משהו שאתם משתמשים בו היום שחשוב לכם לשמור, להעביר או לחבר ל-BizUply?",
      value: triValue(answers.migration.answer, answers.migration.detail) || UNANSWERED,
    },
    {
      label: "רוצה שגם נעזור לך לעשות את העבודה בפועל?",
      value:
        joined([services.join(" · "), answers.services.detail.trim()]) || UNANSWERED,
    },
    {
      label: "יש משהו שיכול לגרום לך להתלבט לפני התחלה?",
      value: blockers.length ? blockers.join(" · ") : UNANSWERED,
    },
    {
      label: "אם הכול מתאים — מתי היית רוצה להתחיל?",
      value: answers.startTiming
        ? labelFor(START_TIMING_OPTIONS, answers.startTiming)
        : UNANSWERED,
    },
    {
      label: "יש משהו נוסף שחשוב שנדע?",
      value: answers.extraNotes.trim() || UNANSWERED,
    },
  ];

  if ((answers.mainGoal || "").trim()) {
    rows.splice(2, 0, {
      label: "אם BizUply הייתה משפרת דבר אחד בעסק שלך",
      value: answers.mainGoal.trim(),
    });
  }
  return rows;
}

export const QUESTIONNAIRE_STATUS_LABELS: Record<string, string> = {
  not_started: "לא התחיל",
  in_progress: "בתהליך",
  completed: "הושלם",
  proposal_requested: "ביקש הצעה",
};
