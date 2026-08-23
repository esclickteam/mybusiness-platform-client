import React from "react";
import { AdminModal } from "../AdminModal";
import { PrimaryButton } from "../AdminCrmUi";
import { israelWeekday } from "../../AdminBizuplyBookFlow";
import {
  buildFullSummarySections,
  buildSummaryPreview,
  introQuestionnaireFromCallSummary,
} from "./utils";

export default function IntroCallSummaryViewModal({
  open,
  booking,
  callSummary,
  onClose,
}: {
  open: boolean;
  booking?: {
    serviceName?: string;
    startAt?: string;
    contactName?: string;
  } | null;
  callSummary: any;
  onClose: () => void;
}) {
  const questionnaire = introQuestionnaireFromCallSummary(callSummary);
  const sections = buildFullSummarySections(questionnaire);
  const preview = buildSummaryPreview(questionnaire);
  const meta = callSummary?.summaryMeta || {};

  return (
    <AdminModal
      open={open}
      onClose={onClose}
      eyebrow="יומן BizUply"
      title="סיכום שיחת היכרות"
      subtitle={
        booking?.startAt
          ? `${booking.serviceName || "שיחה ראשונית"} · ${israelWeekday(booking.startAt)}`
          : booking?.serviceName || "פגישה ראשונית"
      }
      size="xl"
      className="!max-w-4xl"
      footer={
        <div className="flex justify-end">
          <PrimaryButton compact onClick={onClose}>
            סגירה
          </PrimaryButton>
        </div>
      }
    >
      <div className="space-y-4">
        {meta.updatedAt ? (
          <p className="text-sm font-bold text-slate-600">
            נשמר {new Date(meta.updatedAt).toLocaleString("he-IL")}
            {meta.updatedByName ? ` · ${meta.updatedByName}` : ""}
          </p>
        ) : null}

        {preview.length ? (
          <div className="rounded-2xl border border-purple-100 bg-purple-50/50 p-4">
            <h3 className="text-base font-black text-purple-950">תקציר</h3>
            <ul className="mt-3 space-y-2">
              {preview.map((line) => (
                <li key={line.label} className="text-sm font-bold text-slate-800">
                  <span className="text-slate-600">{line.label}: </span>
                  {line.value}
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <div className="space-y-3">
          {sections.map((section) => (
            <section
              key={section.title}
              className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm"
            >
              <h4 className="text-base font-black text-slate-900">{section.title}</h4>
              <p className="mt-2 whitespace-pre-wrap text-sm font-medium leading-6 text-slate-800">
                {section.value}
              </p>
            </section>
          ))}
        </div>

        {!sections.length ? (
          <p className="text-sm font-bold text-slate-500">אין נתונים לתצוגה.</p>
        ) : null}
      </div>
    </AdminModal>
  );
}
