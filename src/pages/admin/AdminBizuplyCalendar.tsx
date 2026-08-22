import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import adminCrmApi from "../../api/adminCrmApi";
import AdminHeader from "./AdminsHeader";
import {
  CrmCard,
  EmptyState,
  ErrorState,
  LoadingState,
  PrimaryButton,
  SecondaryButton,
} from "./crm/AdminCrmUi";
import { formatIsraelDate } from "./crm/adminCrmLabels";
import { ADMIN_PAGE_SHELL_CLASS } from "../../utils/adminResponsive";

const STATUS_LABELS: Record<string, string> = {
  booked: "נקבעה",
  cancelled: "בוטלה",
  completed: "הושלמה",
  no_show: "לא הגיע",
};

export default function AdminBizuplyCalendar() {
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<any>(null);
  const [statusFor, setStatusFor] = useState<any>(null);

  async function load() {
    setLoading(true);
    setError("");
    try {
      const { data: res } = await adminCrmApi.calendar({ days: 14 });
      setData(res);
    } catch (err: any) {
      setError(err?.response?.data?.error || "טעינת היומן נכשלה");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const intro = useMemo(
    () => (data?.services || []).find((row: any) => row.key === "intro_call") || data?.services?.[0],
    [data]
  );

  async function setStatus(id: string, status: string) {
    try {
      await adminCrmApi.calendarStatus(id, {
        status,
        callSummary: status === "completed" ? summary : undefined,
      });
      setStatusFor(null);
      setSummary(null);
      load();
    } catch (err: any) {
      setError(err?.response?.data?.error || "עדכון הפגישה נכשל");
    }
  }

  return (
    <div className={ADMIN_PAGE_SHELL_CLASS} dir="rtl">
      <AdminHeader />
      <main className="mx-auto max-w-[1480px] space-y-4 px-3 py-6 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-black text-[#7C4DFF]">יומן BizUply</p>
            <h1 className="text-2xl font-black text-purple-950">פגישות עם לידים ולקוחות</h1>
            <p className="font-bold text-slate-500">
              {intro?.nameHe || "שיחה ראשונית"} · {intro?.durationMinutes || 15} דקות · {data?.timezone || "Asia/Jerusalem"}
            </p>
          </div>
          <SecondaryButton onClick={load}>רענון</SecondaryButton>
        </div>

        {loading ? <LoadingState /> : null}
        {error ? <ErrorState message={error} onRetry={load} /> : null}

        {!loading && !(data?.bookings || []).length ? (
          <EmptyState title="אין פגישות בטווח הקרוב" />
        ) : (
          <div className="space-y-3">
            {(data?.bookings || []).map((row: any) => (
              <CrmCard key={row.id}>
                <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <p className="text-xs font-black text-[#7C4DFF]">
                      {row.serviceName || "שיחה ראשונית"} · {STATUS_LABELS[row.status] || row.status}
                    </p>
                    <h2 className="text-lg font-black text-purple-950">
                      {row.contactName || "ללא שם"}
                    </h2>
                    <p className="font-bold text-slate-600" dir="ltr">
                      {row.phone} {row.email ? `· ${row.email}` : ""}
                    </p>
                    <p className="mt-1 font-black text-slate-800">
                      {formatIsraelDate(row.startAt, true)} · {row.durationMinutes} דקות
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {row.adminCustomerId ? (
                      <SecondaryButton onClick={() => navigate(`/admin/crm/customers/${row.adminCustomerId}`)}>
                        פתיחת לקוח
                      </SecondaryButton>
                    ) : null}
                    {row.phone ? (
                      <>
                        <a className="min-h-11 rounded-2xl bg-emerald-50 px-3 py-2 text-sm font-black text-emerald-700" href={`tel:${row.phone}`}>שיחה</a>
                        <Link className="min-h-11 rounded-2xl bg-emerald-50 px-3 py-2 text-sm font-black text-emerald-700" to={`/admin/crm/customers/${row.adminCustomerId}?tab=whatsapp`}>WhatsApp</Link>
                      </>
                    ) : null}
                    {row.status === "booked" ? (
                      <>
                        <SecondaryButton onClick={() => setStatus(row.id, "cancelled")}>ביטול</SecondaryButton>
                        <SecondaryButton onClick={() => setStatus(row.id, "no_show")}>No Show</SecondaryButton>
                        <PrimaryButton onClick={() => setStatusFor(row)}>הושלמה</PrimaryButton>
                      </>
                    ) : null}
                  </div>
                </div>
              </CrmCard>
            ))}
          </div>
        )}

        {statusFor ? (
          <CrmCard>
            <h3 className="font-black">סיכום שיחה (אופציונלי)</h3>
            <div className="mt-3 grid gap-2">
              {[
                ["summary", "סיכום"],
                ["customerNeed", "הצורך של הלקוח"],
                ["packageInterest", "חבילה רלוונטית"],
                ["interestLevel", "רמת עניין"],
                ["objections", "התנגדויות"],
                ["nextStep", "הצעד הבא"],
                ["nextFollowUp", "מעקב הבא"],
              ].map(([key, label]) => (
                <label key={key} className="text-sm font-bold text-slate-600">
                  {label}
                  <input
                    className="mt-1 min-h-11 w-full rounded-2xl border px-3"
                    value={summary?.[key] || ""}
                    onChange={(e) => setSummary((prev: any) => ({ ...prev, [key]: e.target.value }))}
                  />
                </label>
              ))}
            </div>
            <div className="mt-3 flex gap-2">
              <PrimaryButton onClick={() => setStatus(statusFor.id, "completed")}>שמירה וסגירה</PrimaryButton>
              <SecondaryButton onClick={() => { setStatusFor(null); setSummary(null); }}>ביטול</SecondaryButton>
            </div>
          </CrmCard>
        ) : null}
      </main>
    </div>
  );
}
