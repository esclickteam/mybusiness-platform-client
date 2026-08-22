import React from "react";
import { SecondaryButton } from "../AdminCrmUi";
import { buildSummaryPreview, hasIntroSummaryData, introQuestionnaireFromCallSummary } from "./utils";

export function IntroCallSummaryCard({
  callSummary,
  onOpen,
}: {
  callSummary: any;
  onOpen: () => void;
}) {
  const questionnaire = introQuestionnaireFromCallSummary(callSummary);
  const hasData = hasIntroSummaryData(questionnaire);
  const preview = buildSummaryPreview(questionnaire);
  const meta = callSummary?.summaryMeta || {};

  return (
    <div className="mt-2 rounded-xl border border-purple-100 bg-purple-50/40 p-3">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h4 className="text-sm font-black text-purple-950">סיכום שיחת היכרות</h4>
          {meta.updatedAt ? (
            <p className="mt-0.5 text-[11px] font-bold text-slate-500">
              עודכן {new Date(meta.updatedAt).toLocaleString("he-IL")}
              {meta.updatedByName ? ` · ${meta.updatedByName}` : ""}
            </p>
          ) : null}
        </div>
        <SecondaryButton compact onClick={onOpen}>
          {hasData ? "צפייה / עריכת סיכום שיחה" : "מילוי סיכום שיחה"}
        </SecondaryButton>
      </div>

      {hasData && preview.length ? (
        <ul className="mt-3 space-y-1.5 text-sm">
          {preview.map((line) => (
            <li key={line.label} className="font-bold text-slate-700">
              <span className="text-slate-500">{line.label}: </span>
              {line.value}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-2 text-xs font-bold text-slate-500">
          עדיין לא מולא סיכום שיחת היכרות.
        </p>
      )}
    </div>
  );
}
