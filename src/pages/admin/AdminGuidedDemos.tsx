import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import AdminHeader from "./AdminsHeader";
import BizuplyLoader from "../../components/ui/BizuplyLoader";
import AdminSendGuidedDemoModal, {
  AdminSendDemoButton,
} from "./AdminSendGuidedDemoModal";
import {
  fetchGuidedDemoAnalytics,
  listGuidedDemos,
} from "../../api/guidedDemoApi";

const STATUS_LABEL: Record<string, string> = {
  created: "נוצר",
  sent: "נשלח",
  opened: "נפתח",
  in_progress: "התחיל",
  completed: "הושלם",
  expired: "פג תוקף",
  revoked: "בוטל",
  delivery_failed: "שגיאת שליחה",
};

const STATUS_TONE: Record<string, string> = {
  created: "bg-slate-50 text-slate-600 border-slate-200",
  sent: "bg-sky-50 text-sky-700 border-sky-200",
  opened: "bg-violet-50 text-violet-700 border-violet-200",
  in_progress: "bg-amber-50 text-amber-800 border-amber-200",
  completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
  expired: "bg-slate-100 text-slate-500 border-slate-200",
  revoked: "bg-rose-50 text-rose-700 border-rose-200",
  delivery_failed: "bg-rose-50 text-rose-700 border-rose-200",
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

export default function AdminGuidedDemos() {
  const navigate = useNavigate();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [q, setQ] = useState("");
  const [analytics, setAnalytics] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [list, stats] = await Promise.all([
        listGuidedDemos({ q, limit: 50 }),
        fetchGuidedDemoAnalytics().catch(() => null),
      ]);
      setItems(list.items || []);
      setAnalytics(stats?.analytics || null);
    } catch (err: any) {
      setError(err?.response?.data?.error || "טעינת הדמואים נכשלה");
    } finally {
      setLoading(false);
    }
  }, [q]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div className="min-h-screen bg-[#f5f6fb]" dir="rtl">
      <AdminHeader />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900">דמואים ללקוחות</h1>
            <p className="mt-1 text-sm font-semibold text-slate-500">
              שליחת קישור אישי לדמו אינטראקטיבי מבודד.
            </p>
          </div>
          <AdminSendDemoButton onClick={() => setModalOpen(true)} className="px-4 py-3 text-sm" />
        </div>

        {analytics ? (
          <div className="mb-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
            {[
              ["נשלחו", analytics.sent],
              ["נפתחו", analytics.opened],
              ["התחילו", analytics.started],
              ["סיימו", analytics.completed],
              ["Completion", `${analytics.completionRate || 0}%`],
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                <p className="text-xs font-bold text-slate-400">{label}</p>
                <p className="mt-1 text-2xl font-black text-slate-900">{value ?? 0}</p>
              </div>
            ))}
          </div>
        ) : null}

        <div className="mb-4 flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2">
          <Search className="h-4 w-4 text-slate-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="חיפוש לפי שם או טלפון"
            className="h-10 w-full bg-transparent text-sm font-bold outline-none"
          />
        </div>

        {error ? <p className="mb-3 text-sm font-bold text-rose-600">{error}</p> : null}

        {loading ? (
          <div className="grid place-items-center py-20">
            <BizuplyLoader />
          </div>
        ) : (
          <div className="overflow-hidden rounded-[24px] border border-slate-100 bg-white shadow-sm">
            <table className="w-full text-right text-sm">
              <thead className="bg-slate-50 text-xs font-black text-slate-500">
                <tr>
                  <th className="px-4 py-3">לקוח</th>
                  <th className="px-4 py-3">טלפון</th>
                  <th className="px-4 py-3">נשלח</th>
                  <th className="px-4 py-3">סוג דמו</th>
                  <th className="px-4 py-3">סטטוס</th>
                  <th className="px-4 py-3">התקדמות</th>
                  <th className="px-4 py-3">פעילות אחרונה</th>
                </tr>
              </thead>
              <tbody>
                {items.map((row) => (
                  <tr
                    key={row._id}
                    className="cursor-pointer border-t border-slate-100 hover:bg-violet-50/40"
                    onClick={() => navigate(`/admin/guided-demos/${row._id}`)}
                  >
                    <td className="px-4 py-3 font-black text-slate-800">{row.customerName}</td>
                    <td className="px-4 py-3 font-bold text-slate-600" dir="ltr">
                      {row.customerPhone}
                    </td>
                    <td className="px-4 py-3">{formatDate(row.createdAt)}</td>
                    <td className="px-4 py-3 text-xs font-bold text-slate-500">
                      {row.presetKey === "full"
                        ? `דמו מלא — ${(row.selectedModules || []).length} מודולים`
                        : (row.selectedModules || []).join(" · ") || row.presetKey}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full border px-2 py-0.5 text-[11px] font-black ${STATUS_TONE[row.status] || STATUS_TONE.created}`}>
                        {STATUS_LABEL[row.status] || row.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-bold">
                      {row.completedSteps || 0}/{row.totalSteps || 0} — {row.completionPercent || 0}%
                    </td>
                    <td className="px-4 py-3 text-slate-500">{formatDate(row.lastActivityAt)}</td>
                  </tr>
                ))}
                {!items.length ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-10 text-center font-bold text-slate-400">
                      עדיין לא נשלחו דמואים
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        )}
      </main>
      <AdminSendGuidedDemoModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          void load();
        }}
        context={{ sourceType: "manual" }}
      />
    </div>
  );
}
