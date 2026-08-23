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

function triValue(answer: string, detail = "") {
  if (!answer) return "";
  const label = TRI_LABELS[answer] || answer;
  return detail.trim() ? `${label} — ${detail.trim()}` : label;
}

export function formatPostDemoAnswers(answers: PostDemoAnswers) {
  const rows: { label: string; value: string }[] = [];
  const rel = labelsFor(RELEVANT_OPTIONS, answers.relevant.selections);
  if (answers.relevant.other) rel.push(answers.relevant.other);
  if (rel.length) rows.push({ label: "הכי רלוונטי", value: rel.join(" · ") });
  if (answers.relevant.note.trim()) {
    rows.push({ label: "מה עניין במיוחד", value: answers.relevant.note.trim() });
  }
  if (answers.missing.answer) {
    rows.push({
      label: "חסר במערכת",
      value: triValue(answers.missing.answer, answers.missing.detail),
    });
  }
  if (answers.unclear.trim()) {
    rows.push({ label: "לא היה ברור", value: answers.unclear.trim() });
  }
  const auto = labelsFor(AUTOMATION_OPTIONS, answers.automation.selections);
  if (answers.automation.other) auto.push(answers.automation.other);
  if (auto.length) rows.push({ label: "אוטומציות מבוקשות", value: auto.join(" · ") });
  if (answers.automation.detail?.trim()) {
    rows.push({ label: "פירוט אוטומציות", value: answers.automation.detail.trim() });
  }
  if (answers.migration.answer) {
    rows.push({
      label: "מעבר ממערכות",
      value: triValue(answers.migration.answer, answers.migration.detail),
    });
  }
  if (answers.integrations?.answer) {
    rows.push({
      label: "חיבור למערכת",
      value: triValue(answers.integrations.answer, answers.integrations.detail),
    });
  }
  if (answers.workflowFit?.trim()) {
    rows.push({ label: "התאמה לתהליך", value: answers.workflowFit.trim() });
  }
  const services = labelsFor(SERVICE_OPTIONS, answers.services.selections).filter(
    (s) => s !== "לא כרגע"
  );
  if (answers.services.other) services.push(answers.services.other);
  if (services.length) {
    rows.push({
      label: "שירותים נוספים",
      value: [services.join(" · "), answers.services.detail.trim()]
        .filter(Boolean)
        .join(" — "),
    });
  }
  const blockers = labelsFor(BLOCKER_OPTIONS, answers.blockers.selections);
  if (answers.blockers.other) blockers.push(answers.blockers.other);
  if (blockers.length) rows.push({ label: "מה יכול לעכב", value: blockers.join(" · ") });
  if (answers.startTiming) {
    const timing =
      answers.startTiming === "other" && answers.startTimingOther?.trim()
        ? answers.startTimingOther.trim()
        : labelFor(START_TIMING_OPTIONS, answers.startTiming);
    rows.push({ label: "מועד התחלה", value: timing });
  }
  if (answers.extraNotes.trim()) {
    rows.push({ label: "הערות נוספות", value: answers.extraNotes.trim() });
  }
  if ((answers.mainGoal || "").trim()) {
    rows.push({ label: "מטרה מרכזית", value: String(answers.mainGoal).trim() });
  }
  return rows;
}

export const QUESTIONNAIRE_STATUS_LABELS: Record<string, string> = {
  not_started: "לא התחיל",
  in_progress: "בתהליך",
  completed: "הושלם",
  proposal_requested: "ביקש הצעה",
};
