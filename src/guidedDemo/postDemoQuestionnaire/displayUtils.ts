import {
  AUTOMATION_OPTIONS,
  BLOCKER_OPTIONS,
  FILE_OPTIONS,
  GOAL_OPTIONS,
  RELEVANT_OPTIONS,
  SERVICE_OPTIONS,
  START_TIMING_OPTIONS,
  TRANSFER_OPTIONS,
  TRI_OPTIONS,
  type PostDemoAnswers,
} from "./types";

function labelOf(
  options: readonly { value: string; label: string }[],
  value: string
) {
  return options.find((item) => item.value === value)?.label || value;
}

function labelsOf(
  options: readonly { value: string; label: string }[],
  values: string[],
  other = ""
) {
  const labels = values.map((value) => labelOf(options, value)).filter(Boolean);
  if (other.trim()) labels.push(other.trim());
  return labels;
}

function triText(
  options: readonly { value: string; label: string }[],
  answer: string,
  detail = ""
) {
  if (!answer) return "";
  const label = labelOf(options, answer);
  return detail.trim() ? `${label} — ${detail.trim()}` : label;
}

export function formatPostDemoAnswers(answers: PostDemoAnswers) {
  const rows: { label: string; value: string }[] = [];

  const relevant = labelsOf(
    RELEVANT_OPTIONS,
    answers.relevant.selections,
    answers.relevant.other
  );
  if (relevant.length) rows.push({ label: "מה הכי רלוונטי", value: relevant.join(" · ") });
  if (answers.relevant.note.trim()) {
    rows.push({ label: "מה חשוב במיוחד", value: answers.relevant.note.trim() });
  }

  const goals = labelsOf(GOAL_OPTIONS, answers.goals.selections, answers.goals.other);
  if (goals.length) rows.push({ label: "מה חשוב לשפר עכשיו", value: goals.join(" · ") });

  if (answers.currentTool.answer) {
    rows.push({
      label: "מערכת או כלי להחלפה",
      value: triText(TRI_OPTIONS, answers.currentTool.answer, answers.currentTool.detail),
    });
  }

  const transfer = labelsOf(
    TRANSFER_OPTIONS,
    answers.transfer.selections,
    answers.transfer.other
  );
  if (transfer.length) rows.push({ label: "מידע להעברה", value: transfer.join(" · ") });
  if (answers.transfer.hasFile) {
    rows.push({
      label: "קובץ Excel/CSV",
      value: labelOf(FILE_OPTIONS, answers.transfer.hasFile),
    });
  }

  const automation = labelsOf(
    AUTOMATION_OPTIONS,
    answers.automation.selections,
    answers.automation.other
  );
  if (automation.length) {
    rows.push({ label: "מה לייצר באופן אוטומטי", value: automation.join(" · ") });
  }
  if (answers.automation.detail.trim()) {
    rows.push({ label: "פירוט אוטומציות", value: answers.automation.detail.trim() });
  }

  if (answers.specialProcess.trim()) {
    rows.push({ label: "תהליך מיוחד בעסק", value: answers.specialProcess.trim() });
  }

  const services = labelsOf(
    SERVICE_OPTIONS,
    answers.services.selections.filter((value) => value !== "not_now"),
    answers.services.other
  );
  if (services.length) rows.push({ label: "שירות מקצועי נוסף", value: services.join(" · ") });
  else if (answers.services.selections.includes("not_now")) {
    rows.push({ label: "שירות מקצועי נוסף", value: "לא כרגע" });
  }

  const blockers = labelsOf(
    BLOCKER_OPTIONS,
    answers.blockers.selections,
    answers.blockers.other
  );
  if (blockers.length) rows.push({ label: "מה עלול לעכב התחלה", value: blockers.join(" · ") });

  if (answers.startTiming) {
    const timing =
      answers.startTiming === "other" && answers.startTimingOther.trim()
        ? answers.startTimingOther.trim()
        : labelOf(START_TIMING_OPTIONS, answers.startTiming);
    rows.push({ label: "מתי להתחיל", value: timing });
  }

  if (answers.extraNotes.trim()) {
    rows.push({ label: "פרט נוסף", value: answers.extraNotes.trim() });
  }

  if ((answers.mainGoal || "").trim()) {
    rows.push({ label: "מטרה מרכזית (ישן)", value: String(answers.mainGoal).trim() });
  }
  if (answers.missing?.answer) {
    rows.push({
      label: "מה חסר (ישן)",
      value: triText(TRI_OPTIONS, answers.missing.answer, answers.missing.detail || ""),
    });
  }
  if ((answers.unclear || "").trim()) {
    rows.push({ label: "מה לא היה ברור (ישן)", value: String(answers.unclear).trim() });
  }
  if (answers.integrations?.answer) {
    rows.push({
      label: "חיבור למערכת (ישן)",
      value: triText(
        TRI_OPTIONS,
        answers.integrations.answer,
        answers.integrations.detail || ""
      ),
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
