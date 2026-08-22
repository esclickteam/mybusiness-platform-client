import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import adminCrmApi from "../../api/adminCrmApi";
import AdminHeader from "./AdminsHeader";
import {
  CrmCard,
  ErrorState,
  LoadingState,
  PrimaryButton,
  SecondaryButton,
} from "./crm/AdminCrmUi";
import { formatIsraelDate } from "./crm/adminCrmLabels";
import { ADMIN_PAGE_SHELL_CLASS } from "../../utils/adminResponsive";

const STATUS_HE: Record<string, string> = {
  success: "הצליחה",
  failed: "נכשלה",
  skipped: "דולגה",
  running: "בתהליך",
};

export default function AdminAutomations() {
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [runs, setRuns] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    setError("");
    try {
      const [list, history] = await Promise.all([
        adminCrmApi.automationsList(),
        adminCrmApi.automationRuns({ limit: 50 }),
      ]);
      setData(list.data);
      setRuns(history.data.runs || []);
    } catch (err: any) {
      setError(err?.response?.data?.error || "טעינת האוטומציות נכשלה");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const item = data?.items?.[0];

  async function toggle(enabled: boolean) {
    if (!item) return;
    setSaving(true);
    try {
      const { data: res } = await adminCrmApi.setAutomationEnabled(item.key, enabled);
      setData(res);
    } catch (err: any) {
      setError(err?.response?.data?.error || "עדכון האוטומציה נכשל");
    } finally {
      setSaving(false);
    }
  }

  async function retry(id: string) {
    try {
      await adminCrmApi.retryAutomationRun(id);
      load();
    } catch (err: any) {
      setError(err?.response?.data?.error || "ניסיון חוזר נכשל");
    }
  }

  return (
    <div className={ADMIN_PAGE_SHELL_CLASS} dir="rtl">
      <AdminHeader />
      <main className="mx-auto max-w-[1480px] space-y-4 px-3 py-6 sm:px-6">
        <div>
          <p className="text-xs font-black text-[#7C4DFF]">אוטומציות אדמין</p>
          <h1 className="text-2xl font-black text-purple-950">ניהול לידים של BizUply</h1>
          <p className="font-bold text-slate-500">
            אוטומציות אלה שייכות ל-CRM האדמין בלבד, לא לאוטומציות של לקוחות.
          </p>
        </div>

        {loading ? <LoadingState /> : null}
        {error ? <ErrorState message={error} onRetry={load} /> : null}

        {item ? (
          <CrmCard>
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <h2 className="text-xl font-black text-purple-950">{item.name}</h2>
                <p className="mt-1 font-bold text-slate-600">טריגר: {item.trigger}</p>
                <p className="font-bold text-slate-600">
                  פעולה: {item.action} · {item.templateName}
                </p>
                <div className="mt-3 flex flex-wrap gap-2 text-sm font-black">
                  <span className="rounded-full bg-slate-100 px-3 py-1">הרצות {item.executions || 0}</span>
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-800">הצליחו {item.successful || 0}</span>
                  <span className="rounded-full bg-rose-50 px-3 py-1 text-rose-800">נכשלו {item.failed || 0}</span>
                  <span className="rounded-full bg-violet-50 px-3 py-1 text-[#7C4DFF]">
                    ריצה אחרונה {item.lastRunAt ? formatIsraelDate(item.lastRunAt, true) : "—"}
                  </span>
                </div>
                <p className="mt-3 text-sm font-bold text-amber-800">
                  ברירת המחדל בפרודקשן היא כבוי. אין שליחה היסטורית בעת הפעלה.
                </p>
                {item.enabledAt ? (
                  <p className="text-sm font-bold text-slate-500">
                    enabledAt: {formatIsraelDate(item.enabledAt, true)}
                  </p>
                ) : null}
              </div>
              <div className="flex gap-2">
                {item.enabled ? (
                  <SecondaryButton disabled={saving} onClick={() => toggle(false)}>Disable</SecondaryButton>
                ) : (
                  <PrimaryButton disabled={saving} onClick={() => toggle(true)}>הפעלה</PrimaryButton>
                )}
              </div>
            </div>
          </CrmCard>
        ) : null}

        <CrmCard>
          <h3 className="font-black">יומן הרצות</h3>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full min-w-[720px] text-right text-sm">
              <thead>
                <tr className="text-slate-500">
                  <th className="pb-2">לקוח</th>
                  <th className="pb-2">טריגר</th>
                  <th className="pb-2">התחלה</th>
                  <th className="pb-2">סיום</th>
                  <th className="pb-2">תוצאה</th>
                  <th className="pb-2">פעולות</th>
                </tr>
              </thead>
              <tbody>
                {runs.map((run) => (
                  <tr key={run.id} className="border-t border-slate-100">
                    <td className="py-3">
                      <button
                        type="button"
                        className="font-black text-[#7C4DFF]"
                        onClick={() => run.adminCustomerId && navigate(`/admin/crm/customers/${run.adminCustomerId}`)}
                      >
                        {run.customerName || run.adminCustomerId || "—"}
                      </button>
                    </td>
                    <td className="py-3 font-bold">{run.trigger}</td>
                    <td className="py-3">{formatIsraelDate(run.startedAt, true)}</td>
                    <td className="py-3">{formatIsraelDate(run.completedAt, true)}</td>
                    <td className="py-3">
                      <div className="font-black">{STATUS_HE[run.status] || run.status}</div>
                      {run.error ? <div className="text-xs font-bold text-rose-700">{run.error}</div> : null}
                      {run.metadata?.providerMessageId ? (
                        <div className="text-xs text-slate-500" dir="ltr">{run.metadata.providerMessageId}</div>
                      ) : null}
                    </td>
                    <td className="py-3">
                      {run.status === "failed" ? (
                        <SecondaryButton onClick={() => retry(run.id)}>נסה שוב</SecondaryButton>
                      ) : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!runs.length ? <p className="py-6 font-bold text-slate-500">אין הרצות עדיין</p> : null}
          </div>
        </CrmCard>
      </main>
    </div>
  );
}
