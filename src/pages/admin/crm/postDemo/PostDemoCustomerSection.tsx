import React, { useEffect, useState } from "react";
import { listGuidedDemos } from "../../../../api/guidedDemoApi";
import { mergeAnswers } from "../../../../guidedDemo/postDemoQuestionnaire/types";
import {
  formatPostDemoAnswers,
  QUESTIONNAIRE_STATUS_LABELS,
} from "../../../../guidedDemo/postDemoQuestionnaire/displayUtils";
import { PrimaryButton, SecondaryButton, CrmCard } from "../AdminCrmUi";
import { Badge, formatIsraelDate } from "../adminCrmLabels";

function pickLatestDemo(items: any[]) {
  return [...items].sort((a, b) => {
    const aTs = new Date(a.lastActivityAt || a.createdAt || 0).getTime();
    const bTs = new Date(b.lastActivityAt || b.createdAt || 0).getTime();
    return bTs - aTs;
  })[0];
}

export default function PostDemoCustomerSection({ customerId }: { customerId: string }) {
  const [demo, setDemo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      try {
        const data = await listGuidedDemos({ sourceCustomerId: customerId, limit: 20 });
        if (!alive) return;
        const items = data?.items || [];
        setDemo(items.length ? pickLatestDemo(items) : null);
      } catch {
        if (alive) setDemo(null);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [customerId]);

  if (loading) return null;
  if (!demo) return null;

  const answers = mergeAnswers(demo.postDemoQuestionnaire || {});
  const answerRows = formatPostDemoAnswers(answers);
  const qStatus = demo.questionnaireStatus || "not_started";
  const waitingProposal = qStatus === "proposal_requested";

  return (
    <CrmCard className="!border-violet-100 !bg-gradient-to-l !from-violet-50/60 !to-white lg:col-span-2">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-violet-700">
            לאחר הדמו
          </p>
          <h3 className="mt-1 text-lg font-black text-slate-900">מולא על ידי הלקוח</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {waitingProposal ? (
            <Badge tone="bg-amber-50 text-amber-800 border-amber-200">ממתין להצעה</Badge>
          ) : null}
          {demo.demoCompletedAt || demo.completedAt ? (
            <Badge tone="bg-emerald-50 text-emerald-700 border-emerald-200">סיים דמו</Badge>
          ) : null}
          {qStatus !== "not_started" ? (
            <Badge tone="bg-violet-50 text-violet-700 border-violet-100">
              שאלון: {QUESTIONNAIRE_STATUS_LABELS[qStatus] || qStatus}
            </Badge>
          ) : null}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-2 text-sm font-bold text-slate-700 sm:grid-cols-2">
        <p>דמו פעיל עד: {formatIsraelDate(demo.expiresAt, true)}</p>
        <p>כניסות לדמו: {demo.openCount || 0}</p>
        <p>כניסה ראשונה: {formatIsraelDate(demo.firstOpenedAt || demo.openedAt, true)}</p>
        <p>כניסה אחרונה: {formatIsraelDate(demo.lastOpenedAt, true)}</p>
        <p>סיים דמו: {formatIsraelDate(demo.demoCompletedAt || demo.completedAt, true)}</p>
        <p>סיים שאלון: {formatIsraelDate(demo.questionnaireCompletedAt, true)}</p>
        <p>ביקש הצעה: {formatIsraelDate(demo.proposalRequestedAt, true)}</p>
      </div>

      {answerRows.length ? (
        <ul className="mt-4 space-y-2 text-sm">
          {answerRows.map((row) => (
            <li key={row.label} className="rounded-2xl border border-violet-100 bg-white/80 p-3">
              <p className="text-xs font-bold text-slate-500">{row.label}</p>
              <p className="mt-1 font-black text-slate-900">{row.value}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 text-sm font-bold text-slate-500">
          הלקוח עדיין לא מילא את השאלון לאחר הדמו.
        </p>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        {waitingProposal ? (
          <PrimaryButton compact onClick={() => window.alert("יצירת הצעה — בקרוב")}>
            יצירת הצעה
          </PrimaryButton>
        ) : null}
        {demo.id ? (
          <SecondaryButton compact onClick={() => window.open(`/admin/guided-demos/${demo.id}`, "_blank")}>
            פרטי הדמו
          </SecondaryButton>
        ) : null}
      </div>
    </CrmCard>
  );
}
