import i18n from "../../i18n/i18n";
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
  options: readonly { value: string; label: string; labelKey?: string }[],
  value: string
) {
  const item = options.find((row) => row.value === value);
  if (!item) return value;
  return item.labelKey ? i18n.t(item.labelKey, item.label) : item.label;
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
  if (relevant.length) {
    rows.push({
      label: i18n.t("leftover.guidedQ.labelRelevant", "Most relevant"),
      value: relevant.join(" · "),
    });
  }
  if (answers.relevant.note.trim()) {
    rows.push({
      label: i18n.t("leftover.guidedQ.labelSpecial", "What matters most"),
      value: answers.relevant.note.trim(),
    });
  }

  const goals = labelsOf(GOAL_OPTIONS, answers.goals.selections, answers.goals.other);
  if (goals.length) {
    rows.push({
      label: i18n.t("leftover.guidedQ.labelGoals", "What to improve now"),
      value: goals.join(" · "),
    });
  }

  if (answers.currentTool.answer) {
    rows.push({
      label: i18n.t("leftover.guidedQ.labelTool", "System or tool to replace"),
      value: triText(TRI_OPTIONS, answers.currentTool.answer, answers.currentTool.detail),
    });
  }

  const transfer = labelsOf(
    TRANSFER_OPTIONS,
    answers.transfer.selections,
    answers.transfer.other
  );
  if (transfer.length) {
    rows.push({
      label: i18n.t("leftover.guidedQ.labelTransfer", "Information to move"),
      value: transfer.join(" · "),
    });
  }
  if (answers.transfer.hasFile) {
    rows.push({
      label: i18n.t("leftover.guidedQ.labelFile", "Excel/CSV file"),
      value: labelOf(FILE_OPTIONS, answers.transfer.hasFile),
    });
  }

  const automation = labelsOf(
    AUTOMATION_OPTIONS,
    answers.automation.selections,
    answers.automation.other
  );
  if (automation.length) {
    rows.push({
      label: i18n.t("leftover.guidedQ.labelAuto", "What to automate"),
      value: automation.join(" · "),
    });
  }
  if (answers.automation.detail.trim()) {
    rows.push({
      label: i18n.t("leftover.guidedQ.labelAutoDetail", "Automation details"),
      value: answers.automation.detail.trim(),
    });
  }

  if (answers.specialProcess.trim()) {
    rows.push({
      label: i18n.t("leftover.guidedQ.labelProcess", "Special business process"),
      value: answers.specialProcess.trim(),
    });
  }

  const services = labelsOf(
    SERVICE_OPTIONS,
    answers.services.selections.filter((value) => value !== "not_now"),
    answers.services.other
  );
  if (services.length) {
    rows.push({
      label: i18n.t("leftover.guidedQ.labelService", "Extra professional service"),
      value: services.join(" · "),
    });
  } else if (answers.services.selections.includes("not_now")) {
    rows.push({
      label: i18n.t("leftover.guidedQ.labelService", "Extra professional service"),
      value: i18n.t("leftover.guidedQ.notNow", "Not right now"),
    });
  }

  const blockers = labelsOf(
    BLOCKER_OPTIONS,
    answers.blockers.selections,
    answers.blockers.other
  );
  if (blockers.length) {
    rows.push({
      label: i18n.t("leftover.guidedQ.labelBlocker", "What might delay a start"),
      value: blockers.join(" · "),
    });
  }

  if (answers.startTiming) {
    const timing =
      answers.startTiming === "other" && answers.startTimingOther.trim()
        ? answers.startTimingOther.trim()
        : labelOf(START_TIMING_OPTIONS, answers.startTiming);
    rows.push({
      label: i18n.t("leftover.guidedQ.labelTiming", "When to start"),
      value: timing,
    });
  }

  if (answers.extraNotes.trim()) {
    rows.push({
      label: i18n.t("leftover.guidedQ.labelExtra", "Extra detail"),
      value: answers.extraNotes.trim(),
    });
  }

  if ((answers.mainGoal || "").trim()) {
    rows.push({
      label: i18n.t("leftover.guidedQ.labelGoalLegacy", "Main goal (legacy)"),
      value: String(answers.mainGoal).trim(),
    });
  }
  if (answers.missing?.answer) {
    rows.push({
      label: i18n.t("leftover.guidedQ.labelMissingLegacy", "What’s missing (legacy)"),
      value: triText(TRI_OPTIONS, answers.missing.answer, answers.missing.detail || ""),
    });
  }
  if ((answers.unclear || "").trim()) {
    rows.push({
      label: i18n.t("leftover.guidedQ.labelUnclearLegacy", "What was unclear (legacy)"),
      value: String(answers.unclear).trim(),
    });
  }
  if (answers.integrations?.answer) {
    rows.push({
      label: i18n.t("leftover.guidedQ.labelIntegrationsLegacy", "System connection (legacy)"),
      value: triText(
        TRI_OPTIONS,
        answers.integrations.answer,
        answers.integrations.detail || ""
      ),
    });
  }

  return rows;
}

export function getQuestionnaireStatusLabels(): Record<string, string> {
  return {
    not_started: i18n.t("leftover.guidedQ.statusNotStarted", "Not started"),
    in_progress: i18n.t("leftover.guidedQ.statusInProgress", "In progress"),
    completed: i18n.t("leftover.guidedQ.statusCompleted", "Completed"),
    proposal_requested: i18n.t("leftover.guidedQ.statusProposal", "Requested an offer"),
  };
}

export const QUESTIONNAIRE_STATUS_LABELS = new Proxy({} as Record<string, string>, {
  get(_target, prop: string) {
    return getQuestionnaireStatusLabels()[prop];
  },
});
