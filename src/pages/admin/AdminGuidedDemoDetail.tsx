import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminHeader from "./AdminsHeader";
import BizuplyLoader from "../../components/ui/BizuplyLoader";
import AdminGuidedDemoActions from "./AdminGuidedDemoActions";
import { fetchGuidedDemoCatalog, getGuidedDemo } from "../../api/guidedDemoApi";
import { invitationIdOf } from "../../guidedDemo/adminSendForm";

const STATUS_LABEL: Record<string, string> = {
  created: "נוצר",
  sent: "נשלח",
  opened: "נפתח",
  in_progress: "בתהליך",
  completed: "הושלם",
  expired: "פג תוקף",
  revoked: "בוטל",
  delivery_failed: "שגיאת שליחה",
};

function formatDate(value?: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("he-IL", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export default function AdminGuidedDemoDetail() {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [waOk, setWaOk] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const [demo, catalog] = await Promise.all([
        getGuidedDemo(id),
        fetchGuidedDemoCatalog().catch(() => null),
      ]);
      setData(demo);
      setWaOk(Boolean(catalog?.delivery?.whatsapp?.available));
    } catch (err: any) {
      setError(err?.response?.data?.error || "טעינה נכשלה");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, [id]);

  const inv = data?.invitation;
  const demoUrl = inv?.linkAvailable ? inv.demoLink : "";

  return (
    <div className="min-h-screen bg-[#f5f6fb]" dir="rtl">
      <AdminHeader />
      <main className="mx-auto max-w-4xl px-4 py-8">
        <button
          type="button"
          onClick={() => navigate("/admin/guided-demos")}
          className="mb-4 text-sm font-black text-violet-700"
        >
          ← חזרה לרשימה
        </button>
        {loading ? (
          <div className="grid place-items-center py-20">
            <BizuplyLoader />
          </div>
        ) : !inv ? (
          <p className="font-bold text-rose-600">{error || "לא נמצא"}</p>
        ) : (
          <>
            <h1 className="text-3xl font-black">{inv.customerName}</h1>
            <p className="mt-1 font-bold text-slate-500" dir="ltr">
              {inv.customerPhone}
            </p>
            {error ? <p className="mt-3 text-sm font-bold text-rose-600">{error}</p> : null}

            <div className="mt-6 grid gap-3 rounded-[24px] border border-slate-100 bg-white p-5 text-sm font-bold shadow-sm">
              <p>שם לקוח: {inv.customerName}</p>
              <p dir="ltr">טלפון: {inv.customerPhone}</p>
              <p>
                מודולים / preset: {inv.presetKey}
                {(inv.selectedModules || []).length
                  ? ` — ${(inv.selectedModules || []).join(", ")}`
                  : ""}
              </p>
              <p>סטטוס: {STATUS_LABEL[inv.status] || inv.status}</p>
              <p>נוצר: {formatDate(inv.createdAt)}</p>
              <p>תוקף: {formatDate(inv.expiresAt)}</p>
              <p>נשלח: {inv.deliveryStatus}</p>
              <p>נפתח: {formatDate(inv.openedAt)}</p>
              <p>התחיל: {formatDate(inv.redeemedAt)}</p>
              <p>מודול נוכחי: {inv.currentModule || "—"}</p>
              <p>שלב נוכחי: {inv.lastStep || "—"}</p>
              <p>
                התקדמות: {inv.completedSteps || 0}/{inv.totalSteps || 0} — {inv.completionPercent || 0}%
              </p>
              <p>הושלם: {formatDate(inv.completedAt)}</p>
              <p>פעילות אחרונה: {formatDate(inv.lastActivityAt)}</p>
              {demoUrl ? (
                <p className="break-all text-left" dir="ltr">
                  קישור דמו: {demoUrl}
                </p>
              ) : (
                <p>קישור דמו: לא זמין</p>
              )}
            </div>

            <div className="mt-4">
              <AdminGuidedDemoActions
                invitation={inv}
                whatsAppApiAvailable={waOk}
                showUnavailableHint
                onChanged={() => void load()}
                onCreated={(created) => {
                  const nextId = invitationIdOf(created?.invitation);
                  if (nextId) navigate(`/admin/guided-demos/${nextId}`);
                  else void load();
                }}
              />
            </div>

            <h2 className="mt-8 text-lg font-black">ציר זמן</h2>
            <ol className="mt-3 space-y-2">
              {(inv.timeline || []).map((entry: any, index: number) => (
                <li key={`${entry.at}-${index}`} className="rounded-2xl bg-white p-3 text-sm font-bold shadow-sm">
                  <span className="text-slate-400">{formatDate(entry.at)}</span>
                  <span className="mr-2">{entry.message || entry.type}</span>
                </li>
              ))}
            </ol>
          </>
        )}
      </main>
    </div>
  );
}
