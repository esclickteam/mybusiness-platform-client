import React from "react";
import { SecondaryButton } from "../AdminCrmUi";
import {
  buildSummaryPreview,
  hasIntroSummaryData,
  introQuestionnaireFromCallSummary,
  isSummarySaved,
} from "./utils";

export function IntroCallSummaryCard({
  callSummary,
  onView,
  onFill,
}: {
  callSummary: any;
  onView: () => void;
  onFill?: () => void;
}) {
  const questionnaire = introQuestionnaireFromCallSummary(callSummary);
  const hasData = hasIntroSummaryData(questionnaire);
  const saved = isSummarySaved(callSummary);
  const preview = buildSummaryPreview(questionnaire);
  const meta = callSummary?.summaryMeta || {};

  return (
    <div className="mt-2 rounded-xl border border-purple-100 bg-purple-50/40 p-3 sm:p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h4 className="text-base font-black text-purple-950">סיכום שיחת היכרות</h4>
          {meta.updatedAt ? (
            <p className="mt-1 text-xs font-bold text-slate-600">
              עודכן {new Date(meta.updatedAt).toLocaleString("he-IL")}
              {meta.updatedByName ? ` · ${meta.updatedByName}` : ""}
            </p>
          ) : null}
        </div>
        <div className="flex flex-wrap gap-2">
          {saved ? (
            <SecondaryButton compact onClick={onView}>
              צפייה בסיכום שיחה
            </SecondaryButton>
          ) : onFill ? (
            <SecondaryButton compact onClick={onFill}>
              מילוי סיכום שיחה
            </SecondaryButton>
          ) : null}
        </div>
      </div>

      {hasData && preview.length ? (
        <ul className="mt-3 space-y-2 text-sm sm:text-base">
          {preview.map((line) => (
            <li key={line.label} className="font-bold text-slate-800">
              <span className="text-slate-600">{line.label}: </span>
              {line.value}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-2 text-sm font-bold text-slate-500">
          עדיין לא מולא סיכום שיחת היכרות.
        </p>
      )}
    </div>
  );
}
